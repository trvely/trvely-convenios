type HotelSwitcherProps = {
  current: "catalonia" | "coral";
};

const hotelOptions = [
  {
    id: "catalonia",
    name: "Catalonia Resorts",
    detail: "4 propiedades para elegir",
    href: "/coopercar/",
    mark: "C",
  },
  {
    id: "coral",
    name: "Coral Costa Caribe",
    detail: "Juan Dolio · 4 noches",
    href: "/coopercar/coral-costa-caribe/",
    mark: "CC",
  },
] as const;

export default function HotelSwitcher({ current }: HotelSwitcherProps) {
  const selected = hotelOptions.find((hotel) => hotel.id === current) ?? hotelOptions[0];

  return (
    <details className="hotel-switcher">
      <summary aria-label={`Cambiar hotel. Selección actual: ${selected.name}`}>
        <span className="hotel-switcher-copy">
          <small>ELIGE TU EXPERIENCIA</small>
          <strong>{selected.name}</strong>
        </span>
        <span className="hotel-switcher-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div className="hotel-switcher-panel">
        <div className="hotel-switcher-heading">
          <small>CONVENIO COOPERCAR 2027</small>
          <strong>¿Dónde quieres quedarte?</strong>
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
                <small>{hotel.detail}</small>
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
