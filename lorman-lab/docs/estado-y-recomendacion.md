# Estado y recomendación — Academia LORMAN Lab

Fecha: **2026-08-03**.

## Trabajo realizado

- Se conserva una copia independiente en `oposiciones-digitales/lorman-lab/`.
- La copia no tiene remoto Git y contiene `SAFETY.md`.
- Se creó el repositorio privado de continuidad [GAD6MU/oposiciones-generales](https://github.com/GAD6MU/oposiciones-generales). La exportación remota no contiene la carpeta `.git` anidada del laboratorio.
- Se comprobó que `LORMANAcademia` original no recibió cambios, push ni despliegue.
- La landing local `/` presenta TCAE, TAI C1, SS C1, C2 y Auxilio Judicial C2 con estado y alcance separado.
- Auxilio Judicial C2 tiene una landing independiente en `../auxiliar-juridico/` y publica solo el inventario de tests del curso Moodle 11.
- `/tcae` conserva la landing TCAE local original; `/c2` contiene la landing y muestra interactiva del piloto C2.
- Los eventos se guardan solo en `localStorage`, con un UUID de sesión anónimo y un máximo local de 200 eventos. No se guardan nombres, emails, teléfonos, respuestas junto a identidad ni chat IDs.
- El inventario de producto está en `docs/productos/inventario-general.md`.
- El mapa y la matriz oficial del C2 están en `docs/c2/`.
- El piloto C2 contiene dos microtemas, fichas de práctica psicotécnica y Microsoft 365, 32 preguntas originales, 5 para la muestra y un mini-simulacro. Todas permanecen `pendiente_revision_humana`.
- El prototipo de Telegram está en `telegram/`. Solo acepta conversaciones iniciadas por la persona, exige `ACEPTO`, limita a tres seguimientos y no usa credenciales reales.

## Evidencias de validación

- `npm run build`: correcto; Vite transformó la aplicación y esbuild generó el servidor.
- `node --test telegram/bot.test.mjs`: 4 pruebas correctas.
- JSON del piloto: válido; 32 preguntas, cuatro opciones, clave, explicación, fuente, fecha de revisión y estado por pregunta.
- Playwright local: `/` muestra cinco tarjetas y enlaza C2 a `/c2`; `/c2` muestra cinco preguntas, permite responderlas y muestra el resultado `5/5` en la prueba de interacción.
- Playwright móvil a 390 px: no se detectó desbordamiento horizontal y se mantienen cinco preguntas accesibles.
- Fuente oficial revisada el 2026-08-03: [BOE-A-2025-26262](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26262). INAP queda como fuente de seguimiento; el portal devolvió un error temporal durante la consulta.

## Pendiente antes de publicar o vender

1. Revisión humana de las 32 preguntas, especialmente normativa, dificultad, redacción y Microsoft 365.
2. Completar enlaces de muestra de TCAE, TAI y SS y verificar que cada uno corresponde al producto correcto.
3. Crear una matriz de actualización por convocatoria para TCAE y TAI.
4. Validar el contenido de TAI con una extracción de Moodle de solo lectura y una fecha de corte explícita.
5. Completar identidad del vendedor, privacidad, condiciones, soporte, impuestos, devolución y cualquier checkout.
6. Sustituir los textos de recursos de Telegram por enlaces revisados y configurar un bot de pruebas solo con un token temporal fuera de Git.
7. Medir uso real y entrevistas antes de crear el curso completo C2.

## Recomendación

Continuar con C2 como producto de prueba, pero no construir aún el temario completo. La siguiente unidad de trabajo debe ser una revisión humana de las cinco preguntas de la muestra y una prueba con usuarios que lleguen voluntariamente a `/c2#prueba`. Si la muestra se completa y genera solicitudes cualificadas sin soporte continuo, ampliar el piloto por bloques; si no, corregir la propuesta antes de producir más contenido.

## Límites operativos

- No publicar `lorman-lab` en Sites o Vercel en esta fase.
- No tocar Moodle.
- No modificar ni desplegar `LORMANAcademia` original.
- No enviar mensajes de Telegram a personas que no hayan iniciado el bot y aceptado la secuencia.
- No presentar el piloto como material oficial, completo o equivalente a la corrección del tribunal.
