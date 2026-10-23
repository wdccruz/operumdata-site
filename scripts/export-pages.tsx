import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "../components/site/home-page";
import { content, type Lang } from "../lib/site-content";

// Public URL of the GitHub Pages site. English is served at the root and
// Portuguese at /pt/.
const SITE_URL = "https://wdccruz.github.io/operumdata-site/";

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, "docs");
const cssDir = path.join(projectRoot, "dist/client/_next/static/css");
const compiledCss = fs.readdirSync(cssDir).find((file) => file.endsWith(".css"));

if (!compiledCss) {
  throw new Error("Compiled CSS not found. Run pnpm build first.");
}

fs.rmSync(outputDir, { force: true, recursive: true });
fs.mkdirSync(path.join(outputDir, "assets"), { recursive: true });
fs.cpSync(path.join(projectRoot, "public/fonts"), path.join(outputDir, "fonts"), { recursive: true });
fs.copyFileSync(path.join(projectRoot, "public/favicon.svg"), path.join(outputDir, "favicon.svg"));

let css = fs.readFileSync(path.join(cssDir, compiledCss), "utf8");
css = css.replaceAll("/fonts/", "../fonts/");
fs.writeFileSync(path.join(outputDir, "assets/site.css"), css);

const escapeAttr = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

function renderPage(lang: Lang) {
  const t = content[lang];
  const prefix = lang === "en" ? "./" : "../";
  const url = lang === "en" ? SITE_URL : `${SITE_URL}pt/`;
  const markup = renderToStaticMarkup(<HomePage lang={lang} />);
  return `<!doctype html>
<html lang="${t.htmlLang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#050506" />
    <meta name="color-scheme" content="dark" />
    <title>${escapeAttr(t.meta.title)}</title>
    <meta name="description" content="${escapeAttr(t.meta.description)}" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="en" href="${SITE_URL}" />
    <link rel="alternate" hreflang="pt-BR" href="${SITE_URL}pt/" />
    <link rel="alternate" hreflang="x-default" href="${SITE_URL}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="OperumData" />
    <meta property="og:title" content="${escapeAttr(t.meta.title)}" />
    <meta property="og:description" content="${escapeAttr(t.meta.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="${lang === "en" ? "en_US" : "pt_BR"}" />
    <meta name="twitter:card" content="summary" />
    <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml" />
    <link rel="preload" href="${prefix}fonts/urw-gothic-demi.otf" as="font" type="font/otf" crossorigin />
    <link rel="stylesheet" href="${prefix}assets/site.css" />
  </head>
  <body>
    ${markup}
  </body>
</html>
`;
}

fs.writeFileSync(path.join(outputDir, "index.html"), renderPage("en"));
fs.mkdirSync(path.join(outputDir, "pt"), { recursive: true });
fs.writeFileSync(path.join(outputDir, "pt/index.html"), renderPage("pt"));
fs.writeFileSync(path.join(outputDir, ".nojekyll"), "");

console.log(`GitHub Pages exported to ${outputDir} (en: /, pt: /pt/)`);
