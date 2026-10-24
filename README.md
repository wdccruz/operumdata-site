# OperumData — institutional site

Bilingual landing page for OperumData: field operations in Brazil for
real-world data, robotics and Physical AI.

- English (primary): `/` → https://wdccruz.github.io/operumdata-site/
- Portuguese: `/pt/` → https://wdccruz.github.io/operumdata-site/pt/

## Direction

- dark industrial-tech, editorial and futurist, grounded in the physical world
- deep black, off-white, cool greys and signal orange `#FF5A1F`
- local display and mono typefaces, no external fonts or images
- animations tied to the business: the hero coordination layer (requirements → OperumData → local network → execution),
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
  visuals.tsx           hero coordination layer, bridge, service glyphs, real-work links, field network
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

## Pending before commercial launch

Set `CONTACT_EMAIL` in `lib/site-content.ts` once a commercial inbox exists.
Until then the contact buttons open a pre-filled brief with a blank recipient
and the page says so openly.
