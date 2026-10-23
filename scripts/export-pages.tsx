import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../app/page";

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, "docs");
const compiledCss = fs
  .readdirSync(path.join(projectRoot, "dist/client/_next/static/css"))
  .find((file) => file.endsWith(".css"));

if (!compiledCss) {
  throw new Error("CSS compilado não encontrado. Execute pnpm build primeiro.");
}

fs.rmSync(outputDir, { force: true, recursive: true });
fs.mkdirSync(path.join(outputDir, "assets"), { recursive: true });
fs.cpSync(path.join(projectRoot, "public/fonts"), path.join(outputDir, "fonts"), {
  recursive: true,
});
fs.copyFileSync(
  path.join(projectRoot, "public/favicon.svg"),
  path.join(outputDir, "favicon.svg"),
);

let css = fs.readFileSync(
  path.join(projectRoot, "dist/client/_next/static/css", compiledCss),
  "utf8",
);
css = css.replaceAll("/fonts/", "../fonts/");
fs.writeFileSync(path.join(outputDir, "assets/site.css"), css);

const pageMarkup = renderToStaticMarkup(<Home />);
const accordionScript = `
  document.querySelectorAll('[data-slot="accordion-trigger"]').forEach((trigger) => {
    const item = trigger.closest('[data-slot="accordion-item"]');
    const content = item?.querySelector('[data-slot="accordion-content"]');
    if (!item || !content) return;
    item.dataset.state = 'closed';
    trigger.dataset.state = 'closed';
    trigger.setAttribute('aria-expanded', 'false');
    content.dataset.state = 'closed';
    content.hidden = true;
    trigger.addEventListener('click', () => {
      const opening = trigger.getAttribute('aria-expanded') !== 'true';
      document.querySelectorAll('[data-slot="accordion-trigger"]').forEach((other) => {
        const otherItem = other.closest('[data-slot="accordion-item"]');
        const otherContent = otherItem?.querySelector('[data-slot="accordion-content"]');
        if (!otherItem || !otherContent) return;
        otherItem.dataset.state = 'closed';
        other.dataset.state = 'closed';
        other.setAttribute('aria-expanded', 'false');
        otherContent.dataset.state = 'closed';
        otherContent.hidden = true;
      });
      if (opening) {
        item.dataset.state = 'open';
        trigger.dataset.state = 'open';
        trigger.setAttribute('aria-expanded', 'true');
        content.dataset.state = 'open';
        content.hidden = false;
      }
    });
  });
`;

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#050506" />
    <meta name="description" content="Coleta de dados do mundo real e operações de campo no Brasil para Physical AI e robótica." />
    <title>OperumData | Operações de campo para Physical AI no Brasil</title>
    <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="./assets/site.css" />
  </head>
  <body>
    ${pageMarkup}
    <script>${accordionScript}</script>
  </body>
</html>
`;

fs.writeFileSync(path.join(outputDir, "index.html"), html);
fs.writeFileSync(path.join(outputDir, ".nojekyll"), "");

console.log(`GitHub Pages exportado para ${outputDir}`);
