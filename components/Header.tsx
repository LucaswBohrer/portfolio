"use client";

import { useLang, type Lang } from "@/lib/i18n";

export type TabId = "home" | "about" | "projects" | "experience" | "contact";

interface HeaderProps {
  tab: TabId;
  onTab: (t: TabId) => void;
}

const tabs: TabId[] = ["home", "about", "projects", "experience", "contact"];

export default function Header({ tab, onTab }: HeaderProps) {
  const { lang, setLang, t } = useLang();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#07090d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* brand */}
        <button
          onClick={() => onTab("home")}
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

        {/* tabs */}
        <nav className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1" aria-label="Sections">
          {tabs.map((id) => (
            <button
              key={id}
              onClick={() => onTab(id)}
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

        {/* language switch */}
        <div
          className="flex items-center rounded-full border border-white/[0.07] bg-white/[0.03] p-1"
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
      </div>
    </header>
  );
}
