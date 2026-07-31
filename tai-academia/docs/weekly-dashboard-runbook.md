# Cuadro semanal de rentabilidad y carga

Estado: herramienta local. No acredita tráfico, pagos, alumnos ni horas reales.

## Qué une

El cuadro usa tres fuentes del mismo periodo UTC:

1. El informe comercial generado por `admin:export-weekly`.
2. El informe agregado de soporte generado por `ops:report-support`.
3. Un registro JSONL de horas de David y Alba.

Las horas de cada incidencia se registran solo en soporte. No deben repetirse en el registro de horas. Este último admite adquisición, edición, venta y alta, plataforma, cumplimiento, administración e investigación.

## Registro de horas

Cada línea contiene un objeto sin texto libre ni datos del alumno:

```json
{"workId":"WORK-01HXYZ123456","actor":"david","category":"sales_access","mode":"recurring","occurredAt":"2026-07-28T10:00:00.000Z","minutesSpent":30,"taskId":"B011"}
```

Valores admitidos:

- `actor`: `david` o `alba`.
- `category`: `acquisition`, `editorial`, `sales_access`, `platform`, `legal_compliance`, `administration` o `research`.
- `mode`: `setup`, `recurring` o `extraordinary`.
- `minutesSpent`: entero entre 1 y 1440.

No se admiten nombres, teléfonos, correos, referencias de pedido, notas ni copias de conversaciones. Los `workId` no se pueden repetir.

## Generación

```powershell
npm.cmd run ops:weekly-dashboard -- `
  --weekly-report ops/private/weekly-2026-07-27.json `
  --support-report ops/private/support-2026-07-27.json `
  --time-log ops/private/owner-time.jsonl `
  --format markdown
```

Para obtener JSON, usa `--format json`. `ops/private/` está excluido de Git.

## Interpretación

- El ingreso usa solo pagos verificados por el operador. Un pedido o un aviso de Bizum no cuentan como ingreso.
- El ingreso neto descuenta devoluciones completadas, pero no impuestos ni costes externos.
- El denominador incluye las horas del registro y las horas de soporte. Si no hay horas o ventas, el cuadro muestra `null` o “sin dato”; no inventa ratios.
- El objetivo operativo es un máximo de 6 horas de venta y alta por cada 100 pagos verificados y menos de 4 horas de soporte ordinario por cada 100 alumnos activos.
- Los desajustes de conciliación deben resolverse antes de usar el cuadro para decisiones comerciales.
