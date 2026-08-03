# Estado de la cartera — 2026-08-03

## Alcance de esta revisión

Esta revisión solo modifica el clon local de `GAD6MU/oposiciones-generales`, en la rama `codex/portfolio-ux-foundation`. No se ha hecho push, despliegue ni escritura en Moodle.

No se ha creado contenido editorial nuevo. SS mantiene `ss-casolab/SS/` como fuente intocable; TAI sigue dependiendo del inventario externo del aula; C2 sigue siendo una superficie de validación.

## Destinos

| Superficie | Proyecto | Destino por defecto | Estado de código |
|---|---|---|---|
| Cartera común | `lorman-lab/` | `https://lorman-academia.vercel.app` | Hub independiente; cuatro destinos configurables |
| TAI | `tai-academia/` | `https://tai-academia.dgarmar.chatgpt.site` | Landing independiente |
| SS CasoLab | `ss-casolab/` | `https://ss-casolab.dgarmar.chatgpt.site` | Landing y corpus editorial separados |
| Administrativo del Estado C2 | `administrativo-estado/` | `https://administrativo-estado.dgarmar.chatgpt.site` | Landing de validación |
| Moodle | `lorman-lab/` → `/aula` | `https://aula.academialorman.es/course/view.php?id=2` | Destino configurable; no usa `sslip.io` |

Las URLs públicas pueden cambiarse sin editar las landings:

- Hub: `VITE_PORTFOLIO_URL`, `VITE_MOODLE_URL`, `VITE_TCAE_URL`, `VITE_TAI_URL`, `VITE_SS_URL`, `VITE_C2_URL`.
- TAI, SS y C2: `NEXT_PUBLIC_PORTFOLIO_URL`.

## Cambios verificados

- Enlace «Todos los cursos» en TAI, SS y C2.
- Skip link y `main` enfocable en las cuatro superficies.
- Metadata canonical en TAI, SS y C2.
- Fallback de `/aula` y redirect de Vercel actualizados a `aula.academialorman.es`.
- `.env.example` de TAI y C2 sin variables copiadas de SS o GSI.
- Pruebas estáticas de independencia y navegación en cada proyecto.

## Receipt de verificación

| Proyecto | Lint | Prueba de cartera | Build | Validación adicional |
|---|---|---|---|---|
| `lorman-lab/` | PASS | PASS | PASS | Typecheck PASS; Telegram 5/5 |
| `tai-academia/` | PASS | PASS | PASS | — |
| `ss-casolab/` | PASS | PASS | PASS | `content:validate` PASS: 36 temas, 36 módulos, 770 afirmaciones, 400 preguntas y 14 casos estructurados |
| `administrativo-estado/` | PASS | PASS | PASS | — |

## Próximo control antes de publicar

1. Configurar las variables públicas en el proyecto Vercel/Sites correcto.
2. Confirmar que `academialorman.es` apunta al hub y que `aula.academialorman.es` apunta al VPS de Moodle.
3. Abrir cada raíz pública y comprobar navegación, canonical, responsive y foco de teclado.
4. Revisar convocatoria, alcance, fuentes y condiciones comerciales antes de habilitar pagos.
