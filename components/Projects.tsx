"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, type CaseStudyDict } from "@/lib/i18n";
import { projects, repoUrl, type Category, type Project } from "@/lib/projects";
import { jarvisTests } from "@/lib/jarvis-tests";
import { useSpotlight, useReveal } from "@/lib/hooks";
import Reveal from "./Reveal";
import { SectionHead } from "./About";
import Terminal from "./Terminal";

const REPO_ROWS = [
  ["nexus", "Python", "public"],
  ["jarvis", "Python", "public"],
  ["AxionLabs-site", "TypeScript", "public"],
  ["os-manager-v2", "TypeScript", "public"],
  ["Farmtech-Solutions-Fase-2", "HTML", "public"],
  ["e2ps-manual-builder", "Python", "public"],
  ["nexa-landing-page", "TypeScript", "public"],
  ["travel-intelligence-agent", "TypeScript", "public"],
];

const CMD = "gh repo list LucaswBohrer --limit 8";

function RepoListTerminal() {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setTyped(CMD);
            setDone(true);
            return;
          }
          let i = 0;
          const id = setInterval(() => {
            i += 1;
            setTyped(CMD.slice(0, i));
            if (i >= CMD.length) {
              clearInterval(id);
              setTimeout(() => setDone(true), 350);
            }
          }, 34);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Terminal title="lucas@dev: ~/projetos">
        <p className="text-slate-400">
          <span className="text-cyan-300">$</span> {typed}
          {!done && (
            <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-cyan-300" style={{ animation: "caret-blink 1s infinite" }} />
          )}
        </p>
        <div
          className="mt-3 grid gap-x-6 gap-y-1 transition-opacity duration-500 sm:grid-cols-2"
          style={{ opacity: done ? 1 : 0 }}
        >
          {REPO_ROWS.map(([name, lang, vis]) => (
            <p key={name} className="flex items-baseline justify-between gap-3 text-[12.5px]">
              <span className="truncate text-slate-200">{name}</span>
              <span className="shrink-0">
                <span className="text-indigo-300">{lang}</span>
                <span className="text-slate-600"> · </span>
                <span className="text-emerald-300">{vis}</span>
              </span>
            </p>
          ))}
        </div>
      </Terminal>
    </div>
  );
}

function NexusDiagram() {
  const { lang } = useLang();
  const en = lang === "en";
  return (
    <Terminal title={en ? "architecture — nexus" : "arquitetura — nexus"}>
      <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300 sm:text-[12px]">
        {en ? (
`  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │  Telemetry   │─────▶│   FastAPI    │─────▶│  Dashboards  │
  │ (simulation) │ data │   API v1     │ JSON │  real time   │
  └──────────────┘      └──────┬───────┘      └──────────────┘
                              │ SQLite
                              ▼
                       ┌──────────────┐
                       │ Diagnostics  │
                       │   + series   │
                       └──────────────┘`
        ) : (
`  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │  Telemetria  │─────▶│   FastAPI    │─────▶│  Dashboards  │
  │ (simulação)  │ dados│   API v1     │ JSON │  tempo real  │
  └──────────────┘      └──────┬───────┘      └──────────────┘
                              │ SQLite
                              ▼
                       ┌──────────────┐
                       │ Diagnósticos │
                       │   + séries   │
                       └──────────────┘`
        )}
      </pre>
    </Terminal>
  );
}

function JarvisTestCount() {
  const { lang, t } = useLang();
  const tc = t.projects.testCount;
  const labelCls = "font-code mb-1.5 text-[11px] tracking-[0.2em] text-cyan-300/80 uppercase";
  const bodyCls = "text-[14px] leading-relaxed text-slate-300";

  if (!jarvisTests) {
    return (
      <div>
        <dt className={labelCls}>{t.projects.caseLabels.result}</dt>
        <dd className={bodyCls}>{tc.fallback}</dd>
      </div>
    );
  }

  const dateStr = new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(jarvisTests.verifiedAt));

  return (
    <div>
      <dt className={labelCls}>{t.projects.caseLabels.result}</dt>
      <dd className={bodyCls}>
        <p aria-label={tc.ariaExplainer}>
          <strong className="font-semibold text-white">{jarvisTests.testCount}</strong> {tc.validated}
        </p>
        <p className="mt-1 text-[13px] text-slate-500">
          {tc.lastVerified}: {dateStr}
          {jarvisTests.workflowRun ? (
            <>
              {" · "}
              <a
                href={jarvisTests.workflowRun}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300/90 underline decoration-cyan-300/30 underline-offset-2 transition-colors hover:text-cyan-200"
              >
                {tc.viewRun}
              </a>
            </>
          ) : null}
        </p>
      </dd>
    </div>
  );
}

function CaseField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-code mb-1.5 text-[11px] tracking-[0.2em] text-cyan-300/80 uppercase">{label}</dt>
      <dd className="text-[14px] leading-relaxed text-slate-300">{children}</dd>
    </div>
  );
}

function CaseCard({ p, index }: { p: Project; index: number }) {
  const { lang, t } = useLang();
  const cs: CaseStudyDict = t.caseStudies[p.caseKey as "nexus" | "jarvis"];
  const [open, setOpen] = useState(false);
  const url = repoUrl(p);
  const panelId = `case-${p.slug}`;

  return (
    <Reveal delay={index * 90}>
      <article className="spotlight-card hairline overflow-hidden rounded-2xl bg-[#0c0f16]/85">
        <div className="grid md:grid-cols-2">
          {/* media */}
          <div className="relative min-h-[220px] border-b border-white/[0.07] md:border-r md:border-b-0">
            {p.mediaSrc ? (
              <img
                src={p.mediaSrc}
                alt={cs.mediaAlt}
                width={p.mediaWidth ?? 1200}
                height={p.mediaHeight ?? 750}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-5">
                <NexusDiagram />
              </div>
            )}
            <span className="chip absolute top-4 left-4 rounded-full border border-cyan-300/30 bg-[#07090d]/85 px-2.5 py-1 text-cyan-300 backdrop-blur">
              {t.projects.featured}
            </span>
          </div>

          {/* summary */}
          <div className="flex flex-col p-6 sm:p-7">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="font-code rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300">
                {p.language}
              </span>
              <span className="font-code inline-flex items-center gap-1.5 rounded-md border border-emerald-300/20 bg-emerald-400/[0.07] px-2 py-1 text-[11px] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
                {cs.status}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">{cs.name}</h3>
            <p className="font-display mt-1 text-[14px] text-cyan-200/90">{cs.tagline}</p>
            <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-400">{p.description[lang]}</p>

            <ul className="mt-4 space-y-1.5">
              {p.highlights[lang].map((h) => (
                <li key={h} className="flex items-center gap-2 text-[13px] text-slate-500">
                  <span className="h-1 w-1 rounded-full bg-cyan-300/70" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-5">
              <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                className="font-display inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-[14px] font-semibold text-[#07090d] transition-colors hover:bg-cyan-200"
              >
                {open ? t.projects.hideCase : t.projects.viewCase}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-[14px] font-semibold text-slate-200 transition-colors hover:border-cyan-300/40 hover:text-cyan-200"
                >
                  {t.projects.viewRepo}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* expandable case study */}
        {open && (
          <div id={panelId} className="border-t border-white/[0.07] bg-white/[0.015] px-6 py-7 sm:px-8">
            <dl className="grid gap-6 sm:grid-cols-2">
              <CaseField label={t.projects.caseLabels.problem}>{cs.problem}</CaseField>
              <CaseField label={t.projects.caseLabels.solution}>{cs.solution}</CaseField>
              <CaseField label={t.projects.caseLabels.role}>{cs.role}</CaseField>
              <CaseField label={t.projects.caseLabels.architecture}>{cs.architecture}</CaseField>
              <CaseField label={t.projects.caseLabels.challenge}>{cs.challenge}</CaseField>
              {p.caseKey === "jarvis" ? (
                <JarvisTestCount />
              ) : (
                <CaseField label={t.projects.caseLabels.result}>{cs.result}</CaseField>
              )}
            </dl>
            {cs.gallery && cs.gallery.length > 0 && (
              <div className="mt-6 border-t border-white/[0.07] pt-5">
                <h4 className="font-code mb-3 text-[11px] tracking-[0.2em] text-cyan-300/80 uppercase">
                  {t.projects.galleryTitle}
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {cs.gallery.map((g) => (
                    <figure key={g.src} className="hairline overflow-hidden rounded-xl bg-[#07090d]">
                      <img
                        src={g.src}
                        alt={g.alt}
                        width={g.width}
                        height={g.height}
                        loading="lazy"
                        className="h-auto w-full"
                      />
                      <figcaption className="font-code px-3 py-2 text-[11px] text-slate-500">
                        {g.caption}
                      </figcaption>
                    </figure>
                  ))}
                  <figure className="hairline overflow-hidden rounded-xl bg-[#07090d] sm:col-span-2">
                    <div className="p-4 sm:p-5">
                      <NexusDiagram />
                    </div>
                    {cs.galleryDiagramCaption && (
                      <figcaption className="font-code px-3 py-2 text-[11px] text-slate-500">
                        {cs.galleryDiagramCaption}
                      </figcaption>
                    )}
                  </figure>
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-5">
              <span className="font-code mr-1 text-[11px] tracking-[0.2em] text-slate-500 uppercase">
                {t.projects.caseLabels.stack}:
              </span>
              {cs.stack.map((s) => (
                <span key={s} className="font-code rounded bg-white/[0.05] px-2 py-1 text-[11.5px] text-slate-400">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </Reveal>
  );
}

const FILTERS: { id: Category | "all"; labelKey: "all" | Category }[] = [
  { id: "all", labelKey: "all" },
  { id: "ai", labelKey: "ai" },
  { id: "automation", labelKey: "automation" },
  { id: "web", labelKey: "web" },
  { id: "embedded", labelKey: "embedded" },
];

function CompactCard({ p }: { p: Project }) {
  const { lang, t } = useLang();
  const url = repoUrl(p);

  return (
    <div className="spotlight-card hairline group flex h-full flex-col rounded-2xl bg-[#0c0f16]/85 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/25">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-code rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300">
          {p.language}
        </span>
        <div className="flex gap-1.5">
          {p.categories.map((c) => (
            <span key={c} className="chip rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-slate-500">
              {t.projects.filters[c]}
            </span>
          ))}
        </div>
      </div>
      <h3 className="font-display text-[17px] font-bold tracking-tight text-white transition-colors group-hover:text-cyan-200">
        {p.title[lang]}
      </h3>
      <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-slate-400">{p.description[lang]}</p>
      <div className="mt-4 border-t border-white/[0.07] pt-3.5">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display inline-flex items-center gap-2 text-[13.5px] font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
          >
            {t.projects.viewRepo}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        ) : (
          <span className="font-code text-[12px] text-slate-600">{t.projects.privateRepo}</span>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const { t } = useLang();
  const [filter, setFilter] = useState<Category | "all">("all");
  const rootRef = useSpotlight<HTMLDivElement>();
  const revealRef = useReveal<HTMLDivElement>();

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const visible = filter === "all" ? rest : rest.filter((p) => p.categories.includes(filter));

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <SectionHead eyebrow={t.projects.eyebrow} title={t.projects.title} />
      <div ref={revealRef}>
        <Reveal delay={100}>
          <p className="mt-3 max-w-2xl text-[15px] text-slate-500">{t.projects.subtitle}</p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-8">
            <RepoListTerminal />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6">
          {featured.map((p, i) => (
            <CaseCard key={p.slug} p={p} index={i} />
          ))}
        </div>

        <div className="reveal mt-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">{t.projects.moreTitle}</h2>
          <p className="mt-2 text-[14px] text-slate-500">{t.projects.moreSubtitle}</p>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={t.projects.moreTitle}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`chip rounded-full border px-4 py-2 transition-colors ${
                  filter === f.id
                    ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-200"
                    : "border-white/[0.09] bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-slate-300"
                }`}
              >
                {t.projects.filters[f.labelKey]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-live="polite">
          {visible.map((p) => (
            <div key={p.slug} role="listitem" className="reveal is-visible">
              <CompactCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
