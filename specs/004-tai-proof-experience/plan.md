# Implementation Plan: Experiencia de prueba y confianza para TAI

## Summary

Reorganizar la landing TAI alrededor de tres pruebas de valor: páginas reales ampliables, diagnóstico interactivo y opiniones verificables. La implementación será local al proyecto TAI, sin dependencias ni servicios nuevos.

## Technical Context

- TypeScript, React 19, Next/vinext.
- Estado efímero en cliente; sin almacenamiento ni datos personales.
- Componentes TAI específicos y estilos encapsulados bajo `.lm-tai`.
- Verificación con Node tests, ESLint, build y navegador en escritorio/móvil.

## Constitution Check

- Separación de productos: PASS.
- Privacidad y secretos: PASS; no se recogen datos en la prueba.
- Evidencia comercial: PASS; páginas reales y ausencia explícita de reseñas inventadas.
- Bajo mantenimiento: PASS; contenido local y sin backend.
- Trazabilidad normativa: PASS; enlace directo a la convocatoria vigente.

## Design Direction

- **Anchor**: Swiss editorial ya usado por LORMAN.
- **Differentiator**: una mesa de prueba real, con elección de ruta práctica, corrección explicada y material ampliable.
