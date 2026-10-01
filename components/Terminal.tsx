"use client";

import type { ReactNode } from "react";

interface TerminalProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/** Reusable macOS-style terminal window */
export default function Terminal({ title, children, className = "" }: TerminalProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0e15]/90 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="font-code ml-3 text-[12px] text-slate-500">{title}</span>
      </div>
      <div className="font-code px-5 py-5 text-[13px] leading-relaxed">{children}</div>
    </div>
  );
}
