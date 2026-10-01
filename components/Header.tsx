"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, type Lang } from "@/lib/i18n";

export type TabId = "home" | "about" | "projects" | "playground" | "experience" | "contact";

interface HeaderProps {
  tab: TabId;
  onTab: (t: TabId) => void;
}

const tabs: TabId[] = ["home", "about", "projects", "playground", "experience", "contact"];

export default function Header({ tab, onTab }: HeaderProps) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const go = (id: TabId) => {
    onTab(id);
    setOpen(false);
  };

  // Fecha com Escape e devolve o foco ao botão
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open ]);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open ]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#07090d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* brand */}
        <button
          onClick={() => go("home")}
          className="group flex items-center gap-3"
          aria-label="Lucas Welter Bohrer — home"
        >
          <span className="font-display flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-400/10 text-sm font-bold text-cyan-300 transition-colors group-hover:bg-cyan-400/20">
            LW
          </span>
          <span className="font-display hidden text-[15px] font-semibold tracking-tight text-white sm:block">
            Lucas Welter Bohrer
          </span>
        </button>

        {/* tabs — desktop */}
        <nav
          className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1 md:flex"
          aria-label="Sections"
        >
          {tabs.map((id) => (
            <button
              key={id}
              onClick={() => onTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={`relative rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors sm:px-4 ${
                tab === id ? "text-[#07090d]" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === id && (
                <span className="absolute inset-0 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(56,225,255,0.45)]" />
              )}
              <span className="relative z-10">{t.nav[id]}</span>
            </button>
          ))}
        </nav>

        {/* language switch — desktop */}
        <div
          className="hidden items-center rounded-full border border-white/[0.07] bg-white/[0.03] p-1 md:flex"
          role="group"
          aria-label="Language / Idioma"
        >
          {(["pt", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`rounded-full px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                lang === l ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* hamburger — mobile */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            ref={buttonRef}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.menu.close : t.menu.open}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-slate-300 transition-colors hover:text-white"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {open && (
            <div
              id="mobile-menu"
              className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl border border-white/10 bg-[#0c0f16]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <nav aria-label="Sections">
                <ul className="flex flex-col gap-0.5">
                  {tabs.map((id) => (
                    <li key={id}>
                      <button
                        onClick={() => go(id)}
                        aria-current={tab === id ? "page" : undefined}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-[15px] font-medium transition-colors ${
                          tab === id
                            ? "bg-cyan-400/15 text-cyan-300"
                            : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        {t.nav[id]}
                        {tab === id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-2 border-t border-white/[0.07] pt-2">
                <div
                  className="flex items-center justify-between px-4 py-1.5"
                  role="group"
                  aria-label={t.menu.language}
                >
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                    {t.menu.language}
                  </span>
                  <div className="flex gap-1">
                    {(["pt", "en"] as Lang[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        aria-pressed={lang === l}
                        className={`rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                          lang === l ? "bg-cyan-400/20 text-cyan-300" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
