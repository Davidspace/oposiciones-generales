# Feature Specification: Validación paralela SS CasoLab / GSI Caso 0

> **Estado histórico — supersedido.** Este artefacto ya no gobierna el trabajo vigente. La fuente de verdad actual es [la especificación de SS CasoLab](../002-ss-casolab-academy/spec.md).

**Feature Branch**: `main`

**Created**: 2026-07-29

**Status**: Superseded (historical)

**Input**: Ejecutar durante 30 días dos pruebas paralelas: SS CasoLab con un microcaso y preventa real; GSI Caso 0 como control.

## User Scenarios & Testing

### User Story 1 - Obtener un diagnóstico útil (Priority: P1)

Como opositor de Seguridad Social C1 o GSI A2, quiero resolver una muestra breve y recibir un diagnóstico comprensible para saber qué debo mejorar antes de pagar.

**Why this priority**: Es la menor unidad de valor que permite probar necesidad y captar un lead sin producir un curso completo.

**Independent Test**: Un visitante puede abrir el experimento correspondiente, completar la práctica sin crear una cuenta y ver un resultado con errores, explicación y siguiente paso.

**Acceptance Scenarios**:

1. **Given** un visitante de SS C1, **When** completa las cinco decisiones del microcaso, **Then** recibe puntuación, explicación por decisión y recomendación de repaso.
2. **Given** un visitante de GSI A2, **When** entrega el Caso 0 diagnóstico, **Then** recibe una rúbrica y modelos comparados suficientes para autocorregirse.
3. **Given** una respuesta incorrecta, **When** se muestra el resultado, **Then** se explica el distractor sin prometer equivalencia con la corrección de un tribunal.

---

### User Story 2 - Comprar una preventa transparente (Priority: P1)

Como opositor interesado, quiero conocer el alcance mínimo, la fecha y las condiciones antes de pagar para reservar el producto con confianza.

**Why this priority**: El pago real distingue intención de compra de curiosidad y es la métrica principal de validación.

**Independent Test**: Desde cualquiera de los dos resultados diagnósticos se puede llegar a un checkout del producto correcto y completar una compra atribuida al experimento.

**Acceptance Scenarios**:

1. **Given** un resultado diagnóstico, **When** el visitante pulsa la preventa, **Then** llega al checkout del experimento y variante correctos.
2. **Given** una compra completada, **When** vuelve a la confirmación, **Then** ve alcance, siguiente entrega y canal de soporte limitado.
3. **Given** que no se alcanza el mínimo de viabilidad comunicado, **When** se cancela el lanzamiento, **Then** se aplica la condición de devolución publicada.

---

### User Story 3 - Comparar los dos experimentos (Priority: P1)

Como propietario, quiero atribuir visitas, diagnósticos, leads, clics de checkout y pagos a producto, variante y canal para decidir con evidencia dónde invertir.

**Why this priority**: Sin instrumentación homogénea, dos lanzamientos paralelos producen datos incomparables.

**Independent Test**: Una misma dirección puede registrarse en ambos productos y cada interacción queda asociada al experimento correspondiente.

**Acceptance Scenarios**:

1. **Given** la misma persona interesada en ambos cuerpos, **When** envía ambos formularios, **Then** existen dos participaciones separadas sin sobrescribirse.
2. **Given** tráfico con parámetros de campaña, **When** ocurre un evento del embudo, **Then** conserva experimento, variante, ruta y atribución UTM.
3. **Given** el cierre de los 30 días, **When** se exportan los datos, **Then** pueden calcularse las mismas tasas para SS y GSI.

---

### User Story 4 - Operar con poco mantenimiento (Priority: P2)

Como propietario, quiero que entrega, onboarding, autocorrección y preguntas frecuentes funcionen de forma asíncrona para limitar la atención mensual.

**Why this priority**: Es una restricción central del modelo, aunque primero debe existir demanda pagada.

**Independent Test**: Un comprador puede acceder, orientarse y completar el producto base sin sesión en directo ni intervención individual.

**Acceptance Scenarios**:

1. **Given** un nuevo comprador, **When** se confirma el pago, **Then** recibe automáticamente instrucciones y acceso.
2. **Given** una duda común, **When** consulta el soporte, **Then** encuentra una respuesta o la envía a una recopilación periódica sin expectativa de respuesta inmediata.

### Edge Cases

- La misma persona usa el mismo email en los dos experimentos.
- Un visitante bloquea almacenamiento del navegador o llega sin parámetros UTM.
- El checkout está temporalmente sin configurar.
- Se repite un envío o un evento por doble clic.
- Un competidor, curioso o candidato no cualificado completa el formulario.
- Cambia una convocatoria durante los 30 días y afecta al mensaje, pero no al núcleo del diagnóstico.

## Requirements

### Functional Requirements

- **FR-001**: El sistema DEBE identificar cada participación como `ss-casolab` o `gsi-caso-0`.
- **FR-002**: El sistema DEBE registrar la variante de oferta y la atribución de campaña en leads y eventos.
- **FR-003**: El sistema DEBE permitir que un email participe una vez por experimento, actualizando solo su registro de ese experimento.
- **FR-004**: El sistema DEBE registrar al menos vistas, inicio y finalización del diagnóstico, envío de lead, clic de checkout y confirmación de compra.
- **FR-005**: SS CasoLab DEBE incluir un microcaso de cinco decisiones con autocorrección y explicación.
- **FR-006**: GSI Caso 0 DEBE incluir un diagnóstico con estructura de resolución, rúbrica y respuestas comparadas.
- **FR-007**: Ambos experimentos DEBEN mostrar el mismo precio inicial de prueba, 49 €, para mantener comparable la señal económica.
- **FR-008**: La preventa DEBE comunicar alcance, fecha estimada, soporte incluido y política aplicable antes del checkout.
- **FR-009**: El producto base NO DEBE depender de clases semanales, tutoría ilimitada, comunidad diaria ni correcciones manuales recurrentes.
- **FR-010**: Los formularios DEBEN recoger consentimiento y solo los datos necesarios para segmentar y contactar.
- **FR-011**: La medición NO DEBE guardar respuestas abiertas sensibles, direcciones IP ni contenido innecesario en eventos.
- **FR-012**: El propietario DEBE poder obtener un resumen o exportación comparable sin consultar manualmente cada registro.
- **FR-013**: Los enlaces de checkout DEBEN poder configurarse sin cambiar el código del producto.
- **FR-014**: El sistema DEBE degradar de forma segura si el checkout todavía no está configurado.

### Key Entities

- **Experiment**: Producto validado, mensaje, precio y ventana temporal.
- **Offer Variant**: Versión de promesa o precio usada para atribuir resultados.
- **Lead Participation**: Relación consentida entre una persona y un experimento.
- **Funnel Event**: Interacción anónima o atribuida dentro del embudo.
- **Diagnostic Attempt**: Inicio, respuestas agregadas y resultado de una práctica.
- **Preorder**: Compra del producto mínimo con estado y condiciones.

## Assumptions

- Los dos experimentos vivirán inicialmente en el mismo sitio y reutilizarán infraestructura.
- El precio inicial comparable será 49 €; una prueba posterior de precio se hará después de comprobar el mensaje.
- Los cobros se realizarán mediante enlaces alojados por un proveedor externo.
- El contenido completo no se producirá hasta validar pagos.

## Success Criteria

### Measurable Outcomes

- **SC-001**: El 100 % de leads, clics de checkout y compras queda atribuido a experimento y variante.
- **SC-002**: Una misma dirección puede participar en ambos experimentos sin pérdida de datos.
- **SC-003**: Al menos el 60 % de quienes empiezan cada diagnóstico lo completa.
- **SC-004**: En 30 días, cada experimento recibe al menos 500 visitas cualificadas o se documenta que el cuello de botella fue captación.
- **SC-005**: Se consiguen al menos 100 leads cualificados y 10 preventas combinadas, con resultados separados por experimento.
- **SC-006**: Una oportunidad continúa si logra al menos 5 pagos o una conversión lead-pago del 5 %; se modifica si hay intención pero no pago, y se detiene si, tras 500 visitas cualificadas y dos mensajes probados, logra menos de 3 pagos.
- **SC-007**: El flujo base puede operarse con menos de 4 horas mensuales por cada 100 alumnos, excluyendo la actualización de convocatoria.
- **SC-008**: Antes de producir el curso completo existe evidencia separada de tráfico, finalización, leads, checkout y pagos.
