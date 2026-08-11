# Plan técnico

1. Crear una aplicación Vite independiente a partir de la plantilla Industry ya validada.
2. Reutilizar componentes de navegación, CTA, fichas, pie legal, analítica y atribución.
3. Implementar una única página con hero, rutas, núcleo común, método, preguntas frecuentes y avisos.
4. Mantener la copia editorial honesta: cifras fechadas y advertencia de adaptación por bases.
5. Actualizar metadata, canonical, robots y sitemap al dominio del hub.
6. Ejecutar lint, build y tests; revisar que el texto no contenga Santander ni Auxilio Judicial.
7. Desplegar el proyecto Vercel con el nombre `auxiliar-administrativo` y solicitar el subdominio `auxiliar-administrativo.academialorman.es`.

## Decisiones

- Ancla visual: Swiss/Industry, para conservar la familia LORMAN y hacer comparables las rutas.
- CTA: AGE enlaza al producto existente; SAS y local abren WhatsApp porque todavía no hay una página editorial cerrada para esas rutas.
- El proyecto Santander queda fuera de la navegación y no se elimina sin una orden explícita.
