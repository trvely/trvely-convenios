// Lógica pura de la página BCA 2027. Sin DOM ni red: corre en el navegador y en Node.

export const VALOR_PERSONA = 200000; // igual al Worker

const URL_API_STAGING = "https://trvely-actualizacion-datos-staging.trvely.workers.dev/api/bca27";
const URL_MEDIA_LOCAL = "http://localhost:8001/";
const FASES = ["antes", "abierta", "cerrada"];

// Hora del servidor = `ahora` del servidor + tiempo local transcurrido desde la carga.
// Nunca se usa el reloj absoluto del teléfono.
export function ahoraServidor(estado, cargadoEn, relojLocal) {
  return new Date(Date.parse(estado.ahora) + (relojLocal - cargadoEn));
}

export function fase(estado, cargadoEn, relojLocal) {
  if (estado.fase === "cerrada") return "cerrada";
  if (estado.fase === "abierta") return "abierta";
  const ahora = ahoraServidor(estado, cargadoEn, relojLocal);
  return ahora.getTime() >= Date.parse(estado.abre) ? "abierta" : "antes";
}

export function restante(abre, ahora) {
  const total = Math.max(0, Math.floor((Date.parse(abre) - ahora.getTime()) / 1000));
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
  };
}

// Los infantes (<2 años) no pagan.
export function valor(adultos, ninos) {
  return (adultos + ninos) * VALOR_PERSONA;
}

export function pesos(n) {
  return "$ " + new Intl.NumberFormat("es-CO").format(n);
}

export function mensajeWhatsApp({ referencia, nombre, equipo, adultos, ninos, infantes, valor: monto }) {
  let texto =
    `Hola, equipo Trvely. Soy ${nombre}, de la familia BCA (${equipo}). ` +
    `Separé ${adultos + ninos} cupo(s) para República Dominicana 2027 con la referencia ${referencia}. ` +
    `Adjunto el comprobante de ${pesos(monto)}.`;
  if (infantes > 0) texto += ` También viaja(n) ${infantes} infante(s).`;
  return texto;
}

export function enlaceWhatsApp(numero, texto) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

// Solo en localhost; en cualquier otro host no hay overrides.
export function overrides(location) {
  if (location.hostname !== "localhost") return {};
  const params = new URLSearchParams(location.search);
  const resultado = {};
  if (params.get("api") === "staging") resultado.api = URL_API_STAGING;
  if (params.get("media") === "local") resultado.media = URL_MEDIA_LOCAL;
  const f = params.get("fase");
  if (FASES.includes(f)) resultado.fase = f;
  return resultado;
}
