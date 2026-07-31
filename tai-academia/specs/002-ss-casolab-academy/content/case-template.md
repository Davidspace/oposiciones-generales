# Plantilla canónica de caso práctico

Fuente de verdad: [`content-source/schema/case.schema.json`](../../../content-source/schema/case.schema.json).

El archivo de un caso es JSON. Este ejemplo representa un microcaso en borrador y contiene todos los campos obligatorios del esquema.

## Ejemplo JSON válido

```json
{
  "id": "MC02",
  "version": "0.1.0",
  "status": "draft",
  "type": "microcase",
  "title": "Alta comunicada fuera de plazo",
  "scenario": "Una empresa comunica el alta de una persona trabajadora después del inicio efectivo de la actividad. El enunciado aporta las fechas y los hechos necesarios para resolver las preguntas.",
  "originality": "original",
  "assumptions": [
    "No existe una resolución judicial ni otro hecho no indicado que modifique la situación descrita."
  ],
  "themes": [
    "ss-03"
  ],
  "competencies": [
    "aplicar la regla temporal de efectos del alta a los hechos del caso"
  ],
  "coverage": [
    {
      "themeId": "ss-03",
      "competency": "aplicar la regla temporal de efectos del alta a los hechos del caso",
      "questionIds": [
        "ss-03-q101",
        "ss-03-q102",
        "ss-03-q103",
        "ss-03-q104",
        "ss-03-q105"
      ]
    }
  ],
  "questionIds": [
    "ss-03-q101",
    "ss-03-q102",
    "ss-03-q103",
    "ss-03-q104",
    "ss-03-q105"
  ],
  "consistencyRules": [
    "Las respuestas deben usar la misma fecha de inicio efectivo en todas las preguntas."
  ],
  "durationMinutes": 15,
  "scoring": {
    "correct": 1,
    "wrong": -0.25,
    "blank": 0
  },
  "difficulty": "medium",
  "visibility": "practice",
  "normativeClaimIds": [
    "clm-ss-03-001"
  ],
  "validFrom": "2026-07-29",
  "validTo": null,
  "legislationCutoffAt": "2026-07-29",
  "nextReviewAt": "2026-10-29",
  "academicReviewStatus": "pending",
  "legalReviewStatus": "pending",
  "provenance": {
    "createdBy": "Equipo editorial SS CasoLab",
    "createdAt": "2026-07-29",
    "changeLog": [
      {
        "version": "0.1.0",
        "date": "2026-07-29",
        "changedBy": "Equipo editorial SS CasoLab",
        "summary": "Borrador inicial del caso."
      }
    ]
  }
}
```

## Valores admitidos

- `id`: `MCNN`, `CPNN` o `SIMNN`.
- `type`: `microcase`, `full-case` o `simulation`.
- `status`: `pending`, `draft`, `reviewed`, `external-review`, `published` o `retired`.
- `difficulty`: `basic`, `medium` o `high`.
- `visibility`: `practice` o `assessment-only`.
- `academicReviewStatus`: `pending`, `approved` o `rejected`.
- `legalReviewStatus`: `not-required`, `pending`, `approved` o `rejected`.
- `originality` debe ser `original`.
- `scoring` debe usar `1`, `-0.25` y `0` para acierto, error y blanco.

Los identificadores temáticos usados por el catálogo son `g-NN` para temas generales y `ss-NN` para temas específicos. Los módulos correspondientes usan IDs `GNN` y `SNN`; el caso referencia temas, no módulos.

## Campos opcionales del esquema

- `questionIds` en microcasos y `generalQuestionIds` en simulacros, según el tipo.
- `caseId`, con formato `CPNN`.
- `academicReviewer` y `academicReviewedAt`.
- `legalReviewer` y `legalReviewedAt`.

Un `full-case` debe declarar además:

- `mainQuestionIds`: exactamente 15 preguntas principales.
- `reserveQuestionIds`: exactamente 3 preguntas de reserva, sin solapamiento.
- `questionIds`: la concatenación, en ese orden, de principales y reservas.

`coverage` registra las relaciones que se declaren entre tema, competencia y preguntas. La plantilla no presupone cobertura adicional ni un número de epígrafes distinto del que exige el esquema.
