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

## Laboratorio independiente

`lorman-lab/` es una copia experimental y aislada de `LORMANAcademia`. No es el repositorio ni el deployment original y no contiene su remoto Git anidado.

Para continuar desde otro equipo:

```powershell
git clone https://github.com/GAD6MU/oposiciones-generales.git
cd oposiciones-generales/lorman-lab
npm install
npm run typecheck
npm run lint
npm run test:telegram
npm run build
```

La landing común local es `/`. El piloto C2 está en `/c2`. No publiques este laboratorio sin revisar las fuentes, el estado editorial y la configuración de privacidad.
