import type { Dict, Lang } from "./i18n";
import { projects, profile, repoUrl } from "./projects";

export type SegColor =
  | "cyan"
  | "green"
  | "indigo"
  | "dim"
  | "white"
  | "red"
  | "yellow"
  | "plain";

export interface Seg {
  text: string;
  href?: string;
  color?: SegColor;
  bold?: boolean;
}

/** One terminal output line = a row of inline segments. */
export type TermLineData = Seg[];

export interface CmdResult {
  clear: boolean;
  lines: TermLineData[];
}

const seg = (text: string, color: SegColor = "plain", href?: string, bold?: boolean): Seg =>
  href !== undefined || bold !== undefined ? { text, color, href, bold } : { text, color };

const line = (...segs: Seg[]): TermLineData => segs;

const fill = (template: string, value: string): string => template.replace("{cmd}", value).replace("{n}", value);

/** Boot screen: the familiar `perfil` object, then the hint. */
export function bootLines(d: Dict, lang: Lang): TermLineData[] {
  const t = d.terminal;
  const q = (s: string): string => `"${s}"`;
  return [
    line(seg("const ", "cyan"), seg("perfil ", "white", undefined, true), seg("= ", "dim"), seg("{")),
    line(seg("  nome", "indigo"), seg(": ", "dim"), seg(q(profile.name), "green"), seg(",", "dim")),
    line(
      seg("  foco", "indigo"),
      seg(": ", "dim"),
      seg(`[${t.bootFocus.map(q).join(", ")}]`, "green"),
      seg(",", "dim")
    ),
    line(
      seg("  stack", "indigo"),
      seg(": ", "dim"),
      seg(`[${t.bootStack.map(q).join(", ")}]`, "green"),
      seg(",", "dim")
    ),
    line(seg("  base", "indigo"), seg(": ", "dim"), seg(q(t.bootBase), "green"), seg(",", "dim")),
    line(seg("  local", "indigo"), seg(": ", "dim"), seg(q(profile.location[lang]), "green"), seg(",", "dim")),
    line(seg("};")),
    line(seg(t.hint, "dim")),
  ];
}

const ALIASES: Record<string, string> = {
  help: "help",
  ajuda: "help",
  whoami: "whoami",
  projetos: "projects",
  projects: "projects",
  projeto: "project",
  project: "project",
  skills: "skills",
  habilidades: "skills",
  experiencia: "experience",
  experience: "experience",
  contato: "contact",
  contact: "contact",
  neofetch: "neofetch",
  cv: "cv",
  curriculo: "cv",
  resume: "cv",
  echo: "echo",
  clear: "clear",
  limpar: "clear",
  cls: "clear",
  github: "github",
};

const EGG_EDITORS = new Set(["vim", "vi", "nano", "emacs", "code"]);
const EGG_EXIT = new Set(["exit", "quit", "logout", ":q"]);

export function runCommand(rawInput: string, d: Dict, lang: Lang): CmdResult {
  const t = d.terminal;
  const trimmed = rawInput.trim();
  const [nameRaw, ...args] = trimmed.split(/\s+/);
  const name = nameRaw.toLowerCase();
  const argStr = args.join(" ");
  const ok = (lines: TermLineData[]): CmdResult => ({ clear: false, lines });

  // Easter eggs (checked before aliases so `sudo` never resolves to a real command)
  if (name === "sudo") return ok([line(seg(t.sudoEgg, "yellow"))]);
  if (EGG_EDITORS.has(name)) return ok([line(seg(t.editorEgg, "dim"))]);
  if (name === "rm") return ok([line(seg(t.rmEgg, "yellow"))]);
  if (EGG_EXIT.has(name)) return ok([line(seg(t.exitEgg, "dim"))]);

  const cmd = ALIASES[name];
  if (!cmd) {
    return ok([line(seg(fill(t.unknown, nameRaw), "red")), line(seg(t.tryHelp, "dim"))]);
  }

  switch (cmd) {
    case "clear":
      return { clear: true, lines: [] };

    case "help":
      return ok([
        line(seg(t.helpIntro, "white", undefined, true)),
        ...t.help.map((h) => line(seg(`  ${h.cmd}`, "cyan"), seg(` — ${h.desc}`, "dim"))),
      ]);

    case "whoami":
      return ok([
        line(seg(profile.name, "white", undefined, true)),
        line(seg(d.hero.role, "cyan")),
        line(seg(`${profile.location[lang]} · ${d.hero.available}`, "dim")),
      ]);

    case "projects":
      return ok([
        line(seg(fill(t.projectsIntro, String(projects.length)), "white", undefined, true)),
        ...projects.map((p) => line(seg(`  ${p.slug}`, "cyan"), seg(` — ${p.title[lang]}`, "dim"))),
      ]);

    case "project": {
      if (!argStr) return ok([line(seg(t.projectUsage, "dim"))]);
      const q = argStr.toLowerCase();
      const p =
        projects.find((it) => it.slug.toLowerCase() === q) ??
        projects.find((it) => it.slug.toLowerCase().startsWith(q));
      if (!p) {
        return ok([line(seg(fill(t.projectNotFound, argStr), "red")), line(seg(t.tryHelp, "dim"))]);
      }
      const url = repoUrl(p);
      const lines: TermLineData[] = [
        line(seg(p.title[lang], "white", undefined, true)),
        line(seg(p.description[lang], "dim")),
        line(
          seg(`${t.languageLabel}: `, "dim"),
          seg(p.language),
          seg("  ·  ", "dim"),
          seg(`${t.stackLabel}: `, "dim"),
          seg(p.tags.join(" · "))
        ),
        line(seg(`${t.highlightsLabel}:`, "cyan")),
        ...p.highlights[lang].map((h) => line(seg("  ✓ ", "green"), seg(h))),
      ];
      if (url) lines.push(line(seg(`${t.repoLabel}: `, "dim"), seg(url, "cyan", url)));
      return ok(lines);
    }

    case "skills":
      return ok([
        line(seg(t.skillsTitle, "white", undefined, true)),
        ...d.about.skillGroups.flatMap((g) => [
          line(seg(g.title, "cyan")),
          line(seg(`  ${g.items.join(" · ")}`, "dim")),
        ]),
      ]);

    case "experience":
      return ok([
        line(seg(t.expTitle, "white", undefined, true)),
        ...d.experience.jobs.flatMap((j) => [
          line(seg(`${j.role} @ ${j.company}`, "cyan")),
          line(seg(`  ${j.period} · ${j.location}`, "dim")),
          ...j.bullets.map((b) => line(seg(`  - ${b}`, "plain"))),
        ]),
      ]);

    case "contact":
      return ok([
        line(seg(t.contactTitle, "white", undefined, true)),
        line(seg(`${d.contact.emailLabel}: `, "dim"), seg(profile.email, "cyan", `mailto:${profile.email}`)),
        line(seg(`${d.contact.phoneLabel}: `, "dim"), seg(profile.phone)),
        line(seg(`${d.contact.locationLabel}: `, "dim"), seg(profile.location[lang])),
        line(seg(`${d.contact.githubLabel}: `, "dim"), seg(profile.github, "cyan", profile.github)),
      ]);

    case "cv": {
      const file = "/cv/Lucas_Welter_Bohrer_CV.pdf";
      return ok([line(seg(`${d.contact.cvLabel}: `, "dim"), seg(file, "cyan", file))]);
    }

    case "neofetch": {
      const n = d.about.neofetch;
      return ok([
        line(seg(n.user, "cyan", undefined, true)),
        line(seg("────────────────", "dim")),
        line(seg(`${n.degree}: `, "dim"), seg(n.degreeValue)),
        line(seg(`${n.stack}: `, "dim"), seg(n.stackValue)),
        line(seg(`${n.focus}: `, "dim"), seg(n.focusValue)),
        line(seg(`${n.base}: `, "dim"), seg(n.baseValue)),
      ]);
    }

    case "github":
      return ok([line(seg(profile.github, "cyan", profile.github))]);

    case "echo":
      return ok(argStr ? [line(seg(argStr))] : [line()]);

    default:
      return ok([line(seg(fill(t.unknown, nameRaw), "red")), line(seg(t.tryHelp, "dim"))]);
  }
}
