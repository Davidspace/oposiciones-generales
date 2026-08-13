# Feature Specification: Celador SMS Murcia product

**Feature Branch**: `codex/celador-sms-murcia`
**Created**: 2026-08-13
**Status**: Draft for implementation

## User Scenarios & Testing

### User Story 1 - Evaluar el curso antes de comprar (Priority: P1)

Una persona que prepara Celador/a-Subalterno/a del SMS puede entender el alcance real del curso, comprobar una muestra y completar una prueba gratuita con el formato de la convocatoria.

**Why this priority**: La prueba es el principal mecanismo de confianza antes de una compra por WhatsApp.

**Independent Test**: Desde una URL pública, una persona puede ver qué incluye el producto, abrir muestras, completar la prueba y llegar a WhatsApp con el producto identificado.

**Acceptance Scenarios**:

1. **Given** una visita sin sesión, **when** abre la landing, **then** ve los 14 temas, la práctica, los simulacros, los exámenes oficiales y las condiciones sin afirmaciones no verificadas.
2. **Given** la persona pulsa la prueba gratuita, **when** la completa, **then** recibe corrección, explicación, fuente y resultado orientativo.
3. **Given** la persona pulsa una CTA, **when** se abre WhatsApp, **then** el mensaje identifica Celador SMS Murcia y conserva la atribución de campaña cuando exista.

### User Story 2 - Estudiar el programa completo en Moodle (Priority: P1)

Una persona compradora dispone de una ruta clara para estudiar cada tema, practicar, repasar y simular el ejercicio, sin depender de clases en directo.

**Why this priority**: El valor principal del producto está en convertir el material editorial existente en una experiencia reutilizable y autocorregible.

**Independent Test**: El inventario de aula puede mapearse a 14 temas, resúmenes, tests, repasos, 10 simulacros y exámenes oficiales claramente etiquetados.

**Acceptance Scenarios**:

1. **Given** un alumno con acceso, **when** abre un tema, **then** encuentra tema completo, resumen, test y referencia de vigencia.
2. **Given** un alumno completa un test o simulacro, **when** termina, **then** obtiene puntuación y explicación sin corrección manual del equipo.
3. **Given** un recurso procede de un examen oficial, **when** se muestra, **then** está etiquetado como oficial y separado de preguntas propias.

### User Story 3 - Captar y medir ventas por recomendación (Priority: P2)

El equipo puede compartir enlaces diferenciados con contactos y grupos, atribuir visitas y conversaciones y registrar ventas en un CRM mínimo.

**Why this priority**: La red de contactos de la madre de Alba es el canal inicial con mayor probabilidad de conversión.

**Independent Test**: Cada enlace UTM llega a la landing, registra eventos anónimos y permite relacionar la conversación con el canal sin guardar datos personales en el repositorio.

**Acceptance Scenarios**:

1. **Given** un enlace con UTM, **when** una persona visita y usa la prueba, **then** los eventos incluyen el curso y la campaña sin enviar nombre, teléfono ni respuestas.
2. **Given** una conversación iniciada, **when** se registra en la hoja CRM, **then** puede marcarse como nuevo, interesado, probó, pendiente o compró.

### User Story 4 - Mantener el producto con poco soporte (Priority: P2)

El curso ofrece orientación, FAQs y límites de soporte para que el equipo pueda operar con WhatsApp como canal de incidencias sin clases semanales.

**Independent Test**: Una persona puede entender cómo estudiar, acceder a ayuda básica y saber qué soporte se ofrece antes de comprar.

## Edge Cases

- La convocatoria o el programa cambian: la landing debe mostrar fecha de corte y no presentar datos antiguos como vigentes.
- La persona solo quiere tests: debe poder conocer y comprar el pack de tests por 45 € sin confundirlo con el curso completo.
- La persona quiere temario y tests: debe ver el precio de 90 € y el acceso asociado.
- La analítica no tiene consentimiento: la landing debe seguir funcionando sin cargar medición no esencial.
- El dominio específico todavía no está configurado: debe existir una URL de Vercel funcional y no publicar DNS como si estuviera listo.
- El material fuente contiene PDF y DOCX equivalentes: se conserva el original y se evita duplicar contenido comercialmente.

## Requirements

### Functional Requirements

- **FR-001**: El sistema debe presentar un producto específico para Celador/a-Subalterno/a del Servicio Murciano de Salud.
- **FR-002**: La landing debe describir solo contenido comprobado en el material editorial y fuentes oficiales.
- **FR-003**: La landing debe ofrecer una prueba gratuita representativa del ejercicio vigente, con corrección y explicación.
- **FR-004**: El producto debe distinguir material teórico, resumen, test, simulacro propio y examen oficial.
- **FR-005**: El precio del curso completo debe mostrarse como 90 € y el pack solo tests como 45 €, salvo cambio documentado.
- **FR-006**: Las CTAs deben abrir WhatsApp con un mensaje específico del producto.
- **FR-007**: La landing debe integrarse en la ficha de Academia LORMAN sin romper las fichas existentes.
- **FR-008**: El sistema debe soportar UTMs y eventos anónimos de embudo.
- **FR-009**: Debe existir documentación de CRM, enlaces de campaña, SEO y operación.
- **FR-010**: No se debe modificar Moodle en esta fase sin autorización explícita.
- **FR-011**: No se deben incluir secretos, datos personales ni fuentes comerciales copiadas en Git.
- **FR-012**: El frontend debe ser responsive, navegable por teclado y legible en móvil y escritorio.

### Key Entities

- **Producto Celador SMS Murcia**: curso completo y pack solo tests, con contenido, precio, acceso y estado editorial.
- **Recurso editorial**: tema, resumen, test, simulacro o examen oficial con fuente, fecha y estado.
- **Campaña**: combinación de fuente, medio, campaña y contenido UTM.
- **Lead**: contacto comercial registrado fuera de Git con canal, estado, objeción y resultado.

## Success Criteria

- **SC-001**: La persona puede identificar el alcance, precio y siguiente paso en menos de 90 segundos.
- **SC-002**: La prueba gratuita se puede completar en móvil y escritorio sin registro obligatorio.
- **SC-003**: El embudo registra al menos page view, inicio, finalización, CTA de WhatsApp y selección de precio de forma anónima.
- **SC-004**: La landing pasa build, lint, tests de contenido y verificación responsive.
- **SC-005**: El inventario demuestra 14 temas, 10 simulacros y exámenes oficiales sin depender únicamente del README.
- **SC-006**: El flujo de compra no exige clases en directo ni correcciones manuales ordinarias.

## Assumptions

- El material del ZIP es la fuente editorial de trabajo y seguirá fuera del repositorio público si contiene documentos de curso.
- Moodle seguirá en modo lectura durante esta fase.
- El pago y la entrega se gestionarán manualmente por WhatsApp/Moodle hasta que exista autorización para automatizar pagos.
- El precio inicial fijado por el propietario es 90 € para temario + tests y 45 € para solo tests.
- La fecha y el formato definitivos siempre dependen de la convocatoria oficial vigente.
