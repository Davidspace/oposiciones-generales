# Auxilio Judicial: captación medible y prueba gratuita

Fecha: 2026-08-08

## Objetivo

Convertir la landing de Auxilio Judicial en el punto principal de captación de Academia LORMAN para la convocatoria cuyo examen está fijado para el 3 de octubre de 2026. La página debe explicar el producto, permitir probarlo sin dejar la web y atribuir las conversaciones de WhatsApp a su canal y publicación de origen.

## Necesidades del usuario

- Una persona interesada puede hacer una prueba útil antes de comprar.
- La corrección explica el resultado y señala qué bloque conviene repasar.
- David y Alba pueden distinguir tráfico orgánico, publicaciones, historias y comunidades.
- La medición respeta la decisión de consentimiento del visitante.
- Google puede comprender e indexar la página por búsquedas concretas de Auxilio Judicial.
- Las conversaciones y ventas pueden registrarse sin construir un backend.

## Requisitos funcionales

1. Ofrecer un diagnóstico original de 20 preguntas, con cuatro opciones, corrección al finalizar, puntuación total y resultado por bloque.
2. No presentar las preguntas como oficiales ni reproducir cuestionarios de terceros.
3. Registrar, cuando exista consentimiento, los eventos `quiz_start`, `quiz_complete` y `whatsapp_click`.
4. Conservar los parámetros UTM y los identificadores publicitarios de la visita durante la sesión.
5. Añadir la referencia de campaña al mensaje de WhatsApp sin exponer datos personales.
6. Cargar GA4 y Microsoft Clarity solo después del consentimiento de analítica.
7. Mantener una opción visible para cambiar la decisión de cookies.
8. Incluir metadatos, datos estructurados, contenido visible y preguntas frecuentes orientados a “test Auxilio Judicial gratis 2026”, “simulacro Auxilio Judicial” y “examen Auxilio Judicial 3 octubre 2026”.
9. Mantener un sitemap y robots.txt coherentes con la URL canónica.
10. Entregar un CRM básico en Google Sheets para leads, actividad, comunidades, campañas UTM y métricas.

## Escenarios de aceptación

- Al abrir la página sin decisión previa, no se solicitan recursos de GA4 ni Clarity y aparece el aviso de analítica.
- Al rechazar, la página y el diagnóstico siguen funcionando sin analítica.
- Al aceptar, se cargan las herramientas configuradas y se envían eventos sin información personal.
- Al entrar con `utm_source=instagram&utm_medium=social&utm_campaign=auxilio_octubre&utm_content=story_01`, la atribución se conserva y acompaña al clic de WhatsApp.
- No se puede corregir la prueba hasta responder las 20 preguntas; el error lleva a la primera pendiente.
- Tras corregir, se muestra puntuación, porcentaje, desglose por bloque, explicaciones y CTA de WhatsApp.
- La página incluye de forma visible que el curso cubre 26 temas mediante tests y que no incluye temario teórico.
- El build, TypeScript y las pruebas automatizadas terminan correctamente.

## Métricas de éxito durante 30 días

- Tasa de inicio de prueba sobre sesiones: >= 15 %.
- Finalización sobre pruebas iniciadas: >= 55 %.
- Clic a WhatsApp sobre pruebas completadas: >= 12 %.
- Registro de origen UTM en >= 90 % de las campañas etiquetadas.
- Cero eventos con nombre, teléfono, email o texto libre del visitante.

## Privacidad y límites

- La landing no crea perfiles identificables ni guarda respuestas en un backend.
- Las respuestas y el resultado solo viven en el navegador durante la visita.
- El CRM no se conecta automáticamente a WhatsApp: el alta de conversaciones y ventas es manual.
- La titularidad, textos legales definitivos y política de privacidad deben revisarse antes de utilizar analítica en producción.
- El BOE y la convocatoria prevalecen sobre cualquier explicación del diagnóstico.

## Fuera de alcance

- Automatizar mensajes privados o publicaciones masivas.
- Comprar anuncios.
- Crear un temario teórico de Auxilio Judicial.
- Cobro online, alta automática en Moodle o sincronización bidireccional con WhatsApp.
