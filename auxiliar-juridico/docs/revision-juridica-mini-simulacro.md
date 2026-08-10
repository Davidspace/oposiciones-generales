# Revisión jurídica del mini simulacro gratuito

Fecha de revisión documental: **10 de agosto de 2026**.

Este documento acompaña a `src/data/diagnostico.ts`. La revisión se ha hecho contra textos consolidados y páginas oficiales del BOE. Es una revisión editorial y de coherencia normativa, no un dictamen jurídico externo. Antes de comercializar el recurso se debe repetir la comprobación de vigencia.

## Diseño validado

- 20 preguntas teóricas puntuables.
- 8 preguntas prácticas puntuables sobre dos casos propios.
- 1 reserva teórica y 1 reserva práctica; no se suman a la puntuación ordinaria.
- Cuatro opciones por pregunta, una respuesta marcada y tres distractores.
- Teoría: +0,60 por acierto, −0,15 por error o respuesta múltiple, 0 en blanco.
- Práctica: +1 por acierto, −0,25 por error o respuesta múltiple, 0 en blanco.
- El recurso usa un tiempo orientativo de 20 minutos para teoría y 12 para práctica. No se presenta como examen oficial.

## Fuentes primarias utilizadas

| Norma | Uso en el recurso | Enlace oficial |
|---|---|---|
| Constitución Española | soberanía, igualdad, detención y tutela judicial | [BOE-A-1978-31229](https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229) |
| Ley Orgánica del Poder Judicial | funciones, jerarquía, actos de comunicación y autoridad de Auxilio | [BOE-A-1985-12666](https://www.boe.es/buscar/act.php?id=BOE-A-1985-12666) |
| Ley de Enjuiciamiento Civil | clases de actos de comunicación, dirección del servicio, medios electrónicos y horas hábiles | [BOE-A-2000-323](https://www.boe.es/buscar/act.php?id=BOE-A-2000-323) |
| Ley de Enjuiciamiento Criminal | notificación, cédula, urgencia y habilitación policial | [BOE-A-1882-6036](https://www.boe.es/buscar/act.php?id=BOE-A-1882-6036) |
| Ley 20/2011, del Registro Civil | carácter único y electrónico, hechos inscribibles | [BOE-A-2011-12628](https://www.boe.es/buscar/act.php?id=BOE-A-2011-12628) |
| Ley 18/2011, tecnologías de la información en la Justicia | uso obligatorio de sistemas y expediente judicial electrónico | [BOE-A-2011-11605](https://www.boe.es/buscar/act.php?id=BOE-A-2011-11605) |

## Inventario de preguntas y control

Todas las preguntas de esta tabla están en el fichero fuente con `correcta`, explicación y enlace a la norma. El control se ha realizado buscando: una sola respuesta compatible con el artículo indicado, distractores de la misma categoría, ausencia de promesas de resultado y lenguaje propio no copiado de un examen oficial.

### Teoría (20 ordinarias + 1 reserva)

| IDs | Cobertura | Fuente |
|---|---|---|
| `teo-ce-soberania`, `teo-ce-igualdad`, `teo-ce-detencion`, `teo-ce-tutela` | Constitución y derechos | Constitución, arts. 1, 14, 17 y 24 |
| `teo-auxilio-jerarquia`, `teo-auxilio-comunicaciones`, `teo-auxilio-ejecucion` | Funciones y autoridad del Cuerpo | LOPJ, art. 478 |
| `teo-lec-citacion`, `teo-lec-requerimiento`, `teo-lec-mandamiento`, `teo-lec-direccion` | Actos civiles y dirección | LEC, arts. 149 y 152 |
| `teo-lec-electronico`, `teo-lec-horas` | Comunicación electrónica y tiempo | LEC, arts. 162 y 130 |
| `teo-tic-obligatorio`, `teo-expediente-electronico` | Justicia digital | Ley 18/2011, arts. 8 y 26 |
| `teo-registro-unico`, `teo-registro-inscribible` | Registro Civil | Ley 20/2011, arts. 3 y 4 |
| `teo-lecrim-notificacion`, `teo-lecrim-cedula`, `teo-lecrim-urgencia` | Comunicación penal | LECrim, arts. 170, 175 y 430 |
| `reserva-teo-policia` | Reserva de habilitación policial | LECrim, art. 431 |

### Práctica (8 ordinarias + 1 reserva)

| IDs | Caso | Fuente |
|---|---|---|
| `prac-civil-requerimiento`, `prac-civil-direccion`, `prac-civil-citacion`, `prac-civil-agente` | Caso civil A | LEC, arts. 149 y 152; LOPJ, art. 478 |
| `prac-penal-urgencia`, `prac-penal-cedula`, `prac-penal-notificacion`, `prac-penal-objeto` | Caso penal B | LECrim, arts. 170, 175 y 430; LOPJ, art. 478 |
| `reserva-prac-habilitacion` | Reserva del caso penal B | LECrim, art. 431 |

## Revisión de vigencia y límites

1. Los enlaces llevan al texto consolidado del BOE consultado, no a blogs ni a materiales comerciales.
2. La convocatoria vigente y su estructura deben contrastarse de nuevo antes de publicar cambios: [Orden PJC/1549/2025, BOE-A-2025-27053](https://www.boe.es/buscar/doc.php?id=BOE-A-2025-27053).
3. El mini simulacro es una muestra pedagógica: sus 28 preguntas puntuables no permiten inferir una nota de aprobado en el proceso selectivo.
4. Si cambia un artículo, actualizar el enunciado, la respuesta, los distractores, la explicación, el enlace y esta fecha en el mismo commit.
5. Las preguntas oficiales del aula se mantienen separadas: este recurso contiene enunciados propios y no debe etiquetarse como `CUESTIONARIO OFICIAL`.
