// Static checks for the exported GitHub Pages site in docs/.
// Verifies both languages exist, in-page anchors resolve, the language
// switcher points at real files and every local asset reference exists.
import fs from "node:fs";
import path from "node:path";

const docs = path.join(process.cwd(), process.env.OUT_DIR || "docs");
const SITE_URL = process.env.SITE_URL || "https://wdccruz.github.io/operumdata-site/";
const SOCIAL = /^https:\/\/(www\.)?(linkedin\.com|facebook\.com)\//;
const pages = [
  { file: "index.html", lang: "en", mustContain: ["Real-World Data Collection.", "Field Operations", "Discuss your Brazil field data project", "Send your project brief", "id=\"brief-form\""] },
  { file: "pt/index.html", lang: "pt-BR", mustContain: ["Coleta de Dados do Mundo Real.", "Operações de Campo", "Enviar o briefing do projeto", "id=\"brief-form\""] },
];

const failures = [];
const fail = (msg) => failures.push(msg);

for (const page of pages) {
  const filePath = path.join(docs, page.file);
  if (!fs.existsSync(filePath)) {
    fail(`${page.file}: missing`);
    continue;
  }
  const html = fs.readFileSync(filePath, "utf8");
  const dir = path.dirname(filePath);

  if (!html.includes(`<html lang="${page.lang}">`)) fail(`${page.file}: expected <html lang="${page.lang}">`);
  for (const text of page.mustContain) {
    if (!html.includes(text)) fail(`${page.file}: missing text "${text}"`);
  }
  if (/>\s*undefined\s*</.test(html) || html.includes("[object Object]")) fail(`${page.file}: rendered undefined/object text`);

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const dupes = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((id, i, all) => all.indexOf(id) !== i);
  if (dupes.length) fail(`${page.file}: duplicate ids ${[...new Set(dupes)].join(", ")}`);

  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (ref.startsWith("#")) {
      if (!ids.has(ref.slice(1))) fail(`${page.file}: anchor ${ref} has no target`);
    } else if (ref.startsWith("mailto:")) {
      continue;
    } else if (/^https?:\/\//.test(ref)) {
      if (!ref.startsWith(SITE_URL) && !SOCIAL.test(ref)) fail(`${page.file}: unexpected external reference ${ref}`);
    } else {
      const target = path.resolve(dir, ref.split("#")[0].split("?")[0]);
      const resolved = ref.endsWith("/") || fs.existsSync(target) && fs.statSync(target).isDirectory() ? path.join(target, "index.html") : target;
      if (!resolved.startsWith(docs) || !fs.existsSync(resolved)) fail(`${page.file}: broken local reference ${ref}`);
    }
  }

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || "";
  if (title.length > 70) fail(`${page.file}: <title> is ${title.length} chars (max 70)`);
  if (!html.includes('property="og:image"')) fail(`${page.file}: og:image missing`);
  if (!html.includes('hreflang="pt-BR"') || !html.includes('hreflang="x-default"')) fail(`${page.file}: hreflang alternates missing`);
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) fail(`${page.file}: JSON-LD missing`);
  else {
    try {
      const data = JSON.parse(ld[1]);
      for (const type of ["Organization", "WebPage", "Service", "FAQPage"]) {
        if (!data["@graph"].some((node) => node["@type"] === type)) fail(`${page.file}: JSON-LD ${type} missing`);
      }
    } catch {
      fail(`${page.file}: JSON-LD is not valid JSON`);
    }
  }
  const hasTags = /googletagmanager|fbevents/.test(html);
  if (hasTags && !process.env.OFFICIAL) fail(`${page.file}: Google/Meta tags outside the official build`);
  if (hasTags && !html.includes('id="od-consent"')) fail(`${page.file}: tags without the consent bar`);
  if (!process.env.NOINDEX && html.includes('content="noindex')) fail(`${page.file}: page asks not to be indexed`);

  const langLinks = [...html.matchAll(/<a[^>]*class="lang-switch__item"[^>]*>/g)];
  if (langLinks.length < 1) fail(`${page.file}: language switcher link missing`);
}

for (const file of ["robots.txt", "sitemap.xml", "llms.txt", "404.html", "og-image.png", "og-image-pt.png", "apple-touch-icon.png", "icon-512.png"]) {
  if (!fs.existsSync(path.join(docs, file))) fail(`${file}: missing`);
}
if (fs.existsSync(path.join(docs, "robots.txt")) && !process.env.NOINDEX) {
  const robots = fs.readFileSync(path.join(docs, "robots.txt"), "utf8");
  if (!robots.includes(`Sitemap: ${SITE_URL}sitemap.xml`)) fail("robots.txt: Sitemap line missing");
  if (/^Disallow: \/$/m.test(robots)) fail("robots.txt blocks the whole site");
}
if (fs.existsSync(path.join(docs, "sitemap.xml"))) {
  const sitemap = fs.readFileSync(path.join(docs, "sitemap.xml"), "utf8");
  for (const loc of [SITE_URL, `${SITE_URL}pt/`]) if (!sitemap.includes(`<loc>${loc}</loc>`)) fail(`sitemap.xml: ${loc} missing`);
}

const css = fs.readFileSync(path.join(docs, "assets/site.css"), "utf8");
if (!css.includes("ff5a1f")) fail("site.css: brand orange missing");
if (!css.includes("prefers-reduced-motion")) fail("site.css: reduced-motion rules missing");
if (css.includes('url(/fonts/')) fail("site.css: absolute font path would break on GitHub Pages");

if (failures.length) {
  console.error(`Page checks failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Page checks passed for ${pages.map((p) => p.file).join(", ")}.`);
