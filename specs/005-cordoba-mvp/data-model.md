# Data Model

## TopicCoverage

- `topicNumber`: 1..20
- `officialTitle`: texto literal
- `coverage`: `covered | partial | not_covered`
- `reusedSources`: códigos SS reutilizados
- `requiresMunicipalSource`: boolean
- `requiresUpdate`: boolean
- `requiresPracticalCase`: boolean
- `notes`: decisión editorial
- `primarySources`: enlaces oficiales

## Question

- `id`: identificador estable `cor-tNN-qNNN`
- `topicNumber`: 1..20
- `block`: uno de cuatro bloques diagnósticos
- `kind`: `theory | applied`
- `difficulty`: `basic | medium | high`
- `prompt`: enunciado inequívoco
- `options`: cuatro alternativas
- `correctIndex`: 0..3
- `explanation`: fundamento y descarte esencial
- `sourceTitle`, `sourceUrl`, `articleOrSection`
- `reviewedAt`: fecha ISO

## Diagnostic

- 15 IDs teóricos.
- 5 IDs aplicados.
- Cuatro bloques de resultado con umbrales y recomendaciones.
- Un `Microcase` con situación, preguntas guía, respuesta orientativa, rúbrica y fuentes.

## AnalyticsEvent

- nombre permitido.
- curso `cordoba`.
- ubicación de CTA o sección.
- parámetros UTM no identificativos.
- marca temporal generada por GA4.
