# Auditoría editorial del curso Celador SMS Murcia

Fecha de auditoría local: 13 de agosto de 2026.

Fuente ZIP: `CURSO CELADOR SMS MURCIA-20260813T175324Z-1-001.zip` · SHA-256 `DF2A526D03FE35B5C6044300FBB1017B08A647F8904C3844A4E0CF7FB393F519`.

## Inventario comprobado

La fuente privada facilitada (`CURSO CELADOR SMS MURCIA-20260813T175324Z-1-001.zip`) contiene:

- 7 temas comunes y 7 temas específicos.
- Para cada tema: desarrollo completo en DOCX/PDF, resumen en DOCX/PDF y test de 50 preguntas en DOCX/PDF.
- 10 simulacros, cada uno con versión DOCX y PDF.
- 20 ficheros de exámenes oficiales, plantillas o ediciones corregidas.
- 5 ficheros de auditoría, fuentes y metadatos.

El manifiesto declara 131 ficheros, 52 DOCX y 70 PDF. La extracción local contiene 132 ficheros: la diferencia es un `README.md` de orientación dentro de `03 EXAMENES OFICIALES`, que no es material didáctico. La landing comunica el inventario pedagógico, no el número bruto de ficheros.

## Verificación estructural ejecutada

Se ha comprobado el contenido extraído, sin modificar ningún documento original:

- Las 131 filas de `04 AUDITORIA FINAL/inventario_sha256.csv` existen y coinciden en bytes y SHA-256.
- Los 14 tests temáticos contienen 50 preguntas numeradas, cuatro opciones por pregunta y una justificación.
- Los 10 simulacros contienen 75 preguntas numeradas, cuatro opciones por pregunta y una justificación.
- La detección de inicios de pregunta en los 24 PDF coincide con su DOCX correspondiente.
- No se han encontrado referencias a SERGAS, Galicia, Andalucía, Forja TIC, GSI ni Seguridad Social en el material propio. Las menciones a TCAE y Seguridad Social aparecen únicamente en el texto de determinados exámenes oficiales históricos, que permanecen separados.

La auditoría también ha detectado repeticiones literales de enunciados genéricos dentro de todos los tests temáticos y simulacros. No se ha dado por hecho que sean errores: pueden ser plantillas de redacción con opciones distintas. Sin embargo, incumplen el criterio de no duplicación literal y requieren revisión editorial antes de publicar el banco como plenamente depurado. El detalle y la propuesta de corrección están en `docs/editorial-incidences.md`.

## Estado editorial actual

**Necesita revisión editorial antes de considerarse definitivo.** La estructura, los recuentos, los formatos y los hashes están verificados. La revisión pendiente afecta a la variedad de enunciados repetidos y a la comprobación jurídica de cada pregunta frente a la normativa vigente. Los documentos fuente permanecen intactos.

## Qué se puede publicar

- Desarrollo, resumen y test como material propio del curso cuando el equipo confirme la revisión editorial.
- Simulacros propios identificados como `SIMULACRO`.
- Exámenes y plantillas oficiales en un bloque separado, con año y turno.
- La prueba gratuita como muestra original: no reproduce preguntas de bancos comerciales ni se presenta como examen oficial.

## Qué no se debe afirmar sin nueva revisión

- Que una pregunta propia es oficial.
- Que una plantilla derivada sustituye a la plantilla publicada por el SMS.
- Que el curso garantiza una plaza.
- Que el programa no cambiará: siempre prevalecen BORM y MurciaSalud.
- Que el material está revisado por un jurista externo. La revisión actual es editorial interna.

## Regla de actualización

Antes de publicar una nueva convocatoria, comprobar programa, fechas, número de preguntas, duración, penalización y normativa aplicable en la resolución oficial. Registrar la fecha de revisión en este documento y en la ficha de producto.
