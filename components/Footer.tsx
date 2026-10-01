"use client";

import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative z-10 border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-left">
        <p className="font-code text-[12px] text-slate-600">
          © 2026 Lucas Welter Bohrer · {t.footer.rights}
        </p>
        <p className="font-code text-[12px] text-cyan-300/70">{t.footer.tagline}</p>
        <p className="font-code text-[11.5px] text-slate-700">{t.footer.builtWith}</p>
      </div>
    </footer>
  );
}
