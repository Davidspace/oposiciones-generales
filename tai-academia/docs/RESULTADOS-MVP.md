# Resultados del MVP y accesos

Fecha de comprobacion: 2026-07-30.

## Accesos publicos

- GSI Caso 0: `https://gsi-caso-a-caso.dgarmar.chatgpt.site/`
- SS CasoLab: `https://gsi-caso-a-caso.dgarmar.chatgpt.site/ss-casolab`
- Curso completo TAI: `https://gsi-caso-a-caso.dgarmar.chatgpt.site/tai`

Las tres rutas existen en el dominio publico. La ruta TAI es informativa y no
realiza cobros. La version publica de TAI queda pendiente de redeploy: la
version actualizada ya esta en la rama principal, pero el dominio sigue
sirviendo la version anterior. SS CasoLab mantiene cerradas la captacion y la
compra hasta completar sus requisitos de privacidad, revision y operacion.

## Donde esta el material

La fuente canonica del curso de Administrativo de la Seguridad Social esta en:

- Temas y modulos: `content-source/modules/`
- Afirmaciones trazables: `content-source/claims/`
- Preguntas: `content-source/questions/`
- Supuestos y microcasos: `content-source/cases/`
- Validador: `scripts/validate-ss-content.mjs`

Estado actual del corpus SS:

- 36 temas del programa oficial representados.
- 36 modulos creados.
- 770 afirmaciones.
- 400 preguntas (288 de modulos y 112 practicas).
- 14 casos estructurados: ocho microcasos (`MC01`-`MC08`), cuatro supuestos completos (`CP01`-`CP04`) y dos simulacros (`SIM01`-`SIM02`).
- Distribucion de aciertos reequilibrada: 100 respuestas correctas en cada posicion A/B/C/D; 297 preguntas registran version de procedencia `0.1.1`.
- Banco minimo actual: 8/8 microcasos; 4/4 supuestos completos; 2/2 simulacros.
- No quedan modulos pendientes de crear; siguen pendientes las revisiones humanas.
- Auditoria de cobertura por tema: `docs/aegis/work/2026-07-29-ss-academy-full/94-curriculum-audit.md`.
- Auditoria de calidad del banco: `docs/aegis/work/2026-07-29-ss-academy-full/95-question-option-audit.md`.
- Cola operativa para la revisión de Alba: `docs/aegis/work/2026-07-29-ss-academy-full/96-human-review-queue.md`.
- Checklist detallada del lote beta: `docs/aegis/work/2026-07-29-ss-academy-full/97-beta-review-checklist.md`.
- Auditoria de trazabilidad de S03: `docs/aegis/work/2026-07-29-ss-academy-full/98-s03-source-audit.md`.

## Estructura para revisar resultados

1. Abrir la landing SS y completar el microcaso cuando el gate editorial lo
   marque como publicable.
2. Revisar la puntuacion directa, aciertos, errores, blancos y error dominante
   en `#resultado`.
3. Comprobar la ruta de repaso recomendada y la fuente normativa de cada
   decision.
4. Abrir la landing TAI y revisar la ruta visual, la lista de contenidos y el
   estado de acceso.
5. Ejecutar las comprobaciones tecnicas antes de cada publicacion:

```text
npm run content:validate
npm run content:audit
npm run content:review-queue
npm run content:beta-checklist
npm run lint
npm run test:unit
node --test tests/rendered-html.test.mjs
npm run build
```

El comando `npm run content:gate-beta` debe seguir fallando de forma segura
mientras haya revisiones academicas, juridicas o normativas pendientes. Ese
fallo no significa que la estructura este rota: impide publicar un borrador
como contenido definitivo.

## Estado de negocio

- Analitica: cerrada por defecto.
- Captacion SS: cerrada por defecto.
- Pedidos y pagos: cerrados por defecto.
- Moodle: el exportador solo acepta activos publicados y trazables.
- TAI: la landing preparada en la rama principal usa el inventario leido del
  curso Moodle `TAI - CUERPO DE TECNICOS AUXILIARES DE INFORMATICA`: 33 temas
  en PDF, 33 autoevaluaciones y 10 simulacros completos (cinco del bloque III
  y cinco del bloque IV). No enlaza a terceros. La matricula propia y el pago
  siguen pendientes de configurar y el redeploy publico requiere el conector
  de Sites o una sesion de hosting autenticada.
