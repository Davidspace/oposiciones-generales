# Feature Specification: MVP Auxiliar Administrativo Ayuntamiento de Córdoba

**Feature Branch**: `codex/cordoba-mvp`
**Created**: 2026-08-12
**Status**: Approved

## Product Decision

Córdoba queda elegida como candidato municipal principal. El producto se dirige a las 55 plazas de Auxiliar Administrativo/a C2 convocadas por el Ayuntamiento de Córdoba para turno libre. La propuesta inicial combina diagnóstico gratuito y un producto mínimo disponible por 69 €, sin afirmar que existe un temario completo de 20 temas mientras solo se hayan terminado dos temas.

## User Scenarios & Testing

### User Story 1 - Entender la convocatoria (Priority: P1)

Una persona aspirante puede confirmar plazas, programa, formato rectificado de los ejercicios y estado de la convocatoria desde fuentes oficiales.

**Acceptance Scenarios**:

1. **Given** la landing de Córdoba, **When** consulta la ficha de convocatoria, **Then** ve 55 plazas, 20 temas, test de 60 preguntas en 80 minutos y segundo ejercicio práctico de hasta 2 horas, con enlaces a bases y rectificación.
2. **Given** que las bases de 2024 citan el Reglamento Orgánico General, **When** consulta la nota de vigencia, **Then** entiende que el ROM 2025 está vigente y qué materias del reglamento anterior continúan transitoriamente.

### User Story 2 - Probar el método gratuitamente (Priority: P1)

Una persona puede completar sin registro 15 preguntas teóricas, 5 aplicadas y un microcaso, y recibir un resultado por bloques con corrección explicada.

**Acceptance Scenarios**:

1. **Given** el diagnóstico sin empezar, **When** pulsa comenzar, **Then** se registra `start_test_cordoba` con consentimiento analítico.
2. **Given** 20 respuestas, **When** finaliza, **Then** ve puntuación global, cuatro bloques, explicación y fuente de cada pregunta.
3. **Given** el microcaso, **When** revela la corrección, **Then** ve solución orientativa, rúbrica y fuentes, sin que su texto se almacene.

### User Story 3 - Comprar con información suficiente (Priority: P1)

Una persona interesada puede conocer qué recibe ahora, el precio de 69 € y contactar por WhatsApp para obtener acceso real al MVP.

**Acceptance Scenarios**:

1. **Given** la sección de precio, **When** entra en pantalla, **Then** se registra `view_price_cordoba` con consentimiento.
2. **Given** la CTA de compra, **When** pulsa, **Then** se abre WhatsApp con contexto del producto y se registra `click_whatsapp_cordoba`.
3. **Given** una compra confirmada, **When** el operador o un backend autorizado la confirma, **Then** puede registrarse `purchase_cordoba`; la visita o el clic nunca cuentan como compra.

### User Story 4 - Mantener trazabilidad editorial (Priority: P2)

El equipo puede distinguir contenido reutilizado, adaptado y nuevo; verificar vigencia; y actualizar preguntas sin perder su fuente.

**Acceptance Scenarios**:

1. **Given** cualquiera de los 20 epígrafes, **When** se consulta la matriz, **Then** consta cobertura, fuente municipal, actualización y necesidad de caso práctico.
2. **Given** una pregunta, **When** se revisa el banco, **Then** aparecen tema, bloque, respuesta, explicación, fuente, precepto y fecha de revisión.

## Functional Requirements

- **FR-001**: El programa MUST reproducir los 20 epígrafes oficiales.
- **FR-002**: La matriz MUST clasificar cada epígrafe como cubierto, parcial o no cubierto y registrar fuente municipal, actualización y caso práctico.
- **FR-003**: El producto MUST usar las bases rectificadas de 18-12-2024 para describir los ejercicios.
- **FR-004**: Los temas 6 a 8 MUST incorporar una correspondencia entre ROM 2025 y regulación de 2009 parcialmente vigente.
- **FR-005**: El diagnóstico MUST incluir exactamente 15 preguntas teóricas, 5 aplicadas y un microcaso.
- **FR-006**: El diagnóstico MUST mostrar resultado por cuatro bloques y corrección explicada con fuentes.
- **FR-007**: El banco MUST contener exactamente 100 preguntas, cuatro opciones y una respuesta inequívoca por pregunta.
- **FR-008**: Cada pregunta MUST incluir fuente primaria, localizador normativo y fecha de revisión.
- **FR-009**: El MVP MUST incluir dos temas completos y dos supuestos prácticos completos en versión alumno y razonada.
- **FR-010**: Los documentos nuevos MUST conservar la estructura editorial del material SS: A4, Arial, jerarquía azul, resumen, datos preguntables y fuentes.
- **FR-011**: La landing MUST vivir en `/auxiliar-administrativo-cordoba` dentro de `lorman-lab` y no crear otro proyecto Vercel.
- **FR-012**: La landing MUST ser responsive, accesible con teclado y coherente con la identidad visual de LORMAN.
- **FR-013**: La landing MUST mostrar 69 € como pago único inicial y enumerar con precisión el contenido disponible.
- **FR-014**: Se MUST instalar soporte para los eventos `view_cordoba`, `start_test_cordoba`, `complete_test_cordoba`, `click_whatsapp_cordoba`, `view_price_cordoba` y `purchase_cordoba`.
- **FR-015**: GA4 MUST cargarse solo tras consentimiento analítico.
- **FR-016**: `purchase_cordoba` MUST NOT dispararse por una visita, vista de precio o clic en WhatsApp.
- **FR-017**: La prueba MUST funcionar sin registro, cookies publicitarias ni almacenamiento de respuestas en servidor.
- **FR-018**: La página MUST incluir canonical, metadatos sociales, datos estructurados y sitemap para la URL definitiva.
- **FR-019**: No se MUST modificar Moodle en esta entrega.
- **FR-020**: No se MUST publicar el contenido de pago completo como activo descargable desde la landing.

## Success Criteria

- **SC-001**: El 100 % de los 20 epígrafes aparece en el programa y en la matriz.
- **SC-002**: El diagnóstico contiene 20 preguntas y un microcaso, y todas las preguntas ofrecen explicación y fuente.
- **SC-003**: El banco supera validación automática de 100 preguntas, cuatro opciones y distribución completa de temas.
- **SC-004**: Los cuatro documentos de supuestos y los dos temas se renderizan sin texto cortado ni tablas rotas.
- **SC-005**: Los seis eventos GA4 están definidos; cinco tienen disparador público verificable y `purchase_cordoba` queda reservado a confirmación real.
- **SC-006**: La ruta responde correctamente en escritorio y móvil y no modifica las URLs de los productos existentes.
- **SC-007**: Pruebas de contenido, lint, typecheck/build y verificación de producción terminan correctamente.

## Assumptions

- No se ha publicado una fecha de examen en las fuentes oficiales comprobadas a 12-08-2026.
- El acceso de pago se entrega inicialmente mediante el flujo comercial existente por WhatsApp; no se crea checkout ni autenticación nuevos.
- El ZIP permanece intacto y se usa como fuente de reutilización, no como contenido oficial de Córdoba.
- Los exámenes anteriores de terceros pueden ayudar a localizar documentos, pero solo los documentos oficiales se tratan como examen oficial.

## Out of Scope

- Cargar o editar cursos en Moodle.
- Automatizar pagos o matriculación.
- Redactar los 20 temas completos antes de validar ventas.
- Copiar preguntas protegidas de academias o editoriales.
