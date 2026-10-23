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
    src: plazaAsset("galeria-hotel-cartagena-plaza-3.webp"),
    alt: "Vista del Hotel Cartagena Plaza y el paisaje de Bocagrande",
  },
  featurePhoto: {
    src: plazaAsset("services-piscina-panoramica-3.webp"),
    alt: "Piscina panorámica de Cartagena Plaza con vista al Caribe",
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
      image: "https://images.mirai.com/INFOROOMS/100379509/0HiBMLl2Tny8zCrMDPTx/0HiBMLl2Tny8zCrMDPTx_large.jpg",
    },
    {
      name: "Superior Vista Ciudad",
      eyebrow: "CARTAGENA DESDE ARRIBA",
      description: "Espacios modernos y luminosos con panorámica hacia la bahía, el centro o Bocagrande.",
      details: ["Vista ciudad", "2 camas dobles", "Sofá cama"],
      image: "https://images.mirai.com/INFOROOMS/100379509/dC1So4f9ZpASYcxE2cAC/dC1So4f9ZpASYcxE2cAC_large.jpg",
    },
    {
      name: "Superior Vista Mar",
      eyebrow: "DESPERTAR CARIBE",
      description: "Treinta metros cuadrados con vista al mar y una atmósfera creada para bajar el ritmo.",
      details: ["Vista al mar", "2 camas dobles", "30 m²"],
      image: "https://images.mirai.com/INFOROOMS/100379509/Ez8peklOcCygYAAPE4AH/Ez8peklOcCygYAAPE4AH_large.jpg",
    },
    {
      name: "Habitaciones Premium",
      eyebrow: "TEMÁTICAS Y TECNOLOGÍA",
      description: "Music, Woman, Tech y Executive Room agregan conceptos, tecnología y beneficios especiales.",
      details: ["Según categoría", "Plan premium", "Sujeto a suplemento"],
      image: "https://images.mirai.com/INFOROOMS/100379509/gUIYJSQ66g7yd02opxWt/gUIYJSQ66g7yd02opxWt_large.jpg",
    },
    {
      name: "Junior Suite",
      eyebrow: "DOS AMBIENTES",
      description: "Una categoría de 60 m² con espacios separados y vistas al Caribe y la ciudad amurallada.",
      details: ["60 m²", "Sala de estar", "Categoría premium"],
      image: "https://images.mirai.com/INFOROOMS/100379509/SdS514VC6qMdhibwa1Ft/SdS514VC6qMdhibwa1Ft_large.jpg",
    },
    {
      name: "Suite",
      eyebrow: "MÁS ESPACIO",
      description: "La categoría más amplia del hotel, con 90 m², dos habitaciones y zonas para compartir.",
      details: ["90 m²", "2 habitaciones", "Jacuzzi doble"],
      image: "https://images.mirai.com/INFOROOMS/100379509/VF1bBsjbuU0ltsxVg7lc/VF1bBsjbuU0ltsxVg7lc_large.jpg",
    },
  ],
  gallery: [
    { src: plazaAsset("galeria-hotel-cartagena-plaza-3.webp"), alt: "Cartagena Plaza en el paisaje de Bocagrande." },
    { src: plazaAsset("galeria-hotel-cartagena-plaza-48.webp"), alt: "Ambientes del hotel pensados para sentir el Caribe desde la llegada." },
    { src: plazaAsset("galeria-hotel-cartagena-plaza-66.webp"), alt: "Espacios sociales del Hotel Cartagena Plaza." },
    { src: plazaAsset("services-piscina-panoramica-3.webp"), alt: "Piscina panorámica en el piso 18 con vista al mar." },
    { src: plazaAsset("services-restaurante-3.webp"), alt: "Restaurante del hotel preparado para una experiencia gastronómica cómoda." },
    { src: plazaAsset("slide-gastronomia-home.webp"), alt: "Gastronomía con inspiración cartagenera e internacional." },
    { src: plazaAsset("gastronomia-3.webp"), alt: "Presentación gastronómica representativa de Cartagena Plaza." },
    { src: plazaAsset("ubicacion-12.webp"), alt: "El Caribe y Bocagrande alrededor del hotel." },
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
