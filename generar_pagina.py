#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""generar_pagina.py - LA PAGINA PUBLICA del anexo de convenios empresariales de Trvely.

Publica en convenios.trvely.com.co la BASE BONIFICABLE por destino: el tiquete aereo de
referencia y los impuestos (CNNC) que se descuentan antes de aplicar el porcentaje del convenio,
con su historial de variaciones. Nace el 18-ago-2026, prometida por escrito en el Anexo 1 de
CARTA_PRESENTACION_TRVELY_CONVENIO_EMPRESARIAL_v3.pdf: el contrato remite a esta URL en vez de
llevar las cifras impresas, para que el papel no envejezca cuando cambie una tasa.

POR QUE existe (lo que la pagina explica a la cooperativa):
  el porcentaje se aplica sobre lo que Trvely opera, no sobre el tiquete que cobra la aerolinea
  ni sobre los impuestos que se giran a terceros. Es la MISMA base con la que se liquida la
  comision de los asesores de la casa.

La tabla NO se escribe a mano: sale de `datos_convenio.json`, que se genera leyendo
`reglas_cnnc` en PROD (read-only) y el corte de bancos del dia. Si se teclea, se desactualiza y
la pagina termina desmintiendo al contrato.

Uso:  py -3.13 generar_pagina.py     (deja index.html listo para commit)
"""
import io
import json
import os

AQUI = os.path.dirname(os.path.abspath(__file__))
BURG, BEIGE, CREMA, TINTA, GRIS = "#B41241", "#F4E5D2", "#FBF5EE", "#2B2B2B", "#7A6F68"
HAIR, PAPEL = "#E7D9C8", "#FDFBF8"

MESES = ("enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre "
         "diciembre").split()


def pes(v):
    return "$" + format(int(v), ",d").replace(",", ".") if v else "&mdash;"


def bonito(iso):
    a, m, d = iso.split("-")
    return "%d de %s de %s" % (int(d), MESES[int(m) - 1], a)


def filas(destinos, ambito):
    out = []
    for d in destinos:
        if d["ambito"] != ambito:
            continue
        nb = d["impuestos"] + (d["tiquete_ref"] or 0)
        rango = ("%s &ndash; %s" % (pes(d["tiquete_min"]), pes(d["tiquete_max"]))
                 if d["tiquete_ref"] and d["tiquete_min"] != d["tiquete_max"] else "")
        out.append(
            '<tr><td class="dest">%s</td>'
            '<td class="num">%s%s</td>'
            '<td class="num">%s</td>'
            '<td class="num tot">%s</td></tr>' % (
                d["destino"], pes(d["tiquete_ref"]),
                '<span class="rango">%s</span>' % rango if rango else "",
                pes(d["impuestos"]), pes(nb) if d["tiquete_ref"] else pes(d["impuestos"])))
    return "".join(out)


def construir():
    dat = json.load(io.open(os.path.join(AQUI, "datos_convenio.json"), encoding="utf-8"))
    hist = "".join(
        '<li><span class="fh">%s</span> %s</li>' % (bonito(h["fecha"]), h["nota"])
        for h in dat["historico"])

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Base bonificable por destino · Convenios empresariales · Trvely</title>
<meta name="description" content="Tiquete aéreo de referencia e impuestos por destino que se
descuentan antes de aplicar el porcentaje de los convenios empresariales de Trvely, con su
historial de variaciones.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  *{{margin:0;padding:0;box-sizing:border-box}}
  :root{{--burg:{BURG};--beige:{BEIGE};--crema:{CREMA};--tinta:{TINTA};--gris:{GRIS};
        --hair:{HAIR};--papel:{PAPEL}}}
  body{{font-family:'Montserrat',system-ui,-apple-system,'Segoe UI',sans-serif;font-weight:600;
       color:var(--tinta);background:var(--papel);line-height:1.62;-webkit-font-smoothing:antialiased}}
  .wrap{{max-width:60rem;margin:0 auto;padding:0 1.5rem}}

  header{{background:var(--burg);color:#fff;padding:3.5rem 0 3rem}}
  header .kick{{font-size:.72rem;letter-spacing:.3em;color:var(--beige);opacity:.9;margin-bottom:1rem}}
  header h1{{font-size:clamp(1.9rem,5vw,2.9rem);font-weight:800;line-height:1.1;letter-spacing:-.02em}}
  header p{{margin-top:1.1rem;color:var(--beige);font-size:1.02rem;max-width:44rem}}
  .marca{{margin-bottom:2.4rem}}
  .marca img{{height:2.3rem;width:auto;display:block}}

  main{{padding:3rem 0 4rem}}
  section{{margin-bottom:3rem}}
  h2{{font-size:1.35rem;font-weight:800;color:var(--burg);letter-spacing:-.015em;margin-bottom:.4rem}}
  .dek{{color:var(--gris);font-size:.93rem;margin-bottom:1.4rem;padding-bottom:.9rem;
       border-bottom:1px solid var(--hair)}}
  p{{margin-bottom:1rem;max-width:46rem}}
  b{{font-weight:800;color:#000}}

  .formula{{background:var(--crema);border:1px solid var(--hair);border-radius:.7rem;
           padding:1.4rem 1.6rem;margin:1.2rem 0 1.6rem}}
  .formula .t{{font-weight:800;color:var(--burg);font-size:1.05rem;margin-bottom:.35rem}}
  .formula .f{{font-size:1.02rem}}

  .tabla-wrap{{overflow-x:auto;margin:1rem 0 .4rem}}
  table{{width:100%;border-collapse:collapse;min-width:34rem}}
  caption{{text-align:left;font-weight:800;font-size:.78rem;letter-spacing:.09em;
          text-transform:uppercase;color:var(--burg);padding-bottom:.6rem}}
  th{{font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--gris);
     text-align:right;padding:0 0 .55rem .9rem;border-bottom:2px solid var(--burg);font-weight:800}}
  th:first-child{{text-align:left;padding-left:0}}
  td{{padding:.75rem 0 .75rem .9rem;border-bottom:1px solid var(--hair);font-size:.95rem}}
  td:first-child{{padding-left:0}}
  td.dest{{font-weight:800}}
  td.num{{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}}
  td.tot{{font-weight:800;color:var(--burg)}}
  .rango{{display:block;font-size:.72rem;font-weight:600;color:var(--gris);margin-top:.15rem}}

  .nota{{border-left:3px solid var(--burg);padding:.15rem 0 .15rem 1.2rem;margin:1.6rem 0}}
  .nota .t{{font-weight:800;color:var(--burg);margin-bottom:.35rem}}
  .nota p:last-child{{margin-bottom:0}}

  ul.hist{{list-style:none;margin-top:.6rem}}
  ul.hist li{{padding:.7rem 0;border-bottom:1px solid var(--hair);font-size:.95rem}}
  ul.hist .fh{{display:inline-block;min-width:11rem;font-weight:800;color:var(--burg)}}

  .sello{{background:var(--crema);border:1px solid var(--hair);border-radius:.7rem;
         padding:1.1rem 1.3rem;font-size:.86rem;color:var(--gris)}}
  footer{{background:var(--burg);color:var(--beige);padding:2.6rem 0;font-size:.85rem}}
  footer b{{color:#fff}}
  footer .lema{{margin-top:1.2rem;font-size:.72rem;letter-spacing:.2em;opacity:.75}}

  @media (max-width:34rem){{
    ul.hist .fh{{display:block;min-width:0}}
    header{{padding:2.6rem 0 2.2rem}}
  }}
</style>
</head>
<body>

<header>
  <div class="wrap">
    <div class="marca"><img src="logo_trvely.png" alt="Trvely"></div>
    <div class="kick">CONVENIOS EMPRESARIALES</div>
    <h1>Base bonificable<br>por destino</h1>
    <p>Sobre qué valor se calcula el beneficio de los convenios con cooperativas y empresas,
    destino por destino — y cómo ha cambiado en el tiempo.</p>
  </div>
</header>

<main class="wrap">

  <section>
    <h2>Cómo se calcula el beneficio</h2>
    <div class="dek">El porcentaje pactado no se aplica sobre el precio de venta.</div>

    <div class="formula">
      <div class="t">Base bonificable</div>
      <div class="f">= &nbsp;precio del paquete &nbsp;&minus;&nbsp; tiquete aéreo
      &nbsp;&minus;&nbsp; impuestos y tasas</div>
    </div>

    <p>El <b>tiquete aéreo</b> lo cobra la aerolínea y los <b>impuestos y tasas</b> se giran
    completos a terceros. Ninguno de los dos es ingreso de la agencia, y por eso ninguno entra en
    la base del beneficio.</p>

    <div class="nota">
      <div class="t">Por qué lo manejamos así</div>
      <p>Es <b>exactamente la misma base</b> con la que Trvely liquida la comisión de sus propios
      asesores comerciales. Un descuento calculado sobre el precio completo obligaría a la agencia
      a ceder porcentaje sobre plata que nunca fue suya —la de la aerolínea y la del recaudo de
      impuestos—, y ningún convenio construido así se sostiene en el tiempo.</p>
      <p>Al aplicarlo sobre lo que Trvely realmente opera, el porcentaje puede ser más alto, se
      mantiene año tras año y el aliado recibe el mismo trato que la fuerza comercial de la casa.
      <b>Ese es el punto: un beneficio que dura.</b></p>
    </div>
  </section>

  <section>
    <h2>Valores vigentes</h2>
    <div class="dek">Por pasajero. Actualizado el {bonito(dat["actualizado"])}.</div>

    <div class="tabla-wrap">
      <table>
        <caption>Destinos nacionales</caption>
        <thead><tr><th>Destino</th><th>Tiquete de referencia</th><th>Impuestos</th>
          <th>No bonificable</th></tr></thead>
        <tbody>{filas(dat["destinos"], "nacional")}</tbody>
      </table>
    </div>

    <div class="tabla-wrap">
      <table>
        <caption>Destinos internacionales</caption>
        <thead><tr><th>Destino</th><th>Tiquete de referencia</th><th>Impuestos</th>
          <th>No bonificable</th></tr></thead>
        <tbody>{filas(dat["destinos"], "internacional")}</tbody>
      </table>
    </div>

    <div class="nota">
      <div class="t">Cómo leer el tiquete de referencia</div>
      <p>Trvely actualiza las tarifas aéreas <b>todos los días</b>: el tiquete varía por fecha de
      salida y por temporada, y la cifra publicada es la <b>mediana de las salidas vigentes</b> del
      destino, con su rango debajo. <b>El valor que se descuenta en cada reserva es el del
      itinerario efectivamente cotizado</b>, y aparece desglosado en la cotización.</p>
      <p>Los <b>impuestos</b>, en cambio, son fijos por destino: son los de esta tabla.</p>
    </div>

    <p><b>Destinos no listados:</b> se incorporan a esta página con su tiquete de referencia e
    impuestos antes de la primera cotización bajo convenio.</p>
  </section>

  <section>
    <h2>Historial de variaciones</h2>
    <div class="dek">Cambios de tasas aeroportuarias, suplementos de temporada y ajustes de
      autoridad. Cuando un valor cambia, queda registrado aquí.</div>
    <ul class="hist">{hist}</ul>
    <p style="margin-top:1.2rem"><b>El porcentaje pactado en el convenio no cambia</b> cuando se
    actualiza un valor de esta tabla.</p>
  </section>

  <section>
    <div class="sello">
      <b>Origen de los datos.</b> Impuestos: {dat["fuente_impuestos"]}.
      Tiquetes: {dat["fuente_tiquetes"]}. Esta página es el anexo referido en los convenios
      empresariales de Trvely y hace parte integral de ellos.
    </div>
  </section>

</main>

<footer>
  <div class="wrap">
    <b>TRVELY SAS</b> &middot; NIT 901902687-9<br>
    RNT 232640 &middot; Agencia de Viajes Mayorista<br>
    trvely.com.co &middot; fichas.trvely.com.co
    <div class="lema">VIAJA FÁCIL, VIAJA TRVELY</div>
  </div>
</footer>

</body>
</html>"""
    destino = os.path.join(AQUI, "index.html")
    io.open(destino, "w", encoding="utf-8").write(html)
    print("OK -> %s  (%.1f KB)" % (destino, os.path.getsize(destino) / 1024))


if __name__ == "__main__":
    construir()
