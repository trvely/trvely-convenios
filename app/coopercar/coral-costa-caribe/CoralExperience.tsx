"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import HotelSwitcher from "../../components/HotelSwitcher";
import s from "./coral.module.css";

const PRICE_FOUR_NIGHTS = 3_600_000;
const PRICE_THREE_NIGHTS = 3_200_000;
const DEPOSIT_PER_PERSON = 200_000;
const WHATSAPP = "573233916413";

const departures = [
  { id: "oct-21", day: "21", month: "OCT", range: "21 — 25 octubre", long: "21 al 25 de octubre de 2027", deadline: "21 de septiembre de 2027", deadlineISO: "2027-09-21" },
  { id: "nov-18", day: "18", month: "NOV", range: "18 — 22 noviembre", long: "18 al 22 de noviembre de 2027", deadline: "18 de octubre de 2027", deadlineISO: "2027-10-18" },
  { id: "nov-25", day: "25", month: "NOV", range: "25 — 29 noviembre", long: "25 al 29 de noviembre de 2027", deadline: "25 de octubre de 2027", deadlineISO: "2027-10-25" },
  { id: "dec-09", day: "09", month: "DIC", range: "9 — 13 diciembre", long: "9 al 13 de diciembre de 2027", deadline: "9 de noviembre de 2027", deadlineISO: "2027-11-09" },
] as const;

const gallery = [
  { src: "https://trvely.com.co/wp-content/uploads/2025/09/Coral-Costa-Caribe-150.webp", alt: "Playa de arena clara, palmeras y mar Caribe frente al hotel" },
  { src: "https://trvely.com.co/wp-content/uploads/2025/09/Coral-Costa-Caribe-83.webp", alt: "Familia disfrutando la piscina del Coral Costa Caribe" },
  { src: "https://trvely.com.co/wp-content/uploads/2025/09/Coral-Costa-Caribe-154.webp", alt: "Piscina rodeada de jardines tropicales" },
  { src: "https://trvely.com.co/wp-content/uploads/2025/09/coral-costa-caribe_52163903908_o.webp", alt: "Desayuno tropical servido frente al mar" },
  { src: "https://coralcostacaribebeachresort.com/wp-content/uploads/2025/08/11.jpg", alt: "Pareja navegando en kayak frente a la playa de Juan Dolio" },
  { src: "https://coralcostacaribebeachresort.com/wp-content/uploads/2025/08/14.jpg", alt: "Cancha de tenis entre palmeras y jardines" },
  { src: "https://coralcostacaribebeachresort.com/wp-content/uploads/2025/08/21.jpg", alt: "Cena preparada en un ambiente tropical del resort" },
  { src: "https://coralcostacaribebeachresort.com/wp-content/uploads/2025/08/24.jpg", alt: "Habitación luminosa con balcón y vista a los jardines" },
] as const;

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

const subscribeToLocation = () => () => undefined;

function installmentsBetween(startISO: string, endISO: string) {
  if (!startISO) return 0;
  const start = new Date(`${startISO}T12:00:00`);
  const end = new Date(`${endISO}T12:00:00`);
  if (Number.isNaN(start.getTime()) || start >= end) return 0;
  let months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(1, months);
}

export default function CoralExperience() {
  const [departureId, setDepartureId] = useState<(typeof departures)[number]["id"]>("oct-21");
  const [passengers, setPassengers] = useState(2);
  const [party, setParty] = useState<"adults" | "family">("adults");
  const [bookingDate, setBookingDate] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const locationSearch = useSyncExternalStore(subscribeToLocation, () => window.location.search, () => "");
  const origin = useMemo(() => new URLSearchParams(locationSearch).get("origen")?.trim().slice(0, 60) ?? "", [locationSearch]);

  const selectedDeparture = departures.find((item) => item.id === departureId) ?? departures[0];

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") setActivePhoto((current) => (current + 1) % gallery.length);
      if (event.key === "ArrowLeft") setActivePhoto((current) => (current - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const quote = useMemo(() => {
    const total = PRICE_FOUR_NIGHTS * passengers;
    const initial = DEPOSIT_PER_PERSON * passengers;
    const balance = total - initial;
    const installments = installmentsBetween(bookingDate, selectedDeparture.deadlineISO);
    const monthly = installments ? Math.ceil(balance / installments / 1_000) * 1_000 : 0;
    const last = installments ? balance - monthly * Math.max(0, installments - 1) : 0;
    return { total, initial, balance, installments, monthly, last };
  }, [bookingDate, passengers, selectedDeparture]);

  const originLine = origin ? ` Código de origen del convenio: ${origin}.` : "";
  const partyLine = party === "family" ? "Viajo con uno o más menores y compartiré sus edades exactas." : "Todos los viajeros son adultos.";
  const fourNightMessage = `Hola, equipo Trvely. Me interesa Coral Costa Caribe para viajar del ${selectedDeparture.long}, plan de 4 noches, para ${passengers} persona(s). ${partyLine} Vi la tarifa publicada de ${formatMoney(PRICE_FOUR_NIGHTS)} por persona en acomodación doble y la separación de ${formatMoney(DEPOSIT_PER_PERSON)} por persona. Entiendo que vuelos, categoría de habitación, ocupación y disponibilidad deben confirmarse antes del pago.${originLine}`;
  const threeNightMessage = `Hola, equipo Trvely. Quiero solicitar al comercial encargado de la alianza el plan especial de 3 noches en Coral Costa Caribe por ${formatMoney(PRICE_THREE_NIGHTS)} por persona. Mi salida preferida es el ${selectedDeparture.long} y viajaríamos ${passengers} persona(s). Entiendo que esta modalidad no se reserva automáticamente y está sujeta a validación de fechas, vuelos, habitación y disponibilidad.${originLine}`;
  const fourNightWhatsApp = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(fourNightMessage)}`;
  const threeNightWhatsApp = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(threeNightMessage)}`;

  const movePhoto = (direction: number) => setActivePhoto((current) => (current + direction + gallery.length) % gallery.length);

  return (
    <main className={s.page} id="inicio">
      <header className={s.header}>
        <a className={s.brand} href="/coopercar/" aria-label="Volver a Trvely Convenios Coopercar">
          <Image src="/brand/trvely.png" width={300} height={90} alt="Trvely" priority />
          <span />
          <b>COOPERCAR</b>
        </a>
        <HotelSwitcher current="coral" />
        <nav aria-label="Navegación de la página">
          <a href="#salidas">Salidas</a>
          <a href="#experiencia">El hotel</a>
          <a href="#incluye">Incluye</a>
          <a href="#pagos">Pagos</a>
        </nav>
        <a className={s.headerCta} href={fourNightWhatsApp} target="_blank" rel="noreferrer">Hablar con Trvely</a>
      </header>

      <section className={s.hero}>
        <Image className={s.heroPhoto} src={gallery[0].src} alt={gallery[0].alt} fill sizes="100vw" priority />
        <div className={s.heroShade} />
        <div className={s.heroContent}>
          <div className={s.heroCopy}>
            <span className={s.kicker}>COOPERCAR · JUAN DOLIO 2027</span>
            <h1>Un Caribe<br />para <em>quedarte.</em></h1>
            <p>Coral Costa Caribe reúne playa, jardines y plan todo incluido en Juan Dolio. Elige una de cuatro salidas y empieza con una cuota inicial sencilla.</p>
            <div className={s.heroActions}>
              <a className={s.primaryButton} href="#salidas">Elegir mi salida <span>↓</span></a>
              <a className={s.secondaryButton} href="#galeria">Ver el hotel</a>
            </div>
          </div>
          <div className={s.heroPrice}>
            <span>PLAN PRINCIPAL · 4 NOCHES</span>
            <strong>{formatMoney(PRICE_FOUR_NIGHTS)}</strong>
            <small>por persona · acomodación doble</small>
            <div><b>{formatMoney(DEPOSIT_PER_PERSON)}</b><p>para separar<br />por persona</p></div>
          </div>
          <div className={s.trianaHero}>
            <Image src="/triana/triana-real-hero.webp" alt="Triana, anfitriona digital de Trvely" width={1316} height={1456} priority />
            <div className={s.trianaBubble}><small>TRIANA TE ACOMPAÑA</small><strong>Hola, ¿elegimos tu fecha?</strong><p>Yo te muestro el plan y el equipo confirma cada detalle antes de reservar.</p></div>
          </div>
        </div>
      </section>

      <section className={s.quickFacts} aria-label="Resumen del plan">
        <div><strong>4 noches</strong><span>5 días en Juan Dolio</span></div>
        <div><strong>Todo incluido</strong><span>hotel, alimentación y bebidas del plan</span></div>
        <div><strong>SDQ</strong><span>ruta principal a Las Américas</span></div>
        <div><strong>4 salidas</strong><span>octubre, noviembre y diciembre</span></div>
      </section>

      <section className={s.departures} id="salidas">
        <div className={s.sectionLead}>
          <span className={s.kickerDark}>CUATRO MOMENTOS PARA VIAJAR</span>
          <h2>La misma ilusión.<br /><em>Tu fecha favorita.</em></h2>
          <p>Las salidas principales conservan el ciclo de jueves a lunes: 4 noches y 5 días.</p>
        </div>
        <div className={s.dateGrid}>
          {departures.map((departure) => (
            <button className={departure.id === departureId ? s.dateActive : s.dateCard} onClick={() => setDepartureId(departure.id)} aria-pressed={departure.id === departureId} key={departure.id}>
              <span>{departure.day}</span><b>{departure.month}</b><small>{departure.range}</small><i>2027</i>
            </button>
          ))}
        </div>
        <div className={s.deadlineNote}><span>✓</span><p>Para la salida elegida, el plan debe quedar totalmente pagado a más tardar el <strong>{selectedDeparture.deadline}</strong>.</p></div>
      </section>

      <section className={s.planSection}>
        <div className={s.planIntro}><span className={s.kickerDark}>DOS FORMAS DE PENSAR TU ESTADÍA</span><h2>Una tarifa lista.<br />Una alternativa por solicitar.</h2></div>
        <div className={s.planGrid}>
          <article className={s.mainPlan}>
            <div><span>PLAN PUBLICADO</span><b>04 noches</b></div>
            <h3>{formatMoney(PRICE_FOUR_NIGHTS)}</h3>
            <p>Por persona en acomodación doble. Salida de jueves y regreso el lunes, con la selección elegida arriba.</p>
            <ul><li>Disponible para las cuatro salidas</li><li>Separación de $200.000 por persona</li><li>Simulación de abonos en esta página</li></ul>
            <a href="#pagos">Proyectar mis pagos <span>→</span></a>
          </article>
          <article className={s.requestPlan}>
            <div><span>SOLO BAJO SOLICITUD</span><b>03 noches</b></div>
            <h3>{formatMoney(PRICE_THREE_NIGHTS)}</h3>
            <p>Por persona. La salida puede conservarse, pero el regreso, los vuelos, la habitación y la disponibilidad deben ser construidos por el comercial encargado de la alianza.</p>
            <div className={s.requestRule}><strong>No se reserva automáticamente</strong><span>Este precio abre una solicitud; no confirma cupo ni servicios hasta recibir respuesta de Trvely.</span></div>
            <a href={threeNightWhatsApp} target="_blank" rel="noreferrer">Solicitar al comercial <span>↗</span></a>
          </article>
        </div>
      </section>

      <section className={s.experience} id="experiencia">
        <div className={s.experienceImage}><Image src={gallery[2].src} alt={gallery[2].alt} fill sizes="(max-width: 800px) 100vw, 55vw" /></div>
        <div className={s.experienceCopy}>
          <span className={s.kickerDark}>CORAL COSTA CARIBE · JUAN DOLIO</span>
          <h2>El mar al frente.<br />El descanso cerca.</h2>
          <p>Un resort familiar frente al Caribe, con 451 habitaciones y categorías Standard, Deluxe y Superior. La categoría exacta del paquete se confirma según inventario antes del pago.</p>
          <div className={s.experienceTags}><span>Hotel familiar</span><span>Playa</span><span>Piscina</span><span>Kids Club</span><span>Gimnasio</span></div>
          <div className={s.routeCard}><small>RUTA RECOMENDADA</small><strong>SDQ <i /> Juan Dolio</strong><p>El hotel informa aproximadamente 30 minutos desde el Aeropuerto Internacional Las Américas. El tiempo real depende del tráfico y de la operación del traslado.</p></div>
        </div>
      </section>

      <section className={s.inclusions} id="incluye">
        <div className={s.inclusionsTitle}><span>EL PLAN, SIN LETRA PEQUEÑA ESCONDIDA</span><h2>Lo que sí estás<br />eligiendo.</h2><p>El alcance se confirma nuevamente en la cotización y en la reserva.</p></div>
        <div className={s.inclusionColumns}>
          <div className={s.included}><strong>INCLUIDO EN EL PLAN DE 4 NOCHES</strong><ul><li><span>01</span>Tiquete aéreo de ida y regreso, según la salida confirmada.</li><li><span>02</span>Cuatro noches de alojamiento en Coral Costa Caribe.</li><li><span>03</span>Plan todo incluido del hotel durante la estadía.</li><li><span>04</span>Traslado privado de llegada y salida.</li><li><span>05</span>Asistencia médica de viaje.</li></ul></div>
          <div className={s.notIncluded}><strong>SE COTIZA O SE PAGA APARTE</strong><ul><li>Excursiones y actividades no descritas en la reserva.</li><li>Spa, cenas privadas, early check-in y experiencias premium.</li><li>Categorías superiores, ocupaciones distintas a doble y solicitudes especiales.</li><li>Gastos personales, propinas voluntarias y consumos fuera del plan.</li></ul><small>Niños y bebés requieren validación de edad, vuelos, cama, habitación y tarifa. No se asume gratuidad.</small></div>
        </div>
      </section>

      <section className={s.gallerySection} id="galeria">
        <div className={s.galleryHeading}><span className={s.kickerDark}>TODO ENTRA POR LOS OJOS</span><h2>Así se siente<br />Coral Costa Caribe.</h2><p>Selecciona una imagen para verla completa.</p></div>
        <div className={s.galleryStage}>
          <button className={s.galleryMain} onClick={() => setLightbox(true)} aria-label={`Ampliar imagen ${activePhoto + 1} de ${gallery.length}`}>
            <Image src={gallery[activePhoto].src} alt={gallery[activePhoto].alt} fill sizes="(max-width: 800px) 100vw, 65vw" />
            <span>{String(activePhoto + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span>
          </button>
          <div className={s.galleryAside}>
            <p>{gallery[activePhoto].alt}</p>
            <div><button onClick={() => movePhoto(-1)} aria-label="Imagen anterior">←</button><button onClick={() => movePhoto(1)} aria-label="Siguiente imagen">→</button></div>
          </div>
        </div>
        <div className={s.thumbnails}>
          {gallery.map((photo, index) => <button className={index === activePhoto ? s.thumbActive : s.thumb} onClick={() => setActivePhoto(index)} aria-label={`Ver imagen ${index + 1}`} aria-pressed={index === activePhoto} key={photo.src}><Image src={photo.src} alt="" fill sizes="120px" /></button>)}
        </div>
      </section>

      <section className={s.payment} id="pagos">
        <div className={s.paymentVisual}>
          <div className={s.paymentCopy}><span>PLANEA CON TIEMPO</span><h2>Hoy separas.<br /><em>Después avanzas.</em></h2><p>Triana toma la tarifa publicada y te muestra una proyección. El asesor confirma el calendario definitivo cuando revisa la reserva.</p></div>
          <Image src="/triana/triana-real-presenta.png" alt="Triana presenta el simulador de pagos" width={2048} height={2048} />
        </div>
        <div className={s.calculator}>
          <div className={s.calcHeader}><div><small>SIMULADOR CORAL COSTA CARIBE</small><h3>Proyecta tu plan</h3></div><span>4 noches</span></div>
          <label>Fecha de salida<select value={departureId} onChange={(event) => setDepartureId(event.target.value as typeof departureId)}>{departures.map((departure) => <option value={departure.id} key={departure.id}>{departure.range} de 2027</option>)}</select></label>
          <div className={s.formRow}>
            <label>Viajeros<select value={passengers} onChange={(event) => setPassengers(Number(event.target.value))}>{[2, 4, 6, 8].map((value) => <option value={value} key={value}>{value} personas</option>)}</select></label>
            <label>Tipo de grupo<select value={party} onChange={(event) => setParty(event.target.value as typeof party)}><option value="adults">Solo adultos</option><option value="family">Viajan menores</option></select></label>
          </div>
          <label>¿Cuándo proyectas separar?<input type="date" value={bookingDate} max={selectedDeparture.deadlineISO} onChange={(event) => setBookingDate(event.target.value)} /><small>Esta fecha solo calcula una guía; no reserva ni congela la tarifa.</small><button className={s.todayButton} type="button" onClick={() => { const now = new Date(); setBookingDate(new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)); }}>Usar la fecha de hoy</button></label>
          <div className={s.rateSummary}><div><small>TARIFA PUBLICADA</small><strong>{formatMoney(PRICE_FOUR_NIGHTS)}</strong><span>por persona · doble</span></div><p>{selectedDeparture.range}<br />Coral Costa Caribe</p></div>
          <div className={s.results} aria-live="polite">
            <div><span>Valor total</span><strong>{formatMoney(quote.total)}</strong><small>{passengers} viajeros</small></div>
            <div><span>Cuota inicial</span><strong>{formatMoney(quote.initial)}</strong><small>$200.000 por persona</small></div>
            <div><span>Saldo estimado</span><strong>{formatMoney(quote.balance)}</strong><small>Después de separar</small></div>
            <div className={s.monthlyResult}><span>{quote.installments ? `${quote.installments} abonos mensuales` : "Elige una fecha válida"}</span><strong>{quote.installments ? formatMoney(quote.monthly) : "—"}</strong><small>{quote.installments ? `Último abono estimado: ${formatMoney(Math.max(0, quote.last))}` : "El plan debe pagarse antes de la fecha límite"}</small></div>
          </div>
          <div className={s.deadline}><span>PAGO TOTAL A MÁS TARDAR</span><strong>{selectedDeparture.deadline}</strong></div>
          <a className={s.whatsappButton} href={fourNightWhatsApp} target="_blank" rel="noreferrer">Enviar mi selección a Trvely <span>↗</span></a>
          <p className={s.calcDisclaimer}>Proyección para acomodación doble. Cupos, vuelo, habitación, edades, servicios y valor final están sujetos a validación. Escribir por WhatsApp no confirma la reserva.</p>
        </div>
      </section>

      <section className={s.rules}>
        <div className={s.rulesLead}><span className={s.kickerDark}>ANTES DE SEPARAR</span><h2>Claro desde<br />el comienzo.</h2></div>
        <div className={s.ruleGrid}>
          <article><span>01</span><strong>La tarifa es por persona</strong><p>El valor publicado corresponde a acomodación doble. Otras ocupaciones deben cotizarse.</p></article>
          <article><span>02</span><strong>La categoría se confirma</strong><p>El hotel maneja Standard, Deluxe y Superior; la asignación depende del inventario contratado.</p></article>
          <article><span>03</span><strong>Los menores se cotizan</strong><p>Edad, tiquete, cama y habitación cambian el valor. No se presume gratuidad infantil.</p></article>
          <article><span>04</span><strong>Solicitar no es reservar</strong><p>La confirmación existe cuando Trvely valida, emite las condiciones y recibe la cuota inicial.</p></article>
        </div>
      </section>

      <section className={s.faq}>
        <div><span>RESPUESTAS ÚTILES</span><h2>Lo importante,<br />bien explicado.</h2></div>
        <div className={s.faqList}>
          <details open><summary>¿Los $200.000 son por reserva?</summary><p>No. La separación es de $200.000 por cada persona y se descuenta del total de su plan.</p></details>
          <details><summary>¿El plan de 3 noches se puede comprar directamente?</summary><p>No. Es una modalidad especial de $3.200.000 por persona que debe solicitarse al comercial responsable de la alianza. Trvely confirma fecha de regreso, vuelo, habitación y disponibilidad antes de ofrecerla.</p></details>
          <details><summary>¿Puedo viajar con niños?</summary><p>El hotel es familiar. Sin embargo, la tarifa infantil no se calcula automáticamente: se requiere la edad exacta y la composición de la habitación.</p></details>
          <details><summary>¿Qué habitación incluye el precio?</summary><p>La tarifa promocional no publica una categoría específica. Trvely confirma la habitación disponible y sus condiciones antes de recibir el pago.</p></details>
          <details><summary>¿WhatsApp confirma mi cupo?</summary><p>No. El mensaje inicia la asesoría. El cupo queda confirmado únicamente después de validar inventario, vuelos, ocupación, condiciones y cuota inicial.</p></details>
        </div>
      </section>

      <section className={s.closing}>
        <div><span>TRIANA Y EL EQUIPO TRVELY ESTÁN LISTOS</span><h2>Tu próximo Caribe<br />puede empezar hoy.</h2><p>Comparte tu fecha, cuántos viajan y si hay menores. El mensaje llegará con el contexto necesario para continuar.</p><a href={fourNightWhatsApp} target="_blank" rel="noreferrer">Hablar con Trvely <b>↗</b></a><small>Atención Trvely · +57 323 391 6413</small></div>
        <Image src="/triana/triana-real-cierre.png" alt="Triana da la bienvenida a Coral Costa Caribe" width={609} height={820} />
      </section>

      <footer className={s.footer}>
        <div className={s.footerBrand}><Image src="/brand/trvely.png" alt="Trvely" width={300} height={90} /><span>×</span><b>COOPERCAR</b></div>
        <p>Convenio comercial · Coral Costa Caribe 2027<br />Información sujeta a disponibilidad y condiciones finales.</p>
        <div><a href="https://trvely.com.co/coral-costa-caribe-resort/" target="_blank" rel="noreferrer">Ficha Trvely</a><a href="https://coralcostacaribebeachresort.com/" target="_blank" rel="noreferrer">Hotel oficial</a></div>
      </footer>

      {lightbox && <div className={s.lightbox} role="dialog" aria-modal="true" aria-label="Galería ampliada de Coral Costa Caribe"><button className={s.closeLightbox} onClick={() => setLightbox(false)} aria-label="Cerrar galería">×</button><button className={s.lightboxPrevious} onClick={() => movePhoto(-1)} aria-label="Imagen anterior">←</button><Image src={gallery[activePhoto].src} alt={gallery[activePhoto].alt} width={1800} height={1200} priority /><button className={s.lightboxNext} onClick={() => movePhoto(1)} aria-label="Siguiente imagen">→</button><div><strong>{gallery[activePhoto].alt}</strong><span>{activePhoto + 1} / {gallery.length}</span></div></div>}

      <a className={s.stickyWhatsapp} href={fourNightWhatsApp} target="_blank" rel="noreferrer" aria-label="Consultar Coral Costa Caribe por WhatsApp"><span>●</span><div><small>¿LISTO PARA JUAN DOLIO?</small>Hablar con un asesor</div><b>↗</b></a>
    </main>
  );
}
