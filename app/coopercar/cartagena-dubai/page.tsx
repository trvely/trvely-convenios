import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import CartagenaHotelExperience, { type CartagenaHotelConfig } from "../../components/CartagenaHotelExperience";

export const dynamic = "force-static";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-cartagena",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const assetVersions: Record<string, string> = {
  "002": "1781510491",
  "006": "1781510494",
  "012": "1781510497",
  "013": "1781510498",
  "016": "1781510500",
  "017": "1781510501",
  "022": "1781510505",
  "042": "1781510517",
  "058": "1781510527",
};

const dubaiAsset = (number: string) =>
  `https://res.cloudinary.com/trvely/image/upload/v${assetVersions[number]}/trvely/hoteles/cartagena/cartagena-dubai/imagenes/cartagena-dubai_${number}.jpg`;

const config: CartagenaHotelConfig = {
  id: "cartagena-dubai",
  name: "Hotel Cartagena Dubai",
  shortName: "Cartagena Dubai",
  location: "Bocagrande · Cartagena de Indias",
  heroTitle: "Cartagena sube,",
  heroAccent: "el horizonte se abre.",
  heroDescription: "Tres noches frente al Caribe en una torre inspirada en el mundo árabe. Vuelos, traslados, todo incluido y tour a Playa Barú reunidos en un mismo plan.",
  storyEyebrow: "HOTEL CARTAGENA DUBAI · BOCAGRANDE",
  storyTitle: "Altura, mar y una Cartagena diferente.",
  story: "Cartagena Dubai se eleva en Bocagrande con una propuesta temática inspirada en la arquitectura árabe. Sus 30 pisos, las vistas hacia el mar y la ciudad, la piscina y los espacios en altura convierten el hotel en una experiencia visual desde que llegas.",
  storyNote: "El hotel cuenta con varias categorías y capacidades. Trvely trabaja con Estándar, Superior, Junior Suite y Master Suite, pero la categoría incluida será únicamente la que figure en la cotización final.",
  officialUrl: "https://www.cartagenadubai.com/",
  officialRoomsUrl: "https://www.cartagenadubai.com/habitaciones",
  hero: {
    src: dubaiAsset("002"),
    alt: "Vista representativa del Hotel Cartagena Dubai en Bocagrande",
  },
  featurePhoto: {
    src: dubaiAsset("012"),
    alt: "Instalaciones del Hotel Cartagena Dubai con vista a la ciudad y al mar",
  },
  highlights: [
    { title: "30 pisos", detail: "Una torre vertical con ambientes y perspectivas diferentes de Cartagena." },
    { title: "Vistas en altura", detail: "Terraza panorámica, mirador y puente de cristal según operación del hotel." },
    { title: "Piscina", detail: "Zona para refrescarse y disfrutar el paisaje de Bocagrande." },
    { title: "Ubicación", detail: "Frente al mar y a aproximadamente 15 minutos del aeropuerto, según el hotel." },
  ],
  rooms: [
    {
      name: "Estándar",
      eyebrow: "BASE COMERCIAL TRVELY",
      description: "La categoría de entrada al hotel, con alternativas de vista a la ciudad y espacios funcionales.",
      details: ["Vista ciudad", "Wi-Fi", "Aire acondicionado"],
      image: dubaiAsset("013"),
    },
    {
      name: "Superior",
      eyebrow: "VISTA AL MAR",
      description: "Una alternativa para quienes quieren que el Caribe sea parte del descanso y del despertar.",
      details: ["Vista al mar", "Según ocupación", "Sujeta a suplemento"],
      image: dubaiAsset("016"),
    },
    {
      name: "Junior Suite",
      eyebrow: "MÁS AMPLITUD",
      description: "Una categoría superior con vista al mar y mayor capacidad, ideal para compartir la experiencia.",
      details: ["Vista al mar", "Capacidad por validar", "Categoría superior"],
      image: dubaiAsset("017"),
    },
    {
      name: "Master Suite",
      eyebrow: "PARA GRUPOS",
      description: "La opción más amplia del inventario comercial, pensada para grupos y sujeta a capacidad confirmada.",
      details: ["Vista al mar", "Hasta 6 según hotel", "Sujeta a suplemento"],
      image: dubaiAsset("022"),
    },
  ],
  gallery: [
    { src: dubaiAsset("002"), alt: "Vista exterior representativa del Hotel Cartagena Dubai." },
    { src: dubaiAsset("006"), alt: "Arquitectura y ambientes del Hotel Cartagena Dubai." },
    { src: dubaiAsset("012"), alt: "Espacios del hotel en el entorno de Bocagrande." },
    { src: dubaiAsset("013"), alt: "Habitación representativa del inventario de Cartagena Dubai." },
    { src: dubaiAsset("016"), alt: "Ambiente interior del hotel preparado para el descanso." },
    { src: dubaiAsset("017"), alt: "Otra habitación representativa disponible en la propiedad." },
    { src: dubaiAsset("042"), alt: "Piscina del hotel con vista al Caribe." },
    { src: dubaiAsset("058"), alt: "Una perspectiva más de la experiencia Cartagena Dubai." },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://convenios.trvely.com.co/coopercar/cartagena-dubai/"),
  title: "Cartagena Dubai · Convenio Coopercar | Trvely",
  description: "Tres noches en Cartagena Dubai desde $1.499.999 por persona con vuelos desde Bogotá, traslados, todo incluido y tour a Playa Barú.",
  openGraph: {
    title: "Cartagena Dubai · Trvely Convenios × Coopercar",
    description: "Bocagrande, tres noches, vuelos desde Bogotá, todo incluido y tour a Playa Barú.",
    type: "website",
    locale: "es_CO",
    images: [{ url: config.hero.src, width: 1600, height: 1050, alt: config.hero.alt }],
  },
};

export default function CartagenaDubaiPage() {
  return <div className={montserrat.variable}><CartagenaHotelExperience config={config} /></div>;
}
