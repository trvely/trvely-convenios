import type { Metadata } from "next";

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
