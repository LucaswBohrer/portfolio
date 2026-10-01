"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { SectionHead } from "./About";
import { assembleSource, AsmError } from "@/lib/aurora/assembler";
import {
  loadProgram,
  step,
  stdoutText,
  VmError,
  type StepOutcome,
  type Vm,
} from "@/lib/aurora/vm";
import { disassemble } from "@/lib/aurora/isa";
import { EXAMPLES } from "@/lib/aurora/examples";

type Status = "idle" | "assembled" | "running" | "halted" | "fatal";

interface DisLine {
  offset: number;
  text: string;
}

/** UI runs are capped below the CLI default so a stray infinite loop can't hang the tab. */
const UI_MAX_STEPS = 1_000_000;
/** Steps executed per animation chunk while running. */
const CHUNK_STEPS = 10_000;

const hex16 = (v: bigint): string => "0x" + v.toString(16).padStart(16, "0");
const hexAddr = (v: number): string => "0x" + v.toString(16).padStart(4, "0").toUpperCase();

function StatusPill({ status, label }: { status: Status; label: string }) {
  const dot =
    status === "running"
      ? "bg-amber-300 animate-pulse"
      : status === "halted"
        ? "bg-emerald-300"
        : status === "fatal"
          ? "bg-red-400"
          : status === "assembled"
            ? "bg-cyan-300"
            : "bg-slate-500";
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[12px] font-medium text-slate-300">
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function Reg({ name, value, dim }: { name: string; value: string; dim?: boolean }) {
  return (
    <div
      className="flex min-w-0 items-baseline justify-between gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5"
      title={`${name} = ${value}`}
    >
      <span className="shrink-0 font-mono text-[11px] font-semibold text-cyan-300/80">{name}</span>
      <span className={`truncate font-mono text-[12px] ${dim ? "text-slate-500" : "text-slate-200"}`}>{value}</span>
    </div>
  );
}

/** Assemble once for the initial render (lazy useState initializer — no effect needed). */
function bootAssembly(): {
  vm: Vm | null;
  disasm: DisLine[];
  codeBytes: number;
  asmError: string | null;
} {
  try {
    const bytes = assembleSource("playground.asm", EXAMPLES[0].source);
    const vm = loadProgram(bytes, { maxSteps: UI_MAX_STEPS, stdin: new Uint8Array(0) });
    const code = vm.mem.subarray(0, vm.codeSize);
    const lines: DisLine[] = [];
    for (let off = 0; off < vm.codeSize; off += 8) {
      lines.push({ offset: off, text: disassemble(code, off) });
    }
    return { vm, disasm: lines, codeBytes: bytes.length, asmError: null };
  } catch (e) {
    const msg =
      e instanceof AsmError
        ? e.render("playground.asm")
        : e instanceof VmError
          ? e.message
          : String(e);
    return { vm: null, disasm: [], codeBytes: 0, asmError: msg };
  }
}

export default function AuroraPlayground() {
  const { t } = useLang();
  const pg = t.playground;

  const [boot] = useState(bootAssembly);
  const [exampleId, setExampleId] = useState(EXAMPLES[0].id);
  const [source, setSource] = useState(EXAMPLES[0].source);
  const [stdinText, setStdinText] = useState("");
  const [vm, setVm] = useState<Vm | null>(boot.vm);
  const [status, setStatus] = useState<Status>(boot.vm ? "assembled" : "idle");
  const [asmError, setAsmError] = useState<string | null>(boot.asmError);
  const [outcome, setOutcome] = useState<StepOutcome | null>(null);
  const [disasm, setDisasm] = useState<DisLine[]>(boot.disasm);
  const [codeBytes, setCodeBytes] = useState(boot.codeBytes);
  const [, setVersion] = useState(0);

  const vmRef = useRef<Vm | null>(boot.vm);
  const cancelRef = useRef(false);
  const statusRef = useRef<Status>(boot.vm ? "assembled" : "idle");
  const consoleRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Keep the loop-safe refs in sync (ref writes in effects are fine).
  useEffect(() => {
    statusRef.current = status;
    vmRef.current = vm;
  }, [status, vm]);

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const finishOutcome = useCallback(
    (o: StepOutcome) => {
      setOutcome(o);
      if (o.status === "halted") setStatus("halted");
      else if (o.status === "fatal") setStatus("fatal");
      bump();
    },
    [bump]
  );

  const doAssemble = useCallback(
    (src: string, stdin: string): boolean => {
      cancelRef.current = true;
      setAsmError(null);
      setOutcome(null);
      setDisasm([]);
      try {
        const bytes = assembleSource("playground.asm", src);
        const stdinBytes = new TextEncoder().encode(stdin);
        const v = loadProgram(bytes, { maxSteps: UI_MAX_STEPS, stdin: stdinBytes });
        const code = v.mem.subarray(0, v.codeSize);
        const lines: DisLine[] = [];
        for (let off = 0; off < v.codeSize; off += 8) {
          lines.push({ offset: off, text: disassemble(code, off) });
        }
        setDisasm(lines);
        setCodeBytes(bytes.length);
        setVm(v);
        setStatus("assembled");
        bump();
        return true;
      } catch (e) {
        if (e instanceof AsmError) setAsmError(e.render("playground.asm"));
        else if (e instanceof VmError) setAsmError(e.message);
        else setAsmError(String(e));
        setVm(null);
        setStatus("idle");
        return false;
      }
    },
    [bump]
  );

  const doStep = useCallback(() => {
    const v = vmRef.current;
    const s = statusRef.current;
    if (!v || s === "running" || s === "fatal" || s === "halted" || s === "idle") return;
    const o = step(v);
    if (o.status === "running") {
      bump();
    } else {
      finishOutcome(o);
    }
  }, [bump, finishOutcome]);

  const doRun = useCallback(() => {
    const v = vmRef.current;
    const s = statusRef.current;
    if (!v || s === "running" || s === "idle" || s === "halted" || s === "fatal") return;
    cancelRef.current = false;
    setStatus("running");
    const chunk = () => {
      const cur = vmRef.current;
      if (!cur || cancelRef.current) {
        if (statusRef.current === "running") setStatus("assembled");
        return;
      }
      let o: StepOutcome = { status: "running" };
      for (let i = 0; i < CHUNK_STEPS; i++) {
        o = step(cur);
        if (o.status !== "running") break;
      }
      if (o.status !== "running") {
        finishOutcome(o);
        return;
      }
      bump();
      setTimeout(chunk, 0);
    };
    setTimeout(chunk, 0);
  }, [bump, finishOutcome]);

  const doStop = useCallback(() => {
    cancelRef.current = true;
  }, []);

  const doReset = useCallback(() => {
    doAssemble(source, stdinText);
  }, [doAssemble, source, stdinText]);

  const selectExample = useCallback(
    (id: string) => {
      const ex = EXAMPLES.find((e) => e.id === id);
      if (!ex) return;
      setExampleId(id);
      setSource(ex.source);
      doAssemble(ex.source, stdinText);
    },
    [doAssemble, stdinText]
  );

  // Stop any running loop on unmount.
  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  // Auto-scroll console to bottom when output grows.
  const stdout = vm ? stdoutText(vm) : "";
  useEffect(() => {
    const el = consoleRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [stdout, outcome]);

  const syncGutter = () => {
    if (editorRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const lineCount = source.split("\n").length;
  const canControl = status === "assembled";
  const running = status === "running";

  const statusLabel =
    status === "idle"
      ? pg.statusIdle
      : status === "assembled"
        ? pg.statusAssembled
        : status === "running"
          ? pg.statusRunning
          : status === "halted"
            ? pg.statusHalted
            : pg.statusFatal;

  const flagBits = vm ? Number(vm.flags & 0xfn) : 0;
  const flags: [string, boolean][] = [
    ["Z", (flagBits & 1) !== 0],
    ["C", (flagBits & 2) !== 0],
    ["N", (flagBits & 4) !== 0],
    ["V", (flagBits & 8) !== 0],
  ];

  // Stack view: up to 8 qwords from SP up to 0xFFFF.
  const stackRows: { addr: number; value: string }[] = [];
  if (vm && vm.sp < 0x10000) {
    for (let a = vm.sp; a < 0x10000 && stackRows.length < 8; a += 8) {
      try {
        stackRows.push({ addr: a, value: hex16(vm.view.getBigUint64(a, true)) });
      } catch {
        break;
      }
    }
  }

  const haltedExit = outcome && outcome.status === "halted" ? outcome.exitCode : null;
  const fatalMsg = outcome && outcome.status === "fatal" ? outcome.error.message : null;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <SectionHead eyebrow={pg.eyebrow} title={pg.title} />
      <p className="mt-4 max-w-3xl text-[15.5px] leading-relaxed text-slate-400">{pg.subtitle}</p>

      {/* controls */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-[13px] text-slate-400">
          <span className="font-medium">{pg.examplesLabel}</span>
          <select
            value={exampleId}
            onChange={(e) => selectExample(e.target.value)}
            className="rounded-lg border border-white/[0.08] bg-[#0c0f16] px-3 py-2 font-mono text-[13px] text-slate-200 outline-none focus:border-cyan-300/50"
          >
            {EXAMPLES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => doAssemble(source, stdinText)}
            className="rounded-lg bg-cyan-300 px-4 py-2 text-[13px] font-semibold text-[#07090d] transition-colors hover:bg-cyan-200"
          >
            {pg.assemble}
          </button>
          <button
            onClick={doRun}
            disabled={!canControl}
            className="rounded-lg bg-cyan-300/15 px-4 py-2 text-[13px] font-semibold text-cyan-300 transition-colors hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pg.run}
          </button>
          <button
            onClick={doStep}
            disabled={!canControl}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] font-semibold text-slate-200 transition-colors hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pg.step}
          </button>
          {running && (
            <button
              onClick={doStop}
              className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-[13px] font-semibold text-red-300 transition-colors hover:bg-red-400/20"
            >
              {pg.stop}
            </button>
          )}
          <button
            onClick={doReset}
            disabled={running}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] font-semibold text-slate-200 transition-colors hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pg.reset}
          </button>
        </div>

        <StatusPill status={status} label={statusLabel} />
        {vm && (
          <span className="font-mono text-[12px] text-slate-500">
            {vm.steps} {pg.stepsLabel} · {codeBytes} {pg.bytesLabel}
          </span>
        )}
      </div>

      {asmError && (
        <div className="mt-4 rounded-xl border border-red-400/25 bg-red-400/[0.07] px-4 py-3 font-mono text-[13px] text-red-300">
          {asmError}
        </div>
      )}

      {/* main grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {/* editor */}
        <div className="lg:col-span-3">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
            {pg.editorLabel}
          </p>
          <div className="flex overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0d13]">
            <div
              ref={gutterRef}
              aria-hidden="true"
              className="select-none overflow-hidden border-r border-white/[0.06] bg-white/[0.02] px-3 py-3 text-right font-mono text-[13px] leading-6 text-slate-600"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={editorRef}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onScroll={syncGutter}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const el = e.currentTarget;
                  const s = el.selectionStart ?? 0;
                  const en = el.selectionEnd ?? 0;
                  setSource(source.slice(0, s) + "  " + source.slice(en));
                  requestAnimationFrame(() => {
                    el.selectionStart = el.selectionEnd = s + 2;
                  });
                }
              }}
              spellCheck={false}
              aria-label={pg.editorLabel}
              className="min-h-[380px] w-full resize-y bg-transparent p-3 font-mono text-[13px] leading-6 text-slate-200 outline-none placeholder:text-slate-600"
            />
          </div>
          <label className="mt-3 flex items-center gap-2 text-[13px] text-slate-400">
            <span className="font-medium">{pg.stdinLabel}</span>
            <input
              value={stdinText}
              onChange={(e) => setStdinText(e.target.value)}
              placeholder={pg.stdinPlaceholder}
              aria-label={pg.stdinLabel}
              className="w-full rounded-lg border border-white/[0.08] bg-[#0c0f16] px-3 py-2 font-mono text-[13px] text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-300/50"
            />
          </label>
        </div>

        {/* side: console + registers */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
              {pg.consoleLabel}
            </p>
            <div
              ref={consoleRef}
              className="h-48 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0a0d13] p-3 font-mono text-[13px] leading-6"
            >
              {stdout ? (
                <pre className="whitespace-pre-wrap text-slate-200">{stdout}</pre>
              ) : (
                <p className="text-slate-600">{pg.consoleHint}</p>
              )}
              {haltedExit !== null && (
                <p className="mt-2 text-emerald-300">{pg.haltedMsg.replace("{n}", String(haltedExit))}</p>
              )}
              {fatalMsg && <p className="mt-2 text-red-400">{fatalMsg}</p>}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
              {pg.regsLabel}
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {vm
                ? vm.r.map((r, i) => <Reg key={i} name={`R${i}`} value={hex16(r)} dim={r === 0n} />)
                : Array.from({ length: 16 }, (_, i) => <Reg key={i} name={`R${i}`} value="—" dim />)}
            </div>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              <Reg name="PC" value={vm ? hexAddr(vm.pc) : "—"} dim={!vm} />
              <Reg name="SP" value={vm ? hexAddr(vm.sp) : "—"} dim={!vm} />
              <Reg name="FP" value={vm ? hexAddr(vm.fp) : "—"} dim={!vm} />
            </div>
            <div className="mt-1.5 flex gap-1.5">
              {flags.map(([name, on]) => (
                <span
                  key={name}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-center font-mono text-[12px] font-bold ${
                    on ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-300" : "border-white/[0.06] bg-white/[0.02] text-slate-600"
                  }`}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* disassembly + stack */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
            {pg.disasmLabel}
          </p>
          <div className="h-64 overflow-auto rounded-xl border border-white/[0.08] bg-[#0a0d13] p-3 font-mono text-[13px] leading-6">
            {disasm.length === 0 ? (
              <p className="text-slate-600">—</p>
            ) : (
              disasm.map((l) => {
                const current = vm !== null && vm.pc === l.offset;
                return (
                  <div
                    key={l.offset}
                    className={`flex gap-3 rounded px-2 ${current ? "bg-cyan-400/15 text-cyan-200" : "text-slate-400"}`}
                  >
                    <span className="w-14 shrink-0 text-slate-600">{hexAddr(l.offset)}</span>
                    <span className="whitespace-pre">{l.text}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
            {pg.stackLabel}
          </p>
          <div className="h-64 overflow-auto rounded-xl border border-white/[0.08] bg-[#0a0d13] p-3 font-mono text-[13px] leading-6">
            {stackRows.length === 0 ? (
              <p className="text-slate-600">{pg.stackEmpty}</p>
            ) : (
              stackRows.map((r) => (
                <div key={r.addr} className="flex gap-3 px-2 text-slate-300">
                  <span className="w-14 shrink-0 text-slate-600">{hexAddr(r.addr)}</span>
                  <span>{r.value}</span>
                  {vm && r.addr === vm.sp && <span className="text-cyan-300/70">← SP</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
