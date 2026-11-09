import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
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
  assert.match(html, /Tarifas Coopercar disponibles/);
  assert.match(html, /Tarifa publicada por persona/i);
  assert.match(html, /\$\s*4\.974\.990/);
  assert.match(html, /573233916413/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("server-renders and exports the Coral Costa Caribe 2027 product page", async () => {
  const response = await render("/coopercar/coral-costa-caribe");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Coral Costa Caribe 2027/);
  assert.match(html, /\$3\.600\.000/);
  assert.match(html, /\$3\.200\.000/);
  assert.match(html, /SOLO BAJO SOLICITUD/);
  assert.match(html, /\$200\.000 por persona/);
  assert.match(html, /21 — 25 octubre/);
  assert.match(html, /9 — 13 diciembre/);
  assert.match(html, /no se reserva automáticamente/i);
  assert.match(html, /573233916413/);
  assert.match(html, /Abrir menú de convenios hoteleros\. Hay 4 opciones disponibles/);
  assert.match(html, /Convenio Catalonia/);
  assert.match(html, /Convenio Coral Costa Caribe/);
  assert.match(html, /Convenio Cartagena Plaza/);
  assert.match(html, /Convenio Cartagena Dubái/);
  assert.match(html, /3 noches desde \$1\.499\.999/);
  assert.match(html, /Tiquetes aéreos ida y regreso desde Bogotá/);
  assert.match(html, /Traslados aeropuerto–hotel–aeropuerto/);
  assert.match(html, /Alimentación todo incluido/);
  assert.match(html, /Tour a Playa Barú/);
  assert.match(html, /precios pueden variar según las fechas seleccionadas/i);
  assert.match(html, /href="\/coopercar\/"/);

  const exported = await readFile(new URL("../dist/client/coopercar/coral-costa-caribe/index.html", import.meta.url), "utf8");
  assert.match(exported, /Coral Costa Caribe 2027/);
  assert.match(exported, /SOLO BAJO SOLICITUD/);
});

test("publishes all four departures and the payment rule", async () => {
  const html = await (await render()).text();
  assert.match(html, /Abrir menú de convenios hoteleros\. Hay 4 opciones disponibles/);
  assert.match(html, /Convenio Catalonia/);
  assert.match(html, /Convenio Coral Costa Caribe/);
  assert.match(html, /Convenio Cartagena Plaza/);
  assert.match(html, /Convenio Cartagena Dubái/);
  assert.match(html, /href="\/coopercar\/coral-costa-caribe\/"/);
  assert.match(html, /href="\/coopercar\/cartagena-plaza\/"/);
  assert.match(html, /href="\/coopercar\/cartagena-dubai\/"/);
  for (const date of ["21 — 25 octubre", "18 — 22 noviembre", "25 — 29 noviembre", "9 — 13 diciembre"]) {
    assert.match(html, new RegExp(date));
  }
  assert.match(html, /\$200\.000 por cada persona/);
  assert.match(html, /un mes antes del viaje/);
  assert.match(html, /traslado privado de llegada y salida/);
});

test("publishes the complete Cartagena Plaza product experience", async () => {
  const response = await render("/coopercar/cartagena-plaza");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Hotel Cartagena Plaza/);
  assert.match(html, /Bocagrande · frente al mar/);
  assert.match(html, /Superior Vista Ciudad/);
  assert.match(html, /Superior Vista Mar/);
  assert.match(html, /Junior Suite/);
  assert.match(html, /Piscina panorámica/);
  assert.match(html, /\$1\.499\.999/);
  assert.match(html, /Vuelos ida y regreso/);
  assert.match(html, /Tour a Playa Barú/);
  assert.match(html, /tarifa “desde”/i);
  assert.match(html, /categoría específica/i);
  assert.match(html, /573233916413/);
  assert.match(html, /galeria-hotel-cartagena-plaza-20\.webp/);
  assert.match(html, /galeria-hotel-cartagena-plaza-57\.webp/);
  assert.match(html, /habitacion-superior-vista-mar-cartagena-plaza\.webp/);
  assert.doesNotMatch(html, /galeria-hotel-cartagena-plaza-66\.webp/);

  const exported = await readFile(new URL("../dist/client/coopercar/cartagena-plaza/index.html", import.meta.url), "utf8");
  assert.match(exported, /Hotel Cartagena Plaza/);
  assert.match(exported, /Cotiza (?:<!-- -->)?Cartagena Plaza/);
});

test("publishes the complete Cartagena Dubai product experience", async () => {
  const response = await render("/coopercar/cartagena-dubai");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Hotel Cartagena Dubai/);
  assert.match(html, /30 pisos/);
  assert.match(html, /Junior Suite/);
  assert.match(html, /Master Suite/);
  assert.match(html, /\$1\.499\.999/);
  assert.match(html, /Traslados incluidos/);
  assert.match(html, /Todo incluido/);
  assert.match(html, /Playa Barú/);
  assert.match(html, /WhatsApp inicia la asesoría/i);
  assert.match(html, /No confirma cupo, tarifa, vuelo, habitación ni servicios/i);
  assert.match(html, /573233916413/);
  assert.match(html, /DUBAI-CARTAGENA-36-2304w\.jpg/);
  assert.match(html, /DUBAI-CARTAGENA-52-2304w\.jpg/);
  assert.match(html, /DUBAI-CARTAGENA-47-65661f51-2880w\.jpg/);
  assert.doesNotMatch(html, /cartagena-dubai_017\.jpg/);
  assert.doesNotMatch(html, /cartagena-dubai_019\.jpg/);

  const exported = await readFile(new URL("../dist/client/coopercar/cartagena-dubai/index.html", import.meta.url), "utf8");
  assert.match(exported, /Hotel Cartagena Dubai/);
  assert.match(exported, /Cotiza (?:<!-- -->)?Cartagena Dubai/);
});

test("protects hotel selection with age, access and room-category rules", async () => {
  const html = await (await render()).text();
  assert.match(html, /Solo huéspedes de 18 años cumplidos/);
  assert.match(html, /no incluye acceso al Royal La Romana/i);
  assert.match(html, /acceso es en un solo sentido/i);
  assert.match(html, /Swim Up quiere decir piscina privada/i);
  assert.match(html, /tarifa de menores no se calcula automáticamente/i);
  assert.match(html, /Privileged no viene en todas/i);
});

const alianzas = [
  { slug: "diana-gonzalez", name: "Diana González", firstName: "Diana", role: "Líder comercial", phone: "573192673482", display: "+57 319 267 3482" },
  { slug: "monica-gonzalez", name: "Mónica Lucía González Fonseca", firstName: "Mónica", role: "Equipo comercial Trvely", phone: "573013489910", display: "+57 301 348 9910" },
  { slug: "luz-marina-rodriguez", name: "Luz Marina Rodríguez Cuervo", firstName: "Luz Marina", role: "Equipo comercial Trvely", phone: "573165258951", display: "+57 316 525 8951" },
  { slug: "monica-gongora", name: "Mónica Góngora", firstName: "Mónica", role: "Equipo comercial Trvely", phone: "573053682283", display: "+57 305 368 2283" },
];
const otherPhones = ["573233916413", ...alianzas.map((alianza) => alianza.phone)];

for (const alianza of alianzas) {
  test(`publishes the business-agreements page for ${alianza.name}`, async () => {
    const response = await render(`/alianzas/${alianza.slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();

    assert.match(html, /Trvely Convenios · Empresas aliadas/);
    assert.match(html, /BENEFICIO EXCLUSIVO PARA EMPRESAS ALIADAS DE TRVELY/);
    assert.match(html, /Tarifas de convenio disponibles/);
    assert.match(html, /SIMULADOR DE CONVENIO/);
    assert.match(html, /Tu Caribe 2027/);
    assert.match(html, /\$\s*4\.974\.990/);
    assert.match(html, new RegExp(alianza.name));
    assert.match(html, new RegExp(alianza.role));
    assert.ok(html.includes(alianza.display), `falta el celular visible ${alianza.display}`);
    assert.ok(html.includes(`wa.me/${alianza.phone}?text=Hola%2C%20${encodeURIComponent(alianza.firstName)}`), "el WhatsApp no saluda al contacto correcto");
    assert.match(html, /convenios%20empresariales%20de%20Trvely/);
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
    assert.ok(html.includes(`https://convenios.trvely.com.co/alianzas/${alianza.slug}/`), "falta la URL canónica");

    // Sin rastro del convenio Coopercar ni de otros contactos. El único «coopercar» permitido
    // es la ruta técnica de los assets compartidos (assetPrefix /coopercar/_next).
    assert.doesNotMatch(html.replaceAll("/coopercar/_next/", ""), /coopercar|asociado\(a\)/i);
    for (const phone of otherPhones.filter((phone) => phone !== alianza.phone)) {
      assert.doesNotMatch(html, new RegExp(phone));
    }
    // Las direcciones del informe interno no se publican.
    assert.doesNotMatch(html, /Calle 4C|Carrera 70D|Calle 16 #6|Calle 35 #34|Conjunto|Soacha|Cajicá|Bonavista/);

    const exported = await readFile(new URL(`../dist/client/alianzas/${alianza.slug}/index.html`, import.meta.url), "utf8");
    assert.match(exported, new RegExp(alianza.name));
    assert.ok(exported.includes(`wa.me/${alianza.phone}`), "el HTML exportado no trae el WhatsApp del contacto");
  });
}
