"use client";

import { useLang } from "@/lib/i18n";
import Reveal from "./Reveal";
import Terminal from "./Terminal";

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal>
      <p className="chip mb-3 text-cyan-300/90">{eyebrow}</p>
      <h2 className="font-display max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
    </Reveal>
  );
}

export { SectionHead };

export default function About() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <SectionHead eyebrow={t.about.eyebrow} title={t.about.title} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <Reveal delay={100}>
            <p className="text-[15.5px] leading-relaxed text-slate-400">{t.about.p1}</p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 text-[15.5px] leading-relaxed text-slate-400">{t.about.p2}</p>
          </Reveal>

          <Reveal delay={300}>
            <h3 className="font-display mt-10 text-lg font-semibold text-white">{t.about.languagesTitle}</h3>
            <div className="mt-3 space-y-2">
              {t.about.languages.map((l) => (
                <div key={l.lang} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
                  <span className="text-[14px] font-medium text-slate-200">{l.lang}</span>
                  <span className="font-code text-[12px] text-cyan-300/90">{l.level}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={400}>
            <Terminal title={`${t.about.neofetch.user}: ~`} className="mt-6">
              <p className="mb-4 text-slate-500">
                <span className="text-cyan-300">$</span> neofetch
              </p>
              <div className="flex items-start gap-6">
                <span className="font-display select-none text-[64px] font-bold leading-none text-cyan-300/90">
                  λ
                </span>
                <div className="space-y-1.5 pt-1">
                  <p className="font-semibold text-white">{t.about.neofetch.user}</p>
                  <p className="text-slate-700">──────────────</p>
                  {[
                    [t.about.neofetch.degree, t.about.neofetch.degreeValue],
                    [t.about.neofetch.stack, t.about.neofetch.stackValue],
                    [t.about.neofetch.focus, t.about.neofetch.focusValue],
                    [t.about.neofetch.base, t.about.neofetch.baseValue],
                  ].map(([k, v]) => (
                    <p key={k}>
                      <span className="text-cyan-300">{k}</span>
                      <span className="text-slate-500">: </span>
                      <span className="text-slate-300">{v}</span>
                    </p>
                  ))}
                </div>
              </div>
            </Terminal>
          </Reveal>
        </div>

        <div>
          <Reveal delay={150}>
            <h3 className="font-display text-lg font-semibold text-white">{t.about.skillsTitle}</h3>
          </Reveal>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {t.about.skillGroups.map((g, i) => (
              <Reveal key={g.title} delay={200 + i * 80}>
                <div className="spotlight-card hairline h-full rounded-2xl bg-[#0c0f16]/80 p-5">
                  <h4 className="font-display text-[14px] font-semibold text-cyan-200">{g.title}</h4>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[12.5px] text-slate-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={250}>
            <h3 className="font-display mt-10 text-lg font-semibold text-white">{t.about.educationTitle}</h3>
          </Reveal>
          <div className="mt-4 space-y-3">
            {t.about.education.map((e, i) => (
              <Reveal key={e.school} delay={300 + i * 80}>
                <div className="hairline rounded-2xl bg-[#0c0f16]/80 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-[15px] font-semibold text-white">{e.course}</h4>
                    <span className="font-code text-[11.5px] text-slate-500">{e.period}</span>
                  </div>
                  <p className="mt-1 text-[13.5px] font-medium text-cyan-300/90">{e.school}</p>
                  <p className="mt-1.5 text-[13px] text-slate-500">{e.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
