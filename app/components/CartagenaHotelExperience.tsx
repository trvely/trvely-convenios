"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import HotelSwitcher from "./HotelSwitcher";
import s from "./cartagena-hotel.module.css";

const PRICE = 1_499_999;
const WHATSAPP = "573233916413";

type Photo = { src: string; alt: string };
type Room = {
  name: string;
  eyebrow: string;
  description: string;
  details: string[];
  image: string;
};

export type CartagenaHotelConfig = {
  id: "cartagena-plaza" | "cartagena-dubai";
  name: string;
  shortName: string;
  location: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  storyEyebrow: string;
  storyTitle: string;
  story: string;
  storyNote: string;
  officialUrl: string;
  officialRoomsUrl: string;
  hero: Photo;
  featurePhoto: Photo;
  gallery: Photo[];
  rooms: Room[];
  highlights: { title: string; detail: string }[];
};

const inclusions = [
  { number: "01", title: "Vuelos ida y regreso", detail: "Tiquetes aéreos con salida desde Bogotá, en el itinerario confirmado por Trvely." },
  { number: "02", title: "Traslados incluidos", detail: "Servicio aeropuerto–hotel–aeropuerto coordinado con la operación de la reserva." },
  { number: "03", title: "Tres noches", detail: "Alojamiento en el hotel seleccionado y en la acomodación confirmada por escrito." },
  { number: "04", title: "Todo incluido", detail: "Alimentación y bebidas según el alcance del plan confirmado para la habitación reservada." },
  { number: "05", title: "Tour a Playa Barú", detail: "Experiencia incluida según la programación, el punto de encuentro y las condiciones informadas." },
] as const;

const safeguards = [
  {
    title: "La tarifa es “desde”",
    text: "El valor puede cambiar por fecha, disponibilidad aérea y hotelera, ocupación, edad de los viajeros y condiciones vigentes al cotizar.",
  },
  {
    title: "La habitación se confirma",
    text: "Mostrar una categoría no significa que esté incluida en la tarifa base. Trvely informará por escrito la habitación y cualquier suplemento antes del pago.",
  },
  {
    title: "Los menores se cotizan",
    text: "Necesitamos la edad exacta de cada menor. Tiquete, cama, ocupación y tarifa infantil dependen de la composición real del viaje.",
  },
  {
    title: "Consultar no reserva",
    text: "El mensaje por WhatsApp inicia la asesoría. El cupo existe cuando Trvely valida todos los servicios, emite condiciones y confirma el pago.",
  },
] as const;

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

export default function CartagenaHotelExperience({ config }: { config: CartagenaHotelConfig }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft") setActivePhoto((current) => (current - 1 + config.gallery.length) % config.gallery.length);
      if (event.key === "ArrowRight") setActivePhoto((current) => (current + 1) % config.gallery.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [config.gallery.length, lightbox]);

  const whatsappUrl = useMemo(() => {
    const dateLine = travelDate
      ? `Mi fecha preferida es ${travelDate}.`
      : "Quiero conocer las fechas disponibles.";
    const childrenLine = children
      ? `Viajan ${children} menor(es); compartiré sus edades exactas antes de cotizar.`
      : "Por ahora, todos los viajeros son adultos.";
    const message = `Hola, equipo Trvely. Me interesa el convenio Coopercar para ${config.name}: plan de 3 noches desde ${formatMoney(PRICE)} por persona. ${dateLine} Viajaríamos ${adults} adulto(s) y ${children} menor(es). ${childrenLine} Vi que incluye vuelos ida y regreso desde Bogotá, traslados aeropuerto–hotel–aeropuerto, alojamiento, alimentación todo incluido y tour a Playa Barú. Entiendo que el precio final, los horarios, el equipaje, la habitación, la acomodación y la disponibilidad se confirman antes del pago.`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
  }, [adults, children, config.name, travelDate]);

  const movePhoto = (direction: number) =>
    setActivePhoto((current) => (current + direction + config.gallery.length) % config.gallery.length);

  return (
    <main className={s.page} id="inicio">
      <header className={s.header}>
        <a className={s.brand} href="/coopercar/" aria-label="Volver al convenio Coopercar de Trvely">
          <Image src="/brand/trvely.png" width={300} height={90} alt="Trvely" priority />
          <span />
          <b>COOPERCAR</b>
        </a>
        <div className="header-menu-group">
          <HotelSwitcher current={config.id} />
          <nav className={s.sectionNav} aria-label={`Secciones de ${config.name}`}>
            <a href="#incluye">El plan</a>
            <a href="#hotel">El hotel</a>
            <a href="#habitaciones">Habitaciones</a>
            <a href="#galeria">Fotos</a>
          </nav>
        </div>
        <a className={s.headerCta} href={whatsappUrl} target="_blank" rel="noreferrer">Cotizar con Trvely</a>
      </header>

      <section className={s.hero}>
        <Image className={s.heroImage} src={config.hero.src} alt={config.hero.alt} fill sizes="100vw" priority />
        <div className={s.heroShade} />
        <div className={s.heroContent}>
          <div className={s.heroCopy}>
            <span className={s.eyebrow}>CONVENIO COOPERCAR · CARTAGENA</span>
            <h1>{config.heroTitle}<br /><em>{config.heroAccent}</em></h1>
            <p>{config.heroDescription}</p>
            <div className={s.heroActions}>
              <a className={s.primaryButton} href="#hotel">Conocer el hotel <span>↓</span></a>
              <a className={s.secondaryButton} href="#galeria">Ver fotografías</a>
            </div>
          </div>
          <aside className={s.heroOffer} aria-label="Precio promocional">
            <span>PAQUETE · 3 NOCHES</span>
            <small>DESDE</small>
            <strong>{formatMoney(PRICE)}</strong>
            <p>por persona</p>
            <i>Precio variable según fechas y disponibilidad</i>
          </aside>
          <div className={s.trianaHero}>
            <Image src="/triana/triana-real-hero.webp" alt="Triana, anfitriona digital de Trvely" width={1316} height={1456} priority />
            <div className={s.trianaBubble}>
              <small>TRIANA TE CUENTA</small>
              <strong>Cartagena se disfruta mejor cuando todo está claro.</strong>
              <p>Yo te muestro la experiencia; el equipo confirma la fecha, la habitación y cada servicio.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={s.factRail} aria-label="Resumen del producto">
        <div><strong>3 noches</strong><span>para vivir Cartagena</span></div>
        <div><strong>Desde Bogotá</strong><span>vuelos ida y regreso</span></div>
        <div><strong>Todo incluido</strong><span>según plan confirmado</span></div>
        <div><strong>Playa Barú</strong><span>tour incluido</span></div>
      </section>

      <section className={s.inclusions} id="incluye">
        <div className={s.sectionHeading}>
          <span>UN PLAN PENSADO DE PRINCIPIO A FIN</span>
          <h2>Lo esencial ya<br /><em>viaja contigo.</em></h2>
          <p>Estas son las cinco piezas del paquete. La cotización final especificará horarios, condiciones, acomodación y alcance exacto de cada servicio.</p>
        </div>
        <div className={s.inclusionGrid}>
          {inclusions.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
        <div className={s.priceNotice}>
          <span>IMPORTANTE</span>
          <p><strong>{formatMoney(PRICE)} es una tarifa “desde” por persona.</strong> Puede variar según las fechas seleccionadas, la disponibilidad de vuelos y hotel, la acomodación, las edades y las condiciones vigentes cuando Trvely realice la cotización.</p>
        </div>
      </section>

      <section className={s.hotelStory} id="hotel">
        <div className={s.storyImage}>
          <Image src={config.featurePhoto.src} alt={config.featurePhoto.alt} fill sizes="(max-width: 850px) 100vw, 52vw" />
          <span>{config.location}</span>
        </div>
        <div className={s.storyCopy}>
          <span className={s.eyebrowDark}>{config.storyEyebrow}</span>
          <h2>{config.storyTitle}</h2>
          <p>{config.story}</p>
          <div className={s.highlightGrid}>
            {config.highlights.map((highlight) => (
              <div key={highlight.title}><strong>{highlight.title}</strong><span>{highlight.detail}</span></div>
            ))}
          </div>
          <div className={s.trianaNote}><b>T</b><p><strong>Dato de Triana</strong>{config.storyNote}</p></div>
        </div>
      </section>

      <section className={s.rooms} id="habitaciones">
        <div className={s.roomsHeading}>
          <div><span className={s.eyebrowDark}>TU ESPACIO PARA DESCANSAR</span><h2>Habitaciones que cambian<br />la forma de despertar.</h2></div>
          <p>Conoce las categorías del hotel. La tarifa publicada no garantiza una categoría específica: la habitación disponible y su ocupación se confirman en la cotización.</p>
        </div>
        <div className={s.roomGrid}>
          {config.rooms.map((room, index) => (
            <article className={s.roomCard} key={room.name}>
              <div className={s.roomImage}>
                <Image src={room.image} alt={`Habitación representativa de ${config.name}`} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={s.roomBody}>
                <small>{room.eyebrow}</small>
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <ul>{room.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
        <div className={s.roomWarning}><strong>Antes de pagar</strong><span>Trvely debe confirmar por escrito la categoría, el tipo de cama, la vista, la capacidad y si existe un suplemento. Las imágenes son representativas.</span></div>
      </section>

      <section className={s.gallerySection} id="galeria">
        <div className={s.galleryHeading}>
          <span className={s.eyebrowDark}>MÍRALO ANTES DE IMAGINARLO</span>
          <h2>Un vistazo a<br />{config.shortName}.</h2>
          <p>Selecciona una fotografía para recorrer la propiedad.</p>
        </div>
        <div className={s.galleryStage}>
          <button className={s.galleryMain} onClick={() => setLightbox(true)} aria-label={`Ampliar fotografía ${activePhoto + 1} de ${config.gallery.length}`}>
            <Image src={config.gallery[activePhoto].src} alt={config.gallery[activePhoto].alt} fill sizes="(max-width: 820px) 100vw, 70vw" />
            <span>{String(activePhoto + 1).padStart(2, "0")} / {String(config.gallery.length).padStart(2, "0")}</span>
          </button>
          <aside className={s.galleryAside}>
            <div><small>{config.name}</small><p>{config.gallery[activePhoto].alt}</p></div>
            <div className={s.galleryArrows}><button onClick={() => movePhoto(-1)} aria-label="Fotografía anterior">←</button><button onClick={() => movePhoto(1)} aria-label="Siguiente fotografía">→</button></div>
          </aside>
        </div>
        <div className={s.thumbnails}>
          {config.gallery.map((photo, index) => (
            <button className={index === activePhoto ? s.thumbActive : s.thumb} onClick={() => setActivePhoto(index)} aria-label={`Ver fotografía ${index + 1}`} aria-pressed={index === activePhoto} key={photo.src}>
              <Image src={photo.src} alt="" fill sizes="140px" />
            </button>
          ))}
        </div>
      </section>

      <section className={s.quoteSection} id="cotizar">
        <div className={s.quoteVisual}>
          <div>
            <span>UNA COTIZACIÓN HECHA PARA TU VIAJE</span>
            <h2>Dime cuándo.<br /><em>Yo preparo el mensaje.</em></h2>
            <p>Tu selección no reserva ni congela la tarifa. Sirve para que el asesor reciba desde el primer mensaje los datos que necesita.</p>
          </div>
          <Image src="/triana/triana-real-presenta.png" alt="Triana presenta el formulario de cotización" width={2048} height={2048} />
        </div>
        <div className={s.quoteCard}>
          <div className={s.quoteHeader}><div><small>CONVENIO COOPERCAR</small><h3>Cotiza {config.shortName}</h3></div><span>3 noches</span></div>
          <label>Fecha preferida<input type="date" value={travelDate} onChange={(event) => setTravelDate(event.target.value)} /><small>Si aún no la tienes, deja el campo vacío y te mostramos opciones.</small></label>
          <div className={s.formRow}>
            <label>Adultos<select value={adults} onChange={(event) => setAdults(Number(event.target.value))}>{[1, 2, 3, 4, 5, 6, 7, 8].map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
            <label>Menores<select value={children} onChange={(event) => setChildren(Number(event.target.value))}>{[0, 1, 2, 3, 4].map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
          </div>
          {children > 0 && <p className={s.childrenNotice}>El asesor te pedirá las edades exactas de los menores para validar tiquetes, ocupación y tarifa.</p>}
          <div className={s.quotePrice}><div><small>PRECIO PUBLICADO DESDE</small><strong>{formatMoney(PRICE)}</strong><span>por persona</span></div><p>Valor final<br />bajo cotización</p></div>
          <ul className={s.quoteSummary}><li>Vuelos desde Bogotá</li><li>Traslados</li><li>3 noches todo incluido</li><li>Tour a Playa Barú</li></ul>
          <a className={s.whatsappButton} href={whatsappUrl} target="_blank" rel="noreferrer">Enviar mi solicitud a Trvely <span>↗</span></a>
          <p className={s.quoteDisclaimer}>WhatsApp inicia la asesoría. No confirma cupo, tarifa, vuelo, habitación ni servicios hasta recibir la validación escrita de Trvely.</p>
        </div>
      </section>

      <section className={s.rules}>
        <div className={s.rulesHeading}><span className={s.eyebrowDark}>PARA ELEGIR SIN MALENTENDIDOS</span><h2>Bonito por fuera.<br />Claro por dentro.</h2></div>
        <div className={s.ruleGrid}>
          {safeguards.map((rule, index) => <article key={rule.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{rule.title}</strong><p>{rule.text}</p></article>)}
        </div>
      </section>

      <section className={s.faq}>
        <div><span>TRIANA RESPONDE</span><h2>Antes de decir<br />“nos vamos”.</h2></div>
        <div className={s.faqList}>
          <details open><summary>¿Los $1.499.999 son el precio final?</summary><p>No. Es una tarifa desde, por persona. La fecha elegida, la disponibilidad, la ocupación, los vuelos y las edades determinan el valor final.</p></details>
          <details><summary>¿Qué habitación incluye la tarifa?</summary><p>La publicación no garantiza una categoría. El asesor informará la habitación disponible, el tipo de cama, la ocupación y cualquier suplemento antes del pago.</p></details>
          <details><summary>¿Qué incluye el tour a Playa Barú?</summary><p>El tour forma parte del paquete; el operador, horarios, transporte, alimentación y demás detalles se entregan en la cotización y en los documentos de viaje. Lo no descrito por escrito no se presume incluido.</p></details>
          <details><summary>¿El equipaje aéreo está incluido?</summary><p>Depende de la tarifa aérea disponible. Trvely confirmará aerolínea, horarios y equipaje incluido antes de emitir o recibir el pago correspondiente.</p></details>
          <details><summary>¿Puedo viajar con niños?</summary><p>Sí, sujeto a la capacidad de la habitación. Debes informar la edad exacta de cada menor para cotizar correctamente vuelos, cama y alojamiento.</p></details>
        </div>
      </section>

      <section className={s.closing}>
        <div><span>TRIANA Y EL EQUIPO TRVELY TE ACOMPAÑAN</span><h2>Tu Cartagena<br />empieza con una fecha.</h2><p>Cuéntanos cuándo quieres viajar y quiénes te acompañan. Nosotros confirmamos la mejor opción disponible sin dejar cabos sueltos.</p><a href={whatsappUrl} target="_blank" rel="noreferrer">Cotizar por WhatsApp <b>↗</b></a><small>Atención Trvely · +57 323 391 6413</small></div>
        <Image src="/triana/triana-real-cierre.png" alt={`Triana te invita a conocer ${config.name}`} width={609} height={820} />
      </section>

      <footer className={s.footer}>
        <div className={s.footerBrand}><Image src="/brand/trvely.png" alt="Trvely" width={300} height={90} /><span>×</span><b>COOPERCAR</b></div>
        <p>Convenio comercial · {config.name}<br />Información y precios sujetos a disponibilidad y confirmación final.</p>
        <div><a href={config.officialRoomsUrl} target="_blank" rel="noreferrer">Habitaciones oficiales</a><a href={config.officialUrl} target="_blank" rel="noreferrer">Sitio del hotel</a></div>
      </footer>

      {lightbox && (
        <div className={s.lightbox} role="dialog" aria-modal="true" aria-label={`Galería ampliada de ${config.name}`}>
          <button className={s.closeLightbox} onClick={() => setLightbox(false)} aria-label="Cerrar galería">×</button>
          <button className={s.lightboxPrevious} onClick={() => movePhoto(-1)} aria-label="Fotografía anterior">←</button>
          <Image src={config.gallery[activePhoto].src} alt={config.gallery[activePhoto].alt} width={1800} height={1200} priority />
          <button className={s.lightboxNext} onClick={() => movePhoto(1)} aria-label="Siguiente fotografía">→</button>
          <div><strong>{config.gallery[activePhoto].alt}</strong><span>{activePhoto + 1} / {config.gallery.length}</span></div>
        </div>
      )}

      <a className={s.stickyWhatsapp} href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={`Cotizar ${config.name} por WhatsApp`}><span>●</span><div><small>CONVENIO COOPERCAR</small>Cotizar {config.shortName}</div><b>↗</b></a>
    </main>
  );
}
