import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Coopercar Caribe 2027 landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Trvely Convenios · Coopercar/);
  assert.match(html, /Tu Caribe 2027/);
  assert.match(html, /Proyecta tus cuotas/);
  assert.match(html, /Catalonia Royal Bávaro/);
  assert.match(html, /Tarifas en validación/);
  assert.match(html, /573233916413/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("publishes all four departures and the payment rule", async () => {
  const html = await (await render()).text();
  for (const date of ["21 — 25 octubre", "18 — 22 noviembre", "25 — 29 noviembre", "9 — 13 diciembre"]) {
    assert.match(html, new RegExp(date));
  }
  assert.match(html, /\$200\.000 por cada persona/);
  assert.match(html, /un mes antes del viaje/);
});
