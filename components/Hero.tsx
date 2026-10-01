"use client";

import { useLang } from "@/lib/i18n";
import SplitText from "./SplitText";
import Reveal from "./Reveal";
import InteractiveTerminal from "./InteractiveTerminal";
import type { TabId } from "./Header";

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

      {/* right — interactive terminal (remounts on language change) */}
      <Reveal delay={400}>
        <InteractiveTerminal key={lang} />
      </Reveal>
    </div>
  );
}
