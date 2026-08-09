# Estado de la cartera — 2026-08-03

## Alcance de esta revisión

Esta revisión trabaja sobre `GAD6MU/oposiciones-generales`, en `main`, y mantiene Moodle en modo lectura. Se han creado despliegues independientes en Vercel para la landing común y Auxilio Judicial C2.

No se ha escrito en Moodle ni se han modificado fuentes editoriales de SS. Auxilio Judicial reutiliza únicamente el inventario visible del curso Moodle 11: 26 temas y 90 cuestionarios únicos.

## Destinos

| Superficie | Proyecto | Destino por defecto | Estado de código |
|---|---|---|---|
| Academia LORMAN (sitio principal) | `LORMANAcademia` (proyecto Vercel `academialorman-site`) | `https://academialorman.es` | Sitio principal independiente; el proyecto histórico `lorman-academia` se conserva y su alias antiguo sirve la misma versión con canonical nuevo |
| Cartera común | `lorman-lab/` | `https://lorman-lab.vercel.app` | Hub experimental; cinco destinos configurables |
| TAI | `tai-academia/` | `https://tai.academialorman.es` | Landing independiente |
| SS CasoLab | `ss-casolab/` | `https://ss.academialorman.es` | Landing y corpus editorial separados |
| Administrativo del Estado C2 | `administrativo-estado/` | `https://administrativo-estado.vercel.app` | Landing de validación |
| Auxilio Judicial C2 | `auxiliar-juridico/` | `https://auxiliojudicial.academialorman.es` | Landing independiente; solo tests. La URL de Vercel se conserva como compatibilidad |
| Moodle | `lorman-lab/` → `/aula` | `https://aula.academialorman.es/course/view.php?id=2` | Destino configurable; no usa `sslip.io` |

Las URLs públicas pueden cambiarse sin editar las landings:

- Hub: `VITE_PORTFOLIO_URL`, `VITE_MOODLE_URL`, `VITE_TCAE_URL`, `VITE_TAI_URL`, `VITE_SS_URL`, `VITE_C2_URL`, `VITE_AUX_JURIDICO_URL`.
- TAI, SS y C2: `NEXT_PUBLIC_PORTFOLIO_URL`.

## Cambios verificados

- Enlace «Todos los cursos» en TAI, SS y C2.
- Skip link y `main` enfocable en las cinco superficies.
- Metadata canonical en TAI, SS y C2.
- Fallback de `/aula` y redirect de Vercel actualizados a `aula.academialorman.es`.
- `.env.example` de TAI y C2 sin variables copiadas de SS o GSI.
- Auxilio Judicial declara 26 temas, 90 cuestionarios y límites de alcance sin copiar preguntas.
- Pruebas estáticas de independencia y navegación en cada proyecto.

## Receipt de verificación

| Proyecto | Lint | Prueba de cartera | Build | Validación adicional |
|---|---|---|---|---|
| `lorman-lab/` | PASS | PASS | PASS | Typecheck PASS; Telegram 5/5 |
| `tai-academia/` | PASS | PASS | PASS | — |
| `ss-casolab/` | PASS | PASS | PASS | `content:validate` PASS: 36 temas, 36 módulos, 770 afirmaciones, 400 preguntas y 14 casos estructurados |
| `administrativo-estado/` | PASS | PASS | PASS | — |
| `auxiliar-juridico/` | PASS | PASS | PASS | Typecheck PASS; inventario Moodle 11 PASS |

## Próximo control antes de publicar

1. Configurar las variables públicas en el proyecto Vercel/Sites correcto.
2. Confirmar que `academialorman.es` apunta al hub y que `aula.academialorman.es` apunta al VPS de Moodle.
3. Abrir cada raíz pública y comprobar navegación, canonical, responsive y foco de teclado.
4. Revisar convocatoria, alcance, fuentes y condiciones comerciales antes de habilitar pagos.
