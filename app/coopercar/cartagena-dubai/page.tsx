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

const dubaiOfficialAsset = (file: string) =>
  `https://irp.cdn-website.com/b8e59e8d/dms3rep/multi/opt/${file}`;

const dubaiRoomAsset = (file: string) =>
  `https://media.omnibees.com/Images/17253/RoomTypes/640x426/${file}/`;

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
    src: dubaiOfficialAsset("DUBAI-CARTAGENA-2-2304w.jpg"),
    alt: "Hotel Cartagena Dubai destacado en la línea costera de Bocagrande frente al Caribe",
  },
  featurePhoto: {
    src: dubaiOfficialAsset("DUBAI-CARTAGENA-4-2304w.jpg"),
    alt: "Piscina y fachada dorada del Hotel Cartagena Dubai vistas desde el aire",
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
      image: dubaiOfficialAsset("DUBAI-CARTAGENA-47-65661f51-2880w.jpg"),
    },
    {
      name: "Superior",
      eyebrow: "VISTA AL MAR",
      description: "Una alternativa para quienes quieren que el Caribe sea parte del descanso y del despertar.",
      details: ["Vista al mar", "Según ocupación", "Sujeta a suplemento"],
      image: dubaiAsset("013"),
    },
    {
      name: "Junior Suite",
      eyebrow: "MÁS AMPLITUD",
      description: "Una categoría superior con vista al mar y mayor capacidad, ideal para compartir la experiencia.",
      details: ["Vista al mar", "Capacidad por validar", "Categoría superior"],
      image: dubaiAsset("022"),
    },
    {
      name: "Master Suite",
      eyebrow: "PARA GRUPOS",
      description: "La opción más amplia del inventario comercial, pensada para grupos y sujeta a capacidad confirmada.",
      details: ["Vista al mar", "Hasta 6 según hotel", "Sujeta a suplemento"],
      image: dubaiRoomAsset("1085383.jpg"),
    },
  ],
  gallery: [
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-2-2304w.jpg"), alt: "El hotel destaca en la línea costera de Bocagrande." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-36-2304w.jpg"), alt: "Vista aérea nocturna del Hotel Cartagena Dubai en Bocagrande." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-4-2304w.jpg"), alt: "Vista aérea de la piscina junto a la fachada dorada del hotel." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-52-2304w.jpg"), alt: "Piscina iluminada del hotel con vista a la costa de Cartagena." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-16-2304w.jpg"), alt: "Terraza en altura con panorámica nocturna de Cartagena." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-5-2304w.jpg"), alt: "Lobby luminoso del Hotel Cartagena Dubai." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-47-65661f51-2880w.jpg"), alt: "Habitación luminosa con vista desde el Hotel Cartagena Dubai." },
    { src: dubaiAsset("013"), alt: "Habitación representativa del Hotel Cartagena Dubai." },
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
