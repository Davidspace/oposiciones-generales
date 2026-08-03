# Inventario de cartera — Academia LORMAN Lab

Fecha de corte: **2026-08-03**. Este documento describe lo que se puede afirmar a partir de los activos locales revisados. No sustituye una revisión editorial, normativa ni jurídica.

## Regla de publicación

Un dato solo pasa a una landing si tiene una fuente identificable, fecha de comprobación y estado editorial. Las cifras observadas en una página local se marcan como **comerciales no verificadas**. Un borrador generado con IA no es contenido publicable.

## Resumen

| Producto | Fuente principal | Activos localizados | Estado editorial | Qué puede comunicarse ahora |
|---|---|---|---|---|
| TCAE | Copia local de `LORMANAcademia` | Temarios, resúmenes, tests, simulacros y páginas para varias administraciones sanitarias | Revisión de alcance y vigencia pendiente | Que existe una línea TCAE y que el laboratorio separa cada convocatoria |
| TAI C1 | Moodle (lectura previa) y `tai-academia/app/tai/page.tsx` | 33 temas PDF, 33 autoevaluaciones, 10 simulacros y ruta de autoestudio | Inventario local; convocatoria y normativa deben comprobarse antes de publicar cifras | Que el producto está orientado a autoestudio con temas, tests y simulacros |
| Administrativo SS C1 | `SS/` de Alba, reflejado en `ss-casolab/SS/` | 23 temas generales, 13 específicos, tests por tema, simulacros, normativa y control de fuentes | Fuente editorial exacta; requiere control de corte antes de cada publicación | Que existe temario general/específico, tests y práctica; no prometer plazas ni aprobados |
| Auxiliar AGE C2 | BOE e INAP; material nuevo en `docs/c2/` y `content/c2/` | Mapa de examen, piloto original, muestra de 5 preguntas y taxonomía de errores | Piloto local pendiente de revisión humana | Que es una muestra experimental independiente, no oficial |
| Auxilio Judicial C2 | Moodle, curso 11, consulta de solo lectura | 26 temas y 90 cuestionarios únicos: autoevaluaciones, repasos, supuestos, simulacros y modelos oficiales | Inventario de aula auditado el 2026-08-03; la landing comunica solo tests | Que existe un producto de práctica autocorregible; no anunciar temario escrito ni equivalencia oficial |

## TCAE

**Evidencia local.** La landing original conservada en `lorman-lab/client/src/pages/tcae-home.tsx` muestra productos para SERMAS, TCAE-SAS, IMAS y SMS. La carpeta `lorman-lab/client/src/data/tcae-tests.ts` contiene bancos de preguntas para tests. La información procede del repositorio local original, no de una convocatoria revisada en este corte.

**Estado.** Disponible como material histórico de la marca. Antes de vender una convocatoria deben verificarse programa, administración, precio, duración, derechos de uso y actualización normativa.

**No anunciar todavía.** Número exacto de temas o preguntas, plazas, aprobados, garantía, precio vigente o “material actualizado” sin una matriz de fuentes y fecha.

| Campo | Inventario actual | Evidencia / estado |
|---|---|---|
| Segmento y ejercicio | TCAE por administraciones sanitarias (SAS, SMS, IMAS y SERMAS en la copia local) | Landing local; convocatoria concreta pendiente |
| Temario y resúmenes | Sí aparecen tarjetas de temas y recursos de estudio | `tcae-home.tsx`; revisión de cada convocatoria pendiente |
| Tests | Sí; banco local de preguntas | `client/src/data/tcae-tests.ts`; contar y revisar antes de anunciar |
| Simulacros | Se anuncian en la landing local | Contenido de marca; no verificado frente a cada convocatoria |
| Casos prácticos | No encontrado como inventario separado | No anunciar |
| Recurso gratuito | Test TCAE-SAS en `/test-tcae-sas` | Disponible localmente; revisar derechos y vigencia |
| Revisión y actualización | No hay una matriz única por administración en este laboratorio | Pendiente |
| Soporte humano | La copia original ofrece contacto comercial | No asumir tutoría ni corrección incluida |
| Venta posible | Producto por convocatoria, pack de tests o acceso anual | Hipótesis comercial; no implementar pagos |

## TAI C1

**Evidencia local.** La página de producto `oposiciones-digitales/tai-academia/app/tai/page.tsx` describe una ruta de cuatro pasos (mapa del examen, tema y autoevaluación, simulacro y revisión del error), 33 temas PDF, 33 autoevaluaciones y 10 simulacros. La ficha también menciona una estructura de 80 + 5 preguntas de reserva, 20 + 5 de reserva y 120 minutos; se conserva como afirmación de la landing y requiere contraste con la convocatoria vigente antes de usarla como dato oficial.

**Estado.** Producto de autoestudio con inventario visible. El precio `59 €` aparece en la página local como propuesta comercial observada; no se considera precio vigente hasta confirmar condiciones, impuestos, acceso y compra.

**No anunciar todavía.** Que el contenido sea oficial, que la convocatoria no cambie, una garantía de aprobado o resultados de alumnos.

| Campo | Inventario actual | Evidencia / estado |
|---|---|---|
| Segmento y ejercicio | TAI C1, dos partes del ejercicio según la página local | `tai-academia/app/tai/page.tsx`; contrastar convocatoria vigente |
| Temario | 33 temas PDF | Moodle/inventario local y landing; fecha de cada PDF pendiente |
| Resúmenes | No separado de forma verificable en el inventario local | No anunciar como activo independiente |
| Tests | 33 autoevaluaciones con corrección y explicación descritas | Moodle/inventario local; verificar cada cuestionario |
| Simulacros | 10 (5 de bloque III y 5 de bloque IV) descritos | Landing local; verificar formato y reservas |
| Casos prácticos | No encontrado como banco separado | No anunciar |
| Recurso gratuito | No encontrado en este laboratorio | Pendiente de crear o enlazar |
| Revisión y actualización | Fecha de corte del aula no documentada en esta ficha | Pendiente de inventario Moodle de solo lectura |
| Soporte humano | La oferta se describe como autoestudio sin tutoría individual | No prometer corrección manual |
| Venta posible | Curso completo, pack de tests o pack de simulacros | Hipótesis comercial; el precio local `59 €` es no verificado |

## Administrativo de la Seguridad Social C1

**Evidencia editorial.** `oposiciones-digitales/ss-casolab/SS/_trabajo/investigacion/programa_maestro.json` fija una fecha de corte de material de 2026-07-30 y separa 23 temas generales `G01–G23` y 13 específicos `S01–S13`. Hay contenidos y tests coincidentes en `_trabajo/contenidos/` y `_trabajo/tests/`, simulacros en `04. Simulacros/`, normativa en `05. Normativa/`, fuentes en `06. Fuentes y control de actualización/` e informes en `07. Informes de revisión/` y `08. Análisis de exámenes y preguntas/`.

**Estado.** Es la fuente editorial exacta de Alba. No se deben renombrar carpetas, mover documentos ni convertir borradores en material definitivo. Cada exportación al aula debe conservar fuente, versión, fecha de corte y revisión.

**No anunciar todavía.** Número de aprobados, equivalencia con la rúbrica del tribunal, vigencia indefinida, corrección manual incluida o resultados comerciales no documentados.

| Campo | Inventario actual | Evidencia / estado |
|---|---|---|
| Segmento y ejercicio | Administrativo de la Seguridad Social C1, turno libre; teoría y segundo ejercicio | `ss-casolab/CONTEXT.md` y fuente `SS/` |
| Temario | 23 generales + 13 específicos | `SS/_trabajo/investigacion/programa_maestro.json` |
| Resúmenes | Contenido de módulos en `_trabajo/contenidos/` | Revisar formato publicable por tema |
| Tests | G01–G23 y S01–S13 en `_trabajo/tests/` | Inventario de Alba; revisión exigida antes de publicar |
| Simulacros | Versiones razonadas del profesorado en `04. Simulacros/` | Deben separarse de borradores y auditarse |
| Casos prácticos | Microcasos y supuestos vinculados a específicos, según el contexto editorial | No presentar como rúbrica oficial sin fuente |
| Recurso gratuito | No fijado en el laboratorio | Pendiente de elegir muestra |
| Revisión y actualización | Fecha de corte 2026-07-30; normativa y fuentes en `05` y `06` | Actualización por convocatoria y reforma |
| Soporte humano | Modelo previsto: soporte limitado; autocorrección prioritaria | No incluye tutoría ilimitada |
| Venta posible | Curso completo, pack de tests, simulacros o microcasos | Hipótesis; no cambiar `SS/` |

## Auxilio Judicial C2

**Evidencia de aula.** El curso de Moodle 11 se identifica como «Auxilio Judicial - Curso completo de autoevaluación». La consulta de solo lectura del 2026-08-03 mostró 26 secciones temáticas y 90 cuestionarios únicos: 53 autoevaluaciones por tema, 18 repasos/transversales/bancos generales, 10 supuestos prácticos, 4 simulacros y 5 modelos de exámenes oficiales.

**Estado.** `auxiliar-juridico/` es una landing independiente para un producto de solo tests. No copia preguntas del aula, no anuncia temario escrito, no promete clases ni corrección individual y dirige al curso Moodle 11 para el acceso al material.

| Campo | Inventario actual | Evidencia / estado |
|---|---|---|
| Segmento y ejercicio | Auxilio Judicial, subgrupo C2 | Nombre del curso y secciones de Moodle; convocatoria vigente debe prevalecer |
| Temario visible | 26 temas/secciones | Curso Moodle 11, consulta de solo lectura |
| Tests por tema | 53 autoevaluaciones | Inventario de enlaces de cuestionario únicos |
| Repasos y bancos | 18 cuestionarios acumulativos, transversales y generales | Inventario de enlaces de cuestionario únicos |
| Práctica y simulacros | 10 supuestos + 4 simulacros | Secciones SUPUESTOS PRÁCTICOS y SIMULACROS |
| Modelos oficiales | 5 cuestionarios | Sección EXÁMENES OFICIALES; revisar derechos y vigencia antes de redistribuir |
| Recurso gratuito | No encontrado en el aula | La landing no reproduce preguntas; dirige a acceso |
| Soporte humano | No incluido en la propuesta de landing | Mantener límites claros |
| Venta posible | Acceso a tests, pack por bloques o curso completo | Hipótesis comercial; precio y condiciones pendientes |

## Auxiliar Administrativo del Estado C2

**Hechos oficiales comprobados.** La convocatoria de 22 de diciembre de 2025 se publicó en el BOE como [BOE-A-2025-26262](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26262). El turno libre del Cuerpo General Auxiliar incluye 1.544 plazas generales y 156 para discapacidad (1.700 en total). La titulación indicada es Graduado en Educación Secundaria Obligatoria o equivalente. El ejercicio único combina una primera parte de organización y psicotécnicos con una segunda parte de actividad administrativa y ofimática; la convocatoria fija 90 minutos, penalización de un tercio por error y Microsoft 365 de escritorio / Windows 11 para la parte ofimática. La [ficha de INAP](https://www.inap.es/es/seleccion/procesos-selectivos-de-cuerposescalas-generales/cuerpo-general-auxiliar-de-la-administracion-del-estado) es la segunda fuente oficial de seguimiento.

**Estado.** El material nuevo en `docs/c2/` y `content/c2/` es un piloto. Las preguntas son originales y tienen estado `pendiente_revision_humana`; no representan preguntas oficiales ni garantizan equivalencia con el examen.

**No anunciar todavía.** Una cifra de aprobados, una fecha futura de examen, una previsión de corte, una “IA que corrige como el tribunal” o un temario completo hasta terminar la matriz de fuentes y la revisión humana.

| Campo | Inventario actual | Evidencia / estado |
|---|---|---|
| Segmento y ejercicio | Auxiliar Administrativo AGE C2, ingreso libre, ejercicio único de dos partes | BOE-A-2025-26262 |
| Temario | Mapa exacto de 16 temas de organización + 12 de actividad/ofimática y dos microtemas piloto | `docs/c2/programa-oficial.md` y `content/c2/piloto/temas/`; fuente BOE |
| Resúmenes | No creado | Pendiente; no anunciar |
| Tests | 32 preguntas originales de piloto | `content/c2/piloto/preguntas.json`; `pendiente_revision_humana` |
| Simulacros | Mini-simulacro descrito, sin formato de examen oficial | `content/c2/piloto/mini-simulacro.md`; pendiente de revisión |
| Casos prácticos | No aplica al ejercicio de ingreso libre descrito; sí se estudian situaciones administrativas como contexto | No anunciar supuesto práctico C2 |
| Recurso gratuito | 5 preguntas en `muestra-gratuita.json` y ruta `/c2#prueba` | Local, sin pago, pendiente de revisión |
| Revisión y actualización | BOE/INAP comprobados el 2026-07-31; preguntas normativas y ofimáticas pendientes | Actualizar por convocatoria, ley y versión de software |
| Soporte humano | Autocorrección local; sin tutoría ni corrección manual | Mantener límites claros |
| Venta posible | Curso completo o packs por bloque cuando el piloto pase la puerta editorial | Hipótesis; no hay pagos en esta fase |

## Decisiones de comunicación

1. La landing común muestra el alcance real y el estado de cada producto.
2. Cada producto conserva su propia landing y su propia fuente editorial.
3. El laboratorio usa eventos anónimos locales. No se almacenan nombres, emails, teléfonos ni identificadores de Telegram.
4. El bot de Telegram solo responde a usuarios que inician el chat y aceptan recibir mensajes. No se importan listas ni se envían mensajes masivos no solicitados.

## Fuentes y trazabilidad

- BOE: [BOE-A-2025-26262](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26262), consultado el 2026-08-03.
- INAP: [Cuerpo General Auxiliar de la Administración del Estado](https://www.inap.es/es/seleccion/procesos-selectivos-de-cuerposescalas-generales/cuerpo-general-auxiliar-de-la-administracion-del-estado), consultado el 2026-08-03; el portal devolvió un error temporal durante la consulta y el BOE es la fuente primaria usada para las cifras.
- SS: `ss-casolab/SS/`, fecha de corte editorial 2026-07-30.
- TAI: inventario local de Moodle y `tai-academia/app/tai/page.tsx`, consultado el 2026-08-03.
- TCAE: `lorman-lab/client/src/pages/tcae-home.tsx` y `lorman-lab/client/src/data/tcae-tests.ts`, consultado el 2026-08-03.
