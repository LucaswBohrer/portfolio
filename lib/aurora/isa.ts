/**
 * lib/aurora/isa.ts — AURORA VM instruction set definition (TypeScript port).
 *
 * Independent implementation of the frozen ISA v1.0 / bytecode v1, transcribed
 * from `docs/ISA.md` (normative). The ISA document is written precisely so an
 * independent developer can implement a compatible VM without reading the
 * reference implementation — this file is that exercise.
 *
 * 43 opcodes (0x00–0x2A), 8-byte fixed-width instructions:
 *   byte 0: opcode · byte 1: dst · byte 2: src · byte 3: class · bytes 4-7: imm32 LE
 */

export const MAGIC = [0x41, 0x55, 0x52, 0x4f, 0x52, 0x41, 0x01, 0x00] as const;
export const BYTECODE_VERSION = 0x0001;
export const HEADER_SIZE = 0x1a;
export const MAX_CODE_DATA = 0xf000; // code_size + data_size must stay below the stack
export const MEM_TOP = 0x10000; // 64 KiB
export const STACK_BASE = 0xf000;

// Instruction classes (ISA §4)
export const CLS_N = 0x00; // no operands
export const CLS_R = 0x01; // dst register + src register
export const CLS_I = 0x02; // dst register + imm32
export const CLS_r = 0x03; // single register
export const CLS_M = 0x04; // register + absolute address
export const CLS_J = 0x05; // absolute code address

export const UNUSED = 0xff;

// Fatal error ids 1–12 → exit code 100+id (src/errids.inc)
export const ERROR_NAMES = [
  "",
  "INVALID_OPCODE",
  "INVALID_REGISTER",
  "INVALID_MEMORY_ACCESS",
  "STACK_OVERFLOW",
  "STACK_UNDERFLOW",
  "DIVISION_BY_ZERO",
  "INVALID_PC",
  "INVALID_PROGRAM",
  "INVALID_INSTRUCTION",
  "MAX_STEPS_EXCEEDED",
  "WRITE_TO_CODE",
  "IO_ERROR",
] as const;

export type ImmKind = "none" | "i32" | "addr" | "target";

export interface OpcodeInfo {
  op: number;
  mnemonic: string;
  cls: number;
  /** "reg" = register operand, "unused" = must be 0xFF */
  dst: "reg" | "unused";
  src: "reg" | "unused";
  imm: ImmKind;
}

const R = "reg" as const;
const U = "unused" as const;

// Transcription of ISA §6. Field placement follows the ISA tables, including
// the class-r subtlety: INC/DEC/NOT/POP/IN carry the register in dst,
// PUSH/OUT/OUTC carry it in src.
export const OPCODES: OpcodeInfo[] = [
  { op: 0x00, mnemonic: "NOP", cls: CLS_N, dst: U, src: U, imm: "none" },
  { op: 0x01, mnemonic: "HALT", cls: CLS_N, dst: U, src: U, imm: "none" },
  { op: 0x02, mnemonic: "MOV", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x03, mnemonic: "MOV", cls: CLS_I, dst: R, src: U, imm: "i32" },
  { op: 0x04, mnemonic: "ADD", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x05, mnemonic: "ADD", cls: CLS_I, dst: R, src: U, imm: "i32" },
  { op: 0x06, mnemonic: "SUB", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x07, mnemonic: "SUB", cls: CLS_I, dst: R, src: U, imm: "i32" },
  { op: 0x08, mnemonic: "MUL", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x09, mnemonic: "MUL", cls: CLS_I, dst: R, src: U, imm: "i32" },
  { op: 0x0a, mnemonic: "DIV", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x0b, mnemonic: "DIV", cls: CLS_I, dst: R, src: U, imm: "i32" },
  { op: 0x0c, mnemonic: "INC", cls: CLS_r, dst: R, src: U, imm: "none" },
  { op: 0x0d, mnemonic: "DEC", cls: CLS_r, dst: R, src: U, imm: "none" },
  { op: 0x0e, mnemonic: "AND", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x0f, mnemonic: "AND", cls: CLS_I, dst: R, src: U, imm: "i32" },
  { op: 0x10, mnemonic: "OR", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x11, mnemonic: "OR", cls: CLS_I, dst: R, src: U, imm: "i32" },
  { op: 0x12, mnemonic: "XOR", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x13, mnemonic: "XOR", cls: CLS_I, dst: R, src: U, imm: "i32" },
  { op: 0x14, mnemonic: "NOT", cls: CLS_r, dst: R, src: U, imm: "none" },
  { op: 0x15, mnemonic: "CMP", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x16, mnemonic: "CMP", cls: CLS_I, dst: R, src: U, imm: "i32" },
  { op: 0x17, mnemonic: "LOAD", cls: CLS_M, dst: R, src: U, imm: "addr" },
  { op: 0x18, mnemonic: "LOAD", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x19, mnemonic: "STORE", cls: CLS_M, dst: U, src: R, imm: "addr" },
  { op: 0x1a, mnemonic: "STORE", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x1b, mnemonic: "LOADB", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x1c, mnemonic: "STOREB", cls: CLS_R, dst: R, src: R, imm: "none" },
  { op: 0x1d, mnemonic: "PUSH", cls: CLS_r, dst: U, src: R, imm: "none" },
  { op: 0x1e, mnemonic: "POP", cls: CLS_r, dst: R, src: U, imm: "none" },
  { op: 0x1f, mnemonic: "CALL", cls: CLS_J, dst: U, src: U, imm: "target" },
  { op: 0x20, mnemonic: "RET", cls: CLS_N, dst: U, src: U, imm: "none" },
  { op: 0x21, mnemonic: "JMP", cls: CLS_J, dst: U, src: U, imm: "target" },
  { op: 0x22, mnemonic: "JE", cls: CLS_J, dst: U, src: U, imm: "target" },
  { op: 0x23, mnemonic: "JNE", cls: CLS_J, dst: U, src: U, imm: "target" },
  { op: 0x24, mnemonic: "JG", cls: CLS_J, dst: U, src: U, imm: "target" },
  { op: 0x25, mnemonic: "JL", cls: CLS_J, dst: U, src: U, imm: "target" },
  { op: 0x26, mnemonic: "JGE", cls: CLS_J, dst: U, src: U, imm: "target" },
  { op: 0x27, mnemonic: "JLE", cls: CLS_J, dst: U, src: U, imm: "target" },
  { op: 0x28, mnemonic: "OUT", cls: CLS_r, dst: U, src: R, imm: "none" },
  { op: 0x29, mnemonic: "OUTC", cls: CLS_r, dst: U, src: R, imm: "none" },
  { op: 0x2a, mnemonic: "IN", cls: CLS_r, dst: R, src: U, imm: "none" },
];

export const OPCODE_BY_NUM: (OpcodeInfo | undefined)[] = (() => {
  const t: (OpcodeInfo | undefined)[] = new Array(0x2b).fill(undefined);
  for (const info of OPCODES) t[info.op] = info;
  return t;
})();

function regName(n: number): string {
  return `R${n}`;
}

function hex(n: number): string {
  return `0x${n.toString(16)}`;
}

/** Sign-extend a u32 imm32 to a signed 32-bit number. */
function sext32(u: number): number {
  return u >= 0x80000000 ? u - 0x100000000 : u;
}

/**
 * Disassemble one 8-byte instruction at code-relative `offset`.
 * Returns a human-readable line like "MOV R0, 20" or "JMP 0x10".
 * Unknown opcodes render as "DB 0x??".
 */
export function disassemble(code: Uint8Array, offset: number): string {
  const op = code[offset];
  const info = op <= 0x2a ? OPCODE_BY_NUM[op] : undefined;
  if (!info) return `DB ${hex(op)}`;
  const dst = code[offset + 1];
  const src = code[offset + 2];
  const imm =
    code[offset + 4] |
    (code[offset + 5] << 8) |
    (code[offset + 6] << 16) |
    (code[offset + 7] << 24);
  const immU = imm >>> 0;
  switch (info.cls) {
    case CLS_N:
      return info.mnemonic;
    case CLS_R: {
      const d = info.dst === "reg" ? regName(dst) : null;
      const s = info.src === "reg" ? regName(src) : null;
      if (info.mnemonic === "LOAD" || info.mnemonic === "LOADB")
        return `${info.mnemonic} ${d}, [${s}]`;
      if (info.mnemonic === "STORE" || info.mnemonic === "STOREB")
        return `${info.mnemonic} [${d}], ${s}`;
      return `${info.mnemonic} ${d}, ${s}`;
    }
    case CLS_I:
      return `${info.mnemonic} ${regName(dst)}, ${sext32(immU)}`;
    case CLS_r: {
      const r = info.dst === "reg" ? regName(dst) : regName(src);
      return `${info.mnemonic} ${r}`;
    }
    case CLS_M: {
      const d = regName(dst);
      const s = regName(src);
      return info.mnemonic === "LOAD"
        ? `LOAD ${d}, [${hex(immU)}]`
        : `STORE [${hex(immU)}], ${s}`;
    }
    case CLS_J:
      return `${info.mnemonic} ${hex(immU)}`;
    default:
      return `DB ${hex(op)}`;
  }
}
