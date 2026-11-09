import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import CartagenaHotelExperience from "../../../components/CartagenaHotelExperience";
import { cartagenaDubai } from "../../../data/cartagena";
import { alianzaBranding, alianzaProductMetadata, asesoras } from "../../asesoras";

export const dynamic = "force-static";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-cartagena",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const asesora = asesoras["monica-gonzalez"];

export const metadata: Metadata = alianzaProductMetadata(asesora, "cartagena-dubai");

export default function MonicaGonzalezCartagenaDubaiPage() {
  return <div className={montserrat.variable}><CartagenaHotelExperience config={cartagenaDubai} branding={alianzaBranding(asesora)} /></div>;
}
