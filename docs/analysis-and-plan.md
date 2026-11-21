# Ristorante Verdi – Business Analysis & Website Plan

## 1. Business profile (sources: Google Maps, public Facebook page)

| Field | Value |
|---|---|
| Name | Ristorante Verdi Pizzeria ("Restaurante Verdi" on Google) |
| Category | Italian restaurant / stone-oven pizzeria |
| Address | Desseler Str. 15, 37235 Hessisch Lichtenau (51.1965095, 9.7238208 · Plus Code 5PWF+JG) |
| Phone | 05602 7100 |
| Web | Facebook only (fb.com/rist.verdi). The printed menu shows `www.ristorante-verdi.com`, but this hasn't been checked |
| Hours | Mon, Wed–Sun 11:00–14:30 & 17:00–21:30 · **Tuesday closed** |
| Rating | **4.7 ★ from 216 reviews** (173×5, 32×4, 8×3, 1×2, 2×1) |
| Price | €10–20 per person. Pizza €7–11, mini pizza €4–5, pasta €7–10, family pizza 50 cm €15 (printed menu) |
| Services | Dine-in, takeaway, outdoor seating, reservations. **No delivery** |
| Amenities | Wheelchair accessible, child-friendly, high chairs, dogs allowed, free parking, card/NFC payment |
| Facebook | 160 followers. Posts, about, hours and photos require a login and weren't collected |
| Peak times | Friday 18–20h (100%), Friday lunch 12h (92%) |

Full menu (pizze, mini-pizze, salate, pasta al forno, pasta, extras): see section 3 of the research report. All items and prices were taken from the Google Maps menu tab.

### Review insights
- **Strengths:** "best Italian far and wide", thin crust, big portions, very fast, unbeatable value.
- **Weaknesses:** counter/self-service (no "real restaurant" feel), a few complaints about the chef being unfriendly, and the dining room is not very inviting.
- **Opportunity:** takeaway is the main use case → online menu + pre-ordering/call-to-order is the biggest win.

## 2. Assets in repo
- `assets/google-maps/` – 24 full-res photos (food, pizza, interior, menu brochures). There are no exterior photos.
- `assets/facebook/` – cover and profile images. These are screenshots, so they are low-res.
- Licensing: these photos come from customers and the owner on Google. **Get the owner's permission or take new photos before publishing.**

## 3. Benchmark: award-winning sites in the category

| | Tripletta Pizza (Awwwards Site of the Day) | Pizza 4P's (Awwwards Honorable Mention) |
|---|---|---|
| Concept | Loud, playful brand identity; big type; lots of colour | Storytelling brand with an interactive "menu book" |
| What's strong | Personality and atmosphere, food shown large, fast path to menu and locations | Story of the dough and ingredients, interactive menu, clear reservation CTA |
| Weak spots for us | Heavy animation, slow on mobile | Complex, expensive to build |
| Takeaway for Verdi | Bold, warm visual identity; hero pizza photography | Present the menu as the core experience; tell the story of the stone oven and the chef |

Verdi today: **no website at all.** It relies on Facebook, which hides most information from visitors who aren't logged in. A simple, fast site would beat all local competitors.

## 4. Website plan

**Goal:** turn Google/Maps searches into phone orders and visits. Mobile-first, German language, loads in under 1 s.

**Sitemap (single page + legal pages)**
1. Hero – pizza photo, "Steinofen-Pizza in Hessisch Lichtenau", buttons **Jetzt anrufen** (tel:056027100) and **Speisekarte**, open/closed badge driven by the opening hours.
2. Speisekarte – filterable tabs (Pizza, Mini, Pasta, Al Forno, Salate, Extras), with vegetarian tags.
3. Über uns – the stone oven, the chef, fair prices.
4. Bewertungen – 4.7★/216, curated quotes, link to Google reviews.
5. Galerie – optimised food and interior photos.
6. Info – hours, Google map embed, parking, accessibility, family and dog friendly.
7. Footer – Impressum and Datenschutz (legally required in Germany), plus a cookie-free map click-to-load.

**Tech:** Astro (static) + Tailwind, menu stored as JSON (easy edits), images as AVIF/WebP, hosted on Vercel or Netlify (free tier), custom domain `ristorante-verdi.com` or `.de`. Add Schema.org `Restaurant` + `Menu` structured data and keep Google Business Profile details in sync.

**Design:** Italian warmth – cream background, tomato red, basil green (fitting the name "Verdi"), serif headings, large food photography.

**Phases**
1. Owner workshop: confirm menu and prices, get photo rights, choose domain, decide on online ordering (phone vs. a tool).
2. Design (hero, menu, mobile) – 2–3 days.
3. Build + content – 3–5 days.
4. SEO and legal pages, Lighthouse score of 95+, launch, link the site from Google Maps and Facebook.
5. Later: online pre-order, Instagram feed, seasonal specials.

**Open questions for the owner:** Is the €15 family pizza still on the menu? Should online ordering be offered? Is a professional photo shoot possible? Does the ristorante-verdi.com domain already exist?
