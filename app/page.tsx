"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

const hotels = [
  {
    id: "bayahibe",
    name: "Catalonia Bayahibe",
    place: "Bayahíbe · La Romana",
    audience: "Familiar",
    lead: "Mar tranquilo, jardines tropicales y días que se sienten largos.",
    copy: "Una elección luminosa para viajar en familia o con amigos: resort todo incluido frente al Caribe, gran piscina y ambiente tropical.",
    image: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/full/catalonia-bayahibe_001.jpg",
    imageAlt: "Playa y palmeras del Catalonia Bayahibe",
    zone: "Bayahíbe",
    detail: "Familias · playa · descanso",
  },
  {
    id: "royal-la-romana",
    name: "Catalonia Royal La Romana",
    place: "Bayahíbe · La Romana",
    audience: "Solo adultos +18",
    lead: "Una escala más íntima del Caribe, pensada para dos.",
    copy: "211 habitaciones, área de playa exclusiva y acceso a las instalaciones del Catalonia Bayahibe de al lado.",
    image: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-royal-la-romana/full/catalonia-royal-la-romana_001.jpg",
    imageAlt: "Piscina y entorno tropical del Catalonia Royal La Romana",
    zone: "Bayahíbe",
    detail: "Parejas · calma · playa exclusiva",
  },
  {
    id: "bavaro",
    name: "Catalonia Bávaro Resort",
    place: "Cabeza de Toro · Punta Cana",
    audience: "Familiar",
    lead: "Un gran resort para que cada persona encuentre su propio plan.",
    copy: "682 suites en villas alrededor de un lago, playa de arena blanca, entretenimiento, casino y opciones para toda la familia.",
    image: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-bavaro-beach/full/catalonia-bavaro-beach_059.jpg",
    imageAlt: "Playa del Catalonia Bávaro Resort en Punta Cana",
    zone: "Punta Cana",
    detail: "Familias · actividades · gran resort",
  },
  {
    id: "royal-bavaro",
    name: "Catalonia Royal Bávaro",
    place: "Cabeza de Toro · Punta Cana",
    audience: "Solo adultos +18",
    lead: "Suites, silencio y una atmósfera hecha para desconectarse.",
    copy: "Resort cinco estrellas con 284 suites, acceso directo a la playa y entrada a las instalaciones del Catalonia Bávaro de al lado.",
    image: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-royal-bavaro/full/catalonia-royal-bavaro_034.jpg",
    imageAlt: "Piscina y palmeras del Catalonia Royal Bávaro",
    zone: "Punta Cana",
    detail: "Parejas · suites · sofisticación",
  },
] as const;

const travelDates = [
  { id: "oct-21", day: "21", month: "OCT", range: "21 — 25 octubre", long: "21 al 25 de octubre de 2027", deadline: "21 de septiembre de 2027", deadlineISO: "2027-09-21" },
  { id: "nov-18", day: "18", month: "NOV", range: "18 — 22 noviembre", long: "18 al 22 de noviembre de 2027", deadline: "18 de octubre de 2027", deadlineISO: "2027-10-18" },
  { id: "nov-25", day: "25", month: "NOV", range: "25 — 29 noviembre", long: "25 al 29 de noviembre de 2027", deadline: "25 de octubre de 2027", deadlineISO: "2027-10-25" },
  { id: "dec-09", day: "09", month: "DIC", range: "9 — 13 diciembre", long: "9 al 13 de diciembre de 2027", deadline: "9 de noviembre de 2027", deadlineISO: "2027-11-09" },
] as const;

const formatMoney = (value: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

function getInstallments(deadlineISO: string) {
  const today = new Date();
  const deadline = new Date(`${deadlineISO}T12:00:00`);
  const difference = (deadline.getFullYear() - today.getFullYear()) * 12 + deadline.getMonth() - today.getMonth();
  return deadline < today ? 0 : Math.max(1, difference);
}

export default function Home() {
  const [hotelId, setHotelId] = useState<(typeof hotels)[number]["id"]>("bayahibe");
  const [dateId, setDateId] = useState<(typeof travelDates)[number]["id"]>("oct-21");
  const [airport, setAirport] = useState<"PUJ" | "SDQ">("PUJ");
  const [passengers, setPassengers] = useState(2);
  const [pricePerPerson, setPricePerPerson] = useState(0);

  const selectedHotel = hotels.find((hotel) => hotel.id === hotelId) ?? hotels[0];
  const selectedDate = travelDates.find((date) => date.id === dateId) ?? travelDates[0];
  const installments = getInstallments(selectedDate.deadlineISO);
  const quote = useMemo(() => {
    const total = Math.max(0, pricePerPerson) * passengers;
    const initial = 200000 * passengers;
    const balance = Math.max(0, total - initial);
    const regular = installments > 0 ? Math.floor(balance / installments) : balance;
    const last = installments > 0 ? balance - regular * Math.max(0, installments - 1) : balance;
    return { total, initial, balance, regular, last };
  }, [installments, passengers, pricePerPerson]);

  const whatsappUrl = (hotel = selectedHotel) => {
    const price = pricePerPerson > 0 ? `Mi referencia por persona es ${formatMoney(pricePerPerson)}.` : "Quiero conocer la tarifa cuando esté confirmada.";
    const message = `Hola, equipo Trvely. Soy asociado(a) de Coopercar y me interesa ${hotel.name}, para viajar del ${selectedDate.long}, llegando por ${airport}. Viajaríamos ${passengers} persona(s). ${price} ¿Me asesoran, por favor?`;
    return `https://wa.me/573233916413?text=${encodeURIComponent(message)}`;
  };

  const chooseHotel = (id: (typeof hotels)[number]["id"]) => {
    setHotelId(id);
    document.getElementById("aeropuertos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Trvely Convenios, inicio">
          <Image src="/brand/trvely.png" alt="Trvely" width={300} height={90} priority />
          <span className="brand-divider" aria-hidden="true" />
          <span className="partner-lockup"><small>CONVENIO</small>COOPERCAR</span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#fechas">Fechas</a><a href="#hoteles">Hoteles</a><a href="#pagos">Plan de pagos</a>
        </nav>
        <a className="header-cta" href="#hoteles">Explorar el convenio</a>
      </header>

      <section className="hero" id="inicio">
        <video className="hero-media" autoPlay muted loop playsInline poster="https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/video/catalonia-bayahibe_hero_poster.jpg" aria-hidden="true">
          <source src="https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/video/catalonia-bayahibe_hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-copy">
            <div className="eyebrow light">BENEFICIO EXCLUSIVO PARA ASOCIADOS COOPERCAR</div>
            <h1>Tu Caribe 2027<br />empieza con un <em>sí.</em></h1>
            <p>Cuatro resorts Catalonia en República Dominicana. Cuatro fechas para elegir. Una forma sencilla de empezar hoy y pagar tu viaje con tiempo.</p>
            <div className="hero-actions">
              <a className="button primary" href="#hoteles">Quiero elegir mi hotel</a>
              <a className="button ghost" href="#pagos">Simular mis cuotas</a>
            </div>
          </div>
          <div className="triana-hero" aria-label="Triana, anfitriona digital de Trvely">
            <div className="speech-card"><span className="live-dot" /><small>TRIANA · ANFITRIONA DIGITAL</small><strong>Hola, soy Triana.</strong><p>Te acompaño a elegir hotel, fecha y la forma de pago que mejor te quede.</p></div>
            <Image src="/triana/triana-real-hero.webp" alt="Triana en su versión fotográfica presenta el convenio de viaje" width={1800} height={1800} priority />
          </div>
        </div>
      </section>

      <section className="benefit-rail" aria-label="Resumen del beneficio">
        <div><strong>100</strong><span>cupos exclusivos</span></div>
        <div><strong>$200.000</strong><span>para separar por persona</span></div>
        <div><strong>4 noches</strong><span>5 días · todo incluido</span></div>
        <div><strong>PUJ o SDQ</strong><span>dos aeropuertos posibles</span></div>
      </section>

      <section className="date-preview" id="fechas">
        <div className="section-heading compact"><div className="eyebrow">CUATRO MOMENTOS PARA DECIR SÍ</div><h2>Escoge tu semana en el Caribe</h2><p>Todas las salidas son de jueves a lunes: 4 noches y 5 días.</p></div>
        <div className="date-row">
          {travelDates.map((date) => (
            <button className={date.id === dateId ? "date-card active" : "date-card"} onClick={() => setDateId(date.id)} key={date.id} aria-pressed={date.id === dateId}>
              <span className="date-num">{date.day}</span><span className="date-month">{date.month}</span><span className="date-range">{date.range}</span><span className="date-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className="date-note"><span>✓</span><p>Para esta fecha, tu viaje debe quedar completamente pagado a más tardar el <strong>{selectedDate.deadline}</strong>.</p></div>
      </section>

      <section className="hotel-section" id="hoteles">
        <div className="hotel-intro">
          <div><div className="eyebrow light">CUATRO FORMAS DE VIVIR REPÚBLICA DOMINICANA</div><h2>El Caribe que se parece a ti</h2></div>
          <div className="price-status"><span className="status-icon">◌</span><div><strong>Tarifas en validación</strong><p>Estamos analizando precios, habitaciones y reglas 2026 para publicar una propuesta 2027 responsable.</p></div></div>
        </div>

        <div className="hotel-grid">
          {hotels.map((hotel, index) => (
            <article className="hotel-card" key={hotel.id}>
              <div className="hotel-photo"><Image src={hotel.image} alt={hotel.imageAlt} width={1000} height={680} sizes="(max-width: 700px) 100vw, 50vw" /><span className="hotel-index">0{index + 1}</span><span className="hotel-audience">{hotel.audience}</span></div>
              <div className="hotel-body">
                <span className="hotel-place">{hotel.place}</span><h3>{hotel.name}</h3><strong className="hotel-lead">{hotel.lead}</strong><p>{hotel.copy}</p>
                <div className="hotel-meta"><span>{hotel.detail}</span><span>Todo incluido</span></div>
                <div className="hotel-price"><div><small>PRECIO COOPERCAR</small><strong>En validación</strong></div><span>Separa con<br /><b>$200.000 p/p</b></span></div>
                <div className="hotel-actions"><button onClick={() => chooseHotel(hotel.id)}>Elegir este hotel <span>→</span></button><a href={whatsappUrl(hotel)} target="_blank" rel="noreferrer" aria-label={`Preguntar por WhatsApp por ${hotel.name}`}>WhatsApp ↗</a></div>
              </div>
            </article>
          ))}
        </div>
        <p className="source-note">Las categorías de habitación, ocupaciones, inclusiones y condiciones tarifarias se publicarán cuando termine la validación. No queremos que reserves con información incompleta.</p>
      </section>

      <section className="airport-section" id="aeropuertos">
        <div className="airport-shell">
          <div className="airport-copy">
            <div className="eyebrow">TU RUTA, BIEN PENSADA</div><h2>¿Punta Cana<br />o Santo Domingo?</h2>
            <p>Puedes cotizar el viaje llegando por <strong>PUJ</strong> o por <strong>SDQ</strong>. El mejor punto de entrada depende de tu hotel, el vuelo y el valor final del traslado.</p>
            <div className="airport-tabs" role="group" aria-label="Selecciona aeropuerto">
              <button className={airport === "PUJ" ? "active" : ""} onClick={() => setAirport("PUJ")} aria-pressed={airport === "PUJ"}><span>PUJ</span>Aeropuerto de Punta Cana</button>
              <button className={airport === "SDQ" ? "active" : ""} onClick={() => setAirport("SDQ")} aria-pressed={airport === "SDQ"}><span>SDQ</span>Las Américas · Santo Domingo</button>
            </div>
          </div>
          <div className="route-card">
            <div className="route-top"><span>RUTA SELECCIONADA</span><b>01 / 02</b></div>
            <div className="route-line"><div><small>LLEGADA</small><strong>{airport}</strong></div><span className="route-track"><i /></span><div><small>DESTINO</small><strong>{selectedHotel.zone}</strong></div></div>
            <div className="route-hotel"><Image src={selectedHotel.image} alt="" width={160} height={140} /><div><small>HOTEL ELEGIDO</small><strong>{selectedHotel.name}</strong><span>{selectedHotel.place}</span></div></div>
            <div className="route-insight">
              <span>TRIANA TE CUENTA</span>
              <p>{airport === "PUJ" ? (selectedHotel.zone === "Punta Cana" ? "PUJ es la llegada más directa para los hoteles de Cabeza de Toro." : "PUJ es una de las rutas habituales hacia Bayahíbe; confirmaremos traslado y tarifa.") : (selectedHotel.zone === "Bayahíbe" ? "SDQ es una alternativa viable hacia Bayahíbe; compararemos el costo total antes de recomendarla." : "Desde SDQ el trayecto terrestre a Punta Cana es más largo; vale la pena compararlo con el ahorro del vuelo.")}</p>
            </div>
            <div className="pending-price"><span>Diferencia por aeropuerto</span><strong>En análisis</strong></div>
          </div>
        </div>
      </section>

      <section className="payment-section" id="pagos">
        <div className="payment-heading"><div className="eyebrow light">PLANEACIÓN SIN SORPRESAS</div><h2>Hoy separas.<br /><em>Después, avanzas.</em></h2><p>Ingresa el valor por persona cuando lo conozcas —o usa una cifra de referencia— y Triana te muestra cómo se distribuiría el pago.</p></div>
        <div className="calculator-shell">
          <div className="triana-calc"><Image src="/triana/triana-real-presenta.png" alt="Triana en su versión fotográfica acompaña el simulador de pagos" width={2048} height={2048} /><div className="calc-bubble"><strong>Tu primer paso es simple.</strong><span>$200.000 por cada viajero.</span></div></div>
          <div className="calculator">
            <div className="calc-head"><div><small>SIMULADOR COOPERCAR</small><h3>Proyecta tus cuotas</h3></div><span>Estimación</span></div>
            <label>Hotel<select value={hotelId} onChange={(event) => setHotelId(event.target.value as typeof hotelId)}>{hotels.map((hotel) => <option value={hotel.id} key={hotel.id}>{hotel.name}</option>)}</select></label>
            <div className="form-row">
              <label>Fecha de viaje<select value={dateId} onChange={(event) => setDateId(event.target.value as typeof dateId)}>{travelDates.map((date) => <option value={date.id} key={date.id}>{date.range} de 2027</option>)}</select></label>
              <label>Viajeros<select value={passengers} onChange={(event) => setPassengers(Number(event.target.value))}>{[1,2,3,4,5,6].map((value) => <option key={value} value={value}>{value} {value === 1 ? "persona" : "personas"}</option>)}</select></label>
            </div>
            <label>Valor total del plan por persona <span className="label-hint">COP</span><input inputMode="numeric" min="200000" step="50000" value={pricePerPerson || ""} onChange={(event) => setPricePerPerson(Number(event.target.value.replace(/\D/g, "")))} placeholder="Ej. 3.500.000" /><small>Las tarifas oficiales aún están en validación. Puedes probar con un presupuesto estimado.</small></label>
            <div className="calc-results" aria-live="polite">
              <div><span>Cuota inicial</span><strong>{formatMoney(quote.initial)}</strong><small>{formatMoney(200000)} × {passengers}</small></div>
              <div><span>Saldo a financiar</span><strong>{pricePerPerson ? formatMoney(quote.balance) : "—"}</strong><small>Después de la separación</small></div>
              <div className="result-featured"><span>{installments || "—"} abonos mensuales</span><strong>{pricePerPerson ? formatMoney(quote.regular) : "—"}</strong><small>Último abono estimado: {pricePerPerson ? formatMoney(quote.last) : "—"}</small></div>
            </div>
            <div className="deadline-line"><span>FECHA LÍMITE DE PAGO TOTAL</span><strong>{selectedDate.deadline}</strong></div>
            <a className="calc-whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer">Enviar mi selección a un asesor <span>↗</span></a>
            <p className="calc-disclaimer">Simulación informativa. El cronograma definitivo se confirma al reservar y puede cambiar según la fecha real de compra. El valor total debe estar pagado un mes antes del viaje.</p>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div className="section-heading compact"><div className="eyebrow">ASÍ DE FÁCIL</div><h2>Del “quiero ir” al “ya casi viajamos”</h2></div>
        <div className="steps-grid">
          <div><span>01</span><strong>Elige tu experiencia</strong><p>Hotel, fecha, aeropuerto y número de viajeros.</p></div>
          <div><span>02</span><strong>Separa tu cupo</strong><p>Con $200.000 por persona inicias el plan.</p></div>
          <div><span>03</span><strong>Haz tus abonos</strong><p>Pagos mensuales según el saldo y el tiempo disponible.</p></div>
          <div><span>04</span><strong>Viaja tranquilo</strong><p>El plan queda totalmente pagado un mes antes de salir.</p></div>
        </div>
      </section>

      <section className="faq-section">
        <div><div className="eyebrow light">PREGUNTAS IMPORTANTES</div><h2>Claro desde<br />el comienzo.</h2><p>La confianza también hace parte del viaje.</p></div>
        <div className="faq-list">
          <details open><summary>¿La separación de $200.000 es por reserva?</summary><p>No. Es una cuota inicial de <strong>$200.000 por cada persona</strong> que viaja. Se descuenta del valor total de su plan.</p></details>
          <details><summary>¿Cuándo debe estar pagado todo el viaje?</summary><p>A más tardar un mes antes de la fecha de salida. En esta página mostramos la fecha límite exacta para cada una de las cuatro salidas.</p></details>
          <details><summary>¿Por qué todavía no aparecen los precios?</summary><p>Trvely está validando las tarifas comparables de 2026, los tipos de habitación, las ocupaciones y todas las reglas para proyectar correctamente 2027.</p></details>
          <details><summary>¿Puedo viajar con niños?</summary><p>Sí, en Catalonia Bayahibe y Catalonia Bávaro Resort. Los hoteles Royal La Romana y Royal Bávaro son exclusivamente para mayores de 18 años.</p></details>
          <details><summary>¿La reserva queda confirmada al escribir por WhatsApp?</summary><p>No. El chat inicia la asesoría. La reserva se confirma cuando Trvely valida disponibilidad, emite las condiciones y recibe la cuota inicial.</p></details>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-copy"><div className="eyebrow light">TRIANA Y EL EQUIPO TRVELY ESTÁN LISTOS</div><h2>El viaje empieza<br />con una conversación.</h2><p>Cuéntanos cuál hotel te gustó. Tu mensaje llegará con la fecha, el aeropuerto y el número de viajeros que elegiste.</p><a href={whatsappUrl()} target="_blank" rel="noreferrer">Hablar por WhatsApp <span>↗</span></a><small>Atención Trvely · +57 323 391 6413</small></div>
        <Image src="/triana/triana-real-cierre.png" alt="Triana en su versión fotográfica saluda y da la bienvenida" width={609} height={820} />
      </section>

      <footer><div className="footer-brand"><Image src="/brand/trvely.png" alt="Trvely" width={300} height={90} /><span>×</span><b>COOPERCAR</b></div><p>Convenio comercial · Caribe 2027<br />Información sujeta a disponibilidad y a las condiciones finales de la tarifa.</p><div><a href="#inicio">Volver arriba ↑</a><a href={whatsappUrl()} target="_blank" rel="noreferrer">WhatsApp</a></div></footer>

      <a className="sticky-whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Hablar con Trvely por WhatsApp"><span>●</span><div><small>¿LISTO PARA ELEGIR?</small>Hablar con un asesor</div><b>↗</b></a>
    </main>
  );
}
