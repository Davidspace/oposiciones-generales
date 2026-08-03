# Quickstart de verificación

Ejecutar desde `oposiciones-generales/`:

```powershell
foreach ($project in @('lorman-lab','tai-academia','ss-casolab','administrativo-estado')) {
  Push-Location $project
  npm ci --no-audit --no-fund
  npm run lint
  npm run test:portfolio
  npm run build
  Pop-Location
}
```

Para SS, el build ejecuta además `content:validate` y comprueba el inventario editorial existente.

Comprobaciones manuales:

1. Abrir la raíz de cada proyecto.
2. Pulsar Tab y activar «Saltar al contenido».
3. Activar «Todos los cursos» y comprobar el destino.
4. Abrir `/aula` del laboratorio y comprobar que el destino configurado es el Moodle canónico.
5. Inspeccionar metadata canonical en TAI, SS y C2.
6. Confirmar que no se ha modificado `SS/` ni ningún corpus editorial.
7. Verificar que la configuración de Vercel usa el proyecto correcto antes de publicar.
