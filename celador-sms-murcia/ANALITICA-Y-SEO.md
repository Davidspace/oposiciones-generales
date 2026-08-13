# Analítica, SEO y trazabilidad · Celador SMS Murcia

La landing integra GA4 y Microsoft Clarity con consentimiento previo. La campaña se conserva en `sessionStorage` con una clave propia del producto (`lorman_celador_sms_attribution_v1`) para no mezclar visitas con otras oposiciones.

## Publicación

1. Crea un flujo web GA4 para `https://celadorsms.academialorman.es/`.
2. Añade `VITE_GA4_MEASUREMENT_ID` y, opcionalmente, `VITE_CLARITY_PROJECT_ID` en Vercel para Production, Preview y Development.
3. En Search Console añade la propiedad de dominio `academialorman.es` o el prefijo de URL `https://celadorsms.academialorman.es/`.
4. Solicita la indexación de la portada después de comprobar el DNS y el certificado.
5. Comprueba el consentimiento y, en GA4 Tiempo real, `page_view`, `view_course`, `view_price`, `start_free_test`, `free_test_answer`, `free_test_progress`, `complete_free_test`, `open_sample`, `faq_open`, `click_whatsapp` y `click_buy`. Los eventos incluyen `course`, `source_page` y, cuando existen, las UTMs de sesión.

## Enlaces UTM cortos

Usa estos alias públicos en lugar de pegar una URL larga en una comunidad:

| Canal | Enlace | Destino |
| --- | --- | --- |
| WhatsApp | `https://celadorsms.academialorman.es/whatsapp` | Prueba gratuita |
| Telegram | `https://celadorsms.academialorman.es/telegram` | Prueba gratuita |
| Genérico | `https://celadorsms.academialorman.es/prueba-gratis` | Prueba gratuita |

La configuración de Vercel añade `utm_source`, `utm_medium`, `utm_campaign=celador_sms_murcia_2026` y `utm_content` según el alias. No incluyas nombres, teléfonos o alias personales en las UTM.

## SEO de intención

La portada utiliza términos concretos: `celador SMS Murcia`, `celador/a-subalterno/a Servicio Murciano de Salud`, `temario celador SMS`, `tests celador SMS`, `simulacros 75 preguntas 85 minutos`. Las afirmaciones del formato del examen enlazan al BORM y a la página de empleo del SMS.
