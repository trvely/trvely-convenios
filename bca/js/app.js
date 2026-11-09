// Página BCA 2027: pinta DATOS, maneja la cuenta regresiva, los videos, el visor y el formulario de separación.
// Toda regla de negocio vive en logica.js (y la última palabra la tiene el servidor). Nunca se usa innerHTML con datos.

import { DATOS } from "./datos.js";
import {
  VALOR_PERSONA, ahoraServidor, fase, restante, valor, pesos, mensajeWhatsApp, enlaceWhatsApp, overrides,
} from "./logica.js";

const ov = overrides(window.location);
const API = ov.api || DATOS.api;
const BASE = ov.media || DATOS.media.base;
const MEDIA = DATOS.media.items;
const CLAVE = "bca27-ultima";
const MAX_PERSONAS = 20; // igual al Worker (reglas.js)
const TURNSTILE_JS = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=bca27Turnstile";
const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const url = (archivo) => BASE + archivo;
const limite = (ms) => (typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined);
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

/** Crea un elemento. Los textos van siempre por textContent. */
function el(tag, props = {}, ...hijos) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") n.className = v;
    else if (k === "text") n.textContent = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? "" : String(v));
  }
  n.append(...hijos.flat().filter((h) => h !== null && h !== undefined && h !== false));
  return n;
}

/* ---------------- Medios: videos en bucle, miniaturas y visor ---------------- */
const enVista = new Set();
const visor = $("#visor");

function reproducir(v) {
  if (quieto.matches || visor.open || document.hidden) return;
  if (!v.getAttribute("src")) v.src = v.dataset.src;
  v.play().catch(() => {});
}
const obsVideos = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    if (e.isIntersecting) { enVista.add(e.target); reproducir(e.target); }
    else { enVista.delete(e.target); e.target.pause(); }
  }
}, { threshold: 0.35 });
// Pósteres e imágenes se piden solo cuando se acercan a la pantalla: `loading="lazy"` en Chrome todavía
// descarga lo que esté a menos de ~1250 px, y eso solo ya rompía el presupuesto de 2,5 MB de la carga inicial.
const obsDiferido = new IntersectionObserver((entradas) => {
  for (const { isIntersecting, target: n } of entradas) {
    if (!isIntersecting) continue;
    if (n.tagName === "VIDEO") n.poster = n.dataset.poster;
    else {
      if (n.dataset.srcset) n.srcset = n.dataset.srcset;
      n.src = n.dataset.src;
    }
    obsDiferido.unobserve(n);
  }
}, { rootMargin: "400px 0px" });
/** <img loading="lazy"> cuya URL se pone al acercarse (src y srcset van en data-*). */
function imgDiferida({ src, srcset, ...props }) {
  const img = el("img", { ...props, loading: "lazy", decoding: "async", "data-src": src, "data-srcset": srcset });
  obsDiferido.observe(img);
  return img;
}

const pausarTodo = () => $$("video.bucle").forEach((v) => v.pause());
const reanudar = () => enVista.forEach(reproducir);
document.addEventListener("visibilitychange", () => (document.hidden ? pausarTodo() : reanudar()));
quieto.addEventListener?.("change", () => (quieto.matches ? pausarTodo() : reanudar()));

function videoBucle(m, video = el("video", { class: "bucle", muted: true, playsinline: true, loop: true, preload: "none", "aria-hidden": "true" }), diferido = true) {
  video.muted = true;
  video.dataset.src = url(m.loop);
  if (diferido) { video.dataset.poster = url(m.poster); obsDiferido.observe(video); } else video.poster = url(m.poster);
  obsVideos.observe(video);
  return video;
}

const ancho = (m, lado) => Math.round(m.w * Math.min(1, lado / Math.max(m.w, m.h)));
const alto = (m, lado) => Math.round(m.h * Math.min(1, lado / Math.max(m.w, m.h)));
const imgMini = (m, alt) => imgDiferida({ src: url(m.mini), alt, width: ancho(m, 600), height: alto(m, 600) });

/** Pieza principal de un capítulo: video en bucle (si tiene `loop`) o foto; al tocarla se abre el visor. */
function principal(p) {
  const m = MEDIA[p.medio];
  if (!m) return null;
  const esVideo = m.tipo === "video";
  let contenido;
  if (esVideo && m.loop) contenido = videoBucle(m);
  else if (esVideo) contenido = imgMini(m, p.alt);
  else {
    contenido = imgDiferida({
      src: url(m.mini), srcset: `${url(m.mini)} ${ancho(m, 600)}w, ${url(m.src)} ${m.w}w`,
      sizes: "(min-width: 900px) 440px, 100vw", alt: p.alt, width: m.w, height: m.h,
    });
  }
  return el("button", {
    type: "button", class: esVideo ? "principal" : "principal foto", style: `--ar: ${m.w} / ${m.h}`,
    "aria-label": `${esVideo ? "Ver video completo" : "Ampliar foto"}: ${p.alt}`, onclick: () => abrirVisor(m, p.alt),
  }, el("span", { class: "marco" }, contenido),
  esVideo ? el("span", { class: "chip" }, el("span", { class: "chip-icono", "aria-hidden": "true" }), "Ver completo") : null);
}

/** Tira de miniaturas. items: [{ m, alt, foto? }] (foto = URL grande para el visor, solo fotos del hotel). */
function galeria(items, etiqueta) {
  return el("ul", { class: "galeria", "aria-label": etiqueta }, items.map(({ m, alt, mini, foto }) => {
    const esVideo = m.tipo === "video";
    const img = mini
      ? imgDiferida({ src: mini, alt, width: 700, height: 700 })
      : imgMini(m, alt);
    if (mini) img.addEventListener("error", () => { if (img.src !== foto) img.src = foto; }, { once: true });
    return el("li", { style: `--ar: ${m.w} / ${m.h}` },
      el("button", { type: "button", class: "miniatura", onclick: () => abrirVisor(m, alt, foto) },
        el("span", { class: "oculto", text: esVideo ? "Ver video: " : "Ampliar foto: " }),
        img,
        esVideo ? el("span", { class: "play", "aria-hidden": "true" }) : null));
  }));
}
const deDatos = (lista) => lista.filter((g) => MEDIA[g.medio]).map((g) => ({ m: MEDIA[g.medio], alt: g.alt }));

const vImg = $("#visor-img");
const vVideo = $("#visor-video");
const vMarco = $("#visor-marco");
let abridor = null;

function abrirVisor(m, alt, foto) {
  abridor = document.activeElement;
  pausarTodo();
  const esVideo = m.tipo === "video";
  vImg.hidden = esVideo;
  vMarco.hidden = !esVideo;
  $("#visor-texto").textContent = alt;
  if (esVideo) {
    vMarco.classList.toggle("horizontal", m.w > m.h);
    vVideo.poster = url(m.poster);
    vVideo.src = url(m.completo);
    vVideo.setAttribute("aria-label", alt);
    vVideo.muted = false; // se abrió con un toque: el video completo va con sonido
  } else {
    vImg.src = foto || url(m.src);
    vImg.alt = alt;
  }
  visor.showModal();
  if (esVideo) vVideo.play().catch(() => {});
}
visor.addEventListener("close", () => {
  vVideo.pause();
  vVideo.removeAttribute("src");
  vVideo.load();
  vImg.removeAttribute("src");
  reanudar();
  abridor?.focus?.();
});
// Diálogos: cierre con Escape (nativo), con el botón y tocando el fondo.
for (const d of $$("dialog")) {
  d.addEventListener("click", (e) => {
    if (e.target === d || e.target.classList.contains("visor-figura") || e.target.closest("[data-cerrar]")) d.close();
  });
}

/* ---------------- Contenido ---------------- */
const CIFRA = /(\d+(?:\s(?:oros?|platas?|bronces?))?|\bplata\b|Hit Zero)/;

function lineasConCifras(texto) {
  return texto.split("\n").map((linea) => el("p", {}, linea.split(CIFRA).map((parte, i) => (i % 2 ? el("strong", { class: "cifra", text: parte }) : parte))));
}

function pintarContenido() {
  const portada = MEDIA[DATOS.portada.medio];
  const [uno, ...resto] = DATOS.portada.titulo.split(" · ");
  if (resto.length) { $(".titulo-uno").textContent = uno; $(".titulo-dos").textContent = resto.join(" · "); }
  $("#portada-boton").textContent = DATOS.portada.boton;
  if (portada) {
    videoBucle(portada, $("#portada-video"), false);
    const boton = $("#portada-medio");
    boton.setAttribute("aria-label", `Ver video completo: ${DATOS.portada.alt}`);
    boton.addEventListener("click", () => abrirVisor(portada, DATOS.portada.alt));
  }

  // Temporada
  const lista = $("#meses-lista");
  const capitulos = $("#capitulos");
  for (const c of DATOS.capitulos) {
    lista.append(el("li", {}, el("a", { href: `#${c.id}`, text: c.mes })));
    capitulos.append(el("article", { class: "capitulo", id: c.id, "aria-labelledby": `t-${c.id}` },
      el("div", { class: "capitulo-texto" },
        el("h3", { id: `t-${c.id}` }, el("span", { class: "mes", text: c.mes }), el("span", { class: "oculto", text: ": " }), c.titulo),
        lineasConCifras(c.texto)),
      principal(c.principal),
      galeria(deDatos(c.galeria), `Más fotos y videos de ${c.mes.toLowerCase()}`)));
  }

  // Cancún: «antes» mientras no hay fotos del viaje; con `despues`, la frase y lo que traiga.
  const { frase, antes, despues } = DATOS.cancun;
  $("#cancun-titulo").textContent = despues?.titulo || antes.titulo;
  $("#cancun-cuerpo").append(...[
    el("p", { text: despues ? frase : antes.texto }),
    despues?.texto ? el("p", { text: despues.texto }) : null,
    despues?.galeria?.length ? galeria(deDatos(despues.galeria), "Fotos del viaje a Cancún") : null,
  ].filter(Boolean));

  // Destino
  const d = DATOS.destino;
  $("#destino-titulo").textContent = d.hotel;
  const fotosHotel = d.fotos.map((foto, i) => ({
    m: { tipo: "foto", w: 1, h: 1 }, foto, mini: foto.replace("/full/", "/thumb/"),
    alt: `Hotel ${d.hotel}, en Punta Cana: foto ${i + 1} de ${d.fotos.length}`,
  }));
  $("#destino-cuerpo").append(
    el("p", { class: "lugar", text: d.lugar }),
    el("figure", { class: "destino-hero" }, imgDiferida({ src: d.hero, alt: `Vista del hotel ${d.hotel}, en Punta Cana`, width: 1600, height: 1000 })),
    el("p", { class: "destino-texto", text: d.texto }),
    galeria(fotosHotel, `Fotos del hotel ${d.hotel}`),
    el("h3", { text: "En el hotel" }),
    el("ul", { class: "hotel-lista" }, d.incluye.map((x) => el("li", { text: x }))),
    el("div", { class: "producto" },
      el("h3", { text: "Tu paquete 2027" }),
      el("p", { class: "producto-intro", text: "Lo publicamos aquí apenas esté definido." }),
      el("dl", {}, DATOS.producto.map((p) => el("div", {}, el("dt", { text: p.titulo }),
        el("dd", { class: p.texto ? null : "pendiente", text: p.texto || "Próximamente" }))))),
  );

  // Separar, condiciones, preguntas y pie
  $("#pasos").append(...DATOS.pasos.map((p) => el("li", {}, el("h3", { text: p.titulo }), el("p", { text: p.texto }))));
  $("#f-equipo").append(...DATOS.equipos.map((e) => el("option", { value: e, text: e })));
  $("#texto-condiciones").textContent = DATOS.condiciones.corto;
  $("#condiciones-lista").append(...DATOS.condiciones.completo.map((punto) => {
    const corte = punto.indexOf(". ");
    return corte < 0 ? el("li", { text: punto }) : el("li", {}, el("strong", { text: punto.slice(0, corte + 2) }), punto.slice(corte + 2));
  }));
  $("#faq").append(...DATOS.faq.map((f) => el("details", {}, el("summary", { text: f.pregunta }), el("p", { text: f.respuesta }))));
  const pagos = DATOS.pagos;
  $("#r-llave").textContent = pagos.llave;
  $("#r-banco").textContent = `${pagos.banco}, a nombre de ${pagos.titular}`;
  $("#r-medios").href = pagos.medios;
  $("#cerrada-whatsapp").href = `https://wa.me/${DATOS.whatsapp.numero}`;
  const l = DATOS.legal;
  $("#pie-gracias").textContent = l.gracias;
  $("#pie-creditos").textContent = l.creditos;
  $("#pie-lema").textContent = l.lema;
  $("#pie-legal").append(
    el("li", { text: l.registro }),
    el("li", {}, el("a", { href: l.datos.url, target: "_blank", rel: "noopener", text: l.datos.texto })),
    el("li", { text: l.escnna }),
  );
}

/* ---------------- Navegación de meses y el gesto de Cancún ---------------- */
function activarMeses() {
  const enlaces = new Map($$("#meses-lista a").map((a) => [a.hash.slice(1), a]));
  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      enlaces.forEach((a) => a.removeAttribute("aria-current"));
      const a = enlaces.get(e.target.id);
      if (!a) continue;
      a.setAttribute("aria-current", "true");
      const ol = a.closest("ol");
      ol.scrollTo({ left: a.offsetLeft - ol.clientWidth / 2 + a.clientWidth / 2, behavior: quieto.matches ? "auto" : "smooth" });
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  $$(".capitulo").forEach((c) => obs.observe(c));
}

function activarCancun() {
  const s = $("#cancun");
  const desde = [25, 26, 30];
  const hasta = [244, 229, 210];
  let pendiente = false;
  const pintar = () => {
    pendiente = false;
    const r = s.getBoundingClientRect();
    const vh = window.innerHeight;
    const x = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / Math.max(1, vh * 0.5 + r.height - vh)));
    // Curva suave: el tramo de tonos medios (contraste más bajo con cualquier texto) pasa rápido.
    const p = x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;
    s.style.backgroundColor = `rgb(${desde.map((a, i) => Math.round(a + (hasta[i] - a) * p)).join(",")})`;
    s.classList.toggle("claro", p >= 0.47); // punto donde el texto claro y la tinta tienen el mismo contraste
  };
  const pedir = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); } };
  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", pedir);
  pintar();
}

/* ---------------- Estado de la separación (el servidor manda) ---------------- */
let estado = null;
let cargadoEn = 0;
let sinRed = false;
let faseForzada = null; // tras un 409, hasta el siguiente estado
let sitekey = "";
let faseVista = null;
let resultado = null;
let ultimaVoz = "";

async function cargarEstado() {
  try {
    const r = await fetch(`${API}/estado`, { cache: "no-store", signal: limite(10000) });
    if (!r.ok) throw new Error(`estado ${r.status}`);
    const j = await r.json();
    if (!j || !["antes", "abierta", "cerrada"].includes(j.fase) || Number.isNaN(Date.parse(j.ahora)) || Number.isNaN(Date.parse(j.abre))) {
      throw new Error("estado inválido");
    }
    estado = j;
    cargadoEn = performance.now();
    sinRed = false;
    faseForzada = null;
    sitekey = typeof j.turnstile === "string" ? j.turnstile.trim() : "";
  } catch {
    if (!estado) sinRed = true; // si ya teníamos un estado, se conserva
  }
  tic();
}

function faseActual() {
  if (ov.fase) return ov.fase;
  if (faseForzada) return faseForzada;
  if (estado) return fase(estado, cargadoEn, performance.now());
  if (!sinRed) return "cargando";
  return Date.now() < Date.parse(DATOS.apertura) ? "antes" : "sinconexion";
}

function tic() {
  const ahora = estado ? ahoraServidor(estado, cargadoEn, performance.now()) : new Date();
  const abre = ov.fase === "antes" || !estado ? DATOS.apertura : estado.abre;
  const r = restante(abre, ahora);
  for (const b of $$("[data-u]")) b.textContent = String(r[b.dataset.u]).padStart(2, "0");
  const voz = `Faltan ${plural(r.dias, "día", "días")} y ${plural(r.horas, "hora", "horas")} para abrir la separación.`;
  if (voz !== ultimaVoz) { ultimaVoz = voz; $("#cuenta-voz").textContent = voz; }
  $("#aviso-conexion").hidden = !sinRed;
  const f = faseActual();
  if (f !== faseVista) {
    const antes = faseVista;
    faseVista = f;
    if (antes === "antes" && f === "abierta") {
      $("#anuncio").textContent = "La separación ya está abierta. El formulario está listo.";
      if (!ov.fase && estado?.fase === "antes") cargarEstado(); // la apertura la confirma el servidor
    }
    pintarFase();
  }
}

function pintarFase() {
  const f = faseVista;
  for (const n of $$(".portada-estado [data-vista]")) n.hidden = n.dataset.vista !== f;
  $("#portada-boton").textContent = f === "cerrada" ? "Ver detalles" : DATOS.portada.boton;
  const vista = resultado ? "resultado" : f;
  for (const n of $$("#zona > [data-vista]")) n.hidden = n.dataset.vista !== vista;
  if (vista === "abierta" && separarCerca) cargarTurnstile();
}

/* ---------------- Turnstile (se carga cuando la separación se acerca a la pantalla) ---------------- */
let separarCerca = false;
let tsWidget = null;
let tsPromesa = null;
let tsFallo = false;

function cargarTurnstile() {
  if (!sitekey || tsPromesa) return tsPromesa;
  tsFallo = false;
  tsPromesa = new Promise((ok, mal) => {
    window.bca27Turnstile = ok;
    const s = el("script", { src: TURNSTILE_JS, async: true });
    s.addEventListener("error", () => { s.remove(); mal(new Error("turnstile")); });
    document.head.append(s);
  }).then(() => {
    tsWidget = window.turnstile.render("#turnstile", {
      sitekey, language: "es", theme: "light", action: "separar",
      "expired-callback": () => reiniciarTurnstile(),
    });
  }).catch(() => {
    tsFallo = true;
    tsPromesa = null;
  });
  return tsPromesa;
}
function reiniciarTurnstile() {
  try { if (tsWidget !== null) window.turnstile.reset(tsWidget); } catch { /* sin widget */ }
}
async function esperarToken(ms = 12000) {
  await cargarTurnstile();
  const fin = performance.now() + ms;
  while (performance.now() < fin) {
    const t = tsWidget !== null ? window.turnstile.getResponse(tsWidget) : "";
    if (t) return t;
    if (tsFallo) return "";
    await new Promise((r) => setTimeout(r, 250));
  }
  return "";
}

/* ---------------- Formulario ---------------- */
const form = $("#formulario");
const botonEnviar = $("#enviar");
const GRUPO = ["adultos", "ninos", "infantes"];
const ORDEN = ["nombre", "tipoDoc", "documento", "celular", "correo", "ciudad", "equipo", ...GRUPO, "personas", "aceptaDatos", "aceptaCondiciones"];
const MENSAJES = {
  nombre: "Escribe tu nombre completo.",
  tipoDoc: "Elige el tipo de documento.",
  documento: "Escribe el número de documento (entre 4 y 20 letras o números).",
  celular: "Escribe un celular colombiano de 10 dígitos, o un número con + y el indicativo del país.",
  correo: "Escribe un correo válido, por ejemplo nombre@correo.com.",
  ciudad: "Escribe tu ciudad.",
  equipo: "Elige el equipo BCA del deportista.",
  adultos: "Debe viajar al menos 1 adulto.",
  ninos: "Escribe un número entero: 0 o más.",
  infantes: "Escribe un número entero: 0 o más.",
  personas: `Máximo ${MAX_PERSONAS} personas por separación. Para un grupo más grande, escríbele a Paola por WhatsApp.`,
  aceptaDatos: "Para separar necesitamos tu autorización para tratar tus datos.",
  aceptaCondiciones: "Para separar debes aceptar las condiciones.",
};
const MSG = {
  revisa: "Revisa los campos marcados.",
  red: "No pudimos confirmar tu separación. Revisa tu conexión y vuelve a intentarlo: si ya quedó guardada, te mostraremos la misma referencia.",
  servidor: "No pudimos confirmar tu separación. Vuelve a intentarlo en un momento: si ya quedó guardada, te mostraremos la misma referencia.",
  verificacion: "No pudimos comprobar que no eres un robot. Espera unos segundos y vuelve a tocar «Separar mi cupo».",
  sinTurnstile: "No pudimos cargar la verificación de seguridad. Revisa tu conexión y vuelve a intentarlo.",
  origen: "No pudimos recibir tu separación desde esta página. Escríbele a Paola por WhatsApp.",
  procesar: "No pudimos procesar el envío. Revisa los campos y vuelve a intentarlo.",
  limite: "Recibimos varios envíos seguidos desde tu conexión. Espera un minuto y vuelve a intentarlo.",
};

const entero = (s) => (/^\d+$/.test(String(s ?? "").trim()) ? Number(String(s).trim()) : null);

function leerFormulario() {
  const f = form.elements;
  return {
    nombre: f.nombre.value.trim(), tipoDoc: f.tipoDoc.value, documento: f.documento.value.trim(),
    celular: f.celular.value.trim(), correo: f.correo.value.trim(), ciudad: f.ciudad.value.trim(), equipo: f.equipo.value,
    adultos: entero(f.adultos.value), ninos: entero(f.ninos.value), infantes: entero(f.infantes.value),
    aceptaDatos: f.aceptaDatos.checked, aceptaCondiciones: f.aceptaCondiciones.checked,
  };
}

// Las mismas reglas de validarSeparacion (Worker); el servidor vuelve a validar todo.
function celularValido(s) {
  if (/[^\d\s().+-]/.test(s)) return false;
  const d = s.replace(/\D/g, "");
  return /^3\d{9}$/.test(d) || /^573\d{9}$/.test(d) || (s.startsWith("+") && d.length >= 8 && d.length <= 15);
}
function validar(d) {
  const e = [];
  const documento = d.documento.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (d.nombre.replace(/\s+/g, " ").length < 3) e.push("nombre");
  if (!["CC", "CE", "PA", "TI"].includes(d.tipoDoc)) e.push("tipoDoc");
  if (documento.length < 4 || documento.length > 20) e.push("documento");
  if (!celularValido(d.celular)) e.push("celular");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo)) e.push("correo");
  if (d.ciudad.length < 2) e.push("ciudad");
  if (!DATOS.equipos.includes(d.equipo)) e.push("equipo");
  if (d.adultos === null || d.adultos < 1) e.push("adultos");
  if (d.ninos === null) e.push("ninos");
  if (d.infantes === null) e.push("infantes");
  if (!e.some((x) => GRUPO.includes(x)) && d.adultos + d.ninos + d.infantes > MAX_PERSONAS) e.push("personas");
  if (!d.aceptaDatos) e.push("aceptaDatos");
  if (!d.aceptaCondiciones) e.push("aceptaCondiciones");
  return e;
}

const estadoForm = (texto) => { $("#form-estado").textContent = texto; };
const controles = (campo) => (campo === "personas" ? GRUPO : [campo]).map((n) => form.elements[n]).filter(Boolean);

function limpiarError(campo) {
  const p = $(`#error-${campo}`);
  if (p) { p.hidden = true; p.textContent = ""; }
  for (const c of controles(campo)) c.removeAttribute("aria-invalid");
}
function limpiarErrores() { ORDEN.forEach(limpiarError); estadoForm(""); }

/** Marca los campos con error. `campos` llega como lista de nombres (el Worker) o como objeto { campo: mensaje }. */
function marcar(campos, enfocar = true) {
  const pares = Array.isArray(campos)
    ? campos.map((c) => [c, MENSAJES[c]])
    : Object.entries(campos && typeof campos === "object" ? campos : {}).map(([c, m]) => [c, typeof m === "string" && m.trim() ? m : MENSAJES[c]]);
  const marcados = [];
  for (const [campo, mensaje] of pares) {
    const p = $(`#error-${campo}`);
    if (!p || !ORDEN.includes(campo)) continue;
    p.textContent = mensaje || MSG.revisa;
    p.hidden = false;
    for (const c of controles(campo)) c.setAttribute("aria-invalid", "true");
    marcados.push(campo);
  }
  if (!enfocar) return;
  marcados.sort((a, b) => ORDEN.indexOf(a) - ORDEN.indexOf(b));
  controles(marcados[0] || "")[0]?.focus();
  estadoForm(MSG.revisa);
}

function pintarValor() {
  const [a, n, i] = GRUPO.map((c) => entero(form.elements[c].value) ?? 0);
  $("#valor-total").textContent = pesos(valor(a, n));
  const pagan = `${plural(a + n, "persona", "personas")} × ${pesos(VALOR_PERSONA)}.`;
  $("#valor-detalle").textContent = i ? `${pagan} ${i === 1 ? "1 infante no paga." : `${i} infantes no pagan.`}` : pagan;
  if (a + n + i > MAX_PERSONAS) marcar(["personas"], false);
  else if (!$("#error-personas").hidden) limpiarError("personas");
}

form.addEventListener("click", (e) => {
  const b = e.target.closest("[data-paso]");
  if (!b) return;
  const input = form.elements[b.dataset.campo];
  const min = Number(input.min) || 0;
  input.value = Math.max(min, Math.min(MAX_PERSONAS, (entero(input.value) ?? min) + Number(b.dataset.paso)));
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
form.addEventListener("input", (e) => {
  const campo = e.target.name;
  if (GRUPO.includes(campo)) { limpiarError(campo); pintarValor(); } else if (campo) limpiarError(campo);
});
form.addEventListener("change", (e) => { if (e.target.type === "checkbox" || e.target.tagName === "SELECT") limpiarError(e.target.name); });
form.addEventListener("focusin", () => { if (faseVista === "abierta") cargarTurnstile(); });

let enviando = false;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (enviando) return;
  limpiarErrores();
  const datos = leerFormulario();
  const errores = validar(datos);
  if (errores.length) { marcar(errores); return; }
  enviando = true;
  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando…";
  estadoForm("");
  let r = null;
  let j = null;
  try {
    const turnstile = sitekey ? await esperarToken() : "";
    if (sitekey && !turnstile) { estadoForm(tsFallo ? MSG.sinTurnstile : MSG.verificacion); return; }
    try {
      r = await fetch(`${API}/separar`, {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: limite(25000),
        body: JSON.stringify({ ...datos, website: form.elements.website.value, turnstile }),
      });
    } catch {
      estadoForm(MSG.red);
      return;
    }
    j = await r.json().catch(() => null);
    responder(r, j, datos);
  } finally {
    reiniciarTurnstile(); // un token no se reutiliza: cada intento lleva uno nuevo
    enviando = false;
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Separar mi cupo";
  }
});

function responder(r, j, datos) {
  if (r.ok && j?.ok === true && typeof j.referencia === "string") {
    mostrarResultado({ referencia: j.referencia, valor: j.valor, personas: j.personas, duplicada: j.duplicada === true, nombre: datos.nombre, equipo: datos.equipo }, true);
    return;
  }
  if (r.ok && j?.ok === false) { estadoForm(j.mensaje || MSG.procesar); return; }
  switch (r.status) {
    case 422: marcar(j?.campos); return;
    case 409:
      faseForzada = j?.error === "antes" ? "antes" : "cerrada";
      tic();
      cargarEstado();
      return;
    case 429: estadoForm(j?.mensaje || MSG.limite); return;
    case 403: estadoForm(j?.error === "verificacion" ? MSG.verificacion : MSG.origen); return;
    case 400:
    case 413: estadoForm(MSG.procesar); return;
    default: estadoForm(MSG.servidor);
  }
}

/* ---------------- Resultado (siempre con lo que respondió el servidor) ---------------- */
const guardar = (v) => { try { sessionStorage.setItem(CLAVE, JSON.stringify(v)); } catch { /* modo privado */ } };
const borrar = () => { try { sessionStorage.removeItem(CLAVE); } catch { /* modo privado */ } };
function leerGuardado() {
  try { return normalizar(JSON.parse(sessionStorage.getItem(CLAVE))); } catch { return null; }
}
function normalizar(v) {
  if (!v || typeof v !== "object" || !/^BCA27-\d{4,}$/.test(String(v.referencia))) return null;
  const p = v.personas && typeof v.personas === "object" ? v.personas : {};
  const n = (x) => (Number.isInteger(Number(x)) && Number(x) >= 0 ? Number(x) : 0);
  const personas = { adultos: n(p.adultos), ninos: n(p.ninos), infantes: n(p.infantes) };
  const monto = Number.isFinite(Number(v.valor)) ? Number(v.valor) : valor(personas.adultos, personas.ninos);
  return { referencia: String(v.referencia), valor: monto, personas, duplicada: v.duplicada === true, nombre: String(v.nombre || "").slice(0, 120), equipo: String(v.equipo || "").slice(0, 60) };
}
function textoPersonas({ adultos, ninos, infantes }) {
  const partes = [
    adultos && plural(adultos, "adulto", "adultos"),
    ninos && plural(ninos, "niño", "niños"),
    infantes && `${plural(infantes, "infante", "infantes")} (no ${infantes === 1 ? "paga" : "pagan"})`,
  ].filter(Boolean);
  return partes.length > 1 ? `${partes.slice(0, -1).join(", ")} y ${partes.at(-1)}` : partes[0] || "";
}

function mostrarResultado(crudo, recien) {
  const res = normalizar(crudo);
  if (!res) { estadoForm(MSG.servidor); return; }
  resultado = res;
  guardar(res);
  $("#resultado-titulo").textContent = res.duplicada ? "Ya tenías esta separación" : "Tu separación quedó registrada";
  $("#r-intro").textContent = res.duplicada
    ? "Ya habíamos recibido tus datos hace unos minutos. Es la misma separación, con la misma referencia y lo que quedó guardado."
    : "Guarda tu referencia: la necesitas para pagar y para enviar el comprobante.";
  $("#r-referencia").textContent = res.referencia;
  $("#r-valor").textContent = pesos(res.valor);
  $("#r-personas").textContent = textoPersonas(res.personas);
  const texto = mensajeWhatsApp({ referencia: res.referencia, nombre: res.nombre, equipo: res.equipo, ...res.personas, valor: res.valor });
  $("#r-whatsapp").href = enlaceWhatsApp(DATOS.whatsapp.numero, texto);
  pintarFase();
  if (recien) {
    const vista = $("#vista-resultado");
    vista.scrollIntoView({ block: "start", behavior: quieto.matches ? "auto" : "smooth" });
    vista.focus({ preventScroll: true });
  }
}

$("#otra").addEventListener("click", () => {
  borrar();
  resultado = null;
  form.reset();
  limpiarErrores();
  pintarValor();
  pintarFase();
  if (faseVista === "abierta") form.elements.nombre.focus();
});

$("#copiar").addEventListener("click", async (e) => {
  const boton = e.currentTarget;
  let ok = false;
  try { await navigator.clipboard.writeText(DATOS.pagos.llave); ok = true; } catch {
    const rango = document.createRange();
    rango.selectNodeContents($("#r-llave"));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(rango);
  }
  $("#copiar-estado").textContent = ok ? "Llave copiada." : "La llave quedó seleccionada: cópiala desde el menú de tu celular.";
  if (ok) { boton.textContent = "Copiada"; setTimeout(() => { boton.textContent = "Copiar"; }, 2000); }
});

$("#abrir-condiciones").addEventListener("click", () => $("#condiciones").showModal());
$("#reintentar").addEventListener("click", () => { $("#anuncio").textContent = "Consultando de nuevo…"; cargarEstado(); });

/* ---------------- Arranque ---------------- */
pintarContenido();
activarMeses();
activarCancun();
pintarValor();
limpiarErrores();
resultado = leerGuardado();
if (resultado) mostrarResultado(resultado, false);
new IntersectionObserver((entradas) => {
  separarCerca = entradas.some((e) => e.isIntersecting);
  if (separarCerca && faseVista === "abierta" && !resultado) cargarTurnstile();
}, { rootMargin: "800px 0px" }).observe($("#separar"));
tic();
cargarEstado();
setInterval(tic, 1000);
setInterval(cargarEstado, 60000);
