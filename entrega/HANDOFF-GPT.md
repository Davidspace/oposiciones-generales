# Guía de implantación — pásasela literal a GPT-5.6 (o quien haga el commit)

Repo: `Davidspace/oposiciones-generales` (rama `main`). Todo lo listado abajo está en la carpeta `entrega/` que te adjunto (zip). Tu trabajo es fusionarlo con el repo actual y hacer commit + push. No soy yo quien puede hacer el push — por eso te lo paso a ti.

## 0. Antes de nada

```bash
git checkout main && git pull
git checkout -b rediseno/industry-muestra-material
```

## 1. Mapa exacto de archivos → destino

| Origen (`entrega/`) | Destino en el repo | Acción |
|---|---|---|
| `lorman-industry.css` | copiar a **cada** proyecto: `lorman-lab/client/src/lorman-industry.css`, `tai-academia/lorman-industry.css`, `ss-casolab/lorman-industry.css`, `administrativo-estado/lorman-industry.css`, `auxiliar-juridico/lorman-industry.css` | copiar (mismo contenido, un archivo por proyecto) |
| `assets/lorman-logo.png` | `*/public/lorman-logo.png` en los 5 proyectos | copiar |
| `FichaCurso.tsx`, `Cajones.tsx`, `CtaContacto.tsx`, `Instagram.tsx`, `AvisoComun.tsx`, `MuestraMaterial.tsx` | `components/` (Next: `tai-academia`, `ss-casolab`, `administrativo-estado`) o `client/src/components/` (Vite: `lorman-lab`, `auxiliar-juridico`) | copiar, sobrescribiendo si ya existen |
| `cursos.ts` | `lorman-lab/client/src/data/cursos.ts` (o el path equivalente que ya use el hub) | reemplazar |
| `assets/muestras/*` (13 imágenes: `tai-1..4`, `sms-1..5`, `sas-1..4`) | `public/muestras/` del proyecto correspondiente: `tai-*` → `tai-academia/public/muestras/`; `sms-*` y `sas-*` → `lorman-lab/client/public/muestras/` (TCAE) | copiar |

**No toques** `ss-casolab` ni `auxiliar-juridico` para `muestras/` — sus imágenes aún no existen (ver §4).

## 2. Enganchar el CSS (una vez por proyecto)

- Next.js (`tai-academia`, `ss-casolab`, `administrativo-estado`): al principio de `app/globals.css` añade
  ```css
  @import "./lorman-industry.css";
  ```
- Vite (`lorman-lab`, `auxiliar-juridico`): añade el mismo `@import` al principio de `src/index.css`.

No dupliques el `@import` de la fuente de Google si el proyecto ya carga Barlow/Barlow Condensed por otra vía; revisa antes de pegar.

## 3. Envolver cada página

Cada landing debe envolver su contenido en:
```html
<main class="lm-page lm-<producto>">
  <div class="lm-shell lm-<superficie>"> ... </div>
</main>
```
donde `<producto>` es una de `hub | tcae | tai | ss | aux` (fija la paleta) y `<superficie>` una de `lm-hub | lm-tcae | lm-tai | lm-ss | lm-aux` (fija el ancho). Monta `MuestraMaterial` dentro de la landing de cada oposición, después de los `Cajones`, pasándole el array de páginas y preguntas de esa oposición (ver props en `MuestraMaterial.tsx`).

## 4. Pendiente que NO viene en esta entrega

- **SS y Auxilio Judicial**: `MuestraMaterial` para esos dos productos se deja con `src` sin definir en las páginas de temario → se renderiza el marco «Página N» vacío. Cuando yo tenga las capturas te las paso y solo hay que rellenar el array `paginas` con las rutas.
- Las preguntas tipo test de TAI/TCAE llevan texto de relleno: hay que sustituirlas por los enunciados reales exportados de Moodle en el prop `preguntas`.
- Cambios de negocio pendientes en el repo (no relacionados con el CSS/JS de esta entrega, decide con el usuario si aplicarlos ahora):
  - `tai-academia/app/tai/page.tsx`: `ACCESS_PRICE = "59 €"` → debería ser `"95 €"`, y el texto «12 meses de acceso» → «acceso hasta el día del examen».
  - `ss-casolab`: sigue en flujo de preventa/gates de pedido; pasar a precio cerrado 49 €.
  - `administrativo-estado`: superficie C2 sigue visible en el repo; en la maqueta va oculta hasta que el Moodle esté listo (usa el flag `MOSTRAR_C2`/`showC2` ya presente).

## 5. Verificación por proyecto

```bash
npm run lint && npm run test:portfolio && npm run build
```
Repite en los 5 proyectos que toques. Comprueba visualmente `/`, la landing de cada oposición y la fila «Muestra del material» en desktop y mobile (viewport 375px) — pestañas SMS/SAS del TCAE y desplegables de preguntas cerrados por defecto.

## 6. Commit y push

```bash
git add -A
git commit -m "Rediseño Industry: fila Muestra del material + fichas/CTA unificadas"
git push -u origin rediseno/industry-muestra-material
```
Abre PR contra `main`. No hagas squash de commits de negocio pendientes (§4) dentro de este PR — son ediciones aparte que el usuario debe confirmar primero.
