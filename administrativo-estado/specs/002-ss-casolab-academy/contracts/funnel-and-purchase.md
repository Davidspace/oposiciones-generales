# Contract: embudo, pedido Bizum profesional y acceso

## Límites de confianza

- El navegador puede declarar interacción, nunca pago.
- Un aviso o una captura enviados por WhatsApp no prueban un abono.
- Solo una acción administrativa autenticada, después de comprobar el servicio bancario, puede registrar `payment_verified` y pasar un pedido a `paid`.
- Bizum debe ser un servicio profesional contratado y activo desde la primera venta. `professional_manual` significa conciliación humana, no uso entre particulares.
- `SS_CASOLAB_ORDERING_ENABLED=false` es el valor seguro y se mantiene mientras falte cualquier gate comercial, bancario o legal. No existe un alias alternativo.

## Eventos públicos

Todos incluyen `event_id`, `occurred_at`, `experiment`, `offer_variant`, `session_id`, ruta y UTM acotado:

- `landing_view`
- `diagnostic_start`
- `diagnostic_answered`, solo posición y corrección agregada
- `diagnostic_complete`
- `lead_submit`
- `order_form_start`
- `bizum_instructions_viewed`
- `whatsapp_click`

El endpoint público rechaza `payment_verified`, `purchase_confirmed`, `access_provisioned`, `access_revoked` y `refund_confirmed` aunque el cuerpo de la petición tenga un formato válido.

## Eventos de servidor

- `payment_reported`: el comprador dice haber pagado; no cambia a `paid`.
- `order_created`: el servidor ha persistido un pedido; nunca lo emite el navegador.
- `payment_verified`: un operador autorizado ha conciliado el abono.
- `purchase_confirmed`: consecuencia idempotente de `payment_verified`, nunca entrada del navegador.
- `access_provisioned`, `access_revoked`, `refund_confirmed`.

Las transiciones duraderas se registran en un ledger distinto por agregado:

- `order_events` referencia `orders` y solo admite estados de pago;
- `access_events` referencia `access_grants` y solo admite `pending | provisioned | failed | revoked`;
- `refund_events` referencia `refunds` y solo admite `pending | completed | failed`.

Cada fila usa `event_id` e `idempotency_key` únicos, estado anterior anulable, estado siguiente obligatorio del enum correspondiente, actor, `actor_id`, código de motivo, metadatos no sensibles y fecha. Los tres ledgers son append-only. `buyer` solo puede figurar en `order_events`; los cambios de acceso o devolución proceden de `system | david | alba`. David y Alba usan credenciales o identidades distintas cuando ambos operan el sistema.

## Captación

Un lead con seguimiento comercial guarda nombre, teléfono WhatsApp obligatorio, email opcional, fase, problema, consentimiento WhatsApp separado y atribución técnica. Si solo se facilita email, se limita a entregar el recurso solicitado y no activa seguimiento ordinario. No se pregunta por precio ni se añade a un grupo.

El servidor rechaza el alta si la captación está desactivada, incluso ante una llamada directa al endpoint.

## Creación del pedido

Antes del botón se muestran producto, inventario disponible, calendario, precio final e impuestos, duración, soporte, entrega, desistimiento/devolución y condiciones almacenables.

Entrada del comprador:

- nombre;
- email obligatorio para constancia contractual y recuperación de acceso;
- aceptaciones versionadas no premarcadas;
- consentimiento específico cuando se solicite inicio inmediato;
- atribución técnica acotada.

El servidor fija producto, versión e importe; crea `order_id`, referencia bancaria opaca, token de consulta independiente con al menos 128 bits, caducidad e idempotency key. No acepta el importe del navegador.

El botón usa una fórmula inequívoca, por ejemplo `Confirmar pedido de 49 € con obligación de pago`. El precio de 49 € es solo un valor de prueba hasta aprobar la oferta real.

## Estados de pago y acceso

```text
draft -> awaiting_payment
awaiting_payment -> payment_reported | paid | needs_review | expired | cancelled
payment_reported -> paid | needs_review | expired | cancelled
needs_review -> awaiting_payment | paid | cancelled
expired | cancelled -> needs_review   # solo operador ante pago tardío
paid -> refund_pending
refund_pending -> paid | refunded
```

`awaiting_payment -> paid` es válido si el operador ve el ingreso antes de que el comprador avise. Importe incorrecto, pago duplicado, ingreso sin referencia o pago tardío pasan por `needs_review` con un motivo estructurado. La devolución usa una entidad idempotente y solo termina en `refunded` cuando se verifica el abono. Ninguna transición reduce garantías o concede dos accesos con un mismo identificador bancario.

El acceso no forma parte de `Order.status`: `pending -> provisioned | failed | revoked`, `failed -> pending` y `provisioned -> revoked`. Solo se crea o reactiva para un pedido `paid`. `paid -> refund_pending` no exige revocar antes: un acceso `pending` o `provisioned` puede continuar temporalmente. La operación atómica que completa la devolución sí exige que no quede ningún acceso activo. Si nunca hubo acceso, no se crea un `revoked` artificial.

Si la devolución falla, `refund_pending -> paid` mantiene el acceso que siga activo. Si el acceso ya se revocó, no se reactiva el mismo registro: tras volver a `paid` puede crearse o reintentarse otro. El índice de unicidad cubre solo estados activos, por lo que admite historial sin permitir dos accesos simultáneos.

## Consulta y administración

- La consulta del comprador requiere referencia pública y token secreto; está limitada por frecuencia y solo muestra estado, caducidad y siguiente acción, nunca PII ni datos bancarios.
- Toda mutación administrativa de pedido, acceso o devolución exige secreto/identidad de operador, comparación temporal segura cuando aplique, estado esperado e idempotency key.
- La mutación y el evento del ledger correspondiente se escriben en una sola transacción. Repetir una clave no repite la transición ni crea otro evento; una clave ya consumida no puede emplearse para otra mutación.
- El sistema registra aprovisionamiento y revocación de acceso, incluida `accessRevokedAt` y el motivo.

La presencia del esquema, la migración y este contrato no da por implementados la autenticación ni el flujo administrativo de B006/B011. `SS_CASOLAB_ORDERING_ENABLED=false` continúa siendo obligatorio y no se autoriza ningún pago real.

## Confirmación durable

El negocio envía la información precontractual y la aceptación en soporte duradero antes de iniciar el servicio, y acusa la recepción conforme a los artículos 27 y 28 LSSI. Email es obligatorio en el pedido por decisión operativa y se usa para confirmación, factura, invitación inicial a Moodle, recuperación y avisos imprescindibles del servicio; WhatsApp sigue siendo el canal de atención. Confirmación contractual, comprobante de pago y factura son documentos distintos.

## Fallo seguro

- Sin identidad legal, contrato Bizum profesional, coste cero confirmado, privacidad, condiciones o revisión exigida: pedidos cerrados.
- Pago confirmado y Moodle caído: `Order=paid`, `AccessGrant=pending` o `failed`, cola manual y SLA visible.
- Aviso o captura sin abono: nunca `paid`.
- Evento o petición duplicados: éxito idempotente, sin duplicar pedido, pago o matrícula.
- Reembolso confirmado: comprobar que no queda acceso activo y registrar la revocación, cuando exista, y la devolución en una operación atómica.
- Sin referencia, importe distinto, duplicado o pago tardío: `needs_review`, sin acceso automático.
