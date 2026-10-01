/**
 * lib/aurora/assembler.ts — AURORA assembler (TypeScript port).
 *
 * Faithful port of `tools/aurora-asm` (Python 3, stdlib only) from the
 * aurora-vm project. Two passes, fully deterministic: the same source always
 * produces byte-identical output. The ISA authority remains `docs/ISA.md`;
 * this port is validated by byte-comparing its output against the reference
 * assembler on every example program.
 *
 * Differences from the Python original (mechanical only):
 * - numeric literals are BigInt (a DQ literal can exceed 2^53);
 * - errors are thrown as AsmError and rendered as "file:line:col: category: detail".
 */

import {
  MAGIC,
  BYTECODE_VERSION,
  HEADER_SIZE,
  MAX_CODE_DATA,
  MEM_TOP,
  CLS_N,
  CLS_R,
  CLS_I,
  CLS_r,
  CLS_M,
  CLS_J,
  UNUSED,
} from "./isa";

export class AsmError extends Error {
  line: number;
  col: number;
  category: string;
  detail: string;
  constructor(line: number, col: number, category: string, detail = "") {
    super(category);
    this.name = "AsmError";
    this.line = line;
    this.col = col;
    this.category = category;
    this.detail = detail;
  }
  render(filename: string): string {
    const loc = `${filename}:${this.line}:${this.col}`;
    return this.detail ? `${loc}: ${this.category}: ${this.detail}` : `${loc}: ${this.category}`;
  }
}

// ---------------------------------------------------------------------------
// Lexical helpers
// ---------------------------------------------------------------------------

const LABEL_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const LABEL_DEF_RE = /^([A-Za-z_][A-Za-z0-9_]*):/;
const NUMBER_RE = /^[+-]?(?:0[xX][0-9a-fA-F]+|0[bB][01]+|[0-9]+)$/;
const MNEMONIC_RE = /^[A-Za-z]+/;
const NUMERIC_SHAPE_RE = /^[+-]?[0-9a-zA-Z_]+$/;
const REG_SHAPE_RE = /^[Rr]([0-9]+)$/;

const I32_MIN = -(2n ** 31n);
const I32_MAX_U = 2n ** 32n - 1n;

/** Remove a ';' comment, honouring double-quoted string literals. */
function stripComment(text: string): string {
  let out = "";
  let inStr = false;
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (inStr) {
      out += c;
      if (c === "\\" && i + 1 < n) {
        out += text[i + 1];
        i += 2;
        continue;
      }
      if (c === '"') inStr = false;
    } else {
      if (c === '"') {
        inStr = true;
        out += c;
      } else if (c === ";") {
        break;
      } else {
        out += c;
      }
    }
    i += 1;
  }
  return out;
}

/**
 * Split an operand list on top-level commas.
 * Returns [operandText, 1-based col][] relative to the start of the line.
 * Commas inside [...] or "..." do not split.
 */
function splitOperands(text: string, lineno: number, baseCol: number): [string, number][] {
  const parts: [string, number][] = [];
  let depth = 0;
  let inStr = false;
  let cur = "";
  let start: number | null = null;
  let i = 0;
  const n = text.length;
  const isSpace = (c: string) => c === " " || c === "\t" || c === "\r" || c === "\n" || c === "\f" || c === "\v";
  while (i < n) {
    const c = text[i];
    const col = baseCol + i;
    if (inStr) {
      cur += c;
      if (c === "\\" && i + 1 < n) {
        cur += text[i + 1];
        i += 2;
        continue;
      }
      if (c === '"') inStr = false;
    } else if (c === '"') {
      inStr = true;
      if (start === null) start = col;
      cur += c;
    } else if (c === "[") {
      depth += 1;
      if (start === null) start = col;
      cur += c;
    } else if (c === "]") {
      depth -= 1;
      if (depth < 0) throw new AsmError(lineno, col, "syntax error", "unmatched ']'");
      cur += c;
    } else if (c === "," && depth === 0) {
      parts.push([cur, start !== null ? start : col]);
      cur = "";
      start = null;
    } else {
      if (start === null && !isSpace(c)) start = col;
      cur += c;
    }
    i += 1;
  }
  if (inStr) throw new AsmError(lineno, baseCol + n, "syntax error", "unterminated string literal");
  if (depth !== 0) throw new AsmError(lineno, baseCol + n, "syntax error", "unclosed '['");
  if (cur.trim() !== "") parts.push([cur, start !== null ? start : baseCol + n]);
  return parts.map(([p, c]) => [p.trim(), c] as [string, number]);
}

/** Parse a numeric literal. Returns the mathematical integer value (BigInt). */
function parseNumber(text: string, lineno: number, col: number): bigint {
  if (!NUMBER_RE.test(text)) throw new AsmError(lineno, col, "invalid numeric literal", `'${text}'`);
  const neg = text[0] === "-";
  const body = text[0] === "+" || text[0] === "-" ? text.slice(1) : text;
  let value: bigint;
  if (body.startsWith("0x") || body.startsWith("0X")) value = BigInt("0x" + body.slice(2));
  else if (body.startsWith("0b") || body.startsWith("0B")) value = BigInt("0b" + body.slice(2));
  else value = BigInt(body);
  return neg ? -value : value;
}

const ESCAPES: Record<string, number> = { n: 0x0a, t: 0x09, r: 0x0d, "0": 0x00, "\\": 0x5c, '"': 0x22 };

/** Parse a double-quoted string literal into bytes. Supports \n \t \r \0 \\ \" \xHH. */
function parseString(text: string, lineno: number, col: number): Uint8Array {
  if (text.length < 2 || !text.startsWith('"'))
    throw new AsmError(lineno, col, "invalid data operand", `expected string literal, got '${text}'`);
  const out: number[] = [];
  let i = 1;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (c === '"') {
      if (i !== n - 1) throw new AsmError(lineno, col, "syntax error", "unexpected characters after string literal");
      return Uint8Array.from(out);
    }
    if (c === "\\") {
      if (i + 1 >= n) throw new AsmError(lineno, col, "invalid data operand", "dangling backslash in string literal");
      const e = text[i + 1];
      if (e === "x") {
        const hexd = text.slice(i + 2, i + 4);
        if (hexd.length !== 2 || !/^[0-9a-fA-F]{2}$/.test(hexd))
          throw new AsmError(lineno, col, "invalid data operand", "bad \\x escape in string literal");
        out.push(parseInt(hexd, 16));
        i += 2;
      } else if (e in ESCAPES) {
        out.push(ESCAPES[e]);
      } else {
        throw new AsmError(lineno, col, "invalid data operand", `unknown escape '\\${e}' in string literal`);
      }
      i += 2;
      continue;
    }
    const o = text.codePointAt(i)!;
    if (o > 0x7e || (o < 0x20 && c !== "\t"))
      throw new AsmError(lineno, col, "invalid data operand", "non-printable character in string literal; use \\xHH escapes");
    out.push(o);
    i += 1;
  }
  throw new AsmError(lineno, col, "syntax error", "unterminated string literal");
}

// Operands: {kind:"reg",n} | {kind:"imm",v} | {kind:"label",name}
//         | {kind:"memreg",n} | {kind:"memabs",expr} | {kind:"str",bytes}
export type Operand =
  | { kind: "reg"; n: number }
  | { kind: "imm"; v: bigint }
  | { kind: "label"; name: string }
  | { kind: "memreg"; n: number }
  | { kind: "memabs"; expr: { kind: "imm"; v: bigint } | { kind: "label"; name: string } }
  | { kind: "str"; bytes: Uint8Array };

function parseOperand(text: string, col: number, lineno: number): Operand {
  const t = text.trim();
  if (!t) throw new AsmError(lineno, col, "syntax error", "empty operand");
  // Register: anything starting with R/r is register-shaped.
  if (t[0] === "R" || t[0] === "r") {
    const m = REG_SHAPE_RE.exec(t);
    if (m) {
      const num = parseInt(m[1], 10);
      if (num > 15) throw new AsmError(lineno, col, "invalid register", `'${t}'`);
      return { kind: "reg", n: num };
    }
    if (/\s/.test(t))
      throw new AsmError(lineno, col, "syntax error", `bad register operand '${t}' (missing comma?)`);
    throw new AsmError(lineno, col, "invalid register", `'${t}'`);
  }
  // Memory operand: [expr]
  if (t.startsWith("[")) {
    if (!t.endsWith("]")) throw new AsmError(lineno, col, "syntax error", "unclosed '['");
    const inner = t.slice(1, -1).trim();
    const innerCol = col + (inner ? t.indexOf(inner) : 1);
    if (!inner) throw new AsmError(lineno, col, "syntax error", "empty memory operand");
    if (inner[0] === "R" || inner[0] === "r") {
      const m = REG_SHAPE_RE.exec(inner);
      if (m) {
        const num = parseInt(m[1], 10);
        if (num > 15) throw new AsmError(lineno, innerCol, "invalid register", `'${inner}'`);
        return { kind: "memreg", n: num };
      }
      throw new AsmError(lineno, innerCol, "syntax error", `bad memory operand [${inner}]`);
    }
    if (NUMBER_RE.test(inner)) return { kind: "memabs", expr: { kind: "imm", v: parseNumber(inner, lineno, innerCol) } };
    if (LABEL_RE.test(inner)) return { kind: "memabs", expr: { kind: "label", name: inner } };
    throw new AsmError(lineno, innerCol, "syntax error", `bad memory operand '${inner}'`);
  }
  if (NUMBER_RE.test(t)) return { kind: "imm", v: parseNumber(t, lineno, col) };
  if (t.startsWith('"')) return { kind: "str", bytes: parseString(t, lineno, col) };
  if (LABEL_RE.test(t)) return { kind: "label", name: t };
  if (NUMERIC_SHAPE_RE.test(t)) throw new AsmError(lineno, col, "invalid numeric literal", `'${t}'`);
  throw new AsmError(lineno, col, "syntax error", `cannot parse operand '${t}'`);
}

// ---------------------------------------------------------------------------
// Pass 1: parse lines, collect labels, lay out code and data
// ---------------------------------------------------------------------------

const DIRECTIVES = new Set(["DB", "DW", "DD", "DQ"]);

type Item =
  | { kind: "instr"; lineno: number; col: number; mnemonic: string; word: string; operands: ParsedOp[] }
  | { kind: "data"; lineno: number; col: number; directive: string; operands: ParsedOp[] };

interface ParsedOp {
  op: Operand;
  text: string;
  col: number;
}

function parseSource(
  text: string
): { items: Item[]; codeLabels: Map<string, number>; dataLabels: Map<string, number>; codeSize: number } {
  const items: Item[] = [];
  const codeLabels = new Map<string, number>();
  const dataLabels = new Map<string, number>();
  const defined = new Map<string, [number, number]>();
  const pending: [string, number, number][] = [];

  const defineLabel = (name: string, lineno: number, col: number) => {
    if (defined.has(name)) {
      const prev = defined.get(name)!;
      throw new AsmError(lineno, col, "duplicate label", `'${name}' already defined at line ${prev[0]}`);
    }
    defined.set(name, [lineno, col]);
    pending.push([name, lineno, col]);
  };

  const flushPending = (section: "code" | "data", addr: number) => {
    const table = section === "code" ? codeLabels : dataLabels;
    for (const [name] of pending) table.set(name, addr);
    pending.length = 0;
  };

  const isSpace = (c: string) => c === " " || c === "\t" || c === "\r" || c === "\n" || c === "\f" || c === "\v";

  let pc = 0; // code offset in bytes
  let dc = 0; // data offset in bytes

  const lines = text.split("\n");
  for (let lineno = 1; lineno <= lines.length; lineno++) {
    const raw = lines[lineno - 1].replace(/\r$/, "");
    const line = stripComment(raw).replace(/\s+$/, "");
    if (line.trim() === "") continue;
    const stripped = line.replace(/^\s+/, "");
    const base = line.length - stripped.length; // 0-based indent
    const col0 = base + 1; // 1-based column of first token

    // Optional label definition at the start of the line.
    let rest = stripped;
    let restCol = col0;
    const m = LABEL_DEF_RE.exec(stripped);
    if (m && (stripped.length === m[0].length || isSpace(stripped[m[0].length]))) {
      const name = m[1];
      defineLabel(name, lineno, col0);
      const afterLabel = stripped.slice(m[0].length);
      rest = afterLabel.replace(/^\s+/, "");
      // 1-based column of the first non-space char after the label
      restCol = col0 + m[0].length + (afterLabel.length - rest.length);
      if (!rest) continue;
    }

    // Label-shaped but invalid name ("1bad:", "my-label:").
    const lm = /^([^:\s]+):/.exec(rest);
    if (lm && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(lm[1]))
      throw new AsmError(lineno, restCol, "invalid label", `'${lm[1]}'`);

    // Mnemonic or directive.
    if (rest.startsWith(".")) {
      const d = rest.split(/\s+/)[0];
      throw new AsmError(lineno, restCol, "invalid directive", `'${d}'`);
    }
    const mm = MNEMONIC_RE.exec(rest);
    if (!mm) throw new AsmError(lineno, restCol, "syntax error", `expected instruction, got '${rest}'`);
    const word = mm[0];
    const upper = word.toUpperCase();
    const after = rest.slice(mm[0].length);
    if (after && !isSpace(after[0]))
      throw new AsmError(lineno, restCol, "syntax error", `unexpected '${after.trim()}' after '${word}'`);
    const operandText = after.trim();
    // 1-based column of the first non-space char after the mnemonic
    const opCol = restCol + mm[0].length + (after.length - after.replace(/^\s+/, "").length);

    if (DIRECTIVES.has(upper)) {
      flushPending("data", dc);
      if (!operandText) throw new AsmError(lineno, opCol, "missing operand", `expected data items after ${upper}`);
      const operands: ParsedOp[] = [];
      for (const [opText, opC] of splitOperands(operandText, lineno, opCol))
        operands.push({ op: parseOperand(opText, opC, lineno), text: opText, col: opC });
      items.push({ kind: "data", lineno, col: restCol, directive: upper, operands });
      dc += dataSizeOf(upper, operands);
    } else {
      flushPending("code", pc);
      const operands: ParsedOp[] = [];
      if (operandText) {
        for (const [opText, opC] of splitOperands(operandText, lineno, opCol))
          operands.push({ op: parseOperand(opText, opC, lineno), text: opText, col: opC });
      }
      items.push({ kind: "instr", lineno, col: restCol, mnemonic: upper, word, operands });
      pc += 8;
    }
  }

  // Labels dangling at end of file point at the end of the code section.
  flushPending("code", pc);
  return { items, codeLabels, dataLabels, codeSize: pc };
}

function dataSizeOf(directive: string, operands: ParsedOp[]): number {
  if (directive === "DB") {
    let total = 0;
    for (const { op } of operands) total += op.kind === "str" ? op.bytes.length : 1;
    return total;
  }
  const width = { DW: 2, DD: 4, DQ: 8 }[directive]!;
  return width * operands.length;
}

// ---------------------------------------------------------------------------
// Pass 2: encode instructions (ISA §6)
// ---------------------------------------------------------------------------

function asReg(op: Operand, lineno: number, col: number, what: string): number {
  if (op.kind !== "reg") throw new AsmError(lineno, col, "invalid operand", `expected register for ${what}`);
  return op.n;
}

function asImm(op: Operand, lineno: number, col: number, what: string): bigint {
  if (op.kind !== "imm") throw new AsmError(lineno, col, "invalid operand", `expected numeric immediate for ${what}`);
  return op.v;
}

/**
 * Class-I immediates accept any 32-bit pattern. The literal's mathematical
 * value must fit in [-2^31, 2^32-1]; it is encoded as the low 32 bits.
 */
function checkI32(value: bigint, lineno: number, col: number): bigint {
  if (value < I32_MIN || value > I32_MAX_U)
    throw new AsmError(lineno, col, "immediate out of range", `${value} does not fit in 32 bits`);
  return value & 0xffffffffn;
}

class Ctx {
  constructor(
    public codeLabels: Map<string, number>,
    public dataLabels: Map<string, number>,
    public codeSize: number
  ) {}
  /** Absolute virtual address of a code or data label. */
  dataAddr(name: string, lineno: number, col: number): bigint {
    if (this.codeLabels.has(name)) return BigInt(this.codeLabels.get(name)!);
    if (this.dataLabels.has(name)) return BigInt(this.codeSize + this.dataLabels.get(name)!);
    throw new AsmError(lineno, col, "undefined label", `'${name}'`);
  }
  /** Code-relative offset of a code label (jumps/CALL only). */
  codeAddr(name: string, lineno: number, col: number): number {
    if (this.dataLabels.has(name))
      throw new AsmError(lineno, col, "jump to data label", `'${name}' is a data label`);
    if (this.codeLabels.has(name)) return this.codeLabels.get(name)!;
    throw new AsmError(lineno, col, "undefined label", `'${name}'`);
  }
  /** Absolute address for class-M [a32]; loader rule enforced at assembly time. */
  absMemAddr(expr: { kind: "imm"; v: bigint } | { kind: "label"; name: string }, lineno: number, col: number): bigint {
    const addr = expr.kind === "imm" ? expr.v : this.dataAddr(expr.name, lineno, col);
    if (addr < 0n || addr > BigInt(MEM_TOP - 8))
      throw new AsmError(
        lineno,
        col,
        "address out of range",
        `0x${addr.toString(16).toUpperCase()} is not a valid 64-bit access address (loader requires addr <= 0x10000 - 8)`
      );
    return addr;
  }
  jumpTarget(op: Operand, opText: string, opCol: number, lineno: number): number {
    let addr: bigint;
    if (op.kind === "label") addr = BigInt(this.codeAddr(op.name, lineno, opCol));
    else if (op.kind === "imm") addr = op.v;
    else throw new AsmError(lineno, opCol, "invalid operand", `expected code label or address, got '${opText}'`);
    if (addr < 0n || addr >= BigInt(this.codeSize) || addr % 8n !== 0n)
      throw new AsmError(
        lineno,
        opCol,
        "invalid jump target",
        `0x${addr.toString(16).toUpperCase()} is not an instruction boundary inside the code section`
      );
    return Number(addr);
  }
}

function expectCount(ops: ParsedOp[], want: number, lineno: number, col: number, mnemonic: string): void {
  if (ops.length < want)
    throw new AsmError(lineno, col, "missing operand", `${mnemonic} expects ${want} operand(s)`);
  if (ops.length > want) {
    const extra = ops[want];
    throw new AsmError(lineno, extra.col, "unexpected operand", `${mnemonic} expects ${want} operand(s), got '${extra.text}'`);
  }
}

interface Encoded {
  opcode: number;
  cls: number;
  dst: number;
  src: number;
  imm: bigint; // low 32 bits
}

function encodeInstr(mnemonic: string, word: string, ops: ParsedOp[], lineno: number, col: number, ctx: Ctx): Encoded {
  // -- N class: no operands --
  if (mnemonic === "NOP" || mnemonic === "HALT" || mnemonic === "RET") {
    expectCount(ops, 0, lineno, col, word);
    const opcode = mnemonic === "NOP" ? 0x00 : mnemonic === "HALT" ? 0x01 : 0x20;
    return { opcode, cls: CLS_N, dst: UNUSED, src: UNUSED, imm: 0n };
  }

  // -- r class, register in dst --
  if (mnemonic === "INC" || mnemonic === "DEC" || mnemonic === "NOT" || mnemonic === "POP" || mnemonic === "IN") {
    expectCount(ops, 1, lineno, col, word);
    const rd = asReg(ops[0].op, lineno, ops[0].col, word);
    const opcode = { INC: 0x0c, DEC: 0x0d, NOT: 0x14, POP: 0x1e, IN: 0x2a }[mnemonic]!;
    return { opcode, cls: CLS_r, dst: rd, src: UNUSED, imm: 0n };
  }

  // -- r class, register in src --
  if (mnemonic === "PUSH" || mnemonic === "OUT" || mnemonic === "OUTC") {
    expectCount(ops, 1, lineno, col, word);
    const rs = asReg(ops[0].op, lineno, ops[0].col, word);
    const opcode = { PUSH: 0x1d, OUT: 0x28, OUTC: 0x29 }[mnemonic]!;
    return { opcode, cls: CLS_r, dst: UNUSED, src: rs, imm: 0n };
  }

  // -- MOV --
  if (mnemonic === "MOV") {
    expectCount(ops, 2, lineno, col, word);
    const rd = asReg(ops[0].op, lineno, ops[0].col, "MOV destination");
    const s = ops[1];
    if (s.op.kind === "reg") return { opcode: 0x02, cls: CLS_R, dst: rd, src: s.op.n, imm: 0n };
    if (s.op.kind === "imm")
      return { opcode: 0x03, cls: CLS_I, dst: rd, src: UNUSED, imm: checkI32(s.op.v, lineno, s.col) };
    if (s.op.kind === "label") {
      const addr = ctx.dataAddr(s.op.name, lineno, s.col);
      return { opcode: 0x03, cls: CLS_I, dst: rd, src: UNUSED, imm: checkI32(addr, lineno, s.col) };
    }
    throw new AsmError(lineno, s.col, "invalid operand", `MOV expects a register, immediate or label, got '${s.text}'`);
  }

  // -- ALU R/RI + CMP --
  const alu: Record<string, [number, number]> = {
    ADD: [0x04, 0x05],
    SUB: [0x06, 0x07],
    MUL: [0x08, 0x09],
    DIV: [0x0a, 0x0b],
    AND: [0x0e, 0x0f],
    OR: [0x10, 0x11],
    XOR: [0x12, 0x13],
    CMP: [0x15, 0x16],
  };
  if (mnemonic in alu) {
    expectCount(ops, 2, lineno, col, word);
    const rd = asReg(ops[0].op, lineno, ops[0].col, `${word} destination`);
    const s = ops[1];
    const [opR, opI] = alu[mnemonic];
    if (s.op.kind === "reg") return { opcode: opR, cls: CLS_R, dst: rd, src: s.op.n, imm: 0n };
    if (s.op.kind === "imm")
      return { opcode: opI, cls: CLS_I, dst: rd, src: UNUSED, imm: checkI32(s.op.v, lineno, s.col) };
    throw new AsmError(lineno, s.col, "invalid operand", `${word} expects a register or numeric immediate, got '${s.text}'`);
  }

  // -- Memory --
  if (mnemonic === "LOAD") {
    expectCount(ops, 2, lineno, col, word);
    const rd = asReg(ops[0].op, lineno, ops[0].col, "LOAD destination");
    const mem = ops[1];
    if (mem.op.kind === "memreg") return { opcode: 0x18, cls: CLS_R, dst: rd, src: mem.op.n, imm: 0n };
    if (mem.op.kind === "memabs")
      return { opcode: 0x17, cls: CLS_M, dst: rd, src: UNUSED, imm: ctx.absMemAddr(mem.op.expr, lineno, mem.col) };
    throw new AsmError(lineno, mem.col, "invalid operand", `LOAD expects [address] or [register], got '${mem.text}'`);
  }
  if (mnemonic === "STORE") {
    expectCount(ops, 2, lineno, col, word);
    const mem = ops[0];
    const rs = asReg(ops[1].op, lineno, ops[1].col, "STORE source");
    if (mem.op.kind === "memreg") return { opcode: 0x1a, cls: CLS_R, dst: mem.op.n, src: rs, imm: 0n };
    if (mem.op.kind === "memabs")
      return { opcode: 0x19, cls: CLS_M, dst: UNUSED, src: rs, imm: ctx.absMemAddr(mem.op.expr, lineno, mem.col) };
    throw new AsmError(lineno, mem.col, "invalid operand", `STORE expects [address] or [register], got '${mem.text}'`);
  }
  if (mnemonic === "LOADB") {
    expectCount(ops, 2, lineno, col, word);
    const rd = asReg(ops[0].op, lineno, ops[0].col, "LOADB destination");
    const mem = ops[1];
    if (mem.op.kind !== "memreg")
      throw new AsmError(lineno, mem.col, "invalid operand", `LOADB expects [register], got '${mem.text}'`);
    return { opcode: 0x1b, cls: CLS_R, dst: rd, src: mem.op.n, imm: 0n };
  }
  if (mnemonic === "STOREB") {
    expectCount(ops, 2, lineno, col, word);
    const mem = ops[0];
    const rs = asReg(ops[1].op, lineno, ops[1].col, "STOREB source");
    if (mem.op.kind !== "memreg")
      throw new AsmError(lineno, mem.col, "invalid operand", `STOREB expects [register], got '${mem.text}'`);
    return { opcode: 0x1c, cls: CLS_R, dst: mem.op.n, src: rs, imm: 0n };
  }

  // -- J class --
  const jumps: Record<string, number> = {
    CALL: 0x1f,
    JMP: 0x21,
    JE: 0x22,
    JNE: 0x23,
    JG: 0x24,
    JL: 0x25,
    JGE: 0x26,
    JLE: 0x27,
  };
  if (mnemonic in jumps) {
    expectCount(ops, 1, lineno, col, word);
    const s = ops[0];
    return { opcode: jumps[mnemonic], cls: CLS_J, dst: UNUSED, src: UNUSED, imm: BigInt(ctx.jumpTarget(s.op, s.text, s.col, lineno)) };
  }

  throw new AsmError(lineno, col, "unknown mnemonic", `'${word}'`);
}

function encodeData(directive: string, operands: ParsedOp[], lineno: number): number[] {
  const out: number[] = [];
  for (const { op, text, col } of operands) {
    if (directive === "DB") {
      if (op.kind === "str") {
        for (const b of op.bytes) out.push(b);
      } else if (op.kind === "imm") {
        const v = op.v;
        if (v < -128n || v > 255n)
          throw new AsmError(lineno, col, "immediate out of range", `${v} does not fit in a byte`);
        out.push(Number(v & 0xffn));
      } else {
        throw new AsmError(lineno, col, "invalid data operand", `DB expects numbers or string literals, got '${text}'`);
      }
      continue;
    }
    // DW / DD / DQ: numbers only.
    if (op.kind !== "imm")
      throw new AsmError(lineno, col, "invalid data operand", `${directive} expects numbers, got '${text}'`);
    const spec = { DW: [2, -(2n ** 15n), 2n ** 16n - 1n], DD: [4, -(2n ** 31n), 2n ** 32n - 1n], DQ: [8, -(2n ** 63n), 2n ** 64n - 1n] }[
      directive
    ]!;
    const [width, lo, hi] = spec as [number, bigint, bigint];
    const v = op.v;
    if (v < lo || v > hi)
      throw new AsmError(lineno, col, "immediate out of range", `${v} does not fit in ${width * 8} bits`);
    const mask = (1n << BigInt(width * 8)) - 1n;
    const uv = v & mask;
    for (let i = 0; i < width; i++) out.push(Number((uv >> BigInt(i * 8)) & 0xffn));
  }
  return out;
}

function u16le(v: number): number[] {
  return [v & 0xff, (v >> 8) & 0xff];
}

function u32le(v: number): number[] {
  return [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff];
}

/**
 * Assemble source text. Returns the complete v1 bytecode file bytes.
 * Throws AsmError on any assembly error.
 */
export function assembleSource(filename: string, text: string): Uint8Array {
  const { items, codeLabels, dataLabels, codeSize } = parseSource(text);

  const codeItems = items.filter((it) => it.kind === "instr");
  if (codeItems.length === 0) throw new AsmError(1, 1, "empty program", "no instructions to assemble");

  const ctx = new Ctx(codeLabels, dataLabels, codeSize);
  const code: number[] = [];
  for (const it of codeItems) {
    if (it.kind !== "instr") continue;
    const e = encodeInstr(it.mnemonic, it.word, it.operands, it.lineno, it.col, ctx);
    code.push(e.opcode, e.dst, e.src, e.cls);
    const imm = e.imm & 0xffffffffn;
    code.push(Number(imm & 0xffn), Number((imm >> 8n) & 0xffn), Number((imm >> 16n) & 0xffn), Number((imm >> 24n) & 0xffn));
  }

  const data: number[] = [];
  for (const it of items) {
    if (it.kind !== "data") continue;
    data.push(...encodeData(it.directive, it.operands, it.lineno));
  }

  if (code.length + data.length > MAX_CODE_DATA)
    throw new AsmError(
      1,
      1,
      "program too large",
      `code+data is 0x${(code.length + data.length).toString(16).toUpperCase()} bytes, limit is 0x${MAX_CODE_DATA.toString(16).toUpperCase()}`
    );

  const header: number[] = [
    ...MAGIC,
    ...u16le(BYTECODE_VERSION),
    ...u32le(code.length),
    ...u32le(0), // entry: first instruction
    ...u32le(data.length),
    ...u32le(0), // reserved
  ];
  if (header.length !== HEADER_SIZE) throw new Error("internal error: bad header size");
  return Uint8Array.from([...header, ...code, ...data]);
}
