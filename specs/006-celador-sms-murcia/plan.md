# Implementation Plan: Celador SMS Murcia product

**Branch**: `codex/celador-sms-murcia` | **Date**: 2026-08-13 | **Spec**: `spec.md`

## Summary

Convertir el material auditado de Celador SMS Murcia en una landing Vite/React independiente, enlazada desde el hub LORMAN, con una prueba gratuita representativa, analítica anónima y documentación operativa. Moodle permanece en lectura y la entrega comercial se mantiene por WhatsApp.

## Technical Context

**Language/Version**: TypeScript, React 19, Vite 8, Node 22+
**Primary Dependencies**: React, Vite, existing LORMAN UI components, GA4/Clarity consent helpers
**Storage**: archivos editoriales fuera del código; CRM en Google Sheets; Moodle como aula existente
**Testing**: TypeScript/lint, Node test runner, content/integrity tests, build de Vite
**Target Platform**: Vercel, navegadores móviles y escritorio
**Project Type**: landing web estática con prueba interactiva local
**Performance Goals**: primera carga ligera y prueba usable sin backend adicional
**Constraints**: no secretos, no PII en analítica, no escritura en Moodle, no promesas no verificadas
**Scale/Scope**: un producto, 14 temas, 10 simulacros, dos precios y múltiples campañas UTM

## Constitution Check

- Separación de productos: PASS. Se crea `celador-sms-murcia/` y se conserva `lorman-lab/` como hub.
- Trazabilidad editorial: PASS. El ZIP original no se modifica; se documentan fuentes y auditoría.
- Privacidad: PASS. GA4/Clarity solo después del consentimiento y sin respuestas o teléfonos.
- Bajo mantenimiento: PASS. Prueba autocorregible, WhatsApp y Moodle; sin clases obligatorias.
- Verificación antes de afirmar: PASS. Los datos de convocatoria se enlazan a BORM/MurciaSalud.
- Despliegue seguro: PASS. Build y pruebas antes de asociar dominio.

## Project Structure

```text
oposiciones-generales/
├── celador-sms-murcia/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── lib/
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── public/
│   ├── docs/
│   ├── tests/
│   ├── package.json
│   └── vercel.json
├── lorman-lab/client/src/data/cursos.ts
├── lorman-lab/client/src/lib/portfolio-links.ts
└── specs/006-celador-sms-murcia/
```

**Structure Decision**: Se reutiliza el patrón de landing independiente de `auxiliar-juridico`, con componentes locales y sin acoplar el curso al backend del hub. El hub solo contiene la ficha y el enlace público.

## Research Decisions

- La convocatoria oficial de 18/12/2025 fija un ejercicio único de 75 preguntas y 85 minutos para acceso libre y promoción interna; los errores restan un cuarto y las omisiones no puntúan.
- El anexo oficial fija 106 plazas libres, 5 de discapacidad y 5 de promoción interna para Celador/a-Subalterno/a.
- La convocatoria indica que el turno libre usa materias comunes y específicas; promoción interna usa las específicas.
- El programa específico se vincula a la resolución publicada en BORM el 25/07/2022.
- El producto no se presentará como oficial ni como garantía de plaza.

## Data and Analytics Contracts

Eventos mínimos: `view_course`, `start_free_test`, `free_test_progress`, `complete_free_test`, `open_sample`, `view_price`, `click_whatsapp`, `click_buy`, `faq_open`.

Parámetros permitidos: `course`, `source_page`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `placement`. Queda prohibido enviar nombre, teléfono, correo, respuesta individual o texto de WhatsApp.

## Delivery Gates

1. Inventario y fuentes auditados.
2. Landing y prueba cubiertas por tests.
3. Build y lint verdes.
4. Hub actualizado y tests de portfolio verdes.
5. Dominio configurado por el propietario; si falta DNS, se entrega URL Vercel funcional y pasos exactos.
6. Verificación pública y Search Console posterior al despliegue.
