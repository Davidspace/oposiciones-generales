# Feature Specification: Navegación y límites coherentes de la cartera

**Feature Branch**: `codex/portfolio-ux-foundation`

**Created**: 2026-08-03

**Status**: Draft

**Input**: Mejorar las landings existentes del repositorio sin crear contenido editorial nuevo. Mantener cada oposición independiente, enlazar las fuentes externas existentes y evitar rutas heredadas.

## User Scenarios & Testing

### User Story 1 - Pasar de una landing a la cartera (Priority: P1)

Una persona que aterriza en TAI, SS CasoLab o Administrativo del Estado puede volver a la landing común de Academia LORMAN y elegir otro producto sin depender del botón Atrás.

**Why this priority**: La cartera solo aumenta conversión si las landings independientes se entienden como productos relacionados, sin mezclar su contenido.

**Independent Test**: Abrir cada landing, activar el enlace de cartera y comprobar que navega a la URL configurada de Academia LORMAN.

**Acceptance Scenarios**:

1. **Given** la landing de un producto, **When** la persona activa «Todos los cursos» o el enlace de marca, **Then** llega a la URL de cartera configurada.
2. **Given** una URL de cartera no configurada en el entorno, **When** se renderiza una landing, **Then** se usa una URL pública estable documentada y no una URL de Moodle ni de GSI.

### User Story 2 - Acceder al contenido principal con teclado (Priority: P1)

Una persona que usa teclado o tecnología de asistencia puede saltar la navegación y llegar al contenido principal de cada landing.

**Why this priority**: Es una mejora directa de accesibilidad que no cambia el contenido editorial ni exige soporte adicional.

**Independent Test**: En cada landing, pulsar Tab desde el inicio, activar «Saltar al contenido» y comprobar que el foco queda en `main` y que se muestra un indicador visible.

**Acceptance Scenarios**:

1. **Given** una landing cargada, **When** se pulsa Tab antes de cualquier otro control, **Then** aparece un enlace para saltar al contenido principal.
2. **Given** el enlace de salto, **When** se activa, **Then** el foco se mueve al `main` de la página sin desplazar a una ruta de otro producto.

### User Story 3 - Mantener destinos operativos y trazables (Priority: P1)

Una persona que pulsa «Aula» desde el laboratorio común llega al dominio canónico de Moodle, y las landings conservan sus enlaces de producto configurables sin depender de dominios heredados de DNS dinámico.

**Why this priority**: Un enlace `sslip.io` bloqueado por redes corporativas puede impedir el acceso al aula aunque Moodle esté operativo.

**Independent Test**: Buscar los destinos activos, ejecutar la ruta `/aula` del laboratorio y comprobar que no aparece `sslip.io` en el código activo.

**Acceptance Scenarios**:

1. **Given** el laboratorio común, **When** se abre `/aula`, **Then** se redirige al destino Moodle configurable y por defecto usa `https://aula.academialorman.es`.
2. **Given** una landing independiente, **When** se construye con su configuración normal, **Then** sus enlaces externos no cargan contenido de SS, TAI, C2 o GSI por rutas heredadas.

### User Story 4 - Evitar duplicados SEO entre raíz y rutas auxiliares (Priority: P2)

Una persona o buscador que accede a la raíz y a una ruta auxiliar de TAI o SS recibe una URL canónica única para el producto.

**Why this priority**: TAI y SS exponen tanto `/` como una ruta específica; sin canonical se puede indexar el mismo contenido dos veces.

**Independent Test**: Inspeccionar la metadata generada para raíz y rutas auxiliares y comprobar que ambas declaran la raíz del proyecto como canonical.

**Acceptance Scenarios**:

1. **Given** una solicitud a TAI o SS, **When** se genera metadata, **Then** se declara una URL canonical relativa a la raíz del proyecto.
2. **Given** una solicitud en desarrollo local, **When** se genera metadata, **Then** el cálculo de `metadataBase` sigue funcionando con `localhost`.

## Edge Cases

- La URL de cartera o Moodle puede tener una barra final; los enlaces no deben duplicarla.
- La configuración externa puede estar vacía o contener espacios; se debe usar el fallback seguro.
- La propagación DNS no es una responsabilidad del build; el código solo debe conservar el destino canónico configurado.
- Si el usuario tiene movimiento reducido, el enlace de salto y el foco deben seguir funcionando sin animaciones.

## Requirements

### Functional Requirements

- **FR-001**: Cada landing independiente MUST expose a visible portfolio link pointing to a single configurable Academia LORMAN URL.
- **FR-002**: Each landing MUST expose a keyboard-accessible skip link and a focusable main landmark.
- **FR-003**: The common laboratory MUST use a configurable canonical Moodle URL and MUST NOT use `sslip.io` in active navigation code.
- **FR-004**: TAI and SS metadata MUST declare a canonical root URL for duplicate route variants.
- **FR-005**: Product-specific active pages MUST NOT inherit navigation labels or destinations from another opposition.
- **FR-006**: Configuration MUST contain no secrets and MUST have documented public fallbacks.
- **FR-007**: Existing product content, prices, source claims and editorial files MUST remain unchanged by this feature.

## Key Entities

- **Portfolio URL**: Public landing URL used as the return destination from independent product pages.
- **Moodle URL**: Public classroom URL used by the common laboratory's aula route.
- **Product landing**: One of the independently deployable TAI, SS CasoLab or Administrativo del Estado pages.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All four active landing surfaces contain a working skip link and a visible focus treatment.
- **SC-002**: The active laboratory navigation contains zero `sslip.io` references.
- **SC-003**: TAI, SS and C2 each expose a portfolio link whose destination is configurable without source edits.
- **SC-004**: TAI and SS emit a canonical root URL in their metadata.
- **SC-005**: Existing source-validation, unit and build checks pass after dependencies are installed.

## Assumptions

- The current original Academia LORMAN deployment remains the fallback portfolio URL until the custom domain is fully validated.
- `https://aula.academialorman.es` is the intended future Moodle URL; the VPS and DNS changes are outside this code feature.
- No new tests, questions, themes or legal claims are authored by this feature.
