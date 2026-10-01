"use client";

import { useEffect, useState } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  wordDelay?: number;
}

/** Staggered word reveal, reactbits SplitText-style */
export default function SplitText({ text, className = "", wordDelay = 70 }: SplitTextProps) {
  const [visible, setVisible] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <span
            className="inline-block transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: visible ? "translateY(0)" : "translateY(110%)",
              opacity: visible ? 1 : 0,
              transitionDelay: `${i * wordDelay}ms`,
            }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
