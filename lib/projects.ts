export type Category = "ai" | "automation" | "web" | "embedded" | "systems";

export interface Project {
  slug: string;
  repo: string | null; // null = private / no public link
  /** public live URL (landing page / deployed demo), if any */
  demoUrl?: string;
  language: string;
  featured?: boolean;
  tags: { pt: string[]; en: string[]; es: string[] };
  categories: Category[];
  /** key into t.caseStudies when the project has a full case study */
  caseKey?: "nexus" | "jarvis";
  /** public path to case media (real screenshot), if any */
  mediaSrc?: string;
  /** intrinsic dimensions of the case media (prevents layout shift) */
  mediaWidth?: number;
  mediaHeight?: number;
  title: { pt: string; en: string; es: string };
  description: { pt: string; en: string; es: string };
  highlights: { pt: string[]; en: string[]; es: string[] };
}

export const projects: Project[] = [
  {
    slug: "nexus",
    repo: "LucaswBohrer/nexus",
    language: "Python",
    featured: true,
    tags: { pt: ["Python", "FastAPI", "Telemetria", "IA"], en: ["Python", "FastAPI", "Telemetry", "AI"], es: ["Python", "FastAPI", "Telemetría", "IA"] },
    categories: ["ai", "automation", "web"],
    caseKey: "nexus",
    mediaSrc: "/cases/nexus-dashboard.png",
    mediaWidth: 1573,
    mediaHeight: 754,
    title: { pt: "NEXUS", en: "NEXUS", es: "NEXUS" },
    description: {
      pt: "Plataforma de inteligência elétrica: monitoramento, simulação full-stack, diagnósticos e telemetria em tempo real de sistemas elétricos.",
      en: "Electrical intelligence platform: full-stack monitoring, simulation, diagnostics and real-time telemetry for electrical systems.",
      es: "Plataforma de inteligencia eléctrica: monitoreo, simulación full-stack, diagnósticos y telemetría en tiempo real de sistemas eléctricos.",
    },
    highlights: {
      pt: ["Telemetria em tempo real", "Diagnóstico inteligente", "API versionada"],
      en: ["Real-time telemetry", "Intelligent diagnostics", "Versioned API"],
      es: ["Telemetría en tiempo real", "Diagnóstico inteligente", "API versionada"],
    },
  },
  {
    slug: "jarvis",
    repo: "LucaswBohrer/jarvis",
    language: "Python",
    featured: true,
    tags: { pt: ["Python", "Agentes de IA", "Orquestração", "Memória"], en: ["Python", "AI Agents", "Orchestration", "Memory"], es: ["Python", "Agentes de IA", "Orquestación", "Memoria"] },
    categories: ["ai", "automation"],
    caseKey: "jarvis",
    mediaSrc: "/cases/jarvis-ui.png",
    mediaWidth: 1200,
    mediaHeight: 750,
    title: { pt: "JARVIS", en: "JARVIS", es: "JARVIS" },
    description: {
      pt: "Plataforma pessoal de IA local-first: orquestração de tarefas, memória tipada, política de permissões e integração com o NEXUS via API.",
      en: "Local-first personal AI platform: task orchestration, typed memory, permission policies and NEXUS integration via API.",
      es: "Plataforma personal de IA local-first: orquestación de tareas, memoria tipada, política de permisos e integración con NEXUS vía API.",
    },
    highlights: {
      pt: ["State machine de tarefas", "Policy deny-by-default", "Audit append-only"],
      en: ["Task state machine", "Deny-by-default policy", "Append-only audit"],
      es: ["Máquina de estados de tareas", "Política deny-by-default", "Auditoría append-only"],
    },
  },
  {
    slug: "axion",
    repo: "LucaswBohrer/AxionLabs-site",
    language: "TypeScript",
    tags: { pt: ["TypeScript", "React", "Robótica", "UI/UX"], en: ["TypeScript", "React", "Robotics", "UI/UX"], es: ["TypeScript", "React", "Robótica", "UI/UX"] },
    categories: ["web", "embedded"],
    title: { pt: "Axion Labs", en: "Axion Labs", es: "Axion Labs" },
    description: {
      pt: "Site corporativo premium para empresa de robótica e IA — e o conceito do robô companheiro interativo Axion: sensores, display e comportamentos em tempo real.",
      en: "Premium corporate site for a robotics & AI company — plus the Axion interactive companion robot concept: sensors, display and real-time behaviors.",
      es: "Sitio corporativo premium para una empresa de robótica e IA — y el concepto del robot compañero interactivo Axion: sensores, pantalla y comportamientos en tiempo real.",
    },
    highlights: {
      pt: ["Interface futurista", "Sistemas embarcados", "Interação em tempo real"],
      en: ["Futuristic interface", "Embedded systems", "Real-time interaction"],
      es: ["Interfaz futurista", "Sistemas embebidos", "Interacción en tiempo real"],
    },
  },
  {
    slug: "os-manager",
    repo: "LucaswBohrer/os-manager-v2",
    language: "TypeScript",
    tags: { pt: ["TypeScript", "Local-first", "Gestão"], en: ["TypeScript", "Local-first", "Management"], es: ["TypeScript", "Local-first", "Gestión"] },
    categories: ["web", "automation"],
    title: { pt: "OS Manager v2", en: "OS Manager v2", es: "OS Manager v2" },
    description: {
      pt: "Sistema profissional de gerenciamento de Ordens de Serviço: local-first, modular e seguro, pensado para assistência técnica eletrônica.",
      en: "Professional service-order management system: local-first, modular and secure, designed for electronics repair workflows.",
      es: "Sistema profesional de gestión de Órdenes de Servicio: local-first, modular y seguro, pensado para asistencia técnica electrónica.",
    },
    highlights: {
      pt: ["Local-first", "Arquitetura modular", "Foco em segurança"],
      en: ["Local-first", "Modular architecture", "Security-focused"],
      es: ["Local-first", "Arquitectura modular", "Enfoque en seguridad"],
    },
  },
  {
    slug: "farmtech",
    repo: "LucaswBohrer/Farmtech-Solutions-Fase-2",
    language: "C++",
    tags: { pt: ["ESP32", "IoT", "Python", "R"], en: ["ESP32", "IoT", "Python", "R"], es: ["ESP32", "IoT", "Python", "R"] },
    categories: ["embedded", "automation", "ai"],
    title: { pt: "FarmTech — Irrigação Inteligente", en: "FarmTech — Smart Irrigation", es: "FarmTech — Riego Inteligente" },
    description: {
      pt: "Sistema de irrigação inteligente com ESP32: sensores, automação e análise de dados em Python/R para agricultura de precisão.",
      en: "Smart irrigation system with ESP32: sensors, automation and Python/R data analysis for precision agriculture.",
      es: "Sistema de riego inteligente con ESP32: sensores, automatización y análisis de datos en Python/R para agricultura de precisión.",
    },
    highlights: {
      pt: ["ESP32 + sensores", "Automação", "Análise de dados"],
      en: ["ESP32 + sensors", "Automation", "Data analysis"],
      es: ["ESP32 + sensores", "Automatización", "Análisis de datos"],
    },
  },
  {
    slug: "e2ps-builder",
    repo: "LucaswBohrer/e2ps-manual-builder",
    language: "Python",
    tags: { pt: ["Python", "Desktop", "Automação"], en: ["Python", "Desktop", "Automation"], es: ["Python", "Escritorio", "Automatización"] },
    categories: ["automation", "ai"],
    title: { pt: "E2PS Manual Builder", en: "E2PS Manual Builder", es: "E2PS Manual Builder" },
    description: {
      pt: "Aplicação desktop que auxilia a criação de manuais técnicos em R Markdown — automação de documentação de engenharia.",
      en: "Desktop application assisting technical manual creation in R Markdown — engineering documentation automation.",
      es: "Aplicación de escritorio que ayuda a crear manuales técnicos en R Markdown — automatización de documentación de ingeniería.",
    },
    highlights: {
      pt: ["Aplicação desktop", "R Markdown", "Produtividade"],
      en: ["Desktop app", "R Markdown", "Productivity"],
      es: ["Aplicación de escritorio", "R Markdown", "Productividad"],
    },
  },
  {
    slug: "nexa",
    repo: "LucaswBohrer/nexa-landing-page",
    demoUrl: "https://nexa-landing-page-fawn.vercel.app",
    language: "TypeScript",
    tags: { pt: ["TypeScript", "Landing Page", "UI/UX"], en: ["TypeScript", "Landing Page", "UI/UX"], es: ["TypeScript", "Landing Page", "UI/UX"] },
    categories: ["web"],
    title: { pt: "NEXA — Landing Page", en: "NEXA — Landing Page", es: "NEXA — Landing Page" },
    description: {
      pt: "Landing page SaaS para automação inteligente com IA: design, copy e estrutura de conversão.",
      en: "SaaS landing page for intelligent AI automation: design, copy and conversion structure.",
      es: "Landing page SaaS para automatización inteligente con IA: diseño, copy y estructura de conversión.",
    },
    highlights: {
      pt: ["Design responsivo", "Copy de conversão", "Performance"],
      en: ["Responsive design", "Conversion copy", "Performance"],
      es: ["Diseño responsivo", "Copy de conversión", "Rendimiento"],
    },
  },
  {
    slug: "legacybank",
    repo: "LucaswBohrer/legacybank",
    language: "COBOL",
    tags: { pt: ["COBOL", "GnuCOBOL", "Core bancário", "CLI"], en: ["COBOL", "GnuCOBOL", "Banking core", "CLI"], es: ["COBOL", "GnuCOBOL", "Núcleo bancario", "CLI"] },
    categories: ["systems", "automation"],
    title: { pt: "LEGACYBANK", en: "LEGACYBANK", es: "LEGACYBANK" },
    description: {
      pt: "Núcleo bancário educacional 100% em COBOL (GnuCOBOL): clientes, contas CC/CP, transações com tarifas, processamento em lote, idempotência por TX-ID, journal e auditoria.",
      en: "Educational banking core 100% in COBOL (GnuCOBOL): clients, checking/savings accounts, fee-based transactions, batch processing, TX-ID idempotency, journaling and audit.",
      es: "Núcleo bancario educativo 100% en COBOL (GnuCOBOL): clientes, cuentas corriente/ahorro, transacciones con comisiones, procesamiento por lotes, idempotencia por TX-ID, journal y auditoría.",
    },
    highlights: {
      pt: ["40/40 testes passando", "100k transações reconciliadas", "Idempotência por TX-ID"],
      en: ["40/40 tests passing", "100k transactions reconciled", "TX-ID idempotency"],
      es: ["40/40 pruebas pasando", "100k transacciones reconciliadas", "Idempotencia por TX-ID"],
    },
  },
  {
    slug: "aurora-vm",
    repo: "LucaswBohrer/aurora-vm",
    language: "Assembly",
    tags: { pt: ["Assembly", "x86-64", "NASM", "VM"], en: ["Assembly", "x86-64", "NASM", "VM"], es: ["Assembly", "x86-64", "NASM", "VM"] },
    categories: ["systems"],
    title: { pt: "AURORA VM", en: "AURORA VM", es: "AURORA VM" },
    description: {
      pt: "Máquina virtual de 64 bits com ISA própria: CPU virtual, bytecode, assembler e debugger implementados do zero em Assembly x86-64 (NASM, sem libc).",
      en: "64-bit virtual machine with a custom ISA: virtual CPU, bytecode, assembler and debugger implemented from scratch in x86-64 Assembly (NASM, no libc).",
      es: "Máquina virtual de 64 bits con ISA propia: CPU virtual, bytecode, ensamblador y debugger implementados desde cero en Assembly x86-64 (NASM, sin libc).",
    },
    highlights: {
      pt: ["43 opcodes, ISA congelada", "Binário estático sem libc", "24/24 testes verdes"],
      en: ["43 opcodes, frozen ISA", "Static binary, no libc", "24/24 tests green"],
      es: ["43 opcodes, ISA congelada", "Binario estático sin libc", "24/24 pruebas en verde"],
    },
  },
  {
    slug: "nexus-echoes",
    repo: "LucaswBohrer/nexus-echoes",
    language: "Java",
    tags: { pt: ["Java", "Forge", "Minecraft", "Simulação"], en: ["Java", "Forge", "Minecraft", "Simulation"], es: ["Java", "Forge", "Minecraft", "Simulación"] },
    categories: ["systems"],
    title: { pt: "NEXUS: Echoes of Reality", en: "NEXUS: Echoes of Reality", es: "NEXUS: Echoes of Reality" },
    description: {
      pt: "Mod para Minecraft Java 1.20.1 (Forge): slice vertical de exploração, dimensões e tecnologia — sistema de energia cinética com RPM, torque e potência, redes de transmissão com brownout proporcional e máquinas.",
      en: "Minecraft Java 1.20.1 mod (Forge): vertical slice of exploration, dimensions and technology — kinetic energy system with RPM, torque and power, transmission networks with proportional brownout, and machines.",
      es: "Mod para Minecraft Java 1.20.1 (Forge): corte vertical de exploración, dimensiones y tecnología — sistema de energía cinética con RPM, torque y potencia, redes de transmisión con brownout proporcional y máquinas.",
    },
    highlights: {
      pt: ["Energia cinética (RPM/torque)", "Redes de transmissão simuladas", "50/50 testes verdes"],
      en: ["Kinetic energy (RPM/torque)", "Simulated transmission networks", "50/50 tests green"],
      es: ["Energía cinética (RPM/torque)", "Redes de transmisión simuladas", "50/50 pruebas en verde"],
    },
  },
  {
    slug: "travel-agent",
    repo: "LucaswBohrer/travel-intelligence-agent",
    language: "TypeScript",
    tags: { pt: ["TypeScript", "Agentes", "IA"], en: ["TypeScript", "Agents", "AI"], es: ["TypeScript", "Agentes", "IA"] },
    categories: ["ai", "web"],
    title: { pt: "Travel Intelligence Agent", en: "Travel Intelligence Agent", es: "Travel Intelligence Agent" },
    description: {
      pt: "Agente inteligente de planejamento de viagens: pesquisa, comparação e recomendações automatizadas.",
      en: "Intelligent travel planning agent: automated research, comparison and recommendations.",
      es: "Agente inteligente de planificación de viajes: investigación, comparación y recomendaciones automatizadas.",
    },
    highlights: {
      pt: ["Agente autônomo", "Pesquisa web", "Recomendações"],
      en: ["Autonomous agent", "Web research", "Recommendations"],
      es: ["Agente autónomo", "Búsqueda web", "Recomendaciones"],
    },
  },
  {
    slug: "sky-and-bloom",
    repo: "LucaswBohrer/sky-and-bloom",
    demoUrl: "https://sky-and-bloom.vercel.app",
    language: "TypeScript",
    tags: { pt: ["TypeScript", "Next.js", "Three.js", "Motion"], en: ["TypeScript", "Next.js", "Three.js", "Motion"], es: ["TypeScript", "Next.js", "Three.js", "Motion"] },
    categories: ["web"],
    title: { pt: "SKY & BLOOM", en: "SKY & BLOOM", es: "SKY & BLOOM" },
    description: {
      pt: "Experiência web criativa e imersiva: movimento, interação, cor e experimentação digital — Next.js 16, React 19, Tailwind v4, Motion e Three.js.",
      en: "Immersive creative web experience: motion, interaction, color and digital experimentation — Next.js 16, React 19, Tailwind v4, Motion and Three.js.",
      es: "Experiencia web creativa e inmersiva: movimiento, interacción, color y experimentación digital — Next.js 16, React 19, Tailwind v4, Motion y Three.js.",
    },
    highlights: {
      pt: ["Cenas 3D com Three.js", "Motion e interação", "Em produção"],
      en: ["3D scenes with Three.js", "Motion and interaction", "Live in production"],
      es: ["Escenas 3D con Three.js", "Motion e interacción", "En producción"],
    },
  },
  {
    slug: "sol-e-mar",
    repo: "LucaswBohrer/sol-e-mar",
    demoUrl: "https://sol-e-mar-zeta.vercel.app",
    language: "TypeScript",
    tags: { pt: ["TypeScript", "Next.js", "Three.js", "Motion"], en: ["TypeScript", "Next.js", "Three.js", "Motion"], es: ["TypeScript", "Next.js", "Three.js", "Motion"] },
    categories: ["web"],
    title: { pt: "SOL & MAR", en: "SOL & MAR", es: "SOL & MAR" },
    description: {
      pt: "Experiência web criativa no molde do SKY & BLOOM — sol dourado, ondas e pôr do sol em 3D interativo, com experimentos de física das ondas e laboratório do pôr do sol.",
      en: "Creative web experience in the SKY & BLOOM mould — golden sun, waves and sunset in interactive 3D, with wave-physics experiments and a sunset lab.",
      es: "Experiencia web creativa en el molde de SKY & BLOOM — sol dorado, olas y atardecer en 3D interactivo, con experimentos de física de olas y laboratorio del atardecer.",
    },
    highlights: {
      pt: ["Hero 3D com sol e ondas", "3 experimentos interativos", "Playground com 4 estações"],
      en: ["3D hero with sun and waves", "3 interactive experiments", "Playground with 4 stations"],
      es: ["Hero 3D con sol y olas", "3 experimentos interactivos", "Playground con 4 estaciones"],
    },
  },
  {
    slug: "noir",
    repo: "LucaswBohrer/noir",
    demoUrl: "https://noir-two-lac.vercel.app",
    language: "TypeScript",
    tags: { pt: ["TypeScript", "Next.js", "Tailwind", "Motion"], en: ["TypeScript", "Next.js", "Tailwind", "Motion"], es: ["TypeScript", "Next.js", "Tailwind", "Motion"] },
    categories: ["web"],
    title: { pt: "NOIR", en: "NOIR", es: "NOIR" },
    description: {
      pt: "Landing page de um SaaS fictício de orquestração de agentes de IA — agentes autônomos operando em segundo plano, com console de operações ao vivo, 4 agentes e preços com toggle mensal/anual.",
      en: "Landing page for a fictional AI-agent orchestration SaaS — autonomous agents working in the background, with a live operations console, 4 agents and a monthly/annual pricing toggle.",
      es: "Landing page de un SaaS ficticio de orquestación de agentes de IA — agentes autónomos operando en segundo plano, con consola de operaciones en vivo, 4 agentes y precios con cambio mensual/anual.",
    },
    highlights: {
      pt: ["Console de operações ao vivo", "4 agentes (ATLAS, LUMEN, VEGA, ÍRIS)", "Preços mensal/anual"],
      en: ["Live operations console", "4 agents (ATLAS, LUMEN, VEGA, ÍRIS)", "Monthly/annual pricing"],
      es: ["Consola de operaciones en vivo", "4 agentes (ATLAS, LUMEN, VEGA, ÍRIS)", "Precios mensual/anual"],
    },
  },
  {
    slug: "vortex",
    repo: "LucaswBohrer/vortex",
    demoUrl: "https://vortex-pied-rho.vercel.app",
    language: "TypeScript",
    tags: { pt: ["TypeScript", "Next.js", "Tailwind", "Motion"], en: ["TypeScript", "Next.js", "Tailwind", "Motion"], es: ["TypeScript", "Next.js", "Tailwind", "Motion"] },
    categories: ["web"],
    title: { pt: "VORTEX", en: "VORTEX", es: "VORTEX" },
    description: {
      pt: "Landing page de uma fintech fictícia de pagamentos — Pix, cartão, boleto e assinaturas em tempo real, com console de pagamentos ao vivo, cartão 3D, simulador de taxas, dashboard interativo e antifraude.",
      en: "Landing page for a fictional payments fintech — Pix, cards, boleto and subscriptions in real time, with a live payments console, 3D card, fee simulator, interactive dashboard and antifraud.",
      es: "Landing page de una fintech ficticia de pagos — Pix, tarjeta, boleto y suscripciones en tiempo real, con consola de pagos en vivo, tarjeta 3D, simulador de tasas, panel interactivo y antifraude.",
    },
    highlights: {
      pt: ["Simulador de taxas com matemática real", "Cartão 3D com glare", "Antifraude com regras ligáveis"],
      en: ["Fee simulator with real math", "3D card with glare", "Antifraud with toggleable rules"],
      es: ["Simulador de tasas con matemática real", "Tarjeta 3D con brillo", "Antifraude con reglas activables"],
    },
  },
  {
    slug: "circuito-lab",
    repo: "LucaswBohrer/circuito-lab",
    language: "Java",
    tags: { pt: ["Java", "Swing", "MNA", "Circuitos"], en: ["Java", "Swing", "MNA", "Circuits"], es: ["Java", "Swing", "MNA", "Circuitos"] },
    categories: ["systems"],
    title: { pt: "CircuitoLab", en: "CircuitoLab", es: "CircuitoLab" },
    description: {
      pt: "Simulador de circuitos elétricos em Java puro (JDK 21, zero dependências): análise DC por MNA com solver próprio, interface Swing para desenhar e editar circuitos, CLI com exportação CSV/relatório e exemplos.",
      en: "Electrical circuit simulator in pure Java (JDK 21, zero dependencies): DC analysis via MNA with a custom solver, Swing GUI to draw and edit circuits, CLI with CSV/report export and examples.",
      es: "Simulador de circuitos eléctricos en Java puro (JDK 21, cero dependencias): análisis DC por MNA con solver propio, interfaz Swing para dibujar y editar circuitos, CLI con exportación CSV/informe y ejemplos.",
    },
    highlights: {
      pt: ["Análise DC por MNA", "Solver próprio (Gauss + pivotamento)", "11/11 testes passando"],
      en: ["DC analysis via MNA", "Custom solver (Gaussian elimination + pivoting)", "11/11 tests passing"],
      es: ["Análisis DC por MNA", "Solver propio (Gauss + pivotamiento)", "11/11 pruebas pasando"],
    },
  },
  {
    slug: "flowsuite",
    repo: "LucaswBohrer/flowsuite",
    demoUrl: "https://flowsuite-sooty.vercel.app",
    language: "TypeScript",
    tags: { pt: ["TypeScript", "React", "draw.io", "TIA Portal"], en: ["TypeScript", "React", "draw.io", "TIA Portal"], es: ["TypeScript", "React", "draw.io", "TIA Portal"] },
    categories: ["web", "automation"],
    title: { pt: "FlowSuite", en: "FlowSuite", es: "FlowSuite" },
    description: {
      pt: "Sistema que abre um fluxograma draw.io e deriva o resto: tabelas, elétrica, BOM, etiquetas e geração de código para TIA Portal — tudo processado no navegador.",
      en: "System that opens a draw.io flowchart and derives the rest: tables, electrical, BOM, labels and TIA Portal code generation — all processed in the browser.",
      es: "Sistema que abre un diagrama de flujo draw.io y deriva el resto: tablas, eléctrica, BOM, etiquetas y generación de código para TIA Portal — todo procesado en el navegador.",
    },
    highlights: {
      pt: ["Parser próprio de draw.io", "Geração TIA Portal (SCL)", "100% local, sem upload"],
      en: ["Custom draw.io parser", "TIA Portal generation (SCL)", "100% local, no upload"],
      es: ["Parser propio de draw.io", "Generación TIA Portal (SCL)", "100% local, sin subidas"],
    },
  },
  {
    slug: "ai-factory",
    repo: "LucaswBohrer/ai-factory",
    language: "Python",
    tags: { pt: ["Python", "Agentes de IA", "Auditoria", "Ledger"], en: ["Python", "AI Agents", "Audit", "Ledger"], es: ["Python", "Agentes de IA", "Auditoría", "Ledger"] },
    categories: ["ai", "systems"],
    title: { pt: "AI Factory", en: "AI Factory", es: "AI Factory" },
    description: {
      pt: "Fábrica de agentes com governança: protocolo multi-agente (execução, arquitetura, red-team), auditor determinístico de 38 regras e ledger append-only de créditos.",
      en: "Agent factory with governance: multi-agent protocol (execution, architecture, red-team), deterministic 38-rule auditor and append-only credit ledger.",
      es: "Fábrica de agentes con gobernanza: protocolo multiagente (ejecución, arquitectura, red-team), auditor determinístico de 38 reglas y ledger append-only de créditos.",
    },
    highlights: {
      pt: ["Auditor determinístico v3.0.0", "Ledger de créditos", "Protocolo LTP v1.4"],
      en: ["Deterministic auditor v3.0.0", "Credit ledger", "LTP protocol v1.4"],
      es: ["Auditor determinístico v3.0.0", "Ledger de créditos", "Protocolo LTP v1.4"],
    },
  },
  {
    slug: "sistema-os",
    repo: null,
    demoUrl: "https://sistema-os.bohrer-welter-lucas.workers.dev",
    language: "TypeScript",
    tags: { pt: ["TypeScript", "Cloudflare Workers", "Drizzle", "Gestão"], en: ["TypeScript", "Cloudflare Workers", "Drizzle", "Management"], es: ["TypeScript", "Cloudflare Workers", "Drizzle", "Gestión"] },
    categories: ["web", "automation"],
    title: { pt: "Sistema de OS", en: "Sistema de OS", es: "Sistema de OS" },
    description: {
      pt: "Sistema web de gestão para assistência técnica: ordens de serviço, clientes, estoque, vendas, financeiro, garantias e relatórios — em uso real na loja.",
      en: "Web management system for electronics repair: service orders, customers, stock, sales, finance, warranties and reports — in real use at the shop.",
      es: "Sistema web de gestión para asistencia técnica: órdenes de servicio, clientes, inventario, ventas, finanzas, garantías e informes — en uso real en la tienda.",
    },
    highlights: {
      pt: ["Em uso real na loja", "OS, estoque e financeiro", "Cloudflare Workers + Drizzle"],
      en: ["In real use at the shop", "Orders, stock and finance", "Cloudflare Workers + Drizzle"],
      es: ["En uso real en la tienda", "OS, inventario y finanzas", "Cloudflare Workers + Drizzle"],
    },
  },
  {
    slug: "axion-robot",
    repo: null,
    language: "C++",
    tags: { pt: ["ESP32-S3", "C++", "MQTT", "Robótica"], en: ["ESP32-S3", "C++", "MQTT", "Robotics"], es: ["ESP32-S3", "C++", "MQTT", "Robótica"] },
    categories: ["embedded", "ai"],
    title: { pt: "Axion — robô companheiro", en: "Axion — companion robot", es: "Axion — robot compañero" },
    description: {
      pt: "Robô companheiro com ESP32-S3: rosto animado em display TFT, sensor de presença, alto-falante e microfone, painel de configuração via Wi-Fi e ponte MQTT.",
      en: "Companion robot on ESP32-S3: animated face on a TFT display, presence sensor, speaker and microphone, Wi-Fi config panel and MQTT bridge.",
      es: "Robot compañero con ESP32-S3: rostro animado en pantalla TFT, sensor de presencia, altavoz y micrófono, panel de configuración vía Wi-Fi y puente MQTT.",
    },
    highlights: {
      pt: ["Olhos animados em TFT", "Sensor de presença VL53L0X", "OTA dual-slot"],
      en: ["Animated eyes on TFT", "VL53L0X presence sensor", "Dual-slot OTA"],
      es: ["Ojos animados en TFT", "Sensor de presencia VL53L0X", "OTA dual-slot"],
    },
  },
  {
    slug: "loja-bohrer-3d",
    repo: "LucaswBohrer/loja-bohrer-3d",
    demoUrl: "https://catalogo-3d-digital.vercel.app",
    language: "HTML",
    tags: { pt: ["HTML", "JavaScript", "E-commerce", "Pix"], en: ["HTML", "JavaScript", "E-commerce", "Pix"], es: ["HTML", "JavaScript", "E-commerce", "Pix"] },
    categories: ["web"],
    title: { pt: "3D Digital", en: "3D Digital", es: "3D Digital" },
    description: {
      pt: "Loja online de impressão 3D personalizada sob encomenda: vitrine com catálogo aprovado, carrinho e checkout por Pix com confirmação no WhatsApp.",
      en: "Online store for made-to-order custom 3D prints: curated catalog storefront, cart and Pix checkout confirmed over WhatsApp.",
      es: "Tienda en línea de impresión 3D personalizada por encargo: vitrina con catálogo aprobado, carrito y checkout por Pix con confirmación por WhatsApp.",
    },
    highlights: {
      pt: ["Loja real em produção", "Checkout Pix", "Catálogo sob encomenda"],
      en: ["Real store in production", "Pix checkout", "Made-to-order catalog"],
      es: ["Tienda real en producción", "Checkout Pix", "Catálogo por encargo"],
    },
  },
  {
    slug: "nullshift",
    repo: "LucaswBohrer/nullshift",
    language: "Python",
    tags: { pt: ["Python", "Pygame", "Game Dev", "Puzzle"], en: ["Python", "Pygame", "Game Dev", "Puzzle"], es: ["Python", "Pygame", "Game Dev", "Puzzle"] },
    categories: ["systems"],
    title: { pt: "NULL//SHIFT", en: "NULL//SHIFT", es: "NULL//SHIFT" },
    description: {
      pt: "Jogo puzzle 2D top-down com mecânica de eco temporal: o jogador coopera com os próprios ecos do passado — vertical slice jogável em Pygame.",
      en: "2D top-down puzzle game with a temporal-echo mechanic: the player cooperates with echoes of their own past — playable vertical slice in Pygame.",
      es: "Juego de puzles 2D top-down con mecánica de eco temporal: el jugador coopera con sus propios ecos del pasado — corte vertical jugable en Pygame.",
    },
    highlights: {
      pt: ["Mecânica de eco temporal", "Vertical slice jogável", "Pygame"],
      en: ["Temporal-echo mechanic", "Playable vertical slice", "Pygame"],
      es: ["Mecánica de eco temporal", "Corte vertical jugable", "Pygame"],
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
  location: { pt: "Novo Hamburgo, RS — Brasil", en: "Novo Hamburgo, RS — Brazil", es: "Novo Hamburgo, RS — Brasil" },
  github: "https://github.com/LucaswBohrer",
};
