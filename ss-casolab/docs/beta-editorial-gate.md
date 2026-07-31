# Gate editorial automático del lote beta

Ejecutar:

```powershell
npm.cmd run content:gate-beta
```

El comando comprueba, sin publicar nada:

- G01, G13–G16 y S01–S03, con al menos ocho preguntas por módulo;
- MC01 y MC02, con cinco preguntas cada uno;
- CP01, con 15 preguntas principales y 3 reservas separadas;
- existencia de todas las preguntas y claims referenciados;
- estados y decisiones de revisión académica, jurídica y normativa.

Códigos de salida:

- `0`: estructura y revisiones editoriales listas.
- `2`: falta estructura o hay referencias rotas.
- `3`: la estructura existe, pero faltan revisiones.

Este comando es deliberadamente estricto y no cambia estados. Tampoco sustituye `content:validate`, la revisión humana, la importación Moodle, los gates legales/comerciales ni V006. Un resultado `0` solo acredita el subgate editorial local.

El JSON muestra el total y el desglose de revisiones pendientes. Solo incluye una muestra acotada de IDs para no producir cientos de líneas; `content:report` conserva el inventario completo.

Para revisar el lote en un solo documento privado, ejecutar:

```powershell
npm.cmd run content:review-pack-beta
```

El resultado se guarda en `outputs/review/beta/` con un manifiesto SHA-256. Incluye enunciados, claves, feedback, fuentes, claims y casillas de control, pero nunca cambia estados ni atribuye una aprobación.
