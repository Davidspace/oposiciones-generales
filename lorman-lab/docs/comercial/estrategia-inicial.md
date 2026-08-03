# Estrategia comercial inicial — laboratorio local

Estado: **hipótesis para validar, sin pagos reales**. Las cantidades de esta tabla no son precios vigentes ni promesas de oferta.

## Arquitectura modular

1. Curso completo: teoría + tests + simulacros.
2. Pack de temario: lectura y resúmenes, sin prometer práctica si no está incluida.
3. Pack de tests: autocorrección, explicación y repaso.
4. Pack de simulacros: tiempo, reservas y revisión.
5. Refuerzo específico: un bloque o tipo de error.
6. Acceso anual: solo si la actualización anual es sostenible.
7. Corrección humana premium: cupos limitados, precio separado y alcance escrito.

La secuencia recomendada es vender primero un producto cerrado y reutilizable. No iniciar una suscripción que obligue a producir contenido nuevo cada mes.

## Propuestas por producto

| Producto | Puede venderse cuando | Formato inicial | Hipótesis de precio de prueba* | Mantenimiento esperado | Riesgo principal |
|---|---|---|---|---|---|
| TCAE | Se verifique convocatoria y alcance por administración | Pack de tests + simulacros por convocatoria | 20–45 € por pack; validar con entrevistas y clics | Alto si cambian muchas convocatorias; bajo en banco estable | Temario específico y competencia local |
| TAI C1 | Se confirme el inventario Moodle y la convocatoria | Curso de autoestudio o packs de tests/simulacros | 39–69 € por pack; `59 €` es solo cifra observada en la landing local | Medio: revisar programa y software | Diferencia entre contenido del aula y ejercicio vigente |
| SS C1 | Cada módulo de `SS/` tenga fuente y revisión | Pack de tests + microcasos; curso completo después | 29–59 € por pack; no confundir con precios de terceros | Medio: normativa y casos | Corrección humana que supere el límite operativo |
| C2 AGE | Tras la revisión humana del piloto | Muestra + pack de 30–50 preguntas por bloques | 9–19 € por pack inicial; el curso completo queda sin precio | Medio: leyes y versión de Microsoft 365 | Preguntas ambiguas o cambios de convocatoria |

\* Son rangos de experimentación, no precios publicados. No se habilita checkout hasta incluir identidad del vendedor, impuestos, condiciones, devolución, soporte y una revisión jurídica.

## Evidencia de competencia utilizada

- La tabla de competencia proporcionada por el equipo incluye, entre otros, [AdministrativoSeguridadSocial.com](https://administrativoseguridadsocial.com/test-y-casos-practicos/), [TesteAT](https://testeat.es/producto/oposicion-cuerpo-administrativo-de-la-administracion-de-la-seguridad-social/), [PreparaOposiciones](https://www.preparaoposiciones.com/curso/admin-ss-practica) y [ADAMS](https://www.adams.es/producto/oposiciones/administracion-del-estado/administrativos-de-la-seguridad-social-47262/). Sus precios y condiciones deben volver a comprobarse antes de utilizarlos en una landing.
- En este laboratorio no se presenta la ausencia de una característica como hueco competitivo. La hipótesis debe sobrevivir a una compra misteriosa o a una entrevista.

## Validación sin pagos

1. Publicar la muestra y medir `sample_view`, `sample_start` y `sample_complete` localmente.
2. Añadir una llamada a “consultar opciones” sin recoger precio en el formulario.
3. Entrevistar a quienes terminan la muestra y a quienes abandonan.
4. Solo si hay intención repetida, crear una oferta cerrada y revisar condiciones legales.

No se implementan pagos, preventas, campañas masivas ni corrección humana ilimitada en el laboratorio.
