# Fuente en GitHub

repo: Davidspace/oposiciones-generales
branch: main

Acceso disponible: **solo lectura**. Puedo leer, buscar y traer archivos del repositorio,
pero no puedo hacer commit ni push desde aquí. Los archivos de implantación viven en
`entrega/` de este proyecto y se aplican manualmente (o vía Claude Code / tu editor).

## Last sync

date: 2026-08-03T17:25:05Z

### Updated in this project

- Maqueta `Landings Oposiciones.dc.html` rehecha con el sistema visual **Industry** (fondo técnico claro, acento acero, Barlow Condensed sobre Barlow, marcos blueprint con marcas de registro).
- Fichas más pequeñas y directas: sin párrafo de introducción, códigos (TCAE / TAI / SS) y etiquetas en tamaño grande, cifras en segundo plano y un botón grande por curso hacia su landing.
- Botón **Contactar por WhatsApp** con el logotipo de LORMAN en la cabecera y como acción principal del hero de las cuatro superficies (`assets/lorman-logo.png`, recortado del original aportado).
- TAI: pago único **95 €** con acceso hasta el día del examen; cuatro cajones Temario / Test / Simulacros / Precio; se añaden simulacros prácticos junto a los simulacros teóricos.
- TCAE: la carta muestra el tipo de contenido (temario por bloques, tests por tema, simulacros tipo examen) como información principal.
- Ficha de **Administración General del Estado · subgrupo C2 oculta** (Moodle aún no preparado); recuperable con el tweak `showC2`.
- Tweaks del componente: `showC2`, `taiPrice`, `whatsapp`.

### Diferencias con el repositorio (pendientes de aplicar)

- `tai-academia`: el repo mantiene `ACCESS_PRICE = "59 €"` y «12 meses de acceso»; la maqueta ya refleja 95 € de pago único con acceso hasta el examen.
- El repo mantiene visible la superficie C2 (`administrativo-estado/`); en la maqueta está oculta.
- Novedad upstream sin reflejo en la maqueta: proyecto `auxiliar-juridico/` (Auxilio Judicial C2, solo tests; 26 temas y 90 cuestionarios). Dime si quieres su ficha en el hub.

### Deuda conocida

- `ss-casolab/app/globals.css` conserva ~1.500 líneas de selectores de elemento sin ámbito heredados de la landing anterior. Conviene acotarlos bajo `.ss-page` cuando se pueda comprobar `/ss-casolab/pedido` y `_sites-preview`.

## Screen map

| Pantalla del proyecto | Archivos del repositorio |
|---|---|
| Hub común (maqueta) | `lorman-lab/client/src/pages/home.tsx`, `lorman-lab/client/src/index.css`, `lorman-lab/client/src/lib/portfolio-links.ts` |
| TAI C1 | `tai-academia/app/tai/page.tsx`, `tai-academia/app/page.tsx`, `tai-academia/app/globals.css` |
| SS C1 | `ss-casolab/app/ss-casolab/page.tsx`, `ss-casolab/app/globals.css` |
| TCAE | `lorman-lab/client/src/data/tcae-tests.ts`, `lorman-lab/client/src/pages/home.tsx` |
| Auxiliar del Estado C2 (oculto) | `administrativo-estado/app/page.tsx`, `administrativo-estado/app/globals.css` |
| Contexto de estado y destinos | `README.md`, `docs/PORTFOLIO-STATUS-2026-08-03.md` |

## Sync history

- 2026-08-03T12:22:40Z — Ficha editorial común, maqueta de las cuatro superficies, pie legal unificado y unificación visual de SS CasoLab (verde propio, fin del estilo fanzine).
