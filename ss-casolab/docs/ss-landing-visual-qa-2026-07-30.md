# QA visual local — Landing SS CasoLab

**Fecha:** 2026-07-30  
**Entorno:** `vinext dev`, `http://localhost:4174`  
**Estado comercial observado:** captación y pedido cerrados por configuración.

## Build

`npx.cmd vinext build` terminó con código 0 y detectó las rutas:

- `/ss-casolab`
- `/ss-casolab/sin-horarios`
- `/ss-casolab/repaso`
- `/ss-casolab/pedido`

## Comprobaciones de las variantes

| Ruta | Titular observado | Overflow horizontal a 390 px | Pregunta o mención “cuánto pagar” en captación |
|---|---|---:|---:|
| `/ss-casolab` | Estudia la regla. Úsala para decidir. | No | No |
| `/ss-casolab/sin-horarios` | Prepara las dos partes. Estudia sin horarios semanales. | No | No |
| `/ss-casolab/repaso` | Identifica el fallo. Haz el repaso correcto. | No | No |

Las tres rutas usaron la misma oferta y el mismo estado de captación. Solo cambió el titular y la variante de atribución declarada en código.

## Consola y metadatos

- Cero errores de consola después de corregir el protocolo de metadatos en localhost.
- El título observado fue `SS CasoLab | Academia de Seguridad Social C1`.
- El formulario no se renderizó porque la captación estaba cerrada. La página explicó que no guardaba datos.
- La comprobación de campos y ausencia de `priceSignal` se mantiene en `tests/rendered-html.test.mjs`.

## Límites de esta evidencia

La revisión local no acredita un despliegue, la persistencia D1, una URL de privacidad, la disponibilidad del microcaso, un pedido, un cobro ni un alta Moodle. Esas superficies siguen detrás de sus gates.
