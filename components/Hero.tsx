"use client";

import { useLang } from "@/lib/i18n";
import { profile } from "@/lib/projects";
import SplitText from "./SplitText";
import Reveal from "./Reveal";
import type { TabId } from "./Header";

const terminalLines = [
  { k: "nome", v: '"Lucas Welter Bohrer"' },
  { k: "foco", v: '["IA", "automação", "sistemas"]' },
  { k: "stack", v: '["Python", "TypeScript", "APIs"]' },
  { k: "base", v: '"circuitos → deploy"' },
];

export default function Hero({ onTab }: { onTab: (t: TabId) => void }) {
  const { lang, t } = useLang();

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-36">
      {/* left */}
      <div>
        <Reveal>
          <p className="chip mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/[0.07] px-3 py-1.5 text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 2s infinite" }} />
            {t.hero.available}
          </p>
        </Reveal>

        <h1 className="font-display text-[44px] font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[68px]">
          <SplitText text="Lucas Welter" />
          <br />
          <SplitText text="Bohrer" wordDelay={90} />
        </h1>

        <Reveal delay={350}>
          <p className="shiny-text font-display mt-4 text-xl font-semibold sm:text-2xl">{t.hero.role}</p>
        </Reveal>

        <Reveal delay={450}>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-slate-400">{t.hero.intro}</p>
        </Reveal>

        <Reveal delay={550}>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onTab("projects")}
              className="font-display rounded-xl bg-cyan-300 px-6 py-3 text-[15px] font-semibold text-[#07090d] shadow-[0_0_28px_rgba(56,225,255,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(56,225,255,0.5)]"
            >
              {t.hero.ctaProjects}
            </button>
            <button
              onClick={() => onTab("contact")}
              className="font-display rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08]"
            >
              {t.hero.ctaContact}
            </button>
          </div>
        </Reveal>

        <Reveal delay={650}>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/[0.08] pt-6">
            {[
              { n: "10+", l: t.hero.stats.label1 },
              { n: "5+", l: t.hero.stats.label2 },
              { n: "2", l: t.hero.stats.label3 },
            ].map((s) => (
              <div key={s.l}>
                <dt className="sr-only">{s.l}</dt>
                <dd className="font-display text-3xl font-bold text-white">{s.n}</dd>
                <dd className="mt-1 text-[12.5px] leading-snug text-slate-500">{s.l}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* right — terminal card */}
      <Reveal delay={400} className="hidden lg:block">
        <div
          className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0e15]/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur"
          style={{ animation: "float-slow 9s ease-in-out infinite" }}
        >
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="font-code ml-3 text-[12px] text-slate-500">{t.hero.terminalTitle}</span>
          </div>
          <div className="font-code space-y-2.5 px-5 py-6 text-[13.5px] leading-relaxed">
            <p className="text-slate-500">
              <span className="text-cyan-300">const</span> <span className="text-white">perfil</span>{" "}
              <span className="text-slate-400">=</span> <span className="text-slate-300">{"{"}</span>
            </p>
            {terminalLines.map((l) => (
              <p key={l.k} className="pl-5">
                <span className="text-indigo-300">{l.k}</span>
                <span className="text-slate-400">: </span>
                <span className="text-emerald-300">{l.v}</span>
                <span className="text-slate-500">,</span>
              </p>
            ))}
            <p className="pl-5">
              <span className="text-indigo-300">local</span>
              <span className="text-slate-400">: </span>
              <span className="text-emerald-300">"{profile.location[lang]}"</span>
              <span className="text-slate-500">,</span>
            </p>
            <p className="text-slate-300">{"}"};</p>
            <p className="pt-2 text-slate-500">
              <span className="text-cyan-300">$</span> ./construir --com-ia
              <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-cyan-300" style={{ animation: "caret-blink 1.1s infinite" }} />
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
