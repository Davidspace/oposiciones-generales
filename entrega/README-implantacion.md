# Implantación — rediseño Industry (2026-08-03)

Archivos listos para pegar en `Davidspace/oposiciones-generales`. Sustituyen al pase
anterior (ficha editorial con esquinas de cota y paleta única): ahora hay **un sistema
visual común con esquinas normales** y **una paleta sobria por producto**.

## Qué contiene

| Archivo | Para qué |
|---|---|
| `lorman-industry.css` | Hoja única del sistema: tokens, cabecera, hero, botones, cajones, fichas (dos por fila), preguntas y pie. Incluye las paletas por producto. |
| `FichaCurso.tsx` | Tarjeta de curso del hub: código grande, tipo de contenido, precio solo si está cerrado y un botón grande hacia su landing. |
| `Cajones.tsx` | Los cuatro cajones de cada landing (Temario, Test, Simulacros, Precio/Acceso). El de cierre lleva siempre **«Quiero apuntarme»**. |
| `CtaContacto.tsx` | Botón grande de WhatsApp con la marca, para la sección principal. |
| `Instagram.tsx` | Icono y enlace sutil de Instagram (`@tcae_academia_lm`). |
| `AvisoComun.tsx` | Pie legal común con enlaces, Instagram y los cuatro textos de aviso. |
| `MuestraMaterial.tsx` | Fila «Muestra del material»: páginas del temario (con pestañas si hay varias ramas) y preguntas tipo test en desplegables. |
| `assets/muestras/` | Páginas de muestra: `tai-1..4` (TAI), `sms-1..5` (Servicio Murciano de Salud) y `sas-1..4` (Servicio Andaluz de Salud). |
| `cursos.ts` | Datos de las fichas del hub, incluido Auxilio Judicial y la ficha C2 oculta. |
| `assets/lorman-logo.png` | Logotipo recortado, listo para `public/`. |

## Pasos

1. Copia `assets/lorman-logo.png` a `public/lorman-logo.png` en cada proyecto
   (`lorman-lab/client/public/`, `tai-academia/public/`, `ss-casolab/public/`,
   `auxiliar-juridico/public/`, `administrativo-estado/public/`).
2. Copia `lorman-industry.css` a cada proyecto e impórtalo **una vez**:
   - Next (`tai-academia`, `ss-casolab`, `administrativo-estado`): `app/globals.css` → `@import "./lorman-industry.css";` al principio.
   - Vite (`lorman-lab`, `auxiliar-juridico`): `src/index.css` o el entry.
3. Copia los `.tsx` a `components/` (Next) o `client/src/components/` (Vite).
4. Envuelve cada página en `<main className="lm-page lm-<producto>">` y usa
   `.lm-shell` para el ancho: `lm-hub`, `lm-tcae`, `lm-tai`, `lm-ss`, `lm-aux`.
5. Ejecuta en cada proyecto: `npm run lint && npm run test:portfolio && npm run build`.

## Añadido en este pase (2026-08-04)

- Se entrega el componente para una nueva fila **«Muestra del material»** en cada
  landing específica, a dos columnas
  simétricas: páginas del temario a la izquierda, preguntas tipo test en desplegables
  (cerrados por defecto) a la derecha.
- Copia `assets/muestras/*` a `public/muestras/` del proyecto correspondiente
  (TAI: `tai-*`; TCAE: `sms-*` y `sas-*`).
- Las preguntas van con **texto de relleno**: sustituir por los enunciados reales
  exportados del Moodle (`preguntas` de `MuestraMaterial`).
- SS y Auxilio Judicial se entregan con las páginas en hueco (`src` sin definir):
  se dibuja el marco «Página N» hasta que haya capturas.
- El enlace de Instagram de cabecera y pie usa ya el mismo color, familia y tamaño
  que los enlaces vecinos (antes iba en un gris distinto).

Este pase deja los componentes y recursos en `entrega/` como handoff. No conecta aún la
fila a las rutas públicas: TAI no tiene en este repositorio un banco de preguntas
publicable y las preguntas del ZIP son de relleno. La conexión se hará después de
incorporar preguntas revisadas desde la fuente editorial correspondiente.

## Reglas de contenido aplicadas

- Sin párrafos de introducción en las tarjetas y sin referencias al estado del
  contenido («curso terminado», «matrícula en preparación», «estado real»…).
- Etiquetas grandes: códigos de oposición a 40–54 px, titulares de contenido a
  21–34 px. Las cifras van en pequeño, al pie.
- **Sin botón de WhatsApp en la cabecera**: solo el de la sección principal y el
  «Quiero apuntarme» del cajón de cierre.
- Cabecera y pie llevan Instagram con icono, en tono discreto.
- Fichas del hub a dos por fila.

## Estado comercial que refleja esta entrega

- **TAI**: 95 € pago único, acceso hasta el día del examen. Temario (33 temas),
  tests/autoevaluaciones y simulacros teóricos **y prácticos**.
- **SS**: abierto. 49 € pago único de temario, tests y supuestos prácticos, con
  acceso hasta el día del examen. Ya no hay «edición fundadora» ni preventa.
- **TCAE**: abierto; el material se confirma según servicio de salud (sin precio publicado).
- **Auxilio Judicial**: solo tests (26 temas, 90 cuestionarios), sin temario.
- **Auxiliar Administrativo del Estado C2**: ficha **oculta** (`MOSTRAR_C2 = false`)
  hasta que el Moodle esté preparado.

## Estado del repo tras el pase anterior

- `tai-academia/app/tai/page.tsx` ya refleja `ACCESS_PRICE = "95 €"` y acceso hasta
  el examen. El acceso permanece cerrado hasta publicar el checkout.
- `ss-casolab/app/ss-casolab/page.tsx` ya refleja 49 € en pago único, sin preventa ni
  reserva. El acceso permanece cerrado hasta publicar las condiciones de contratación.
- `ss-casolab/app/globals.css` conserva selectores históricos sin ámbito para las rutas
  internas `/pedido` y `_sites-preview`; requieren una pasada visual independiente.

Las preguntas incluidas en el componente de muestra de este ZIP son de relleno. No se
deben publicar como preguntas reales: hay que sustituirlas por preguntas revisadas y
con procedencia antes de conectar `MuestraMaterial` a una landing pública.
