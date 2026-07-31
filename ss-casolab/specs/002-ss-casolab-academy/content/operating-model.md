# Modelo operativo de bajo mantenimiento

## Límites públicos

- WhatsApp Business individual, revisado dos veces por semana.
- Objetivo de respuesta: tres días laborables; no atención inmediata.
- Sin grupo, tutoría ilimitada, clases semanales ni corrección de material externo.
- Dudas con tema, activo, versión y punto concreto.
- Casos personales: no se responden; el producto prepara una oposición.
- Duda repetida: FAQ o corrección versionada, no conversación recurrente.
- Alba recibe solo escalados académicos agrupados.

Email queda limitado a documentos contractuales, facturación cuando corresponda, invitación y recuperación.

## Responsabilidades

| Área | Alba | David | IA | Externo |
|---|---|---|---|---|
| Exactitud pedagógica y claves | A/R | I | C/R borrador | C/R según riesgo |
| Fuente y matriz normativa | A | I | R documental | R jurídico cuando procede |
| Moodle y experiencia | R | A/R | C/R técnico | I |
| Landing, hosting y datos | I | A | R técnico | C legal |
| Bizum, pedidos, altas y devoluciones | I | A/R | R técnico | C legal/fiscal |
| WhatsApp y soporte inicial | C escalado | A/R | C | I |
| Oferta, analítica y captación | C | A/R | R | C legal |

`A`: responde del resultado; `R`: ejecuta; `C`: consultado; `I`: informado.

La cadena editorial es `IA redacta → Alba revisa → jurista aprueba cuando procede → exportación → Moodle`. Ningún estado se atribuye a una persona que no haya revisado.

## Revisión mínima

- Alba: todas las claves y explicaciones antes de publicar.
- Jurista: riesgo alto/muy alto y todo microcaso, supuesto o simulacro que combine normas.
- Externo legal/fiscal: aviso, privacidad, contratación, desistimiento, impuestos y marketing.
- Los borradores pueden producirse; venta y publicación esperan el gate.

## Presupuesto de horas

| Unidad | Límite de validación |
|---|---:|
| Conciliación, alta y acceso por 100 ventas nuevas | 6 h |
| Soporte por 100 alumnos activos y mes | 4 h |
| Mantenimiento editorial ordinario de toda la cohorte y mes | 8 h |
| Alba, escalado académico ordinario | 1 h/semana |

Registrar inicio, fin, categoría y volumen. Devoluciones, fraude, caída y reforma extraordinaria se miden aparte. Si un límite se supera dos semanas consecutivas, pausar captación y automatizar, delegar o corregir la causa.

## Capacidad para 50, 100, 250 y 500 alumnos

Las cifras siguientes aplican los límites de validación. No son horas observadas ni una promesa de servicio. `Altas` supone que el número completo de la fila compra durante el mismo periodo; es una carga puntual, no una carga mensual recurrente. `Soporte` supone que todos permanecen activos durante un mes.

| Alumnos o ventas | Conciliación y altas del lote | Soporte ordinario mensual | Mantenimiento editorial mensual | Lectura operativa |
|---:|---:|---:|---:|---|
| 50 | 3 h | 2 h | hasta 8 h para la cohorte | Operación manual delimitada |
| 100 | 6 h | 4 h | hasta 8 h para la cohorte | Límite de referencia del MVP |
| 250 | 15 h | 10 h | hasta 8 h para la cohorte | Requiere lotes, FAQ eficaz y delegación preparada |
| 500 | 30 h | 20 h | hasta 8 h para la cohorte | No debe depender solo de David; automatizar, delegar o limitar altas |

Fórmulas:

- conciliación y altas = `ventas nuevas × 6 / 100` horas;
- soporte ordinario = `alumnos activos × 4 / 100` horas al mes;
- carga de Alba = hasta una hora por semana para escalados agrupados;
- mantenimiento editorial = hasta ocho horas mensuales para toda la cohorte, sin multiplicarlo por alumno.

El informe de soporte calcula el segundo indicador con el agregado de alumnos activos de Moodle. Las devoluciones, el fraude, las caídas y las reformas extraordinarias se excluyen del numerador ordinario, pero se muestran por separado. No se usan para ocultar una carga recurrente mal clasificada.

### Decisiones por escala

- Hasta 50 alumnos: mantener conciliación y alta manuales con dos ventanas de WhatsApp.
- De 51 a 100: medir diez conversaciones y comprobar que FAQ y respuestas rápidas resuelven las dudas repetidas.
- De 101 a 250: preparar una persona delegada de soporte y agrupar las altas; David conserva las decisiones de pago y devolución.
- Más de 250: no abrir un lote nuevo si la conciliación, el alta o el soporte dependen de respuesta individual de David. Primero se reduce la causa, se delega o se limita el cupo real.
- En cualquier escala: dos semanas seguidas por encima del límite activan pausa de captación. Un incidente crítico de privacidad, pago, reembolso o accesibilidad se atiende aunque la media permanezca dentro del límite.

## Operación semanal

- Diario en lanzamiento: conciliación bancaria y cola de acceso en una o dos ventanas, no vigilancia continua.
- Dos veces por semana: WhatsApp, incidencias y escalados.
- Semanal: pedidos/pagos/accesos/devoluciones, métricas web, agregado Moodle y horas.
- Mensual: vigencia según riesgo, erratas y backup restaurable.
- Por lote: revisión académica/jurídica, exportación y changelog.

## Cadencia normativa

- `very-high`: mensual y antes de publicar.
- `high`: mensual durante convocatoria, trimestral fuera.
- `medium-high`: bimestral durante convocatoria, trimestral fuera.
- `medium`: trimestral y al publicarse convocatoria.
- `low`: semestral y al publicarse convocatoria.

Una incidencia que pueda cambiar una clave retira preventivamente el activo. La fuente inversa localiza dependencias en menos de 30 minutos.

## Automatización por umbral

- V0: creación de pedido automática; conciliación y alta manuales con runbook.
- Al superar 6 h/100 ventas: integrar confirmación o matrícula si existe opción segura y sin gasto autorizado.
- Al superar 4 h/100 alumnos: mejorar FAQ/feedback; no añadir tutoría.
- Siempre: flags de cierre, idempotencia, respuestas rápidas, exportación, backup y alertas de fallo.
