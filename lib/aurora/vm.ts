/**
 * lib/aurora/vm.ts — AURORA VM interpreter (TypeScript port).
 *
 * Independent implementation of ISA v1.0 + bytecode v1, transcribed from
 * `docs/ISA.md` and `docs/BYTECODE.md` (both normative and frozen). 64-bit
 * arithmetic uses BigInt, which is exact — no float rounding anywhere.
 *
 * Termination model (ISA §6.1.1): every execution ends NORMAL (HALT,
 * exit = R0 & 0xFF) or FATAL (error 1–12, exit = 100+id). The two are
 * distinguished by termination class, never by the exit code alone.
 */

import {
  MAGIC,
  BYTECODE_VERSION,
  HEADER_SIZE,
  MAX_CODE_DATA,
  MEM_TOP,
  STACK_BASE,
  ERROR_NAMES,
  OPCODE_BY_NUM,
  CLS_N,
  CLS_R,
  CLS_I,
  CLS_r,
  CLS_M,
  CLS_J,
  UNUSED,
} from "./isa";

const MASK64 = (1n << 64n) - 1n;
const SIGN_BIT = 1n << 63n;
const I64_MIN = -(1n << 63n);

export class VmError extends Error {
  id: number; // 1..12
  errorName: string;
  detail: string;
  constructor(id: number, detail = "") {
    const name = ERROR_NAMES[id] ?? "UNKNOWN";
    super(detail ? `aurora: error: ${name}: ${detail}` : `aurora: error: ${name}`);
    this.name = "VmError";
    this.id = id;
    this.errorName = name;
    this.detail = detail;
  }
  get exitCode(): number {
    return 100 + this.id;
  }
}

export interface Vm {
  r: bigint[]; // R0–R15
  pc: number; // byte offset from code base (always 8-aligned while running)
  sp: number; // byte address of top of stack
  fp: number; // byte address of current frame base
  flags: bigint; // bits 3-0: Z C N V
  mem: Uint8Array; // 64 KiB
  view: DataView;
  codeSize: number;
  steps: number;
  maxSteps: number; // 0 = unlimited (matches CLI --max-steps semantics)
  out: number[]; // stdout bytes
  stdin: Uint8Array;
  stdinPos: number;
}

export type StepOutcome =
  | { status: "running" }
  | { status: "halted"; exitCode: number }
  | { status: "fatal"; error: VmError };

function newVm(): Vm {
  return {
    r: new Array(16).fill(0n),
    pc: 0,
    sp: MEM_TOP,
    fp: MEM_TOP,
    flags: 0n,
    mem: new Uint8Array(MEM_TOP),
    view: null as unknown as DataView,
    codeSize: 0,
    steps: 0,
    maxSteps: 100_000_000, // CLI default
    out: [],
    stdin: new Uint8Array(0),
    stdinPos: 0,
  };
}

// ---------------------------------------------------------------------------
// Loader (BYTECODE.md §4 — checks in normative order)
// ---------------------------------------------------------------------------

function u16le(b: Uint8Array, off: number): number {
  return b[off] | (b[off + 1] << 8);
}
function u32le(b: Uint8Array, off: number): number {
  return (b[off] | (b[off + 1] << 8) | (b[off + 2] << 16) | (b[off + 3] << 24)) >>> 0;
}

function invalidInstruction(offset: number, why: string): VmError {
  return new VmError(9, `invalid instruction at code offset 0x${offset.toString(16)}: ${why}`);
}

/**
 * Load a v1 bytecode file into a fresh VM. Throws VmError(8/9) on any
 * loader violation, in the normative check order.
 */
export function loadProgram(bytes: Uint8Array, opts?: { maxSteps?: number; stdin?: Uint8Array }): Vm {
  // 1. header present
  if (bytes.length < HEADER_SIZE) throw new VmError(8, "truncated header");
  // 2. magic
  for (let i = 0; i < 8; i++) if (bytes[i] !== MAGIC[i]) throw new VmError(8, "bad magic");
  // 3. version
  if (u16le(bytes, 8) !== BYTECODE_VERSION) throw new VmError(8, "unsupported version");
  // 4. reserved
  if (u32le(bytes, 0x16) !== 0) throw new VmError(8, "reserved field nonzero");
  const codeSize = u32le(bytes, 0x0a);
  const entry = u32le(bytes, 0x0e);
  const dataSize = u32le(bytes, 0x12);
  // 5. code size sane
  if (codeSize === 0 || codeSize % 8 !== 0) throw new VmError(8, "invalid code size");
  // 6. exact file size
  if (bytes.length !== HEADER_SIZE + codeSize + dataSize)
    throw new VmError(8, bytes.length < HEADER_SIZE + codeSize + dataSize ? "truncated program" : "trailing data");
  // 7. entry point
  if (entry >= codeSize || entry % 8 !== 0) throw new VmError(8, "invalid entry point");
  // 8. memory layout
  if (codeSize + dataSize > MAX_CODE_DATA) throw new VmError(8, "invalid memory layout");
  // 9. per-slot validation
  const code = bytes.subarray(HEADER_SIZE, HEADER_SIZE + codeSize);
  for (let off = 0; off < codeSize; off += 8) {
    const op = code[off];
    const info = op <= 0x2a ? OPCODE_BY_NUM[op] : undefined;
    if (!info) throw invalidInstruction(off, `unknown opcode 0x${op.toString(16)}`);
    const dst = code[off + 1];
    const src = code[off + 2];
    const cls = code[off + 3];
    const imm = u32le(code, off + 4);
    if (cls !== info.cls) throw invalidInstruction(off, `class mismatch (opcode requires ${info.cls})`);
    const regOk = (v: number, want: "reg" | "unused") =>
      want === "reg" ? v <= 0x0f : v === UNUSED;
    if (!regOk(dst, info.dst)) throw invalidInstruction(off, "bad dst register field");
    if (!regOk(src, info.src)) throw invalidInstruction(off, "bad src register field");
    if (info.cls === CLS_N || info.cls === CLS_R || info.cls === CLS_r) {
      if (imm !== 0) throw invalidInstruction(off, "imm32 must be 0");
    } else if (info.cls === CLS_J) {
      if (imm >= codeSize || imm % 8 !== 0) throw invalidInstruction(off, "invalid jump target");
    } else if (info.cls === CLS_M) {
      if (imm > MEM_TOP - 8) throw invalidInstruction(off, "address out of range");
    }
    // CLS_I accepts any 32-bit pattern.
  }

  const vm = newVm();
  vm.view = new DataView(vm.mem.buffer);
  vm.codeSize = codeSize;
  vm.pc = entry;
  vm.mem.set(code, 0);
  if (dataSize > 0) vm.mem.set(bytes.subarray(HEADER_SIZE + codeSize), codeSize);
  if (opts?.maxSteps !== undefined) vm.maxSteps = opts.maxSteps;
  if (opts?.stdin) vm.stdin = opts.stdin;
  return vm;
}

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

function checkReg(n: number): number {
  if (n > 0x0f) throw new VmError(2, `bad register encoding 0x${n.toString(16)}`);
  return n;
}

/** Wraparound-safe bounds check (ISA §5): addr > 0x10000 - size is fatal. */
function checkBounds(addr: bigint, size: number): void {
  if (addr > BigInt(MEM_TOP - size))
    throw new VmError(3, `address 0x${addr.toString(16)} out of bounds`);
}

function memRead64(vm: Vm, addr: bigint): bigint {
  checkBounds(addr, 8);
  return vm.view.getBigUint64(Number(addr), true);
}

function memWrite64(vm: Vm, addr: bigint, v: bigint): void {
  checkBounds(addr, 8);
  if (addr < BigInt(vm.codeSize)) throw new VmError(11, "write to code segment");
  vm.view.setBigUint64(Number(addr), v & MASK64, true);
}

function memRead8(vm: Vm, addr: bigint): number {
  checkBounds(addr, 1);
  return vm.mem[Number(addr)];
}

function memWrite8(vm: Vm, addr: bigint, v: number): void {
  checkBounds(addr, 1);
  if (addr < BigInt(vm.codeSize)) throw new VmError(11, "write to code segment");
  vm.mem[Number(addr)] = v & 0xff;
}

function push(vm: Vm, v: bigint): void {
  // Bound checked BEFORE sp is modified (ISA §6.7).
  if (vm.sp < STACK_BASE + 8) throw new VmError(4, "stack overflow");
  vm.sp -= 8;
  memWrite64(vm, BigInt(vm.sp), v);
}

function pop(vm: Vm): bigint {
  if (vm.sp >= MEM_TOP) throw new VmError(5, "stack underflow");
  const v = memRead64(vm, BigInt(vm.sp));
  vm.sp += 8;
  return v;
}

// --- flag helpers (ISA §3.1) ---

function flagsZN(vm: Vm, r: bigint, c: bigint, v: bigint): void {
  vm.flags = (r === 0n ? 1n : 0n) | (c << 1n) | ((r >> 63n) << 2n) | (v << 3n);
}

function flagsAdd(vm: Vm, a: bigint, b: bigint, r: bigint): void {
  flagsZN(vm, r, r < a ? 1n : 0n, ((a ^ r) & (b ^ r)) >> 63n);
}

function flagsSub(vm: Vm, a: bigint, b: bigint, r: bigint): void {
  flagsZN(vm, r, a < b ? 1n : 0n, ((a ^ b) & (a ^ r)) >> 63n);
}

function toSigned(v: bigint): bigint {
  return v & SIGN_BIT ? v - (1n << 64n) : v;
}

function signedDecimal(v: bigint): string {
  return toSigned(v).toString(10);
}

const textEncoder = new TextEncoder();

/** Sign-extend imm32 (u32) to 64 bits. */
function sextImm(immU32: number): bigint {
  return BigInt(immU32 >= 0x80000000 ? immU32 - 0x100000000 : immU32) & MASK64;
}

function flagZ(vm: Vm): boolean {
  return (vm.flags & 1n) !== 0n;
}
function flagN(vm: Vm): boolean {
  return (vm.flags & 4n) !== 0n;
}
function flagV(vm: Vm): boolean {
  return (vm.flags & 8n) !== 0n;
}

/**
 * Execute a single instruction. Never throws VmError — fatal errors are
 * returned as { status: "fatal", error }. (Programmer errors still throw.)
 */
export function step(vm: Vm): StepOutcome {
  try {
    return stepInner(vm);
  } catch (e) {
    if (e instanceof VmError) return { status: "fatal", error: e };
    throw e;
  }
}

function stepInner(vm: Vm): StepOutcome {
  // ISA §7: max-steps check first, then count this step.
  if (vm.maxSteps !== 0 && vm.steps >= vm.maxSteps)
    throw new VmError(10, `step limit ${vm.maxSteps} exceeded`);
  vm.steps += 1;

  if (vm.pc >= vm.codeSize || vm.pc % 8 !== 0)
    throw new VmError(7, `bad PC 0x${vm.pc.toString(16)}`);

  const off = vm.pc;
  const op = vm.mem[off];
  const info = op <= 0x2a ? OPCODE_BY_NUM[op] : undefined;
  if (!info) throw new VmError(1, `unknown opcode 0x${op.toString(16)}`); // defense in depth

  const dst = vm.mem[off + 1];
  const src = vm.mem[off + 2];
  const immU = vm.view.getUint32(off + 4, true);

  const next = () => {
    vm.pc += 8;
    return { status: "running" } as StepOutcome;
  };

  switch (op) {
    case 0x00: // NOP
      return next();

    case 0x01: // HALT — normal termination, exit = R0 & 0xFF
      return { status: "halted", exitCode: Number(vm.r[0] & 0xffn) };

    case 0x02: // MOV Rd, Rs
      vm.r[checkReg(dst)] = vm.r[checkReg(src)];
      return next();
    case 0x03: // MOV Rd, imm32
      vm.r[checkReg(dst)] = sextImm(immU);
      return next();

    case 0x04: { // ADD Rd, Rs
      const d = checkReg(dst);
      const a = vm.r[d];
      const b = vm.r[checkReg(src)];
      const r = (a + b) & MASK64;
      vm.r[d] = r;
      flagsAdd(vm, a, b, r);
      return next();
    }
    case 0x05: { // ADD Rd, imm32
      const d = checkReg(dst);
      const a = vm.r[d];
      const b = sextImm(immU);
      const r = (a + b) & MASK64;
      vm.r[d] = r;
      flagsAdd(vm, a, b, r);
      return next();
    }
    case 0x06: { // SUB Rd, Rs
      const d = checkReg(dst);
      const a = vm.r[d];
      const b = vm.r[checkReg(src)];
      const r = (a - b) & MASK64;
      vm.r[d] = r;
      flagsSub(vm, a, b, r);
      return next();
    }
    case 0x07: { // SUB Rd, imm32
      const d = checkReg(dst);
      const a = vm.r[d];
      const b = sextImm(immU);
      const r = (a - b) & MASK64;
      vm.r[d] = r;
      flagsSub(vm, a, b, r);
      return next();
    }
    case 0x08: { // MUL Rd, Rs (unsigned 128-bit product)
      const d = checkReg(dst);
      const a = vm.r[d];
      const b = vm.r[checkReg(src)];
      const p = a * b;
      const r = p & MASK64;
      vm.r[d] = r;
      const wide = p >> 64n !== 0n ? 1n : 0n;
      flagsZN(vm, r, wide, wide);
      return next();
    }
    case 0x09: { // MUL Rd, imm32
      const d = checkReg(dst);
      const a = vm.r[d];
      const b = sextImm(immU);
      const p = a * b;
      const r = p & MASK64;
      vm.r[d] = r;
      const wide = p >> 64n !== 0n ? 1n : 0n;
      flagsZN(vm, r, wide, wide);
      return next();
    }
    case 0x0a: // DIV Rd, Rs (signed)
    case 0x0b: { // DIV Rd, imm32 (signed)
      const d = checkReg(dst);
      const a = vm.r[d];
      const b = op === 0x0a ? vm.r[checkReg(src)] : sextImm(immU);
      if (b === 0n) throw new VmError(6, "division by zero"); // no flags updated
      const sa = toSigned(a);
      const sb = toSigned(b);
      const overflow = sa === I64_MIN && sb === -1n;
      const r = (BigInt(sa / sb)) & MASK64; // BigInt / truncates toward zero
      vm.r[d] = r;
      flagsZN(vm, r, 0n, overflow ? 1n : 0n);
      return next();
    }
    case 0x0c: { // INC Rd — C preserved
      const d = checkReg(dst);
      const a = vm.r[d];
      const r = (a + 1n) & MASK64;
      vm.r[d] = r;
      const v = a === (1n << 63n) - 1n ? 1n : 0n;
      vm.flags = (r === 0n ? 1n : 0n) | (vm.flags & 2n) | ((r >> 63n) << 2n) | (v << 3n);
      return next();
    }
    case 0x0d: { // DEC Rd — C preserved
      const d = checkReg(dst);
      const a = vm.r[d];
      const r = (a - 1n) & MASK64;
      vm.r[d] = r;
      const v = a === 1n << 63n ? 1n : 0n;
      vm.flags = (r === 0n ? 1n : 0n) | (vm.flags & 2n) | ((r >> 63n) << 2n) | (v << 3n);
      return next();
    }
    case 0x0e: // AND Rd, Rs
    case 0x0f: { // AND Rd, imm32
      const d = checkReg(dst);
      const r = vm.r[d] & (op === 0x0e ? vm.r[checkReg(src)] : sextImm(immU));
      vm.r[d] = r;
      flagsZN(vm, r, 0n, 0n);
      return next();
    }
    case 0x10: // OR Rd, Rs
    case 0x11: { // OR Rd, imm32
      const d = checkReg(dst);
      const r = vm.r[d] | (op === 0x10 ? vm.r[checkReg(src)] : sextImm(immU));
      vm.r[d] = r;
      flagsZN(vm, r, 0n, 0n);
      return next();
    }
    case 0x12: // XOR Rd, Rs
    case 0x13: { // XOR Rd, imm32
      const d = checkReg(dst);
      const r = vm.r[d] ^ (op === 0x12 ? vm.r[checkReg(src)] : sextImm(immU));
      vm.r[d] = r;
      flagsZN(vm, r, 0n, 0n);
      return next();
    }
    case 0x14: { // NOT Rd — flags unchanged
      const d = checkReg(dst);
      vm.r[d] = (~vm.r[d]) & MASK64;
      return next();
    }
    case 0x15: // CMP Ra, Rb
    case 0x16: { // CMP Ra, imm32
      const a = vm.r[checkReg(dst)];
      const b = op === 0x15 ? vm.r[checkReg(src)] : sextImm(immU);
      flagsSub(vm, a, b, (a - b) & MASK64);
      return next();
    }

    case 0x17: // LOAD Rd, [a32]
      vm.r[checkReg(dst)] = memRead64(vm, BigInt(immU));
      return next();
    case 0x18: // LOAD Rd, [Rs]
      vm.r[checkReg(dst)] = memRead64(vm, vm.r[checkReg(src)]);
      return next();
    case 0x19: // STORE [a32], Rs
      memWrite64(vm, BigInt(immU), vm.r[checkReg(src)]);
      return next();
    case 0x1a: // STORE [Rd], Rs
      memWrite64(vm, vm.r[checkReg(dst)], vm.r[checkReg(src)]);
      return next();
    case 0x1b: // LOADB Rd, [Rs]
      vm.r[checkReg(dst)] = BigInt(memRead8(vm, vm.r[checkReg(src)]));
      return next();
    case 0x1c: // STOREB [Rd], Rs
      memWrite8(vm, vm.r[checkReg(dst)], Number(vm.r[checkReg(src)] & 0xffn));
      return next();

    case 0x1d: // PUSH Rs
      push(vm, vm.r[checkReg(src)]);
      return next();
    case 0x1e: // POP Rd
      vm.r[checkReg(dst)] = pop(vm);
      return next();

    case 0x1f: { // CALL a32 — target validated first (matches reference order)
      if (immU >= vm.codeSize || immU % 8 !== 0)
        throw new VmError(7, `bad call target 0x${immU.toString(16)}`);
      push(vm, BigInt(vm.pc + 8)); // return address
      push(vm, BigInt(vm.fp)); // saved FP
      vm.fp = vm.sp;
      vm.pc = immU;
      return { status: "running" };
    }
    case 0x20: { // RET
      vm.sp = vm.fp; // drop the frame
      if (vm.sp >= MEM_TOP) throw new VmError(5, "stack underflow");
      const savedFp = memRead64(vm, BigInt(vm.sp));
      vm.sp += 8;
      if (vm.sp >= MEM_TOP) throw new VmError(5, "stack underflow");
      const retAddr = memRead64(vm, BigInt(vm.sp));
      vm.sp += 8;
      vm.fp = Number(savedFp);
      const target = Number(retAddr);
      if (target >= vm.codeSize || target % 8 !== 0)
        throw new VmError(7, `bad return address 0x${target.toString(16)}`);
      vm.pc = target;
      return { status: "running" };
    }

    case 0x21: // JMP a32
    case 0x22: // JE
    case 0x23: // JNE
    case 0x24: // JG
    case 0x25: // JL
    case 0x26: // JGE
    case 0x27: { // JLE
      const z = flagZ(vm);
      const n = flagN(vm);
      const v = flagV(vm);
      let take = false;
      switch (op) {
        case 0x21: take = true; break;
        case 0x22: take = z; break;
        case 0x23: take = !z; break;
        case 0x24: take = !z && n === v; break;
        case 0x25: take = n !== v; break;
        case 0x26: take = n === v; break;
        case 0x27: take = z || n !== v; break;
      }
      // Targets are loader-validated; the check is defense in depth.
      if (take) {
        if (immU >= vm.codeSize || immU % 8 !== 0)
          throw new VmError(7, `bad jump target 0x${immU.toString(16)}`);
        vm.pc = immU;
        return { status: "running" };
      }
      return next();
    }

    case 0x28: { // OUT Rs — signed decimal + newline
      const bytes = textEncoder.encode(signedDecimal(vm.r[checkReg(src)]) + "\n");
      for (const b of bytes) vm.out.push(b);
      return next();
    }
    case 0x29: { // OUTC Rs — low byte
      vm.out.push(Number(vm.r[checkReg(src)] & 0xffn));
      return next();
    }
    case 0x2a: { // IN Rd — 1 byte; EOF → 0xFFFFFFFFFFFFFFFF
      const d = checkReg(dst);
      if (vm.stdinPos < vm.stdin.length) vm.r[d] = BigInt(vm.stdin[vm.stdinPos++]);
      else vm.r[d] = MASK64;
      return next();
    }

    default:
      throw new VmError(1, `unknown opcode 0x${op.toString(16)}`);
  }
}

/** Decode the collected stdout bytes as UTF-8 text. */
export function stdoutText(vm: Vm): string {
  return new TextDecoder().decode(Uint8Array.from(vm.out));
}

/**
 * Run to completion (HALT or fatal error). Respects vm.maxSteps.
 * Returns the terminal outcome.
 */
export function runAll(vm: Vm): StepOutcome {
  for (;;) {
    const o = step(vm);
    if (o.status !== "running") return o;
  }
}
