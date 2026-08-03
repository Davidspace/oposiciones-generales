# Implementation Plan: Navegación y límites coherentes de la cartera

**Branch**: `codex/portfolio-ux-foundation` | **Date**: 2026-08-03 | **Spec**: `spec.md`

## Summary

Añadir una capa pequeña de navegación y configuración pública a las landings existentes. Se mantiene cada aplicación independiente: el laboratorio común conserva su router Vite/React; TAI, SS y Administrativo del Estado conservan sus aplicaciones Next/vinext. El cambio no añade contenido editorial: solo mejora destinos, accesibilidad, metadata y trazabilidad operativa.

## Technical Context

**Language/Version**: TypeScript; React 18 en `lorman-lab`, React 19/vinext en las landings Next.

**Primary Dependencies**: Vite, Next/vinext, React, CSS existente, APIs de metadata de Next.

**Storage**: N/A para el cambio; no se añaden tablas ni datos de leads.

**Testing**: Tests de cartera por proyecto, `npm run lint`, `npm run build`, validación editorial existente de SS y comprobaciones estáticas de rutas y metadata.

**Target Platform**: Navegadores modernos, móvil y escritorio; despliegues independientes por proyecto.

**Project Type**: Monorepo de landings web independientes.

**Performance Goals**: No añadir dependencias ni llamadas de red para navegación; mantener el render inicial actual.

**Constraints**: No modificar contenido editorial de SS, no mezclar productos, no guardar secretos, no desplegar ni publicar desde esta iteración.

**Scale/Scope**: Cuatro superficies: hub LORMAN, TAI, SS CasoLab y Administrativo del Estado C2.

## Constitution Check

- **Separación de productos**: PASS. Los destinos se configuran por proyecto y no se comparten corpus ni rutas activas.
- **Contenido como fuente externa**: PASS. No se crean temas, preguntas, supuestos ni afirmaciones normativas.
- **Privacidad y secretos**: PASS. Solo se añaden variables públicas de URL; no se introducen tokens.
- **Verificación antes de entrega**: PASS. Lint, builds, validación editorial de SS y pruebas de cartera se ejecutaron con dependencias disponibles.
- **Despliegue controlado**: PASS. Esta iteración modifica código local y no publica.

## Project Structure

```text
specs/003-portfolio-ux-foundation/
├── spec.md
├── plan.md
├── tasks.md
└── quickstart.md

lorman-lab/
├── client/src/lib/portfolio-links.ts
├── client/src/pages/home.tsx
├── client/src/App.tsx
└── client/src/index.css

tai-academia/
├── app/layout.tsx
├── app/tai/page.tsx
├── app/globals.css
└── lib/portfolio-links.ts

ss-casolab/
├── app/layout.tsx
├── app/ss-casolab/page.tsx
├── app/globals.css
└── lib/portfolio-links.ts

administrativo-estado/
├── app/page.tsx
├── app/layout.tsx
├── app/globals.css
└── lib/portfolio-links.ts
```

**Structure Decision**: Mantener los cuatro proyectos independientes y añadir únicamente pequeños módulos de enlaces públicos en cada aplicación. No se introduce un paquete compartido para evitar acoplar los despliegues.

## Design Direction

- **Anchor**: Swiss. Retícula editorial, reglas de 1 px, tipografía sans neutral y acento rojo común.
- **Differentiator**: una línea de navegación de cartera coherente y explícita, con estado de foco visible y destino canónico configurable.

## Complexity Tracking

No hay violaciones de constitución ni nueva complejidad persistente. La duplicación de un módulo de URL por proyecto es deliberada para conservar despliegues autónomos.
