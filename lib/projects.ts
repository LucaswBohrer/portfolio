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
    slug: "aurora-vm",
    repo: "LucaswBohrer/aurora-vm",
    language: "Assembly",
    tags: ["Assembly", "x86-64", "NASM", "VM"],
    categories: ["systems"],
    title: { pt: "AURORA VM", en: "AURORA VM" },
    description: {
      pt: "Máquina virtual de 64 bits com ISA própria: CPU virtual, bytecode, assembler e debugger implementados do zero em Assembly x86-64 (NASM, sem libc).",
      en: "64-bit virtual machine with a custom ISA: virtual CPU, bytecode, assembler and debugger implemented from scratch in x86-64 Assembly (NASM, no libc).",
    },
    highlights: {
      pt: ["43 opcodes, ISA congelada", "Binário estático sem libc", "24/24 testes verdes"],
      en: ["43 opcodes, frozen ISA", "Static binary, no libc", "24/24 tests green"],
    },
  },
  {
    slug: "nexus-echoes",
    repo: "LucaswBohrer/nexus-echoes",
    language: "Java",
    tags: ["Java", "Forge", "Minecraft", "Simulação"],
    categories: ["systems"],
    title: { pt: "NEXUS: Echoes of Reality", en: "NEXUS: Echoes of Reality" },
    description: {
      pt: "Mod para Minecraft Java 1.20.1 (Forge): slice vertical de exploração, dimensões e tecnologia — sistema de energia cinética com RPM, torque e potência, redes de transmissão com brownout proporcional e máquinas.",
      en: "Minecraft Java 1.20.1 mod (Forge): vertical slice of exploration, dimensions and technology — kinetic energy system with RPM, torque and power, transmission networks with proportional brownout, and machines.",
    },
    highlights: {
      pt: ["Energia cinética (RPM/torque)", "Redes de transmissão simuladas", "50/50 testes verdes"],
      en: ["Kinetic energy (RPM/torque)", "Simulated transmission networks", "50/50 tests green"],
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
  {
    slug: "sky-and-bloom",
    repo: "LucaswBohrer/sky-and-bloom",
    language: "TypeScript",
    tags: ["TypeScript", "Next.js", "Three.js", "Motion"],
    categories: ["web"],
    title: { pt: "SKY & BLOOM", en: "SKY & BLOOM" },
    description: {
      pt: "Experiência web criativa e imersiva: movimento, interação, cor e experimentação digital — Next.js 16, React 19, Tailwind v4, Motion e Three.js.",
      en: "Immersive creative web experience: motion, interaction, color and digital experimentation — Next.js 16, React 19, Tailwind v4, Motion and Three.js.",
    },
    highlights: {
      pt: ["Cenas 3D com Three.js", "Motion e interação", "Em produção"],
      en: ["3D scenes with Three.js", "Motion and interaction", "Live in production"],
    },
  },
  {
    slug: "flowsuite",
    repo: "LucaswBohrer/flowsuite",
    language: "TypeScript",
    tags: ["TypeScript", "React", "draw.io", "TIA Portal"],
    categories: ["web", "automation"],
    title: { pt: "FlowSuite", en: "FlowSuite" },
    description: {
      pt: "Sistema que abre um fluxograma draw.io e deriva o resto: tabelas, elétrica, BOM, etiquetas e geração de código para TIA Portal — tudo processado no navegador.",
      en: "System that opens a draw.io flowchart and derives the rest: tables, electrical, BOM, labels and TIA Portal code generation — all processed in the browser.",
    },
    highlights: {
      pt: ["Parser próprio de draw.io", "Geração TIA Portal (SCL)", "100% local, sem upload"],
      en: ["Custom draw.io parser", "TIA Portal generation (SCL)", "100% local, no upload"],
    },
  },
  {
    slug: "ai-factory",
    repo: "LucaswBohrer/ai-factory",
    language: "Python",
    tags: ["Python", "Agentes de IA", "Auditoria", "Ledger"],
    categories: ["ai", "systems"],
    title: { pt: "AI Factory", en: "AI Factory" },
    description: {
      pt: "Fábrica de agentes com governança: protocolo multi-agente (execução, arquitetura, red-team), auditor determinístico de 38 regras e ledger append-only de créditos.",
      en: "Agent factory with governance: multi-agent protocol (execution, architecture, red-team), deterministic 38-rule auditor and append-only credit ledger.",
    },
    highlights: {
      pt: ["Auditor determinístico v3.0.0", "Ledger de créditos", "Protocolo LTP v1.4"],
      en: ["Deterministic auditor v3.0.0", "Credit ledger", "LTP protocol v1.4"],
    },
  },
  {
    slug: "sistema-os",
    repo: null,
    language: "TypeScript",
    tags: ["TypeScript", "Cloudflare Workers", "Drizzle", "Gestão"],
    categories: ["web", "automation"],
    title: { pt: "Sistema de OS", en: "Sistema de OS" },
    description: {
      pt: "Sistema web de gestão para assistência técnica: ordens de serviço, clientes, estoque, vendas, financeiro, garantias e relatórios — em uso real na loja.",
      en: "Web management system for electronics repair: service orders, customers, stock, sales, finance, warranties and reports — in real use at the shop.",
    },
    highlights: {
      pt: ["Em uso real na loja", "OS, estoque e financeiro", "Cloudflare Workers + Drizzle"],
      en: ["In real use at the shop", "Orders, stock and finance", "Cloudflare Workers + Drizzle"],
    },
  },
  {
    slug: "axion-robot",
    repo: null,
    language: "C++",
    tags: ["ESP32-S3", "C++", "MQTT", "Robótica"],
    categories: ["embedded", "ai"],
    title: { pt: "Axion — robô companheiro", en: "Axion — companion robot" },
    description: {
      pt: "Robô companheiro com ESP32-S3: rosto animado em display TFT, sensor de presença, alto-falante e microfone, painel de configuração via Wi-Fi e ponte MQTT.",
      en: "Companion robot on ESP32-S3: animated face on a TFT display, presence sensor, speaker and microphone, Wi-Fi config panel and MQTT bridge.",
    },
    highlights: {
      pt: ["Olhos animados em TFT", "Sensor de presença VL53L0X", "OTA dual-slot"],
      en: ["Animated eyes on TFT", "VL53L0X presence sensor", "Dual-slot OTA"],
    },
  },
  {
    slug: "loja-bohrer-3d",
    repo: "LucaswBohrer/loja-bohrer-3d",
    language: "HTML",
    tags: ["HTML", "JavaScript", "E-commerce", "Pix"],
    categories: ["web"],
    title: { pt: "Loja Bohrer 3D", en: "Loja Bohrer 3D" },
    description: {
      pt: "Loja online de impressão 3D personalizada sob encomenda: vitrine com catálogo aprovado, carrinho e checkout por Pix com confirmação no WhatsApp.",
      en: "Online store for made-to-order custom 3D prints: curated catalog storefront, cart and Pix checkout confirmed over WhatsApp.",
    },
    highlights: {
      pt: ["Loja real em produção", "Checkout Pix", "Catálogo sob encomenda"],
      en: ["Real store in production", "Pix checkout", "Made-to-order catalog"],
    },
  },
  {
    slug: "nullshift",
    repo: "LucaswBohrer/nullshift",
    language: "Python",
    tags: ["Python", "Pygame", "Game Dev", "Puzzle"],
    categories: ["systems"],
    title: { pt: "NULL//SHIFT", en: "NULL//SHIFT" },
    description: {
      pt: "Jogo puzzle 2D top-down com mecânica de eco temporal: o jogador coopera com os próprios ecos do passado — vertical slice jogável em Pygame.",
      en: "2D top-down puzzle game with a temporal-echo mechanic: the player cooperates with echoes of their own past — playable vertical slice in Pygame.",
    },
    highlights: {
      pt: ["Mecânica de eco temporal", "Vertical slice jogável", "Pygame"],
      en: ["Temporal-echo mechanic", "Playable vertical slice", "Pygame"],
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
