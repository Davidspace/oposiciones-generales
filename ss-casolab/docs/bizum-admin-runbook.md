# Runbook de conciliación Bizum profesional

**Estado:** local, sin credenciales ni operaciones reales.  
**Límite:** este procedimiento confirma un ingreso; no crea ni revoca por sí solo el acceso a Moodle.

## Gate previo

No se ejecuta `--execute` hasta que estén acreditados el servicio Bizum profesional, la identidad y condiciones del vendedor, la migración D1 remota, la revisión jurídica, el número WhatsApp Business y el recorrido Moodle. Un aviso del comprador o una captura nunca prueban el pago.

El interruptor administrativo es independiente del interruptor de nuevas ventas. Así se pueden conciliar pedidos existentes aunque se cierre temporalmente la creación de pedidos.

## Preparación del operador

1. Abrir la banca por un canal independiente.
2. Verificar abono firme, importe, fecha, destinatario, concepto y referencia estable de la operación.
3. Configurar fuera de Git:
   - `SS_CASOLAB_ADMIN_API_URL`;
   - `SS_CASOLAB_ADMIN_ACTOR=david` o `alba`;
   - el secreto correspondiente al operador.
4. No copiar saldo, IBAN completo, nombre del pagador, capturas ni movimientos vecinos.

## Validación sin mutar

El comando siguiente valida la estructura y genera una clave idempotente, pero no llama a la API porque falta `--execute`:

```powershell
npm.cmd run admin:verify-bizum -- --reference SS-00112233445566778899AABB --expected-status payment_reported --decision matched --amount-cents 4900 --observed-at 2026-07-30T11:58:00.000Z --reason matched_exact
```

La referencia bancaria se solicita por entrada estándar y no aparece en el resumen. Para reintentar una llamada incierta, se reutiliza exactamente el `--idempotency-key` mostrado por el primer intento.

## Decisiones

| Evidencia | Decisión | Estado resultante |
|---|---|---|
| Importe exacto, pedido vigente y operación bancaria única | `matched` / `matched_exact` | `paid` |
| Importe diferente | `needs_review` / `amount_mismatch` | `needs_review` |
| Pedido caducado | `needs_review` / `late_payment` | `needs_review` |
| Falta concepto o referencia del pedido | `needs_review` / `missing_reference` | `needs_review` |
| Operación bancaria ya utilizada | no forzar; escalar | sin segundo acceso |
| No se localiza el ingreso | `rejected` / `bank_transaction_not_found` | `needs_review` |

## Después de la conciliación

- `paymentVerified=true` solo acredita el estado `paid`.
- `accessProvisioned=false` es deliberado: el alta Moodle usa otro flujo idempotente.
- Registrar la incidencia si la respuesta es `409` y no repetir con claves nuevas para intentar forzar el estado.
- Nunca enviar el secreto, la referencia bancaria ni el token de consulta por WhatsApp.
- La limitación distribuida y el control de acceso perimetral siguen siendo gates externos antes de producción.
