type HotelSwitcherProps = {
  current: "catalonia" | "coral";
};

const hotelOptions = [
  {
    id: "catalonia",
    name: "Convenio Catalonia",
    detail: "4 propiedades para elegir",
    href: "/coopercar/",
    mark: "C",
  },
  {
    id: "coral",
    name: "Convenio Coral Costa Caribe",
    detail: "Juan Dolio · 4 noches",
    href: "/coopercar/coral-costa-caribe/",
    mark: "CC",
  },
] as const;

export default function HotelSwitcher({ current }: HotelSwitcherProps) {
  return (
    <details className="hotel-switcher">
      <summary aria-label="Abrir menú de convenios hoteleros. Hay 2 opciones disponibles">
        <span className="hotel-switcher-copy">
          <small>MENÚ PRINCIPAL</small>
          <strong>Convenios hoteleros <em>2</em></strong>
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
            >
              <span className="hotel-switcher-mark" aria-hidden="true">{hotel.mark}</span>
              <span>
                <strong>{hotel.name}</strong>
                <small>{isCurrent ? `Estás aquí · ${hotel.detail}` : hotel.detail}</small>
              </span>
              <b aria-hidden="true">{isCurrent ? "✓" : "→"}</b>
            </a>
          );
        })}
        <p>Selecciona una opción para consultar sus fechas, precios y condiciones.</p>
      </div>
    </details>
  );
}
