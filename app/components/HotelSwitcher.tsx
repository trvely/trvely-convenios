type HotelSwitcherProps = {
  current: "catalonia" | "coral" | "cartagena-plaza" | "cartagena-dubai";
};

const hotelOptions = [
  {
    id: "catalonia",
    name: "Convenio Catalonia",
    detail: "4 propiedades para elegir",
    href: "/coopercar/",
    mark: "C",
    external: false,
  },
  {
    id: "coral",
    name: "Convenio Coral Costa Caribe",
    detail: "Juan Dolio · 4 noches",
    href: "/coopercar/coral-costa-caribe/",
    mark: "CC",
    external: false,
  },
  {
    id: "cartagena-plaza",
    name: "Convenio Cartagena Plaza",
    detail: "3 noches desde $1.499.999",
    href: "/coopercar/cartagena-plaza/",
    mark: "CP",
    external: false,
  },
  {
    id: "cartagena-dubai",
    name: "Convenio Cartagena Dubái",
    detail: "3 noches desde $1.499.999",
    href: "/coopercar/cartagena-dubai/",
    mark: "CD",
    external: false,
  },
] as const;

export default function HotelSwitcher({ current }: HotelSwitcherProps) {
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
          <small>COOPERCAR · PRODUCTOS DISPONIBLES</small>
          <strong>Elige tu convenio</strong>
        </div>
        {hotelOptions.map((hotel) => {
          const isCurrent = hotel.id === current;
          return (
            <a
              key={hotel.id}
              className={isCurrent ? "hotel-switcher-option active" : "hotel-switcher-option"}
              href={hotel.href}
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
