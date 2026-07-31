# Almacenamiento local y cookies — borrador bloqueado

**Versión provisional:** `cookies-draft-2026-07-29`

## Estado técnico auditado

En el código revisado el 29-07-2026 no aparecen cookies publicitarias, píxeles, librerías de analítica de terceros, `localStorage` ni `sessionStorage`. Cada carga mantiene en memoria un UUID aleatorio para agrupar los eventos de ese recorrido; se pierde al recargar o cerrar la página y no se escribe en el equipo terminal.

La medición comercial no se declarará “estrictamente necesaria” por conveniencia. Si se añaden herramientas analíticas, vídeo embebido, chat, publicidad o contenido de terceros, esta política y el mecanismo de consentimiento se revisarán antes del despliegue.

## Inventario previo a publicación

| Clave/tecnología | Titular | Finalidad | Datos | Duración | Consentimiento |
|---|---|---|---|---|---|
| UUID volátil en memoria JavaScript | propio | enlazar eventos de una carga de página | UUID aleatorio | hasta recarga/cierre | no usa almacenamiento del terminal; revisar privacidad del evento servidor |
| Otras | — | no encontradas en la auditoría local | — | — | — |

## Cómo cambiar o retirar el consentimiento

`[[PENDIENTE SOLO SI SE DESPLIEGA ALMACENAMIENTO NO EXENTO: panel accesible, aceptar y rechazar al mismo nivel, retirada tan sencilla como otorgamiento y bloqueo previo.]]`

## Fuente y revisión

Base: artículo 22.2 de la [Ley 34/2002](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758) y [Guía sobre el uso de las cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf), consultados el 29-07-2026.  
Revisor: `[[PENDIENTE]]`. Reauditoría del build desplegado y de cabeceras/proveedores: `[[PENDIENTE]]`.
