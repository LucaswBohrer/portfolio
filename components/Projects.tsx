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
        <p className="text-muted">
          <span className="text-accent">$</span> {typed}
          {!done && (
            <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-accent" style={{ animation: "caret-blink 1s infinite" }} />
          )}
        </p>
        <div
          className="mt-3 grid gap-x-6 gap-y-1 transition-opacity duration-500 sm:grid-cols-2"
          style={{ opacity: done ? 1 : 0 }}
        >
          {REPO_ROWS.map(([name, lang, vis]) => (
            <p key={name} className="flex items-baseline justify-between gap-3 text-[12.5px]">
              <span className="truncate text-fog">{name}</span>
              <span className="shrink-0">
                <span className="text-indigo-300">{lang}</span>
                <span className="text-dim"> · </span>
                <span className="text-ok">{vis}</span>
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
      <pre className="overflow-x-auto text-[11px] leading-relaxed text-muted sm:text-[12px]">
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
  const labelCls = "font-code mb-1.5 text-[11px] tracking-[0.2em] text-accent/80 uppercase";
  const bodyCls = "text-[14px] leading-relaxed text-muted";

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
          <strong className="font-semibold text-fog">{jarvisTests.testCount}</strong> {tc.validated}
        </p>
        <p className="mt-1 text-[13px] text-muted">
          {tc.lastVerified}: {dateStr}
          {jarvisTests.workflowRun ? (
            <>
              {" · "}
              <a
                href={jarvisTests.workflowRun}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent/90 underline decoration-accent/30 underline-offset-2 transition-colors hover:text-accent"
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
      <dt className="font-code mb-1.5 text-[11px] tracking-[0.2em] text-accent/80 uppercase">{label}</dt>
      <dd className="text-[14px] leading-relaxed text-muted">{children}</dd>
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
      <article className="spotlight-card hairline overflow-hidden rounded-2xl bg-surface/85">
        <div className="grid md:grid-cols-2">
          {/* media */}
          <div className="relative min-h-[220px] border-b border-line md:border-r md:border-b-0">
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
            <span className="chip absolute top-4 left-4 rounded-full border border-accent/30 bg-ink/85 px-2.5 py-1 text-accent backdrop-blur">
              {t.projects.featured}
            </span>
          </div>

          {/* summary */}
          <div className="flex flex-col p-6 sm:p-7">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="font-code rounded-md border border-line bg-tint/[0.04] px-2 py-1 text-[11px] text-muted">
                {p.language}
              </span>
              <span className="font-code inline-flex items-center gap-1.5 rounded-md border border-ok/20 bg-ok/[0.07] px-2 py-1 text-[11px] text-ok">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
                {cs.status}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-fog">{cs.name}</h3>
            <p className="font-display mt-1 text-[14px] text-accent/90">{cs.tagline}</p>
            <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted">{p.description[lang]}</p>

            <ul className="mt-4 space-y-1.5">
              {p.highlights[lang].map((h) => (
                <li key={h} className="flex items-center gap-2 text-[13px] text-muted">
                  <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
              <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                className="font-display inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:brightness-110"
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
                  className="font-display inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[14px] font-semibold text-fog transition-colors hover:border-accent/40 hover:text-accent"
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
          <div id={panelId} className="border-t border-line bg-tint/[0.015] px-6 py-7 sm:px-8">
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
              {cs.demo && url && (
                <CaseField label={t.projects.caseLabels.demo}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent/90 underline decoration-accent/30 underline-offset-2 transition-colors hover:text-accent"
                  >
                    {cs.demo}
                  </a>
                </CaseField>
              )}
            </dl>
            {cs.gallery && cs.gallery.length > 0 && (
              <div className="mt-6 border-t border-line pt-5">
                <h4 className="font-code mb-3 text-[11px] tracking-[0.2em] text-accent/80 uppercase">
                  {t.projects.galleryTitle}
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {cs.gallery.map((g) => (
                    <figure key={g.src} className="hairline overflow-hidden rounded-xl bg-ink">
                      <img
                        src={g.src}
                        alt={g.alt}
                        width={g.width}
                        height={g.height}
                        loading="lazy"
                        className="h-auto w-full"
                      />
                      <figcaption className="font-code px-3 py-2 text-[11px] text-dim">
                        {g.caption}
                      </figcaption>
                    </figure>
                  ))}
                  <figure className="hairline overflow-hidden rounded-xl bg-ink sm:col-span-2">
                    <div className="p-4 sm:p-5">
                      <NexusDiagram />
                    </div>
                    {cs.galleryDiagramCaption && (
                      <figcaption className="font-code px-3 py-2 text-[11px] text-dim">
                        {cs.galleryDiagramCaption}
                      </figcaption>
                    )}
                  </figure>
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
              <span className="font-code mr-1 text-[11px] tracking-[0.2em] text-dim uppercase">
                {t.projects.caseLabels.stack}:
              </span>
              {cs.stack.map((s) => (
                <span key={s} className="font-code rounded bg-tint/[0.05] px-2 py-1 text-[11.5px] text-muted">
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
  { id: "systems", labelKey: "systems" },
];

function CompactCard({ p }: { p: Project }) {
  const { lang, t } = useLang();
  const url = repoUrl(p);

  return (
    <div className="spotlight-card hairline group flex h-full flex-col rounded-2xl bg-surface/85 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/25">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-code rounded-md border border-line bg-tint/[0.04] px-2 py-1 text-[11px] text-muted">
          {p.language}
        </span>
        <div className="flex gap-1.5">
          {p.categories.map((c) => (
            <span key={c} className="chip rounded border border-line bg-tint/[0.03] px-1.5 py-0.5 text-dim">
              {t.projects.filters[c]}
            </span>
          ))}
        </div>
      </div>
      <h3 className="font-display text-[17px] font-bold tracking-tight text-fog transition-colors group-hover:text-accent">
        {p.title[lang]}
      </h3>
      <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted">{p.description[lang]}</p>
      <div className="mt-4 flex flex-col items-start gap-2.5 border-t border-line pt-3.5">
        {p.demoUrl ? (
          <a
            href={p.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display inline-flex items-center gap-2 text-[13.5px] font-semibold text-accent transition-colors hover:text-accent"
          >
            {t.projects.viewLive}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        ) : url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display inline-flex items-center gap-2 text-[13.5px] font-semibold text-accent transition-colors hover:text-accent"
          >
            {t.projects.viewRepo}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        ) : (
          <span className="font-code text-[12px] text-dim">{t.projects.privateRepo}</span>
        )}
        {p.demoUrl && url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 text-[13px] font-semibold text-fog transition-colors hover:border-accent/40 hover:text-accent"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.2.67.8.55A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
            GitHub
          </a>
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
          <p className="mt-3 max-w-2xl text-[15px] text-muted">{t.projects.subtitle}</p>
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
          <h2 className="font-display text-2xl font-bold tracking-tight text-fog">{t.projects.moreTitle}</h2>
          <p className="mt-2 text-[14px] text-muted">{t.projects.moreSubtitle}</p>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={t.projects.moreTitle}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`chip rounded-full border px-4 py-2 transition-colors ${
                  filter === f.id
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-line bg-tint/[0.02] text-dim hover:border-line hover:text-muted"
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
