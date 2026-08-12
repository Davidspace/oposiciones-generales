# Analytics Event Contract

| Event | Trigger | Required parameters | Constraint |
|---|---|---|---|
| `view_cordoba` | Primera vista consentida de la ruta | `course`, `page_path` | Máximo una vez por carga |
| `start_test_cordoba` | Inicio efectivo del diagnóstico | `course`, `question_count` | Tras consentimiento |
| `complete_test_cordoba` | Resultado calculado | `course`, `score`, `max_score`, `microcase_opened` | Sin respuestas individuales |
| `click_whatsapp_cordoba` | Clic en CTA de WhatsApp | `course`, `placement`, `price` | No equivale a compra |
| `view_price_cordoba` | Primera intersección visible del precio | `course`, `price`, `currency` | Una vez por carga |
| `purchase_cordoba` | Compra confirmada | `course`, `value`, `currency`, `transaction_id` | Solo confirmación real; nunca desde CTA pública |

No se envían nombre, teléfono, correo, texto de respuesta ni identificadores del aspirante.

En el flujo inicial por WhatsApp, `purchase_cordoba` se registra manualmente tras confirmar el pago mediante `npm run track:cordoba-purchase`. El comando exige `GA4_API_SECRET`, `GA4_CLIENT_ID` y un `CORDOBA_TRANSACTION_ID` único; no se ejecuta desde la interfaz pública.
