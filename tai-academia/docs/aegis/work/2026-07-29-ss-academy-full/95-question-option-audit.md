# Auditoría de distribución de respuestas

Fecha: 30 de julio de 2026.

## Resultado

El banco contiene 400 preguntas. La auditoría inicial detectó una concentración
de 317 respuestas correctas en la opción A. Se ejecutó
`npm run content:rebalance-options` para reordenar las alternativas completas
(texto, feedback, error y objetivo de repaso) sin cambiar su significado.

Distribución posterior:

| Posición correcta | Preguntas |
|---|---:|
| A | 100 |
| B | 100 |
| C | 100 |
| D | 100 |

Se actualizaron 297 preguntas de forma determinista. Cada pregunta modificada
registra una nueva versión de procedencia (`0.1.1`) y conserva el estado
`draft` y las revisiones académica y jurídica `pending`. El reordenamiento no
abre ningún gate de publicación.

## Comprobaciones

- `npm run content:validate`: 36 temas, 36 módulos, 770 afirmaciones, 400 preguntas y 14 casos.
- `npm run content:audit`: cobertura estructural verde; publicación cerrada.
- No hay prompts duplicados ni opciones duplicadas tras la auditoría.
- `npm run test:unit`: 109/109.
- `node --test tests/rendered-html.test.mjs`: 6/6.

## Límite

La distribución de opciones evita una pista mecánica. No sustituye la revisión
de ambigüedad, dificultad, exactitud normativa ni calibración con alumnos. Esas
decisiones siguen pendientes de Alba y de la revisión jurídica externa.
