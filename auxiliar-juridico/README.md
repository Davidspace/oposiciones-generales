# Auxilio Judicial C2 · Academia LORMAN

Landing independiente para el producto de tests de la oposición de Auxilio Judicial (subgrupo C2).

## Alcance editorial

La landing usa únicamente el inventario visible del curso de Moodle «Auxilio Judicial - Curso completo de autoevaluación» (curso 11, auditado en lectura): 26 temas y 90 cuestionarios únicos. El producto se comunica como un banco de tests autocorregibles. No anuncia temario escrito, clases, tutoría individual ni corrección manual.

La prueba gratuita es ahora un mini simulacro propio de 20 preguntas teóricas + 8 prácticas, con una reserva por ejercicio, dos casos originales, tiempos orientativos, penalización proporcional y explicación enlazada a fuentes oficiales. Los casos y la guía para sustituir el práctico duplicado del Simulacro 2 están en `docs/`.

Moodle se mantiene en modo solo lectura. La nomenclatura `ENTRENAMIENTO`, `SIMULACRO` y `CUESTIONARIO OFICIAL` está preparada en `docs/moodle-etiquetado.md`, pero todavía no se ha aplicado al aula.

## Desarrollo

```powershell
npm install
npm run dev
npm run test
npm run build
```

## Despliegue

El proyecto es independiente dentro de `oposiciones-generales/auxiliar-juridico/`. Vercel usa `npm run build` y publica `dist/`. Las URLs públicas de la cartera se configuran con variables `VITE_*`; no se guardan secretos en este proyecto.
