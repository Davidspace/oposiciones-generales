# Informe semanal de embudo y operación

**Estado:** implementado y probado en SQLite local. No acredita D1 remota, datos reales, Moodle ni protección perimetral de producción.

## Alcance

El informe agrega una semana de lunes a lunes en UTC. No devuelve filas, nombres, emails, teléfonos, referencias de pedido, tokens, identificadores bancarios ni usuarios de Moodle.

Incluye:

- sesiones de landing, diagnóstico, oferta, formulario, instrucciones y WhatsApp;
- contactos consentidos persistidos;
- pedidos, avisos de pago, verificaciones, incidencias, caducidades e importe bruto verificado;
- accesos provisionados o fallidos;
- devoluciones completadas e importe devuelto;
- tiempos medios hasta verificar y provisionar;
- conversiones entre los tramos principales;
- foto de reconciliación actual: pagos sin acceso, avisos pendientes e invariantes de acceso/devolución.

Solo `paymentsVerified` y `grossRevenueCents` representan ingresos comprobados. `orderedAmountCents` no es facturación.

## Seguridad

- El endpoint exige que la administración esté activada y una credencial individual de David o Alba.
- La respuesta usa `no-store` y se descarga como JSON.
- La consulta solo admite `weekStart=AAAA-MM-DD`, que debe ser un lunes real.
- El límite local de frecuencia no sustituye Cloudflare Access o un límite distribuido. El endpoint permanece cerrado en producción hasta completar ese gate.
- `currentReconciliation` es una foto al generar el informe. No pretende reconstruir el estado histórico al final de una semana pasada.

## Exportación

Configurar fuera de Git:

- `SS_CASOLAB_ADMIN_API_URL` con la URL base;
- `SS_CASOLAB_ADMIN_ACTOR=david` o `alba`;
- el secreto individual correspondiente.

Después ejecutar:

```powershell
npm.cmd run admin:export-weekly -- --week-start 2026-07-27
```

La CLI imprime el JSON agregado. No guarda un archivo ni imprime la credencial.

## Cierre semanal

1. Exportar el informe de la semana.
2. Generar el informe privado de carga de soporte con `ops:report-support`.
3. Completar el registro cerrado de horas de David y Alba, sin texto libre ni datos de alumnos.
4. Unir los tres archivos con `ops:weekly-dashboard`, según `weekly-dashboard-runbook.md`.
5. Añadir el agregado Moodle cuando M009 esté disponible.
6. Revisar primero diferencias de conciliación e invariantes distintas de cero.
7. Comparar ingreso neto por hora y horas por 100 alumnos o pagos con los límites del modelo operativo.
8. Registrar la decisión del corte sin convertir contactos, pedidos o avisos en ventas.
