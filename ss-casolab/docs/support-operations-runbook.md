# Registro de soporte y carga operativa

**Estado:** herramienta local. No contiene conversaciones, teléfonos, emails ni referencias de pedido.

## Qué se registra

Cada línea del archivo privado es un objeto JSON con estos campos cerrados:

- `incidentId`: identificador opaco con formato `SUP-...`;
- `category`: `content`, `access`, `technical`, `payment`, `refund`, `privacy`, `accessibility` o `unsubscribe`;
- `openedAt`, `dueAt`, `firstResponseAt` y `closedAt`: fechas ISO;
- `messagesCount` y `minutesSpent`;
- `escalatedTo`: `none`, `alba`, `david` o `external`;
- `outcome`: resultado enumerado;
- `extraordinary`: separa fraude, caída, reforma u otra incidencia no ordinaria;
- `assetId`: módulo y versión, solo cuando la incidencia afecta al contenido.

No se copia el texto del chat. Tampoco se guardan nombre, email, teléfono, referencia de pedido, expediente, dato bancario ni contraseña. El sistema rechaza cualquier campo adicional.

## Archivo privado

Guardar el JSONL real dentro de `ops/private/`. Esa carpeta está excluida de Git. Un ejemplo de línea válida es:

```json
{"incidentId":"SUP-0000000001","category":"content","openedAt":"2026-07-27T09:00:00.000Z","dueAt":"2026-07-30T09:00:00.000Z","firstResponseAt":"2026-07-28T09:00:00.000Z","closedAt":"2026-07-28T09:30:00.000Z","messagesCount":2,"minutesSpent":30,"escalatedTo":"none","outcome":"resolved_self_service","extraordinary":false,"assetId":"S03@1.0.0"}
```

La fecha `dueAt` se fija al registrar la incidencia según el SLA publicado. Así no se intenta reconstruir después el calendario laboral.

## Informe semanal

```powershell
npm.cmd run ops:report-support -- --input ops/private/support-2026-W31.jsonl --period-start 2026-07-27T00:00:00.000Z --period-end 2026-08-03T00:00:00.000Z --active-students 50 --as-of 2026-08-03T09:00:00.000Z
```

`active-students` debe proceder del agregado semanal de Moodle. Si es cero, el informe no inventa una carga por cada 100 alumnos.

El agregador selecciona por `openedAt` el intervalo semiabierto `period-start <= fecha < period-end`. Por tanto, puede recibir un registro acumulado; una incidencia abierta exactamente al inicio de la semana siguiente no entra en la anterior. Los `incidentId` duplicados hacen fallar el informe para evitar contar dos veces.

El resultado solo incluye totales: incidencias, mensajes, minutos ordinarios y extraordinarios, SLA, escalados, categorías y horas por cada 100 alumnos activos. No devuelve las filas de origen.

## Decisión operativa

- El límite ordinario es 4 horas mensuales por cada 100 alumnos activos.
- Las incidencias extraordinarias se muestran aparte y no se ocultan dentro del soporte ordinario.
- Si el límite se supera durante dos semanas consecutivas, se pausa la captación y se corrige la causa antes de añadir tutorías o más mensajería.
- Un incumplimiento de SLA de accesibilidad, privacidad, pago o devolución se revisa por incidente aunque la media semanal parezca correcta.
