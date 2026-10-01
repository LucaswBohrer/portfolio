export type Category = "ai" | "automation" | "web" | "embedded" | "systems";

export interface Project {
  slug: string;
  repo: string | null; // null = private / no public link
  language: string;
  featured?: boolean;
  tags: string[];
  categories: Category[];
  /** key into t.caseStudies when the project has a full case study */
  caseKey?: "nexus" | "jarvis";
  /** public path to case media (real screenshot), if any */
  mediaSrc?: string;
  /** intrinsic dimensions of the case media (prevents layout shift) */
  mediaWidth?: number;
  mediaHeight?: number;
  title: { pt: string; en: string };
  description: { pt: string; en: string };
  highlights: { pt: string[]; en: string[] };
}

export const projects: Project[] = [
  {
    slug: "nexus",
    repo: "LucaswBohrer/nexus",
    language: "Python",
    featured: true,
    tags: ["Python", "FastAPI", "Telemetria", "IA"],
    categories: ["ai", "automation", "web"],
    caseKey: "nexus",
    mediaSrc: "/cases/nexus-dashboard.png",
    mediaWidth: 1573,
    mediaHeight: 754,
    title: { pt: "NEXUS", en: "NEXUS" },
    description: {
      pt: "Plataforma de inteligência elétrica: monitoramento, simulação full-stack, diagnósticos e telemetria em tempo real de sistemas elétricos.",
      en: "Electrical intelligence platform: full-stack monitoring, simulation, diagnostics and real-time telemetry for electrical systems.",
    },
    highlights: {
      pt: ["Telemetria em tempo real", "Diagnóstico inteligente", "API versionada"],
      en: ["Real-time telemetry", "Intelligent diagnostics", "Versioned API"],
    },
  },
  {
    slug: "jarvis",
    repo: "LucaswBohrer/jarvis",
    language: "Python",
    featured: true,
    tags: ["Python", "Agentes de IA", "Orquestração", "Memória"],
    categories: ["ai", "automation"],
    caseKey: "jarvis",
    mediaSrc: "/cases/jarvis-ui.png",
    mediaWidth: 1200,
    mediaHeight: 750,
    title: { pt: "JARVIS", en: "JARVIS" },
    description: {
      pt: "Plataforma pessoal de IA local-first: orquestração de tarefas, memória tipada, política de permissões e integração com o NEXUS via API.",
      en: "Local-first personal AI platform: task orchestration, typed memory, permission policies and NEXUS integration via API.",
    },
    highlights: {
      pt: ["State machine de tarefas", "Policy deny-by-default", "Audit append-only"],
      en: ["Task state machine", "Deny-by-default policy", "Append-only audit"],
    },
  },
  {
    slug: "axion",
    repo: "LucaswBohrer/AxionLabs-site",
    language: "TypeScript",
    tags: ["TypeScript", "React", "Robótica", "UI/UX"],
    categories: ["web", "embedded"],
    title: { pt: "Axion Labs", en: "Axion Labs" },
    description: {
      pt: "Site corporativo premium para empresa de robótica e IA — e o conceito do robô companheiro interativo Axion: sensores, display e comportamentos em tempo real.",
      en: "Premium corporate site for a robotics & AI company — plus the Axion interactive companion robot concept: sensors, display and real-time behaviors.",
    },
    highlights: {
      pt: ["Interface futurista", "Sistemas embarcados", "Interação em tempo real"],
      en: ["Futuristic interface", "Embedded systems", "Real-time interaction"],
    },
  },
  {
    slug: "os-manager",
    repo: "LucaswBohrer/os-manager-v2",
    language: "TypeScript",
    tags: ["TypeScript", "Local-first", "Gestão"],
    categories: ["web", "automation"],
    title: { pt: "OS Manager v2", en: "OS Manager v2" },
    description: {
      pt: "Sistema profissional de gerenciamento de Ordens de Serviço: local-first, modular e seguro, pensado para assistência técnica eletrônica.",
      en: "Professional service-order management system: local-first, modular and secure, designed for electronics repair workflows.",
    },
    highlights: {
      pt: ["Local-first", "Arquitetura modular", "Foco em segurança"],
      en: ["Local-first", "Modular architecture", "Security-focused"],
    },
  },
  {
    slug: "farmtech",
    repo: "LucaswBohrer/Farmtech-Solutions-Fase-2",
    language: "C++",
    tags: ["ESP32", "IoT", "Python", "R"],
    categories: ["embedded", "automation", "ai"],
    title: { pt: "FarmTech — Irrigação Inteligente", en: "FarmTech — Smart Irrigation" },
    description: {
      pt: "Sistema de irrigação inteligente com ESP32: sensores, automação e análise de dados em Python/R para agricultura de precisão.",
      en: "Smart irrigation system with ESP32: sensors, automation and Python/R data analysis for precision agriculture.",
    },
    highlights: {
      pt: ["ESP32 + sensores", "Automação", "Análise de dados"],
      en: ["ESP32 + sensors", "Automation", "Data analysis"],
    },
  },
  {
    slug: "e2ps-builder",
    repo: "LucaswBohrer/e2ps-manual-builder",
    language: "Python",
    tags: ["Python", "Desktop", "Automação"],
    categories: ["automation", "ai"],
    title: { pt: "E2PS Manual Builder", en: "E2PS Manual Builder" },
    description: {
      pt: "Aplicação desktop que auxilia a criação de manuais técnicos em R Markdown — automação de documentação de engenharia.",
      en: "Desktop application assisting technical manual creation in R Markdown — engineering documentation automation.",
    },
    highlights: {
      pt: ["Aplicação desktop", "R Markdown", "Produtividade"],
      en: ["Desktop app", "R Markdown", "Productivity"],
    },
  },
  {
    slug: "nexa",
    repo: "LucaswBohrer/nexa-landing-page",
    language: "TypeScript",
    tags: ["TypeScript", "Landing Page", "UI/UX"],
    categories: ["web"],
    title: { pt: "NEXA — Landing Page", en: "NEXA — Landing Page" },
    description: {
      pt: "Landing page SaaS para automação inteligente com IA: design, copy e estrutura de conversão.",
      en: "SaaS landing page for intelligent AI automation: design, copy and conversion structure.",
    },
    highlights: {
      pt: ["Design responsivo", "Copy de conversão", "Performance"],
      en: ["Responsive design", "Conversion copy", "Performance"],
    },
  },
  {
    slug: "legacybank",
    repo: "LucaswBohrer/legacybank",
    language: "COBOL",
    tags: ["COBOL", "GnuCOBOL", "Core bancário", "CLI"],
    categories: ["systems", "automation"],
    title: { pt: "LEGACYBANK", en: "LEGACYBANK" },
    description: {
      pt: "Núcleo bancário educacional 100% em COBOL (GnuCOBOL): clientes, contas CC/CP, transações com tarifas, processamento em lote, idempotência por TX-ID, journal e auditoria.",
      en: "Educational banking core 100% in COBOL (GnuCOBOL): clients, checking/savings accounts, fee-based transactions, batch processing, TX-ID idempotency, journaling and audit.",
    },
    highlights: {
      pt: ["40/40 testes passando", "100k transações reconciliadas", "Idempotência por TX-ID"],
      en: ["40/40 tests passing", "100k transactions reconciled", "TX-ID idempotency"],
    },
  },
  {
    slug: "travel-agent",
    repo: "LucaswBohrer/travel-intelligence-agent",
    language: "TypeScript",
    tags: ["TypeScript", "Agentes", "IA"],
    categories: ["ai", "web"],
    title: { pt: "Travel Intelligence Agent", en: "Travel Intelligence Agent" },
    description: {
      pt: "Agente inteligente de planejamento de viagens: pesquisa, comparação e recomendações automatizadas.",
      en: "Intelligent travel planning agent: automated research, comparison and recommendations.",
    },
    highlights: {
      pt: ["Agente autônomo", "Pesquisa web", "Recomendações"],
      en: ["Autonomous agent", "Web research", "Recommendations"],
    },
  },
];

export function repoUrl(p: Project): string | null {
  return p.repo ? `https://github.com/${p.repo}` : null;
}

export const profile = {
  name: "Lucas Welter Bohrer",
  email: "bohrer.welter.lucas@gmail.com",
  phone: "+55 51 99750-5450",
  location: { pt: "Novo Hamburgo, RS — Brasil", en: "Novo Hamburgo, RS — Brazil" },
  github: "https://github.com/LucaswBohrer",
};
