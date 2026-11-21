# Build Prompt – Ristorante Verdi Website

**Recommended model:** Gemini 3 Pro (the strongest Gemini model for agentic coding and frontend design)
**Thinking intensity:** **High.** Use the maximum thinking budget, because this is a multi-file build where design quality matters.
**Where to run it:** Antigravity agent mode in this repo (`c:\Users\flasc\OneDrive\Desktop\verdi`), so the agent can run commands, build and deploy. Tip: start it with `/goal` so it won't stop until the deployment is live.

---

## Prompt (copy everything below)

You are a senior creative developer and award-winning web designer (Awwwards / CSS Design Awards level). Build a production-ready website for **Ristorante Verdi Pizzeria** in this repository and deploy it on Vercel.

### Context
- Read `docs/analysis-and-plan.md` first. It contains all the business facts, the full menu with prices, opening hours, reviews, the benchmarks and the sitemap. Use ONLY facts from that file. Never invent prices, dishes, awards or quotes.
- Photos are in `assets/google-maps/` and `assets/facebook/`. Look at every image, pick the best food, pizza and interior shots, and skip the menu brochures except as a reference. Optimise them (AVIF/WebP, responsive `srcset`, lazy loading).
- Benchmarks: Tripletta Pizza (bold, playful identity) and Pizza 4P's (storytelling, interactive menu). Match their level of craft without copying them.

### Tech stack
- Astro (latest) + TypeScript + Tailwind CSS. Static output, with minimal JavaScript islands.
- Store the menu as structured data in `src/data/menu.json` so the owner can edit it easily.
- Motion: use subtle, performant animations (CSS + the View Transitions API, optionally a small GSAP/Lenis setup) and respect `prefers-reduced-motion`.
- Language: German (`lang="de"`). All UI copy is in natural German.

### Design direction
- Concept: "Steinofen, Wärme, Verdi". Use a cream/paper background, tomato red (#C8341F-ish), basil green (a nod to the name "Verdi"), and charcoal text.
- Typography: an expressive serif display face for headings (e.g. Fraunces or Playfair) and a clean sans for body text. Self-host the fonts.
- Signature moments: an oversized hero with a pizza photo and a warm grain texture; an interactive menu with sticky category tabs, veggie filter and smooth transitions; a review marquee; a hand-drawn line accent; a live "Jetzt geöffnet / Geschlossen" badge based on the hours (Europe/Berlin timezone, Tuesday closed, 11:00–14:30 and 17:00–21:30).
- Mobile first. The primary CTA is **"Jetzt anrufen" → tel:+4956027100**, sticky on mobile. The secondary CTA is "Speisekarte".

### Sections (one page)
1. Hero – headline e.g. "Steinofen-Pizza aus Hessisch Lichtenau", 4.7 ★ from 216 Google reviews, CTAs.
2. Speisekarte – all categories from the plan with prices in €, a note on extras, and the mini pizzas.
3. Über uns – stone oven, generous portions, fair prices, fast takeaway.
4. Bewertungen – real quotes from the plan only, plus a link to Google reviews.
5. Galerie – a masonry/lightbox gallery.
6. Besuch & Abholung – hours table, address, click-to-load Google Map (no third-party requests before consent), free parking, accessibility, family and dog friendly, card/NFC payment, no delivery.
7. Footer + separate pages `/impressum` and `/datenschutz`. These are legally required in Germany: use clear placeholders marked `TODO` for the owner's legal details.

### Quality bar (must pass before deploying)
- Lighthouse mobile scores of 95+ in all four categories. WCAG 2.2 AA contrast, keyboard navigation, alt text everywhere.
- SEO: meta tags, Open Graph image, `sitemap.xml`, `robots.txt`, and JSON-LD `Restaurant` schema (address, geo 51.1965095/9.7238208, phone, openingHoursSpecification, priceRange "€", servesCuisine "Italian", hasMenu).
- No cookies and no tracking by default. Add a favicon/logo (create a simple SVG wordmark "Verdi").
- Run `npm run build` with zero errors, then check the page visually in the browser on mobile and desktop widths, and fix anything that looks unpolished.

### Deployment
1. Commit in logical steps and push to `origin main` (https://github.com/nasenloch63/verdi).
2. Deploy with the Vercel CLI: `npx vercel link`, then `npx vercel --prod` (framework preset Astro). If login is needed, ask me.
3. Report back with the production URL, the Lighthouse scores, and a list of the `TODO`s the owner must fill in (Impressum data, photo rights, domain).
