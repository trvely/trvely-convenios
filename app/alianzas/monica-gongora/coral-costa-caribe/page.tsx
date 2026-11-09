import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import CoralExperience from "../../../coopercar/coral-costa-caribe/CoralExperience";
import { alianzaBranding, alianzaProductMetadata, asesoras } from "../../asesoras";

export const dynamic = "force-static";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-coral",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const asesora = asesoras["monica-gongora"];

export const metadata: Metadata = alianzaProductMetadata(asesora, "coral-costa-caribe");

export default function MonicaGongoraCoralPage() {
  return (
    <div className={montserrat.variable}>
      <CoralExperience branding={alianzaBranding(asesora)} />
    </div>
  );
}
