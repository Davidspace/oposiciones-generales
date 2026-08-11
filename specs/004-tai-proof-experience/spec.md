# Feature Specification: Experiencia de prueba y confianza para TAI

**Feature Branch**: `main`
**Created**: 2026-08-11
**Status**: Approved

## User Scenarios & Testing

### User Story 1 - Probar antes de contactar (Priority: P1)

Una persona que prepara TAI puede completar una muestra breve, recibir corrección explicada y entender qué área debe repasar sin registrarse.

**Acceptance Scenarios**:

1. **Given** la landing de TAI, **When** la persona inicia la prueba, **Then** responde preguntas generales y elige una ruta práctica de Desarrollo o Sistemas.
2. **Given** una prueba terminada, **When** consulta el resultado, **Then** ve aciertos, desglose por parte, explicaciones y áreas de repaso.
3. **Given** la muestra gratuita, **When** se presenta su alcance, **Then** se indica que es propia, parcial y no oficial.

### User Story 2 - Inspeccionar el material real (Priority: P1)

Una persona puede ampliar páginas reales y entender el recorrido tema, test, explicación y simulacro antes de preguntar por el acceso.

**Acceptance Scenarios**:

1. **Given** las páginas de muestra, **When** se activa una imagen, **Then** se abre a tamaño completo.
2. **Given** la sección de muestra, **When** se lee su contenido, **Then** diferencia claramente material real, dinámica del aula y prueba gratuita.

## Requirements

- **FR-001**: La landing MUST ofrecer un diagnóstico interactivo sin registro.
- **FR-002**: El diagnóstico MUST separar una parte general y una ruta práctica elegible entre Desarrollo y Sistemas.
- **FR-003**: Cada pregunta MUST incluir respuesta correcta y explicación.
- **FR-004**: El resultado MUST mostrar aciertos totales, desglose y áreas de repaso.
- **FR-005**: La muestra MUST utilizar las cuatro páginas reales ya publicadas y permitir ampliarlas.
- **FR-006**: La landing MUST explicar el flujo de aprendizaje sin afirmar funciones no disponibles.
- **FR-007**: La landing MUST NOT mostrar una sección de reseñas mientras no existan opiniones TAI verificadas.
- **FR-008**: El precio visible MUST ser 69 €.
- **FR-009**: La experiencia MUST funcionar con teclado y en móvil.
- **FR-010**: El cambio MUST mantener el estilo suizo y no añadir backend.

## Success Criteria

- **SC-001**: La prueba se completa íntegramente en la página en menos de 12 minutos.
- **SC-002**: El 100 % de las preguntas ofrece explicación tras finalizar.
- **SC-003**: Las cuatro imágenes de muestra se pueden abrir a tamaño completo.
- **SC-004**: La página contiene cero secciones, citas o puntuaciones de reseñas.
- **SC-005**: Lint, prueba específica, prueba de cartera y build terminan correctamente.

## Assumptions

- La prueba es una muestra propia inspirada en el formato vigente, no una reproducción del examen.
- La recogida de opiniones se gestiona por WhatsApp y no requiere persistencia propia.
- Las páginas disponibles en `public/muestras/` representan material real del curso.
