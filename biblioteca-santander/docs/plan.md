# Plan técnico: Auxiliar de Biblioteca Santander

## Contexto

Se reutiliza la arquitectura Vite + React, los componentes visuales de Auxilio Judicial y el sistema de analítica con consentimiento. El nuevo proyecto es independiente dentro del monorepo y tendrá un proyecto Vercel separado.

## Diseño

- Ancla visual: Industry/Swiss ya presente en Academia LORMAN.
- Firma de producto: retícula de datos de convocatoria y laboratorio práctico visible en hero, cajones y prueba gratuita.
- Paleta: verde biblioteca (`#58786d`, profundo `#203a33`) sobre la misma tipografía y estructura que el resto de landings.
- Datos: programa y formato de examen extraídos de las bases oficiales del BOC y del anuncio del BOE.
- Analítica: se conserva GA4/Clarity con consentimiento y se usa una clave de atribución propia del producto.

## Integración y seguridad

- No se copian secretos ni `.env.local` al proyecto.
- No se modifica Moodle.
- Las rutas de WhatsApp y portfolio se mantienen configurables por variables públicas.
- El dominio se asigna al proyecto nuevo; no se toca el dominio de Auxilio.

## Verificación

- `npm run lint`
- `npm run test`
- `npm run build`
- Comprobación del dominio raíz y de la redirección `/prueba` tras el despliegue.
