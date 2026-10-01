"use client";

import { useLang } from "@/lib/i18n";
import { useSpotlight, useReveal } from "@/lib/hooks";

const icons = ["◈", "▣", "⬡"];

export default function Services() {
  const { t } = useLang();
  const cardsRef = useSpotlight<HTMLDivElement>();
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section ref={sectionRef} aria-labelledby="services-title" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <div className="reveal mb-10 max-w-2xl">
        <p className="font-code mb-4 text-[12px] tracking-[0.25em] text-cyan-300/90 uppercase">
          {"// "}{t.hero.servicesEyebrow}
        </p>
        <h2 id="services-title" className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t.hero.servicesTitle}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-400">{t.hero.servicesSubtitle}</p>
      </div>

      <div ref={cardsRef} className="grid gap-5 md:grid-cols-3">
        {t.hero.services.map((s, i) => (
          <article
            key={s.title}
            className="spotlight-card reveal group flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-sm"
            style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
          >
            <span aria-hidden="true" className="font-display mb-5 text-2xl text-cyan-300/80">
              {icons[i % icons.length]}
            </span>
            <h3 className="font-display mb-2.5 text-lg font-semibold text-white">{s.title}</h3>
            <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-400">{s.desc}</p>
            <ul className="flex flex-wrap gap-2" aria-label={s.title}>
              {s.tags.map((tag) => (
                <li
                  key={tag}
                  className="chip rounded-md border border-cyan-300/15 bg-cyan-400/[0.06] px-2 py-1 text-cyan-200/80"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
