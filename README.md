# Balkan Trip Checklist 🏔️

A single-page, editable travel checklist for our Balkan trip. Open it and start
ticking — no login, no gate. Everything you type is saved privately in your own
browser (localStorage), so it's there next time you open it.

## What you can do

- **Tick items off** — the progress ring updates as you go.
- **Edit anything** — tap the title, a section name, or any item to change the text.
- **Add / delete** items and whole sections.
- **Export / Import** a `.json` backup — the easy way to copy your list to another
  phone (Export on one, send the file, Import on the other).
- **Print / PDF** for a paper copy.
- **Reset** back to the starter list.

## Who Ruled Yugoslavia (`history.html`)

A companion map for the trip: all seven ex-Yugoslav countries on one timeline
running from 200 BC to today. Drag the years and each country repaints for
whoever was ruling it — Rome, Byzantium, the Sultan, Vienna, Belgrade.

- **Tap a country** (or its code beside the timeline) to isolate it: the map
  zooms in, its own cities appear, and a dashed line points to the seat of
  power that ruled it — Buda, Istanbul, Vienna — until that seat finally comes
  home.
- **The timeline is zoomable**: seven stacked lanes, a draggable overview
  window, ±1/10/100-year steps, a year box, jump-to-next-change buttons, period
  presets, and keyboard control (← →, shift for 10, PageUp/Down for 100,
  `[` / `]` for era boundaries).
- **Striped fills** mark the centuries with two masters at once — Venetian
  coast over Hungarian interior, Habsburg Vojvodina over Ottoman Serbia.

Boundary geometry comes from Natural Earth (1:10m), simplified but kept as a
shared-arc topology so borders never gap or overlap.

## Where it's hosted

Plain static pages (`index.html`, `history.html`), deployed to **GitHub Pages**
by the workflow in `.github/workflows/deploy.yml`. No server, no database.

### One-time setup to make it live

1. Repo on GitHub → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Done. Every push republishes the site. The live URL shows on that same
   Settings → Pages screen — usually:

   **https://neurone00.github.io/travelbalkan/**

## A note on sharing

Because it saves in your browser, each device keeps its own copy — which is
exactly what "just for us, no gate" means. To get the same list onto both
phones, use **Export** on one and **Import** on the other whenever you want to
sync up.
