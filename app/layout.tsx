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

export const metadata: Metadata = {
  title: "Lucas Welter Bohrer — AI & Technology Engineer",
  description:
    "Portfólio de Lucas Welter Bohrer: engenheiro de IA e tecnologia. Projetos em agentes de IA, automação, sistemas embarcados e plataformas full-stack.",
  keywords: ["Lucas Welter Bohrer", "AI Engineer", "portfólio", "automação", "NEXUS", "JARVIS"],
  authors: [{ name: "Lucas Welter Bohrer" }],
  openGraph: {
    title: "Lucas Welter Bohrer — AI & Technology Engineer",
    description: "Projetos em IA, automação e engenharia. Do circuito ao deploy.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
