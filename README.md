# Balkan Trip Checklist 🏔️

A single-page, editable travel checklist for our Balkan trip. Open it and start
ticking — no login, no gate. With the Cloudflare backend below it becomes a
**live shared list**: a change on one phone shows up on the other within a few
seconds.

## What you can do

- **Tick items off** — the progress ring updates as you go.
- **Edit anything** — tap the title, a section name, or any item to change it.
- **Add / delete** items and whole sections.
- **🔗 Copy link** — copies the shareable URL (with the sync key, if set).
- **Export / Import** a `.json` backup.
- **Print / PDF** for a paper copy.

The status pill at the bottom right tells you the mode: **Synced** (shared via
Cloudflare) or **Saved on this device** (local-only fallback).

---

## How it's built

- `index.html` — the whole app. Works anywhere as a local-only page, and
  automatically switches to **live shared sync** when the `/api/data` endpoint
  is reachable (i.e. hosted on Cloudflare with KV).
- `functions/api/data.js` — a Cloudflare Pages Function (GET/PUT) that stores
  the checklist in a KV namespace.
- `.github/workflows/deploy.yml` — publishes the same page to GitHub Pages,
  which just **redirects to the Cloudflare URL**.

---

## Deploy the shared version on Cloudflare (one-time)

Everything is free-tier. In the [Cloudflare dashboard](https://dash.cloudflare.com):

1. **Create the KV namespace**
   - **Storage & Databases → KV → Create** a namespace called `CHECKLIST`.

2. **Create the Pages project from GitHub**
   - **Workers & Pages → Create → Pages → Connect to Git**, pick this repo.
   - Framework preset: **None**. Build command: **(empty)**.
     Build output directory: **`/`**. Save & deploy.

3. **Bind KV to the project**
   - Open the new Pages project → **Settings → Bindings → Add → KV namespace**.
   - Variable name: **`CHECKLIST`** → select the `CHECKLIST` namespace.
   - (Optional privacy) also add a **Variable** named `SYNC_TOKEN` with a secret
     word. Then only people who open the link with `#key=<that word>` can read
     or write. Leave it out to keep it fully open — fine for "just us".
   - **Redeploy** (Deployments → ⋯ → Retry deployment) so the binding takes effect.

Your live URL is `https://<project-name>.pages.dev` — by default
`https://travelbalkan.pages.dev`.

### Point the two phones at the same list

- Open the Cloudflare URL on your phone, hit **🔗 Copy link**, send it to your
  partner, they open it. Done — you're both on the same list.
- If you set a `SYNC_TOKEN`, share the link **once** as
  `https://travelbalkan.pages.dev/#key=YOURWORD`. Each phone remembers the key
  after the first visit (Copy link includes it automatically).

---

## The "better URL" redirect from GitHub Pages

The GitHub Pages copy (`https://neurone00.github.io/travelbalkan/`) automatically
**redirects to the Cloudflare URL**, so old bookmarks land on the good one with
sync. That redirect target lives at the top of `index.html`:

```js
var CF_URL = "https://travelbalkan.pages.dev";
```

If your Pages project has a different name or you add a custom domain, change
`CF_URL` to match and push.

> Enabling GitHub Pages itself is a one-time toggle: repo **Settings → Pages →
> Source → GitHub Actions**, then re-run the "Deploy to GitHub Pages" workflow.
> It's optional — you can rely on the Cloudflare URL alone.

---

## Prefer the command line?

If you'd rather not click through the dashboard:

```sh
npx wrangler kv namespace create CHECKLIST      # note the returned id
# put that id in a wrangler.toml (see Cloudflare docs), then:
npx wrangler pages deploy . --project-name travelbalkan
```

---

## A note on how sync works

Last-write-wins over a single shared document, polled every ~5s. It won't pull a
change out from under you while you're actively typing in a field. For two people
that's plenty; it isn't built for a big crowd editing the same line at once.
