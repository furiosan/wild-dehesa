# Wild Dehesa

Birdwatching guide to Extremadura, Spain. Source for wilddehesa.com.

## How it works

- `content.mjs` holds all text and data (months, species, routes, sources, contact details).
- `build.mjs` turns it into plain HTML pages in `public/`. No dependencies, Node 18 or newer.
- `src/` holds the stylesheet, script and self-hosted fonts.
- `public/` is the finished site. Cloudflare Pages serves it as is.

To rebuild after an edit: `node build.mjs`

## Cloudflare Pages settings

- Framework preset: None
- Build command: leave empty
- Build output directory: `public`

## Before launch

- Confirm the contact email in `content.mjs` (SITE.email) exists and forwards to a real inbox.
- Add the legal operator details (name, tax ID, address) to the privacy page if required.
- Have a local guide review the calendar and species chart.
