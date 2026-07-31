# Fuentes y decisiones para GSI Caso a Caso

Revisión realizada el 28 de julio de 2026. Este documento conserva la
trazabilidad de la landing y servirá como base para diseñar el futuro Caso 0.

## Fuente vigente principal

- Convocatoria: BOE-A-2025-26262, publicada el 22 de diciembre de 2025.
- Cuerpo: Gestión de Sistemas e Informática de la Administración del Estado,
  subgrupo A2.
- Plazas convocadas: 680 de ingreso libre y 520 de promoción interna.
- Ingreso libre, segundo ejercicio: un supuesto a elegir entre dos, 5
  preguntas, máximo 180 minutos.
- Promoción interna, segundo ejercicio: un supuesto a elegir entre dos, máximo
  4 preguntas, máximo 150 minutos.
- Corrección sobre 50 puntos:
  - aplicación técnica: 30;
  - análisis: 10;
  - sistemática: 5;
  - expresión escrita: 5.

Enlace:
https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26262

## Enunciados y análisis históricos

La entrada de forjaTIC revisada enlaza 25 PDF históricos: 12 de ingreso libre
entre 2009 y 2024 y 13 de promoción interna entre 2008 y 2024. También enlaza
una recopilación temática. Los enlaces son descargas directas, pero la página no
publica soluciones oficiales ni una licencia expresa de redistribución.

Enlace:
https://forjatic.es/2025/09/04/analisis-de-los-supuestos-practicos-de-gsi/

El examen de ingreso libre de 2024 ofrece dos ejemplos especialmente útiles:

- almacenamiento distribuido para NubeSARA, conectividad entre CPD,
  implantación, bastionado, escalabilidad, nube pública y cifrado;
- portal público, cuadro de mando, casos de uso, modelo entidad-relación,
  arquitectura lógica, nube híbrida y ENS.

Conclusión pedagógica: los supuestos conectan varias decisiones y no deben
entrenarse como preguntas aisladas ni como bloques estancos.

Documentos locales revisados:

- `GSI INGRESO LIBRE OEP 2021 2024.pdf`: 4 páginas, dos supuestos y cinco
  cuestiones por supuesto.
- `GSI PROMOCION INTERNA OEP 2021 2024.pdf`: 4 páginas, los mismos escenarios
  y cuatro cuestiones por supuesto.
- `GSI SUPUESTOS PRACTICOS ENERO 2026.pdf`: folleto comercial de 3 páginas; no
  es un examen y sus condiciones no se reutilizan como hechos vigentes.
- `PREGUNTAS DESDE 2008 HASTA 2022.pdf`: recopilación temática heterogénea de
  17 páginas; Bloque III en páginas 1-7 y Bloque IV en páginas 8-17.

Los enunciados de 2024 permiten formular hipótesis cuando faltan datos, pero
exigen dejarlas por escrito y justificarlas. Esta conducta se incorporará a la
plantilla y a la rúbrica del Caso 0.

## Matrices Excel aportadas

### ANALISIS EXAMENES DESDE 2009.xlsx

Las cuatro hojas con contenido son matrices de presencia temática. Una marca
indica que el tema aparece en el año, no su puntuación ni su probabilidad
futura.

- `BIII-LIBRE!A1:N25`: 68 marcas.
- `BIII-PI!A1:N28`: 52 marcas.
- `BIV-LIBRE!A1:N30`: 65 marcas.
- `BIV-PI!A1:N30`: 52 marcas.
- Total: 237 intersecciones tema-año, no 237 preguntas.

Prioridades observadas:

- casos de uso: 18 marcas entre libre e interna;
- diagramas de clases: 11;
- arquitectura de aplicaciones: 10;
- arquitectura de red: 13;
- monitorización de red: 11;
- seguridad física y lógica: 11;
- ENS: 7.

En los seis cortes mostrados entre 2016 y 2024 y ambas modalidades, casos de
uso aparece en 11 de 12 posiciones y arquitectura de red en 10 de 12. Se usa
solo para priorizar práctica, nunca para afirmar qué va a caer.

### CALENDARIO DE PLANIFICACION GSI ENERO 2026.xlsx

`Hoja1!A1:F13` contiene una planificación de enero a mayo:

- 30 sesiones identificables;
- 16 clases temáticas, 8 por bloque;
- 6 simulacros;
- ciclos de entrega, feedback escrito y resolución;
- clases grabadas para directo o diferido.

El calendario contiene discordancias entre algunos días de semana y fechas. No
se reutilizan fechas, horarios ni nombres de docentes. La secuencia
práctica-feedback-resolución sí confirma que el feedback debe formar parte
central del producto.

## Decisiones aplicadas a la landing

- Convertir la rúbrica 60/20/10/10 en la prueba principal de alineación.
- Mostrar por separado el formato de libre y promoción interna.
- Explicar que el histórico sirve para reconocer patrones, no para predecir.
- Organizar el mapa de práctica en cuatro familias:
  aplicaciones y datos; infraestructura y red; seguridad y continuidad;
  administración digital.
- Ofrecer un Caso 0 original antes de la matrícula.
- Preguntar modalidad y familia de caso preferida en el formulario para decidir
  qué producir primero.

## Reglas para crear el Caso 0

El caso debe ser original y breve, sin copiar el texto de los enunciados ni las
explicaciones de terceros. Debe incluir:

1. un escenario administrativo creíble;
2. información suficiente para tomar decisiones;
3. entre 4 y 5 preguntas conectadas;
4. al menos un diagrama;
5. seguridad o ENS aterrizado en la solución;
6. una decisión con alternativas que deba justificarse;
7. permiso explícito para declarar supuestos;
8. rúbrica proporcional: 60 % técnica, 20 % análisis, 10 % sistemática y
   10 % expresión escrita.

## Derechos y atribución

No se rehostean los PDF ni se presenta el proyecto como oficial. Se enlaza la
fuente vigente del INAP/BOE y se mantiene la declaración de independencia. Antes
de redistribuir enunciados completos debe aclararse qué aviso legal del INAP
resulta aplicable. Para material comercial se crearán escenarios y redacciones
propias.
