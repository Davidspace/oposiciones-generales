# WhatsApp Business — etiquetas y respuestas rápidas

**Estado:** configuración propuesta. Falta cargarla y probarla en la cuenta real.  
**Datos pendientes:** `[[NÚMERO_E164]]`, `[[HORARIO_PUBLICADO]]`, `[[URL_FAQ]]`, `[[URL_ESTADO_PEDIDO]]`, `[[URL_PRIVACIDAD]]`.

## Reglas del canal

- Conversaciones individuales; ningún alta automática en grupos o listas.
- Dos ventanas de revisión por semana y máximo orientativo de tres días laborables.
- Solo se usa una referencia opaca de pedido o un ID+versión de contenido.
- No se piden capturas, datos bancarios, contraseñas, DNI, número de afiliación, datos de salud ni expedientes.
- Un mensaje del comprador no confirma un pago; una respuesta del soporte no sustituye la comprobación profesional.
- Las respuestas sobre contenido no son asesoramiento para casos personales.
- `BAJA` se ejecuta sin fricción y se registra.

## Etiquetas

| Etiqueta | Uso | Salida esperada |
|---|---|---|
| `NUEVO-LEAD` | Consentimiento comercial válido, aún sin pedido | FAQ o inventario; máximo un recordatorio sin respuesta |
| `PEDIDO-PENDIENTE` | Pedido creado, abono no verificado | Verificar o caducar |
| `PAGO-REVISION` | Importe, referencia, duplicado o tardío | Decisión registrada por operador |
| `ALTA-MOODLE` | Pago verificado, acceso pendiente/fallido | Acceso confirmado o incidencia técnica |
| `SOPORTE-CONTENIDO` | Duda con ID y versión | FAQ, corrección o escalado |
| `SOPORTE-TECNICO` | Moodle/web | Resuelto, conocido o escalado |
| `ACCESIBILIDAD` | Barrera de acceso o interacción | Prioridad y evidencia de corrección |
| `REEMBOLSO` | Solicitud o devolución en curso | Decisión y estado financiero registrados |
| `PRIVACIDAD` | Derechos o incidente | Canal seguro y responsable |
| `BAJA` | Oposición a marketing | Supresión de la cola comercial |
| `CERRADO` | Resultado comunicado | Sin seguimiento ordinario |

No usar etiquetas que revelen salud, situación económica, una prestación concreta o el contenido de un expediente.

## Respuestas rápidas

### `/acuse`

> Hemos recibido tu mensaje. Revisamos WhatsApp en `[[HORARIO_PUBLICADO]]` y respondemos en un máximo orientativo de 3 días laborables. Para contenido, indica ID y versión. Para un pedido, indica solo su referencia. No envíes documentación ni datos personales.

### `/inventario`

> Puedes consultar aquí el inventario disponible hoy, las próximas entregas y el corte normativo de cada recurso: `[[URL_INVENTARIO]]`. Solo consideramos incluido lo que figura como disponible.

### `/pago-pendiente`

> Hemos localizado el pedido {{referencia}}. Tu aviso no confirma el pago. Comprobaremos el abono en el servicio Bizum profesional y actualizaremos su estado dentro del plazo publicado. No envíes una captura.

### `/pago-incidencia`

> Para revisar el pago de {{referencia}}, responde solo con uno de estos códigos: IMPORTE, SIN REFERENCIA, TARDE o DUPLICADO. No envíes nombre bancario, IBAN, captura, PIN ni otros datos.

### `/estado`

> Consulta el estado con el control privado que recibiste al crear el pedido: `[[URL_ESTADO_PEDIDO]]`. No compartas el token ni lo pegues en este chat. Aquí solo necesitamos la referencia {{referencia}}.

### `/acceso`

> Si el pago de {{referencia}} ya está verificado, la confirmación y la invitación inicial llegan al email del pedido. Revisa spam y usa la recuperación de Moodle. No envíes contraseñas. Si sigue fallando, responde con el mensaje de error sin datos personales.

### `/contenido-datos`

> Para revisar la duda, envía: 1) ID y versión; 2) opción que consideras correcta; 3) enlace y punto de una fuente oficial; 4) explicación breve. No envíes un expediente ni datos personales.

### `/contenido-faq`

> Esta duda está explicada aquí: `[[URL_FAQ]]`. Si no resuelve el punto, responde con el ID, la versión y la frase concreta que necesita aclaración.

### `/limite-juridico`

> El soporte prepara el contenido de la oposición, pero no resuelve expedientes ni presta asesoramiento jurídico personal. Reformula la duda sobre la regla del temario y elimina cualquier dato personal.

### `/tecnico`

> Indica dispositivo, navegador, ID o URL de la actividad, fecha/hora y texto del error. No adjuntes una captura si contiene nombre, email o resultados personales.

### `/accesibilidad`

> Gracias por avisar. Describe la barrera técnica, la actividad, el dispositivo y la tecnología de apoyo, sin aportar un diagnóstico médico. Las incidencias que impiden usar teclado o lector de pantalla se priorizan.

### `/reembolso`

> Hemos registrado la solicitud sobre {{referencia}}. Revisaremos la versión de las condiciones aceptada y comunicaremos la decisión por un soporte duradero. Una solicitud no equivale todavía a una devolución completada ni debe acompañarse de datos bancarios por este chat.

### `/factura`

> Hemos registrado la petición de factura para {{referencia}}. Te indicaremos el canal seguro para los datos estrictamente necesarios. No los envíes por este chat hasta recibir esa instrucción.

### `/baja`

> Hemos registrado tu baja de comunicaciones comerciales. Solo recibirás mensajes imprescindibles para ejecutar un pedido, gestionar un acceso o cumplir una obligación legal vigente.

### `/privacidad`

> Hemos registrado tu solicitud de privacidad. Consulta la información y el canal seguro en `[[URL_PRIVACIDAD]]`. No añadas documentos de identidad ni más datos por este chat.

### `/cierre`

> La incidencia {{referencia_incidencia}} queda cerrada con este resultado: {{resultado_breve}}. Si persiste, responde con esa referencia; no abras conversaciones duplicadas.

## Prueba antes de activar

1. Completar número, horario y URLs públicas.
2. Cargar etiquetas y respuestas en WhatsApp Business.
3. Probar alta, baja, pedido pendiente, acceso, pago con incidencia y reembolso sin dinero real.
4. Confirmar que ninguna plantilla promete inmediatez, aprobado, verificación por captura ni una política de reembolso genérica.
5. Registrar minutos y categoría de diez conversaciones simuladas.
6. Someter privacidad, contratación y plantillas sensibles a revisión jurídica externa.
