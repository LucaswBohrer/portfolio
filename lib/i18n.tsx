"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict } | null>(null);

export interface CaseStudyDict {
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  role: string;
  architecture: string;
  challenge: string;
  result: string;
  status: string;
  stack: string[];
  mediaAlt: string;
  /** optional product gallery (real screenshots); captions are localized */
  gallery?: { src: string; width: number; height: number; alt: string; caption: string }[];
  galleryDiagramCaption?: string;
  /** optional demo/run note, e.g. "Local demo available in the repo README." */
  demo?: string;
}

export interface Dict {
  nav: { home: string; about: string; projects: string; playground: string; experience: string; contact: string };
  menu: { open: string; close: string; language: string };
  hero: {
    eyebrow: string;
    role: string;
    intro: string;
    ctaProjects: string;
    ctaContact: string;
    stats: { label1: string; label2: string; label3: string };
    terminalTitle: string;
    available: string;
    servicesEyebrow: string;
    servicesTitle: string;
    servicesSubtitle: string;
    services: { title: string; desc: string; tags: string[] }[];
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
    viewCase: string;
    hideCase: string;
    privateRepo: string;
    featured: string;
    updated: string;
    filters: { all: string; ai: string; automation: string; web: string; embedded: string; systems: string };
    moreTitle: string;
    moreSubtitle: string;
    caseLabels: {
      problem: string;
      solution: string;
      role: string;
      architecture: string;
      challenge: string;
      result: string;
      demo: string;
      status: string;
      stack: string;
      links: string;
    };
    galleryTitle: string;
    testCount: {
      validated: string;
      lastVerified: string;
      fallback: string;
      viewRun: string;
      ariaExplainer: string;
    };
  };
  caseStudies: {
    nexus: CaseStudyDict;
    jarvis: CaseStudyDict;
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
    whatsappMessage: string;
    intentsTitle: string;
    intents: { label: string; desc: string; subject: string }[];
  };
  footer: { rights: string; builtWith: string; tagline: string };
  terminal: {
    title: string;
    hint: string;
    inputLabel: string;
    helpIntro: string;
    help: { cmd: string; desc: string }[];
    unknown: string;
    tryHelp: string;
    projectsIntro: string;
    projectUsage: string;
    projectNotFound: string;
    stackLabel: string;
    highlightsLabel: string;
    repoLabel: string;
    languageLabel: string;
    contactTitle: string;
    skillsTitle: string;
    expTitle: string;
    bootFocus: string[];
    bootStack: string[];
    bootBase: string;
    sudoEgg: string;
    editorEgg: string;
    rmEgg: string;
    exitEgg: string;
  };
  playground: {
    eyebrow: string;
    title: string;
    subtitle: string;
    examplesLabel: string;
    assemble: string;
    run: string;
    step: string;
    reset: string;
    stop: string;
    editorLabel: string;
    consoleLabel: string;
    regsLabel: string;
    disasmLabel: string;
    stackLabel: string;
    stdinLabel: string;
    stdinPlaceholder: string;
    statusIdle: string;
    statusAssembled: string;
    statusRunning: string;
    statusHalted: string;
    statusFatal: string;
    haltedMsg: string;
    stepsLabel: string;
    bytesLabel: string;
    consoleHint: string;
    stackEmpty: string;
  };
}

const pt: Dict = {
  nav: { home: "Início", about: "Sobre", projects: "Projetos", playground: "Playground", experience: "Experiência", contact: "Contato" },
  menu: { open: "Abrir menu", close: "Fechar menu", language: "Idioma" },
  hero: {
    eyebrow: "Portfólio · 2026",
    role: "Estudante de Engenharia de IA · Automação & Sistemas Embarcados",
    intro:
      "Construo agentes de IA, automações e sistemas embarcados — do circuito ao deploy.",
    ctaProjects: "Ver projetos",
    ctaContact: "Entrar em contato",
    stats: { label1: "repositórios públicos", label2: "anos em eletrônica", label3: "graduações em curso" },
    terminalTitle: "perfil.ts",
    available: "Disponível para projetos e estágios",
    servicesEyebrow: "Como posso ajudar",
    servicesTitle: "Três formas de gerar valor.",
    servicesSubtitle:
      "Sou estudante — e é exatamente por isso que entrego com seriedade: escopo claro, comunicação direta e código que funciona.",
    services: [
      {
        title: "Agentes e automação com IA",
        desc: "Assistentes, agentes e fluxos automatizados que resolvem tarefas reais: atendimento, triagem, integração com APIs e ferramentas do dia a dia.",
        tags: ["Agentes de IA", "Automações", "Integrações"],
      },
      {
        title: "APIs e plataformas full-stack",
        desc: "Back-ends em Python, integrações e dashboards web: do modelo de dados à interface, com foco em clareza e manutenção.",
        tags: ["Python", "REST APIs", "Dashboards"],
      },
      {
        title: "Protótipos embarcados e IoT",
        desc: "Do esquemático ao firmware: ESP32, sensores e telemetria conectados a software — eletrônica que conversa com a nuvem.",
        tags: ["ESP32", "Sensores", "Telemetria"],
      },
    ],
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
    subtitle: "Dois cases em profundidade e uma seleção de repositórios — sistemas reais, não demos de mentira.",
    viewRepo: "Ver repositório",
    viewCase: "Ver case",
    hideCase: "Ocultar case",
    privateRepo: "Repositório privado",
    featured: "Destaque",
    updated: "atualizado em",
    filters: { all: "Todos", ai: "IA", automation: "Automação", web: "Web", embedded: "Embarcados", systems: "Sistemas" },
    moreTitle: "Mais repositórios",
    moreSubtitle: "Projetos complementares — filtre por área de interesse.",
    caseLabels: {
      problem: "Problema",
      solution: "Solução",
      role: "Meu papel",
      architecture: "Arquitetura",
      challenge: "Desafio técnico",
      result: "Resultado",
      demo: "Demo",
      status: "Status",
      stack: "Stack",
      links: "Links",
    },
    galleryTitle: "Galeria do produto",
    testCount: {
      validated: "testes automatizados validados",
      lastVerified: "Última validação",
      fallback: "Suíte de testes verificada no CI",
      viewRun: "ver execução no CI",
      ariaExplainer:
        "Número de testes coletados automaticamente pelo pytest na última execução bem-sucedida do CI",
    },
  },
  caseStudies: {
    nexus: {
      name: "NEXUS",
      tagline: "Plataforma de inteligência elétrica — do monitoramento ao diagnóstico.",
      problem:
        "Monitorar sistemas elétricos em tempo real exige unir telemetria, diagnóstico e visualização em uma plataforma confiável — sem depender de soluções caras e fechadas.",
      solution:
        "Plataforma full-stack de inteligência elétrica: coleta e simulação de telemetria, diagnósticos e dashboards em tempo real, com API HTTP versionada.",
      role: "Autor e desenvolvedor único — arquitetura, back-end, front-end e simulação de telemetria.",
      architecture:
        "Back-end em Python (FastAPI) com API versionada · simulação de telemetria · front-end web com dashboards em tempo real.",
      challenge:
        "Manter dados de telemetria consistentes e em tempo real entre simulação, API e interface — sem valores falsos no dashboard.",
      result:
        "Plataforma funcional com fluxo completo de simulação, API, dashboards e diagnósticos, evoluída em múltiplas fases.",
      demo: "Demo local disponível no README do repositório.",
      status: "Em desenvolvimento ativo",
      stack: ["Python", "FastAPI", "SQLite", "Web", "Telemetria"],
      mediaAlt: "Dashboard do NEXUS exibindo telemetria elétrica em tempo real",
      gallery: [
        {
          src: "/cases/nexus-monitor.png",
          width: 1591,
          height: 650,
          alt: "Monitor do NEXUS com telemetria em tempo real e gráfico de potência ativa recente",
          caption: "Monitor — telemetria em tempo real via SSE",
        },
        {
          src: "/cases/nexus-equipamentos.png",
          width: 1592,
          height: 681,
          alt: "Tela de equipamentos do NEXUS com gestão multi-equipment e última leitura por equipamento",
          caption: "Equipamentos — gestão multi-equipment (fase 2.4)",
        },
      ],
      galleryDiagramCaption: "Arquitetura — simulação → API → dashboards",
    },
    jarvis: {
      name: "JARVIS",
      tagline: "Plataforma pessoal de IA — orquestração com memória e permissões explícitas.",
      problem:
        "Ferramentas de IA genéricas não conhecem meu contexto: projetos, decisões e rotina. Eu queria um sistema pessoal que orquestrasse tarefas com memória e permissões explícitas.",
      solution:
        "Plataforma pessoal de IA local-first: máquina de estados de tarefas, memória tipada, política de permissões deny-by-default e integração com o NEXUS via API.",
      role: "Autor — arquitetura, contratos, engine de orquestração, política de segurança e interface web.",
      architecture:
        "Core em Python (Pydantic, SQLite + FTS5, Alembic) · pipeline ToolRequest → Policy → Executor → Verifier → AuditLog · adaptador HTTP para o NEXUS · shell web em arquivo único.",
      challenge:
        "Garantir que a automação nunca execute nada sem permissão explícita — política e auditoria antes de qualquer escrita.",
      result:
        "Fases 1–3 implementadas e validadas — pipeline vertical completo funcionando com dados reais.",
      status: "Em evolução — fases 1–3 concluídas",
      stack: ["Python", "Pydantic", "SQLite", "FastAPI", "Vanilla JS"],
      mediaAlt: "Interface do JARVIS — centro de comando com orbe de status",
    },
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
    subtitle: "Escolha o assunto e me chame — respondo com escopo e próximos passos, não com enrolação.",
    emailLabel: "E-mail",
    phoneLabel: "Telefone",
    locationLabel: "Localização",
    githubLabel: "GitHub",
    cvLabel: "Baixar currículo",
    cvHint: "PDF · atualizado em 2026",
    sendEmail: "Enviar e-mail",
    whatsappMessage: "Olá! Vim pelo seu portfólio e gostaria de conversar.",
    intentsTitle: "Como quer começar?",
    intents: [
      {
        label: "Quero conversar sobre um projeto",
        desc: "Ideia, automação ou protótipo — me conte o problema que quer resolver.",
        subject: "Projeto — quero conversar sobre uma ideia",
      },
      {
        label: "Ver disponibilidade para estágio",
        desc: "Estágio ou posição júnior em IA, automação, software ou engenharia.",
        subject: "Estágio — disponibilidade",
      },
      {
        label: "Falar sobre IA e automação",
        desc: "Dúvidas, colaborações ou parcerias em IA aplicada e automação.",
        subject: "IA e automação — contato",
      },
    ],
  },
  footer: {
    rights: "Todos os direitos reservados.",
    builtWith: "Construído com Next.js, React e Tailwind CSS.",
    tagline: "Do circuito ao deploy.",
  },
  terminal: {
    title: "terminal — lucas@dev",
    hint: "Terminal interativo — digite `help` e tecle Enter.",
    inputLabel: "Terminal interativo — digite um comando e tecle Enter",
    helpIntro: "Comandos disponíveis:",
    help: [
      { cmd: "help", desc: "mostra esta ajuda" },
      { cmd: "whoami", desc: "quem é o Lucas" },
      { cmd: "projetos", desc: "lista os projetos do portfólio" },
      { cmd: "projeto <nome>", desc: "detalhes de um projeto · ex: projeto aurora-vm" },
      { cmd: "skills", desc: "habilidades técnicas" },
      { cmd: "experiencia", desc: "trajetória profissional" },
      { cmd: "contato", desc: "como falar comigo" },
      { cmd: "neofetch", desc: "ficha rápida do sistema" },
      { cmd: "cv", desc: "link para o currículo em PDF" },
      { cmd: "echo <texto>", desc: "repete o texto (clássico)" },
      { cmd: "clear", desc: "limpa o terminal" },
    ],
    unknown: "comando não encontrado: {cmd}",
    tryHelp: "Digite `help` para ver os comandos disponíveis.",
    projectsIntro: "{n} projetos no portfólio — use `projeto <nome>` para detalhes:",
    projectUsage: "uso: projeto <nome> · ex: projeto aurora-vm",
    projectNotFound: "projeto não encontrado: {cmd}",
    stackLabel: "stack",
    highlightsLabel: "destaques",
    repoLabel: "repo",
    languageLabel: "linguagem",
    contactTitle: "contato —",
    skillsTitle: "habilidades —",
    expTitle: "experiência —",
    bootFocus: ["IA", "automação", "sistemas"],
    bootStack: ["Python", "TypeScript", "APIs"],
    bootBase: "circuitos → deploy",
    sudoEgg: "permission denied: por aqui ninguém tem sudo. Nem eu.",
    editorEgg: "sem editores de texto por aqui — tente `help`.",
    rmEgg: "boa tentativa. Nada foi apagado (não havia nada para apagar).",
    exitEgg: "este terminal não tem saída. Só explorando mesmo.",
  },
  playground: {
    eyebrow: "AURORA VM · jogável",
    title: "Rode a VM no navegador",
    subtitle:
      "O núcleo da AURORA VM — assembler + CPU de 43 instruções — portado para TypeScript e rodando 100% no seu navegador. Escreva Assembly, monte, execute passo a passo e inspecione registradores, flags, stack e disassembly.",
    examplesLabel: "Exemplos",
    assemble: "Montar",
    run: "Executar",
    step: "Passo",
    reset: "Resetar",
    stop: "Parar",
    editorLabel: "Editor Assembly",
    consoleLabel: "Console",
    regsLabel: "Registradores",
    disasmLabel: "Disassembly",
    stackLabel: "Stack",
    stdinLabel: "stdin (para IN)",
    stdinPlaceholder: "bytes de entrada…",
    statusIdle: "edite o código e monte para começar",
    statusAssembled: "montado — pronto para executar",
    statusRunning: "executando…",
    statusHalted: "terminou",
    statusFatal: "erro fatal",
    haltedMsg: "terminated: NORMAL (HALT), exit code {n}",
    stepsLabel: "passos",
    bytesLabel: "bytes",
    consoleHint: "A saída do programa (OUT / OUTC) aparece aqui.",
    stackEmpty: "stack vazia",
  },
};

const en: Dict = {
  nav: { home: "Home", about: "About", projects: "Projects", playground: "Playground", experience: "Experience", contact: "Contact" },
  menu: { open: "Open menu", close: "Close menu", language: "Language" },
  hero: {
    eyebrow: "Portfolio · 2026",
    role: "AI Engineering Student · Automation & Embedded Systems",
    intro: "I build AI agents, automations, and embedded systems — from circuit to deploy.",
    ctaProjects: "View projects",
    ctaContact: "Get in touch",
    stats: { label1: "public repositories", label2: "years in electronics", label3: "degrees in progress" },
    terminalTitle: "profile.ts",
    available: "Open to projects and internships",
    servicesEyebrow: "How I can help",
    servicesTitle: "Three ways to create value.",
    servicesSubtitle:
      "I'm a student — and that's exactly why I deliver seriously: clear scope, direct communication, and code that works.",
    services: [
      {
        title: "AI agents & automation",
        desc: "Assistants, agents and automated workflows that solve real tasks: support, triage, API integrations and everyday tooling.",
        tags: ["AI Agents", "Automations", "Integrations"],
      },
      {
        title: "APIs & full-stack platforms",
        desc: "Python back-ends, integrations and web dashboards: from data model to interface, built for clarity and maintenance.",
        tags: ["Python", "REST APIs", "Dashboards"],
      },
      {
        title: "Embedded & IoT prototypes",
        desc: "From schematic to firmware: ESP32, sensors and telemetry wired to software — electronics that talk to the cloud.",
        tags: ["ESP32", "Sensors", "Telemetry"],
      },
    ],
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
    subtitle: "Two in-depth cases plus a curated set of repositories — real systems, not fake demos.",
    viewRepo: "View repository",
    viewCase: "View case",
    hideCase: "Hide case",
    privateRepo: "Private repository",
    featured: "Featured",
    updated: "updated",
    filters: { all: "All", ai: "AI", automation: "Automation", web: "Web", embedded: "Embedded", systems: "Systems" },
    moreTitle: "More repositories",
    moreSubtitle: "Complementary projects — filter by area of interest.",
    caseLabels: {
      problem: "Problem",
      solution: "Solution",
      role: "My role",
      architecture: "Architecture",
      challenge: "Technical challenge",
      result: "Result",
      demo: "Demo",
      status: "Status",
      stack: "Stack",
      links: "Links",
    },
    galleryTitle: "Product gallery",
    testCount: {
      validated: "automated tests validated",
      lastVerified: "Last verified",
      fallback: "Test suite verified in CI",
      viewRun: "view CI run",
      ariaExplainer:
        "Number of tests collected automatically by pytest in the last successful CI run",
    },
  },
  caseStudies: {
    nexus: {
      name: "NEXUS",
      tagline: "Electrical intelligence platform — from monitoring to diagnostics.",
      problem:
        "Monitoring electrical systems in real time means joining telemetry, diagnostics and visualization in one trustworthy platform — without depending on expensive, closed solutions.",
      solution:
        "Full-stack electrical intelligence platform: telemetry collection and simulation, diagnostics and real-time dashboards, with a versioned HTTP API.",
      role: "Sole author and developer — architecture, back-end, front-end and telemetry simulation.",
      architecture:
        "Python back-end (FastAPI) with versioned API · telemetry simulation · web front-end with real-time dashboards.",
      challenge:
        "Keeping telemetry data consistent and real-time across simulation, API and UI — with no fake dashboard values.",
      result:
        "Working platform with a complete simulation, API, dashboard and diagnostics flow, evolved across multiple phases.",
      demo: "Local demo available in the repository README.",
      status: "In active development",
      stack: ["Python", "FastAPI", "SQLite", "Web", "Telemetry"],
      mediaAlt: "NEXUS dashboard showing real-time electrical telemetry",
      gallery: [
        {
          src: "/cases/nexus-monitor.png",
          width: 1591,
          height: 650,
          alt: "NEXUS monitor with real-time telemetry and recent active power chart",
          caption: "Monitor — real-time telemetry over SSE",
        },
        {
          src: "/cases/nexus-equipamentos.png",
          width: 1592,
          height: 681,
          alt: "NEXUS equipment screen with multi-equipment management and last reading per equipment",
          caption: "Equipment — multi-equipment management (phase 2.4)",
        },
      ],
      galleryDiagramCaption: "Architecture — simulation → API → dashboards",
    },
    jarvis: {
      name: "JARVIS",
      tagline: "Personal AI platform — orchestration with memory and explicit permissions.",
      problem:
        "Generic AI tools don't know my context: projects, decisions and daily routine. I wanted a personal system to orchestrate tasks with memory and explicit permissions.",
      solution:
        "Local-first personal AI platform: task state machine, typed memory, deny-by-default permission policy and NEXUS integration via API.",
      role: "Author — architecture, contracts, orchestration engine, security policy and web interface.",
      architecture:
        "Python core (Pydantic, SQLite + FTS5, Alembic) · ToolRequest → Policy → Executor → Verifier → AuditLog pipeline · HTTP adapter for NEXUS · single-file web shell.",
      challenge:
        "Making sure automation never executes anything without explicit permission — policy and audit before any write.",
      result:
        "Phases 1–3 implemented and validated — full vertical pipeline working with real data.",
      status: "Evolving — phases 1–3 complete",
      stack: ["Python", "Pydantic", "SQLite", "FastAPI", "Vanilla JS"],
      mediaAlt: "JARVIS interface — command center with status orb",
    },
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
    subtitle: "Pick a subject and reach out — I reply with scope and next steps, not fluff.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    locationLabel: "Location",
    githubLabel: "GitHub",
    cvLabel: "Download résumé",
    cvHint: "PDF · updated 2026",
    sendEmail: "Send email",
    whatsappMessage: "Hi! I came from your portfolio and would like to chat.",
    intentsTitle: "How do you want to start?",
    intents: [
      {
        label: "Talk about a project",
        desc: "An idea, automation or prototype — tell me the problem you want to solve.",
        subject: "Project — let's talk about an idea",
      },
      {
        label: "Check internship availability",
        desc: "Internship or junior role in AI, automation, software or engineering.",
        subject: "Internship — availability",
      },
      {
        label: "Talk AI & automation",
        desc: "Questions, collaborations or partnerships in applied AI and automation.",
        subject: "AI & automation — contact",
      },
    ],
  },
  footer: {
    rights: "All rights reserved.",
    builtWith: "Built with Next.js, React and Tailwind CSS.",
    tagline: "From circuit to deploy.",
  },
  terminal: {
    title: "terminal — lucas@dev",
    hint: "Interactive terminal — type `help` and press Enter.",
    inputLabel: "Interactive terminal — type a command and press Enter",
    helpIntro: "Available commands:",
    help: [
      { cmd: "help", desc: "show this help" },
      { cmd: "whoami", desc: "who Lucas is" },
      { cmd: "projects", desc: "list portfolio projects" },
      { cmd: "project <name>", desc: "project details · e.g. project aurora-vm" },
      { cmd: "skills", desc: "technical skills" },
      { cmd: "experience", desc: "professional background" },
      { cmd: "contact", desc: "how to reach me" },
      { cmd: "neofetch", desc: "quick system sheet" },
      { cmd: "cv", desc: "link to the PDF résumé" },
      { cmd: "echo <text>", desc: "echo the text (classic)" },
      { cmd: "clear", desc: "clear the terminal" },
    ],
    unknown: "command not found: {cmd}",
    tryHelp: "Type `help` to see the available commands.",
    projectsIntro: "{n} portfolio projects — use `project <name>` for details:",
    projectUsage: "usage: project <name> · e.g. project aurora-vm",
    projectNotFound: "project not found: {cmd}",
    stackLabel: "stack",
    highlightsLabel: "highlights",
    repoLabel: "repo",
    languageLabel: "language",
    contactTitle: "contact —",
    skillsTitle: "skills —",
    expTitle: "experience —",
    bootFocus: ["AI", "automation", "systems"],
    bootStack: ["Python", "TypeScript", "APIs"],
    bootBase: "circuits → deploy",
    sudoEgg: "permission denied: nobody has sudo here. Not even me.",
    editorEgg: "no text editors around here — try `help`.",
    rmEgg: "nice try. Nothing was deleted (there was nothing to delete).",
    exitEgg: "this terminal has no exit. Just keep exploring.",
  },
  playground: {
    eyebrow: "AURORA VM · playable",
    title: "Run the VM in your browser",
    subtitle:
      "The AURORA VM core — assembler + 43-instruction CPU — ported to TypeScript and running 100% in your browser. Write Assembly, assemble, step through execution and inspect registers, flags, stack and disassembly.",
    examplesLabel: "Examples",
    assemble: "Assemble",
    run: "Run",
    step: "Step",
    reset: "Reset",
    stop: "Stop",
    editorLabel: "Assembly editor",
    consoleLabel: "Console",
    regsLabel: "Registers",
    disasmLabel: "Disassembly",
    stackLabel: "Stack",
    stdinLabel: "stdin (for IN)",
    stdinPlaceholder: "input bytes…",
    statusIdle: "edit the code and assemble to begin",
    statusAssembled: "assembled — ready to run",
    statusRunning: "running…",
    statusHalted: "finished",
    statusFatal: "fatal error",
    haltedMsg: "terminated: NORMAL (HALT), exit code {n}",
    stepsLabel: "steps",
    bytesLabel: "bytes",
    consoleHint: "Program output (OUT / OUTC) shows up here.",
    stackEmpty: "empty stack",
  },
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
