"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { bootLines, runCommand, type Seg, type SegColor, type TermLineData } from "@/lib/terminal";

interface Row {
  id: number;
  /** echoed command line (prompt + raw input) */
  echo?: string;
  /** output line segments */
  segs?: TermLineData;
}

const COLOR: Record<SegColor, string> = {
  cyan: "text-cyan-300",
  green: "text-emerald-300",
  indigo: "text-indigo-300",
  dim: "text-slate-500",
  white: "text-white",
  red: "text-red-400",
  yellow: "text-amber-300",
  plain: "text-slate-300",
};

function Segs({ segs }: { segs: TermLineData }) {
  return (
    <>
      {segs.map((s: Seg, i: number) =>
        s.href ? (
          <a
            key={i}
            href={s.href}
            {...(s.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
            className={`${COLOR[s.color ?? "plain"]} ${s.bold ? "font-bold" : ""} underline decoration-cyan-300/30 underline-offset-2 hover:decoration-cyan-300`}
          >
            {s.text}
          </a>
        ) : (
          <span key={i} className={`${COLOR[s.color ?? "plain"]} ${s.bold ? "font-bold" : ""}`}>
            {s.text}
          </span>
        )
      )}
    </>
  );
}

function Prompt() {
  return (
    <span className="select-none" aria-hidden="true">
      <span className="text-emerald-400">lucas@dev</span>
      <span className="text-slate-500">:</span>
      <span className="text-cyan-300">~</span>
      <span className="text-slate-500">$&nbsp;</span>
    </span>
  );
}

/** Global row id counter — ids only need to be unique per mounted instance. */
let rowSeq = 0;
const nextId = (): number => {
  rowSeq += 1;
  return rowSeq;
};

/** Interactive terminal — keeps the hero card chrome, but the body is a live shell. */
export default function InteractiveTerminal() {
  const { lang, t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Boot rows are built once per mount; Hero remounts this component
  // (key={lang}) when the UI language changes.
  const [rows, setRows] = useState<Row[]>(() =>
    bootLines(t, lang).map((segs) => ({ id: nextId(), segs }))
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);

  // Keep the latest output visible
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rows]);

  const submit = (raw: string): void => {
    const echoRow: Row = { id: nextId(), echo: raw };
    const trimmed = raw.trim();
    if (!trimmed) {
      setRows((r) => [...r, echoRow]);
      return;
    }
    const res = runCommand(trimmed, t, lang);
    setHistory((h) => [...h, trimmed]);
    setHIdx(null);
    if (res.clear) {
      setRows([]);
      return;
    }
    setRows((r) => [...r, echoRow, ...res.lines.map((segs) => ({ id: nextId(), segs }))]);
  };

  const navHistory = (dir: -1 | 1): void => {
    if (history.length === 0) return;
    const next = hIdx === null ? (dir === -1 ? history.length - 1 : 0) : hIdx + dir;
    if (next < 0 || next >= history.length) return;
    setHIdx(next);
    setInput(history[next]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      submit(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navHistory(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navHistory(1);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setRows([]);
    } else if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      setRows((r) => [
        ...r,
        { id: nextId(), echo: input },
        { id: nextId(), segs: [{ text: "^C", color: "dim" }] },
      ]);
      setInput("");
      setHIdx(null);
    }
  };

  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0e15]/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="font-code ml-3 text-[12px] text-slate-500">{t.terminal.title}</span>
      </div>
      <div
        ref={scrollRef}
        role="log"
        aria-label={t.terminal.title}
        onClick={focusInput}
        className="font-code max-h-[380px] cursor-text overflow-auto px-5 py-5 text-[13px] leading-relaxed"
      >
        {rows.map((r) => (
          <div key={r.id} className="break-words">
            {r.echo !== undefined ? (
              <span>
                <Prompt />
                <span className="text-slate-200">{r.echo}</span>
              </span>
            ) : (
              r.segs && <Segs segs={r.segs} />
            )}
          </div>
        ))}
        <div className="flex items-start">
          <Prompt />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label={t.terminal.inputLabel}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            size={Math.max(input.length, 1)}
            className="font-code min-w-0 flex-shrink bg-transparent text-slate-200 caret-transparent outline-none"
          />
          <span
            aria-hidden="true"
            className={`mt-[3px] inline-block h-[15px] w-[8px] shrink-0 bg-cyan-300 ${focused ? "" : "opacity-40"}`}
            style={{ animation: "caret-blink 1.1s infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
