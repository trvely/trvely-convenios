# Trvely Convenios · Coopercar

Landing comercial para el convenio de viajes Caribe 2027 entre Trvely y Coopercar.

## Desarrollo local

```bash
npm install
npm run dev
```

## Publicación

La versión pública se genera con `npm run build` como sitio estático en `dist/client/` y se publica dentro del
repositorio corporativo `trvely/trvely-convenios`, sin reemplazar el anexo general que vive en la
raíz. La landing queda en:

`https://convenios.trvely.com.co/coopercar/`

## Validación

```bash
npm run lint
npm test
```

Las tarifas, categorías, reglas de ocupación y condiciones de selección están incorporadas y se
validan antes de cada publicación.
