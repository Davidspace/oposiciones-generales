# Quickstart — academia SS CasoLab

## 1. Verificar repositorio y fuente editorial

```powershell
npm ci
npm run content:validate
npm run lint
npm test
```

Comprobar `/ss-casolab`, que el microcaso solo aparece cuando es publicable y que analítica, captación y pedidos fallan cerrados cuando sus flags están desactivados. `/api/checkout` está retirado y responde siempre `410`; `/api/orders` es el único propietario del pedido.

## 2. Recibir y proteger el Moodle

- Obtener de Alba un `.mbz` sin usuarios o acceso temporal de mínimo privilegio.
- Inventariar secciones, actividades, categorías, banco, roles, correo y plugins.
- Crear un backup antes de modificar nada.
- No instalar plugins ni duplicar contenido ya existente durante la auditoría.

## 3. Producir un módulo

1. Confirmar el epígrafe exacto en `content-source/catalog.json`.
2. Crear `module.json`, `lesson.md` y `review.md` bajo `content-source/modules/GNN|SNN/`.
3. Crear afirmaciones versionadas bajo `content-source/claims/`.
4. Crear ocho preguntas con cuatro feedbacks bajo `content-source/questions/`.
5. Completar cobertura `epígrafe → objetivo → sección → actividad`.
6. Ejecutar `npm run content:validate`.
7. Pasar revisión académica y, cuando proceda, jurídica externa.
8. Exportar desde la fuente e importar en Moodle de pruebas.
9. Comparar ID, versión y hash; nunca corregir solo la copia Moodle.

## 4. Gate de beta académica

La beta requiere G01, G13–G16, S01–S03, MC01–MC02 y un CP01 limitado a S01–S03, con inventario visible. Los borradores no se venden. Los temas de riesgo alto/muy alto y todos los casos combinados requieren aprobación externa antes de publicación.

## 5. Preparar pedido y comunicación

Antes de activar pedidos:

- identidad, NIF, domicilio, contacto, impuestos y precio reales;
- condiciones almacenables, privacidad, desistimiento y devoluciones revisados;
- servicio Bizum profesional contratado y activo, sin gasto nuevo no autorizado;
- número WhatsApp Business dedicado, 2FA, horario y respuestas rápidas;
- email transaccional y recuperación de acceso probados;
- Moodle con alta, baja, revocación y backup probados.

WhatsApp es el canal ordinario. Email es opcional para leads y obligatorio en pedidos por decisión operativa. Un aviso o captura no confirma el pago.

## 6. Recorrido E2E obligatorio

1. Visita con atribución acotada.
2. Inicio, cinco decisiones, blancos explícitos y resultado.
3. Repaso concreto y reintento.
4. Contacto consentido sin pregunta de precio.
5. Pedido con email, documentos versionados, importe de servidor, referencia y token.
6. Instrucciones Bizum profesional y clic a WhatsApp.
7. Aviso del comprador que mantiene el pedido pendiente.
8. Verificación administrativa idempotente del abono.
9. Alta Moodle y confirmación durable.
10. Primer acceso y ruta inicial.
11. Reembolso, revocación, incidencia, caducidad y pago sin referencia.
12. Exportación semanal de web/pedidos y agregado Moodle sin PII innecesaria.

## 7. Apertura

Abrir solo después de superar de forma acumulativa el Gate 1 completo de `tasks.md` y el Gate 2. V006 por sí sola no autoriza la apertura. La prueba real de cobro y devolución del Gate 2 exige autorización expresa del propietario; además, no puede haber P0/P1, el inventario debe coincidir con la landing y las horas operativas deben estar medidas. Si Bizum profesional tiene coste no autorizado o no entrega un identificador estable por operación, los pedidos siguen cerrados.
