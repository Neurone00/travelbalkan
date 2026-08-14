// Cloudflare Pages Function — GET/PUT at /api/state
// Stores the shared checklist state (ticks + text edits) in a KV namespace
// bound as STATE. Optional: set env var SYNC_TOKEN to require an x-sync-token
// header (the page sends it from the #key=... you share). Unset = open.

const KEY = "state";
const MAX_BYTES = 1024 * 1024; // 1 MB cap

function json(obj, status, extra) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign(
      { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
      extra || {}
    ),
  });
}

function authorized(request, env) {
  const need = env.SYNC_TOKEN;
  if (!need) return true;
  return request.headers.get("x-sync-token") === need;
}

export async function onRequestGet({ request, env }) {
  if (!env.STATE) return json({ error: "KV namespace 'STATE' is not bound" }, 500);
  if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
  const raw = await env.STATE.get(KEY);
  if (!raw) return json({ data: null, ts: 0, writer: null });
  try {
    const d = JSON.parse(raw);
    return json({ data: { ticks: d.ticks || {}, edits: d.edits || {} }, ts: d.ts || 0, writer: d.writer || null });
  } catch (e) {
    return json({ data: null, ts: 0, writer: null });
  }
}

export async function onRequestPut({ request, env }) {
  if (!env.STATE) return json({ error: "KV namespace 'STATE' is not bound" }, 500);
  if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
  let b;
  try { b = await request.json(); } catch (e) { return json({ error: "invalid JSON" }, 400); }
  if (!b || typeof b !== "object" || typeof b.ticks !== "object" || typeof b.edits !== "object") {
    return json({ error: "expected { ticks:{}, edits:{} }" }, 400);
  }
  const doc = {
    ticks: b.ticks,
    edits: b.edits,
    ts: Date.now(),
    writer: typeof b.writer === "string" ? b.writer.slice(0, 40) : null,
  };
  const serialized = JSON.stringify(doc);
  if (serialized.length > MAX_BYTES) return json({ error: "state too large" }, 413);
  await env.STATE.put(KEY, serialized);
  return json({ ok: true, ts: doc.ts, writer: doc.writer });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: { allow: "GET, PUT, OPTIONS" } });
}
