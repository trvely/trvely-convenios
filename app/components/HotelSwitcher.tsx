type HotelSwitcherProps = {
  current: "catalonia" | "coral" | "cartagena-plaza" | "cartagena-dubai";
  /** Raíz del convenio («/coopercar/» o «/alianzas/<contacto>/»): los cuatro enlaces cuelgan de aquí. */
  base?: string;
  /** Encabezado del panel. */
  heading?: string;
};

const hotelOptions = [
  {
    id: "catalonia",
    name: "Convenio Catalonia",
    detail: "4 propiedades para elegir",
    path: "",
    mark: "C",
    external: false,
  },
  {
    id: "coral",
    name: "Convenio Coral Costa Caribe",
    detail: "Juan Dolio · 4 noches",
    path: "coral-costa-caribe/",
    mark: "CC",
    external: false,
  },
  {
    id: "cartagena-plaza",
    name: "Convenio Cartagena Plaza",
    detail: "3 noches desde $1.499.999",
    path: "cartagena-plaza/",
    mark: "CP",
    external: false,
  },
  {
    id: "cartagena-dubai",
    name: "Convenio Cartagena Dubái",
    detail: "3 noches desde $1.499.999",
    path: "cartagena-dubai/",
    mark: "CD",
    external: false,
  },
] as const;

export default function HotelSwitcher({ current, base = "/coopercar/", heading = "COOPERCAR · PRODUCTOS DISPONIBLES" }: HotelSwitcherProps) {
  return (
    <details className="hotel-switcher">
      <summary aria-label="Abrir menú de convenios hoteleros. Hay 4 opciones disponibles">
        <span className="hotel-switcher-copy">
          <small>MENÚ PRINCIPAL</small>
          <strong>Convenios hoteleros <em>4</em></strong>
        </span>
        <span className="hotel-switcher-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div className="hotel-switcher-panel">
        <div className="hotel-switcher-heading">
          <small>{heading}</small>
          <strong>Elige tu convenio</strong>
        </div>
        {hotelOptions.map((hotel) => {
          const isCurrent = hotel.id === current;
          return (
            <a
              key={hotel.id}
              className={isCurrent ? "hotel-switcher-option active" : "hotel-switcher-option"}
              href={`${base}${hotel.path}`}
              aria-current={isCurrent ? "page" : undefined}
              target={hotel.external ? "_blank" : undefined}
              rel={hotel.external ? "noreferrer" : undefined}
            >
              <span className="hotel-switcher-mark" aria-hidden="true">{hotel.mark}</span>
              <span>
                <strong>{hotel.name}</strong>
                <small>{isCurrent ? `Estás aquí · ${hotel.detail}` : hotel.detail}</small>
              </span>
              <b aria-hidden="true">{isCurrent ? "✓" : hotel.external ? "↗" : "→"}</b>
            </a>
          );
        })}
        <div className="cartagena-menu-plan">
          <span>PARA CARTAGENA PLAZA Y CARTAGENA DUBÁI</span>
          <strong>Tu plan de 3 noches incluye</strong>
          <ul>
            <li>Tiquetes aéreos ida y regreso desde Bogotá</li>
            <li>Traslados aeropuerto–hotel–aeropuerto</li>
            <li>3 noches de alojamiento</li>
            <li>Alimentación todo incluido</li>
            <li>Tour a Playa Barú</li>
          </ul>
        </div>
        <p><strong>Tarifas desde.</strong> Los precios pueden variar según las fechas seleccionadas, disponibilidad, acomodación y condiciones vigentes al cotizar.</p>
      </div>
    </details>
  );
}
