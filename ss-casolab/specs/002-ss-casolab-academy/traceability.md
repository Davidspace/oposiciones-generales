# Trazabilidad — requisito, tarea y evidencia

Estados: `verified`, `implemented-unreviewed`, `planned`, `external-blocked`. Cuando una fila combina estados, la explicación delimita qué parte tiene evidencia y cuál no; `verified local` no acredita D1 remota, sistemas externos ni producción. La validación automatizada de un borrador no se presenta como revisión humana.

> **Venta cerrada.** B006 tiene implementación local no activada; B011 y V009 están parciales. Los gates externos de identidad/documentos, Bizum profesional, WhatsApp Business, Moodle, D1 remota, hosting, protección administrativa y revisiones humanas siguen abiertos. V010 permanece `external-blocked` hasta Gate 2 y una autorización expresa para cualquier pago o devolución real.

**Corte 2026-07-30:** ocho módulos en borrador (`G01`, `G13`, `G14`, `G15`, `G16`, `S01`, `S02`, `S03`), 114 claims y 69 preguntas (64 de módulo + 5 de `MC01`). Quedan 28 módulos y 224 preguntas de módulo. No existe evidencia de revisión humana ni publicación de estos borradores.

## Functional Requirements

| Requisito | Tareas propietarias | Evidencia actual o esperada | Estado |
|---|---|---|---|
| FR-001 | E001–E002, G01–G24, S001–S014 | Catálogo validado de 23+13; borradores G01, G13, G14, G15, G16, S01, S02 y S03 | verified catálogo; implemented-unreviewed 8/36; planned 28 restantes |
| FR-002 | A009, G01–G24, S001–S014, M003 | Blueprint de dos bloques y futura estructura Moodle | verified diseño; external-blocked Moodle |
| FR-003 | P000–P001, V003 | `MC01` tiene fuente canónica y adaptador; `/api/ss-diagnostic` devuelve `publicable: false` mientras siga en borrador sin revisión | verified fuente única/paridad y gate servido desde servidor; implemented-unreviewed caso; planned revisión/publicación |
| FR-004 | E004–E007, G/S/P | Schemas y validador; 69 preguntas con cuatro alternativas y feedback (64 de módulo + 5 de `MC01`); exportador probado localmente | verified herramientas; implemented-unreviewed 69 preguntas; planned corpus; external-blocked prueba Moodle real |
| FR-005 | E003–E005, E008–E009 | Schemas, 114 claims y grafo bidireccional validados; índice inverso generado para los activos presentes y matriz normativa de 36 temas pendiente | verified herramientas/build/reporte local; implemented-unreviewed lote; planned matriz completa |
| FR-006 | P000–P001, pruebas de diagnóstico | Scoring `+1/−0,25/0` y paridad local de las cinco decisiones canónicas; el gate impide entregar el borrador | verified local; publicación planned |
| FR-007 | P000–P001, V001 | Advertencia de puntuación directa en lógica y fuente canónica | verified local; planned landing publicable |
| FR-008 | P000–P001, V004 | Errores y temas débiles implementados localmente; el diagnóstico permanece detrás del gate `publicable: false` | implemented-unreviewed; planned publicación y analítica final |
| FR-009 | E003, E005, G/S | Manifiestos y cobertura de G01, G13, G14, G15, G16, S01, S02 y S03 validados | implemented-unreviewed 8/36; planned 28 restantes |
| FR-010 | E003, G/S | Lección y repaso de G01, G13, G14, G15, G16, S01, S02 y S03 | implemented-unreviewed 8/36; planned 28 restantes |
| FR-011 | E003, E005, G/S | Gate editorial y ocho manifiestos en `draft`; `npm run build` ejecuta `content:validate` antes de compilar | verified contrato/build gate local; implemented-unreviewed 8/36; planned revisión/publicación y resto |
| FR-012 | G01–G24, S001–S014, P000–P015 | 64 de 288 preguntas de módulo; 5 preguntas prácticas de `MC01`; 1 de 8 MC; 0 CP y 0 SIM | implemented-unreviewed parcial; planned 224 preguntas de módulo e inventario práctico restante |
| FR-013 | E004, P000–P014 | Schema de caso e IDs; MC01 canónico con cinco decisiones | verified schema/fuente única; implemented-unreviewed MC01; planned resto |
| FR-014 | P000–P015 | Procedencia, originalidad y auditoría práctica | planned |
| FR-015 | P000–P001, V004, M009 | Integración local del intento detrás de `/api/ss-diagnostic`; publicación, agregado Moodle y unificación analítica pendientes | implemented-unreviewed intento; planned publicación/analítica; external-blocked Moodle |
| FR-016 | E003–E007, G/S/P | Referencias de repaso y reintento validadas en 64 preguntas de módulo y 5 de `MC01` | verified herramienta; implemented-unreviewed lote; planned corpus |
| FR-017 | E003–E005 | Máquina de estados y gates condicionales definidos: `published` exige evidencias de revisión y no puede depender de preguntas/casos en borrador; la build valida el grafo completo | verified gate local; implemented-unreviewed gobernanza; revisiones humanas pendientes |
| FR-018 | E003–E005, G/S/P | Fuente directa y fecha exigidas; 114 claims y 69 preguntas pasan el validador; publicar exige además la evidencia de revisión aplicable | verified validador/build local; implemented-unreviewed lote; planned revisión/corpus |
| FR-019 | E003–E009 | Corte, versión, referencias, procedencia, changelog por activo, índice inverso y hashes de exportación | verified herramientas/reporte local; implemented-unreviewed lote; planned matriz normativa completa |
| FR-020 | E001, E003, E008–E009 | Riesgo y metadatos del catálogo; mantenimiento completo pendiente | implemented-unreviewed parcial; planned owners/calendario completos |
| FR-021 | E006–E007, M002–M008 | Exportadores Moodle XML y HTML, manifiestos SHA-256 y tests de deriva reproducibles | verified exportación local; external-blocked importación/reexportación y restore en Moodle real |
| FR-022 | V001, B009–B010, L004 | La página obtiene del servidor precio, vendedor, inventario, cuatro documentos, versiones y aceptaciones separadas antes de crear pedido | verified estructura/disclosures local; implemented-unreviewed UI; external-blocked datos/documentos definitivos |
| FR-023 | B001–B015 | Contrato de Bizum profesional con conciliación manual | verified diseño; external-blocked alta/datos reales |
| FR-024 | B002–B004, B009 | Máquinas/migraciones probadas en SQLite; la página y API locales crean referencia e importe de servidor, conservan el token en cookie HttpOnly y consultan estado | verified estados/migración/API/sesión local; implemented-unreviewed UI; planned E2E protegido, D1 remota y producción |
| FR-025 | B002, B005–B007 | El navegador solo puede declarar `payment_reported`; B006 implementa localmente confirmación con secreto por operador, HMAC, estado esperado, idempotencia y ledger | verified guardas/report/admin local; external-blocked protección, D1/credenciales/prueba real; ningún pago acreditado |
| FR-026 | B003–B012 | UI y API no piden capturas/credenciales, el token de consulta no llega al JavaScript y la referencia bancaria administrativa se persiste como HMAC; acceso, devolución, exportación y operación remota siguen incompletos | verified minimización local; implemented-unreviewed administración parcial; planned flujo completo; external-blocked configuración real |
| FR-027 | B013–B015, V009–V010 | V009 se limita a local/preview protegido con pedidos de producción deshabilitados; alta profesional, coste, destino y prueba real quedan para V010 tras Gate 2 | verified cierre; external-blocked; V010 requiere Gate 2 y autorización expresa |
| FR-028 | B008–B010, L008 | Constructor seguro `wa.me` verificado localmente; cuenta WhatsApp Business, número, 2FA y carga de plantillas pendientes | verified enlace local; implemented-unreviewed plantillas; external-blocked cuenta/configuración |
| FR-029 | B008, L008 | `buildWhatsappUrl` expone solo la referencia opaca y las plantillas minimizan datos | verified código/pruebas locales; implemented-unreviewed plantillas; external-blocked operación |
| FR-030 | L007–L010 | FAQ/base de conocimiento completada; etiquetas, respuestas rápidas, registro cerrado de soporte y capacidad 50/100/250/500 redactados | verified L007/L009 local; implemented-unreviewed L008/L010; external-blocked cuenta, horario y horas reales |
| FR-031 | L001–L006, B009–B010, V008–V010 | Flags fail-closed y configuración comercial exigen identidad, cuatro URL HTTPS de documentos, condiciones/versiones, destino Bizum, WhatsApp y secretos válidos antes de mostrar el pedido | verified cierre/disclosures local; external-blocked datos y revisión; V010 es el único punto autorizado para habilitar pedidos tras Gate 2 |
| FR-032 | B010, L002 | WhatsApp para seguimiento comercial; email contractual para pedido, acceso Moodle y recuperación | verified contrato; planned migración del formulario/código |
| FR-033 | B004–B012, V004–V005 | Pedido, aviso y confirmación administrativa son eventos distintos; el informe semanal local cuenta solo verificaciones como ventas y separa importe pedido de ingreso verificado | verified separación y agregado local; implemented-unreviewed administración/informe; external-blocked D1, protección y operación real |
| FR-034 | A009, L007–L010 | Sin directos, tutoría individual ilimitada ni grupo obligatorio | verified diseño |
| FR-035 | L002, L004, L007 | Límite de asesoramiento personal | implemented-unreviewed documento; planned publicación/operación |
| FR-036 | B012, M009, V004–V005 | Endpoint y CLI semanales agregan web, contactos, pedidos, pagos, acceso y devolución sin filas ni PII; el cuadro local une soporte y horas para calcular ingreso por hora; falta importar Moodle | verified SQLite, contratos y unión local; implemented-unreviewed endpoint/CLI; external-blocked D1/Moodle/protección |
| FR-037 | B003–B012, V004 | Allowlist, UUID/idempotencia, minimización, cookie HttpOnly y HMAC de referencia bancaria están probados localmente; los rate limits en memoria no son distribuidos | verified privacidad/guardas local; implemented-unreviewed API/admin; planned protección perimetral, D1 remota y producción |
| FR-038 | E003–E010 | Los schemas exigen procedencia, autoría declarada, changelog y una entrada exacta para la versión actual; el reporte genera progreso e impacto normativo | verified schema/validador/reporte local; implemented-unreviewed activos; revisión humana y matriz E009 pendientes |
| FR-039 | A011 y todas las tareas | Esta matriz cubre FR-001–FR-041 y SC-001–SC-014; el análisis no encuentra IDs ausentes ni tareas duplicadas | verified mapeo; planned evidencias finales y horas por resultado |
| FR-040 | B013, V008–V010 | Cero gasto y ninguna operación monetaria; V009 no habilita producción y solo V010 puede hacerlo después de Gate 2 y autorización expresa | verified cierre hasta la fecha; external-blocked coste/alta del servicio |
| FR-041 | B003–B010, L004 | El pedido exige email contractual y lo persiste para el flujo de compra; envío de confirmación, invitación Moodle y recuperación siguen pendientes | implemented-unreviewed pedido local; planned email transaccional/Moodle |

## Success Criteria

| Criterio | Tareas propietarias | Evidencia actual o esperada | Estado |
|---|---|---|---|
| SC-001 | P000, V003–V005, V011 | `MC01` tiene fuente canónica y paridad local; `/api/ss-diagnostic` lo retiene con `publicable: false`; finalización ≥60 % se medirá tras revisión/publicación | verified P000/gate local; planned publicación y campaña |
| SC-002 | V003, V011 | Prueba moderada n≥10 y ≥7 comprenden el repaso | planned |
| SC-003 | E001–E005, G24, S014 | Programa 36/36; contenido validado 8/36; quedan 28 módulos | verified programa; implemented-unreviewed 8/36; planned 28 restantes |
| SC-004 | E004–E007, G/S/P | 64 preguntas de módulo y 5 de `MC01` en borrador con cuatro alternativas/feedback y claims; objetivo mínimo 288 más banco práctico | implemented-unreviewed 69 preguntas; planned 224 preguntas de módulo y banco restante; external-blocked reexport Moodle |
| SC-005 | G/S/P | Inventario actual: 64/288 preguntas de módulo, 1/8 MC con 5 preguntas, 0/4 CP y 0/2 SIM | implemented-unreviewed parcial; planned 224 preguntas de módulo y resto práctico |
| SC-006 | G/S/P, V006 | Ocho módulos pasan validación automatizada; `G14`–`G16` y `S02`–`S03` son borradores implementados y ninguno de los ocho tiene revisión humana ni publicación acreditada | implemented-unreviewed 8 módulos; planned revisiones/publicación/corpus |
| SC-007 | B002, B004–B007 | Eventos públicos no crean ventas; crear/estado/report están probados localmente y B006 exige verificación administrativa separada. No existe provisión automática de Moodle ni operación remota acreditada | verified guardas/API/admin local; implemented-unreviewed parcial; external-blocked integración |
| SC-008 | B011–B012, V005 | El CLI/runbook valida el dry-run de una verificación y el informe detecta diferencias agregadas; devolución, acceso y cierre semanal reales siguen sin evidencia | verified agregado local; implemented-unreviewed dry-run/reporte; external-blocked sistemas reales |
| SC-009 | L009–L010, V005, V011 | Registros cerrados y agregadores calculan SLA, minutos ordinarios/extraordinarios, horas por 100 alumnos, venta/alta por 100 pagos e ingreso neto por hora; el modelo cuantifica 50/100/250/500 | verified cálculos locales; implemented-unreviewed capacidad; external-blocked WhatsApp/Moodle y horas reales |
| SC-010 | E008–E009 | Diff de convocatoria y ≥85 % reutilizado | planned; medible en próxima convocatoria |
| SC-011 | E008–E010 | Localizar impacto normativo en menos de 30 minutos | planned |
| SC-012 | E006–E007, M007 | Exportación fuente→Moodle reproducible localmente mediante hashes; importación/reexportación y restore reales pendientes | verified exportación/deriva local; external-blocked Moodle real |
| SC-013 | V001–V012 | 500 sesiones, 100 contactos, 10 pagos o identificación del cuello | planned campaña |
| SC-014 | A001–V012 | Cero compra, pago o gasto sin autorización | verified hasta la fecha |

## Regla de actualización

Una tarea solo pasa a `[x]` cuando la fila correspondiente enlaza evidencia directa. `planned` no significa implementado, `implemented-unreviewed` no significa publicable y `external-blocked` no impide construir artefactos locales seguros.
