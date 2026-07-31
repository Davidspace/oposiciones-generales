# Data model — SS CasoLab completo

## Principios

- Separar analítica anónima, contactos, pedidos, verificación de pagos y aprendizaje.
- No guardar credenciales bancarias, PIN, tarjeta, capturas ni narrativas personales.
- Precio y transiciones pertenecen al servidor.
- La fuente editorial versionada es canónica; Moodle es propietario del progreso del producto de pago.
- Preferir enums, referencias y agregados a texto libre.

## Entidades editoriales

### ProgramTopic

| Campo | Regla |
|---|---|
| `id` | `g-01`–`g-23` o `ss-01`–`ss-13` |
| `moduleId` | `G01`–`G23` o `S01`–`S13` |
| `stream` | `general` o `specific` |
| `number`, `programAnnex` | Posición y `I.A`/`I.B` |
| `officialTitle`, `shortTitle` | Epígrafe exacto y navegación editorial |
| `officialSource`, `sourceLocation` | BOE directo y localización |
| `updateRisk` | `low`, `medium`, `medium-high`, `high`, `very-high` |
| `owner`, `status`, `reviewedAt`, `nextReviewAt` | Gobierno editorial |

Unicidad: `id`, `moduleId` y `(stream, number)`.

### NormativeClaim

| Campo | Regla |
|---|---|
| `claimId`, `assetId`, `version` | Identidad trazable |
| `statement` | Afirmación breve, no copia extensa de la norma |
| `sourceUrl`, `sourceLocation` | Fuente oficial y punto exacto |
| `officialPublication` | Referencia BOE/EUR-Lex |
| `validFrom`, `validTo`, `legislationCutoffAt` | Vigencia y vista histórica |
| `owner`, `sourceCheckedAt`, `reviewStatus`, `reviewedAt`, `nextReviewAt` | Comprobación documental y responsabilidad de revisión |
| `dependentAssetIds` | Módulos, preguntas, feedbacks y casos afectados |

`validTo` puede ser nulo. Una modificación crea nueva versión y conserva la anterior; no duplica un banco histórico.

### LearningModule

| Campo | Regla |
|---|---|
| `moduleId`, `topicId`, `version` | Identidad |
| `learningOutcomes`, `decisions` | Resultados observables |
| `coverage` | `officialClause -> objective -> sectionId -> activityIds[]` |
| `lessonPath`, `reviewSheetPath` | Fuentes Markdown |
| `normativeClaimIds`, `questionIds`, `microcaseIds` | Relaciones |
| `academicReviewer`, `legalReviewStatus` | Gates independientes |
| `validFrom`, `validTo`, `legislationCutoffAt`, `nextReviewAt` | Ciclo normativo |
| `status` | Estado editorial |

Estados y transiciones:

```text
pending -> draft -> reviewed
reviewed -> external-review -> published
reviewed -> published                 # solo cuando la revisión externa no sea exigible
reviewed | external-review -> draft   # observaciones que requieren nueva versión
published -> retired
```

`retired` no es un paso obligatorio. Publicar exige cobertura completa, revisión académica y, para riesgo alto/muy alto o casos combinados, revisión jurídica externa aprobada.

### Question

Campos obligatorios:

- ID `g-NN-qNNN` o `ss-NN-qNNN`, versión y estado;
- temas, epígrafe, competencia y dificultad;
- enunciado, cuatro opciones, una clave y cuatro feedbacks;
- `normativeClaimIds`, fuente y referencia puntual;
- vigencia, corte de examen y visibilidad `practice | assessment-only`;
- tipo de error, repaso prescrito y grupo de reintento;
- autor, revisores, fechas y changelog.

### Case

Campos obligatorios:

- ID/version/tipo (`microcase`, `full-case`, `simulation`);
- escenario original, procedencia y supuestos declarados;
- temas, competencias y matriz de cobertura;
- preguntas ordenadas y reglas de consistencia;
- duración, puntuación, dificultad y visibilidad;
- `normativeClaimIds`, corte y revisiones académica/jurídica.

## Producto público

### AnonymousSession

ID opaco, experimento, variante, UTM acotados y marcas de tiempo. No se guardan IP ni fingerprint.

### PublicAttempt

Solo pertenece al microcaso o diagnóstico público. Moodle es propietario de los intentos del curso pagado.

| Campo | Regla |
|---|---|
| `id`, `sessionId` | Identidad anónima |
| `assetId`, `assetVersion` | Objetivo inmutable |
| `startedAt`, `submittedAt` | Fechas |
| `correct`, `wrong`, `blank`, `directScore` | Resultado |
| `weakTopicsJson`, `errorCountsJson` | Agregados |
| `retryOf` | Intento anterior opcional |

Solo pueden persistirse identificadores de opción; nunca relatos personales.

### Contact

La tabla existente `leads` se migra sin crear un segundo propietario.

| Campo | Regla |
|---|---|
| `id`, `name` | ID y nombre |
| `whatsapp` | E.164 obligatorio para un lead con seguimiento comercial por WhatsApp |
| `email` | Opcional en captación gratuita |
| `stage`, `challenge` | Valores enumerados |
| `whatsappConsentAt`, `privacyVersion` | Consentimiento demostrable |
| atribución | Sesión/UTM acotados |

El seguimiento comercial de un lead usa WhatsApp consentido. Un email sin WhatsApp solo puede emplearse para entregar el recurso solicitado y no crea seguimiento ordinario. No existe `priceSignal` en el contrato objetivo.

## Comercio

### Order

| Campo | Regla |
|---|---|
| `id`, `reference` | ID interno y referencia pública opaca |
| `lookupTokenHash` | Hash de token independiente de al menos 128 bits |
| `createIdempotencyKey` | Evita pedidos duplicados |
| `productId`, `offerVersion` | Producto/oferta |
| `amountCents`, `currency` | Fijados por servidor |
| `name`, `email` | Email obligatorio antes del pago |
| `whatsappSuffix` | Sufijo opcional solo para incidencias |
| `sessionId` | Atribución opcional |
| `status` | Máquina de estados |
| `termsVersion`, `privacyNoticeVersion` | Versiones de las condiciones y de la información de privacidad mostradas |
| `termsAcceptedAt`, `privacyNoticeProvidedAt` | Aceptación contractual y entrega de privacidad separadas |
| `marketingConsentAt`, `whatsappConsentAt` | Consentimientos opcionales separados; nunca premarcados |
| `digitalStartConsentAt`, `withdrawalAcknowledgedAt` | Consentimientos separados, si proceden |
| `expiresAt`, timestamps | Ciclo del pedido |

Estados:

```text
draft -> awaiting_payment
awaiting_payment -> payment_reported | paid | needs_review | expired | cancelled
payment_reported -> paid | needs_review | expired | cancelled
needs_review -> awaiting_payment | paid | cancelled
expired | cancelled -> needs_review   # solo operador ante pago tardío observado
paid -> refund_pending
refund_pending -> paid | refunded
```

Un operador puede ejecutar `awaiting_payment -> paid` si ve el abono antes del aviso. Un comprador nunca crea `paid`, no cancela después de declarar pago y no reabre pedidos vencidos. Los códigos de `needs_review` incluyen `wrong_amount`, `missing_reference`, `duplicate_payment`, `late_payment` y `unmatched_payment`. `refunded` solo se alcanza después de verificar la operación de devolución.

### PaymentReport

Aviso del comprador: pedido, canal, fecha, sufijo opcional, idempotency key y huella normalizada de la petición. No contiene captura y no prueba pago.

### PaymentVerification

| Campo | Regla |
|---|---|
| `id`, `orderId` | Identidad |
| `providerReferenceHmac`, `providerReferenceHmacVersion` | HMAC y versión de clave del identificador estable del servicio profesional; son obligatorios para `matched` |
| `observedAmountCents`, `observedAt` | Datos mínimos de conciliación |
| `result`, `reasonCode` | `matched | needs_review | rejected` |
| `verifiedBy`, `verifiedAt` | Operador individual |
| `idempotencyKey`, `requestFingerprint` | Repetición segura; misma clave con contenido distinto se rechaza |

No guardar concepto completo, nombre bancario, IBAN o captura. Disponer de un identificador estable y único para cada cobro es un gate duro: si el proveedor no lo entrega, no se puede registrar `matched`, el pedido no pasa a `paid` y la venta permanece cerrada. El sistema no inventa una referencia ni sustituye este control con una captura o una mera segunda mirada.

### AccessGrant

| Campo | Regla |
|---|---|
| `id`, `orderId`, `moodleUserId`, `courseId` | Identidad |
| `status` | `pending | provisioned | revoked | failed` |
| `provisionedAt`, `revokedAt` | Fechas |
| `provisionedBy`, `revokedBy`, `reasonCode` | Trazabilidad |

Un pedido tiene como máximo un acceso activo (`pending` o `provisioned`), pero puede conservar varios registros históricos `failed` o `revoked`.

La máquina de acceso es independiente: `pending -> provisioned | failed | revoked`, `failed -> pending` y `provisioned -> revoked`. Crear o reactivar `pending` o `provisioned` requiere un pedido `paid`. Un acceso que ya estaba activo puede permanecer temporalmente cuando el pedido pasa de `paid` a `refund_pending`. Completar la devolución exige que no quede ningún acceso activo; no exige que exista un registro `revoked` cuando nunca hubo acceso. Si la devolución falla, `refund_pending -> paid` conserva el acceso que siga activo. Un acceso ya revocado no se reactiva de forma implícita: después de volver a `paid` se crea o reintenta un registro distinto.

### Refund

Registra pedido, importe, estado `pending | completed | failed`, HMAC versionada del identificador externo, operador, fechas, motivo, idempotency key y huella de petición. La HMAC es obligatoria para `completed`. El estado financiero no pasa a `refunded` hasta que esta operación figure como `completed` y no quede ningún acceso `pending` o `provisioned`. La revocación y la finalización se ejecutan en una misma transacción cuando existe acceso; si nunca existió, no se fabrica un registro `revoked`.

### Ledgers de eventos de estado

Cada agregado conserva su propio ledger append-only; ningún ledger mezcla estados de otro agregado:

| Agregado | Ledger y referencia | Estados admitidos |
|---|---|---|
| `Order` | `OrderEvent.orderId -> Order.id` | Solo estados de pago: `draft | awaiting_payment | payment_reported | needs_review | paid | refund_pending | expired | cancelled | refunded` |
| `AccessGrant` | `AccessEvent.accessGrantId -> AccessGrant.id` | Solo estados de acceso: `pending | provisioned | failed | revoked` |
| `Refund` | `RefundEvent.refundId -> Refund.id` | Solo estados de devolución: `pending | completed | failed` |

Los tres ledgers guardan `id`, `eventId` único, `previousStatus` anulable para el evento inicial, `nextStatus` obligatorio, `actorType`, `actorId`, `reasonCode`, `idempotencyKey` único, `metadataJson` sin datos sensibles y `createdAt`. `OrderEvent` admite `buyer | system | david | alba`; `AccessEvent` y `RefundEvent` solo admiten `system | david | alba`. Las filas no se actualizan ni eliminan.

Toda mutación administrativa de `Order`, `AccessGrant` o `Refund` debe exigir una clave de idempotencia y escribir, en la misma transacción, el nuevo estado y un único evento en el ledger del agregado. Repetir la clave no puede repetir la transición ni crear otro evento. Estas tablas fijan el contrato de persistencia: no dan por implementados la autenticación ni el flujo administrativo de B006/B011, no abren pedidos y no autorizan un pago real.

## Métricas

### FunnelEvent

El endpoint público solo admite interacción: `landing_view`, `offer_view`, diagnóstico, `lead_submit`, `order_form_start`, `bizum_instructions_viewed` y `whatsapp_click`. El checkout alojado y su evento se han retirado. `order_created` nace exclusivamente en el servidor al persistir un pedido.

`payment_verified`, `purchase_confirmed`, `access_provisioned`, `access_revoked` y `refund_confirmed` son eventos exclusivos de servidor. Los metadatos no incluyen teléfono, nombre, email, datos bancarios ni texto de respuesta.

### MoodleMetricsImport

Importación semanal agregada: periodo, curso, alumnos activos, módulos/casos iniciados y completados, simulacros y tiempo de soporte asociado. Guarda hash de archivo, importador y fecha; no copia intentos individuales a D1.

## Configuración

El servidor posee flags de venta/captación, precio, moneda, destino WhatsApp, modo `professional_manual`, etiqueta Bizum profesional, versiones de documentos, secretos separados de administración/consulta y configuración Moodle. El cliente solo recibe valores públicos de una oferta activa.

## Conservación y relaciones

- Analítica, contactos y soporte usan plazos publicados y supresión demostrable.
- Pedidos, facturas y auditoría siguen los plazos fiscales/legales validados; el audit log no se reescribe.
- Los intentos públicos se eliminan según privacidad; Moodle aplica su propia retención al aula.
- Una norma se relaciona con todos los activos dependientes; un cambio genera inventario de impacto.
- Una sesión puede generar intento, contacto o pedido; un contacto puede tener varios pedidos.
- WhatsApp referencia un pedido, pero no es el registro canónico.

Los periodos exactos permanecen como placeholders hasta completar identidad y revisión jurídica externa.
