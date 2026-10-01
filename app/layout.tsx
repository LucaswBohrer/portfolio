import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_URL = "https://portfolio-flax-two-28.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lucas Welter Bohrer — AI Engineering Student · Automation & Embedded Systems",
    template: "%s · Lucas Welter Bohrer",
  },
  description:
    "Portfólio de Lucas Welter Bohrer: estudante de Engenharia de IA (FIAP) e Engenharia Elétrica (Feevale). Agentes de IA, automação, APIs, sistemas embarcados e IoT — do circuito ao deploy.",
  alternates: {
    canonical: SITE_URL,
  },
  authors: [{ name: "Lucas Welter Bohrer" }],
  openGraph: {
    title: "Lucas Welter Bohrer — AI Engineering Student · Automation & Embedded Systems",
    description: "Agentes de IA, automação, sistemas embarcados e IoT. Do circuito ao deploy.",
    url: SITE_URL,
    siteName: "Lucas Welter Bohrer — Portfólio",
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lucas Welter Bohrer — AI Engineering Student · Automation & Embedded Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Welter Bohrer — AI Engineering Student · Automation & Embedded Systems",
    description: "Agentes de IA, automação, sistemas embarcados e IoT. Do circuito ao deploy.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}#person`,
      name: "Lucas Welter Bohrer",
      jobTitle: "AI Engineering Student",
      description:
        "Estudante de Engenharia de IA (FIAP) e Engenharia Elétrica (Feevale). Agentes de IA, automação, APIs, sistemas embarcados e IoT.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Novo Hamburgo",
        addressRegion: "RS",
        addressCountry: "BR",
      },
      email: "mailto:bohrer.welter.lucas@gmail.com",
      url: SITE_URL,
      sameAs: ["https://github.com/LucaswBohrer"],
      knowsAbout: ["AI Agents", "Automation", "Embedded Systems", "IoT", "Python", "TypeScript", "APIs"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "Lucas Welter Bohrer — Portfólio",
      inLanguage: ["pt-BR", "en"],
      author: { "@id": `${SITE_URL}#person` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
