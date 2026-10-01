"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { projects, type Project } from "@/lib/projects";
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

function useSpotlight() {
  return useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const { lang, t } = useLang();
  const onMove = useSpotlight();

  return (
    <Reveal delay={(index % 3) * 90}>
      <div
        onMouseMove={onMove}
        className="spotlight-card hairline group flex h-full flex-col rounded-2xl bg-[#0c0f16]/85 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/25"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-code rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300">
            {p.language}
          </span>
          {p.featured && (
            <span className="chip rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-cyan-300">
              {t.projects.featured}
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-bold tracking-tight text-white transition-colors group-hover:text-cyan-200">
          {p.title[lang]}
        </h3>
        <p className="mt-2.5 flex-1 text-[14px] leading-relaxed text-slate-400">{p.description[lang]}</p>

        <ul className="mt-4 space-y-1.5">
          {p.highlights[lang].map((h) => (
            <li key={h} className="flex items-center gap-2 text-[13px] text-slate-500">
              <span className="h-1 w-1 rounded-full bg-cyan-300/70" />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.tags.map((tag) => (
            <span key={tag} className="font-code rounded bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-500">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 border-t border-white/[0.07] pt-4">
          {p.repo ? (
            <a
              href={`https://github.com/${p.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display inline-flex items-center gap-2 text-[14px] font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
            >
              {t.projects.viewRepo}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          ) : (
            <span className="font-code inline-flex items-center gap-2 text-[12px] text-slate-600">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
              {t.projects.privateRepo}
            </span>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects() {
  const { t } = useLang();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <SectionHead eyebrow={t.projects.eyebrow} title={t.projects.title} />
      <Reveal delay={100}>
        <p className="mt-3 max-w-2xl text-[15px] text-slate-500">{t.projects.subtitle}</p>
      </Reveal>

      <Reveal delay={180}>
        <div className="mt-8">
          <RepoListTerminal />
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {featured.map((p, i) => (
          <ProjectCard key={p.slug} p={p} index={i} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <ProjectCard key={p.slug} p={p} index={i} />
        ))}
      </div>
    </div>
  );
}
