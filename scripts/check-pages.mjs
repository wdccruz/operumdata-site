// Static checks for the exported GitHub Pages site in docs/.
// Verifies both languages exist, in-page anchors resolve, the language
// switcher points at real files and every local asset reference exists.
import fs from "node:fs";
import path from "node:path";

const docs = path.join(process.cwd(), "docs");
const pages = [
  { file: "index.html", lang: "en", mustContain: ["Real-World Data Collection.", "Field Operations", "Discuss your Brazil field data project", "Send your project brief"] },
  { file: "pt/index.html", lang: "pt-BR", mustContain: ["Coleta de Dados do Mundo Real.", "Operações de Campo", "Enviar o briefing do projeto"] },
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
      if (!ref.startsWith("https://wdccruz.github.io/operumdata-site/")) fail(`${page.file}: unexpected external reference ${ref}`);
    } else {
      const target = path.resolve(dir, ref.split("#")[0]);
      const resolved = ref.endsWith("/") || fs.existsSync(target) && fs.statSync(target).isDirectory() ? path.join(target, "index.html") : target;
      if (!resolved.startsWith(docs) || !fs.existsSync(resolved)) fail(`${page.file}: broken local reference ${ref}`);
    }
  }

  const langLinks = [...html.matchAll(/<a[^>]*class="lang-switch__item"[^>]*>/g)];
  if (langLinks.length < 1) fail(`${page.file}: language switcher link missing`);
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
