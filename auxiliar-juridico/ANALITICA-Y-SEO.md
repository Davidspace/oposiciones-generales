# Activación de analítica y Search Console

La integración técnica ya está incluida. GA4 y Clarity no se cargan hasta que el visitante acepta la analítica.

## 1. GA4

1. Crea o selecciona una propiedad de Google Analytics 4.
2. Crea un flujo web para `https://auxiliojudicial.academialorman.es/`.
3. Copia el ID de medición `G-XXXXXXXXXX`.
4. En Vercel, proyecto `auxiliar-juridico`, añade `VITE_GA4_MEASUREMENT_ID` en Production, Preview y Development.
5. Despliega de nuevo y comprueba en Tiempo real que llegan `page_view`, `quiz_start`, `quiz_complete` y `whatsapp_click` después de aceptar la analítica.

## 2. Microsoft Clarity

1. Crea un proyecto para la misma URL.
2. Copia el identificador del proyecto.
3. Añade `VITE_CLARITY_PROJECT_ID` en Vercel.
4. Despliega y comprueba que no se inicia una grabación antes de aceptar.

## 3. Search Console

1. Añade una propiedad de prefijo de URL para `https://auxiliojudicial.academialorman.es/`.
2. Verifica mediante Google Analytics una vez que GA4 esté publicado o usa la etiqueta HTML que indique Search Console.
3. Envía `https://auxiliojudicial.academialorman.es/sitemap.xml`.
4. Solicita la indexación de la portada.

Cuando se use un dominio propio, crea una propiedad de dominio y actualiza canonical, sitemap, robots, datos estructurados y variables de Vercel en el mismo despliegue.

## 4. Convención UTM

Usa siempre minúsculas, sin tildes ni espacios:

| Campo | Uso | Ejemplo |
|---|---|---|
| `utm_source` | Plataforma o comunidad | `instagram`, `telegram`, `facebook`, `whatsapp` |
| `utm_medium` | Tipo de distribución | `organic_social`, `community`, `referral`, `dm` |
| `utm_campaign` | Campaña estable | `auxilio_octubre_2026` |
| `utm_content` | Pieza o grupo concreto | `reel_errores_01`, `grupo_justicia_telegram` |

Ejemplo:

`https://auxiliojudicial.academialorman.es/?utm_source=instagram&utm_medium=organic_social&utm_campaign=auxilio_octubre_2026&utm_content=story_test_01`

No incluyas nombres, teléfonos, emails ni alias de personas en las UTM.
