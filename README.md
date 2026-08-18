# trvely-convenios

Página pública del **anexo de convenios empresariales** de Trvely → `convenios.trvely.com.co`

Publica la **base bonificable por destino**: el tiquete aéreo de referencia y los impuestos (CNNC)
que se descuentan del paquete antes de aplicar el porcentaje pactado, con su historial de
variaciones.

Nació el 18-ago-2026, prometida por escrito en el Anexo 1 de la carta de convenio: el contrato
remite a esta URL en vez de llevar las cifras impresas, para que el papel no envejezca cuando
cambie una tasa.

## Cómo se actualiza

1. `datos_convenio.json` — los valores. **No se escriben a mano**: los impuestos salen de
   `reglas_cnnc` en PROD (lectura) y los tiquetes de referencia del corte de bancos del día.
   Al cambiar un valor, agregar la entrada correspondiente en `historico`.
2. `py -3.13 generar_pagina.py` → regenera `index.html`.
3. commit + push. GitHub Pages publica solo.

## Notas de infraestructura

- DNS en **Cloudflare** (no Hostinger): `CNAME convenios → trvely.github.io`, proxy en
  **«Solo DNS»** (nube gris). Con el proxy activo GitHub no emite el certificado.
- ⚠️ El archivo `CNAME` se sube **después** de que el DNS resuelva. Al revés, Pages redirige a un
  dominio que aún no existe y el sitio queda inalcanzable por las dos vías.
