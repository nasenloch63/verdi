# Ristorante Verdi Pizzeria – Website

Statische, blitzschnelle Website für das **Ristorante Verdi Pizzeria** in Hessisch Lichtenau (Desseler Straße 15).

## Tech-Stack

- **Framework:** [Astro](https://astro.build) (statischer Output, minimale JS-Islands)
- **Styling:** Tailwind CSS v4 + lokal gehostete Variable-Fonts (`Fraunces` & `Plus Jakarta Sans`)
- **Bildoptimierung:** Astro Assets + Sharp (AVIF/WebP, responsive `srcset`, Lazy Loading)
- **Datenschutz & SEO:** Keine Cookies, kein Tracking, eigene OpenStreetMap-Vektorkarte ohne Drittanbieter-Anfragen (`scripts/build-map.cjs`), `sitemap.xml`, `robots.txt` und vollständiges JSON-LD `Restaurant` + `Menu` Schema
- **Speisekarte:** Bearbeitbar über [`src/data/menu.json`](src/data/menu.json)

## Entwicklung

```bash
npm install
npm run dev      # Lokaler Entwicklungsserver (http://localhost:4321)
npm run check    # TypeScript & Astro Prüfung
npm run build    # Produktions-Build in dist/
npm run preview  # Vorschau des Produktions-Builds
```

## Dokumentation

- [`docs/analysis-and-plan.md`](docs/analysis-and-plan.md) – Geschäftsanalyse, Wettbewerbsvergleich & Website-Plan
- [`docs/build-prompt.md`](docs/build-prompt.md) – Build-Briefing

## Offene Punkte vor offizieller Bewerbung (TODO)

1. **Impressum & Datenschutz** (`src/pages/impressum.astro` & `src/pages/datenschutz.astro`): Inhabername, E-Mail-Adresse, ggf. USt-IdNr. und zuständige Behörde eintragen.
2. **Domain:** Eigene Domain (z. B. `ristorante-verdi.com` oder `.de`) verbinden und `SITE_URL` in Vercel hinterlegen.
3. **Speisekarte prüfen:** Familien-Pizza (50 cm Ø) ggf. ergänzen, falls weiterhin angeboten.
