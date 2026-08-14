// Cloudflare Pages Function — serves GET/PUT at /api/data
// Backed by a Workers KV namespace bound as CHECKLIST.
//
// Optional privacy: set an environment variable SYNC_TOKEN in the Pages
// project. When set, only requests carrying a matching "x-sync-token"
// header are accepted (the page sends it from the #key=… you share).
// Leave SYNC_TOKEN unset to keep it open (works out of the box).

const KEY = "checklist";
const MAX_BYTES = 512 * 1024; // 512 KB safety cap

function json(obj, status, extraHeaders) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign(
      {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
      extraHeaders || {}
    ),
  });
}

function authorized(request, env) {
  const need = env.SYNC_TOKEN;
  if (!need) return true;
  return request.headers.get("x-sync-token") === need;
}

export async function onRequestGet({ request, env }) {
  if (!env.CHECKLIST) return json({ error: "KV namespace 'CHECKLIST' is not bound" }, 500);
  if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);

  const raw = await env.CHECKLIST.get(KEY);
  if (!raw) return json({ data: null, ts: 0, writer: null });
  try {
    const doc = JSON.parse(raw);
    return json({ data: doc.data || null, ts: doc.ts || 0, writer: doc.writer || null });
  } catch (e) {
    return json({ data: null, ts: 0, writer: null });
  }
}

export async function onRequestPut({ request, env }) {
  if (!env.CHECKLIST) return json({ error: "KV namespace 'CHECKLIST' is not bound" }, 500);
  if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "invalid JSON" }, 400);
  }
  if (!body || typeof body !== "object" || !body.data ||
      !Array.isArray(body.data.sections)) {
    return json({ error: "expected { data: { sections: [...] } }" }, 400);
  }

  const doc = {
    data: body.data,
    ts: Date.now(),
    writer: typeof body.writer === "string" ? body.writer.slice(0, 40) : null,
  };
  const serialized = JSON.stringify(doc);
  if (serialized.length > MAX_BYTES) return json({ error: "checklist too large" }, 413);

  await env.CHECKLIST.put(KEY, serialized);
  return json({ ok: true, ts: doc.ts, writer: doc.writer });
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: { allow: "GET, PUT, OPTIONS" },
  });
}
