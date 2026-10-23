"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

export const dynamic = "force-static";

const hotelRooms = {
  bayahibe: [
    { id: "comfort", name: "Comfort", rates: { oct: { PUJ: 4974990, SDQ: 4655990 }, novDic: { PUJ: 5571990, SDQ: 5247990 } } },
    { id: "premium", name: "Premium", rates: { oct: { PUJ: 5335990, SDQ: 5011990 }, novDic: { PUJ: 5937990, SDQ: 5613990 } } },
    { id: "privileged-deluxe", name: "Privileged Deluxe", rates: { oct: { PUJ: 5516990, SDQ: 5192990 }, novDic: { PUJ: 6119990, SDQ: 5795990 } } },
    { id: "privileged-family-deluxe", name: "Privileged Family Deluxe", rates: { oct: { PUJ: 5606990, SDQ: 5282990 }, novDic: { PUJ: 6211990, SDQ: 5887990 } } },
    { id: "privileged-romance-deluxe", name: "Privileged Romance Deluxe", rates: { oct: { PUJ: 5696990, SDQ: 5372990 }, novDic: { PUJ: 6302990, SDQ: 5978990 } } },
  ],
  "royal-la-romana": [
    { id: "superior", name: "Superior", rates: { oct: { PUJ: 5281990, SDQ: 4956990 }, novDic: { PUJ: 5781990, SDQ: 5457990 } } },
    { id: "superior-junior-suite", name: "Superior Junior Suite", rates: { oct: { PUJ: 5508990, SDQ: 5184990 }, novDic: { PUJ: 5999990, SDQ: 5675990 } } },
    { id: "deluxe-junior-suite", name: "Deluxe Junior Suite", rates: { oct: { PUJ: 5659990, SDQ: 5335990 }, novDic: { PUJ: 6145990, SDQ: 5821990 } } },
    { id: "romance-deluxe", name: "Romance Deluxe", rates: { oct: { PUJ: 5735990, SDQ: 5411990 }, novDic: { PUJ: 6217990, SDQ: 5893990 } } },
    { id: "superior-swim-up", name: "Superior Swim Up", rates: { oct: { PUJ: 5962990, SDQ: 5638990 }, novDic: { PUJ: 6435990, SDQ: 6111990 } } },
    { id: "superior-junior-suite-swim-up", name: "Superior Junior Suite Swim Up", rates: { oct: { PUJ: 6038990, SDQ: 5714990 }, novDic: { PUJ: 6508990, SDQ: 6184990 } } },
    { id: "romance-deluxe-swim-up", name: "Romance Deluxe Swim Up", rates: { oct: { PUJ: 6114990, SDQ: 5790990 }, novDic: { PUJ: 6581990, SDQ: 6256990 } } },
    { id: "duplex-suite-pool", name: "Duplex Suite & Swimming Pool", rates: { oct: { PUJ: 6190990, SDQ: 5866990 }, novDic: { PUJ: 6653990, SDQ: 6329990 } } },
  ],
  bavaro: [
    { id: "junior-suite", name: "Junior Suite", rates: { oct: { PUJ: 3863990, SDQ: 3638990 }, novDic: { PUJ: 4040990, SDQ: 3815990 } } },
    { id: "premium-junior-suite", name: "Premium Junior Suite", rates: { oct: { PUJ: 3944990, SDQ: 3720990 }, novDic: { PUJ: 4119990, SDQ: 3894990 } } },
    { id: "privileged-deluxe-junior-suite", name: "Privileged Deluxe Junior Suite", rates: { oct: { PUJ: 4037990, SDQ: 3812990 }, novDic: { PUJ: 4209990, SDQ: 3984990 } } },
    { id: "privileged-romance-deluxe-junior-suite", name: "Privileged Romance Deluxe Junior Suite", rates: { oct: { PUJ: 4153990, SDQ: 3928990 }, novDic: { PUJ: 4321990, SDQ: 4096990 } } },
    { id: "privileged-family-deluxe-junior-suite", name: "Privileged Family Deluxe Junior Suite", rates: { oct: { PUJ: 4211990, SDQ: 3986990 }, novDic: { PUJ: 4377990, SDQ: 4153990 } } },
  ],
  "royal-bavaro": [
    { id: "junior-suite-superior", name: "Junior Suite Superior", rates: { oct: { PUJ: 4029990, SDQ: 3805990 }, novDic: { PUJ: 4359990, SDQ: 4135990 } } },
    { id: "premium-junior-suite", name: "Premium Junior Suite", rates: { oct: { PUJ: 4126990, SDQ: 3902990 }, novDic: { PUJ: 4461990, SDQ: 4237990 } } },
    { id: "privileged-deluxe-junior-suite", name: "Privileged Deluxe Junior Suite", rates: { oct: { PUJ: 4223990, SDQ: 3999990 }, novDic: { PUJ: 4563990, SDQ: 4339990 } } },
    { id: "privileged-romance-deluxe-junior-suite", name: "Privileged Romance Deluxe Junior Suite", rates: { oct: { PUJ: 4368990, SDQ: 4144990 }, novDic: { PUJ: 4724990, SDQ: 4492990 } } },
    { id: "privileged-deluxe-pool", name: "Privileged Deluxe & Swimming Pool", rates: { oct: { PUJ: 4829990, SDQ: 4580990 }, novDic: { PUJ: 5275990, SDQ: 5006990 } } },
    { id: "privileged-duplex-suite-pool", name: "Privileged Duplex Suite & Swimming Pool", rates: { oct: { PUJ: 5643990, SDQ: 5374990 }, novDic: { PUJ: 6132990, SDQ: 5863990 } } },
  ],
} as const;

type RoomGuidance = {
  occupancy: string;
  benefits: string;
  caution: string;
};

const roomGuidance: Record<string, Record<string, RoomGuidance>> = {
  bayahibe: {
    comfort: { occupancy: "Hasta 2 adultos + 2 niños o 3 adultos + 1 niño.", benefits: "Categoría de entrada, sin beneficios Privileged.", caution: "La tarifa publicada es para acomodación doble; niños y otras composiciones se cotizan por separado." },
    premium: { occupancy: "Hasta 2 adultos + 2 niños o 3 adultos + 1 niño.", benefits: "No incluye beneficios Privileged.", caution: "La tarifa publicada es para acomodación doble; niños y otras composiciones se cotizan por separado." },
    "privileged-deluxe": { occupancy: "Hasta 2 adultos + 2 niños o 3 adultos + 1 niño.", benefits: "Sí incluye beneficios Privileged.", caution: "Los beneficios dependen de la categoría reservada y de la disponibilidad de cada servicio." },
    "privileged-family-deluxe": { occupancy: "Puede alojar hasta 6 personas, según la composición autorizada.", benefits: "Habitación familiar con beneficios Privileged.", caution: "La composición exacta y la disponibilidad deben ser confirmadas por Trvely antes de reservar." },
    "privileged-romance-deluxe": { occupancy: "Exclusiva para 2 adultos.", benefits: "Incluye Privileged y piscina privada; los extras Romance exigen mínimo 4 noches.", caution: "No es una habitación para niños ni para grupos de más de dos personas." },
  },
  "royal-la-romana": {
    superior: { occupancy: "Hasta 3 adultos; todos deben tener 18 años cumplidos.", benefits: "Los servicios propios del Royal aplican a sus huéspedes.", caution: "La tarifa publicada es doble; la acomodación triple requiere cotización personalizada." },
    "superior-junior-suite": { occupancy: "Hasta 3 adultos; todos deben tener 18 años cumplidos.", benefits: "Más espacio dentro del hotel solo adultos.", caution: "La tarifa publicada es doble; la acomodación triple requiere cotización personalizada." },
    "deluxe-junior-suite": { occupancy: "Hasta 3 adultos; todos deben tener 18 años cumplidos.", benefits: "Categoría Deluxe dentro del Royal.", caution: "La tarifa publicada es doble; la acomodación triple requiere cotización personalizada." },
    "romance-deluxe": { occupancy: "Exclusiva para 2 adultos.", benefits: "Los extras Romance exigen mínimo 4 noches.", caution: "No admite una tercera persona y deben informarse los datos de llegada al reservar." },
    "superior-swim-up": { occupancy: "Exclusiva para 2 adultos.", benefits: "Acceso directo desde la terraza a una piscina compartida.", caution: "Swim Up no significa piscina privada." },
    "superior-junior-suite-swim-up": { occupancy: "Hasta 3 adultos.", benefits: "Acceso directo desde la terraza a una piscina compartida.", caution: "Swim Up no significa piscina privada; la triple se cotiza con un asesor." },
    "romance-deluxe-swim-up": { occupancy: "Exclusiva para 2 adultos.", benefits: "Acceso a piscina compartida y extras Romance con mínimo 4 noches.", caution: "Swim Up no significa piscina privada." },
    "duplex-suite-pool": { occupancy: "Configuración base para 2 adultos.", benefits: "Suite dúplex con piscina privada.", caution: "Cualquier ocupación adicional debe confirmarse antes de ofrecerla." },
  },
  bavaro: {
    "junior-suite": { occupancy: "Hasta 2 adultos + 2 niños o 3 adultos + 1 niño.", benefits: "Categoría de entrada, sin beneficios Privileged.", caution: "La tarifa publicada es doble; edades y composición se confirman al cotizar." },
    "premium-junior-suite": { occupancy: "Hasta 2 adultos + 2 niños o 3 adultos + 1 niño.", benefits: "No incluye beneficios Privileged.", caution: "La tarifa publicada es doble; edades y composición se confirman al cotizar." },
    "privileged-deluxe-junior-suite": { occupancy: "Hasta 2 adultos + 2 niños o 3 adultos + 1 niño.", benefits: "Sí incluye beneficios Privileged.", caution: "Los espacios exclusivos dependen de la categoría y no se extienden automáticamente a otras reservas." },
    "privileged-romance-deluxe-junior-suite": { occupancy: "Exclusiva para 2 adultos.", benefits: "Incluye Privileged; los extras Romance exigen mínimo 4 noches.", caution: "No es una habitación para niños ni para grupos de más de dos personas." },
    "privileged-family-deluxe-junior-suite": { occupancy: "Puede alojar hasta 6 personas, según la composición autorizada.", benefits: "Habitación familiar con beneficios Privileged.", caution: "Su disponibilidad es limitada; Trvely debe validar la composición exacta antes de reservar." },
  },
  "royal-bavaro": {
    "junior-suite-superior": { occupancy: "De 2 a 3 adultos; todos deben tener 18 años cumplidos.", benefits: "Categoría de entrada, sin beneficios Privileged.", caution: "La tarifa publicada es doble; la acomodación triple requiere cotización personalizada." },
    "premium-junior-suite": { occupancy: "De 2 a 3 adultos; todos deben tener 18 años cumplidos.", benefits: "No incluye beneficios Privileged.", caution: "La tarifa publicada es doble; la acomodación triple requiere cotización personalizada." },
    "privileged-deluxe-junior-suite": { occupancy: "De 2 a 3 adultos.", benefits: "Sí incluye beneficios Privileged.", caution: "La acomodación triple y las solicitudes especiales se confirman antes de reservar." },
    "privileged-romance-deluxe-junior-suite": { occupancy: "Exclusiva para 2 adultos.", benefits: "Incluye Privileged; los extras Romance exigen mínimo 4 noches.", caution: "No admite una tercera persona." },
    "privileged-deluxe-pool": { occupancy: "De 2 a 3 adultos.", benefits: "Incluye Privileged y piscina privada con acceso desde la terraza.", caution: "La acomodación triple debe ser confirmada por Trvely." },
    "privileged-duplex-suite-pool": { occupancy: "De 2 a 3 adultos.", benefits: "Dos plantas, jardín y piscina infinita privada; incluye Privileged.", caution: "La composición y la disponibilidad se confirman antes de reservar." },
  },
};

const hotels = [
  {
    id: "bayahibe",
    name: "Catalonia Bayahibe",
    place: "Bayahíbe · La Romana",
    audience: "Familiar",
    adultsOnly: false,
    familyAlternativeId: "bayahibe",
    fitTitle: "Sí admite familias con niños",
    fitText: "Para la ocupación hotelera, de 0 a 12 años es categoría niño y desde los 13 se tarifa como adulto. Los menores de 18 sí pueden hospedarse acompañados.",
    accessRule: "Hospedarse aquí no incluye acceso al Royal La Romana.",
    lead: "Mar tranquilo, jardines tropicales y días que se sienten largos.",
    copy: "Una elección luminosa para viajar en familia o con amigos: resort todo incluido frente al Caribe, gran piscina y ambiente tropical.",
    image: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/full/catalonia-bayahibe_001.jpg",
    imageAlt: "Playa y palmeras del Catalonia Bayahibe",
    gallery: [
      { src: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/full/catalonia-bayahibe_003.jpg", alt: "Playa turquesa vista desde el aire en Catalonia Bayahibe" },
      { src: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/full/catalonia-bayahibe_013.jpg", alt: "Habitación renovada con vista al jardín en Catalonia Bayahibe" },
      { src: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/full/catalonia-bayahibe_007.jpg", alt: "Piscina principal vista desde el aire en Catalonia Bayahibe" },
      { src: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/full/catalonia-bayahibe_018.jpg", alt: "Restaurante con vegetación y luz natural en Catalonia Bayahibe" },
      { src: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/full/catalonia-bayahibe_019.jpg", alt: "Desayuno servido frente al mar en Catalonia Bayahibe" },
    ],
    rooms: hotelRooms.bayahibe,
    zone: "Bayahíbe",
    detail: "Familias · playa · descanso",
  },
  {
    id: "royal-la-romana",
    name: "Catalonia Royal La Romana",
    place: "Bayahíbe · La Romana",
    audience: "Solo adultos +18",
    adultsOnly: true,
    familyAlternativeId: "bayahibe",
    fitTitle: "Solo huéspedes de 18 años cumplidos",
    fitText: "No admite menores de edad, sin excepciones. La alternativa familiar del mismo complejo es Catalonia Bayahibe.",
    accessRule: "Sus huéspedes sí pueden usar instalaciones de Catalonia Bayahibe; el acceso no funciona al contrario.",
    lead: "Una escala más íntima del Caribe, pensada para dos.",
    copy: "211 habitaciones, área de playa exclusiva y acceso a las instalaciones del Catalonia Bayahibe de al lado.",
    image: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-royal-la-romana/full/catalonia-royal-la-romana_050.jpg",
    imageAlt: "Playa del Catalonia Royal La Romana",
    gallery: [
      { src: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-royal-la-romana/full/catalonia-royal-la-romana_050.jpg", alt: "Playa del Catalonia Royal La Romana" },
      { src: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-royal-la-romana/full/catalonia-royal-la-romana_026.jpg", alt: "Habitación luminosa del Catalonia Royal La Romana" },
      { src: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-royal-la-romana/full/catalonia-royal-la-romana_032.jpg", alt: "Uno de los espacios interiores del Catalonia Royal La Romana" },
      { src: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-royal-la-romana/full/catalonia-royal-la-romana_021.jpg", alt: "Jardines y edificios del Catalonia Royal La Romana" },
      { src: "https://media.trvely.com.co/hoteles/bayahibe/catalonia-royal-la-romana/full/catalonia-royal-la-romana_049.jpg", alt: "Piscina y edificios del Catalonia Royal La Romana" },
    ],
    rooms: hotelRooms["royal-la-romana"],
    zone: "Bayahíbe",
    detail: "Parejas · calma · playa exclusiva",
  },
  {
    id: "bavaro",
    name: "Catalonia Bávaro Resort",
    place: "Cabeza de Toro · Punta Cana",
    audience: "Familiar",
    adultsOnly: false,
    familyAlternativeId: "bavaro",
    fitTitle: "Sí admite familias con niños",
    fitText: "Para la ocupación hotelera, de 0 a 12 años es categoría niño y desde los 13 se tarifa como adulto. Los menores de 18 sí pueden hospedarse acompañados.",
    accessRule: "Hospedarse aquí no incluye acceso al Royal Bávaro.",
    lead: "Un gran resort para que cada persona encuentre su propio plan.",
    copy: "682 suites en villas alrededor de un lago, playa de arena blanca, entretenimiento, casino y opciones para toda la familia.",
    image: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-bavaro-beach/full/catalonia-bavaro-beach_044.jpg",
    imageAlt: "Playa y palmeras del Catalonia Bávaro Resort",
    gallery: [
      { src: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-bavaro-beach/full/catalonia-bavaro-beach_044.jpg", alt: "Playa y palmeras del Catalonia Bávaro Resort" },
      { src: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-bavaro-beach/full/catalonia-bavaro-beach_020.jpg", alt: "Habitación del Catalonia Bávaro Resort" },
      { src: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-bavaro-beach/full/catalonia-bavaro-beach_035.jpg", alt: "Área de piscina preparada para disfrutar en Catalonia Bávaro Resort" },
      { src: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-bavaro-beach/full/catalonia-bavaro-beach_059.jpg", alt: "Catalonia Bávaro Resort visto desde el aire" },
      { src: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-bavaro-beach/full/catalonia-bavaro-beach_046.jpg", alt: "Huéspedes disfrutando la playa del Catalonia Bávaro Resort" },
    ],
    rooms: hotelRooms.bavaro,
    zone: "Punta Cana",
    detail: "Familias · actividades · gran resort",
  },
  {
    id: "royal-bavaro",
    name: "Catalonia Royal Bávaro",
    place: "Cabeza de Toro · Punta Cana",
    audience: "Solo adultos +18",
    adultsOnly: true,
    familyAlternativeId: "bavaro",
    fitTitle: "Solo huéspedes de 18 años cumplidos",
    fitText: "No admite menores de edad, sin excepciones. La alternativa familiar del mismo complejo es Catalonia Bávaro Resort.",
    accessRule: "Sus huéspedes sí pueden usar instalaciones de Catalonia Bávaro; el acceso no funciona al contrario.",
    lead: "Suites, silencio y una atmósfera hecha para desconectarse.",
    copy: "Resort cinco estrellas con 284 suites, acceso directo a la playa y entrada a las instalaciones del Catalonia Bávaro de al lado.",
    image: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-royal-bavaro/full/catalonia-royal-bavaro_034.jpg",
    imageAlt: "Piscina y palmeras del Catalonia Royal Bávaro",
    gallery: [
      { src: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-royal-bavaro/full/catalonia-royal-bavaro_021.jpg", alt: "Playa privada con camas y sombrillas en Catalonia Royal Bávaro" },
      { src: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-royal-bavaro/full/catalonia-royal-bavaro_043.jpg", alt: "Piscina del Catalonia Royal Bávaro" },
      { src: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-royal-bavaro/full/catalonia-royal-bavaro_033.jpg", alt: "Suite con cama King y mobiliario colonial en Catalonia Royal Bávaro" },
      { src: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-royal-bavaro/full/catalonia-royal-bavaro_015.jpg", alt: "Salón de doble altura de una suite en Catalonia Royal Bávaro" },
      { src: "https://media.trvely.com.co/hoteles/punta-cana/catalonia-royal-bavaro/full/catalonia-royal-bavaro_035.jpg", alt: "Baño con bañera exenta en Catalonia Royal Bávaro" },
    ],
    rooms: hotelRooms["royal-bavaro"],
    zone: "Punta Cana",
    detail: "Parejas · suites · sofisticación",
  },
] as const;

const travelDates = [
  { id: "oct-21", rateBand: "oct", day: "21", month: "OCT", range: "21 — 25 octubre", long: "21 al 25 de octubre de 2027", deadline: "21 de septiembre de 2027", deadlineISO: "2027-09-21" },
  { id: "nov-18", rateBand: "novDic", day: "18", month: "NOV", range: "18 — 22 noviembre", long: "18 al 22 de noviembre de 2027", deadline: "18 de octubre de 2027", deadlineISO: "2027-10-18" },
  { id: "nov-25", rateBand: "novDic", day: "25", month: "NOV", range: "25 — 29 noviembre", long: "25 al 29 de noviembre de 2027", deadline: "25 de octubre de 2027", deadlineISO: "2027-10-25" },
  { id: "dec-09", rateBand: "novDic", day: "09", month: "DIC", range: "9 — 13 diciembre", long: "9 al 13 de diciembre de 2027", deadline: "9 de noviembre de 2027", deadlineISO: "2027-11-09" },
] as const;

const formatMoney = (value: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
const getStartingRate = (hotel: (typeof hotels)[number]) => Math.min(...hotel.rooms.flatMap((room) => [room.rates.oct.PUJ, room.rates.oct.SDQ, room.rates.novDic.PUJ, room.rates.novDic.SDQ]));

function getInstallments(deadlineISO: string) {
  const today = new Date();
  const deadline = new Date(`${deadlineISO}T12:00:00`);
  const difference = (deadline.getFullYear() - today.getFullYear()) * 12 + deadline.getMonth() - today.getMonth();
  return deadline < today ? 0 : Math.max(1, difference);
}

export default function Home() {
  const [hotelId, setHotelId] = useState<(typeof hotels)[number]["id"]>("bayahibe");
  const [roomId, setRoomId] = useState<string>(hotels[0].rooms[0].id);
  const [dateId, setDateId] = useState<(typeof travelDates)[number]["id"]>("oct-21");
  const [airport, setAirport] = useState<"PUJ" | "SDQ">("PUJ");
  const [passengers, setPassengers] = useState(2);
  const [partyType, setPartyType] = useState<"unknown" | "family" | "adults">("unknown");
  const [selectionNotice, setSelectionNotice] = useState("");
  const [galleryPositions, setGalleryPositions] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<{ hotelId: (typeof hotels)[number]["id"]; index: number } | null>(null);

  const selectedHotel = hotels.find((hotel) => hotel.id === hotelId) ?? hotels[0];
  const selectedDate = travelDates.find((date) => date.id === dateId) ?? travelDates[0];
  const selectedRoom = selectedHotel.rooms.find((room) => room.id === roomId) ?? selectedHotel.rooms[0];
  const selectedRoomGuidance = roomGuidance[selectedHotel.id]?.[selectedRoom.id];
  const pricePerPerson = selectedRoom.rates[selectedDate.rateBand][airport];
  const otherAirport = airport === "PUJ" ? "SDQ" : "PUJ";
  const otherAirportRate = selectedRoom.rates[selectedDate.rateBand][otherAirport];
  const lightboxHotel = lightbox ? hotels.find((hotel) => hotel.id === lightbox.hotelId) : null;
  const installments = getInstallments(selectedDate.deadlineISO);
  const quote = useMemo(() => {
    const total = Math.max(0, pricePerPerson) * passengers;
    const initial = 200000 * passengers;
    const balance = Math.max(0, total - initial);
    const regular = installments > 0 ? Math.floor(balance / installments) : balance;
    const last = installments > 0 ? balance - regular * Math.max(0, installments - 1) : balance;
    return { total, initial, balance, regular, last };
  }, [installments, passengers, pricePerPerson]);

  const whatsappUrl = (hotel = selectedHotel) => {
    const room = hotel.id === selectedHotel.id ? selectedRoom : hotel.rooms[0];
    const rate = room.rates[selectedDate.rateBand][airport];
    const groupNote = partyType === "family" ? "Viajamos con uno o más menores de 18 años y compartiré sus edades exactas." : partyType === "adults" ? "Todos los viajeros tenemos 18 años cumplidos o más." : "Aún necesito confirmar si viajan menores de 18 años.";
    const message = `Hola, equipo Trvely. Soy asociado(a) de Coopercar y me interesa ${hotel.name}, habitación ${room.name}, para viajar del ${selectedDate.long}, llegando por ${airport}. Viajaríamos ${passengers} persona(s) en acomodación doble. ${groupNote} La tarifa publicada es ${formatMoney(rate)} por persona. Entiendo que la disponibilidad, la ocupación y los beneficios de la categoría deben validarse antes de confirmar. ¿Me asesoran, por favor?`;
    return `https://wa.me/573233916413?text=${encodeURIComponent(message)}`;
  };

  const changeHotel = (id: (typeof hotels)[number]["id"]) => {
    const hotel = hotels.find((item) => item.id === id) ?? hotels[0];
    setHotelId(id);
    setRoomId(hotel.rooms[0].id);
    setSelectionNotice("");
  };

  const chooseParty = (type: "family" | "adults") => {
    setPartyType(type);
    if (type === "family" && selectedHotel.adultsOnly) {
      const alternative = hotels.find((hotel) => hotel.id === selectedHotel.familyAlternativeId) ?? hotels[0];
      setHotelId(alternative.id);
      setRoomId(alternative.rooms[0].id);
      setSelectionNotice(`Cambiamos tu selección a ${alternative.name}: los hoteles Royal no admiten menores de 18 años.`);
      return;
    }
    setSelectionNotice(type === "family" ? "Perfecto: te mostraremos únicamente opciones compatibles con menores de 18 años." : "Perfecto: todos los hoteles están disponibles para un grupo de adultos.");
  };

  const chooseHotel = (id: (typeof hotels)[number]["id"]) => {
    const hotel = hotels.find((item) => item.id === id) ?? hotels[0];
    if (partyType === "unknown") {
      setSelectionNotice("Antes de elegir, indícanos si viaja algún menor de 18 años. Esta respuesta define qué hoteles son compatibles.");
      document.getElementById("tipo-viaje")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (partyType === "family" && hotel.adultsOnly) {
      const alternative = hotels.find((item) => item.id === hotel.familyAlternativeId) ?? hotels[0];
      changeHotel(alternative.id);
      setSelectionNotice(`${hotel.name} es exclusivamente para mayores de 18 años. Seleccionamos ${alternative.name}, su alternativa familiar.`);
    } else {
      changeHotel(id);
    }
    document.getElementById("aeropuertos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setGalleryPhoto = (id: (typeof hotels)[number]["id"], index: number) => {
    setGalleryPositions((current) => ({ ...current, [id]: index }));
  };

  const moveGallery = (id: (typeof hotels)[number]["id"], direction: number) => {
    const hotel = hotels.find((item) => item.id === id);
    if (!hotel) return;
    const current = galleryPositions[id] ?? 0;
    setGalleryPhoto(id, (current + direction + hotel.gallery.length) % hotel.gallery.length);
  };

  const moveLightbox = (direction: number) => {
    if (!lightbox || !lightboxHotel) return;
    setLightbox({ ...lightbox, index: (lightbox.index + direction + lightboxHotel.gallery.length) % lightboxHotel.gallery.length });
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Trvely Convenios, inicio">
          <Image src="/brand/trvely.png" alt="Trvely" width={300} height={90} priority />
          <span className="brand-divider" aria-hidden="true" />
          <span className="partner-lockup"><small>CONVENIO</small>COOPERCAR</span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#fechas">Fechas</a><a href="#hoteles">Hoteles</a><a href="#pagos">Plan de pagos</a>
        </nav>
        <a className="header-cta" href="#hoteles">Explorar el convenio</a>
      </header>

      <section className="hero" id="inicio">
        <video className="hero-media" autoPlay muted loop playsInline poster="https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/video/catalonia-bayahibe_hero_poster.jpg" aria-hidden="true">
          <source src="https://media.trvely.com.co/hoteles/bayahibe/catalonia-bayahibe/video/catalonia-bayahibe_hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-copy">
            <div className="eyebrow light">BENEFICIO EXCLUSIVO PARA ASOCIADOS COOPERCAR</div>
            <h1>Tu Caribe 2027<br />empieza con un <em>sí.</em></h1>
            <p>Cuatro resorts Catalonia en República Dominicana. Cuatro fechas para elegir. Una forma sencilla de empezar hoy y pagar tu viaje con tiempo.</p>
            <div className="hero-actions">
              <a className="button primary" href="#hoteles">Quiero elegir mi hotel</a>
              <a className="button ghost" href="#pagos">Simular mis cuotas</a>
            </div>
          </div>
          <div className="triana-hero" aria-label="Triana, anfitriona digital de Trvely">
            <div className="speech-card"><span className="live-dot" /><small>TRIANA · ANFITRIONA DIGITAL</small><strong>Hola, soy Triana.</strong><p>Te acompaño a elegir hotel, fecha y la forma de pago que mejor te quede.</p></div>
            <Image src="/triana/triana-real-hero.webp" alt="Triana en su versión fotográfica presenta el convenio de viaje" width={1800} height={1800} priority />
          </div>
        </div>
      </section>

      <section className="benefit-rail" aria-label="Resumen del beneficio">
        <div><strong>100</strong><span>cupos exclusivos</span></div>
        <div><strong>$200.000</strong><span>para separar por persona</span></div>
        <div><strong>4 noches</strong><span>5 días · todo incluido</span></div>
        <div><strong>PUJ o SDQ</strong><span>dos aeropuertos posibles</span></div>
      </section>

      <aside className="coral-invitation" aria-label="Nuevo plan Coral Costa Caribe">
        <div><span>NUEVO EN EL CONVENIO</span><strong>Coral Costa Caribe · Juan Dolio</strong><p>Las mismas cuatro salidas, un plan de 4 noches por $3.600.000 por persona y separación desde $200.000.</p></div>
        <a href="/coopercar/coral-costa-caribe/">Conocer el nuevo plan <span>→</span></a>
      </aside>

      <section className="date-preview" id="fechas">
        <div className="section-heading compact"><div className="eyebrow">CUATRO MOMENTOS PARA DECIR SÍ</div><h2>Escoge tu semana en el Caribe</h2><p>Todas las salidas son de jueves a lunes: 4 noches y 5 días.</p></div>
        <div className="date-row">
          {travelDates.map((date) => (
            <button className={date.id === dateId ? "date-card active" : "date-card"} onClick={() => setDateId(date.id)} key={date.id} aria-pressed={date.id === dateId}>
              <span className="date-num">{date.day}</span><span className="date-month">{date.month}</span><span className="date-range">{date.range}</span><span className="date-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className="date-note"><span>✓</span><p>Para esta fecha, tu viaje debe quedar completamente pagado a más tardar el <strong>{selectedDate.deadline}</strong>.</p></div>
      </section>

      <section className="hotel-section" id="hoteles">
        <div className="hotel-intro">
          <div><div className="eyebrow light">CUATRO FORMAS DE VIVIR REPÚBLICA DOMINICANA</div><h2>El Caribe que se parece a ti</h2></div>
          <div className="price-status ready"><span className="status-icon">✓</span><div><strong>Tarifas Coopercar disponibles</strong><p>Elige hotel, habitación, fecha y aeropuerto. Verás el precio exacto por persona en acomodación doble.</p></div></div>
        </div>

        <div className="party-planner" id="tipo-viaje">
          <div className="party-planner-copy"><span>PASO CLAVE ANTES DE ELEGIR</span><h3>¿Viaja algún menor de 18 años?</h3><p>Tu respuesta evita que elijas un hotel que no pueda recibir a todo tu grupo.</p></div>
          <div className="party-options" role="group" aria-label="Indica si viajan menores de edad">
            <button className={partyType === "family" ? "active" : ""} onClick={() => chooseParty("family")} aria-pressed={partyType === "family"}><span>👨‍👩‍👧</span><strong>Sí, viajan menores</strong><small>Ver opciones familiares</small></button>
            <button className={partyType === "adults" ? "active" : ""} onClick={() => chooseParty("adults")} aria-pressed={partyType === "adults"}><span>18+</span><strong>No, todos son adultos</strong><small>Ver las cuatro opciones</small></button>
          </div>
        </div>
        {selectionNotice && <div className="selection-notice" role="status"><span>i</span>{selectionNotice}</div>}

        <div className="hotel-grid">
          {hotels.map((hotel, index) => {
            const currentIndex = galleryPositions[hotel.id] ?? 0;
            const currentPhoto = hotel.gallery[currentIndex] ?? hotel.gallery[0];
            const startingRate = getStartingRate(hotel);
            const incompatible = partyType === "family" && hotel.adultsOnly;
            const alternative = hotels.find((item) => item.id === hotel.familyAlternativeId) ?? hotels[0];
            return (
            <article className={`hotel-card ${incompatible ? "incompatible" : ""}`} key={hotel.id}>
              <div className="hotel-gallery">
                <button className="hotel-photo" onClick={() => setLightbox({ hotelId: hotel.id, index: currentIndex })} aria-label={`Ampliar fotografía ${currentIndex + 1} de ${hotel.gallery.length} de ${hotel.name}`}>
                  <Image src={currentPhoto.src} alt={currentPhoto.alt} width={1000} height={680} sizes="(max-width: 700px) 100vw, 50vw" />
                  <span className="hotel-index">0{index + 1}</span><span className="hotel-audience">{hotel.audience}</span>
                  <span className="gallery-counter">{currentIndex + 1} / {hotel.gallery.length} · Ampliar</span>
                </button>
                <button className="gallery-arrow previous" onClick={() => moveGallery(hotel.id, -1)} aria-label={`Fotografía anterior de ${hotel.name}`}>←</button>
                <button className="gallery-arrow next" onClick={() => moveGallery(hotel.id, 1)} aria-label={`Siguiente fotografía de ${hotel.name}`}>→</button>
                <div className="hotel-thumbs" aria-label={`Galería de ${hotel.name}`}>
                  {hotel.gallery.map((photo, photoIndex) => (
                    <button className={photoIndex === currentIndex ? "active" : ""} onClick={() => setGalleryPhoto(hotel.id, photoIndex)} aria-label={`Ver fotografía ${photoIndex + 1} de ${hotel.name}`} aria-pressed={photoIndex === currentIndex} key={photo.src}>
                      <Image src={photo.src} alt="" width={180} height={120} sizes="100px" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="hotel-body">
                <span className="hotel-place">{hotel.place}</span><h3>{hotel.name}</h3><strong className="hotel-lead">{hotel.lead}</strong><p>{hotel.copy}</p>
                <div className="hotel-meta"><span>{hotel.detail}</span><span>Todo incluido</span></div>
                <div className={`hotel-fit ${hotel.adultsOnly ? "adults-only" : "family-fit"}`}>
                  <div><span>{hotel.adultsOnly ? "18+" : "✓"}</span><strong>{hotel.fitTitle}</strong></div>
                  <p>{hotel.fitText}</p>
                  <small>{hotel.accessRule}</small>
                </div>
                <div className="hotel-price"><div><small>DESDE · POR PERSONA EN DOBLE</small><strong>{formatMoney(startingRate)}</strong></div><span>Separa con<br /><b>$200.000 p/p</b></span></div>
                <p className="room-count">{hotel.rooms.length} {hotel.rooms.length === 1 ? "habitación disponible" : "habitaciones disponibles"} · Elige la tuya en el simulador.</p>
                {incompatible ? (
                  <div className="hotel-actions alternative"><button onClick={() => chooseHotel(alternative.id)}>Elegir {alternative.name} <span>→</span></button></div>
                ) : (
                  <div className="hotel-actions"><button onClick={() => chooseHotel(hotel.id)}>Elegir este hotel <span>→</span></button><a href={whatsappUrl(hotel)} target="_blank" rel="noreferrer" aria-label={`Preguntar por WhatsApp por ${hotel.name}`}>WhatsApp ↗</a></div>
                )}
              </div>
            </article>
          )})}
        </div>
        <p className="source-note"><strong>Tarifas por persona en acomodación doble.</strong> Incluyen tiquete aéreo de ida y regreso, 4 noches en plan todo incluido, traslado privado aeropuerto–hotel–aeropuerto y asistencia médica. Cupos y habitaciones sujetos a disponibilidad. Para menores de edad, acomodación sencilla, triple o grupos familiares, Trvely debe validar edades, composición y tarifa antes de reservar.</p>
      </section>

      <section className="airport-section" id="aeropuertos">
        <div className="airport-shell">
          <div className="airport-copy">
            <div className="eyebrow">TU RUTA, BIEN PENSADA</div><h2>¿Punta Cana<br />o Santo Domingo?</h2>
            <p>Puedes cotizar el viaje llegando por <strong>PUJ</strong> o por <strong>SDQ</strong>. El mejor punto de entrada depende de tu hotel, el vuelo y el valor final del traslado.</p>
            <div className="airport-tabs" role="group" aria-label="Selecciona aeropuerto">
              <button className={airport === "PUJ" ? "active" : ""} onClick={() => setAirport("PUJ")} aria-pressed={airport === "PUJ"}><span>PUJ</span>Aeropuerto de Punta Cana</button>
              <button className={airport === "SDQ" ? "active" : ""} onClick={() => setAirport("SDQ")} aria-pressed={airport === "SDQ"}><span>SDQ</span>Las Américas · Santo Domingo</button>
            </div>
          </div>
          <div className="route-card">
            <div className="route-top"><span>RUTA SELECCIONADA</span><b>01 / 02</b></div>
            <div className="route-line"><div><small>LLEGADA</small><strong>{airport}</strong></div><span className="route-track"><i /></span><div><small>DESTINO</small><strong>{selectedHotel.zone}</strong></div></div>
            <div className="route-hotel"><Image src={selectedHotel.image} alt="" width={160} height={140} /><div><small>HOTEL ELEGIDO</small><strong>{selectedHotel.name}</strong><span>{selectedHotel.place}</span></div></div>
            <div className="route-insight">
              <span>TRIANA TE CUENTA</span>
              <p>{airport === "PUJ" ? (selectedHotel.zone === "Punta Cana" ? "PUJ es la llegada más directa para los hoteles de Cabeza de Toro." : "PUJ es una de las rutas habituales hacia Bayahíbe; confirmaremos traslado y tarifa.") : (selectedHotel.zone === "Bayahíbe" ? "SDQ es una alternativa viable hacia Bayahíbe; compararemos el costo total antes de recomendarla." : "Desde SDQ el trayecto terrestre a Punta Cana es más largo; vale la pena compararlo con el ahorro del vuelo.")}</p>
            </div>
            <div className="pending-price"><span>Tarifa por persona · {selectedRoom.name}</span><strong>{formatMoney(pricePerPerson)}</strong></div>
            <p className="airport-comparison">La misma selección vía {otherAirport}: <strong>{formatMoney(otherAirportRate)}</strong>. {airport === "SDQ" ? `Llegar por SDQ reduce el precio en ${formatMoney(otherAirportRate > pricePerPerson ? otherAirportRate - pricePerPerson : 0)} por persona.` : `Puedes comparar con SDQ y ahorrar ${formatMoney(pricePerPerson > otherAirportRate ? pricePerPerson - otherAirportRate : 0)} por persona.`}</p>
          </div>
        </div>
      </section>

      <section className="payment-section" id="pagos">
        <div className="payment-heading"><div className="eyebrow light">PLANEACIÓN SIN SORPRESAS</div><h2>Hoy separas.<br /><em>Después, avanzas.</em></h2><p>Elige hotel, habitación, fecha y aeropuerto. Triana toma la tarifa publicada y te muestra cómo se distribuiría el pago.</p></div>
        <div className="calculator-shell">
          <div className="triana-calc"><Image src="/triana/triana-real-presenta.png" alt="Triana en su versión fotográfica acompaña el simulador de pagos" width={2048} height={2048} /><div className="calc-bubble"><strong>Tu primer paso es simple.</strong><span>$200.000 por cada viajero.</span></div></div>
          <div className="calculator">
            <div className="calc-head"><div><small>SIMULADOR COOPERCAR</small><h3>Proyecta tus cuotas</h3></div><span>Tarifa cargada</span></div>
            <label>¿Viaja algún menor de 18 años?
              <select value={partyType} onChange={(event) => event.target.value === "unknown" ? (setPartyType("unknown"), setSelectionNotice("Selecciona el tipo de grupo para validar el hotel.")) : chooseParty(event.target.value as "family" | "adults")}>
                <option value="unknown">Selecciona una respuesta</option>
                <option value="family">Sí, viajan menores de 18 años</option>
                <option value="adults">No, todos tienen 18 años o más</option>
              </select>
            </label>
            <label>Hotel<select value={hotelId} onChange={(event) => changeHotel(event.target.value as typeof hotelId)}>{hotels.map((hotel) => <option value={hotel.id} disabled={partyType === "family" && hotel.adultsOnly} key={hotel.id}>{hotel.name}{hotel.adultsOnly ? " · Solo 18+" : " · Familiar"}</option>)}</select></label>
            <div className={`eligibility-banner ${selectedHotel.adultsOnly ? "adults-only" : "family-fit"}`}>
              <strong>{selectedHotel.fitTitle}</strong><span>{selectedHotel.fitText}</span><small>{selectedHotel.accessRule}</small>
            </div>
            <div className="form-row">
              <label>Habitación<select value={selectedRoom.id} onChange={(event) => setRoomId(event.target.value)}>{selectedHotel.rooms.map((room) => <option value={room.id} key={room.id}>{room.name}</option>)}</select></label>
              <label>Fecha de viaje<select value={dateId} onChange={(event) => setDateId(event.target.value as typeof dateId)}>{travelDates.map((date) => <option value={date.id} key={date.id}>{date.range} de 2027</option>)}</select></label>
            </div>
            {selectedRoomGuidance && <div className="room-guidance"><span>ESTA HABITACIÓN, SIN CONFUSIONES</span><div><strong>Ocupación</strong><p>{selectedRoomGuidance.occupancy}</p></div><div><strong>Beneficios</strong><p>{selectedRoomGuidance.benefits}</p></div><small>Importante: {selectedRoomGuidance.caution}</small></div>}
            <div className="form-row">
              <label>Aeropuerto<select value={airport} onChange={(event) => setAirport(event.target.value as typeof airport)}><option value="PUJ">PUJ · Punta Cana</option><option value="SDQ">SDQ · Santo Domingo</option></select></label>
              <label>Viajeros en acomodación doble<select value={passengers} onChange={(event) => setPassengers(Number(event.target.value))}>{[2,4,6,8].map((value) => <option key={value} value={value}>{value} personas</option>)}</select></label>
            </div>
            <div className="selected-rate"><div><small>TARIFA PUBLICADA POR PERSONA</small><strong>{formatMoney(pricePerPerson)}</strong></div><span>{selectedRoom.name}<br />{selectedDate.range} · vía {airport}</span></div>
            <div className="calc-results" aria-live="polite">
              <div><span>Cuota inicial</span><strong>{formatMoney(quote.initial)}</strong><small>{formatMoney(200000)} × {passengers}</small></div>
              <div><span>Saldo a financiar</span><strong>{formatMoney(quote.balance)}</strong><small>Después de la separación</small></div>
              <div className="result-featured"><span>{installments || "—"} abonos mensuales</span><strong>{formatMoney(quote.regular)}</strong><small>Último abono estimado: {formatMoney(quote.last)}</small></div>
            </div>
            <div className="deadline-line"><span>FECHA LÍMITE DE PAGO TOTAL</span><strong>{selectedDate.deadline}</strong></div>
            {partyType === "unknown" ? <button className="calc-whatsapp disabled" onClick={() => setSelectionNotice("Antes de enviar la selección, confirma si viaja algún menor de 18 años.")}>Confirma primero quiénes viajan <span>↑</span></button> : <a className="calc-whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer">Enviar mi selección a un asesor <span>↗</span></a>}
            <p className="calc-disclaimer">Simulación para pasajeros en acomodación doble. La cuota mensual depende de la fecha real de reserva. La tarifa de menores no se calcula automáticamente: aun cuando exista un beneficio hotelero, vuelos, traslados y asistencia pueden generar costo. Cupos, vuelos, habitación, ocupación y beneficios están sujetos a validación; el valor total debe estar pagado un mes antes del viaje.</p>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div className="section-heading compact"><div className="eyebrow">ASÍ DE FÁCIL</div><h2>Del “quiero ir” al “ya casi viajamos”</h2></div>
        <div className="steps-grid">
          <div><span>01</span><strong>Elige tu experiencia</strong><p>Hotel, fecha, aeropuerto y número de viajeros.</p></div>
          <div><span>02</span><strong>Separa tu cupo</strong><p>Con $200.000 por persona inicias el plan.</p></div>
          <div><span>03</span><strong>Haz tus abonos</strong><p>Pagos mensuales según el saldo y el tiempo disponible.</p></div>
          <div><span>04</span><strong>Viaja tranquilo</strong><p>El plan queda totalmente pagado un mes antes de salir.</p></div>
        </div>
      </section>

      <section className="selection-rules" aria-labelledby="selection-rules-title">
        <div className="section-heading compact"><div className="eyebrow">REGLAS PARA ELEGIR CON TRANQUILIDAD</div><h2 id="selection-rules-title">Lo importante, antes de separar.</h2><p>Triana resume las condiciones que evitan diferencias entre lo imaginado y lo reservado.</p></div>
        <div className="rules-grid">
          <article><span>01 · EDADES</span><strong>Royal significa solo adultos</strong><p>Royal La Romana y Royal Bávaro exigen que cada huésped tenga 18 años cumplidos. Si viaja un menor, elige Bayahibe o Bávaro Resort y comparte su edad exacta.</p></article>
          <article><span>02 · ACCESO</span><strong>El acceso es en un solo sentido</strong><p>Quien se hospeda en un Royal puede usar instalaciones del Catalonia familiar vecino. Hospedarse en el familiar no da acceso al Royal ni a sus áreas exclusivas.</p></article>
          <article><span>03 · CATEGORÍA</span><strong>Privileged no viene en todas</strong><p>Las categorías de entrada señaladas en el simulador no incluyen Privileged. Los servicios exclusivos aplican únicamente cuando la habitación reservada los incorpora.</p></article>
          <article><span>04 · CONFIRMACIÓN</span><strong>Capacidad no es tarifa</strong><p>Que una habitación admita más personas no significa que la tarifa doble publicada aplique al grupo completo. Edades, ocupación, camas y disponibilidad se validan antes del pago.</p></article>
        </div>
        <div className="rules-callout"><strong>Una conversación por WhatsApp no confirma la reserva.</strong><span>Trvely confirma inventario, vuelos, habitación, composición del grupo, beneficios y valor final antes de recibir la cuota inicial.</span></div>
      </section>

      <section className="faq-section">
        <div><div className="eyebrow light">PREGUNTAS IMPORTANTES</div><h2>Claro desde<br />el comienzo.</h2><p>La confianza también hace parte del viaje.</p></div>
        <div className="faq-list">
          <details open><summary>¿La separación de $200.000 es por reserva?</summary><p>No. Es una cuota inicial de <strong>$200.000 por cada persona</strong> que viaja. Se descuenta del valor total de su plan.</p></details>
          <details><summary>¿Cuándo debe estar pagado todo el viaje?</summary><p>A más tardar un mes antes de la fecha de salida. En esta página mostramos la fecha límite exacta para cada una de las cuatro salidas.</p></details>
          <details><summary>¿Qué incluye la tarifa publicada?</summary><p>Tiquete aéreo de ida y regreso, cuatro noches en plan todo incluido, traslado privado de llegada y salida y asistencia médica. La tarifa se muestra por persona en acomodación doble.</p></details>
          <details><summary>¿Puedo viajar con niños?</summary><p>Sí, en Catalonia Bayahibe y Catalonia Bávaro Resort. Para la ocupación y tarifa hotelera, de 0 a 12 años es categoría niño y desde los 13 se tarifa como adulto; los menores de 18 sí pueden hospedarse en estos hoteles familiares acompañados. Trvely debe conocer la edad exacta. Royal La Romana y Royal Bávaro son exclusivamente para huéspedes con 18 años cumplidos, sin excepciones.</p></details>
          <details><summary>¿La tarifa del niño es gratis o tiene descuento?</summary><p>No debe asumirse. La tarifa publicada aquí es por persona en acomodación doble. Trvely confirma el valor del menor según edad y composición, porque el tiquete aéreo, los traslados y la asistencia médica pueden tener costo aunque el hotel ofrezca algún beneficio de alojamiento.</p></details>
          <details><summary>¿Puedo visitar el hotel de al lado?</summary><p>Solo en una dirección: los huéspedes de Royal La Romana pueden acceder a instalaciones de Catalonia Bayahibe y los de Royal Bávaro a las de Catalonia Bávaro. Los huéspedes de los hoteles familiares no tienen acceso a los Royal. El acceso tampoco garantiza servicios exclusivos, reservas o áreas Privileged que no correspondan a la categoría contratada.</p></details>
          <details><summary>¿Todas las habitaciones incluyen Privileged?</summary><p>No. Comfort y Premium en Bayahibe; Junior Suite y Premium Junior Suite en Bávaro; y las dos categorías de entrada de Royal Bávaro no lo incluyen. El simulador muestra los beneficios y advertencias de cada habitación.</p></details>
          <details><summary>¿Swim Up quiere decir piscina privada?</summary><p>No siempre. En Royal La Romana las habitaciones Swim Up tienen acceso directo a una piscina compartida; solo la Duplex Suite &amp; Swimming Pool se describe aquí con piscina privada. Revisa siempre la ficha dinámica de la habitación seleccionada.</p></details>
          <details><summary>¿La reserva queda confirmada al escribir por WhatsApp?</summary><p>No. El chat inicia la asesoría. La reserva se confirma cuando Trvely valida disponibilidad, emite las condiciones y recibe la cuota inicial.</p></details>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-copy"><div className="eyebrow light">TRIANA Y EL EQUIPO TRVELY ESTÁN LISTOS</div><h2>El viaje empieza<br />con una conversación.</h2><p>Cuéntanos cuál hotel te gustó. Tu mensaje llegará con la fecha, el aeropuerto y el número de viajeros que elegiste.</p><a href={whatsappUrl()} target="_blank" rel="noreferrer">Hablar por WhatsApp <span>↗</span></a><small>Atención Trvely · +57 323 391 6413</small></div>
        <Image src="/triana/triana-real-cierre.png" alt="Triana en su versión fotográfica saluda y da la bienvenida" width={609} height={820} />
      </section>

      <footer><div className="footer-brand"><Image src="/brand/trvely.png" alt="Trvely" width={300} height={90} /><span>×</span><b>COOPERCAR</b></div><p>Convenio comercial · Caribe 2027<br />Información sujeta a disponibilidad y a las condiciones finales de la tarifa.</p><div><a href="#inicio">Volver arriba ↑</a><a href={whatsappUrl()} target="_blank" rel="noreferrer">WhatsApp</a></div></footer>

      {lightbox && lightboxHotel && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`Galería ampliada de ${lightboxHotel.name}`}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Cerrar galería">×</button>
          <div className="lightbox-stage">
            <button className="lightbox-arrow previous" onClick={() => moveLightbox(-1)} aria-label="Fotografía anterior">←</button>
            <Image src={lightboxHotel.gallery[lightbox.index].src} alt={lightboxHotel.gallery[lightbox.index].alt} width={1600} height={1100} sizes="90vw" priority />
            <button className="lightbox-arrow next" onClick={() => moveLightbox(1)} aria-label="Siguiente fotografía">→</button>
            <div className="lightbox-caption"><div><small>{lightboxHotel.place}</small><strong>{lightboxHotel.name}</strong></div><span>{lightbox.index + 1} / {lightboxHotel.gallery.length}</span></div>
          </div>
        </div>
      )}

      <a className="sticky-whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Hablar con Trvely por WhatsApp"><span>●</span><div><small>¿LISTO PARA ELEGIR?</small>Hablar con un asesor</div><b>↗</b></a>
    </main>
  );
}
