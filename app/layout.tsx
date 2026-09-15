import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700"] });
const body = Manrope({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Trvely Convenios · Coopercar | Caribe 2027",
  description: "Beneficio exclusivo Coopercar: 100 cupos para viajar a resorts Catalonia en República Dominicana durante 2027.",
  icons: { icon: "/brand/trvely.png" },
  openGraph: {
    title: "Caribe 2027 · Trvely Convenios × Coopercar",
    description: "100 cupos, cuatro resorts Catalonia y una cuota inicial de $200.000 por persona.",
    type: "website",
    locale: "es_CO",
    images: [{ url: "/og-real.jpg", width: 1920, height: 1125, alt: "Triana acompaña a los viajeros de Trvely" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caribe 2027 · Trvely Convenios × Coopercar",
    description: "100 cupos para asociados Coopercar. Separa con $200.000 por persona.",
    images: ["/og-real.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>;
}
