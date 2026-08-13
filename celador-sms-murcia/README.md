# Celador SMS Murcia · Academia LORMAN

Landing y prueba gratuita para el curso completo de Celador/a-Subalterno/a del Servicio Murciano de Salud.

## Contenido auditado

- 14 temas: 7 comunes y 7 específicos.
- Cada tema: desarrollo completo, resumen y test de 50 preguntas.
- 10 simulacros de 75 preguntas y 85 minutos.
- Exámenes oficiales del SMS separados de las preguntas propias.
- Prueba gratuita de 15 preguntas con corrección y fuentes indicativas.

El material fuente procede del ZIP privado facilitado por el equipo. La carpeta `_work/` queda fuera de Git y no se publica. La landing no presenta material propio como oficial y remite al BORM y al SMS para cualquier cambio.

## Desarrollo

```powershell
npm install
npm run dev
npm run test
npm run build
```

## Variables

Configura en Vercel, sin subir secretos a Git:

- `VITE_GA4_MEASUREMENT_ID`
- `VITE_CLARITY_PROJECT_ID`
- `VITE_PORTFOLIO_URL` (por defecto `https://academialorman.es`)
- `VITE_WHATSAPP_URL` (opcional; si se omite se genera el enlace con UTM de sesión)

## Moodle

No se modifica Moodle desde este proyecto. El acceso y la matrícula se gestionan por WhatsApp hasta que se defina un flujo de pago y alta independiente.
