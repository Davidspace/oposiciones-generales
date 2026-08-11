# Especificación: hub de Auxiliar Administrativo

## Propósito

Ofrecer una única puerta de entrada para las rutas de Auxiliar Administrativo del Estado, del SAS y de futuras convocatorias locales, sin crear una landing distinta para cada ayuntamiento.

## Usuarios

- Personas que aún comparan Estado, SAS y una convocatoria local.
- Opositores que ya han elegido administración y necesitan una ruta clara.
- Personas que quieren reutilizar una base común sin asumir que los programas son idénticos.

## Requisitos

1. La página debe presentar Estado, SAS y ayuntamientos como rutas separadas.
2. La página debe distinguir entre contenido disponible, contenido en preparación y contenido que exige adaptación a las bases.
3. La página no debe mostrar Santander ni referencias a Auxilio Judicial.
4. Debe enlazar la ruta AGE existente y permitir consultar la ruta SAS por WhatsApp.
5. Debe explicar que el núcleo común no sustituye al programa oficial de cada convocatoria.
6. Debe ser responsive, navegable por teclado y legible en móvil.
7. Debe conservar la trazabilidad de campaña y analítica consentida existente.
8. La metadata debe apuntar al dominio de la nueva landing.

## Criterios de aceptación

- La ruta Estado apunta a `https://administrativo-estado.vercel.app/`.
- Las rutas SAS y local tienen un CTA de contacto contextualizado.
- La fuente oficial se identifica sin presentar cifras como universales.
- El build, lint y tests pasan.
- El proyecto se despliega como aplicación independiente y no se añade al hub general todavía.

## Fuera de alcance

- Crear o modificar el contenido editorial del Moodle.
- Publicar una landing específica para Santander.
- Prometer un temario común cerrado para todos los ayuntamientos.
- Cambiar la landing de Estado o la marca Academia LORMAN.
