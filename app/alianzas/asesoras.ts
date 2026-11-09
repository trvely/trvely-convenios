import type { Metadata } from "next";
import type { ConvenioBranding } from "../components/branding";
import { cartagenaDubai, cartagenaPlaza } from "../data/cartagena";

// Contactos comerciales de las páginas de convenios empresariales.
// Fuente: «Informe de ubicación – Equipo Star Sellers» (7-nov-2026).
// Solo se publican nombre, rol y WhatsApp: la dirección, el conjunto y el sector no van en la web.

export type Asesora = {
  slug: string;
  name: string;
  firstName: string;
  initials: string;
  role: string;
  phoneDisplay: string;
  whatsapp: string;
};

export const asesoras = {
  "diana-gonzalez": {
    slug: "diana-gonzalez",
    name: "Diana González",
    firstName: "Diana",
    initials: "DG",
    role: "Líder comercial",
    phoneDisplay: "+57 319 267 3482",
    whatsapp: "573192673482",
  },
  "monica-gonzalez": {
    slug: "monica-gonzalez",
    name: "Mónica Lucía González Fonseca",
    firstName: "Mónica",
    initials: "MG",
    role: "Equipo comercial Trvely",
    phoneDisplay: "+57 301 348 9910",
    whatsapp: "573013489910",
  },
  "luz-marina-rodriguez": {
    slug: "luz-marina-rodriguez",
    name: "Luz Marina Rodríguez Cuervo",
    firstName: "Luz Marina",
    initials: "LR",
    role: "Equipo comercial Trvely",
    phoneDisplay: "+57 316 525 8951",
    whatsapp: "573165258951",
  },
  "monica-gongora": {
    slug: "monica-gongora",
    name: "Mónica Góngora",
    firstName: "Mónica",
    initials: "MG",
    role: "Equipo comercial Trvely",
    phoneDisplay: "+57 305 368 2283",
    whatsapp: "573053682283",
  },
} as const satisfies Record<string, Asesora>;

export const alianzaRoutes = Object.keys(asesoras) as (keyof typeof asesoras)[];

const ogImage = "https://convenios.trvely.com.co/alianzas/og-real.jpg";

export function alianzaMetadata(asesora: Asesora): Metadata {
  const url = `https://convenios.trvely.com.co/alianzas/${asesora.slug}/`;
  return {
    metadataBase: new URL(url),
    title: "Trvely Convenios · Empresas aliadas | Caribe 2027",
    description: `Beneficio para empresas aliadas de Trvely: cuatro resorts Catalonia en República Dominicana durante 2027. Te atiende ${asesora.name}.`,
    // Páginas para compartir por enlace: no se indexan para no exponer el celular del contacto en buscadores.
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      title: "Caribe 2027 · Convenios empresariales Trvely",
      description: `Cuatro resorts Catalonia y una cuota inicial de $200.000 por persona. Te atiende ${asesora.name}.`,
      type: "website",
      locale: "es_CO",
      url,
      images: [{ url: ogImage, width: 1920, height: 1125, alt: "Triana acompaña a los viajeros de Trvely" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Caribe 2027 · Convenios empresariales Trvely",
      description: "Cuatro resorts Catalonia. Separa con $200.000 por persona.",
      images: [ogImage],
    },
  };
}

// ---------------------------------------------------------------- Productos del convenio (Coral y Cartagena)

/** Marca de las páginas de producto cuando las atiende una comercial: su WhatsApp, su nombre y su menú. */
export function alianzaBranding(asesora: Asesora): ConvenioBranding {
  return {
    basePath: `/alianzas/${asesora.slug}/`,
    homeAria: "Volver a los convenios empresariales de Trvely",
    lockup: "CONVENIOS EMPRESARIALES",
    label: "CONVENIO EMPRESARIAL",
    kicker: "CONVENIO EMPRESARIAL",
    switcherHeading: "CONVENIOS EMPRESARIALES · PRODUCTOS DISPONIBLES",
    program: "empresarial",
    packageLabel: "del convenio",
    whatsapp: asesora.whatsapp,
    greeting: `Hola, ${asesora.firstName}. Te escribo desde la página de convenios empresariales de Trvely.`,
    contactName: asesora.firstName,
    contactLine: `Te atiende ${asesora.name} · ${asesora.phoneDisplay}`,
    requestTo: `a ${asesora.firstName}`,
    requestPhrase: "Quiero solicitarte",
  };
}

export const productosAlianza = {
  "coral-costa-caribe": {
    title: "Coral Costa Caribe 2027 · Trvely Convenios empresariales",
    description: "Cuatro salidas a Coral Costa Caribe en Juan Dolio. Plan de 4 noches por $3.600.000 por persona y separación desde $200.000.",
    image: { url: "https://trvely.com.co/wp-content/uploads/2025/09/Coral-Costa-Caribe-150.webp", width: 1600, height: 1067, alt: "Playa del Coral Costa Caribe en Juan Dolio" },
  },
  "cartagena-plaza": {
    title: "Cartagena Plaza · Convenios empresariales | Trvely",
    description: "Tres noches en Cartagena Plaza desde $1.499.999 por persona con vuelos desde Bogotá, traslados, todo incluido y tour a Playa Barú.",
    image: { url: cartagenaPlaza.hero.src, width: 1600, height: 1000, alt: cartagenaPlaza.hero.alt },
  },
  "cartagena-dubai": {
    title: "Cartagena Dubai · Convenios empresariales | Trvely",
    description: "Tres noches en Cartagena Dubai desde $1.499.999 por persona con vuelos desde Bogotá, traslados, todo incluido y tour a Playa Barú.",
    image: { url: cartagenaDubai.hero.src, width: 1600, height: 1000, alt: cartagenaDubai.hero.alt },
  },
} as const;

export type ProductoAlianza = keyof typeof productosAlianza;

export function alianzaProductMetadata(asesora: Asesora, producto: ProductoAlianza): Metadata {
  const p = productosAlianza[producto];
  const url = `https://convenios.trvely.com.co/alianzas/${asesora.slug}/${producto}/`;
  const description = `${p.description} Te atiende ${asesora.name}.`;
  return {
    metadataBase: new URL(url),
    title: p.title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: { title: p.title, description, type: "website", locale: "es_CO", url, images: [p.image] },
    twitter: { card: "summary_large_image", title: p.title, description, images: [p.image.url] },
  };
}
