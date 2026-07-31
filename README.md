# Oposiciones digitales

Monorepo de las aplicaciones y landings de las oposiciones que no pertenecen al producto GSI.

## Proyectos

| Directorio | Producto | Ruta local |
|---|---|---|
| `ss-casolab/` | Administrativo de la Seguridad Social, C1 | `/ss-casolab` |
| `tai-academia/` | Técnico Auxiliar de Informática | `/tai` |
| `administrativo-estado/` | Administrativo de la Administración del Estado | `/` |

Cada proyecto conserva su propia aplicación, `package.json`, documentación y configuración. La carpeta `ss-casolab/SS/` contiene el temario editorial exacto de Alba.

## Desarrollo

Ejecuta los comandos desde el proyecto que quieras trabajar:

```powershell
cd ss-casolab
npm install
npm run dev
```

Repite el mismo flujo en `tai-academia` o `administrativo-estado`. Las dependencias no se comparten automáticamente entre proyectos.

## Separación de GSI

GSI permanece en `../gsi-casos-practicos` y no forma parte de este repositorio.
