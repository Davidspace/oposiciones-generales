# Events API Contract

> **HISTORICO - SUPERSEDIDO.** Este contrato no autoriza el checkout externo que describe. Los contratos vigentes son [`content-and-moodle.md`](../../002-ss-casolab-academy/contracts/content-and-moodle.md) y [`funnel-and-purchase.md`](../../002-ss-casolab-academy/contracts/funnel-and-purchase.md).

## POST /api/events

Request:

```json
{
  "sessionId": "uuid",
  "experiment": "ss-casolab",
  "offerVariant": "founder-49",
  "eventType": "diagnostic_complete",
  "path": "/ss-casolab",
  "utmSource": "telegram",
  "utmMedium": "community",
  "utmCampaign": "validation-30d",
  "metadata": {
    "scoreBand": "medium"
  }
}
```

Responses:

- `201`: evento aceptado.
- `400`: formato, experimento o evento inválido.
- `500`: almacenamiento no disponible.

Event types:

- `landing_view`
- `diagnostic_start`
- `diagnostic_complete`
- `lead_submit`
- `checkout_click`
- `purchase_confirmed`

# Checkout configuration

## `GET /api/checkout?experiment=ss-casolab`

Returns the hosted HTTPS checkout URL for SS CasoLab when it is configured in
the deployment environment. If no valid URL exists, it returns
`{"configured": false, "checkoutUrl": null}`. The endpoint does not redirect
and does not accept a URL from the visitor.
