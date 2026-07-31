# Implementation Plan: Academia completa SS CasoLab

**Branch**: `codex/ss-academy-full` | **Date**: 2026-07-30 | **Spec**: [spec.md](spec.md)

> **Estado operativo: construcción local; venta cerrada.** B006 tiene implementación local no activada; B011 y V009 están parciales, y ninguna está verificada de extremo a extremo. Identidad, documentos definitivos, Bizum profesional, WhatsApp Business, Moodle, D1 remota, hosting, protección administrativa y revisiones humanas son gates externos. V010 no puede ejecutarse sin Gate 2 y autorización expresa para la operación monetaria.

## Goal

Construir una academia asíncrona y recuperable para los 36 temas de Administrativo de la Seguridad Social C1, con entrenamiento específico del supuesto, pago Bizum verificable, comunicación individual por WhatsApp y ninguna compra nueva.

## Architecture

La fuente editorial versionada genera materiales legibles y bancos importables en Moodle. La landing debe demostrar el método con un microcaso solo cuando el gate editorial lo autorice. Un pedido crea una referencia opaca y permanece pendiente hasta que una persona autorizada reconcilia el ingreso Bizum. WhatsApp inicia conversaciones con mensajes prellenados y respuestas rápidas; no actúa como base de datos, confirmador de pagos ni aula.

## Tech Stack

- TypeScript, React, vinext/Vite y Cloudflare Workers.
- Esquema, migraciones y bindings Cloudflare D1 presentes en código; la migración de pedidos no está acreditada en D1 remota.
- Moodle previsto como aula y destino de importaciones; faltan acceso, auditoría, importación y restauración en una instancia real.
- Markdown y JSON versionados como fuente editorial.
- Moodle XML para importar preguntas con feedback por alternativa.
- Constructor local de enlaces `wa.me`; número, perfil y prueba en una cuenta WhatsApp Business real siguen pendientes. No hay API de pago. Email solo para constancia contractual, factura, invitación inicial a Moodle, recuperación y avisos imprescindibles del servicio.
- Bizum mediante el canal autorizado por la entidad del vendedor; en la primera versión, confirmación humana explícita.

## Baseline / Authority Refs

- [Especificación](spec.md).
- [Convocatoria BOE-A-2025-27158](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-27158).
- [Corrección BOE-A-2026-5351](https://www.boe.es/buscar/doc.php?id=BOE-A-2026-5351).
- Portal y criterios del tribunal enlazados en [research.md](research.md).
- [Contexto del proyecto](../../CONTEXT.md).
- Objetivo vigente del propietario: teoría y práctica completas, Bizum, WhatsApp y cero gasto.

## Compatibility Boundary

- La lógica y paridad local del microcaso deben conservarse durante la migración; su entrega pública permanece bloqueada mientras `/api/ss-diagnostic` responda `publicable: false`.
- GSI Caso 0 no se amplía y puede retirarse de la portada solo en un cambio separado y verificable.
- Los datos existentes de leads y eventos no se borran.
- La venta permanece cerrada hasta que identidad, condiciones, Bizum, WhatsApp y Moodle sean reales.
- El cambio de checkout alojado a Bizum no mantiene dos mecanismos de pago activos: la URL de checkout anterior se retirará al activar el nuevo contrato.

## TDD Route

- **Mode**: off.
- **Decision**: skipped.
- **Strict authority**: not applicable.
- **Test posture**: validadores editoriales, pruebas unitarias y regresión posterior a cada cambio; pruebas de integración para estados críticos.
- **Reason**: el proyecto no exige TDD estricto, pero pagos, contenido y privacidad requieren verificación proporcional.
- **Verification**: `npm run build` ejecuta primero `npm run content:validate`; además se exigen `npm run lint`, `npm test`, pruebas E2E y checklists de publicación.

## Requirement Ready Check

- **Requirement source refs**: objetivo vigente, `spec.md`, convocatoria y corrección.
- **Goals and scope refs**: 36 temas, supuesto, Bizum, WhatsApp, sin gasto.
- **Acceptance refs**: historias 1–8 y SC-001–SC-014.
- **Open blocker questions**: identidad/documentos definitivos, alta y coste de Bizum profesional, WhatsApp Business, Moodle, D1 remota, hosting Sites, protección/rate limit administrativo y revisiones humanas.
- **Decision**: ready para toda tarea local y editorial; activación externa permanece cerrada.

## Change Necessity

- **User-visible need**: el repositorio ya modela el programa de 36 temas y ocho borradores, pero aún no ofrece un corpus revisado/publicable ni un recorrido comercial seguro; el checkout alojado está retirado y las API públicas de pedido solo tienen evidencia local parcial. El email se conserva para confirmaciones transaccionales, invitación Moodle y recuperación.
- **No-change option**: documentos manuales y conversaciones sueltas no permiten trazabilidad, importación, pedidos o mantenimiento normativo.
- **Why code change is necessary**: se necesitan catálogo de 36 temas, validación, pedidos idempotentes, configuración segura y enlaces WhatsApp atribuibles.
- **Minimum boundary**: fuente editorial, validadores/exportadores, esquema de pedidos, APIs de pedido/confirmación, landing y documentación operativa.
- **Decision**: code-change.

## Existence and Owner Check

Estado comprobado en el repositorio el 30 de julio de 2026. «Existe localmente» no acredita despliegue, configuración externa, revisión humana ni publicación.

| Superficie | Evidencia actual | Estado y decisión |
|---|---|---|
| Programa y fuente editorial | `content-source/catalog.json`, `modules/`, `claims/`, `questions/`, `cases/`, schemas y reporte | Existe una fuente versionada con procedencia/changelog, gates condicionales de revisión e índice normativo; hay ocho módulos en borrador y ninguno está aprobado/publicado |
| `MC01` y diagnóstico | `content-source/cases/MC01.json`, `lib/ss-casolab-source.ts`, `/api/ss-diagnostic` | Fuente canónica y adaptador existentes. El endpoint es el gate servido desde servidor y responde `publicable: false` mientras el caso siga en `draft` sin revisión humana |
| Exportación Moodle | `scripts/export-moodle-questions.mjs`, `scripts/export-moodle-modules.mjs` y pruebas | Exportadores locales existentes; importación, reexportación, backup y restore en Moodle real siguen pendientes |
| Pedidos públicos | `/ss-casolab/pedido`, `/api/orders/disclosures`, `/api/orders`, `/api/orders/status`, `/api/orders/report-payment`, cookie HttpOnly y pruebas | Implementación local parcial de oferta, aceptaciones, creación, consulta y aviso. El token no se entrega al JavaScript y `report-payment` solo deja `payment_reported`; faltan E2E protegido, D1 remota y configuración real |
| Administración de pedidos | Endpoint B006, contrato, máquinas, ledgers, CLI y runbook | La verificación local usa secretos separados, comparación constante, HMAC, estado esperado, idempotencia y batch con ledger. B006 no está activada ni probada en D1 remota; B011 solo cubre el dry-run de verificación. Faltan protección perimetral/rate limit distribuido, acceso Moodle, devolución y reconciliación reales |
| Pago/oferta anterior | `/api/checkout` | Retirado con `410`; no reintroducir un segundo propietario del pedido |
| Eventos y captación | `/api/events`, `/api/leads`, `db/events.ts` y pruebas locales | Guardas locales presentes; captación real y persistencia remota no están acreditadas y siguen cerradas por flags |
| WhatsApp | `buildWhatsappUrl` y pruebas de URL `wa.me` | Constructor seguro local existente; número, perfil, 2FA, carga de plantillas y prueba en cuenta real siguen bloqueados externamente |
| Moodle | Contratos, exportadores y artefactos fuente | Integración real, estructura, roles, métricas, alta y recuperación siguen bloqueados por acceso externo |

## Architecture Integrity Lens

- **Invariant**: solo una fuente editorial y solo una confirmación autorizada pueden producir contenido publicado o pedido pagado.
- **Canonical owners**: catálogo para programa; orden para pago; Moodle para entrega; WhatsApp para conversación.
- **Overlap to retire**: checkout URL alojado y secuencias de marketing por email como canal ordinario.
- **Higher-level simplification**: generar teoría y preguntas Moodle desde la fuente versionada en lugar de mantener copias distintas en archivos y aula.
- **Verdict**: proceed con migración explícita y sin fallbacks silenciosos.

## Complexity Budget

| Artefacto | Presión actual | Límite de diseño |
|---|---|---|
| `app/ss-casolab/page.tsx` | Alto; mezcla diagnóstico, captación y oferta | Extraer oferta, pedido y WhatsApp en componentes/servicios separados |
| `lib/ss-casolab.ts` | Bajo-medio; conserva scoring y compatibilidad | Mantener scoring; adaptar contenido únicamente desde la fuente canónica y respetar el gate server-only |
| `db/leads.ts` / `db/events.ts` | DDL y escritura mezclados | Nuevas tablas solo mediante migración; retirar DDL dinámico en tarea separada |
| `catalog.json` | 36 entradas con streams y referencias | Mantenerlo como índice del programa, sin incrustar todo el contenido |

## Product Architecture

### Nivel gratuito

- Landing y tres variantes de mensaje.
- Microcaso de cinco decisiones sin registro.
- Feedback de cuatro alternativas, error, repaso y reintento.
- CTA opcional a WhatsApp y pedido; no grupo comunitario.

### Producto completo

- 23 módulos generales para el test.
- 13 módulos específicos para test y supuesto.
- Mínimo de ocho preguntas revisadas por módulo.
- Ocho microcasos, cuatro supuestos de 15 preguntas y dos simulacros configurados desde el banco.
- Diagnóstico, rutas por errores, finalización y reintentos.
- Seis meses de acceso como hipótesis comercial hasta decisión final.

### Operación

- Dos ventanas semanales de WhatsApp.
- Respuestas rápidas, etiquetas y FAQ.
- Verificación Bizum en lote una o dos veces al día durante lanzamientos.
- Alta Moodle manual con checklist hasta disponer de una integración gratuita y segura.
- Registro de tiempo: máximo de seis horas de cobro/alta por 100 ventas nuevas, cuatro horas mensuales de soporte por 100 alumnos activos y ocho horas mensuales de mantenimiento editorial ordinario para toda la cohorte.

## Data and Contracts

### Editorial

- `catalog.json`: programa, streams, riesgo y estado de 36 temas.
- `modules/`: manifiestos y contenidos versionados, uno por tema.
- `questions/`: preguntas estructuradas y sus cuatro feedbacks.
- `cases/`: contextos, decisiones y relaciones.
- `claims/`: afirmaciones normativas con fuente, vigencia y activos dependientes.
- `reviews/`: revisión académica/jurídica sin datos de alumnos.
- Exportación solo de activos con estado publicable.

### Pago del pedido Bizum

Estados permitidos:

`awaiting_payment → payment_reported | paid | needs_review | expired | cancelled`

`payment_reported → paid | needs_review | expired | cancelled`

`needs_review → awaiting_payment | paid | cancelled`

`expired | cancelled → needs_review` solo por un operador que observe un pago tardío.

`paid → refund_pending → refunded`; si la devolución falla, `refund_pending → paid`.

El acceso usa otra máquina: `pending → provisioned | failed | revoked`, `failed → pending` y `provisioned → revoked`. Solo se crea o reactiva un acceso activo para un pedido `paid`. Un acceso `pending` o `provisioned` puede permanecer activo mientras el pedido está en `refund_pending`, pero debe quedar revocado antes de completar la devolución. Si la devolución falla, el acceso que siga activo continúa; un acceso ya revocado no se reactiva y se crea o reintenta otro registro cuando el pedido vuelve a `paid`. Solo puede existir un acceso activo por pedido, aunque se conservan los registros históricos.

Reglas:

- referencia pública única y token secreto de consulta independiente;
- importe fijado en servidor;
- confirmación idempotente con actor y fecha;
- el mensaje de WhatsApp no cambia el estado de pago;
- no se almacenan capturas ni credenciales bancarias;
- reconciliación semanal de pedido, ingreso y acceso.

### WhatsApp

- Número E.164 solo desde configuración.
- Mensajes prellenados con referencia, nombre del producto y tipo de consulta.
- El teléfono del alumno no se copia a pedidos por defecto; solo se guarda en captación consentida o como sufijo mínimo para resolver una incidencia.
- Respuestas académicas reutilizables y derivación a FAQ.
- Sin API, chatbot, scraping, grupo o automatización no autorizada.

## Source and Normative Governance

- Cada tema enlaza epígrafes oficiales y normas consolidadas.
- Cada afirmación conserva `claimId`, activo, norma, localización, publicación oficial, `validFrom`, `validTo`, `legislationCutoffAt`, responsable, estado, próxima revisión y activos dependientes.
- Riesgo bajo: revisión por convocatoria.
- Riesgo medio: revisión trimestral y al publicarse convocatoria.
- Riesgo alto/muy alto: revisión mensual durante producción y antes de cada publicación.
- Temas con cuantías o parámetros anuales separan regla estable y valor por año.
- La IA prepara borradores; Alba aprueba claves y pedagogía; un jurista revisa antes de publicación los temas de riesgo alto/muy alto y todos los casos que combinen normas.

## Moodle Architecture

Estructura objetivo:

1. Inicio y cómo usar el curso.
2. Diagnóstico inicial.
3. Bloque general, temas G01–G23.
4. Bloque específico, temas S01–S13.
5. Microcasos.
6. Supuestos completos.
7. Simulacros.
8. Registro de errores y repaso.
9. Actualizaciones, FAQ y soporte.

Configuración por defecto:

- alternativas barajadas;
- intentos de aprendizaje con feedback inmediato y simulacros con feedback diferido;
- categorías por bloque, tema, competencia, riesgo y versión;
- finalización por contenido y actividad;
- sin plugins no indispensables;
- exportación de teoría a HTML/libro y preguntas a Moodle XML, prueba de deriva y copia `.mbz` periódica sin usuarios.

## Legal and Safety Boundary

- Preparar borradores de aviso legal, privacidad, cookies, contratación, desistimiento, devoluciones, impuestos y soporte con campos marcados.
- No activar datos o ventas sin identidad y datos fiscales reales.
- No cobrar mediante Bizum entre particulares. La primera venta requiere contrato o alta profesional; si implica gasto nuevo no autorizado, la venta permanece cerrada.
- No proporcionar asesoramiento individual sobre prestaciones, afiliación, cotización o recaudación.
- Minimizar datos y separar evento analítico, contacto, pedido y actividad académica.

## Execution Batches

### Batch A — Autoridad y herramientas

- Actualizar spec, plan, tareas, contratos y matriz.
- Modelar 36 temas y validar cobertura.
- Crear plantillas, manifiestos y exportadores de teoría y preguntas para Moodle.
- Cerrar borradores legales y runbooks no dependientes de identidad.

### Batch B — Contenido general

- Producir G01–G23 en lotes de 4–5 temas.
- Añadir ocho preguntas por tema.
- Revisar cada lote antes de continuar.

### Batch C — Contenido específico y práctico

- Integrar el avance de Alba en S01–S13.
- Completar ocho preguntas por tema.
- Crear casos y simulacros con revisiones separadas.

### Batch D — Bizum y WhatsApp

- Migración de pedidos, APIs, configuración y pruebas.
- CTA WhatsApp, respuestas rápidas, etiquetas y runbook.
- Páginas de pedido, instrucciones, estado y devolución.

### Batch E — Aula y publicación

- Auditar Moodle, importar, configurar progreso y probar restauración.
- Activar datos y ventas solo tras completar campos externos.
- Desplegar, ejecutar recorrido real y reconciliar el primer pago.

## Verification

Por lote:

```powershell
npm run build # incluye content:validate antes de compilar
npm run lint
npm test
git diff --check
```

Antes de venta:

- prueba de que `/api/ss-diagnostic` devuelve `publicable: false` y no entrega el borrador `MC01` mientras falte revisión humana;
- prueba de pedido desactivado;
- prueba de referencia e importe fijados en servidor;
- prueba de confirmación no autorizada e idempotente;
- prueba de que WhatsApp no marca pagos;
- prueba de acceso solo tras `paid`;
- revisión móvil, teclado, contraste y lectores;
- importación Moodle XML en aula de prueba;
- restauración de una copia sin usuarios;
- checklist legal, académico, normativo y comercial.

## Risks and Mitigations

| Riesgo | Nivel | Mitigación |
|---|---:|---|
| Error jurídico en 36 temas | Crítico | Lotes pequeños, fuente directa, validador, revisión por riesgo |
| Usar Bizum no profesional o con gasto no autorizado | Crítico | Contrato/alta y coste previos; venta cerrada por defecto |
| Confundir mensaje con pago | Crítico | Estado separado y confirmación autorizada |
| Soporte diario por WhatsApp | Alto | Canal individual, ventanas, FAQ, etiquetas y límites |
| Duplicar material de Alba | Alto | Auditar Moodle antes de integrar los específicos |
| Mantener dos fuentes de preguntas | Alto | Exportación unidireccional desde `content-source` |
| Producir demasiado sin demanda | Alto | Publicación por lotes y medición, aunque el corpus completo pueda prepararse en borrador |
| Datos personales innecesarios | Alto | Captura cerrada, minimización y eventos agregados |
| Despliegue inaccesible | Alto | Mantener rama verificable y no crear sitio duplicado sin autorización |

## Plan Pressure Test

- **Owner / contract / retirement**: pedidos tienen dueño propio; se retira el checkout alojado; email queda obligatorio solo en pedidos y opcional en leads, para usos transaccionales incluida la invitación a Moodle.
- **Architecture integrity**: contenido sale de una única fuente a Moodle.
- **Verification scope**: cubre contenido, pedido, WhatsApp, aula y producción.
- **Task executability**: se divide por archivos y lotes independientes.
- **Pressure result**: proceed; los datos externos solo bloquean activación, no construcción.

## Execution Readiness View

- **Intent Lock**: academia completa, Bizum, WhatsApp, cero gasto.
- **Scope Fence**: turno libre; teoría y práctica; sin asesoramiento personal.
- **Baseline Lock**: BOE, normas oficiales y catálogo versionado.
- **Approved Behavior**: pedido pendiente y verificación manual transparente.
- **Owner Constraints**: Alba aprueba contenido; David valida venta y accesos; IA produce y verifica; externo revisa riesgo.
- **Compatibility Boundary**: lógica y paridad de `MC01` siguen verdes localmente, pero el gate server-only impide entregar el borrador; venta continúa cerrada hasta configuración real.
- **Retirement Boundary**: checkout alojado retirado con `410`; no reintroducirlo. Retirar email de marketing ordinario, no la confirmación contractual ni la recuperación.
- **Task Batches**: A–E anteriores.
- **Test Obligations**: comandos, integración, E2E, Moodle y reconciliación.
- **Review Gates**: editorial, normativa, legal y comercial.
- **Drift Rules**: retroceder si aparece pago, plugin o soporte diario no autorizado.
- **Evidence Before Completion**: cada requisito debe tener archivo, prueba, comportamiento renderizado o estado externo directo.
- **Advisory Boundary**: guía de ejecución; no concede por sí sola la publicación.
