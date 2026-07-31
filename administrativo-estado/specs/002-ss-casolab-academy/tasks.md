# Tasks: Academia completa SS CasoLab

> Incremental checkpoint 2026-07-30: G20 is now a validated draft slice with 20 claims and 8 questions. The global corpus is 26 modules, 484 claims and 236 questions. Human academic, legal and normative review remains pending.

> Incremental checkpoint 2026-07-30: G19 is now a validated draft slice with 20 claims and 8 questions. The global corpus is 25 modules, 464 claims and 228 questions. Human academic, legal and normative review remains pending.

Checkpoint actual (2026-07-30): el corpus estructural contiene 36/36 módulos, 770 afirmaciones, 400 preguntas y 14 casos. La distribución de aciertos se ha reequilibrado a 100 por posición A/B/C/D. Siguen pendientes la revisión humana, la calibración y los gates de publicación.

Estados: `[x]` terminado con evidencia, `[~]` en curso, `[ ]` pendiente, `[!]` bloqueado por un dato o sistema externo. `[P]` permite trabajo paralelo sobre archivos distintos.

Cada tarea indica `Owner`, `Est`, `Depends`, `DoD` y `Risk`. Las horas son estimaciones humanas y deben registrarse para calcular ingreso por hora.

> **Venta cerrada.** B006 tiene implementación local no activada; B011 y V009 están parciales. Ninguna está cerrada de extremo a extremo. Los datos y sistemas externos de Gate 2 tampoco están acreditados. V010 está bloqueada hasta completar ambos grupos de gates y recibir autorización expresa para cualquier pago o devolución real.

**Corte de implementación (2026-07-30):** 24 módulos iniciados en borrador (`G01`–`G11`, `G13`–`G18`, `S01`–`S07`), 444 claims y 220 preguntas (192 de módulo + 28 prácticas en `MC01`, `MC02` y `CP01`). Faltan 12 módulos y 96 preguntas de módulo. Ningún borrador tiene revisión humana ni autorización de publicación.

## Phase 0 — Baseline y autoridad

- [x] A001 Crear y verificar rama aislada `codex/ss-academy-full` (Owner: IA; Est: 0,5 h; Depends: —; DoD: worktree limpio y rama visible; Risk: bajo)
- [x] A002 Reparar lockfile reproducible (Owner: IA; Est: 0,5 h; Depends: A001; DoD: `npm ci`, lint, build y tests verdes; Risk: medio)
- [x] A003 Crear checkpoint Aegis y baseline auditable (Owner: IA; Est: 1 h; Depends: A001; DoD: intent, checkpoint y evidencia versionables; Risk: bajo)
- [x] A004 Actualizar `CONTEXT.md` con SS principal, Pedido Bizum y soporte WhatsApp (Owner: IA; Est: 0,5 h; Depends: objetivo usuario; DoD: no quedan términos duales activos; Risk: bajo)
- [x] A005 Ampliar `spec.md` a 36 temas, Bizum y WhatsApp (Owner: IA; Est: 3 h; Depends: A004; DoD: historias, 41 requisitos y 14 criterios medibles; Risk: alto)
- [x] A006 Actualizar `plan.md` y `data-model.md` (Owner: IA; Est: 4 h; Depends: A005; DoD: owners, migración, seguridad y verificación explícitos; Risk: alto)
- [x] A007 [P] Verificar programa general, específico y fuentes en `research/` (Owner: IA; Est: 5 h; Depends: BOE vigente; DoD: 23 + 13 temas y enlaces oficiales; Risk: crítico)
- [x] A008 [P] Revisar arquitectura gratuita Bizum/WhatsApp (Owner: IA; Est: 4 h; Depends: decisión usuario; DoD: flujo, límites, fuentes, fraude y blockers; Risk: crítico)
- [x] A009 [P] Completar blueprint curricular de 36 módulos (Owner: IA; Est: 4 h; Depends: A005; DoD: mínimos alineados con FR-012; Risk: alto)
- [x] A010 Ejecutar revisión de cumplimiento y calidad de A005–A009 (Owner: IA reviewer; Est: 2 h; Depends: A007-A009; DoD: cero contradicción P0/P1; Evidencia: contraste de alcance 23+13, Bizum profesional, WhatsApp, cero gasto, fuentes y gates sin conflicto P0/P1; no sustituye revisión jurídica externa; Risk: alto)
- [x] A011 Crear matriz de trazabilidad `FR/SC → tarea → evidencia` (Owner: IA; Est: 3 h; Depends: A010; DoD: FR-001–FR-041 y SC-001–SC-014 tienen propietario verificable; Evidencia: `traceability.md` contiene 41 FR y 14 SC, sin IDs ausentes ni tareas duplicadas; Risk: alto)
- [x] A012 Retirar o actualizar quickstart, oferta, adquisición, emails y operación heredados (Owner: IA; Est: 3 h; Depends: A010; DoD: cero instrucción activa de checkout alojado o academia de 13 temas; Evidencia: documentación activa alineada y `specs/001-dual-mvp-validation/` marcada como histórica/supersedida; Risk: alto)

## Phase 1 — Fuente editorial y herramientas

- [x] E001 Ampliar `content-source/catalog.json` a 23 temas generales y 13 específicos (Owner: IA; Est: 3 h; Depends: A007; DoD: IDs, títulos oficiales, stream, fuentes, riesgo y estado; Risk: crítico)
- [x] E002 Actualizar `scripts/validate-ss-content.mjs` y pruebas para cobertura 23 + 13 (Owner: IA; Est: 3 h; Depends: E001; DoD: omisión, duplicado o stream incorrecto falla; Risk: alto)
- [x] E003 Definir esquemas validables de módulos y afirmaciones normativas en `content-source/schema/` (Owner: IA; Est: 4 h; Depends: A009; DoD: cobertura, vigencia, revisiones y dependencias verificables; Evidencia: schemas y pruebas locales; Risk: alto)
- [x] E004 Definir esquema validable de preguntas y casos (Owner: IA; Est: 4 h; Depends: A009; DoD: cuatro feedbacks, fuente, corte, error, repaso y estado obligatorios; Evidencia: schemas y pruebas locales; Risk: crítico)
- [x] E005 Crear validador de cobertura de epígrafes y fuentes (Owner: IA; Est: 4 h; Depends: E003-E004; DoD: contenido incompleto no publica; Evidencia: `scripts/validate-ss-content.mjs` y `npm run build` ejecuta `content:validate` antes de compilar; Risk: crítico)
- [x] E006 Crear exportador de preguntas a Moodle XML (Owner: IA; Est: 6 h; Depends: E004-E005; DoD: categoría, clave y feedback conservados; Evidencia: exportador y pruebas Moodle XML; Risk: alto)
- [x] E006B Crear exportador de módulos a HTML/libro Moodle con manifiesto (Owner: IA; Est: 6 h; Depends: E003,E005; DoD: teoría, repaso, fuentes, ID y versión conservados; Evidencia: exportador y pruebas de módulos; Risk: alto)
- [x] E006C Crear prueba de deriva fuente → exportación (Owner: IA; Est: 3 h; Depends: E006,E006B; DoD: hash, ID o versión divergentes fallan; Evidencia: manifiestos SHA-256 y verificadores de deriva probados; Risk: alto)
- [!] E007 Probar exportaciones con fixture de cuatro alternativas y caracteres españoles (Owner: IA + Alba; Est: 3 h; Depends: E006-E006C; DoD: fixture local válido e importación/reexportación equivalentes en Moodle real; Evidencia: fixture español y equivalencia local probados; Bloqueo: Moodle real para importar y reexportar; Risk: alto)
- [x] E008 Crear changelog y mapa inverso norma → activos (Owner: IA; Est: 3 h; Depends: E001-E005; DoD: localizar impacto en menos de 30 min; Evidencia: procedencia y `changeLog` obligatorios por activo, grafo inverso validado y `normative-impact.json` generado y probado; Risk: alto)
- [~] E009 Actualizar matriz normativa completa de 36 temas (Owner: IA + Alba; Est: 8 h; Depends: A007; DoD: norma, artículos/epígrafes, corte, riesgo y próxima revisión; Evidencia: `content/normative-matrix.md` cubre 36/36 IDs, 97 enlaces HTTPS oficiales, corte, riesgo, cadencia y notas temporales; faltan revisión humana y desglose puntual de las localizaciones marcadas como amplias; Risk: crítico)
- [x] E010 Crear generador de inventario y progreso editorial (Owner: IA; Est: 3 h; Depends: E001-E005; DoD: conteos por estado, tema y revisión; Evidencia: `scripts/report-editorial-progress.mjs`, manifiesto SHA-256 y pruebas focalizadas; Risk: medio)

## Phase 2 — Temario general G01–G23

Cada tarea produce un módulo completo y al menos ocho preguntas revisables. Todos dependen de E003–E005 y de la matriz del tema. Un módulo solo se marca terminado cuando pasa el validador y el checklist editorial; `publicado` exige además revisión humana.

- [~] G01 Constitución: estructura, contenido y reforma (Owner: IA + Alba; Est: 7 h; Depends: E003-E005,E009; DoD: módulo + 8 preguntas; Evidencia: borrador interno validado, 12 claims y 8 preguntas; falta revisión humana para publicar; Risk: medio)
- [~] G02 Derechos, garantías y suspensión (Owner: IA + Alba; Est: 7 h; Depends: G01; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 23 claims y 8 preguntas; faltan revisiones humanas y publicación; Risk: alto)
- [~] G03 Tribunal Constitucional (Owner: IA + Alba; Est: 6 h; Depends: G01-G02; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 19 claims y 8 preguntas; faltan revisiones humanas y publicación; Risk: medio)
- [~] G04 Corona (Owner: IA + Alba; Est: 5 h; Depends: G01; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 16 claims y 8 preguntas; faltan revisiones humanas y publicación; Risk: bajo)
- [~] G05 Cortes Generales y Defensor del Pueblo (Owner: IA + Alba; Est: 7 h; Depends: G01; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 20 claims y 8 preguntas, incluida la reforma constitucional de 2026; faltan revisiones humanas y publicación; Risk: medio)
- [~] G06 Poder Judicial y organización judicial (Owner: IA + Alba; Est: 7 h; Depends: G01; DoD: módulo + 8 preguntas; Evidencia: borrador validado de forma aislada, 17 claims y 8 preguntas; faltan regresión global estable, revisiones humanas y publicación; Risk: medio)
- [~] G07 Gobierno y Consejo de Estado (Owner: IA + Alba; Est: 7 h; Depends: G01,G05; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 21 claims y 8 preguntas; faltan revisiones humanas y publicación; Risk: medio)
- [~] G08 Administración General del Estado (Owner: IA + Alba; Est: 8 h; Depends: G07; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 24 claims y 8 preguntas; faltan revisiones humanas y publicación; Risk: alto)
- [~] G09 Organización territorial y local (Owner: IA + Alba; Est: 8 h; Depends: G01,G08; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 24 claims y 8 preguntas; faltan revisiones humanas y publicación; Risk: alto)
- [~] G10 Instituciones de la Unión Europea (Owner: IA + Alba; Est: 6 h; Depends: E003-E005,E009; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 16 claims y 8 preguntas; faltan revisiones humanas y publicación; Risk: medio)
- [~] G11 Fuentes del Derecho de la UE (Owner: IA + Alba; Est: 7 h; Depends: G10,G13; DoD: módulo + 8 preguntas; Evidencia: borrador validado tras normalizar la taxonomía de error, 19 claims y 8 preguntas; faltan revisiones humanas y publicación; Risk: alto)
- [~] G12 Ministerio de Inclusión (Owner: IA + Alba; Est: 6 h; Depends: G08; DoD: módulo + 8 preguntas con organigrama fechado; Evidencia: 20 claims y 8 preguntas, estructura del RD 501/2024 y modificación de 2026; faltan revisiones humanas; Risk: very-high)
- [~] G13 Fuentes del Derecho Administrativo (Owner: IA + Alba; Est: 6 h; Depends: G01; DoD: módulo + 8 preguntas; Evidencia: borrador interno validado, 11 claims y 8 preguntas; falta revisión humana para publicar; Risk: medio)
- [~] G14 Leyes, decreto-ley, decreto legislativo y reglamento (Owner: IA + Alba; Est: 7 h; Depends: G13; DoD: módulo + 8 preguntas; Evidencia: borrador implementado y validado, 13 claims y 8 preguntas; faltan revisión humana y publicación; Risk: alto)
- [~] G15 Actos administrativos (Owner: IA + Alba; Est: 9 h; Depends: G13-G14; DoD: módulo + 8 preguntas; Evidencia: borrador implementado y validado, 15 claims y 8 preguntas; faltan revisión humana y publicación; Risk: alto)
- [~] G16 Procedimiento: sujetos, derechos, silencio y plazos (Owner: IA + Alba; Est: 10 h; Depends: G15; DoD: módulo + 8 preguntas y cálculos de plazos; Evidencia: borrador implementado y validado, 18 claims y 8 preguntas; faltan revisión humana y publicación; Risk: very-high)
- [~] G17 Fases y ejecución del procedimiento (Owner: IA + Alba; Est: 9 h; Depends: G16; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 25 claims y 8 preguntas; faltan revisiones humanas y publicación; Risk: alto)
- [~] G18 Recursos y jurisdicción contenciosa (Owner: IA + Alba; Est: 10 h; Depends: G15-G17; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 20 claims y 8 preguntas; faltan revisiones humanas y publicación; Risk: very-high)
- [~] G19 Empleo público (Owner: IA + Alba; Est: 8 h; Depends: G08,G16; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 20 claims y 8 preguntas; falta revisión humana y publicación; Risk: alto)
- [~] G20 Atención e información administrativa (Owner: IA + Alba; Est: 6 h; Depends: G16,G23; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 20 claims y 8 preguntas; falta revisión humana y publicación; Risk: medio)
- [~] G21 Igualdad, violencia, discapacidad, dependencia y LGTBI (Owner: IA + Alba; Est: 8 h; Depends: G02; DoD: módulo + 8 preguntas; Evidencia: 20 claims y 8 preguntas con LO 3/2007, LO 1/2004, RDL 1/2013, Ley 39/2006 y Ley 4/2023; faltan revisiones humanas; Risk: very-high)
- [~] G22 Protección de datos (Owner: IA + Alba; Est: 8 h; Depends: G02,G16; DoD: módulo + 8 preguntas; Evidencia: 20 claims y 8 preguntas con RGPD y LO 3/2018; faltan revisiones humanas; Risk: high)
- [~] G23 Funcionamiento electrónico del sector público (Owner: IA + Alba; Est: 9 h; Depends: G15-G17; DoD: módulo + 8 preguntas; Evidencia: 20 claims y 8 preguntas con Leyes 39/2015 y 40/2015, RD 203/2021, ENI y ENS; faltan revisiones humanas; Risk: high)
- [~] G24 Auditar cobertura y equilibrio del bloque general (Owner: IA reviewer + Alba; Est: 5 h; Depends: G01-G23; DoD: 184 preguntas, 23 temas, epígrafes y dificultad sin huecos; Evidencia: `94-curriculum-audit.md` confirma 23/23 módulos y 184/184 preguntas; falta revisar epígrafes y dificultad con Alba; Risk: crítico)

## Phase 3 — Temario específico S01–S13

Cada tarea produce un módulo completo y al menos ocho preguntas. No se duplicará material de Alba: primero se importa e inventaría su contenido.

- [!] S000 Obtener `.mbz` sin usuarios o acceso temporal e inventario de Alba (Owner: Alba + David; Est: 1 h; Depends: —; DoD: material auditable; Risk: crítico)
- [~] S001 Seguridad Social en la Constitución y TRLGSS (Owner: IA + Alba; Est: 8 h; Depends: E003-E005,E009,S000; DoD: módulo + 8 preguntas; Evidencia: borrador interno validado, 10 claims y 8 preguntas; falta inventario de Alba y revisión humana para publicar; Risk: alto)
- [~] S002 Campo de aplicación, regímenes y sistemas (Owner: IA + Alba; Est: 10 h; Depends: S001; DoD: módulo + 8 preguntas; Evidencia: borrador implementado y validado, 15 claims y 8 preguntas; faltan revisión humana, inventario de Alba y publicación; Risk: very-high)
- [~] S003 Afiliación, altas, bajas y encuadramiento (Owner: IA + Alba; Est: 10 h; Depends: S002; DoD: módulo + 8 preguntas e integración del caso gratuito; Evidencia: borrador implementado y validado, 15 claims y 8 preguntas de módulo; `MC01` conserva aparte 5 claims y 5 preguntas; faltan revisión humana, inventario de Alba y publicación; Risk: high)
- [~] S004 Cotización y liquidación (Owner: IA + Alba; Est: 12 h; Depends: S002-S003; DoD: módulo + 8 preguntas versionadas; Evidencia: borrador validado, 19 claims y 8 preguntas; faltan inventario de Alba, revisiones humanas y publicación; Risk: very-high)
- [~] S005 Recaudación voluntaria (Owner: IA + Alba; Est: 10 h; Depends: S004; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 22 claims y 8 preguntas; faltan inventario de Alba, revisiones humanas y publicación; Risk: high)
- [~] S006 Recaudación ejecutiva (Owner: IA + Alba; Est: 10 h; Depends: S005; DoD: módulo + 8 preguntas; Evidencia: borrador validado, 19 claims y 8 preguntas; faltan inventario de Alba, revisiones humanas y publicación; Risk: high)
- [~] S007 Acción protectora (Owner: IA + Alba; Est: 10 h; Depends: S002-S004; DoD: módulo + 8 preguntas; Evidencia: borrador validado de forma aislada, 20 claims y 8 preguntas; faltan inventario de Alba, revisiones humanas y publicación; Risk: high)
- [~] S008 Incapacidad temporal y permanente (Owner: IA + Alba; Est: 13 h; Depends: S007; DoD: módulo + 8 preguntas; Evidencia: 20 claims y 8 preguntas; faltan revisiones humanas; Risk: very-high)
- [~] S009 Nacimiento, cuidados y prestaciones familiares (Owner: IA + Alba; Est: 13 h; Depends: S007; DoD: módulo + 8 preguntas; Evidencia: 20 claims y 8 preguntas; faltan revisiones humanas; Risk: very-high)
- [~] S010 Jubilación contributiva (Owner: IA + Alba; Est: 14 h; Depends: S004,S007; DoD: módulo + 8 preguntas y reglas temporales; Evidencia: 20 claims y 8 preguntas, con fecha y transitorios; faltan revisiones humanas; Risk: very-high)
- [~] S011 Muerte y supervivencia (Owner: IA + Alba; Est: 12 h; Depends: S007; DoD: módulo + 8 preguntas; Evidencia: 20 claims y 8 preguntas; faltan revisiones humanas; Risk: high)
- [~] S012 No contributivas, asistenciales e IMV (Owner: IA + Alba; Est: 14 h; Depends: S007; DoD: módulo + 8 preguntas; Evidencia: 20 claims y 8 preguntas con Ley 19/2021; faltan revisiones humanas; Risk: very-high)
- [~] S013 Recursos, patrimonio y pagos (Owner: IA + Alba; Est: 9 h; Depends: S001,S005,S007; DoD: módulo + 8 preguntas; Evidencia: 20 claims y 8 preguntas; faltan revisiones humanas; Risk: high)
- [~] S014 Auditar cobertura del bloque específico (Owner: IA reviewer + Alba; Est: 6 h; Depends: S001-S013; DoD: 104 preguntas, 13 temas, epígrafes y cálculos sin huecos; Evidencia: `94-curriculum-audit.md` confirma 13/13 módulos y 104/104 preguntas; falta revisar epígrafes, cálculos y dificultad con Alba; Risk: crítico)

## Phase 4 — Casos, supuestos y simulacros

- [x] P000 Migrar `MC01` hardcoded a la fuente canónica (Owner: IA + Alba; Est: 4 h; Depends: E004-E006C; DoD: caso y 5 preguntas en `content-source`, adaptador de landing desde esa fuente, prueba de paridad y retirada del texto duplicado de `lib/ss-casolab.ts`; Evidencia: `MC01.json`, `ss-03-q101..q105`, claims inversos y prueba de paridad; Risk: crítico)
- [~] P001 Completar y revisar microcaso 1: afiliación y altas (Owner: IA + Alba; Est: 4 h; Depends: P000,S003; DoD: 5 decisiones conectadas revisadas y publicables; Evidencia: borrador canónico validado, 5 preguntas y 5 claims; faltan S003, revisión académica y jurídica; Risk: high)
- [~] P002 Crear microcaso 2: encuadramiento de una actividad (Owner: IA + Alba; Est: 4 h; Depends: S002-S003; DoD: 5 decisiones; Evidencia: `MC02` original, 5 preguntas, 6 claims, 20 feedbacks y trazabilidad BOE validados en borrador; faltan revisiones académica, jurídica y normativa; Risk: high)
- [~] P003 Crear microcaso 3: primera liquidación (Owner: IA + Alba; Est: 4 h; Depends: S004; DoD: 5 decisiones; Evidencia: `MC03`, 5 preguntas, 5 claims y trazabilidad BOE generados y validados como borrador; faltan revisiones académica, jurídica y normativa; Risk: high)
- [~] P004 Crear microcaso 4: deuda, periodo voluntario y apremio (Owner: IA + Alba; Est: 5 h; Depends: S005-S006; DoD: 5 decisiones; Evidencia: `MC04`, 5 preguntas, 5 claims y fuentes de recaudación generados y validados como borrador; faltan revisiones académica, jurídica y normativa; Risk: high)
- [~] P005 Crear microcaso 5: cadena de incapacidad (Owner: IA + Alba; Est: 5 h; Depends: S007-S008; DoD: 5 decisiones; Evidencia: `MC05`, 5 preguntas, 5 claims y trazabilidad BOE generados y validados como borrador; faltan revisiones académica, jurídica y normativa; Risk: very-high)
- [~] P006 Crear microcaso 6: modalidad de jubilación (Owner: IA + Alba; Est: 5 h; Depends: S007,S010; DoD: 5 decisiones; Evidencia: `MC06`, 5 preguntas, 5 claims y cobertura S07/S10 generados y validados como borrador; faltan revisiones académica, jurídica y normativa; Risk: very-high)
- [~] P007 Crear microcaso 7: muerte y supervivencia (Owner: IA + Alba; Est: 5 h; Depends: S007,S011; DoD: 5 decisiones; Evidencia: `MC07`, 5 preguntas, 5 claims y cobertura S07/S11 generados y validados como borrador; faltan revisiones académica, jurídica y normativa; Risk: very-high)
- [~] P008 Crear microcaso 8: acceso y mantenimiento del IMV (Owner: IA + Alba; Est: 5 h; Depends: S007,S012; DoD: 5 decisiones; Evidencia: `MC08`, 5 preguntas, 5 claims y fuente de la Ley 19/2021 generados y validados como borrador; faltan revisiones académica, jurídica y normativa; Risk: very-high)
- [~] P009 Crear `CP01`: encuadramiento, afiliación, alta y baja (Owner: IA + Alba; Est: 9 h; Depends: S001-S003; DoD: 15 + 3 decisiones originales y coherentes con el lote beta; Evidencia: caso original en `draft`, 15 principales + 3 reservas separadas, 18 preguntas, 72 feedbacks, 21 referencias BOE y 19 claims canónicos reutilizados con trazabilidad; faltan revisiones académica, jurídica y normativa; Risk: crítico)
- [~] P010 Crear `CP02`: deuda, aplazamiento y vía ejecutiva (Owner: IA + Alba; Est: 9 h; Depends: S004-S007,G15-G18; DoD: 15 + 3 decisiones; Evidencia: caso original `CP02`, 18 preguntas y 18 claims trazables generado y validado como borrador; faltan revisiones académica, jurídica y normativa; Risk: crítico)
- [~] P011 Crear `CP03`: accidente, incapacidad y protección familiar (Owner: IA + Alba; Est: 10 h; Depends: S007-S008,S011; DoD: 15 + 3 decisiones; Evidencia: caso original `CP03`, 18 preguntas y 18 claims trazables generado y validado como borrador; faltan revisiones académica, jurídica y normativa; Risk: crítico)
- [~] P012 Crear `CP04`: cuidados, jubilación, IMV y pagos (Owner: IA + Alba; Est: 10 h; Depends: S007,S009-S010,S012-S013; DoD: 15 + 3 decisiones; Evidencia: caso original `CP04`, 18 preguntas y 18 claims trazables generado y validado como borrador; faltan revisiones académica, jurídica y normativa; Risk: crítico)
- [~] P013 Configurar `SIM01` de consolidación (Owner: IA + Alba; Est: 6 h; Depends: G24,S014,P009-P012; DoD: 70+3 y 15+3, 120 min; Evidencia: `SIM01` con 73 preguntas generales, cobertura de 36 temas y `CP01`; validado como borrador; falta calibración y revisión; Risk: crítico)
- [~] P014 Configurar `SIM02` con ítems `assessment-only` (Owner: IA + Alba; Est: 6 h; Depends: P013; DoD: cobertura y dificultad alternativas; Evidencia: `SIM02` con 73 preguntas generales, cobertura de 36 temas y `CP03`; configuración inicial validada como borrador; falta banco reservado `assessment-only` dedicado y revisión; Risk: crítico)
- [ ] P015 Auditar originalidad, coherencia y calibración práctica (Owner: Alba + externo; Est: 8 h; Depends: P001-P014; DoD: cero ambigüedad crítica; Risk: crítico)
- [x] P016 Preparar cola reproducible de revisión humana (Owner: IA; Est: 2 h; Depends: P001-P014; DoD: inventario por riesgo, temas, preguntas, casos y checklist de revisión; Evidencia: `scripts/build-human-review-queue.mjs`, `npm run content:review-queue` y `docs/aegis/work/2026-07-29-ss-academy-full/96-human-review-queue.md`; no sustituye la revisión de Alba ni el gate jurídico/normativo; Risk: medio)

## Phase 5 — Pedidos Bizum y WhatsApp

- [x] B001 Actualizar contrato de embudo, pedido y conciliación manual de Bizum profesional (Owner: IA; Est: 2 h; Depends: A008; DoD: estados, auth, idempotencia y fallos explícitos; Risk: crítico)
- [x] B002 Añadir pruebas de estado e idempotencia de pedidos (Owner: IA; Est: 4 h; Depends: B001; DoD: transiciones permitidas/prohibidas cubiertas; Evidencia: pruebas de máquinas separadas de pago y acceso; Risk: crítico)
- [x] B003 Crear migración D1 de pedidos y auditoría (Owner: IA; Est: 4 h; Depends: B001-B002; DoD: índices y constraints aplicados; Evidencia: migraciones `0000–0003` aplicadas en SQLite real, constraints/triggers probados, schema Drizzle alineado y ledgers append-only separados para pedido, acceso y devolución; no acredita D1 remota; Risk: crítico)
- [~] B004 Implementar creación y consulta segura de pedido (Owner: IA; Est: 6 h; Depends: B003; DoD: precio servidor, referencia/token, caducidad y honeypot; Evidencia: `/api/orders` y `/api/orders/status`, cookie/token opacos, store D1 y pruebas locales; faltan aplicación en D1 remota, preview protegido y verificación de producción cerrada; Risk: crítico)
- [x] B005 Impedir eventos públicos de pago confirmado (Owner: IA; Est: 2 h; Depends: B001; DoD: navegador no puede emitir venta; Evidencia: allowlist por evento, UUID idempotente, rate limit y pruebas adversariales; Risk: crítico)
- [~] B006 Implementar confirmación administrativa idempotente (Owner: IA; Est: 6 h; Depends: B003; DoD: secreto, tiempo constante, auditoría y estado esperado; Evidencia: `lib/admin-orders.ts`, `lib/admin-order-handlers.ts`, `db/admin-orders.ts`, `POST /api/admin/orders/verify-payment` y 11 pruebas cubren secretos separados por operador, comparación constante, HMAC versionado de referencia, estado esperado, idempotencia, batch atómico y ledger; faltan D1 remota, protección perimetral o rate limit distribuido, credenciales y prueba controlada real; no da acceso Moodle; Risk: crítico)
- [~] B007 Implementar solicitud de verificación y manejo de incidencias (Owner: IA; Est: 4 h; Depends: B004; DoD: no confunde aviso con pago; Evidencia: `/api/orders/report-payment` y pruebas locales solo transicionan a `payment_reported`; manejo administrativo de incidencias pendiente y ningún pago se confirma; Risk: high)
- [x] B008 Crear constructor seguro de enlace WhatsApp (Owner: IA; Est: 2 h; Depends: B004; DoD: solo referencia opaca en URL; Evidencia: `buildWhatsappUrl` valida la referencia, limita el texto y genera `https://wa.me/`; pruebas locales verifican que no expone PII ni secretos; Risk: medium)
- [~] B009 Crear páginas de pedido, instrucciones y estado (Owner: IA; Est: 6 h; Depends: B004,B008; DoD: accesibles, móviles y sin estados falsos; Evidencia: `/ss-casolab/pedido` implementa oferta previa, aceptaciones separadas, referencia, instrucciones, estado y aviso de pago; faltan inspección visual/E2E protegida y configuración real; Risk: high)
- [~] B010 Sustituir checkout alojado por pedido Bizum/WhatsApp; mantener email contractual en pedido (Owner: IA; Est: 5 h; Depends: B009,L001-L006; DoD: copia coincide con oferta/condiciones; Evidencia: checkout legado responde `410`, la landing solo enlaza el pedido si toda la configuración comercial es válida y el formulario exige email contractual; faltan documentos, identidad y prueba externa reales; Risk: crítico)
- [~] B011 Crear script/runbook para verificar, dar acceso, devolver y reconciliar (Owner: IA + David; Est: 5 h; Depends: B006; DoD: operaciones reproducibles sin secretos en Git; Evidencia: `scripts/verify-bizum-order.mjs` y `docs/bizum-admin-runbook.md` validan dry-run e idempotencia sin exponer la referencia bancaria; faltan ejecución acreditada, acceso Moodle, devolución y reconciliación reales; Risk: critical)
- [~] B012 Añadir exportación semanal de pedidos y métricas agregadas (Owner: IA; Est: 4 h; Depends: B003-B007; DoD: no exporta secretos ni números completos; Evidencia: endpoint GET autenticado, consultas agregadas verificadas en SQLite real, conversiones, CLI y runbook sin filas ni PII; faltan D1 remota, protección perimetral y contraste con Moodle/soporte; Risk: high)
- [!] B013 Contratar o acreditar alta de Bizum profesional sin gasto nuevo (Owner: David; Est: 1 h; Depends: —; DoD: producto, contrato/alta, límites, costes y devoluciones por escrito; Risk: crítico)
- [!] B014 Aportar número WhatsApp Business y configurar 2FA/perfil (Owner: David; Est: 1 h; Depends: —; DoD: E.164, horario y responsable; Risk: critical)
- [!] B015 Aportar destino del servicio profesional y nombre visible aprobado (Owner: David; Est: 0,5 h; Depends: B013; DoD: configuración real fuera de Git; Risk: crítico)

## Phase 6 — Legal, soporte y operación

- [~] L001 Redactar aviso legal con campos del vendedor (Owner: IA + externo; Est: 2 h; Depends: A008; DoD: fuentes y placeholders; Evidencia: `legal/legal-notice.md`; faltan datos reales y revisión externa; Risk: critical)
- [~] L002 Redactar privacidad para web, pedidos y WhatsApp (Owner: IA + externo; Est: 3 h; Depends: A008; DoD: finalidades, bases, encargados y derechos; Evidencia: `legal/privacy.md`; faltan proveedores, plazos y revisión externa; Risk: critical)
- [~] L003 Redactar política de cookies real (Owner: IA + externo; Est: 2 h; Depends: auditoría técnica; DoD: coincide con cookies utilizadas; Evidencia: `legal/cookies.md` y retirada de `sessionStorage`; falta reaudit del build/proveedores desplegados y revisión externa; Risk: high)
- [~] L004 Redactar contratación/preventa y botón de obligación de pago (Owner: IA + externo; Est: 4 h; Depends: oferta final; DoD: arts. 10, 27 y 28 LSSI; contenido, precio, entrega, soporte e impuestos; Evidencia: `legal/terms.md`; faltan oferta/datos reales y revisión externa; Risk: crítico)
- [~] L005 Redactar desistimiento y devoluciones (Owner: IA + externo; Est: 3 h; Depends: L004; DoD: inicio inmediato y contenido digital revisados; Evidencia: `legal/withdrawal-and-refunds.md`; clasificación y revisión externa pendientes; Risk: critical)
- [~] L006 Redactar facturación, soporte y SLA (Owner: IA + externo; Est: 2 h; Depends: L004; DoD: procedimiento y límites claros; Evidencia: `legal/support-and-billing.md`; faltan fiscalidad, horario, SLA y revisión; Risk: high)
- [x] L007 Crear FAQ y base de conocimiento (Owner: IA + Alba; Est: 4 h; Depends: A008,A009; DoD: 80 % de dudas previsibles cubiertas; Evidencia: `content/support-kb.md` cubre producto, diagnóstico, pedido, Moodle, privacidad, baja, reembolso y escalado; sigue siendo borrador interno hasta los gates legal/comercial; Risk: medium)
- [~] L008 Crear respuestas rápidas y etiquetas WhatsApp (Owner: IA + David; Est: 2 h; Depends: B014,L007; DoD: acceso, incidencia, baja y tiempos; Evidencia: `content/whatsapp-quick-replies.md` contiene etiquetas y respuestas; faltan número/horario/URLs, carga y prueba en la cuenta real; Risk: medium)
- [x] L009 Crear registro de soporte y cálculo de tiempo (Owner: IA; Est: 3 h; Depends: L007; DoD: categoría, SLA, escalado y minutos; Evidencia: contrato cerrado sin texto ni PII, agregador, CLI, runbook y pruebas; no acredita carga real de WhatsApp; Risk: medium)
- [~] L010 Actualizar modelo operativo para 50/100/250/500 alumnos (Owner: IA + David; Est: 3 h; Depends: B011,L007-L009; DoD: horas y umbrales explícitos; Evidencia: fórmulas, capacidades y decisiones por escala documentadas; faltan horas observadas y recorrido B011 real; Risk: medium)
- [!] L011 Aportar identidad, fiscalidad, contacto, precio y política comercial (Owner: David; Est: 1 h; Depends: —; DoD: placeholders completos; Risk: critical)
- [!] L012 Revisión jurídica externa de L001-L006 y lotes críticos (Owner: externo; Est: variable; Depends: L001-L006; DoD: observaciones cerradas; Risk: critical)

## Phase 7 — Moodle y experiencia completa

- [!] M001 Obtener copia `.mbz` sin usuarios, URL y rol temporal (Owner: Alba + David; Est: 1 h; Depends: —; DoD: aula auditable; Risk: critical)
- [ ] M002 Auditar estructura, plugins, categorías, roles, correo y backup (Owner: IA + David; Est: 4 h; Depends: M001; DoD: informe y plan de mínimos; Risk: high)
- [ ] M003 Configurar estructura G01–G23 y S01–S13 (Owner: Alba + IA; Est: 5 h; Depends: M002,E006; DoD: navegación y finalización; Risk: high)
- [ ] M004 Importar lote piloto y verificar feedback (Owner: Alba + IA; Est: 3 h; Depends: E007,M003; DoD: pregunta equivalente tras export/reimport; Risk: high)
- [ ] M005 Configurar diagnóstico, rutas y reintentos del lote beta (Owner: Alba + IA; Est: 6 h; Depends: M003,P001-P002,P009; DoD: flujo beta completo sin depender del corpus final; Risk: high)
- [ ] M006 Documentar alta, recuperación, baja y devolución (Owner: IA + David; Est: 3 h; Depends: M002,B011; DoD: sin contraseñas por WhatsApp; Risk: critical)
- [ ] M007 Probar copia y restauración sin usuarios (Owner: David + Alba; Est: 3 h; Depends: M003-M005; DoD: curso recuperado; Risk: critical)
- [ ] M008 Ejecutar QA de alumno en escritorio, móvil, teclado y lector (Owner: IA + David; Est: 5 h; Depends: M005; DoD: cero P0/P1; Risk: high)
- [ ] M009 Definir y probar importación semanal de métricas agregadas Moodle (Owner: IA + David; Est: 4 h; Depends: M002,M005; DoD: actividad sin duplicar intentos ni PII en D1; Risk: alto)
- [ ] M010 Configurar y probar los simulacros completos (Owner: Alba + IA; Est: 6 h; Depends: M005,P013-P014; DoD: SIM01–SIM02 ejecutan 120 minutos, reservas y rutas de repaso; Risk: high)

## Phase 8 — Captación, publicación y validación

- [x] V001 Actualizar tres variantes de landing para academia completa (Owner: IA + David; Est: 3 h; Depends: A009,B010; DoD: una variable por experimento; Evidencia: misma landing, oferta y formulario con tres titulares y variantes de atribución en `/ss-casolab`, `/sin-horarios` y `/repaso`; build y revisión Playwright en escritorio/móvil verifican titulares, cero overflow, cero error de consola y ninguna pregunta de precio; tráfico y configuración pertenecen a V008–V011; Risk: medium)
- [x] V002 Crear diez publicaciones, cinco mensajes y tres guiones gratuitos (Owner: IA; Est: 4 h; Depends: V001; DoD: CTA, UTM y canal por pieza; Evidencia: `content/acquisition.md` contiene 10 publicaciones, 5 mensajes y 3 guiones alineados con las tres URLs, además del gate de publicación; no se ha distribuido ninguna pieza; Risk: low)
- [~] V003 Crear un lead magnet original para validar la beta (Owner: IA + Alba; Est: 3 h; Depends: S002-S003,P001; DoD: valor, fuente, CTA y revisión; Evidencia: diagnóstico original `MC01`, entrega sin registro, CTA, fuentes, límites y métricas documentados e implementados tras gate servidor; faltan revisión humana y publicación; Risk: medio)
- [ ] V003B Crear otros dos lead magnets solo si el primero alcanza el umbral (Owner: IA + Alba; Est: 4 h; Depends: V003,V012; DoD: cada uno prueba una hipótesis distinta; Risk: bajo)
- [ ] V004 Instrumentar web/pedido sin PII y consolidar agregado Moodle (Owner: IA; Est: 5 h; Depends: B004-B012,M009; DoD: propietarios separados y embudo semanal; Risk: alto)
- [~] V005 Crear cuadro semanal y registro de horas (Owner: IA; Est: 3 h; Depends: B012,V004; DoD: ingreso/hora calculable; Evidencia: contrato cerrado de horas, agregador y cuadro JSON/Markdown calculan ingreso neto por hora y límites de carga sin PII; faltan datos reales, agregado Moodle y campaña; Risk: medium)
- [~] V006 Ejecutar gate explícito de beta Lote 1 (Owner: Alba + David + externo; Est: 6 h; Depends: G01,G13-G16,S001-S003,P001-P002,P009,B011,L001-L012,M004; DoD: checklist editorial, normativo, legal, comercial y operativo verde; Evidencia: `content:gate-beta` comprueba automáticamente inventario, preguntas, reservas, referencias y revisiones del subgate editorial y falla cerrado; faltan CP01 definitivo, revisiones humanas, Moodle y gates legal/comercial/operativo; Risk: crítico)
- [!] V007 Recuperar acceso al proyecto Sites existente (Owner: David; Est: 0,5 h; Depends: —; DoD: proyecto accesible en sesión; Risk: high)
- [ ] V008 Desplegar versión cerrada y ejecutar smoke test (Owner: IA + David; Est: 2 h; Depends: V006,V007; DoD: URL, móvil, API y captura cerrada; Risk: critical)
- [~] V009 Verificar el pedido en local o preview protegido, sin datos ni dinero reales (Owner: IA + David; Est: 2 h; Depends: B004,B007-B009; DoD: crear, consultar, avisar de pago y generar `wa.me` funcionan con configuración de prueba; Evidencia: superficie, disclosures, sesión HttpOnly y rutas tienen pruebas locales/build; falta recorrer la interfaz renderizada de extremo a extremo con configuración de prueba; `SS_CASOLAB_ORDERING_ENABLED` sigue `false` en producción y no se afirma D1 remota, captura, administración, pago ni publicación; Risk: critical)
- [!] V010 Tras aprobar Gate 2, habilitar pedidos en producción y ejecutar un pago Bizum real y su devolución solo con autorización expresa del propietario (Owner: David; Est: 1 h; Depends: V009,B006,B011,B013-B015,L011-L012,Gate 2; DoD: configuración externa, migración remota, confirmación administrativa, conciliación, acceso, devolución y auditoría quedan acreditados; Bloqueo: Gate 2, datos/sistemas externos y autorización expresa para cualquier operación monetaria; Risk: critical)
- [ ] V011 Ejecutar campaña de 30 días y registrar días 3/7/14/21/30 (Owner: David + IA; Est: 12 h; Depends: V001,V003,V004,V005,V009,V010; DoD: visitas, pedidos, pagos, acceso, soporte y horas; Risk: alto)
- [ ] V012 Aplicar decisión continuar/modificar/detener (Owner: Alba + David; Est: 2 h; Depends: V011; DoD: decisión con evidencia; Risk: high)

## Completion Gates

Los gates son acumulativos y no se sustituyen entre sí.

### Gate 1 — Beta preparada para verificación protegida

- El lote editorial definido por V006 es publicable y tiene revisión humana exigida por su riesgo.
- P000 ha eliminado la doble fuente de `MC01`; el lote práctico de beta supera sus validadores.
- B001–B012, L001–L012 y M001–M008 deben delimitar por separado la evidencia local y la externa de pedido, cobro, acceso, soporte, legalidad, importación y recuperación. M010 pertenece al producto completo y no bloquea esta verificación.
- Gate 1 solo se aprueba cuando V006–V009 estén superadas. V009 prueba el pedido solo en local o preview protegido; no activa pedidos o captación reales ni ejecuta pago alguno.
- Cada requisito de la beta tiene evidencia directa; una build verde o una marca de tarea no bastan.

### Gate 2 — Autorización previa del recorrido comercial

- Antes de aprobar este gate deben existir datos y revisión legal/comercial reales, migración D1 remota verificada, operación administrativa protegida, Moodle auditable y WhatsApp Business configurado; un artefacto local no sustituye estas evidencias.
- Solo después de registrar la aprobación expresa de Gate 2 puede V010 habilitar `SS_CASOLAB_ORDERING_ENABLED` en producción y ejecutar el pago Bizum real y su devolución. Hasta entonces los pedidos de producción permanecen deshabilitados.
- V010 debe verificar pago, conciliación, acceso, revocación/devolución y auditoría sin aceptar señales del navegador como venta.

### Gate 3 — Validación de 30 días completada

- M009 aporta métricas agregadas de Moodle sin duplicar intentos ni introducir PII innecesaria.
- V011 registra los cortes de los días 3, 7, 14, 21 y 30, además de soporte y horas del propietario.
- V012 documenta con evidencia la decisión de continuar, modificar o detener.

### Gate 4 — Academia completa

- G01–G24 y S001–S014 prueban 36 módulos y 288 preguntas publicables.
- P001–P015 prueban el banco práctico completo.
- M010 prueba los dos simulacros completos en Moodle.
- FR-001–FR-041 y SC-001–SC-014 tienen evidencia directa y trazable.
> Incremental checkpoint 2026-07-30: G12, G21-G23 y S008-S013 ya disponen de módulo, lección, hoja de repaso, 20 afirmaciones trazables y 8 preguntas cada uno. Se mantienen como borradores hasta la revisión de Alba y la revisión jurídica/normativa.
