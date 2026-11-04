import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "../components/site/home-page";
import { content, SOCIAL_LINKS, type Lang } from "../lib/site-content";

// Public URL of the site. English is served at the root and Portuguese at /pt/.
// SITE_URL and OUT_DIR can be overridden, e.g. for the HostGator package.
const SITE_URL = process.env.SITE_URL || "https://wdccruz.github.io/operumdata-site/";
// Brazilian partners page (Portuguese), listed in llms.txt for AI assistants.
const PARTNERS_URL =
  process.env.PARTNERS_URL ||
  (/operumdata\.com\/$/.test(SITE_URL) ? "https://parceiros.operumdata.com/" : "https://wdccruz.github.io/parceiros-operumdata/");
// NOINDEX=1 exports a copy that asks search engines not to index it.
const INDEX = !process.env.NOINDEX;

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, process.env.OUT_DIR || "docs");
const cssDir = path.join(projectRoot, "dist/client/_next/static/css");
const compiledCss = fs.readdirSync(cssDir).find((file) => file.endsWith(".css"));

if (!compiledCss) {
  throw new Error("Compiled CSS not found. Run pnpm build first.");
}

fs.rmSync(outputDir, { force: true, recursive: true });
fs.mkdirSync(path.join(outputDir, "assets"), { recursive: true });
fs.cpSync(path.join(projectRoot, "public/fonts"), path.join(outputDir, "fonts"), { recursive: true });
for (const file of ["favicon.svg", "og-image.png", "og-image-pt.png", "apple-touch-icon.png", "icon-512.png"]) {
  fs.copyFileSync(path.join(projectRoot, "public", file), path.join(outputDir, file));
}

let css = fs.readFileSync(path.join(cssDir, compiledCss), "utf8");
css = css.replaceAll("/fonts/", "../fonts/");
fs.writeFileSync(path.join(outputDir, "assets/site.css"), css);

const escapeAttr = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

const pageUrl = (lang: Lang) => (lang === "en" ? SITE_URL : `${SITE_URL}pt/`);
const ogImage = (lang: Lang) => `${SITE_URL}${lang === "en" ? "og-image.png" : "og-image-pt.png"}`;
const ORG_ID = `${SITE_URL}#organization`;

// Structured data (schema.org) for search engines and AI assistants.
// Only facts stated on the page: no ratings, client names, metrics or street address.
function structuredData(lang: Lang) {
  const t = content[lang];
  const url = pageUrl(lang);
  const sameAs = [SOCIAL_LINKS.facebook].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "OperumData",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}icon-512.png`, width: 512, height: 512 },
        description: content.en.footer.tagline,
        foundingLocation: { "@type": "Place", name: "Rio Grande do Sul, Brazil" },
        areaServed: { "@type": "Country", name: "Brazil" },
        knowsAbout: ["Real-world data collection", "Field operations", "Physical AI", "Robotics", "Egocentric video capture", "Data collection logistics"],
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: "OperumData",
        inLanguage: ["en", "pt-BR"],
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: t.htmlLang,
        isPartOf: { "@id": `${SITE_URL}#website` },
        about: { "@id": `${url}#service` },
        primaryImageOfPage: { "@type": "ImageObject", url: ogImage(lang), width: 1200, height: 630 },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: t.hero.titleLine1.replace(/\.$/, "") + " · " + t.hero.titleLine2 + " " + t.hero.titleAccent.replace(/\.$/, ""),
        serviceType: t.what.items[0].title,
        description: t.hero.lead,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: lang === "en" ? "Brazil" : "Brasil" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: t.what.title,
          itemListElement: t.what.items.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item.title, description: item.text },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: t.htmlLang,
        mainEntity: t.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

function renderPage(lang: Lang) {
  const t = content[lang];
  const prefix = lang === "en" ? "./" : "../";
  const url = pageUrl(lang);
  const ld = JSON.stringify(structuredData(lang)).replace(/</g, "\\u003c");
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
    <meta name="robots" content="${INDEX ? "index, follow, max-image-preview:large, max-snippet:-1" : "noindex, follow"}" />
    <meta name="author" content="OperumData" />
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
    <meta property="og:locale:alternate" content="${lang === "en" ? "pt_BR" : "en_US"}" />
    <meta property="og:image" content="${ogImage(lang)}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeAttr(t.meta.ogAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(t.meta.title)}" />
    <meta name="twitter:description" content="${escapeAttr(t.meta.description)}" />
    <meta name="twitter:image" content="${ogImage(lang)}" />
    <meta name="twitter:image:alt" content="${escapeAttr(t.meta.ogAlt)}" />
    <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${prefix}apple-touch-icon.png" />
    <link rel="alternate" type="text/plain" title="LLM summary" href="${prefix}llms.txt" />
    <link rel="preload" href="${prefix}fonts/urw-gothic-demi.otf" as="font" type="font/otf" crossorigin />
    <link rel="stylesheet" href="${prefix}assets/site.css" />
    <script type="application/ld+json">${ld}</script>
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

// Files for search engines and AI assistants.
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot", "Applebot-Extended", "Bingbot",
  "DuckAssistBot", "Meta-ExternalAgent", "MistralAI-User", "CCBot", "Amazonbot", "cohere-ai",
];
fs.writeFileSync(
  path.join(outputDir, "robots.txt"),
  INDEX
    ? `# OperumData: public content. Search engines and AI assistants may read and cite it.
User-agent: *
Allow: /

${AI_BOTS.map((bot) => `User-agent: ${bot}`).join("\n")}
Allow: /

Sitemap: ${SITE_URL}sitemap.xml
`
    : "User-agent: *\nDisallow: /\n",
);

const today = new Date().toISOString().slice(0, 10);
const alternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE_URL}pt/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}" />`;
fs.writeFileSync(
  path.join(outputDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${(["en", "pt"] as Lang[])
  .map(
    (lang) => `  <url>
    <loc>${pageUrl(lang)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${lang === "en" ? "1.0" : "0.9"}</priority>${alternates}
    <image:image><image:loc>${ogImage(lang)}</image:loc></image:image>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
);

// llms.txt (https://llmstxt.org/): plain Markdown summary for AI assistants.
const en = content.en;
const bullets = (items: { title: string; text: string }[]) => items.map((i) => `- ${i.title}: ${i.text}`).join("\n");
fs.writeFileSync(
  path.join(outputDir, "llms.txt"),
  `# OperumData

> ${en.hero.lead} Initial base in Rio Grande do Sul, Brazil. OperumData is a new company in an experimental phase, open to pilot projects; it does not publish client names, metrics or completed AI data-capture projects.

${en.why.paragraphs.join("\n\n")}

## Pages

- [OperumData (English)](${SITE_URL}): field operations in Brazil for real-world data collection, robotics and Physical AI
- [OperumData (Português)](${SITE_URL}pt/): the same content in Brazilian Portuguese
- [OperumData Parceiros Brasil](${PARTNERS_URL}): Portuguese page for Brazilian companies interested in hosting authorised data capture of their work

## What we do

${en.what.description}

${bullets(en.what.items)}

## Real work environments (examples)

${en.realWork.environments.map((e) => `- ${e.title}: ${e.text}`).join("\n")}

What these environments can teach: ${en.realWork.capabilities.map((c) => c.title.toLowerCase()).join(", ")}.
${en.realWork.disclaimer}

## Field network

${en.network.paragraphs.join("\n\n")}

## Method: ${en.method.title}

${en.method.steps.map((s, i) => `${i + 1}. ${s.label}: ${s.text}`).join("\n")}

${en.method.gate}: ${en.method.gateText}

## Control and trust

${bullets(en.trust.items)}

## Background

${en.experience.paragraphs.join("\n\n")}

## FAQ

${en.faq.items.map((item) => `### ${item.q}\n\n${item.a}`).join("\n\n")}

## Contact

${en.cta.text}
`,
);

// Not-found page (self-contained, never indexed).
fs.writeFileSync(
  path.join(outputDir, "404.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, follow" />
    <title>Page not found | OperumData</title>
    <link rel="icon" href="${SITE_URL}favicon.svg" type="image/svg+xml" />
    <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#050506;color:#f7f4ef;font:16px/1.5 system-ui,sans-serif;padding:24px}main{max-width:520px}h1{font-size:2rem;margin:0 0 8px}p{color:#b9b5ae}a{color:#ff5a1f}</style>
  </head>
  <body>
    <main>
      <h1>Page not found.</h1>
      <p>The address you opened does not exist. / Esta página não existe.</p>
      <p><a href="${SITE_URL}">OperumData (English)</a> · <a href="${SITE_URL}pt/">OperumData (Português)</a></p>
    </main>
  </body>
</html>
`,
);

if (!process.env.OUT_DIR) fs.writeFileSync(path.join(outputDir, ".nojekyll"), "");

console.log(`GitHub Pages exported to ${outputDir} (en: /, pt: /pt/)`);
