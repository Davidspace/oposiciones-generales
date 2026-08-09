# Oposiciones digitales

Monorepo de las aplicaciones y landings de las oposiciones que no pertenecen al producto GSI.

## Proyectos

| Directorio | Producto | Raíz pública del proyecto |
|---|---|---|
| `lorman-lab/` | Cartera común experimental de Academia LORMAN | `/` |
| `ss-casolab/` | Administrativo de la Seguridad Social, C1 | `/` (alias `/ss-casolab`) |
| `tai-academia/` | Técnico Auxiliar de Informática, C1 | `/` (alias `/tai`) |
| `administrativo-estado/` | Auxiliar Administrativo del Estado, C2 | `/` |
| `auxiliar-juridico/` | Auxilio Judicial, C2 · solo tests | `/` |

URLs públicas actuales:

- Academia LORMAN (sitio principal): `https://academialorman.es/`.
- Alias de compatibilidad: `https://lorman-academia.vercel.app/` (canónica en `academialorman.es`).
- Cartera común experimental: `https://lorman-lab.vercel.app/`.
- SS CasoLab: `https://ss.academialorman.es/`.
- TAI Academia: `https://tai.academialorman.es/`.
- Administrativo del Estado C2: `https://administrativo-estado.vercel.app/`.
- Auxilio Judicial C2: `https://auxiliojudicial.academialorman.es/`.

Cada producto conserva su propia aplicación, `package.json`, documentación y configuración. La carpeta `ss-casolab/SS/` contiene el temario editorial exacto de Alba y no debe sobrescribirse.

## Desarrollo

Ejecuta los comandos desde el proyecto que quieras trabajar:

```powershell
cd ss-casolab
npm install
npm run dev
```

Repite el mismo flujo en `tai-academia`, `administrativo-estado`, `auxiliar-juridico` o `lorman-lab`. Las dependencias no se comparten automáticamente entre proyectos.

Cada landing independiente tiene una prueba de navegación que no necesita servicios externos:

```powershell
npm run test:portfolio
```

En TAI, SS y C2, `NEXT_PUBLIC_PORTFOLIO_URL` define el enlace de regreso a Academia LORMAN. Si no se configura, se usa `https://academialorman.es`. En el laboratorio común, `.env.example` documenta las variables `VITE_*` para la cartera, Moodle y los cinco destinos de producto. Son URLs públicas: no introduzcas secretos en estos archivos.

## Despliegue

`.github/workflows/vercel-main.yml` contiene el despliegue de los cinco proyectos
cuando se publica en `main`. El workflow necesita el secreto de Actions
`VERCEL_TOKEN`; no se guarda ningún token en Git. Mientras ese secreto no esté
configurado, los despliegues se pueden hacer manualmente desde cada proyecto con
`vercel deploy --prod`.

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
npm run test:portfolio
npm run build
```

La landing común local es `/`. El piloto C2 conserva `/c2` como ruta local, pero el destino de cartera puede apuntar a su landing independiente mediante `VITE_C2_URL`. No publiques ningún proyecto sin revisar las fuentes, el estado editorial, las URLs públicas y la configuración de privacidad.
