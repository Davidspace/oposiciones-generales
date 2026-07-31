# Inventario vivo — SS CasoLab

**Corte:** 30 de julio de 2026. El estado técnico se confirma mediante pruebas. Un borrador validado por herramientas no equivale a contenido revisado por Alba, un jurista u otra persona.

> **Estado comercial: CERRADO.** B006 tiene implementación local no activada; B011 y V009 están parciales. Los gates externos siguen abiertos: identidad y documentos definitivos, Bizum profesional, WhatsApp Business, Moodle, D1 remota, hosting, protección administrativa y revisiones humanas. V010 está bloqueada y requiere Gate 2 y autorización expresa antes de cualquier pago o devolución real.

## Disponible en el repositorio

| Activo | Evidencia | Estado |
|---|---|---|
| Landing y adaptador de `MC01` | `app/ss-casolab/`, `lib/ss-casolab.ts`, `lib/ss-casolab-source.ts`, `content-source/cases/MC01.json` | La fuente canónica y el adaptador existen; el borrador no se presenta como publicado |
| Gate del diagnóstico | `/api/ss-diagnostic`, `readPublicSsDiagnostic` y pruebas | La página obtiene el diagnóstico por un endpoint servido desde servidor. Mientras `MC01` siga en `draft` sin revisión humana, responde `publicable: false` y no entrega el borrador |
| Autocorrección | `scoreSsAttempt` y pruebas de paridad | `+1/−0,25/0`, blancos y feedback sobre las cinco preguntas canónicas; verificada localmente, no publicada por el gate actual |
| Captación | `/api/leads` y guardas de configuración | Cerrada por flag; no se acredita captura ni persistencia remota. El modelo heredado sigue pendiente de WhatsApp y retirada de `priceSignal` |
| Eventos públicos | `/api/events`, `lib/experiments.ts` y pruebas locales | Allowlist de tipos y metadatos, `eventId` UUID idempotente y rate limit. El navegador no puede declarar pedido, pago, acceso ni devolución; no se infiere despliegue D1 remoto |
| Máquina de pedidos | `lib/order-state.ts` y pruebas | Estados de pago y acceso separados; transiciones, incidencias y devolución en dos pasos probadas |
| Migración de pedidos | `db/schema.ts`, `drizzle/0003_ss_professional_bizum_orders.sql` y pruebas | Implementada y auditada localmente; aplica `0000–0003` en SQLite real con constraints, triggers y ledgers append-only separados para pedido, acceso y devolución. Aplicación en D1 remota sigue siendo gate de despliegue |
| API públicas de pedido | `/api/orders`, `/api/orders/status`, `/api/orders/report-payment`, `db/orders.ts` y pruebas | Implementación local parcial: crear, consultar y avisar de pago. El aviso solo produce `payment_reported`; pedidos en producción siguen deshabilitados y no hay evidencia de D1 remota |
| Página de pedido | `/ss-casolab/pedido`, `/api/orders/disclosures`, cookie HttpOnly y pruebas | Oferta y documentos se leen del servidor; crea referencia, muestra instrucciones, consulta estado y avisa de pago sin exponer el token de consulta al JavaScript. Falta inspección visual/E2E protegida y configuración externa real |
| Administración de pedidos | `/api/admin/orders/verify-payment`, librerías/store, contrato, ledgers, CLI y runbook | B006 está implementada y probada solo en local con controles de secreto, HMAC, estado esperado, idempotencia y auditoría. B011 valida un dry-run de verificación. Faltan activación segura, D1 remota, protección perimetral/rate limit distribuido, credenciales, acceso Moodle, devolución y reconciliación reales |
| Checkout legado | `/api/checkout` | Retirado: respuesta fija `410`, sin configuración ni CTA; `/api/orders` es el único propietario |
| Programa | `content-source/catalog.json` | 23 temas generales + 13 específicos validados |
| Esquemas editoriales | `content-source/schema/` | Módulo, afirmación normativa, pregunta y caso; exigen procedencia y changelog, y condicionan `published` a evidencias académicas/jurídicas según el riesgo |
| Validadores | `scripts/validate-ss-content.mjs`, `package.json` | Catálogo, grafo, procedencia, revisiones, módulos, afirmaciones, preguntas y casos; `npm run build` ejecuta `content:validate` antes de compilar |
| Informe editorial e impacto normativo | `scripts/report-editorial-progress.mjs` y pruebas | Genera progreso por estado/tema, revisiones vencidas, índice fuente→claims→activos y manifiesto SHA-256 |
| Exportador de preguntas | `scripts/export-moodle-questions.mjs` y pruebas | Moodle XML, cuatro alternativas, penalización, feedback, fuentes y manifiesto SHA-256; rechaza borradores |
| Exportador de módulos | `scripts/export-moodle-modules.mjs` y pruebas | Lección y repaso en HTML accesible, IDs/versiones y manifiesto SHA-256; rechaza borradores |
| Corpus editorial | `content-source/modules/`, `content-source/claims/`, `content-source/questions/` | 24 módulos en borrador (`G01`–`G11`, `G13`–`G18`, `S01`–`S07`), 192 preguntas de módulo y 444 claims trazables; validación automatizada global superada. No hay revisión humana ni publicación acreditadas |
| Casos estructurados | `content-source/cases/` | 3 casos en borrador: MC01, MC02 y CP01; CP01 contiene 15 preguntas principales y 3 de reserva |
| Borradores legales | `legal/` | Aviso, privacidad, almacenamiento, contratación, desistimiento, facturación y soporte con fuentes y placeholders; no publicables sin datos/revisión |
| Blueprint | `content/full-curriculum-blueprint.md` | Objetivo de 36 módulos, 288 preguntas, 8 MC, 4 CP y 2 SIM |
| Contratos | `contracts/` | Fuente→Moodle y Bizum profesional/manual |
| Pruebas | `tests/` | Scoring, gate del diagnóstico, HTML, validación/reporte editorial, exportación, deriva, eventos públicos, sesión de pedido, migración y API pública/administrativa local |

## Riesgos técnicos abiertos

| Riesgo | Consecuencia | Tarea |
|---|---|---|
| Las exportaciones no se han importado y reexportado en un Moodle real | La equivalencia extremo a extremo no está demostrada | E007, M001–M004 |
| Las API públicas de crear/estado/report-payment solo están verificadas localmente y la migración remota no está acreditada | No se puede abrir el flujo Bizum en producción | B004, B007–B010, V009–V010 |
| La confirmación y exportación semanal solo tienen evidencia local; acceso, devolución y reconciliación real siguen incompletos | No se puede operar un cobro real de extremo a extremo | B006, B011–B012 |
| El índice inverso cubre los activos presentes; la matriz normativa de 36 temas existe, pero sus decisiones aún requieren revisión humana | Un cambio normativo puede dejar fuera contenido todavía no aprobado | E009 y revisiones G/S/P |
| Ningún borrador tiene aprobación humana acreditada | El contenido valida estructuralmente, pero no es publicable | Revisiones G/S/P y V006 |
| La landing local ya expresa la oferta de academia completa, pero la versión nueva no acredita despliegue | La URL pública puede seguir sirviendo una versión anterior | V001, V007–V008 |
| Captación heredada pide email y guarda `priceSignal=not-asked` | Contrato incoherente con el nuevo embudo | B010 y migración de Contact |
| Pedido, conciliación, alta Moodle y devolución no están integrados ni probados con servicios reales | No existe recorrido comercial seguro | B004–B012, M006, V009–V010 |

## Contenido disponible y pendiente

Disponible como borrador interno validado:

- 24 de 36 módulos: `G01`–`G11`, `G13`–`G18` y `S01`–`S07`.
- 192 preguntas de módulo, ocho por módulo.
- 444 afirmaciones normativas con dependencias inversas.
- `MC01` y `MC02`: cinco preguntas conectadas cada uno.
- `CP01`: 15 preguntas principales y 3 de reserva.
- Total: 220 preguntas y 3 casos.

Pendiente:

- 12 módulos y 96 preguntas de módulo para alcanzar el mínimo de 288; las 28 preguntas de casos pertenecen al banco práctico y no reducen ese mínimo.
- Revisión humana de los 24 borradores existentes antes de publicarlos.
- Revisión académica/jurídica/normativa de `MC01`, `MC02` y `CP01`; creación de MC03–MC08, CP02–CP04 y SIM01–SIM02.
- Revisión humana de la matriz normativa, changelog y mapa inverso norma→activos.
- Importación, reexportación, backup y restauración en Moodle real.
- Revisión jurídica externa según el riesgo de cada lote.

Los archivos generados por IA permanecen en `draft` o revisión interna hasta que el estado y la evidencia acrediten las revisiones exigidas. No se atribuye revisión a Alba, a un jurista ni a otro tercero sin constancia real.

## Datos externos pendientes

- Moodle de Alba (`.mbz` sin usuarios o acceso temporal).
- Identidad, NIF, domicilio, contacto, impuestos, precio y política comercial.
- Contrato/alta y coste del servicio Bizum profesional.
- Número WhatsApp Business y horario.
- Email transaccional disponible.
- Revisor jurídico y legal/fiscal.
- Acceso al hosting existente.
- Aplicación comprobada de la migración en D1 remota y operación administrativa protegida.

Estos datos no impiden construir y verificar localmente. Sí impiden captación real, venta y publicación comercial.

## Definición de “listo”

`tasks.md` separa cuatro gates: verificación protegida de la beta, autorización previa del recorrido comercial, validación de 30 días y academia completa. V009 mantiene los pedidos de producción deshabilitados; solo V010, después de Gate 2 y con autorización expresa, puede habilitarlos. Una build verde no demuestra por sí sola revisión editorial, funcionamiento en Moodle, legalidad, cobro, acceso, soporte, restauración ni demanda.
