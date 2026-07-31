# Datos y sistemas externos

No guardar credenciales, tokens, teléfonos reales, datos fiscales ni información bancaria en Git.

| Dependencia | Dato o acceso necesario | Uso | Estado |
|---|---|---|---|
| Moodle | `.mbz` sin usuarios o acceso temporal mínimo | Auditoría, estructura, importación y alta | Pendiente |
| Vendedor | Identidad/razón social, NIF, domicilio y contacto | LSSI, privacidad, contrato y factura | Pendiente |
| Bizum profesional | Producto, contrato/alta, coste, destino, referencia y devolución | Cobro comercial | Pendiente; bloquea venta |
| WhatsApp Business | E.164, 2FA, perfil, horario y responsables | Soporte individual | Pendiente |
| Email transaccional | Remitente disponible y prueba de entrega | Contrato, acceso y recuperación | Pendiente |
| Moodle API | URL, servicio/token mínimo si se automatiza | Alta, baja y revocación | Opcional tras auditoría |
| Jurista | Canal y disponibilidad por lotes | Riesgo jurídico y casos | Pendiente |
| Revisión legal/fiscal | Profesional y criterio aplicable | Textos de venta, impuestos y retención | Pendiente |
| Hosting | Acceso al proyecto existente | Publicar versión verificada | Pendiente de comprobar |

## Gate Bizum

- Servicio para empresas/profesionales, no modalidad entre particulares.
- Coste total confirmado; si exige gasto nuevo no autorizado, pedidos cerrados.
- Identificador estable y único del proveedor para cada cobro y devolución. Si no existe, la venta permanece cerrada; una captura o una comprobación visual no lo sustituye.
- Nombre visible, límites, operación tardía/duplicada y procedimiento de reembolso.
- Prueba real de cobro y devolución únicamente con autorización expresa del propietario.

## Gate WhatsApp

- Cuenta Business dedicada cuando sea posible y 2FA.
- Privacidad informa del tratamiento en el canal y posibles destinatarios/transferencias.
- Mensajes rápidos, baja, horario y escalado probados.
- Sin grupo ni API no autorizada.

## Gate Moodle

- Backup previo y prueba de restauración.
- Rol mínimo y usuario de pruebas.
- Importación desde fuente, alta, baja, caducidad y recuperación.
- Correo de invitación sin contraseña reutilizable.
- Informe agregado semanal y retención definida.

## Gate de publicación

No se crea un segundo sitio ni se activa venta para rodear una falta de acceso. La construcción local continúa; publicación, pago y datos personales esperan los sistemas y datos reales.
