"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict } | null>(null);

export interface Dict {
  nav: { home: string; about: string; projects: string; experience: string; contact: string };
  hero: {
    eyebrow: string;
    role: string;
    intro: string;
    ctaProjects: string;
    ctaContact: string;
    stats: { label1: string; label2: string; label3: string };
    terminalTitle: string;
    available: string;
  };
  about: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
    educationTitle: string;
    skillsTitle: string;
    languagesTitle: string;
    skillGroups: { title: string; items: string[] }[];
    education: { school: string; course: string; period: string; note: string }[];
    languages: { lang: string; level: string }[];
    neofetch: {
      user: string;
      degree: string;
      degreeValue: string;
      stack: string;
      stackValue: string;
      focus: string;
      focusValue: string;
      base: string;
      baseValue: string;
    };
  };
  projects: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewRepo: string;
    privateRepo: string;
    featured: string;
    updated: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    subtitle: string;
    jobs: { role: string; company: string; period: string; location: string; bullets: string[] }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    githubLabel: string;
    cvLabel: string;
    cvHint: string;
    sendEmail: string;
  };
  footer: { rights: string; builtWith: string };
}

const pt: Dict = {
  nav: { home: "Início", about: "Sobre", projects: "Projetos", experience: "Experiência", contact: "Contato" },
  hero: {
    eyebrow: "Portfólio · 2026",
    role: "AI & Technology Engineer",
    intro:
      "Estudante de Inteligência Artificial (FIAP) e Engenharia Elétrica (Feevale) que aprende construindo: agentes de IA, automação, sistemas embarcados e plataformas full-stack. Do circuito ao deploy.",
    ctaProjects: "Ver projetos",
    ctaContact: "Entrar em contato",
    stats: { label1: "repositórios públicos", label2: "anos em eletrônica", label3: "graduações em curso" },
    terminalTitle: "perfil.ts",
    available: "Disponível para projetos e estágios",
  },
  about: {
    eyebrow: "Sobre",
    title: "Engenheiro em formação, builder por natureza.",
    p1: "Sou estudante de Tecnologia em Inteligência Artificial na FIAP e de Engenharia Elétrica na Universidade Feevale, com base prática sólida em eletrônica — atuo desde 2021 com manutenção e diagnóstico de hardware na Eletrônica Digital, e hoje também como estagiário de Engenharia Elétrica na E2PS.",
    p2: "Meu jeito de aprender é construir: plataformas de monitoramento elétrico com IA, agentes inteligentes, automação industrial, sistemas embarcados e robótica. Gosto de ir da causa raiz ao sistema funcionando — do circuito à API, do protótipo ao deploy.",
    educationTitle: "Formação",
    skillsTitle: "Habilidades técnicas",
    languagesTitle: "Idiomas",
    neofetch: {
      user: "lucas@dev",
      degree: "Formação",
      degreeValue: "FIAP · Feevale",
      stack: "Stack",
      stackValue: "Python · TypeScript",
      focus: "Foco",
      focusValue: "IA · automação · sistemas",
      base: "Base",
      baseValue: "eletrônica · circuitos",
    },
    skillGroups: [
      {
        title: "IA & Automação",
        items: ["Agentes de IA", "IA Generativa", "Prompt Engineering", "Desenvolvimento assistido por IA", "Indústria 4.0"],
      },
      {
        title: "Software & Web",
        items: ["Python", "TypeScript", "Full-Stack", "Git & GitHub", "Debugging"],
      },
      {
        title: "APIs & Sistemas",
        items: ["REST APIs", "HTTP / JSON", "Arquitetura cliente-servidor", "Integração de sistemas"],
      },
      {
        title: "Engenharia & Hardware",
        items: ["Manutenção eletrônica", "Análise de circuitos", "Microcontroladores", "Modelagem 3D / CAD", "Prototipagem rápida"],
      },
    ],
    education: [
      {
        school: "FIAP — Brasil",
        course: "Tecnólogo em Inteligência Artificial",
        period: "2026 — em curso",
        note: "Foco em agentes de IA, IA generativa e automação.",
      },
      {
        school: "Universidade Feevale — Brasil",
        course: "Bacharelado em Engenharia Elétrica",
        period: "2026 — em curso",
        note: "Base em circuitos, sistemas elétricos e engenharia.",
      },
      {
        school: "Escola META — Brasil",
        course: "Formação Profissional em Eletrônica",
        period: "Concluído",
        note: "Foco em análise de circuitos e troubleshooting.",
      },
    ],
    languages: [
      { lang: "Português", level: "Nativo" },
      { lang: "Inglês", level: "B2 · Intermediário-avançado" },
    ],
  },
  projects: {
    eyebrow: "Projetos",
    title: "Trabalho selecionado.",
    subtitle: "Uma curadoria dos meus repositórios públicos no GitHub — sistemas reais, não demos de mentira.",
    viewRepo: "Ver repositório",
    privateRepo: "Repositório privado",
    featured: "Destaque",
    updated: "atualizado em",
  },
  experience: {
    eyebrow: "Experiência",
    title: "Onde já atuei.",
    subtitle: "Trajetória profissional até aqui.",
    jobs: [
      {
        role: "Estagiário de Engenharia Elétrica",
        company: "E2PS",
        period: "2026 — atual",
        location: "Remoto · Brasil",
        bullets: [
          "Apoio a atividades de engenharia e documentação técnica em ambiente remoto profissional.",
          "Trabalho com informação técnica estruturada, documentação e processos ligados a tecnologia.",
          "Contribuição em projetos técnicos com análise, organização e resolução de problemas.",
        ],
      },
      {
        role: "Técnico em Manutenção Eletrônica",
        company: "Eletrônica Digital",
        period: "2021 — atual",
        location: "Brasil",
        bullets: [
          "Diagnóstico e reparo de hardware complexo, com análise de falhas e soluções práticas.",
          "Atendimento técnico direto ao cliente, traduzindo problemas complexos de forma clara.",
          "Gestão de múltiplas demandas técnicas com priorização por criticidade.",
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos construir algo juntos?",
    subtitle: "Estou aberto a estágios, projetos freelance e colaborações em IA, automação e engenharia.",
    emailLabel: "E-mail",
    phoneLabel: "Telefone",
    locationLabel: "Localização",
    githubLabel: "GitHub",
    cvLabel: "Baixar currículo",
    cvHint: "PDF · atualizado em 2026",
    sendEmail: "Enviar e-mail",
  },
  footer: { rights: "Todos os direitos reservados.", builtWith: "Construído com Next.js, React e Tailwind CSS." },
};

const en: Dict = {
  nav: { home: "Home", about: "About", projects: "Projects", experience: "Experience", contact: "Contact" },
  hero: {
    eyebrow: "Portfolio · 2026",
    role: "AI & Technology Engineer",
    intro:
      "AI Technology (FIAP) and Electrical Engineering (Feevale) student who learns by building: AI agents, automation, embedded systems and full-stack platforms. From circuit to deploy.",
    ctaProjects: "View projects",
    ctaContact: "Get in touch",
    stats: { label1: "public repositories", label2: "years in electronics", label3: "degrees in progress" },
    terminalTitle: "profile.ts",
    available: "Open to projects and internships",
  },
  about: {
    eyebrow: "About",
    title: "Engineer in training, builder by nature.",
    p1: "I'm an Artificial Intelligence Technology student at FIAP and an Electrical Engineering undergrad at Universidade Feevale, with a solid hands-on background in electronics — working since 2021 with hardware maintenance and diagnostics at Eletrônica Digital, and now also as an Electrical Engineering intern at E2PS.",
    p2: "My way of learning is building: AI-powered electrical monitoring platforms, intelligent agents, industrial automation, embedded systems and robotics. I like going from root cause to working system — from circuit to API, from prototype to deploy.",
    educationTitle: "Education",
    skillsTitle: "Technical skills",
    languagesTitle: "Languages",
    neofetch: {
      user: "lucas@dev",
      degree: "Education",
      degreeValue: "FIAP · Feevale",
      stack: "Stack",
      stackValue: "Python · TypeScript",
      focus: "Focus",
      focusValue: "AI · automation · systems",
      base: "Background",
      baseValue: "electronics · circuits",
    },
    skillGroups: [
      {
        title: "AI & Automation",
        items: ["AI Agents", "Generative AI", "Prompt Engineering", "AI-Assisted Development", "Industry 4.0"],
      },
      {
        title: "Software & Web",
        items: ["Python", "TypeScript", "Full-Stack", "Git & GitHub", "Debugging"],
      },
      {
        title: "APIs & Systems",
        items: ["REST APIs", "HTTP / JSON", "Client-server architecture", "Systems integration"],
      },
      {
        title: "Engineering & Hardware",
        items: ["Electronics maintenance", "Circuit analysis", "Microcontrollers", "3D Modeling / CAD", "Rapid prototyping"],
      },
    ],
    education: [
      {
        school: "FIAP — Brazil",
        course: "Technology Degree in Artificial Intelligence",
        period: "2026 — in progress",
        note: "Focused on AI agents, generative AI and automation.",
      },
      {
        school: "Universidade Feevale — Brazil",
        course: "Bachelor's in Electrical Engineering",
        period: "2026 — in progress",
        note: "Foundation in circuits, electrical systems and engineering.",
      },
      {
        school: "Escola META — Brazil",
        course: "Professional Electronics Training",
        period: "Completed",
        note: "Focused on circuit analysis & troubleshooting.",
      },
    ],
    languages: [
      { lang: "Portuguese", level: "Native" },
      { lang: "English", level: "B2 · Upper-intermediate" },
    ],
  },
  projects: {
    eyebrow: "Projects",
    title: "Selected work.",
    subtitle: "A curated view of my public GitHub repositories — real systems, not fake demos.",
    viewRepo: "View repository",
    privateRepo: "Private repository",
    featured: "Featured",
    updated: "updated",
  },
  experience: {
    eyebrow: "Experience",
    title: "Where I've worked.",
    subtitle: "My professional path so far.",
    jobs: [
      {
        role: "Electrical Engineering Intern",
        company: "E2PS",
        period: "2026 — present",
        location: "Remote · Brazil",
        bullets: [
          "Support engineering activities and technical documentation in a professional remote environment.",
          "Work with structured technical information, documentation and technology-related processes.",
          "Contribute to technical projects requiring analysis, organization and problem-solving.",
        ],
      },
      {
        role: "Electronics Maintenance Technician",
        company: "Eletrônica Digital",
        period: "2021 — present",
        location: "Brazil",
        bullets: [
          "Diagnose and repair complex hardware, analyzing failures to implement practical solutions.",
          "Direct technical support to customers, explaining complex issues clearly.",
          "Manage multiple technical requests, prioritizing by criticality.",
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's build something together?",
    subtitle: "I'm open to internships, freelance projects and collaborations in AI, automation and engineering.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    locationLabel: "Location",
    githubLabel: "GitHub",
    cvLabel: "Download résumé",
    cvHint: "PDF · updated 2026",
    sendEmail: "Send email",
  },
  footer: { rights: "All rights reserved.", builtWith: "Built with Next.js, React and Tailwind CSS." },
};

export const dictionaries: Record<Lang, Dict> = { pt, en };

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-lang");
    if (saved === "pt" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("portfolio-lang", l);
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
  };

  return <LangContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
