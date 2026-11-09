import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DATOS } from "../bca/js/datos.js";
import {
  VALOR_PERSONA,
  ahoraServidor,
  fase,
  restante,
  valor,
  pesos,
  mensajeWhatsApp,
  enlaceWhatsApp,
  overrides,
  senalLimite,
  ahorroDatos,
  cuerpoCancun,
} from "../bca/js/logica.js";

/** Forma de DATOS.cancun.despues cuando llegan las fotos del viaje (14–17 dic). Devuelve la lista de problemas. */
function problemasDespues(despues, items) {
  const p = [];
  const medio = (x, donde) => {
    if (!x || typeof x !== "object") { p.push(`${donde}: falta`); return; }
    if (typeof x.medio !== "string" || !items[x.medio]) p.push(`${donde}: medio «${x?.medio}» no está en DATOS.media.items`);
    if (typeof x.alt !== "string" || !x.alt.trim()) p.push(`${donde}: falta alt`);
  };
  if (!despues || typeof despues !== "object") return ["despues no es un objeto"];
  for (const k of ["titulo", "texto"]) if (typeof despues[k] !== "string" || !despues[k].trim()) p.push(`falta ${k}`);
  medio(despues.principal, "principal");
  if (!Array.isArray(despues.galeria) || !despues.galeria.length) p.push("galeria vacía");
  else despues.galeria.forEach((g, i) => medio(g, `galeria[${i}]`));
  return p;
}

describe("lógica", () => {
  const estadoAntes = {
    fase: "antes",
    abre: "2026-12-18T00:00:00-05:00",
    ahora: "2026-12-17T23:59:00-05:00",
  };

  it("VALOR_PERSONA coincide con el Worker", () => {
    assert.equal(VALOR_PERSONA, 200000);
  });

  it("ahoraServidor suma el tiempo local transcurrido", () => {
    const d = ahoraServidor(estadoAntes, 1000, 4000);
    assert.equal(d.toISOString(), new Date("2026-12-18T04:59:03Z").toISOString());
  });

  it("fase ignora el reloj absoluto del teléfono", () => {
    // teléfono adelantado 2 h: el tiempo transcurrido local sigue siendo 0
    const cargadoEn = Date.parse("2026-12-18T02:00:00-05:00");
    assert.equal(fase(estadoAntes, cargadoEn, cargadoEn), "antes");
    assert.equal(fase(estadoAntes, cargadoEn, cargadoEn + 61000), "abierta");
  });

  it("fase cerrada es siempre cerrada; abierta se mantiene", () => {
    assert.equal(fase({ ...estadoAntes, fase: "cerrada" }, 0, 10 * 3600000), "cerrada");
    assert.equal(fase({ ...estadoAntes, fase: "abierta" }, 0, 0), "abierta");
  });

  it("restante devuelve unidades enteras", () => {
    assert.deepEqual(
      restante("2026-12-18T00:00:00-05:00", new Date("2026-12-16T22:30:15-05:00")),
      { dias: 1, horas: 1, minutos: 29, segundos: 45 },
    );
  });

  it("restante da ceros si ya pasó", () => {
    assert.deepEqual(
      restante("2026-12-18T00:00:00-05:00", new Date("2026-12-18T00:00:01-05:00")),
      { dias: 0, horas: 0, minutos: 0, segundos: 0 },
    );
  });

  it("valor ignora infantes y pesos formatea", () => {
    assert.equal(valor(2, 1), 600000);
    assert.equal(pesos(600000), "$ 600.000");
    assert.equal(pesos(200000), "$ 200.000");
  });

  it("valor acepta texto del formulario", () => {
    assert.equal(valor("2", "1"), 600000);
  });

  it("restante da ceros con fecha inválida", () => {
    assert.deepEqual(restante("x", new Date()), { dias: 0, horas: 0, minutos: 0, segundos: 0 });
  });

  it("ahoraServidor no retrocede si el reloj va hacia atrás", () => {
    assert.equal(ahoraServidor(estadoAntes, 5000, 1000).toISOString(), new Date(estadoAntes.ahora).toISOString());
  });

  it("mensajeWhatsApp", () => {
    const base = {
      referencia: "BCA-123",
      nombre: "Ana",
      equipo: "Cheer X",
      adultos: 2,
      ninos: 1,
      infantes: 0,
      valor: 600000,
    };
    assert.equal(
      mensajeWhatsApp(base),
      "Hola, equipo Trvely. Soy Ana, de la familia BCA (Cheer X). Separé 3 cupo(s) para República Dominicana 2027 con la referencia BCA-123. Adjunto el comprobante de $ 600.000.",
    );
    assert.ok(
      mensajeWhatsApp({ ...base, infantes: 1 }).endsWith(" También viaja(n) 1 infante(s)."),
    );
  });

  it("enlaceWhatsApp codifica el texto", () => {
    assert.equal(
      enlaceWhatsApp("573223584982", "á b"),
      "https://wa.me/573223584982?text=%C3%A1%20b",
    );
  });

  it("overrides solo en localhost", () => {
    assert.deepEqual(
      overrides({ hostname: "convenios.trvely.com.co", search: "?api=staging&fase=abierta" }),
      {},
    );
    assert.deepEqual(overrides({ hostname: "localhost", search: "?fase=antes" }), { fase: "antes" });
    assert.deepEqual(overrides({ hostname: "localhost", search: "?fase=otra" }), {});
    assert.deepEqual(overrides({ hostname: "localhost", search: "?api=staging&media=local" }), {
      api: "https://trvely-actualizacion-datos-staging.trvely.workers.dev/api/bca27",
      media: "http://localhost:8001/",
    });
    assert.deepEqual(overrides({ hostname: "localhost", search: "?api=otro&media=x" }), {});
  });

  it("senalLimite usa AbortSignal.timeout si existe", () => {
    const senal = { soy: "timeout" };
    assert.equal(senalLimite(5000, { AbortSignal: { timeout: (ms) => (ms === 5000 ? senal : null) } }), senal);
  });

  it("senalLimite sin AbortSignal.timeout (iOS 15.4–15.x) usa AbortController + setTimeout", () => {
    const relojes = [];
    class Controlador { constructor() { this.signal = { aborted: false }; } abort() { this.signal.aborted = true; } }
    const g = { AbortSignal: {}, AbortController: Controlador, setTimeout: (fn, ms) => relojes.push([fn, ms]) };
    const s = senalLimite(25000, g);
    assert.equal(s.aborted, false);
    assert.equal(relojes.length, 1);
    assert.equal(relojes[0][1], 25000);
    relojes[0][0]();
    assert.equal(s.aborted, true, "al vencer el tiempo, aborta");
    assert.equal(senalLimite(1000, {}), undefined, "sin nada de eso: sin límite (no rompe)");
  });

  it("ahorroDatos: solo con navigator.connection.saveData", () => {
    assert.equal(ahorroDatos({ connection: { saveData: true } }), true);
    assert.equal(ahorroDatos({ connection: { saveData: false } }), false);
    assert.equal(ahorroDatos({}), false);
    assert.equal(ahorroDatos(undefined), false);
  });

  it("cuerpoCancun: antes del viaje, el título y el texto de «antes»", () => {
    const c = cuerpoCancun({ frase: "Trvely llevó…", antes: { titulo: "Diciembre", texto: "Muy pronto, las fotos." }, despues: null });
    assert.deepEqual(c, { titulo: "Diciembre", parrafos: ["Muy pronto, las fotos."], principal: null, galeria: [] });
  });

  it("cuerpoCancun: con «despues», la frase solo si es distinta del texto, y el principal y la galería", () => {
    const principal = { medio: "a", alt: "Llegada" };
    const galeria = [{ medio: "b", alt: "Playa" }];
    const base = { frase: "Trvely llevó a Cancún a más de 76 personas", antes: { titulo: "Diciembre", texto: "Muy pronto" } };
    assert.deepEqual(
      cuerpoCancun({ ...base, despues: { titulo: "Cancún 2026", texto: "Así fue el viaje.", principal, galeria } }),
      { titulo: "Cancún 2026", parrafos: ["Trvely llevó a Cancún a más de 76 personas", "Así fue el viaje."], principal, galeria },
    );
    assert.deepEqual(
      cuerpoCancun({ ...base, despues: { titulo: "Cancún 2026", texto: " Trvely llevó a Cancún a más de 76 personas ", principal, galeria } }).parrafos,
      ["Trvely llevó a Cancún a más de 76 personas"],
      "no se imprime dos veces",
    );
    assert.deepEqual(cuerpoCancun({ ...base, despues: { texto: "Así fue." } }), {
      titulo: "Diciembre", parrafos: ["Trvely llevó a Cancún a más de 76 personas", "Así fue."], principal: null, galeria: [],
    });
  });
});

describe("contenido", () => {
  const EQUIPOS = [
    "Stars", "Elite", "Force", "Kids", "Ladies", "Knock Out", "Power", "Storm",
    "Top X", "Legends", "Babies", "Small Diamonds", "Blaze", "Otro equipo BCA", "Familiar o acompañante",
  ];
  const todo = JSON.stringify(DATOS);

  it("apertura, api y constantes", () => {
    assert.equal(DATOS.apertura, "2026-12-18T00:00:00-05:00");
    assert.equal(DATOS.api, "https://equipo.trvely.com.co/api/bca27");
    assert.deepEqual(DATOS.whatsapp, { numero: "573223584982", nombre: "Paola, equipo Trvely" });
    assert.deepEqual(DATOS.pagos, {
      llave: "0081973919",
      banco: "Bancolombia",
      titular: "Trvely S.A.S.",
      medios: "https://trvely.com.co/medios-de-pago/",
    });
  });

  it("siete capítulos con principal y galería de 3 a 5 con alt", () => {
    assert.deepEqual(
      DATOS.capitulos.map((c) => c.id),
      ["enero", "marzo", "mayo", "junio", "agosto", "septiembre", "octubre"],
    );
    for (const c of DATOS.capitulos) {
      assert.ok(c.mes && c.titulo && c.texto, c.id);
      assert.ok(c.principal.medio && c.principal.alt.trim(), c.id);
      assert.ok(c.galeria.length >= 3 && c.galeria.length <= 5, c.id);
      for (const g of c.galeria) assert.ok(g.medio && g.alt.trim(), c.id);
    }
  });

  it("toda referencia de medio existe en DATOS.media.items", () => {
    const refs = [DATOS.portada, ...DATOS.capitulos.flatMap((c) => [c.principal, ...c.galeria])];
    for (const r of refs) assert.ok(DATOS.media.items[r.medio], r.medio);
    assert.equal(Object.keys(DATOS.media.items).length, 31);
    assert.match(DATOS.media.base, /^https:\/\/media\.trvely\.com\.co\/bca\/2026\/$/);
    for (const it of Object.values(DATOS.media.items)) assert.equal("entrada" in it, false);
  });

  it("condiciones: 15 puntos y texto corto", () => {
    assert.equal(DATOS.condiciones.completo.length, 15);
    assert.ok(DATOS.condiciones.completo[0].startsWith("Quiénes. TRVELY S.A.S., NIT 901.902.687-9, RNT 232640"));
    for (const p of DATOS.condiciones.completo) assert.doesNotMatch(p, /\*\*|\n/);
    assert.ok(
      DATOS.condiciones.corto.startsWith("Acepto las condiciones de la separación: $200.000 por persona desde los 2 años"),
    );
  });

  it("datos obligatorios presentes", () => {
    for (const s of [
      "0081973919", "573223584982", "politicas-de-privacidad-trvely", "RNT 232640",
      "901902687-9", "Ley 1336 de 2009", "más de 76 personas",
      "Gracias, BCA All Stars, por dejarnos contar su temporada",
    ]) {
      assert.ok(todo.includes(s), s);
    }
  });

  it("Cancún, producto y pasos", () => {
    assert.equal(
      DATOS.cancun.antes.texto,
      "Del 6 al 13 de diciembre Trvely viaja a Cancún con más de 76 personas del porrismo bogotano, entre ellas la familia BCA. Muy pronto, las fotos.",
    );
    assert.equal(DATOS.cancun.despues, null);
    assert.deepEqual(
      DATOS.producto.map((p) => [p.titulo, p.texto]),
      [["Tarifa", null], ["Fechas", null], ["Plan de pagos", null], ["Qué incluye el paquete", null]],
    );
    assert.equal(DATOS.pasos.length, 3);
  });

  it("destino con 8 fotos del hotel, cada una { src, alt } con un alt que la describe", () => {
    assert.equal(DATOS.destino.hotel, "Catalonia Bávaro Beach");
    assert.equal(DATOS.destino.fotos.length, 8);
    const alts = new Set();
    for (const f of DATOS.destino.fotos) {
      assert.deepEqual(Object.keys(f).sort(), ["alt", "src"]);
      assert.match(f.src, /^https:\/\/media\.trvely\.com\.co\/hoteles\/punta-cana\/catalonia-bavaro-beach\/full\/catalonia-bavaro-beach_\d{3}\.jpg$/);
      assert.ok(f.alt.trim().length >= 25, `alt corto: ${f.alt}`);
      assert.doesNotMatch(f.alt, /foto \d+ de \d+/i, "alt genérico");
      alts.add(f.alt);
    }
    assert.equal(alts.size, 8, "cada foto con su propio alt");
  });

  it("cancun.despues: null hasta el viaje; cuando llegue, { titulo, texto, principal: { medio, alt }, galeria: [{ medio, alt }] } con medios que existen", () => {
    const { despues } = DATOS.cancun;
    if (despues !== null) assert.deepEqual(problemasDespues(despues, DATOS.media.items), []);
    // El validador sí detecta los errores (así esta prueba no pasa en vacío cuando llegue el contenido).
    const [m1, m2] = Object.keys(DATOS.media.items);
    assert.deepEqual(problemasDespues({ titulo: "Cancún", texto: "Así fue", principal: { medio: m1, alt: "x" }, galeria: [{ medio: m2, alt: "y" }] }, DATOS.media.items), []);
    assert.deepEqual(problemasDespues({ titulo: "Cancún", texto: "Así fue", principal: { medio: "no-existe", alt: "x" }, galeria: [] }, DATOS.media.items),
      ["principal: medio «no-existe» no está en DATOS.media.items", "galeria vacía"]);
    assert.deepEqual(problemasDespues({ texto: "", principal: { medio: m1 }, galeria: [{ medio: m2, alt: " " }] }, DATOS.media.items),
      ["falta titulo", "falta texto", "principal: falta alt", "galeria[0]: falta alt"]);
  });

  it("faq de 5 a 7 preguntas completas", () => {
    assert.ok(DATOS.faq.length >= 5 && DATOS.faq.length <= 7);
    for (const f of DATOS.faq) assert.ok(f.pregunta.trim() && f.respuesta.trim());
  });

  it("equipos igual a la lista de la Task 4", () => {
    assert.deepEqual(DATOS.equipos, EQUIPOS);
  });

  it("sin palabras internas", () => {
    assert.doesNotMatch(
      todo,
      /\b(netas?|comisi[oó]n(es)?|utilidad|Price|econ[oó]mic[oa]|proveedor(es)?)\b/i,
    );
  });
});

describe("ajustes de contenido", () => {
  it("destino sin casino ni discoteca y texto corto sin enlace", () => {
    assert.doesNotMatch(JSON.stringify(DATOS.destino), /casino|discoteca/i);
    assert.ok(DATOS.destino.texto.startsWith("Un resort familiar grande en Punta Cana"));
    assert.doesNotMatch(DATOS.condiciones.corto, /Ver condiciones completas/);
    assert.ok(DATOS.condiciones.corto.endsWith("saldo a favor por 12 meses."));
  });
});

describe("html", () => {
  const leer = (ruta) => {
    try {
      return readFileSync(new URL(ruta, import.meta.url), "utf8");
    } catch {
      return "";
    }
  };
  const html = leer("../bca/index.html");
  const videos = (texto) => texto.match(/<video\b[^>]*>/g) || [];

  it("existen las secciones y los diálogos", () => {
    for (const id of ["portada", "temporada", "cancun", "destino", "separar", "condiciones", "visor"]) {
      assert.match(html, new RegExp(`\\sid="${id}"`), id);
    }
    assert.match(html, /<dialog\b[^>]*\bid="condiciones"/);
    assert.match(html, /<dialog\b[^>]*\bid="visor"/);
    assert.match(html, /<nav\b[^>]*class="[^"]*\bmeses\b/);
  });

  it("título y metadatos para compartir", () => {
    assert.match(html, /<title>BCA All Stars × Trvely · Rumbo a República Dominicana 2027<\/title>/);
    assert.match(html, /<meta property="og:title" content="BCA All Stars × Trvely · Rumbo a República Dominicana 2027">/);
    assert.match(html, /<meta property="og:description" content="Separa tu cupo desde el 18 de diciembre">/);
    assert.match(html, /<meta property="og:image" content="https:\/\/convenios\.trvely\.com\.co\/bca\/img\/og\.jpg">/);
  });

  it("todo <video> lleva muted y playsinline", () => {
    assert.ok(videos(html).length >= 1, "sin videos");
    for (const v of videos(html)) {
      assert.match(v, /\smuted\b/, v);
      assert.match(v, /\splaysinline\b/, v);
    }
  });

  it("fuera de #portada ningún <video> precarga", () => {
    const portada = html.match(/<section\b[^>]*\bid="portada"[\s\S]*?<\/section>/);
    assert.ok(portada, "sin #portada");
    for (const v of videos(html.replace(portada[0], ""))) assert.match(v, /\spreload="none"/, v);
  });

  it("el formulario tiene los 12 campos del cuerpo de separar y la trampa ref_x", () => {
    const form = html.match(/<form\b[\s\S]*?<\/form>/);
    assert.ok(form, "sin <form>");
    for (const n of [
      "nombre", "tipoDoc", "documento", "celular", "correo", "ciudad", "equipo",
      "adultos", "ninos", "infantes", "aceptaDatos", "aceptaCondiciones", "ref_x",
    ]) {
      assert.match(form[0], new RegExp(`\\sname="${n}"`), n);
    }
    assert.doesNotMatch(form[0], /name="website"/, "website lo llena el autocompletar: la trampa es ref_x");
  });

  it("la trampa ref_x: fuera de pantalla, aria-hidden, tabindex=-1 y autocomplete=off", () => {
    const trampa = html.match(/<div class="trampa"[^>]*>[\s\S]*?<\/div>/);
    assert.ok(trampa, "sin .trampa");
    assert.match(trampa[0], /^<div class="trampa" aria-hidden="true">/);
    const input = trampa[0].match(/<input\b[^>]*>/)[0];
    for (const a of [/\sname="ref_x"/, /\stabindex="-1"/, /\sautocomplete="off"/, /\saria-hidden="true"/]) assert.match(input, a);
    assert.match(leer("../bca/css/bca.css"), /\.trampa \{ position: absolute; left: -10000px;/);
  });

  it("pie legal en el HTML, sin depender de JavaScript (y con los textos de DATOS.legal)", () => {
    const pie = html.match(/<footer\b[\s\S]*?<\/footer>/);
    assert.ok(pie, "sin <footer>");
    const l = DATOS.legal;
    assert.ok(pie[0].includes(`<li>${l.registro}</li>`), "RNT y NIT");
    assert.ok(pie[0].includes(`<a href="${l.datos.url}" target="_blank" rel="noopener">${l.datos.texto}</a>`), "Ley 1581 con el enlace a la política");
    assert.ok(pie[0].includes(`<li>${l.escnna}</li>`), "ESCNNA");
    assert.ok(pie[0].includes(`<p class="pie-lema">${l.lema}</p>`), "lema");
    for (const s of ["RNT 232640", "NIT 901902687-9", "Ley 1581 de 2012", "Ley 679 de 2001", "Ley 1336 de 2009", "Viaja Fácil, Viaja Trvely"]) assert.ok(pie[0].includes(s), s);
    const css = leer("../bca/css/bca.css");
    assert.match(css, /\.pie-legal a \{[^}]*min-height: 2\.75rem/, "enlace del pie de 44 px o más");
  });

  it("precarga el póster de la portada (el mismo archivo que pinta app.js)", () => {
    const poster = DATOS.media.base + DATOS.media.items[DATOS.portada.medio].poster;
    assert.ok(html.includes(`<link rel="preload" as="image" href="${poster}"`), poster);
  });

  it("«Escribir por WhatsApp» de la vista cerrada lleva el mensaje para Paola", () => {
    const a = html.match(/<a\b[^>]*id="cerrada-whatsapp"[^>]*>/)[0];
    assert.ok(a.includes(`href="${enlaceWhatsApp(DATOS.whatsapp.numero, "Hola, Paola. Quiero información sobre el viaje BCA 2027.")}"`), a);
  });

  it("app.js: Turnstile, tiempo límite, validación, 503, cerrada, despertar y ahorro de datos", () => {
    const app = leer("../bca/js/app.js");
    assert.match(app, /action: "separar"/, "el widget lleva action separar (el Worker la revisa)");
    assert.match(app, /"error-callback":/, "error-callback propio");
    assert.ok(app.includes("No pudimos cargar la verificación. Recarga la página."));
    assert.ok(app.includes("marca la casilla de verificación"), "sin token: que marque la casilla");
    assert.match(app, /if \(tokenEnviado\) reiniciarTurnstile\(\)/, "solo se reinicia si se mandó un token");
    assert.match(app, /senalLimite\(/, "tiempo límite con respaldo para iOS 15");
    const marcar = app.slice(app.indexOf("function marcar("), app.indexOf("function pintarValor("));
    assert.ok(marcar.indexOf("ORDEN.includes(campo)") > 0 && marcar.indexOf("ORDEN.includes(campo)") < marcar.indexOf("$(`#error-${campo}`)"), "valida el nombre del campo antes de usarlo en un selector");
    assert.match(app, /no_configurado/);
    assert.ok(app.includes("La separación no está disponible en este momento. Escríbenos por WhatsApp."));
    assert.match(app, /\$\("#cerrada-whatsapp"\)\.href = enlaceWhatsApp\(/);
    assert.match(app, /visibilitychange[\s\S]{0,200}cargarEstado\(\)/, "al volver a la pestaña, vuelve a preguntar el estado");
    assert.match(app, /ahorroDatos\(navigator\)/, "ahorro de datos: los bucles no arrancan solos");
    assert.doesNotMatch(app, /website/);
  });

  it("la página y su código no usan palabras internas", () => {
    const codigo = html + leer("../bca/js/app.js");
    assert.ok(codigo.length > 1000);
    assert.doesNotMatch(codigo, /\b(netas?|comisi[oó]n(es)?|utilidad|Price|econ[oó]mic[oa]|proveedor(es)?)\b/i);
  });
});
