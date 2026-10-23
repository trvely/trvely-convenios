# Trvely Convenios

Repositorio público de convenios empresariales de Trvely en
[`convenios.trvely.com.co`](https://convenios.trvely.com.co/).

## Página general de convenios

La raíz publica la **base bonificable por destino**: el tiquete aéreo de referencia y los
impuestos (CNNC) que se descuentan del paquete antes de aplicar el porcentaje pactado, con su
historial de variaciones.

Para actualizarla:

1. Actualizar `datos_convenio.json`. Los impuestos provienen de `reglas_cnnc` en PROD y los
   tiquetes de referencia, del corte de bancos del día. Registrar todo cambio en `historico`.
2. Ejecutar `py -3.13 generar_pagina.py` para regenerar `index.html`.
3. Revisar, hacer commit y push. GitHub Pages publica automáticamente.

## Landing Coopercar · Caribe 2027

La experiencia comercial de Trvely y Coopercar vive en:

[`convenios.trvely.com.co/coopercar/`](https://convenios.trvely.com.co/coopercar/)

### Coral Costa Caribe · Juan Dolio 2027

El convenio suma una landing independiente para Coral Costa Caribe con las mismas cuatro salidas:

[`convenios.trvely.com.co/coopercar/coral-costa-caribe/`](https://convenios.trvely.com.co/coopercar/coral-costa-caribe/)

- Plan principal: 4 noches por COP 3.600.000 por persona en acomodación doble.
- Separación: COP 200.000 por persona.
- Alternativa: 3 noches por COP 3.200.000 por persona, únicamente bajo solicitud al comercial
  responsable de la alianza.
- La categoría de habitación, los menores, otras ocupaciones, los vuelos y la disponibilidad se
  confirman antes del pago.

### Cartagena Plaza y Cartagena Dubai

El menú Coopercar también publica dos experiencias completas para Cartagena:

- [`Cartagena Plaza`](https://convenios.trvely.com.co/coopercar/cartagena-plaza/)
- [`Cartagena Dubai`](https://convenios.trvely.com.co/coopercar/cartagena-dubai/)

Ambas presentan un plan de 3 noches desde COP 1.499.999 por persona con vuelos ida y regreso desde
Bogotá, traslados aeropuerto–hotel–aeropuerto, alojamiento, alimentación todo incluido y tour a
Playa Barú. Es una tarifa **desde**: fechas, inventario aéreo y hotelero, equipaje, acomodación,
edades, categoría de habitación y condiciones finales se confirman en la cotización de Trvely.

Desarrollo y validación:

```bash
npm install
npm run dev
npm run lint
npm test
```

`npm run build` crea el paquete estático en `dist/client/`. La publicación copia la aplicación a
`coopercar/` sin reemplazar el anexo general de la raíz. Las tarifas, categorías, reglas de
ocupación y condiciones de selección se validan antes de cada publicación.

## Infraestructura

- DNS en Cloudflare: `CNAME convenios → trvely.github.io`, modo **Solo DNS**.
- El archivo `CNAME` de la raíz debe conservarse para que GitHub Pages mantenga el dominio y HTTPS.
- `.nojekyll` permite publicar sin filtrado la carpeta técnica `_next` de la landing.
