# Deployment Guide para Vercel

## Archivos de configuración creados

✅ **vercel.json** - Configuración principal de Vercel con:
- Build command personalizado usando script bash
- Output directory: `dist/public`
- Rewrites para SPA routing
- Headers de seguridad (XSS, CORS, etc.)
- Cache headers optimizados

✅ **vite.config.prod.ts** - Configuración de Vite simplificada para producción:
- Sin plugins de Replit que causan conflictos
- Aliases correctos para @, @shared, @assets
- Output correcto a dist/public

✅ **build.sh** - Script de build personalizado:
- Ejecuta vite build con configuración de producción
- Maneja permisos correctamente

✅ **.vercelignore** - Excluye archivos innecesarios:
- Archivos de servidor (server/, shared/)
- Configuraciones de desarrollo
- Archivos de logs y temporales

✅ **PayPalButton modificado** - Adaptado para deployment estático:
- En producción, redirige a WhatsApp en lugar de usar API PayPal
- Mantiene funcionalidad de desarrollo intacta
- Sin dependencias de backend

## Configuración en Vercel

1. **Root Directory**: `.` (raíz del proyecto)
2. **Build Command**: Se usa automáticamente desde vercel.json
3. **Output Directory**: Se usa automáticamente desde vercel.json
4. **Install Command**: Se usa automáticamente desde vercel.json

## Características de seguridad incluidas

- Headers X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- Referrer-Policy para privacidad
- Cache headers optimizados para assets estáticos
- SPA routing configurado correctamente

## Funcionalidad preservada

- ✅ Landing page completa funcional
- ✅ WhatsApp integration (640 786 806)
- ✅ Navegación y scrolling suave
- ✅ Bizum copy-to-clipboard (número oculto)
- ✅ Todos los estilos y animaciones
- ✅ Responsive design
- ✅ PayPal button (redirige a WhatsApp en producción)

El deployment está listo para Vercel con todas las optimizaciones de seguridad y performance.