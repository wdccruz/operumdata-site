# OperumData — institutional site

Bilingual landing page for OperumData: field operations in Brazil for
real-world data, robotics and Physical AI.

- English (primary): `/` → https://wdccruz.github.io/operumdata-site/
- Portuguese: `/pt/` → https://wdccruz.github.io/operumdata-site/pt/

## Direction

- dark industrial-tech, editorial and futurist, grounded in the physical world
- deep black, off-white, cool greys and signal orange `#FF5A1F`
- local display and mono typefaces, no external fonts or images
- animations tied to the business: an atmospheric OperumData coordination network behind the hero,
  the requirements → execution bridge, a living field network and the pilot-first method
- all animation is CSS/SVG, pauses off-screen and respects `prefers-reduced-motion`
- no invented clients, metrics, completed operations or coverage claims;
  every visual model is labelled as a concept

## Structure

```text
app/
  layout.tsx            metadata (English) and global CSS
  page.tsx              English route (/)
  pt/page.tsx           Portuguese route (/pt)
  globals.css           visual system, animations, responsive and reduced-motion rules
components/site/
  home-page.tsx         the full page, rendered per language
  visuals.tsx           hero background network, bridge, service glyphs, real-work links, field network
  site-script.tsx       small progressive-enhancement script (reveal, nav state, matrix)
lib/site-content.ts     all copy in EN and PT, plus CONTACT_EMAIL
scripts/export-pages.tsx  static export to docs/ (index.html + pt/index.html)
scripts/check-pages.mjs   checks the export: both languages, anchors, assets, switcher
```

## Run locally

Requirements: Node.js 22.13+ and pnpm.

```bash
pnpm install
pnpm dev
```

## Build and publish

```bash
pnpm lint
pnpm export:pages   # builds and writes docs/
pnpm check:pages    # verifies docs/
```

Pushing to `main` runs `.github/workflows/pages.yml`, which lints, exports,
checks and deploys `docs/` to GitHub Pages.

## HostGator (or any Apache / cPanel host)

```bash
pnpm install
pnpm package:hostgator                              # for https://operumdata.com/
SITE_URL=https://www.operumdata.com/ pnpm package:hostgator   # other domain
```

This writes `hosting/operumdata-site-hostgator.zip` (static files plus an
`.htaccess` with HTTPS redirect, caching and compression). Upload steps:

1. cPanel → **SSL/TLS Status**: enable the free SSL certificate for the domain.
2. cPanel → **File Manager** → open `public_html` (or the domain's folder).
3. **Upload** the zip, then right-click it → **Extract**, and delete the zip.
4. Turn on "Show hidden files" and confirm `.htaccess` is there.
5. Open the domain: English at `/`, Portuguese at `/pt/`.

## Search engines and AI assistants

`pnpm export:pages` also writes `robots.txt` (allows search and AI crawlers, points to the
sitemap), `sitemap.xml` (EN + PT with hreflang), `llms.txt` (Markdown summary for AI
assistants, built from `lib/site-content.ts`) and a non-indexed `404.html`. Each page gets
canonical, hreflang, Open Graph/Twitter tags with `public/og-image*.png` (1200×630) and
schema.org JSON-LD (Organization, WebSite, WebPage, Service, FAQPage) built from the same copy.

The GitHub Pages workflow exports with `NOINDEX=1` (it is only a copy, pages carry noindex);
the HostGator package is the official address and is always indexable. After going live, add the site to Google Search Console and Bing
Webmaster Tools and submit `sitemap.xml`.

## Social profiles

Set `SOCIAL_LINKS` in `lib/site-content.ts`. Each filled link shows a LinkedIn
or Facebook button in the footer of both languages; empty ones stay hidden.

## Pending before commercial launch

Set `CONTACT_EMAIL` in `lib/site-content.ts` once a commercial inbox exists.
Until then the contact buttons open a pre-filled brief with a blank recipient
and the page says so openly.
