import type { CartagenaHotelConfig } from "../components/CartagenaHotelExperience";

// Los dos productos de Cartagena. Los comparten el convenio Coopercar y los convenios empresariales.
// «{paquete}» en storyNote se reemplaza por el nombre del convenio de cada página (ConvenioBranding.packageLabel).

const plazaAsset = (file: string) =>
  `https://static-resources-elementor.mirai.com/wp-content/uploads/sites/1942/${file}`;

export const cartagenaPlaza: CartagenaHotelConfig = {
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
  storyNote: "El hotel ofrece planes y categorías diferentes. Tu paquete {paquete} conserva el alcance que aparezca en la cotización de Trvely; restaurantes premium, spa y servicios especiales no se presumen incluidos.",
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

const assetVersions: Record<string, string> = {
  "002": "1781510491",
  "006": "1781510494",
  "012": "1781510497",
  "013": "1781510498",
  "016": "1781510500",
  "017": "1781510501",
  "022": "1781510505",
  "042": "1781510517",
  "058": "1781510527",
};

const dubaiAsset = (number: string) =>
  `https://res.cloudinary.com/trvely/image/upload/v${assetVersions[number]}/trvely/hoteles/cartagena/cartagena-dubai/imagenes/cartagena-dubai_${number}.jpg`;

const dubaiOfficialAsset = (file: string) =>
  `https://irp.cdn-website.com/b8e59e8d/dms3rep/multi/opt/${file}`;

const dubaiRoomAsset = (file: string) =>
  `https://media.omnibees.com/Images/17253/RoomTypes/640x426/${file}/`;

export const cartagenaDubai: CartagenaHotelConfig = {
  id: "cartagena-dubai",
  name: "Hotel Cartagena Dubai",
  shortName: "Cartagena Dubai",
  location: "Bocagrande · Cartagena de Indias",
  heroTitle: "Cartagena sube,",
  heroAccent: "el horizonte se abre.",
  heroDescription: "Tres noches frente al Caribe en una torre inspirada en el mundo árabe. Vuelos, traslados, todo incluido y tour a Playa Barú reunidos en un mismo plan.",
  storyEyebrow: "HOTEL CARTAGENA DUBAI · BOCAGRANDE",
  storyTitle: "Altura, mar y una Cartagena diferente.",
  story: "Cartagena Dubai se eleva en Bocagrande con una propuesta temática inspirada en la arquitectura árabe. Sus 30 pisos, las vistas hacia el mar y la ciudad, la piscina y los espacios en altura convierten el hotel en una experiencia visual desde que llegas.",
  storyNote: "El hotel cuenta con varias categorías y capacidades. Trvely trabaja con Estándar, Superior, Junior Suite y Master Suite, pero la categoría incluida será únicamente la que figure en la cotización final.",
  officialUrl: "https://www.cartagenadubai.com/",
  officialRoomsUrl: "https://www.cartagenadubai.com/habitaciones",
  hero: {
    src: dubaiOfficialAsset("DUBAI-CARTAGENA-2-2304w.jpg"),
    alt: "Hotel Cartagena Dubai destacado en la línea costera de Bocagrande frente al Caribe",
  },
  featurePhoto: {
    src: dubaiOfficialAsset("DUBAI-CARTAGENA-4-2304w.jpg"),
    alt: "Piscina y fachada dorada del Hotel Cartagena Dubai vistas desde el aire",
  },
  highlights: [
    { title: "30 pisos", detail: "Una torre vertical con ambientes y perspectivas diferentes de Cartagena." },
    { title: "Vistas en altura", detail: "Terraza panorámica, mirador y puente de cristal según operación del hotel." },
    { title: "Piscina", detail: "Zona para refrescarse y disfrutar el paisaje de Bocagrande." },
    { title: "Ubicación", detail: "Frente al mar y a aproximadamente 15 minutos del aeropuerto, según el hotel." },
  ],
  rooms: [
    {
      name: "Estándar",
      eyebrow: "BASE COMERCIAL TRVELY",
      description: "La categoría de entrada al hotel, con alternativas de vista a la ciudad y espacios funcionales.",
      details: ["Vista ciudad", "Wi-Fi", "Aire acondicionado"],
      image: dubaiOfficialAsset("DUBAI-CARTAGENA-47-65661f51-2880w.jpg"),
    },
    {
      name: "Superior",
      eyebrow: "VISTA AL MAR",
      description: "Una alternativa para quienes quieren que el Caribe sea parte del descanso y del despertar.",
      details: ["Vista al mar", "Según ocupación", "Sujeta a suplemento"],
      image: dubaiAsset("013"),
    },
    {
      name: "Junior Suite",
      eyebrow: "MÁS AMPLITUD",
      description: "Una categoría superior con vista al mar y mayor capacidad, ideal para compartir la experiencia.",
      details: ["Vista al mar", "Capacidad por validar", "Categoría superior"],
      image: dubaiAsset("022"),
    },
    {
      name: "Master Suite",
      eyebrow: "PARA GRUPOS",
      description: "La opción más amplia del inventario comercial, pensada para grupos y sujeta a capacidad confirmada.",
      details: ["Vista al mar", "Hasta 6 según hotel", "Sujeta a suplemento"],
      image: dubaiRoomAsset("1085383.jpg"),
    },
  ],
  gallery: [
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-2-2304w.jpg"), alt: "El hotel destaca en la línea costera de Bocagrande." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-36-2304w.jpg"), alt: "Vista aérea nocturna del Hotel Cartagena Dubai en Bocagrande." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-4-2304w.jpg"), alt: "Vista aérea de la piscina junto a la fachada dorada del hotel." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-52-2304w.jpg"), alt: "Piscina iluminada del hotel con vista a la costa de Cartagena." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-16-2304w.jpg"), alt: "Terraza en altura con panorámica nocturna de Cartagena." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-5-2304w.jpg"), alt: "Lobby luminoso del Hotel Cartagena Dubai." },
    { src: dubaiOfficialAsset("DUBAI-CARTAGENA-47-65661f51-2880w.jpg"), alt: "Habitación luminosa con vista desde el Hotel Cartagena Dubai." },
    { src: dubaiAsset("013"), alt: "Habitación representativa del Hotel Cartagena Dubai." },
  ],
};
