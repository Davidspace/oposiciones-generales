# Data Model

> **HISTORICO - SUPERSEDIDO.** El modelo vigente de contacto, pedido Bizum, pago, acceso, devolucion y contenido esta en [`../002-ss-casolab-academy/data-model.md`](../002-ss-casolab-academy/data-model.md).

## Lead Participation

- `id`: identificador interno.
- `experiment`: `ss-casolab` o `gsi-caso-0`.
- `offer_variant`: variante presentada.
- `email`: identificador de contacto normalizado.
- Datos de segmentación, consentimiento, UTM y fechas existentes.
- Restricción: combinación única de email y experimento.

## Funnel Event

- `id`: identificador interno.
- `session_id`: identificador aleatorio de sesión, no identidad permanente.
- `experiment`: producto al que pertenece.
- `offer_variant`: variante presentada.
- `event_type`: evento permitido del embudo.
- `path`: ruta donde ocurrió.
- `utm_source`, `utm_medium`, `utm_campaign`: atribución opcional.
- `metadata_json`: objeto acotado y sin texto libre sensible.
- `created_at`: fecha ISO.

## State Transitions

```text
landing_view
  -> diagnostic_start
  -> diagnostic_complete
  -> lead_submit
  -> checkout_click
  -> purchase_confirmed
```

Los saltos son válidos: un usuario conocido puede volver directamente al checkout. El análisis no debe asumir una secuencia perfecta.
