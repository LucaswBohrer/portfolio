"use client";

import { useLang } from "@/lib/i18n";
import Reveal from "./Reveal";
import { SectionHead } from "./About";

export default function Experience() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <SectionHead eyebrow={t.experience.eyebrow} title={t.experience.title} />
      <Reveal delay={100}>
        <p className="mt-3 text-[15px] text-slate-400">{t.experience.subtitle}</p>
      </Reveal>

      <div className="relative mt-12 space-y-8 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-gradient-to-b before:from-cyan-300/50 before:via-white/10 before:to-transparent">
        {t.experience.jobs.map((job, i) => (
          <Reveal key={job.company} delay={i * 120}>
            <div className="relative pl-10">
              <span className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-cyan-300 bg-[#07090d] shadow-[0_0_14px_rgba(56,225,255,0.6)]" />
              <div className="spotlight-card hairline rounded-2xl bg-[#0c0f16]/85 p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-white">{job.role}</h3>
                  <span className="font-code rounded-md bg-cyan-400/10 px-2.5 py-1 text-[11.5px] text-cyan-300">
                    {job.period}
                  </span>
                </div>
                <p className="mt-1 text-[14px] font-medium text-slate-300">
                  {job.company} <span className="font-normal text-slate-500">· {job.location}</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {job.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[14px] leading-relaxed text-slate-400">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/60" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
