# GA4 de TAI

La landing usa la propiedad `G-ZD1KT7K2JM`. La etiqueta solo se descarga cuando `TAI_ACADEMIA_ANALYTICS_ENABLED=true` y la persona acepta la analítica. Las respuestas concretas del test y los datos personales no se envían.

## Eventos

| Evento | Cuándo se envía | Parámetros principales |
|---|---|---|
| `page_view` | Al cargar la landing después del consentimiento | página y campaña |
| `trial_cta_click` | Al pulsar una entrada a la prueba | `placement` |
| `quiz_start` | Al elegir el bloque práctico | `practical_route` |
| `quiz_complete` | Al terminar las 12 preguntas | puntuación general, práctica y total |
| `quiz_restart` | Al repetir con la otra ruta | `practical_route` |
| `material_preview_open` | Al ampliar una página real | `placement` |
| `official_source_click` | Al abrir el BOE desde la prueba | `placement` |
| `whatsapp_click` | Al abrir una conversación comercial | `placement`, y resultado cuando procede |
| `social_click` | Al abrir Instagram | `network`, `placement` |

Todos los eventos incluyen `course=tai_c1` y, cuando existen, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid` y `fbclid`.

## Ajustes recomendados en GA4

1. Marcar `whatsapp_click` como evento clave.
2. Crear dimensiones personalizadas para `placement`, `practical_route`, `course`, `utm_campaign` y `utm_content` si se quieren usar en informes personalizados.
3. Mantener activada la medición mejorada para desplazamientos y clics de salida.
4. Verificar en **Tiempo real** aceptando la analítica y completando una prueba.

La variable opcional `NEXT_PUBLIC_GA4_MEASUREMENT_ID` permite cambiar la propiedad sin editar código. Si no existe, se utiliza `G-ZD1KT7K2JM`.
