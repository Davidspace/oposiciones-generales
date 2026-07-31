# Feature Specification: Academia completa SS CasoLab

**Feature Branch**: `codex/ss-academy-full`
**Created**: 2026-07-29
**Last reconciled**: 2026-07-30
**Status**: In progress — venta y captación cerradas hasta superar gates locales y externos
**Input**: Construir una preparación asíncrona completa para el Cuerpo Administrativo de la Administración de la Seguridad Social, C1, turno libre, con teoría y supuesto práctico, cobro por un servicio Bizum profesional, comunicación por WhatsApp y sin compras ni gasto nuevo no autorizado.

## User Scenarios & Testing

### User Story 1 — Descubrir por qué fallo (Priority: P1)

Como aspirante, quiero resolver un caso breve sin registrarme y recibir una explicación útil de cada decisión para saber qué regla debo repasar.

**Why this priority**: Es la demostración mínima del método y permite aprender antes de entregar datos personales.

**Independent Test**: Una persona completa cinco decisiones conectadas y obtiene aciertos, errores, blancos, puntuación directa, explicación de las cuatro alternativas, tipo de error y siguiente repaso.

**Acceptance Scenarios**:

1. **Given** una visita nueva, **When** corrige el microcaso, **Then** ve puntuación directa con la penalización aplicable y un aviso de que no es la puntuación transformada del tribunal.
2. **Given** una respuesta incorrecta, **When** abre la corrección, **Then** ve la regla, la fuente, por qué falla cada alternativa y qué repasar.
3. **Given** preguntas sin responder, **When** intenta entregar, **Then** debe confirmar los blancos y estos no restan.
4. **Given** un resultado perfecto, **When** consulta el diagnóstico, **Then** no se inventa un error ni un tema débil.

---

### User Story 2 — Preparar toda la teoría examinable (Priority: P1)

Como aspirante de turno libre, quiero recorrer los 23 temas generales y los 13 específicos con explicaciones orientadas al test para preparar la primera parte completa sin un temario enciclopédico.

**Why this priority**: El nuevo alcance autorizado exige una preparación completa, no solo del supuesto práctico.

**Independent Test**: Cada uno de los 36 módulos permite identificar qué memorizar, comprender y aplicar; estudiar las reglas y excepciones; practicar; corregir; repasar; y consultar sus fuentes vigentes.

**Acceptance Scenarios**:

1. **Given** cualquiera de los 23 temas generales, **When** el alumno lo completa, **Then** ha trabajado todos sus epígrafes oficiales y una práctica autocorregible.
2. **Given** cualquiera de los 13 temas específicos, **When** el alumno lo completa, **Then** ha trabajado tanto preguntas aisladas como decisiones susceptibles de aparecer en un supuesto.
3. **Given** una respuesta incorrecta, **When** revisa el resultado, **Then** recibe un repaso concreto y puede reintentar después.
4. **Given** una norma modificada, **When** se actualiza el catálogo, **Then** se localizan los módulos y preguntas afectados sin rehacer todo el curso.

---

### User Story 3 — Resolver supuestos conectados (Priority: P1)

Como aspirante, quiero practicar decisiones relacionadas dentro de un mismo contexto para entrenar el supuesto de 15 preguntas y mantener un criterio coherente.

**Why this priority**: Es el principal diferenciador respecto de un banco de test de volumen.

**Independent Test**: Un alumno completa microcasos, supuestos de 15 preguntas y simulacros; obtiene un mapa por tema y error; repasa; y compara el reintento.

**Acceptance Scenarios**:

1. **Given** un caso conectado, **When** dos respuestas aplican criterios incompatibles, **Then** el feedback identifica la inconsistencia.
2. **Given** un supuesto terminado, **When** ve el resultado, **Then** distingue aciertos, errores, blancos, puntuación directa, temas débiles y errores dominantes.
3. **Given** un repaso completado, **When** reintenta, **Then** puede comparar la evolución sin promesas de equivalencia con el tribunal.
4. **Given** un examen oficial histórico, **When** se usa para calibrar, **Then** no se copia como caso original ni se mezcla su corte normativo con el actual.

---

### User Story 4 — Reservar y pagar por Bizum con claridad (Priority: P1)

Como comprador, quiero conocer el alcance, precio, identidad del vendedor, condiciones y pasos exactos antes de crear un pedido y pagar por Bizum.

**Why this priority**: El pago real valida la demanda, pero un Bizum manual no debe presentarse como confirmación automática.

**Independent Test**: Una persona crea un pedido con referencia única, recibe instrucciones configuradas, inicia una conversación de WhatsApp con esa referencia y solo obtiene acceso después de que el equipo verifique el ingreso.

**Acceptance Scenarios**:

1. **Given** que venta o datos legales no están configurados, **When** intenta comprar, **Then** no se crea un pedido ni se muestran un teléfono o condiciones ficticios.
2. **Given** una oferta activa, **When** crea el pedido, **Then** ve importe, referencia, plazo, forma de enviar el Bizum y tiempo estimado de verificación.
3. **Given** un pedido pendiente, **When** pulsa contactar, **Then** WhatsApp recibe un mensaje prellenado con la referencia y sin datos académicos sensibles.
4. **Given** que el comprador afirma haber pagado, **When** el ingreso aún no se ha comprobado, **Then** el pedido sigue pendiente y no concede acceso.
5. **Given** un ingreso verificado una sola vez, **When** el responsable lo confirma, **Then** el pedido pasa a pagado, queda trazado y se entrega el procedimiento de acceso.
6. **Given** una devolución acordada, **When** se registra, **Then** se conserva la trazabilidad comercial mínima y se revoca el acceso cuando corresponda.

---

### User Story 5 — Comunicarse por WhatsApp sin atención diaria (Priority: P2)

Como alumno, quiero un canal claro para recibir acceso y resolver incidencias sin esperar una conversación continua.

**Why this priority**: WhatsApp es la decisión del propietario, pero debe operar con límites que eviten convertir el curso asíncrono en tutoría ilimitada.

**Independent Test**: El alumno inicia el contacto, recibe respuestas rápidas y conoce las dos ventanas semanales de revisión y los asuntos excluidos.

**Acceptance Scenarios**:

1. **Given** una duda frecuente, **When** escribe por WhatsApp, **Then** recibe una respuesta reutilizable o un enlace a la base de conocimiento.
2. **Given** una consulta académica no resuelta, **When** se clasifica, **Then** entra en una cola revisada en ventanas publicadas.
3. **Given** una consulta sobre un expediente personal, **When** se detecta, **Then** se rechaza el asesoramiento y se remite a canales institucionales.
4. **Given** una comunidad o grupo no autorizado, **When** un alumno solicita acceso, **Then** se mantiene el canal individual salvo decisión empresarial posterior.

---

### User Story 6 — Publicar contenido jurídicamente trazable (Priority: P1)

Como responsable académica, quiero una fuente editorial y un flujo de revisión únicos para producir material coherente y saber qué retirar si cambia una norma.

**Why this priority**: La exactitud jurídica es condición de publicación y de reutilización.

**Independent Test**: Ningún activo alcanza estado publicable sin fuente oficial, versión, fecha de corte, explicaciones y revisión requerida.

**Acceptance Scenarios**:

1. **Given** un borrador incompleto, **When** falta fuente, corte o explicación, **Then** el control editorial impide exportarlo como publicado.
2. **Given** una norma modificada, **When** se consulta la matriz, **Then** se identifican temas, preguntas y casos afectados.
3. **Given** un criterio histórico, **When** difiere del vigente, **Then** ambas versiones aparecen separadas y fechadas.
4. **Given** contenido de riesgo alto, **When** se intenta publicar, **Then** exige la revisión académica y jurídica definida para ese riesgo.

---

### User Story 7 — Estudiar en un aula sencilla y recuperable (Priority: P2)

Como alumno, quiero una ruta clara en Moodle para saber qué hacer, registrar progreso y retomar el estudio sin depender del profesor.

**Why this priority**: El aula es el canal de entrega y debe reducir soporte, no multiplicarlo.

**Independent Test**: Una exportación limpia permite reconstruir categorías, preguntas y actividades; un alumno completa diagnóstico, ruta, práctica y repaso.

**Acceptance Scenarios**:

1. **Given** un alumno nuevo, **When** entra, **Then** encuentra bienvenida, uso, diagnóstico y siguiente actividad.
2. **Given** un módulo, **When** completa contenido y práctica, **Then** se registra finalización y se desbloquea el siguiente paso.
3. **Given** un fallo de aula, **When** se restaura la copia, **Then** se recuperan estructura y contenidos sin depender de plugins innecesarios.

---

### User Story 8 — Decidir y operar con evidencia (Priority: P2)

Como equipo, queremos medir aprendizaje, pedidos, pagos, soporte y horas para decidir qué mantener sin confundir interés con ingresos.

**Independent Test**: El cierre semanal distingue visita, uso, pedido, pago confirmado, acceso, progreso, incidencia, devolución y horas invertidas.

**Acceptance Scenarios**:

1. **Given** una campaña, **When** origina un pago, **Then** la referencia permite atribuirlo sin guardar respuestas sensibles.
2. **Given** un cierre semanal, **When** se exportan métricas, **Then** se calcula conversión, ingreso, devolución, soporte e ingreso por hora.
3. **Given** una funcionalidad sin requisito, prueba o métrica, **When** se propone, **Then** queda fuera del alcance.

## Edge Cases

- La legislación vigente difiere del corte de la convocatoria o de un examen histórico.
- El tribunal anula preguntas o publica una transformación distinta.
- Una pregunta admite más de una interpretación razonable.
- Un alumno pretende obtener asesoramiento sobre una prestación real.
- Captación, pedidos, WhatsApp, Bizum o Moodle están desactivados.
- Dos personas usan la misma referencia o un ingreso no contiene referencia.
- El importe recibido es incorrecto, existe duplicado, devolución o suplantación.
- El alumno comparte una captura con datos bancarios innecesarios.
- El número de WhatsApp o destino Bizum cambia.
- La venta se activa sin contrato o alta del servicio Bizum profesional aplicable, o con un coste nuevo no autorizado.
- Una modificación anual altera cuantías, bases, porcentajes o edades.
- El contenido del aula difiere de la fuente editorial versionada.

## Requirements

### Functional Requirements

- **FR-001**: El alcance DEBE ser turno libre y cubrir los 23 temas generales y los 13 temas específicos del programa vigente.
- **FR-002**: Los 23 temas generales DEBEN preparar la primera parte; los 13 específicos DEBEN preparar la primera parte y el supuesto práctico.
- **FR-003**: La muestra gratuita DEBE funcionar sin registro previo e incluir cinco decisiones conectadas.
- **FR-004**: Cada pregunta DEBE contener cuatro alternativas y una explicación específica para cada una.
- **FR-005**: Cada pregunta DEBE conservar tema, epígrafe, competencia, dificultad, fuente oficial, referencia concreta, corte, versión, revisión, tipo de error y repaso.
- **FR-006**: El resultado DEBE separar aciertos, errores, blancos y puntuación directa según la regla vigente.
- **FR-007**: El producto NO DEBE presentar una puntuación interna como la nota transformada oficial.
- **FR-008**: El diagnóstico DEBE identificar temas débiles y tipos de error cuando existan datos suficientes.
- **FR-009**: Cada uno de los 36 módulos DEBE cubrir todos los epígrafes de su tema oficial sin reproducir extensamente la norma.
- **FR-010**: Cada módulo DEBE diferenciar contenido para memorizar, comprender, aplicar, excepciones, posibles distractores y datos volátiles.
- **FR-011**: Cada módulo DEBE incluir objetivo, decisiones, normativa, reglas, excepciones, confusiones, esquema, ejemplo, práctica, feedback, repaso y referencias.
- **FR-012**: La V1 completa DEBE incluir al menos ocho preguntas revisadas por módulo, ocho microcasos, cuatro supuestos de 15 preguntas y dos simulacros configurables con el banco.
- **FR-013**: El catálogo DEBE distinguir preguntas contextualizadas, microcasos, casos temáticos, transversales, supuestos de 15 preguntas y simulacros.
- **FR-014**: Los casos nuevos DEBEN ser originales; los exámenes oficiales solo servirán para análisis y calibración.
- **FR-015**: Los intentos DEBEN registrar evolución por tema y error sin guardar texto abierto sensible.
- **FR-016**: La ruta de repaso DEBE conducir a una actividad concreta y permitir un reintento posterior.
- **FR-017**: Todo contenido DEBE pasar por estados separados: pendiente, borrador, revisado, revisión externa cuando proceda, publicado y retirado.
- **FR-018**: Ningún contenido DEBE publicarse sin fuente oficial directa y fecha de revisión.
- **FR-019**: El sistema editorial DEBE distinguir vigencia actual, corte de convocatoria y versión histórica.
- **FR-020**: Las normas de riesgo alto o muy alto DEBEN tener responsable y próxima revisión.
- **FR-021**: Moodle DEBE recibir teoría y preguntas desde la fuente editorial validada, ser utilizable con teclado, lector de pantalla y móvil, y permitir copia, exportación y restauración sin deriva silenciosa.
- **FR-022**: La oferta DEBE separar contenido disponible, entregas futuras, precio, acceso, soporte, exclusiones y condiciones.
- **FR-023**: El método de cobro de la validación DEBE ser un servicio Bizum profesional contratado y NO DEBE presentarse como pago confirmado automáticamente cuando la conciliación sea humana.
- **FR-024**: Un pedido DEBE tener referencia única, importe, caducidad y estados trazables.
- **FR-025**: Solo una comprobación autorizada del ingreso PUEDE marcar un pedido como pagado.
- **FR-026**: El sistema NO DEBE pedir ni almacenar credenciales bancarias, PIN, datos de tarjeta ni capturas bancarias por defecto.
- **FR-027**: Bizum DEBE permanecer desactivado hasta completar identidad, condiciones, destino, contrato o alta profesional, prueba controlada y confirmación de que no introduce gasto nuevo no autorizado.
- **FR-028**: La comunicación ordinaria DEBE realizarse por WhatsApp individual mediante un número configurado por el propietario.
- **FR-029**: Los mensajes DEBEN utilizar referencia opaca y NO DEBEN incluir respuestas académicas o datos bancarios sensibles.
- **FR-030**: WhatsApp DEBE mostrar límites de soporte, ventanas de revisión y exclusión de asesoramiento personal.
- **FR-031**: La captación web DEBE permanecer inactiva en interfaz y servidor hasta existir información de privacidad válida.
- **FR-032**: Cuando se active, la captación DEBE pedir solo nombre, contacto WhatsApp, fase, principal problema y consentimiento; el email será opcional.
- **FR-033**: La intención de compra DEBE medirse mediante pedido, inicio de conversación, verificación solicitada y pago confirmado, no mediante precio hipotético.
- **FR-034**: La base NO DEBE incluir directos semanales, tutoría ilimitada, corrección manual recurrente ni grupo moderado diariamente.
- **FR-035**: El servicio DEBE indicar que no ofrece asesoramiento jurídico sobre casos personales.
- **FR-036**: El equipo DEBE poder exportar visitas, diagnósticos, contactos, pedidos, pagos, acceso, soporte y devoluciones, e importar un informe semanal agregado de actividad cuyo propietario sea Moodle.
- **FR-037**: Los eventos NO DEBEN guardar direcciones IP, datos financieros, respuestas abiertas sensibles ni contenido innecesario.
- **FR-038**: Cada activo DEBE conservar versión, autoría, revisiones y cambios.
- **FR-039**: Una nueva funcionalidad DEBE relacionarse con requisito, prueba, métrica y mantenimiento estimado.
- **FR-040**: La solución DEBE operar con infraestructura gratuita, cuentas ya disponibles y trabajo manual delimitado; si Bizum profesional exige un coste nuevo no autorizado, los pedidos DEBEN permanecer cerrados.
- **FR-041**: Un pedido pagado DEBE conservar un email para confirmación contractual, invitación inicial a Moodle, recuperación de acceso y avisos imprescindibles del servicio; WhatsApp seguirá siendo el canal operativo ordinario y el email no será marketing ordinario por defecto.

### Key Entities

- **Convocatoria**: Reglas del proceso, programa, cortes, fechas y fuentes.
- **Tema**: Unidad oficial general o específica con epígrafes, fuentes, riesgo y estado.
- **Fuente normativa**: Documento oficial versionado y fechado.
- **Pregunta**: Decisión evaluable con alternativas, clave, feedback, errores y trazabilidad.
- **Caso**: Contexto original con decisiones conectadas.
- **Intento**: Respuestas y resultado en una versión concreta.
- **Error**: Clasificación pedagógica de una decisión incorrecta o arriesgada.
- **Ruta de repaso**: Actividad y reintento prescritos.
- **Oferta**: Alcance, precio, acceso, soporte, exclusiones y condiciones.
- **Contacto**: Relación consentida y canal de WhatsApp.
- **Pedido**: Referencia, importe, caducidad, email contractual, atribución y estado.
- **Pago verificado**: Confirmación humana autorizada de un ingreso Bizum.
- **Acceso**: Matrícula y vigencia en el aula.
- **Incidencia**: Solicitud de soporte, prioridad, resolución y posible cambio.

## Scope Boundaries

### Included

- Turno libre.
- 23 módulos generales y 13 específicos.
- Muestra gratuita, banco autocorregible, microcasos, supuestos y simulacros.
- Moodle, Bizum manual verificable, WhatsApp individual, analítica, FAQ y actualización normativa.
- Borradores legales con campos reales pendientes del propietario y revisión especializada.

### Explicitly excluded

- Promoción interna como producto separado.
- Gestión de la Seguridad Social A2.
- Preparación oral, aplicación nativa o red social propia.
- Clases semanales, tutoría ilimitada, corrección manual de todos los ejercicios o asesoramiento sobre expedientes personales.
- Servicios de pago, publicidad pagada o compras no autorizadas.
- Declarar definitivo contenido jurídico pendiente de revisión humana.

## Assumptions

- `SS CasoLab` continúa como nombre provisional.
- Alba controla la aprobación académica; David controla producto, infraestructura, cobro y operación.
- La IA puede producir borradores trazables, validadores, bancos y documentación, pero no suplanta la revisión académica o jurídica final.
- Moodle seguirá siendo el aula; la fuente editorial versionada vive fuera del aula.
- La oferta fundadora mantiene como hipótesis 49 euros y seis meses hasta que David decida otra cosa mediante pagos reales.
- WhatsApp se utilizará como conversación individual con respuestas rápidas, etiquetas y dos ventanas de revisión por semana. El email se limitará a confirmaciones contractuales, facturación, invitación inicial a Moodle, recuperación y avisos imprescindibles del servicio.
- Bizum será profesional desde la primera venta. La conciliación será manual mientras ese servicio contratado no ofrezca una integración gratuita, segura y autorizada.

## Dependencies

- Copia sin usuarios o acceso temporal al Moodle de Alba.
- Inventario de los materiales que Alba ya ha creado.
- Identidad pública, NIF, domicilio y contacto del vendedor.
- Número WhatsApp Business y servicio Bizum profesional contratado, con costes y destino verificados.
- Confirmación de precio, acceso, impuestos y política de devolución.
- Acceso al proyecto Sites existente o autorización de una nueva URL.
- Revisión académica y jurídica externa de los lotes de mayor riesgo antes de declararlos definitivos.

## Success Criteria

- **SC-001**: Al menos el 60 % de quienes empiezan el microcaso lo termina.
- **SC-002**: En una prueba moderada con al menos diez opositores del segmento, al menos siete identifican sin ayuda el tema y la actividad concreta que deben repasar después del resultado.
- **SC-003**: Los 36 temas oficiales están representados sin omisiones y cada módulo publicado cubre todos sus epígrafes.
- **SC-004**: El 100 % de preguntas publicadas incluye cuatro explicaciones y trazabilidad completa.
- **SC-005**: La V1 publicada dispone de al menos 288 preguntas de módulo revisadas, ocho microcasos, cuatro supuestos y dos simulacros configurados.
- **SC-006**: El 100 % de módulos publicados supera los checklists editorial y normativo.
- **SC-007**: Un pedido no puede conceder acceso antes de registrar una verificación autorizada del pago.
- **SC-008**: El cierre semanal reconcilia pedidos, pagos, accesos, devoluciones y referencias sin diferencias sin resolver.
- **SC-009**: Por cada 100 ventas nuevas, cobro, conciliación y altas consumen como máximo seis horas; el soporte ordinario consume menos de cuatro horas mensuales por cada 100 alumnos activos; y el mantenimiento editorial ordinario no supera ocho horas mensuales para toda la cohorte. Las incidencias extraordinarias se registran aparte.
- **SC-010**: Al menos el 85 % del contenido se reutiliza en la siguiente convocatoria sin reescritura completa.
- **SC-011**: Una modificación normativa permite localizar activos afectados en menos de 30 minutos.
- **SC-012**: La copia editorial y el banco Moodle pueden reconstruirse desde artefactos versionados y verificados.
- **SC-013**: En 30 días se alcanzan 500 sesiones con al menos una interacción de contenido, 100 contactos consentidos y 10 pagos, o el embudo identifica con datos el primer tramo que no alcanza su umbral predefinido.
- **SC-014**: La solución no incurre en compras ni costes nuevos sin autorización expresa.
