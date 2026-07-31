# Cola de revisión humana SS CasoLab — 2026-07-30

> Estado: publicación cerrada hasta completar revisión académica, jurídica y normativa. Este documento es una guía operativa para Alba y David; no convierte ningún borrador en material publicable.

**Inventario:** 36 temas · 36 módulos · 770 afirmaciones · 400 preguntas · 14 casos.
**Distribución de la respuesta correcta:** A 100 · B 100 · C 100 · D 100.
**Revisión aprobada:** módulos académica 0/36; módulos jurídica 0/36; afirmaciones normativas 0/770.

## Orden de trabajo recomendado

1. Revisar primero los temas de riesgo `very-high` y `high`, en el orden de la tabla.
2. Completar un bloque por sesión: una hoja de repaso, sus afirmaciones y sus preguntas.
3. Revisar MC01–MC08 después de cerrar sus temas fuente; revisar CP01–CP04 al final de cada grupo.
4. Registrar cambios en los JSON y conservar la fecha de corte. No exportar a Moodle mientras exista un estado `pending`.

**Temas prioritarios:** g-12, g-21, ss-04, ss-09, ss-10, ss-12, g-05, g-06, g-08, g-09, g-11, g-13, g-14, g-18, g-19, g-20, g-22, g-23, ss-02, ss-05, ss-07, ss-08, ss-11, ss-13.

## Primer lote beta ya preparado

El gate estructural del lote beta está verde: 8 módulos (`G01`, `G13`–`G16`, `S01`–`S03`), 92 preguntas referenciadas, 120 afirmaciones y 3 casos (`MC01`, `MC02`, `CP01`). El paquete privado de revisión se genera con `npm run content:review-pack-beta` en `outputs/review/beta/`. La publicación sigue cerrada: el último gate registra 429 incidencias de revisión (estado editorial, académica, jurídica y normativa).

## Cola por tema

| Prioridad | Módulo | Bloque | Tema | Riesgo | Claims | Preguntas | Casos | Revisión | Archivos |
|---|---|---|---|---|---:|---:|---|---|---|
| 1 | G12 | General | Ministerio de Inclusión, Seguridad Social y Migraciones | very-high | 20 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G12/review.md); [lección](../../../../content-source/modules/G12/lesson.md) |
| 1 | G21 | General | Igualdad, violencia de género, discapacidad, dependencia y LGTBI | very-high | 20 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G21/review.md); [lección](../../../../content-source/modules/G21/lesson.md) |
| 1 | S04 | Específico | Cotización y liquidación | very-high | 19 | 15 | CP02, MC03, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S04/review.md); [lección](../../../../content-source/modules/S04/lesson.md) |
| 1 | S09 | Específico | Nacimiento, cuidados y prestaciones familiares | very-high | 20 | 12 | CP04, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S09/review.md); [lección](../../../../content-source/modules/S09/lesson.md) |
| 1 | S10 | Específico | Jubilación contributiva | very-high | 20 | 16 | CP04, MC06, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S10/review.md); [lección](../../../../content-source/modules/S10/lesson.md) |
| 1 | S12 | Específico | No contributivas, asistenciales e IMV | very-high | 20 | 17 | CP04, MC08, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S12/review.md); [lección](../../../../content-source/modules/S12/lesson.md) |
| 1 | G05 | General | Cortes Generales y Defensor del Pueblo | high | 20 | 9 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G05/review.md); [lección](../../../../content-source/modules/G05/lesson.md) |
| 1 | G06 | General | Poder Judicial y organización judicial | high | 17 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G06/review.md); [lección](../../../../content-source/modules/G06/lesson.md) |
| 1 | G08 | General | Administración General del Estado | high | 24 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G08/review.md); [lección](../../../../content-source/modules/G08/lesson.md) |
| 1 | G09 | General | Organización territorial y Administración local | high | 24 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G09/review.md); [lección](../../../../content-source/modules/G09/lesson.md) |
| 1 | G11 | General | Fuentes del Derecho de la Unión Europea | high | 19 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G11/review.md); [lección](../../../../content-source/modules/G11/lesson.md) |
| 1 | G13 | General | Fuentes del Derecho Administrativo | medium-high | 11 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G13/review.md); [lección](../../../../content-source/modules/G13/lesson.md) |
| 1 | G14 | General | Leyes, normas con fuerza de ley y reglamentos | medium-high | 13 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G14/review.md); [lección](../../../../content-source/modules/G14/lesson.md) |
| 1 | G18 | General | Recursos administrativos y contencioso-administrativo | medium-high | 20 | 10 | CP02, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G18/review.md); [lección](../../../../content-source/modules/G18/lesson.md) |
| 1 | G19 | General | Personal al servicio de las Administraciones Públicas | high | 20 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G19/review.md); [lección](../../../../content-source/modules/G19/lesson.md) |
| 1 | G20 | General | Atención al público e información administrativa | high | 20 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G20/review.md); [lección](../../../../content-source/modules/G20/lesson.md) |
| 1 | G22 | General | Protección de datos personales | high | 20 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G22/review.md); [lección](../../../../content-source/modules/G22/lesson.md) |
| 1 | G23 | General | Funcionamiento electrónico del sector público | high | 20 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G23/review.md); [lección](../../../../content-source/modules/G23/lesson.md) |
| 1 | S02 | Específico | Campo de aplicación, regímenes y sistemas | high | 15 | 16 | CP01, MC02, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S02/review.md); [lección](../../../../content-source/modules/S02/lesson.md) |
| 1 | S05 | Específico | Gestión recaudatoria en periodo voluntario | medium-high | 22 | 15 | CP02, MC04, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S05/review.md); [lección](../../../../content-source/modules/S05/lesson.md) |
| 1 | S07 | Específico | Acción protectora | high | 20 | 22 | CP02, CP03, CP04, MC05, MC06, MC07, MC08, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S07/review.md); [lección](../../../../content-source/modules/S07/lesson.md) |
| 1 | S08 | Específico | Incapacidad temporal y permanente | high | 20 | 19 | CP03, MC05, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S08/review.md); [lección](../../../../content-source/modules/S08/lesson.md) |
| 1 | S11 | Específico | Muerte y supervivencia | medium-high | 20 | 17 | CP03, MC07, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S11/review.md); [lección](../../../../content-source/modules/S11/lesson.md) |
| 1 | S13 | Específico | Recursos, patrimonio y pagos | medium-high | 20 | 11 | CP04, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S13/review.md); [lección](../../../../content-source/modules/S13/lesson.md) |
| 2 | G01 | General | Constitución: estructura, contenido y reforma | medium | 12 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G01/review.md); [lección](../../../../content-source/modules/G01/lesson.md) |
| 2 | G02 | General | Derechos, garantías y suspensión | medium | 23 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G02/review.md); [lección](../../../../content-source/modules/G02/lesson.md) |
| 2 | G03 | General | Tribunal Constitucional | medium | 19 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G03/review.md); [lección](../../../../content-source/modules/G03/lesson.md) |
| 2 | G07 | General | Gobierno, Cortes y Consejo de Estado | medium | 21 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G07/review.md); [lección](../../../../content-source/modules/G07/lesson.md) |
| 2 | G10 | General | Instituciones de la Unión Europea | medium | 16 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G10/review.md); [lección](../../../../content-source/modules/G10/lesson.md) |
| 2 | G15 | General | Actos administrativos | medium | 15 | 9 | CP02, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G15/review.md); [lección](../../../../content-source/modules/G15/lesson.md) |
| 2 | G16 | General | Procedimiento común: sujetos, silencio y plazos | medium | 18 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G16/review.md); [lección](../../../../content-source/modules/G16/lesson.md) |
| 2 | G17 | General | Fases del procedimiento y ejecución | medium | 25 | 10 | CP02, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G17/review.md); [lección](../../../../content-source/modules/G17/lesson.md) |
| 2 | S01 | Específico | Sistema y LGSS | medium | 10 | 10 | CP01, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S01/review.md); [lección](../../../../content-source/modules/S01/lesson.md) |
| 2 | S03 | Específico | Afiliación, altas, bajas e inscripción | medium | 15 | 27 | CP01, MC01, MC02, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S03/review.md); [lección](../../../../content-source/modules/S03/lesson.md) |
| 2 | S06 | Específico | Recaudación en vía ejecutiva | medium | 19 | 15 | CP02, MC04, SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/S06/review.md); [lección](../../../../content-source/modules/S06/lesson.md) |
| 2 | G04 | General | Corona, sucesión, regencia y refrendo | low | 16 | 8 | SIM01, SIM02 | académica pending; jurídica pending | [repaso](../../../../content-source/modules/G04/review.md); [lección](../../../../content-source/modules/G04/lesson.md) |

## Cola por caso práctico

| Prioridad | ID | Tipo | Título | Riesgo | Temas | Preguntas | Revisión |
|---|---|---|---|---|---|---:|---|
| 1 | CP02 | full-case | Deuda empresarial, aplazamiento y vÃ­a ejecutiva | very-high | g-15, g-17, g-18, ss-04, ss-05, ss-06, ss-07 | 18 (15 + 3 reservas) | académica pending; jurídica pending |
| 1 | CP04 | full-case | Unidad familiar con cuidados, jubilaciÃ³n e IMV | very-high | ss-07, ss-09, ss-10, ss-12, ss-13 | 18 (15 + 3 reservas) | académica pending; jurídica pending |
| 1 | MC03 | microcase | Primera liquidación de una plantilla | very-high | ss-04 | 5 | académica pending; jurídica pending |
| 1 | MC06 | microcase | Modalidad de jubilación | very-high | ss-07, ss-10 | 5 | académica pending; jurídica pending |
| 1 | MC08 | microcase | Acceso y mantenimiento del IMV | very-high | ss-07, ss-12 | 5 | académica pending; jurídica pending |
| 1 | SIM01 | simulation | Simulacro de consolidaciÃ³n | very-high | g-01, g-02, g-03, g-04, g-05, g-06, g-07, g-08, g-09, g-10, g-11, g-12, g-13, g-14, g-15, g-16, g-17, g-18, g-19, g-20, g-21, g-22, g-23, ss-01, ss-02, ss-03, ss-04, ss-05, ss-06, ss-07, ss-08, ss-09, ss-10, ss-11, ss-12, ss-13 | 73; caso CP01 | académica pending; jurídica pending |
| 1 | SIM02 | simulation | Simulacro final con banco reservado | very-high | g-01, g-02, g-03, g-04, g-05, g-06, g-07, g-08, g-09, g-10, g-11, g-12, g-13, g-14, g-15, g-16, g-17, g-18, g-19, g-20, g-21, g-22, g-23, ss-01, ss-02, ss-03, ss-04, ss-05, ss-06, ss-07, ss-08, ss-09, ss-10, ss-11, ss-12, ss-13 | 73; caso CP03 | académica pending; jurídica pending |
| 1 | CP01 | full-case | Primera plantilla y movimientos de una sociedad | high | ss-01, ss-02, ss-03 | 18 (15 + 3 reservas) | académica pending; jurídica pending |
| 1 | CP03 | full-case | Accidente, incapacidad y protecciÃ³n familiar | high | ss-07, ss-08, ss-11 | 18 (15 + 3 reservas) | académica pending; jurídica pending |
| 1 | MC02 | microcase | Dos actividades, dos altas | high | ss-02, ss-03 | 5 | académica pending; jurídica pending |
| 2 | MC04 | microcase | Deuda, periodo voluntario y apremio | medium-high | ss-05, ss-06 | 5 | académica pending; jurídica pending |
| 1 | MC05 | microcase | Cadena de incapacidad | high | ss-07, ss-08 | 5 | académica pending; jurídica pending |
| 1 | MC07 | microcase | Muerte y supervivencia | high | ss-07, ss-11 | 5 | académica pending; jurídica pending |
| 2 | MC01 | microcase | Un alta que llega tarde | medium | ss-03 | 5 | académica pending; jurídica pending |

## Protocolo de revisión

- [ ] Leer la hoja de repaso y la lección del módulo antes de revisar sus preguntas.
- [ ] Comprobar el epígrafe oficial, la fuente BOE y el corte normativo declarado.
- [ ] Validar cada afirmación: texto, localizador, vigencia y dependencia de activos.
- [ ] Resolver cada pregunta sin mirar la clave; confirmar clave, distractores y feedback.
- [ ] Marcar dificultad y tipo de error; registrar toda modificación en changeLog.
- [ ] Revisar los casos completos como una única cadena de hechos y decisiones.
- [ ] No cambiar a aprobado hasta cerrar revisión académica, jurídica y normativa.

### Checklist por módulo

- [ ] Epígrafe y alcance coinciden con el programa oficial.
- [ ] La hoja de repaso no introduce reglas sin fuente trazable.
- [ ] Cada afirmación tiene localizador concreto y fecha de corte correcta.
- [ ] Las ocho preguntas tienen una sola respuesta defendible.
- [ ] Los distractores representan errores plausibles y tienen feedback útil.
- [ ] La dificultad y el tipo de error son razonables para C1.
- [ ] Cambios registrados en la procedencia y revisión marcada.

### Checklist por caso práctico

- [ ] Los hechos son suficientes y no contienen ambigüedades no declaradas.
- [ ] Todas las preguntas parten de los mismos hechos y supuestos.
- [ ] El orden mide decisiones y no memoria accidental del enunciado.
- [ ] La puntuación, reservas y duración son coherentes con el diseño.
- [ ] Las referencias normativas cubren cada decisión relevante.
- [ ] El caso no copia un enunciado protegido ni promete equivalencia con el tribunal.

## Archivos fuente

- Módulos: `content-source/modules/`.
- Afirmaciones: `content-source/claims/`.
- Preguntas: `content-source/questions/`.
- Casos: `content-source/cases/`.
- Validador: `npm run content:validate`.
- Gate de publicación: `npm run content:gate-beta` (debe seguir cerrado hasta aprobar revisiones).
