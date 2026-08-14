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

## Where it's hosted

It's a plain static page (`index.html`), deployed to **GitHub Pages** by the
workflow in `.github/workflows/deploy.yml`. No server, no database.

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
