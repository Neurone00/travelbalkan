#!/usr/bin/env bash
# One-shot Cloudflare setup for the Balkan checklist.
# Creates the KV namespace, writes wrangler.toml, and deploys to Pages.
#
# Usage:
#   npx wrangler login          # once — opens a browser, click Allow
#   npm run setup               # (or: bash scripts/setup-cloudflare.sh)
set -euo pipefail

PROJECT="travelbalkan"
BINDING="CHECKLIST"

echo "==> Balkan Checklist — Cloudflare setup"

# 0. Must be logged in
if ! npx --yes wrangler whoami >/dev/null 2>&1; then
  echo
  echo "You're not logged in to Cloudflare yet. Run this first (a browser opens):"
  echo "    npx wrangler login"
  echo "then run this script again."
  exit 1
fi

# 1. Create (or find) the KV namespace
echo "==> Ensuring KV namespace '$BINDING' exists..."
CREATE_OUT="$(npx --yes wrangler kv namespace create "$BINDING" 2>&1 || true)"
KV_ID="$(printf '%s\n' "$CREATE_OUT" | grep -oiE '[0-9a-f]{32}' | head -n1 || true)"

if [ -z "$KV_ID" ]; then
  echo "   Namespace may already exist — looking it up..."
  LIST_OUT="$(npx --yes wrangler kv namespace list 2>/dev/null || echo '[]')"
  KV_ID="$(printf '%s' "$LIST_OUT" | node -e '
    let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
      try{const a=JSON.parse(s);const m=a.find(n=>/CHECKLIST/i.test(n.title||""));if(m)process.stdout.write(m.id);}catch(e){}
    });')"
fi

if [ -z "$KV_ID" ]; then
  echo "!! Could not determine the KV namespace id automatically."
  echo "   Run: npx wrangler kv namespace create CHECKLIST"
  echo "   then paste the id into wrangler.toml and run 'npm run deploy'."
  exit 1
fi
echo "   KV id: $KV_ID"

# 2. Write wrangler.toml (local, git-ignored — holds your KV id)
cat > wrangler.toml <<EOF
name = "$PROJECT"
compatibility_date = "2025-01-01"
pages_build_output_dir = "."

[[kv_namespaces]]
binding = "$BINDING"
id = "$KV_ID"
EOF
echo "==> Wrote wrangler.toml"

# 3. Ensure the Pages project exists (ignore error if it already does)
npx --yes wrangler pages project create "$PROJECT" --production-branch main >/dev/null 2>&1 || true

# 4. Deploy
echo "==> Deploying to Cloudflare Pages..."
npx --yes wrangler pages deploy --commit-dirty=true

echo
echo "Done. Your shared checklist should be live at:"
echo "    https://$PROJECT.pages.dev"
echo
echo "Open it, tap 'Copy link', and send it to your partner."
