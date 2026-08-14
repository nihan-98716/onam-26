# AARPO'26 — Onam Celebration Website

A React (Vite) + Node/Express implementation of the AARPO'26 event site,
now in a bold **black / red / gold** theme: a cinematic boat loading screen,
a signature Kathakali → Theyyam hover transformation (using your uploaded
artwork), a multi-language name carousel, a curated event timeline, a
Movie Night seat-booking flow with QR e-tickets, a DJ Night ticket flow,
a Kerala Store, a horizontal-carousel gallery, a live-updates ticker, and
a Core Committee team section — all served from a small Express API.

## Structure

```
aarpo26/
  backend/     Express API — serves timeline, schedule, food, team, gallery,
               competitions, campus map and live-update data as JSON
  frontend/    React + Vite + Tailwind + Framer Motion site
```

## Run it locally

**1. Backend (port 4000)**
```bash
cd backend
npm install
npm run dev        # or: npm start
```

**2. Frontend (port 5173)**
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite is already configured to proxy `/api/*`
to the backend on port 4000 (see `frontend/vite.config.js`), so no CORS
setup is needed in dev.

If the backend isn't running, every section still renders — each fetch has
a safe fallback — so you can preview the frontend on its own.

## Production build

```bash
cd frontend
npm run build       # outputs to frontend/dist — deploy as static files
cd ../backend
npm start            # deploy behind a process manager (pm2) or as a container
```

Point your static host / reverse proxy so `/api` reaches the backend, or set
`VITE_API_BASE` and rewrite `useApi.js` if you deploy them on separate domains.

## Deploying without your own server

- **Replit**: create a Node repl, drop `backend/` in as-is (`npm start`),
  and a static/React repl for `frontend/` (`npm run build && npm run preview`).
  Replit's built-in URL-per-repl works well since frontend and backend can
  run as two repls, or combine them behind a single Express server that
  also serves `frontend/dist` as static files.
- **Vercel/Netlify** (frontend) + **Render/Railway** (backend): build the
  frontend as a static site, deploy backend as a Node web service, and set
  the frontend's API base to the backend's public URL.

## What's implemented

- **Loading screen**: Chundan Vallam boat gliding over a dark gold/red
  ambient glow, with birds, ripples, and a percentage counter.
- **Hero**: full-viewport, black background, floating petals, a
  multi-language carousel cycling "AARPO'26" through English, Malayalam,
  Hindi, Tamil, Telugu and Kannada scripts, a countdown timer, and the
  large, centered **Kathakali → Theyyam hover transformation** (your
  uploaded artwork) with a gold particle burst — the site's signature
  interaction.
- **About**: alternating-layout section on Aarpo, Onam, Mahabali and unity.
- **Events**: a curated vertical timeline — Onam Teaser, Eco-Friendly
  Pookalam, Chendamelam & Maveli Procession, Cultural Performances/Games/
  Sadya, DJ Night, and Movie Night.
- **Registration**:
  - *Movie Night* — pick one of 3 show dates, select seats on an
    Amritamayi-Hall-style seat map (300 sellable seats, ₹70 near the
    screen / ₹100 further back), enter details, "pay", and receive a
    scannable **QR e-ticket**. Seat availability and double-booking
    protection are enforced server-side.
  - *DJ Night* — general admission, quantity selector, "pay", QR e-ticket.
- **Kerala Store**: Jasmine Flower Roll (Mullappoo, ₹50) and Mehendi
  Cones (₹30), with a small cart and order confirmation.
- **Gallery**: smooth horizontal carousel (auto-advancing, swipeable,
  with prev/next and dot controls) instead of a static grid.
- **Live Updates**: scrolling announcement ticker, unchanged.
- **Team**: Core Committee only, grouped by department, with elegant
  initials-avatar placeholders.
- **Contact**: campus address updated, Instagram only (LinkedIn/YouTube
  removed).
- Custom lotus cursor (desktop only), ripple buttons, floating petals,
  and card-lift micro-interactions throughout, all in the black/red/gold
  palette with a bold Cinzel display font.
- Respects `prefers-reduced-motion` and degrades to a normal cursor and
  simpler layout on mobile/touch devices.

## Notes on content

- Gallery photos are tone-based generated placeholders (no stock images
  bundled) — swap `frontend/src/components/Gallery.jsx` and
  `backend/data/gallery.json` for real event photography once you have it.
- The DJ Night ticket price (₹150) is a **placeholder** — you didn't
  specify one, so update `DJ_INFO.price` in `backend/server.js` to the
  confirmed price.
- The movie seat map (300 seats, rows A–J, ₹70/₹100 split) is modeled on
  your uploaded Amritamayi Hall layout but is a simplified version of it
  for a clean UI — adjust `ROW_LAYOUT` in `backend/server.js` if the real
  seat counts differ.
- Bookings and orders are stored **in memory** on the Express server —
  they reset on server restart. Swap in a real database (Postgres,
  MongoDB, etc.) before going live for real ticket sales.
- Team data (Core Committee) reflects exactly the names/roles you gave;
  no contact details were invented since none were provided.
