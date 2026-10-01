const { chromium } = require("playwright-core");

const CHROME = "/home/hatch/.cache/ms-playwright/chromium-1243/chrome-linux/chrome";
const BASE = "http://localhost:3100";
const OUT = "/home/hatch/workspace/your_files/portfolio-layout";

const TABS = [
  { id: "home", pt: "Início", en: "Home" },
  { id: "about", pt: "Sobre", en: "About" },
  { id: "projects", pt: "Projetos", en: "Projects" },
  { id: "experience", pt: "Experiência", en: "Experience" },
  { id: "contact", pt: "Contato", en: "Contact" },
];

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // capture console errors
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));

  for (const lang of ["pt", "en"]) {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE, { waitUntil: "networkidle" });
    if (lang === "en") {
      await page.getByRole("button", { name: "en", exact: true }).click();
      await page.waitForTimeout(600);
    }
    for (const tab of TABS) {
      const label = lang === "pt" ? tab.pt : tab.en;
      await page.getByRole("navigation").getByRole("button", { name: label, exact: true }).click();
      await page.waitForTimeout(1200); // animations settle
      await page.screenshot({ path: `${OUT}/${lang}-${tab.id}.png`, fullPage: true });
      console.log("saved", `${lang}-${tab.id}.png`);
    }
  }

  // mobile check — home PT
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto(BASE, { waitUntil: "networkidle" });
  await mob.waitForTimeout(1200);
  await mob.screenshot({ path: `${OUT}/pt-home-mobile.png`, fullPage: true });
  console.log("saved pt-home-mobile.png");

  console.log("CONSOLE ERRORS:", errors.length ? errors : "none");
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
