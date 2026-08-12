# Implementation Plan: MVP Auxiliar Administrativo Córdoba

## Summary

Construir una vertical municipal dentro del hub LORMAN, usando un núcleo de contenido SS auditado y añadiendo solo la materia autonómica, municipal, financiera y ofimática necesaria. La primera entrega comercializa un activo real y acotado: diagnóstico, 100 preguntas, dos temas y dos supuestos, a 69 €, con ampliaciones de la convocatoria tratadas como evolución del producto y no como contenido ya terminado.

## Technical Context

- React 18, TypeScript, Vite, Express y Wouter dentro de `lorman-lab`.
- Estado de diagnóstico exclusivamente en cliente.
- Datos editoriales versionados en JSON/Markdown; DOCX generados como entregables derivados.
- GA4 `G-ZD1KT7K2JM` tras consentimiento explícito.
- Un solo proyecto Vercel y ruta SPA `/auxiliar-administrativo-cordoba`.
- Fuentes primarias: BOP Córdoba, BOE, BOJA/Junta, legislación consolidada y ayuda oficial de las aplicaciones.

## Architecture

1. `docs/cordoba`: programa, matriz, fuentes, revisión ROM, exámenes localizados y entregables.
2. `content/cordoba`: banco de 100 preguntas, diagnóstico y supuestos en formato estructurado.
3. `client/src/pages/cordoba-home.tsx`: landing y experiencia gratuita.
4. `client/src/lib/cordoba-analytics.ts`: consentimiento y contrato de eventos.
5. Ruta, sitemap y datos del hub actualizados sin crear despliegue adicional.

## Constitution Check

- Separación de productos: PASS; Córdoba es ruta propia dentro del hub autorizado.
- Evidencia comercial: PASS; se muestra el contenido disponible real y su corte normativo.
- Privacidad: PASS; respuestas locales y GA4 condicionado al consentimiento.
- Trazabilidad: PASS; pregunta → tema → precepto → fuente → fecha.
- Bajo mantenimiento: PASS; sin directos, tutoría o corrección manual obligatoria.
- No modificación de Moodle: PASS.
- Riesgo jurídico: CONTROLADO mediante matriz de vigencia ROM 2025/2009 y revisión por fuente primaria.

## Design Direction

- **Anchor**: sistema editorial industrial/suizo actual de Academia LORMAN.
- **Differentiator**: expediente municipal de Córdoba, con color albero oscuro como señal local, una matriz visible de “qué entra” y un diagnóstico que mezcla teoría y aplicación.
- **Constraint**: no rediseñar el hub completo ni alterar otras landings.

## Verification Strategy

- Contratos Node para programa, banco, diagnóstico, eventos y contenido comercial.
- Lint y build de `lorman-lab`.
- Render e inspección de todas las páginas de los DOCX.
- Navegación real en escritorio y móvil.
- Verificación de canonical, sitemap y eventos en el navegador.
