# Balkan Trip Checklist 🏔️

A single-page, editable travel checklist for our Balkan trip. Open it and start
ticking — no login, no gate. Everything you type is saved privately in your own
browser.

## What you can do

- **Tick items off** — the progress ring updates as you go.
- **Edit anything** — tap the title, a section name, or any item to change the text.
- **Add / delete** items and whole sections.
- **Export / Import** a `.json` backup — the easy way to share the exact same
  list with each other (export on one phone, send the file, import on the other).
- **Print / PDF** for a paper copy.

## Where it's hosted

It's a plain static page (`index.html`), deployed to **GitHub Pages**.

### One-time setup to make it live

1. Go to the repo on GitHub → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. That's it. Every push runs the workflow in `.github/workflows/deploy.yml`
   and publishes the site. The live URL appears on the same Settings → Pages
   screen (usually `https://neurone00.github.io/travelbalkan/`).

## A note on sharing

Because it saves in your browser, each device keeps its own copy — great for
"just us", nothing to lock down. To stay perfectly in sync, use **Export** on
one phone and **Import** on the other. If you'd rather have real-time shared
sync across both phones automatically, that needs a tiny backend (e.g. a free
Cloudflare Worker + KV) — ask and it can be added.
