# Bot de Telegram — prototipo opt-in

Este directorio contiene un prototipo local. No es un sistema de spam.

## Garantías de diseño

- Solo procesa mensajes de un chat que la persona haya iniciado con `/start`.
- Pide una oposición y un consentimiento explícito (`ACEPTO`) antes de entregar el recurso.
- `/stop` detiene la secuencia y `/delete` elimina el registro en memoria.
- Los seguimientos están limitados a tres y separados por 24 horas.
- `sendFollowup(..., { campaignEnabled: false })` permite apagar una campaña completa sin borrar consentimientos.
- No importa usuarios, no extrae grupos, no usa listas de usernames y no añade personas a grupos.
- El prototipo no persiste chat IDs en disco. Las pruebas usan una tienda en memoria.
- `TELEGRAM_DRY_RUN=true` por defecto. No se incluye ningún token.

## Validación local

Desde `lorman-lab/`:

```powershell
node --test telegram/bot.test.mjs
```

Para una integración posterior con un bot de pruebas propio, copia `telegram/.env.example` a un archivo local ignorado, configura un token temporal y cambia `TELEGRAM_DRY_RUN=false`. No pegues el token en Git, en una incidencia ni en un chat.

El texto de los recursos se mantiene en `bot.mjs`; antes de utilizarlo en producción debe sustituirse por enlaces reales revisados y añadir la política de privacidad y el canal de ejercicio de derechos correspondiente.
