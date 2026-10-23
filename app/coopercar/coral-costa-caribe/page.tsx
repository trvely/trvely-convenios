import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import CoralExperience from "./CoralExperience";

export const dynamic = "force-static";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-coral",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://convenios.trvely.com.co/coopercar/coral-costa-caribe/"),
  title: "Coral Costa Caribe 2027 · Trvely Convenios × Coopercar",
  description:
    "Cuatro salidas a Coral Costa Caribe en Juan Dolio. Plan de 4 noches por $3.600.000 por persona y separación desde $200.000.",
  openGraph: {
    title: "Coral Costa Caribe 2027 · Trvely × Coopercar",
    description: "Juan Dolio, todo incluido, cuatro salidas y una forma sencilla de pagar tu viaje.",
    type: "website",
    locale: "es_CO",
    images: [
      {
        url: "https://trvely.com.co/wp-content/uploads/2025/09/Coral-Costa-Caribe-150.webp",
        width: 1600,
        height: 1067,
        alt: "Playa del Coral Costa Caribe en Juan Dolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coral Costa Caribe 2027 · Trvely × Coopercar",
    description: "4 noches por $3.600.000 por persona. Separa con $200.000.",
    images: ["https://trvely.com.co/wp-content/uploads/2025/09/Coral-Costa-Caribe-150.webp"],
  },
};

export default function CoralCostaCaribePage() {
  return (
    <div className={montserrat.variable}>
      <CoralExperience />
    </div>
  );
}
