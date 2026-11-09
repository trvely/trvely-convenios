import { describe, it } from "node:test";
import assert from "node:assert/strict";
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
} from "../bca/js/logica.js";

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

  it("destino con 8 fotos del hotel", () => {
    assert.equal(DATOS.destino.hotel, "Catalonia Bávaro Beach");
    assert.equal(DATOS.destino.fotos.length, 8);
    for (const u of DATOS.destino.fotos) {
      assert.match(u, /^https:\/\/media\.trvely\.com\.co\/hoteles\/punta-cana\/catalonia-bavaro-beach\/full\/catalonia-bavaro-beach_\d{3}\.jpg$/);
    }
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
