# Plantilla canónica de módulo temático

Fuente de verdad: [`content-source/schema/module.schema.json`](../../../content-source/schema/module.schema.json).

El manifiesto de un módulo es JSON. La lección y la hoja de repaso se mantienen en los archivos Markdown indicados por `lessonPath` y `reviewSheetPath`.

## Ejemplo JSON válido

```json
{
  "id": "G14",
  "themeId": "g-14",
  "version": "0.1.0",
  "status": "draft",
  "title": "Leyes, normas con fuerza de ley y reglamentos",
  "learningOutcomes": [
    "Distinguir decreto legislativo, decreto-ley y reglamento por su fundamento y sus límites."
  ],
  "decisions": [
    "Determinar si el Gobierno actúa por delegación legislativa, por extraordinaria y urgente necesidad o mediante potestad reglamentaria."
  ],
  "coverage": [
    {
      "officialClause": "El Reglamento: concepto, clases y límites",
      "objective": "Aplicar la jerarquía y los límites materiales de una disposición reglamentaria.",
      "sectionId": "g14-reglamentos",
      "activityIds": [
        "g-14-q009"
      ]
    }
  ],
  "lessonPath": "content-source/modules/G14/lesson.md",
  "reviewSheetPath": "content-source/modules/G14/review.md",
  "normativeClaimIds": [
    "clm-g-14-010",
    "clm-g-14-011"
  ],
  "questionIds": [
    "g-14-q009"
  ],
  "microcaseIds": [],
  "academicReviewStatus": "pending",
  "legalReviewStatus": "pending",
  "validFrom": "2026-07-29",
  "validTo": null,
  "legislationCutoffAt": "2026-07-29",
  "nextReviewAt": "2026-10-29",
  "provenance": {
    "createdBy": "Equipo editorial SS CasoLab",
    "createdAt": "2026-07-29",
    "changeLog": [
      {
        "version": "0.1.0",
        "date": "2026-07-29",
        "changedBy": "Equipo editorial SS CasoLab",
        "summary": "Borrador inicial del módulo."
      }
    ]
  }
}
```

## Identificadores y valores admitidos

- Módulo general: `G01` a `G23`; su tema usa `g-01` a `g-23`.
- Módulo específico: `S01` a `S13`; su tema usa `ss-01` a `ss-13`.
- `status`: `pending`, `draft`, `reviewed`, `external-review`, `published` o `retired`.
- `academicReviewStatus`: `pending`, `approved` o `rejected`.
- `legalReviewStatus`: `not-required`, `pending`, `approved` o `rejected`.
- `microcaseIds`, cuando se usen, tienen formato `MCNN`.

`lessonPath` y `reviewSheetPath` deben terminar en `.md`. `questionIds` y `microcaseIds` son listas sin duplicados.

## Estructura de `coverage`

Cada entrada contiene únicamente:

- `officialClause`: cláusula o epígrafe oficial que se está trazando.
- `objective`: resultado concreto asociado a esa entrada.
- `sectionId`: ancla estable dentro de la lección.
- `activityIds`: una lista no vacía de actividades asociadas.

El esquema exige que `coverage` tenga al menos una entrada y que cada `activityIds` no esté vacío. No fija un porcentaje de cobertura, un número de entradas por epígrafe ni un número total de preguntas.

## Campos opcionales del esquema

- `academicReviewer` y `reviewedAt`.
- `legalReviewer` y `legalReviewedAt`.

El objeto de módulo no admite propiedades adicionales. Las decisiones editoriales sobre extensión de la lección, número de secciones o cantidad de actividades no deben añadirse al manifiesto como si fueran requisitos del esquema.
