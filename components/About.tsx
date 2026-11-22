"use client";

import { useLang } from "@/lib/i18n";
import Reveal from "./Reveal";
import Terminal from "./Terminal";

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal>
      <p className="chip mb-3 text-accent/90">{eyebrow}</p>
      <h2 className="font-display max-w-2xl text-3xl font-bold tracking-tight text-fog sm:text-4xl">{title}</h2>
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
            <p className="text-[15.5px] leading-relaxed text-muted">{t.about.p1}</p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 text-[15.5px] leading-relaxed text-muted">{t.about.p2}</p>
          </Reveal>

          <Reveal delay={300}>
            <h3 className="font-display mt-10 text-lg font-semibold text-fog">{t.about.languagesTitle}</h3>
            <div className="mt-3 space-y-2">
              {t.about.languages.map((l) => (
                <div key={l.lang} className="flex items-center justify-between rounded-xl border border-line bg-tint/[0.02] px-4 py-2.5">
                  <span className="text-[14px] font-medium text-fog">{l.lang}</span>
                  <span className="font-code text-[12px] text-accent/90">{l.level}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={400}>
            <Terminal title={`${t.about.neofetch.user}: ~`} className="mt-6">
              <p className="mb-4 text-muted">
                <span className="text-accent">$</span> neofetch
              </p>
              <div className="flex items-start gap-6">
                <span className="font-display select-none text-[64px] font-bold leading-none text-accent/90">
                  λ
                </span>
                <div className="space-y-1.5 pt-1">
                  <p className="font-semibold text-fog">{t.about.neofetch.user}</p>
                  <p className="text-dim">──────────────</p>
                  {[
                    [t.about.neofetch.degree, t.about.neofetch.degreeValue],
                    [t.about.neofetch.stack, t.about.neofetch.stackValue],
                    [t.about.neofetch.focus, t.about.neofetch.focusValue],
                    [t.about.neofetch.base, t.about.neofetch.baseValue],
                  ].map(([k, v]) => (
                    <p key={k}>
                      <span className="text-accent">{k}</span>
                      <span className="text-dim">: </span>
                      <span className="text-muted">{v}</span>
                    </p>
                  ))}
                </div>
              </div>
            </Terminal>
          </Reveal>
        </div>

        <div>
          <Reveal delay={150}>
            <h3 className="font-display text-lg font-semibold text-fog">{t.about.skillsTitle}</h3>
          </Reveal>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {t.about.skillGroups.map((g, i) => (
              <Reveal key={g.title} delay={200 + i * 80}>
                <div className="spotlight-card hairline h-full rounded-2xl bg-surface/80 p-5">
                  <h4 className="font-display text-[14px] font-semibold text-accent">{g.title}</h4>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-line bg-tint/[0.03] px-2 py-1 text-[12.5px] text-muted"
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
            <h3 className="font-display mt-10 text-lg font-semibold text-fog">{t.about.educationTitle}</h3>
          </Reveal>
          <div className="mt-4 space-y-3">
            {t.about.education.map((e, i) => (
              <Reveal key={e.school} delay={300 + i * 80}>
                <div className="hairline rounded-2xl bg-surface/80 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-[15px] font-semibold text-fog">{e.course}</h4>
                    <span className="font-code text-[11.5px] text-dim">{e.period}</span>
                  </div>
                  <p className="mt-1 text-[13.5px] font-medium text-accent/90">{e.school}</p>
                  <p className="mt-1.5 text-[13px] text-muted">{e.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
