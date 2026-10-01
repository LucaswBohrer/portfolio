const { chromium } = require("playwright-core");

const CHROME = "/home/hatch/.cache/ms-playwright/chromium-1243/chrome-linux/chrome";
const BASE = "http://localhost:3100";
const OUT = "/home/hatch/workspace/your_files/portfolio-layout";

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE, { waitUntil: "networkidle" });

  // SEO checks
  const seo = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    jsonLd: !!document.querySelector('script[type="application/ld+json"]'),
    lang: document.documentElement.lang,
    ariaCurrent: document.querySelector('nav [aria-current="page"]')?.textContent,
  }));
  console.log("SEO:", JSON.stringify(seo, null, 1));

  // Home + services
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/v2-pt-home-services.png`, fullPage: false });

  // Projects tab — expand first case
  await page.getByRole("button", { name: "Projetos", exact: true }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/v2-pt-projects-cases.png` });
  const caseBtn = page.getByRole("button", { name: "Ver case" }).first();
  await caseBtn.scrollIntoViewIfNeeded();
  await caseBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/v2-pt-projects-case-open.png` });

  // Filter test
  await page.getByRole("button", { name: "Embarcados" }).click();
  await page.waitForTimeout(500);
  const cards = await page.locator('[role="listitem"]').count();
  console.log("filter 'Embarcados' -> cards:", cards, "(expected 2: axion, farmtech)");
  await page.screenshot({ path: `${OUT}/v2-pt-projects-filter.png` });

  // Contact tab — intent CTAs
  await page.getByRole("button", { name: "Contato", exact: true }).click();
  await page.waitForTimeout(800);
  const intentHref = await page.getByRole("link", { name: /Quero conversar sobre um projeto/ }).getAttribute("href");
  console.log("intent mailto:", intentHref?.slice(0, 80));
  await page.screenshot({ path: `${OUT}/v2-pt-contact-intents.png` });

  // CV download link
  const cvHref = await page.getByRole("link", { name: "Baixar currículo" }).getAttribute("href");
  console.log("cv href:", cvHref);

  // EN switch — check lang attribute + aria-pressed
  await page.getByRole("button", { name: "en", exact: true }).click();
  await page.waitForTimeout(600);
  const enState = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    enPressed: document.querySelector('button[aria-pressed="true"]')?.textContent,
    servicesTitle: document.querySelector("#services-title"),
  }));
  console.log("EN state:", JSON.stringify({ lang: enState.lang, enPressed: enState.enPressed }));

  // keyboard: tab to first focusable, check focus visible
  await page.getByRole("button", { name: "Home", exact: true }).click();
  await page.waitForTimeout(500);
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName + " " + (document.activeElement?.textContent || "").slice(0, 30));
  console.log("after Tab, focused:", focused);

  // mobile 390
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/v2-en-projects-mobile.png` });

  console.log("console errors:", errors.length ? errors : "none");
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
