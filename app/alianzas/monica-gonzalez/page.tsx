import type { Metadata } from "next";
import AlianzaExperience from "../AlianzaExperience";
import { alianzaMetadata, asesoras } from "../asesoras";

export const dynamic = "force-static";

const asesora = asesoras["monica-gonzalez"];

export const metadata: Metadata = alianzaMetadata(asesora);

export default function AlianzaPage() {
  return <AlianzaExperience asesora={asesora} />;
}
