# Contract: fuente editorial, contenido y Moodle

## Programa canónico

`content-source/catalog.json` es el propietario único de los 36 temas:

- `G01–G23`: bloque general, anexo I.A;
- `S01–S13`: bloque específico, anexo I.B.

Cada entrada conserva ID, número, bloque, título editorial, epígrafe oficial exacto, localización en el BOE, riesgo y estado. Los documentos y categorías Moodle consumen estos IDs; no mantienen otra numeración.

## Módulo publicable

Cada módulo tiene un manifiesto versionado y una lección Markdown. El manifiesto incluye:

```text
module_id + version + status
theme_id
official_program_source
learning_outcomes[]
coverage[]: official_clause -> objective -> section_id -> activity_ids[]
normative_claim_ids[]
lesson_path + review_sheet_path
question_ids[8..n]
microcase_ids[]
academic_reviewer + reviewed_at
legal_review_status + legal_reviewer + legal_reviewed_at
valid_from + valid_to + legislation_cutoff_at
next_review_at
```

El exportador genera desde esa fuente una página HTML o libro Moodle, una hoja de repaso y un manifiesto de importación. Una prueba de deriva compara hashes/IDs/versiones de fuente y exportación. No se copia teoría manualmente al aula como ruta normal.

## Afirmación normativa

Una regla o explicación jurídica guarda:

```text
claim_id + asset_id + version
statement
source_url + source_location + official_publication
valid_from + valid_to + legislation_cutoff_at
owner + source_checked_at + review_status + reviewed_at + next_review_at
dependent_asset_ids[]
```

Una única fuente versionada permite exportar la instantánea del examen o el Derecho vigente. No existen dos bancos divergentes.

## Pregunta publicable

Una pregunta solo puede exportarse si cumple:

```text
id + version + status = published
1..n theme_ids válidos
prompt
exactamente 4 opciones y 1 correcta
feedback específico en las 4 opciones
error_type y review_target en cada incorrecta
al menos 1 claim_id y fuente oficial localizada
valid_from + valid_to + legislation_cutoff_at
visibility = practice | assessment-only
academic_reviewer + reviewed_at
legal_review_status aprobado cuando el riesgo lo exige
```

Los IDs usan `g-NN-qNNN` o `ss-NN-qNNN`. La importación conserva ID y versión en nombre técnico o etiqueta.

## Moodle

| Fuente editorial | Destino Moodle |
|---|---|
| `module_id`, título, versión | Sección y página/libro `SS/GNN` o `SS/SNN` |
| `coverage` | Metadatos de auditoría y checklist de módulo |
| lección y hoja de repaso | Página/libro y recurso descargable accesible |
| pregunta `id` + versión | Nombre técnico o etiqueta |
| `theme_ids` | Categoría por módulo |
| `case_id` | Categoría y etiqueta de caso |
| `mainQuestionIds` / `reserveQuestionIds` | Quince preguntas principales y tres reservas, en grupos distintos |
| opción e `is_correct` | Alternativa y fracción |
| feedback, fuente y corte | Feedback de alternativa y general |
| `error_type`, `review_target` | Etiqueta y enlace de recuperación |
| `visibility` | Banco de práctica o reserva de evaluación |

Reglas de actividad:

- aprendizaje: feedback inmediato y reintento después del repaso;
- microcaso: orden fijo, alternativas barajadas solo si no rompe referencias;
- supuesto: entrega explícita, blancos permitidos y feedback al finalizar;
- simulacro: 120 minutos, dos partes eliminatorias, feedback diferido y puntuación directa;
- finalización: entrega y consulta del feedback, no mera apertura.

## Versión, accesibilidad y copia

- Exportar banco y crear `.mbz` antes de cada lote.
- Nombrar `ss-casolab-YYYYMMDD-vNN.mbz` y conservar dos copias fuera del servidor.
- Nunca cambiar una clave publicada sin nueva versión y motivo.
- Probar teclado, lector de pantalla, contraste, móvil y alternativas textuales.
- Registrar procedencia/licencia y control de originalidad de cada activo.

## Evidencia necesaria

La auditoría requiere backup `.mbz` sin usuarios, acceso temporal de mínimo privilegio o exportación verificable de estructura, banco y configuración. El informe semanal de Moodle es el propietario de progreso, módulos, casos y simulacros; D1 conserva solo web, muestra pública, pedidos y métricas agregadas importadas.
