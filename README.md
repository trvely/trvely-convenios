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
