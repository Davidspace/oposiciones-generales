# Tasks: Navegación y límites coherentes de la cartera

**Input**: `spec.md`, `plan.md`

## Phase 1: Setup

- [x] T001 Crear los módulos públicos de URL en `lorman-lab/client/src/lib/portfolio-links.ts`, `tai-academia/lib/portfolio-links.ts`, `ss-casolab/lib/portfolio-links.ts` y `administrativo-estado/lib/portfolio-links.ts`.

## Phase 2: Foundational

- [x] T002 Documentar los fallbacks públicos y el alcance de las variables en `README.md` y los `.env.example` correspondientes, sin incluir secretos.
- [x] T003 [P] [US1] Corregir el contexto de producto de TAI en `tai-academia/CONTEXT.md` para que no describa SS CasoLab.
- [x] T004 [P] [US1] Corregir el contexto de producto de C2 en `administrativo-estado/CONTEXT.md` para que no describa SS CasoLab.

## Phase 3: User Story 1 — Navegación de cartera (P1)

- [x] T005 [US1] Añadir enlace «Todos los cursos» a `tai-academia/app/tai/page.tsx`, `ss-casolab/app/ss-casolab/page.tsx` y `administrativo-estado/app/page.tsx` usando la URL pública configurada.
- [x] T006 [US1] Añadir estados hover/focus y comportamiento responsive para los enlaces de cartera en `tai-academia/app/globals.css`, `ss-casolab/app/globals.css` y `administrativo-estado/app/globals.css`.

## Phase 4: User Story 2 — Accesibilidad de teclado (P1)

- [x] T007 [US2] Añadir skip link y `main` enfocable a las cuatro landings en `lorman-lab/client/src/pages/home.tsx`, `tai-academia/app/tai/page.tsx`, `ss-casolab/app/ss-casolab/page.tsx` y `administrativo-estado/app/page.tsx`.
- [x] T008 [US2] Añadir estilos de skip link/foco y soporte de movimiento reducido en `lorman-lab/client/src/index.css`, `tai-academia/app/globals.css`, `ss-casolab/app/globals.css` y `administrativo-estado/app/globals.css`.

## Phase 5: User Story 3 — Destinos operativos (P1)

- [x] T009 [US3] Sustituir el destino hard-coded de `/aula` en `lorman-lab/client/src/App.tsx` y `lorman-lab/vercel.json` por el Moodle canónico `https://aula.academialorman.es`.
- [x] T010 [US3] Centralizar los destinos de TCAE, TAI, SS y C2 del hub en `lorman-lab/client/src/lib/portfolio-links.ts` y actualizar `lorman-lab/client/src/pages/home.tsx`.

## Phase 6: User Story 4 — Metadata canonical (P2)

- [x] T011 [US4] Añadir `alternates.canonical` a la metadata raíz de TAI, SS y C2.
- [x] T012 [US4] Añadir pruebas estáticas de navegación, separación y canonical en los tres proyectos Next y una prueba de integridad para el hub.

## Phase 7: Polish & Verification

- [x] T013 Ejecutar la validación de fuentes existente en `ss-casolab` y comprobar ausencia de `sslip.io` en las rutas y configuración activas del laboratorio.
- [x] T014 Instalar dependencias solo cuando fue necesario y ejecutar lint, builds y pruebas relevantes de los cuatro proyectos.
- [x] T015 Revisar diff, rutas, metadata, responsive básico y estado Git; documentar límites en `README.md`, `DEPLOYMENT.md` y los contextos de producto sin cambiar contenido editorial.
