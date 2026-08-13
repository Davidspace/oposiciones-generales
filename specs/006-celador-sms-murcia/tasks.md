# Tasks: Celador SMS Murcia product

## Phase 1: Foundation

- [x] T001 Crear rama `codex/celador-sms-murcia` y preservar el estado limpio de `oposiciones-generales`.
- [x] T002 Extraer el ZIP en `_work/celador-sms-source` sin modificar el original y registrar fecha/hash.
- [x] T003 Crear inventario editorial con recuento real de temas, tests, simulacros y exámenes en `celador-sms-murcia/docs/content-audit.md`.
- [x] T004 Documentar fuentes oficiales, alcance y datos de convocatoria en `celador-sms-murcia/docs/opposition.md`.

## Phase 2: P1 — prueba y propuesta comercial

- [x] T005 [P] Crear modelo de contenido de prueba gratuita en `celador-sms-murcia/src/data/free-test.ts`.
- [x] T006 [P] Crear componente de prueba autocorregible en `celador-sms-murcia/src/components/FreeTest.tsx`.
- [x] T007 Crear eventos y atribución anónima en `celador-sms-murcia/src/lib/analytics.ts` y `src/lib/attribution.ts`.
- [x] T008 Crear landing responsive con hero, contenido, muestras, prueba, precios, FAQ y WhatsApp en `celador-sms-murcia/src/main.tsx`.
- [x] T009 Crear tests de contrato de copy, precios, fuentes, privacidad y navegación en `celador-sms-murcia/tests/landing.test.mjs`.

## Phase 3: P1 — hub y SEO

- [x] T010 Añadir `celador-sms-murcia` a `lorman-lab/client/src/data/cursos.ts` con precio de 90 € y práctica 45 €.
- [x] T011 Añadir destino `celadorSms` a `lorman-lab/client/src/lib/portfolio-links.ts` sin cambiar otros destinos.
- [x] T012 Añadir sitemap, robots, canonical, metadatos Open Graph y dominio provisional.
- [x] T013 Actualizar `lorman-lab/tests/portfolio-integrity.test.mjs` o cobertura equivalente para comprobar el enlace.

## Phase 4: P2 — operación y captación

- [x] T014 Crear `docs/marketing.md` con mensajes, segmentos, plan de 7/30 días y límites de contacto.
- [x] T015 Crear `docs/utm-links.md` con campañas para madre de Alba, grupos, WhatsApp, Telegram e Instagram.
- [x] T016 Crear `docs/crm-template.csv` sin datos personales reales.
- [x] T017 Crear `docs/moodle-readonly-map.md` con el mapa de módulos esperado y pasos manuales pendientes.

## Phase 5: Verification and release

- [x] T018 Ejecutar lint, typecheck, tests y build de la landing.
- [x] T019 Ejecutar tests y build del hub.
- [x] T020 Verificar que no aparecen secretos, contenido de otros productos ni rutas legacy.
- [x] T021 Desplegar la landing y el hub por los mecanismos autorizados de Vercel. El job de Celador SMS finalizó correctamente en la ejecución `31736480340`; el fallo global pertenece a otro proyecto.
- [x] T022 Verificar URL pública, HTTPS, eventos de analítica y preparar pasos DNS/Search Console si requieren acción del propietario. La URL propia, el alias Vercel, la ruta corta del hub, los recursos SEO y los eventos de consentimiento se verificaron públicamente.

## Gates externos pendientes

- [ ] T023 Solicitar la indexación de la portada y el sitemap en Google Search Console con la cuenta propietaria.
- [ ] T024 Añadir el identificador real de Microsoft Clarity en Vercel y comprobar su recepción tras aceptar el consentimiento.
- [ ] T025 Cargar el curso en Moodle después de copia de seguridad, revisión editorial/jurídica y autorización explícita; esta tarea queda fuera de esta rama.
