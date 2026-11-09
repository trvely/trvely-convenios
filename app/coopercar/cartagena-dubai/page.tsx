import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import CartagenaHotelExperience from "../../components/CartagenaHotelExperience";
import { cartagenaDubai as config } from "../../data/cartagena";

export const dynamic = "force-static";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-cartagena",
  weight: ["400", "500", "600", "700", "800", "900"],
});

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
