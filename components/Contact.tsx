"use client";

import { useLang } from "@/lib/i18n";
import { profile } from "@/lib/projects";
import Reveal from "./Reveal";
import { SectionHead } from "./About";

const icons = {
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 6L2 7" />
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.13.96.36 1.9.7 2.8a2 2 0 01-.45 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0122 16.9z" />
    </svg>
  ),
  pin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.2.67.8.55A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  ),
  file: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8" />
    </svg>
  ),
};

export default function Contact() {
  const { lang, t } = useLang();

  const cards = [
    { icon: icons.mail, label: t.contact.emailLabel, value: profile.email, href: `mailto:${profile.email}` },
    { icon: icons.phone, label: t.contact.phoneLabel, value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { icon: icons.pin, label: t.contact.locationLabel, value: profile.location[lang], href: undefined },
    { icon: icons.github, label: t.contact.githubLabel, value: "github.com/LucaswBohrer", href: profile.github },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <SectionHead eyebrow={t.contact.eyebrow} title={t.contact.title} />
      <Reveal delay={100}>
        <p className="mt-3 max-w-xl text-[15px] text-slate-500">{t.contact.subtitle}</p>
      </Reveal>

      {/* intent-driven CTAs */}
      <div className="mt-10">
        <h2 className="font-code mb-4 text-[12px] tracking-[0.25em] text-cyan-300/90 uppercase">
          {"// "}{t.contact.intentsTitle}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {t.contact.intents.map((intent, i) => (
            <Reveal key={intent.label} delay={140 + i * 80}>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(intent.subject)}`}
                className="spotlight-card hairline group flex h-full flex-col rounded-2xl bg-[#0c0f16]/85 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-300/30"
              >
                <span className="font-display text-[15px] font-semibold text-white transition-colors group-hover:text-cyan-200">
                  {intent.label}
                </span>
                <span className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-500">{intent.desc}</span>
                <span className="font-display mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan-300">
                  {t.contact.sendEmail}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {cards.map((c, i) => {
          const inner = (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/[0.08] text-cyan-300">
                {c.icon}
              </span>
              <span>
                <span className="block text-[12px] font-medium uppercase tracking-wider text-slate-500">{c.label}</span>
                <span className="font-display mt-0.5 block text-[15px] font-semibold text-white">{c.value}</span>
              </span>
            </>
          );
          return (
            <Reveal key={c.label} delay={150 + i * 80}>
              {c.href ? (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="spotlight-card hairline flex items-center gap-4 rounded-2xl bg-[#0c0f16]/85 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-300/25"
                >
                  {inner}
                </a>
              ) : (
                <div className="hairline flex items-center gap-4 rounded-2xl bg-[#0c0f16]/85 p-5">{inner}</div>
              )}
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={300}>
        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[0.08] to-transparent p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300 text-[#07090d]">
              {icons.file}
            </span>
            <div>
              <p className="font-display text-[15px] font-semibold text-white">{t.contact.cvLabel}</p>
              <p className="font-code text-[12px] text-slate-500">{t.contact.cvHint}</p>
            </div>
          </div>
          <a
            href="/cv/Lucas_Welter_Bohrer_CV.pdf"
            download
            className="font-display rounded-xl bg-cyan-300 px-6 py-3 text-[15px] font-semibold text-[#07090d] shadow-[0_0_28px_rgba(56,225,255,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(56,225,255,0.5)]"
          >
            {t.contact.cvLabel}
          </a>
        </div>
      </Reveal>

    </div>
  );
}
