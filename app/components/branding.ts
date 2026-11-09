// Marca y contacto que muestran las páginas de producto (Coral Costa Caribe y Cartagena).
// Por defecto es el convenio Coopercar; cada página de convenios empresariales pasa el de su comercial
// (ver alianzaBranding en app/alianzas/asesoras.ts).

export type ConvenioBranding = {
  /** Raíz del convenio: «/coopercar/» o «/alianzas/<contacto>/». El menú de hoteles cuelga de aquí. */
  basePath: string;
  /** Texto accesible del logo que vuelve a la raíz del convenio. */
  homeAria: string;
  /** Texto junto al logo de Trvely, en el encabezado y en el pie. */
  lockup: string;
  /** Etiqueta del convenio en titulares, formulario y botón flotante. */
  label: string;
  /** Prefijo del titular de Coral Costa Caribe. */
  kicker: string;
  /** Encabezado del menú «Convenios hoteleros». */
  switcherHeading: string;
  /** Nombre del convenio dentro del mensaje de WhatsApp: «Me interesa el convenio {program} para…». */
  program: string;
  /** Reemplaza «{paquete}» en las notas de hotel: «Tu paquete {paquete} conserva…». */
  packageLabel: string;
  /** Número de WhatsApp sin signos. */
  whatsapp: string;
  /** Primera frase del mensaje de WhatsApp. */
  greeting: string;
  /** A quién se dirigen los botones: «Trvely» o el nombre de la comercial. */
  contactName: string;
  /** Línea de atención bajo el botón de cierre. */
  contactLine: string;
  /** Destino del botón del plan bajo solicitud: «al comercial» o «a Diana». */
  requestTo: string;
  /** Inicio de la petición del plan de 3 noches en el mensaje de WhatsApp. */
  requestPhrase: string;
};

export const coopercarBranding: ConvenioBranding = {
  basePath: "/coopercar/",
  homeAria: "Volver al convenio Coopercar de Trvely",
  lockup: "COOPERCAR",
  label: "CONVENIO COOPERCAR",
  kicker: "COOPERCAR",
  switcherHeading: "COOPERCAR · PRODUCTOS DISPONIBLES",
  program: "Coopercar",
  packageLabel: "Coopercar",
  whatsapp: "573233916413",
  greeting: "Hola, equipo Trvely.",
  contactName: "Trvely",
  contactLine: "Atención Trvely · +57 323 391 6413",
  requestTo: "al comercial",
  requestPhrase: "Quiero solicitar al comercial encargado de la alianza",
};
