# Comparativa editorial de SS

Fecha: 30 de julio de 2026  
Ámbito: Administrativo de la Seguridad Social, C1  
Fuentes: `SS/` (material de Alba) y `gsi-casos-practicos/content-source/` (corpus estructurado de la aplicación).

## Decisión principal

`SS/` se mantiene como fuente editorial principal y conserva exactamente su jerarquía. No se sustituye por `content-source/` ni se copian documentos automáticamente. `content-source/` queda como derivado de producto: índices, afirmaciones trazables, tests, microcasos y rutas de estudio.

La comparación muestra que el material de Alba debe aportar la profundidad del tema y el corpus estructurado debe aportar navegación, práctica y control de actualización.

## Inventario comparado

| Área | Alba (`SS/`) | Corpus estructurado | Decisión |
|---|---:|---:|---|
| Información oficial | 64 archivos | Fuentes enlazadas en claims | Mantener Alba como archivo documental; enlazar fuentes canónicas |
| Temas generales | 23 DOCX | 23 módulos | Usar DOCX como contenido completo y módulo como mapa de estudio |
| Temas específicos | 13 DOCX | 13 módulos | Igual |
| Tests por tema | 36 DOCX | 400 preguntas JSON | Mantener tests de Alba y usar JSON para autocorrección |
| Simulacros | 60 DOCX | 14 casos estructurados | Usar los 60 como banco; publicar primero los casos revisados |
| Normativa | 60 archivos | 70 fuentes canónicas | Cruzar por fecha y fuente antes de publicar |
| Revisión y control | 4 informes + `_trabajo` | `review.md` y auditorías | Unificar trazabilidad sin mover carpetas de Alba |

Ambas fuentes cubren los mismos 36 temas. La diferencia no es de temario sino de profundidad y formato de entrega.

## Cobertura y volumen

El recuento de texto extraído de los DOCX de Alba es de aproximadamente **244.192 palabras**. Los 36 `lesson.md` actuales contienen aproximadamente **55.193 palabras**. Por tanto, el corpus estructurado actual representa cerca del 23 % del volumen de los temas redactados de Alba.

Los módulos con mayor riesgo de quedarse cortos si se publican solo con el borrador estructurado son:

- Generales: `G12`, `G19`, `G20`, `G21`, `G22`, `G23`.
- Específicos: `S08`, `S09`, `S10`, `S11`, `S12`, `S13`.

Esto no implica que los `lesson.md` sean incorrectos. Indica que deben funcionar como resumen operativo y no como sustituto del tema completo.

## Fortalezas de la estructura de Alba

1. Separa información oficial, temas, tests, simulacros, normativa, actualización e informes.
2. Conserva exámenes, plantillas y resoluciones del tribunal como evidencias independientes.
3. Incluye un área `_trabajo` para investigación, OCR, análisis y control editorial sin contaminar el material publicado.
4. Mantiene una correspondencia directa entre 23 temas generales y 13 específicos.
5. Permite actualizar normativa sin rehacer toda la estructura.

Esta jerarquía es adecuada para Moodle, descarga y revisión interna. Debe conservarse.

## Diferencias que sí debemos corregir

### 1. Profundidad del contenido

El módulo de la aplicación debe presentar un mapa breve, pero debe enlazar al tema completo de Alba. Para cada módulo se necesita una ficha de lectura con:

- ruta exacta del DOCX fuente;
- secciones cubiertas;
- conceptos que el alumno debe poder aplicar;
- claims normativos relacionados;
- preguntas y casos relacionados;
- fecha de revisión.

### 2. Fechas y normativa

Los documentos de Alba contienen reglas dependientes de la fecha, incluidas transitorias y cambios con efectividad futura. Ninguna cifra debe publicarse sin fecha de hecho causante, vigencia y fuente oficial. Los estados actuales de los módulos siguen siendo `draft` y con revisión jurídica pendiente.

### 3. Práctica

Alba dispone de 60 simulacros y 36 documentos de test. El producto debe priorizar la práctica autocorregible del corpus JSON, pero conservar los documentos originales como banco editorial. No se deben declarar como “simulacros oficiales” los casos creados internamente.

### 4. Codificación y revisión técnica

Algunos archivos Markdown del corpus estructurado muestran caracteres mojibake y secuencias literales `\\n` en la salida. Antes de publicar, hay que revisar UTF-8, saltos de línea y puntuación duplicada. La corrección debe hacerse en el derivado estructurado, no alterando los DOCX de Alba.

## Integración recomendada

### Fuente y derivado

```text
SS/                                  fuente editorial de Alba (intocable)
├── 01 Información oficial           evidencias oficiales
├── 02 Temas redactados               contenido completo
├── 03 Test por temas                 práctica editorial
├── 04 Simulacros                     banco de práctica
├── 05 Normativa                      documentos fuente
├── 06 Fuentes y control              control de actualización
├── 07 Informes de revisión           decisiones editoriales
├── 08 Análisis                       patrones de examen
└── _trabajo                          investigación interna

gsi-casos-practicos/content-source/  derivado para Moodle/web
├── modules                           mapa y objetivos por tema
├── claims                            afirmaciones trazables
├── questions                         autocorrección
└── cases                             microcasos y simulacros publicados
```

### Orden de trabajo

1. Crear una tabla de correspondencia `G01–G23` y `S01–S13` con el DOCX exacto de Alba.
2. Añadir a cada módulo el enlace de procedencia y el nivel de profundidad (`resumen`, `tema completo`, `práctica`).
3. Priorizar la ampliación editorial de los 12 módulos más cortos indicados arriba.
4. Revisar UTF-8 y formato Markdown del corpus estructurado.
5. Verificar cada claim contra `SS/05. Normativa` y las fuentes oficiales antes de cambiar un módulo a publicado.
6. Seleccionar un primer lote de tests y casos con solución explicada y rúbrica.
7. Repetir auditoría de contenido y tests de la aplicación.

## Qué no hacer

- No renombrar ni mover carpetas de `SS/`.
- No sobrescribir los DOCX de Alba con resúmenes generados.
- No mezclar investigación `_trabajo` con material publicado.
- No publicar automáticamente todos los claims porque exista un documento fuente.
- No prometer que un caso interno reproduce la corrección del tribunal.

## Criterio de mejora

Una mejora entra en el producto solo si cumple las tres condiciones siguientes:

1. Tiene una fuente identificable dentro de `SS/` o una fuente oficial enlazada.
2. Mejora una decisión del alumno: qué estudiar, qué responder, cómo practicar o cómo corregirse.
3. Puede revisarse de forma independiente cuando cambie la normativa.

## Próximo paso inmediato

Generar el manifiesto de correspondencia de los 36 módulos y corregir el formato técnico del corpus estructurado. Después se ampliarán los módulos cortos usando el contenido de Alba como fuente, manteniendo el mismo esquema `module.json`, `lesson.md` y `review.md`.
