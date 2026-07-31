# Estado de cartera — 30 de julio de 2026

## Estado técnico comprobado

| Producto | Proyecto Sites | URL | Build | Despliegue |
|---|---|---|---|---|
| SS CasoLab | `appgprj_6a6b83b90040819184413eff162d8166` | https://ss-casolab.dgarmar.chatgpt.site | Correcto; validación editorial: 36 temas, 36 módulos, 770 afirmaciones, 400 preguntas y 14 casos estructurados | Versión 3, correcta, privada |
| TAI Academia | `appgprj_6a6b8583c0f08191a612a036cfd7715e` | https://tai-academia.dgarmar.chatgpt.site | Correcto; raíz `/` y ruta `/tai` propias | Versión 3, correcta, privada |
| Administrativo del Estado | `appgprj_6a6b85d7592c8191bd457464afe3ebef` | https://administrativo-estado.dgarmar.chatgpt.site | Correcto | Versión 1 existente; no modificada en esta intervención |

Las tres Sites están en modo `custom` y con acceso de propietario. No se ha cambiado el acceso a público.

## Cambios aplicados

- SS usa únicamente el experimento `ss-casolab` y su contrato de captación propio.
- TAI usa únicamente el experimento `tai-academia` y `tai-email-v1`.
- TAI ya no contiene rutas activas de pedidos, checkout o administración heredadas de SS.
- Se conservaron los artefactos históricos de infraestructura fuera de las rutas activas y excluidos de Git.
- Se eliminó el enlace visible de TAI hacia SS.
- Se mantuvo GSI en su repositorio independiente.

## Lectura de producto

### SS CasoLab

Es el producto con mayor evidencia editorial. La landing puede afirmar una ruta completa de autoestudio, tests y simulacros, pero debe conservar una separación visible entre contenido revisado, contenido beta y material oficial. El siguiente experimento debe medir qué convierte mejor: corpus completo, segundo ejercicio o entrenamiento de casos.

### TAI Academia

La landing presenta 33 temas, 33 autoevaluaciones, 10 simulacros y aula asíncrona a 59 €. Estas cifras son afirmaciones de la landing actual y deben contrastarse con el inventario real del aula antes de una campaña de pago. No se debe ampliar el temario hasta comprobar demanda.

### Administrativo del Estado

La raíz sigue siendo una landing de validación mínima. No debe tratarse como academia completa. El próximo activo debe ser un lead magnet y una prueba de propuesta/precio, no un temario nuevo.

## Backlog recomendado de bajo mantenimiento

1. Confirmar inventario real de TAI y etiquetar en la landing qué está disponible hoy.
2. Medir durante siete días visitas, inicio/completado del diagnóstico, leads y clics de acceso en SS y TAI.
3. Crear para Administrativo del Estado un único microdiagnóstico y tres variantes de propuesta.
4. Activar una hoja semanal de métricas: visitas, fuente, conversión, soporte y horas de actualización.
5. Probar primero packs de pago único o acceso anual. No activar una suscripción que obligue a publicar contenido mensual.
6. Limitar soporte a una base de conocimiento y una revisión agrupada; reservar la corrección humana para un upsell con cupo.

## Riesgos abiertos

- El acceso actual es privado; las pruebas con tráfico externo requieren decidir expresamente si se cambia a público o se usa una lista de acceso.
- La presencia de migraciones y documentación históricas de pedidos en TAI no afecta a las rutas activas, pero debe revisarse antes de conectar pagos.
- No existen todavía datos comparables de tráfico, leads ni ventas para concluir qué producto tiene mejor ingreso por hora.
