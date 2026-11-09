import { describe, it } from "node:test";
import assert from "node:assert/strict";
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
