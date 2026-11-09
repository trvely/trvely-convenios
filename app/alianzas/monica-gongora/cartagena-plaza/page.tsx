import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import CartagenaHotelExperience from "../../../components/CartagenaHotelExperience";
import { cartagenaPlaza } from "../../../data/cartagena";
import { alianzaBranding, alianzaProductMetadata, asesoras } from "../../asesoras";

export const dynamic = "force-static";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-cartagena",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const asesora = asesoras["monica-gongora"];

export const metadata: Metadata = alianzaProductMetadata(asesora, "cartagena-plaza");

export default function MonicaGongoraCartagenaPlazaPage() {
  return <div className={montserrat.variable}><CartagenaHotelExperience config={cartagenaPlaza} branding={alianzaBranding(asesora)} /></div>;
}
