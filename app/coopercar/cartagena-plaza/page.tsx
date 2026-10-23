import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import CartagenaHotelExperience, { type CartagenaHotelConfig } from "../../components/CartagenaHotelExperience";

export const dynamic = "force-static";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-cartagena",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const plazaAsset = (file: string) =>
  `https://static-resources-elementor.mirai.com/wp-content/uploads/sites/1942/${file}`;

const config: CartagenaHotelConfig = {
  id: "cartagena-plaza",
  name: "Hotel Cartagena Plaza",
  shortName: "Cartagena Plaza",
  location: "Bocagrande · frente al mar",
  heroTitle: "Cartagena con sabor,",
  heroAccent: "mar y altura.",
  heroDescription: "Tres noches en Bocagrande para combinar Caribe, gastronomía y ciudad. Vuelos, traslados, todo incluido y un tour a Playa Barú en una sola experiencia.",
  storyEyebrow: "HOTEL CARTAGENA PLAZA · BOCAGRANDE",
  storyTitle: "La ciudad a un lado. El Caribe al otro.",
  story: "Frente al mar y en el corazón de Bocagrande, Cartagena Plaza mezcla una ubicación privilegiada con ambientes llenos de sabor local. Desde la piscina panorámica del piso 18 hasta sus espacios gastronómicos, es un punto de partida cómodo para vivir la ciudad sin alejarte de la brisa.",
  storyNote: "El hotel ofrece planes y categorías diferentes. Tu paquete Coopercar conserva el alcance que aparezca en la cotización de Trvely; restaurantes premium, spa y servicios especiales no se presumen incluidos.",
  officialUrl: "https://www.hotelcartagenaplaza.co/",
  officialRoomsUrl: "https://www.hotelcartagenaplaza.co/habitaciones/",
  hero: {
    src: plazaAsset("galeria-hotel-cartagena-plaza-20.webp"),
    alt: "Piscina panorámica del Hotel Cartagena Plaza frente al mar Caribe",
  },
  featurePhoto: {
    src: plazaAsset("galeria-hotel-cartagena-plaza-57.webp"),
    alt: "Terraza del Hotel Cartagena Plaza con vista directa al mar Caribe",
  },
  highlights: [
    { title: "Piscina panorámica", detail: "En el piso 18, con vista al mar y espacios para descansar." },
    { title: "Sabores de Cartagena", detail: "Buffet, restaurantes y bares con alternativas locales e internacionales." },
    { title: "Hotel familiar", detail: "Recreación y Kids Club; edades y ocupación siempre se validan." },
    { title: "Frente al mar", detail: "Ubicación en Bocagrande, cerca de la playa y de la vida de la ciudad." },
  ],
  rooms: [
    {
      name: "Estándar",
      eyebrow: "CONFORT ESENCIAL",
      description: "Una habitación amplia de 30 m² para descansar después de recorrer Cartagena.",
      details: ["2 camas dobles", "Sofá cama", "30 m²"],
      image: plazaAsset("habitacion-estandar-hotel-cartagena-plaza.webp"),
    },
    {
      name: "Superior Vista Ciudad",
      eyebrow: "CARTAGENA DESDE ARRIBA",
      description: "Espacios modernos y luminosos con panorámica hacia la bahía, el centro o Bocagrande.",
      details: ["Vista ciudad", "2 camas dobles", "Sofá cama"],
      image: plazaAsset("habitacion-superior-vista-ciudad-cartagena-plaza.webp"),
    },
    {
      name: "Superior Vista Mar",
      eyebrow: "DESPERTAR CARIBE",
      description: "Treinta metros cuadrados con vista al mar y una atmósfera creada para bajar el ritmo.",
      details: ["Vista al mar", "2 camas dobles", "30 m²"],
      image: plazaAsset("habitacion-superior-vista-mar-cartagena-plaza.webp"),
    },
    {
      name: "Habitaciones Premium",
      eyebrow: "TEMÁTICAS Y TECNOLOGÍA",
      description: "Music, Woman, Tech y Executive Room agregan conceptos, tecnología y beneficios especiales.",
      details: ["Según categoría", "Plan premium", "Sujeto a suplemento"],
      image: plazaAsset("habitaciones-music.webp"),
    },
    {
      name: "Junior Suite",
      eyebrow: "DOS AMBIENTES",
      description: "Una categoría de 60 m² con espacios separados y vistas al Caribe y la ciudad amurallada.",
      details: ["60 m²", "Sala de estar", "Categoría premium"],
      image: plazaAsset("habitacion-junior-suite-cartagena-plaza.webp"),
    },
    {
      name: "Suite",
      eyebrow: "MÁS ESPACIO",
      description: "La categoría más amplia del hotel, con 90 m², dos habitaciones y zonas para compartir.",
      details: ["90 m²", "2 habitaciones", "Jacuzzi doble"],
      image: plazaAsset("habitaciones-suite-1.webp"),
    },
  ],
  gallery: [
    { src: plazaAsset("galeria-hotel-cartagena-plaza-20.webp"), alt: "Piscina panorámica del Hotel Cartagena Plaza frente al Caribe." },
    { src: plazaAsset("galeria-hotel-cartagena-plaza-57.webp"), alt: "Terraza frente al mar del Hotel Cartagena Plaza." },
    { src: plazaAsset("galeria-hotel-cartagena-plaza-21.webp"), alt: "Piscina y pérgolas del Hotel Cartagena Plaza." },
    { src: plazaAsset("habitacion-superior-vista-mar-cartagena-plaza.webp"), alt: "Habitación Superior Vista Mar del Hotel Cartagena Plaza." },
    { src: plazaAsset("habitacion-junior-suite-cartagena-plaza.webp"), alt: "Junior Suite amplia y luminosa del Hotel Cartagena Plaza." },
    { src: plazaAsset("galeria-hotel-cartagena-plaza-22-scaled.webp"), alt: "Terraza panorámica al atardecer sobre Bocagrande." },
    { src: plazaAsset("galeria-hotel-cartagena-plaza-53.webp"), alt: "Mesa del restaurante con vista al mar." },
    { src: plazaAsset("galeria-hotel-cartagena-plaza-43.webp"), alt: "Acceso principal del Hotel Cartagena Plaza." },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://convenios.trvely.com.co/coopercar/cartagena-plaza/"),
  title: "Cartagena Plaza · Convenio Coopercar | Trvely",
  description: "Tres noches en Cartagena Plaza desde $1.499.999 por persona con vuelos desde Bogotá, traslados, todo incluido y tour a Playa Barú.",
  openGraph: {
    title: "Cartagena Plaza · Trvely Convenios × Coopercar",
    description: "Bocagrande, tres noches, vuelos desde Bogotá, todo incluido y tour a Playa Barú.",
    type: "website",
    locale: "es_CO",
    images: [{ url: config.hero.src, width: 1600, height: 1000, alt: config.hero.alt }],
  },
};

export default function CartagenaPlazaPage() {
  return <div className={montserrat.variable}><CartagenaHotelExperience config={config} /></div>;
}
