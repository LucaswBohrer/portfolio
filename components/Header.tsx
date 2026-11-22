"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, type Lang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export type TabId = "home" | "about" | "projects" | "playground" | "experience" | "contact";

interface HeaderProps {
  tab: TabId;
  onTab: (t: TabId) => void;
}

const tabs: TabId[] = ["home", "about", "projects", "playground", "experience", "contact"];

export default function Header({ tab, onTab }: HeaderProps) {
  const { lang, setLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* brand */}
        <button
          onClick={() => go("home")}
          className="group flex items-center gap-3"
          aria-label="Lucas Welter Bohrer — home"
        >
          <span className="font-display flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-sm font-bold text-accent transition-colors group-hover:bg-accent/20">
            LW
          </span>
          <span className="font-display hidden text-[15px] font-semibold tracking-tight text-fog sm:block">
            Lucas Welter Bohrer
          </span>
        </button>

        {/* tabs — desktop */}
        <nav
          className="hidden items-center gap-1 rounded-full border border-line bg-tint/[0.03] p-1 md:flex"
          aria-label="Sections"
        >
          {tabs.map((id) => (
            <button
              key={id}
              onClick={() => onTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={`relative rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors sm:px-4 ${
                tab === id ? "text-ink" : "text-muted hover:text-fog"
              }`}
            >
              {tab === id && (
                <span className="absolute inset-0 rounded-full bg-accent shadow-[0_0_18px_rgba(56,225,255,0.45)]" />
              )}
              <span className="relative z-10">{t.nav[id]}</span>
            </button>
          ))}
        </nav>

        {/* theme + language — desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggleTheme}
            aria-label={t.theme.toggle}
            title={t.theme.toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-tint/[0.03] text-muted transition-colors hover:text-fog"
          >
            {theme === "dark" ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
              </svg>
            )}
          </button>
          <div
            className="flex items-center rounded-full border border-line bg-tint/[0.03] p-1"
            role="group"
            aria-label="Language / Idioma"
          >
            {(["pt", "en", "es"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                  lang === l ? "bg-tint/15 text-fog" : "text-dim hover:text-muted"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* hamburger — mobile */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            ref={buttonRef}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.menu.close : t.menu.open}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-tint/[0.03] text-muted transition-colors hover:text-fog"
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
              className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl border border-line bg-surface/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
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
                            ? "bg-accent/15 text-accent"
                            : "text-muted hover:bg-tint/[0.06] hover:text-fog"
                        }`}
                      >
                        {t.nav[id]}
                        {tab === id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-2 border-t border-line pt-2">
                <div
                  className="flex items-center justify-between px-4 py-1.5"
                  role="group"
                  aria-label={t.menu.language}
                >
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-dim">
                    {t.menu.language}
                  </span>
                  <div className="flex gap-1">
                    {(["pt", "en", "es"] as Lang[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        aria-pressed={lang === l}
                        className={`rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                          lang === l ? "bg-accent/20 text-accent" : "text-dim hover:text-muted"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-1.5">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-dim">
                    {t.theme.label}
                  </span>
                  <button
                    onClick={toggleTheme}
                    aria-label={t.theme.toggle}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-tint/[0.03] text-muted transition-colors hover:text-fog"
                  >
                    {theme === "dark" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
