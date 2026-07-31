# Plantilla canónica de pregunta autocorregible

Fuente de verdad: [`content-source/schema/question.schema.json`](../../../content-source/schema/question.schema.json).

El archivo de una pregunta es JSON. El ejemplo contiene todos los campos obligatorios y mantiene la revisión académica y jurídica pendientes.

## Ejemplo JSON válido

```json
{
  "id": "g-14-q009",
  "version": "0.1.0",
  "status": "draft",
  "themes": [
    "g-14"
  ],
  "epigraph": "El Reglamento: concepto, clases y límites",
  "competency": "aplicar la jerarquía reglamentaria estatal",
  "difficulty": "medium",
  "prompt": "Una orden ministerial contradice una disposición reglamentaria vigente aprobada por real decreto. ¿Qué criterio debe comprobarse primero?",
  "options": [
    {
      "text": "La jerarquía entre ambas disposiciones y la prohibición de vulnerar una de rango superior.",
      "isCorrect": true,
      "feedback": "Correcto. Antes de aplicar un criterio temporal debe comprobarse el rango de cada disposición."
    },
    {
      "text": "La fecha, porque toda disposición posterior prevalece sin atender a su rango.",
      "isCorrect": false,
      "feedback": "Incorrecto. Una disposición inferior posterior no puede vulnerar por ese solo dato otra superior vigente.",
      "errorType": "confusion-secuencia",
      "reviewTarget": "G14, apartado 3.2 «Clases por su forma en el Gobierno de la Nación»"
    },
    {
      "text": "El número de páginas, porque la disposición más extensa tiene mayor rango.",
      "isCorrect": false,
      "feedback": "Incorrecto. La extensión no determina el rango normativo.",
      "errorType": "confusion-conceptos",
      "reviewTarget": "G14, apartado 3.1 «Límites materiales y jerárquicos»"
    },
    {
      "text": "La preferencia del órgano aplicador, sin comprobar la ley.",
      "isCorrect": false,
      "feedback": "Incorrecto. El órgano debe aplicar las reglas de jerarquía y competencia, no una preferencia libre.",
      "errorType": "confusion-competencias",
      "reviewTarget": "G14, apartado 3 «El reglamento»"
    }
  ],
  "normativeClaimIds": [
    "clm-g-14-010",
    "clm-g-14-011"
  ],
  "sources": [
    {
      "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10565",
      "location": "artículo 128.3",
      "consultedAt": "2026-07-29"
    },
    {
      "url": "https://www.boe.es/buscar/act.php?id=BOE-A-1997-25336",
      "location": "artículo 24.2",
      "consultedAt": "2026-07-29"
    }
  ],
  "validFrom": "2026-07-29",
  "validTo": null,
  "legislationCutoffAt": "2026-07-29",
  "visibility": "practice",
  "academicReviewStatus": "pending",
  "legalReviewStatus": "pending",
  "nextReviewAt": "2026-10-29",
  "provenance": {
    "createdBy": "Equipo editorial SS CasoLab",
    "createdAt": "2026-07-29",
    "changeLog": [
      {
        "version": "0.1.0",
        "date": "2026-07-29",
        "changedBy": "Equipo editorial SS CasoLab",
        "summary": "Borrador inicial de la pregunta."
      }
    ]
  }
}
```

## Identificadores y valores admitidos

- `id`: `g-NN-qNNN` o `ss-NN-qNNN`.
- `themes`: uno o más identificadores temáticos; los módulos correspondientes usan `GNN` o `SNN`.
- `status`: `pending`, `draft`, `reviewed`, `external-review`, `published` o `retired`.
- `difficulty`: `basic`, `medium` o `high`.
- `visibility`: `practice` o `assessment-only`.
- `academicReviewStatus`: `pending`, `approved` o `rejected`.
- `legalReviewStatus`: `not-required`, `pending`, `approved` o `rejected`.

El esquema exige exactamente cuatro objetos en `options`. Cada opción contiene `text`, `isCorrect` y `feedback`. Cuando `isCorrect` es `false`, `errorType` y `reviewTarget` también son obligatorios. El validador editorial exige una única respuesta correcta.

## Campos opcionales del esquema

- `academicReviewer` y `reviewedAt`.
- `legalReviewer` y `legalReviewedAt`.
- `errorType` y `reviewTarget` dentro de la opción correcta; son obligatorios en cada distractor.

Cada elemento de `sources` contiene una URL HTTPS, una localización concreta y la fecha de consulta. La plantilla no añade campos como `case_id`, `created_by`, listas de competencias o cobertura que no formen parte del esquema de pregunta.
