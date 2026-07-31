# Arquitectura operativa: Bizum profesional con conciliación manual, WhatsApp y Moodle

**Estado**: `DONE_WITH_CONCERNS`  
**Fecha de contraste**: 29 de julio de 2026  
**Alcance**: piloto de SS CasoLab sin gasto autorizado, verificación humana del
pago y comunicación individual por WhatsApp Business. El coste bancario del
servicio Bizum profesional no se ha encontrado y debe confirmarse. No es asesoramiento
jurídico, fiscal ni bancario.

## 1. Conclusión ejecutiva

El flujo es técnicamente viable como piloto de baja escala:

```text
pedido -> referencia opaca -> instrucciones Bizum -> aviso por WhatsApp
       -> comprobación en la banca -> pago confirmado -> matrícula Moodle
       -> aviso de acceso
```

No es un checkout automático. El sitio no conoce el resultado del Bizum y una
captura o un mensaje del comprador no prueban el pago. Solo una persona que vea
el abono en la cuenta bancaria puede cambiar el pedido a `paid`.

La principal condición previa es bancaria. Bizum distingue los envíos entre
particulares de los pagos en comercios. Para aceptar pagos comerciales, su propia
web exige contactar con el banco o proveedor y contratar o activar la solución
profesional aplicable. BBVA, por ejemplo, vincula su solución en línea a un TPV
Virtual; esa condición no debe generalizarse a todas las entidades. Los límites
generales entre particulares incluyen 60 operaciones recibidas al mes y Bizum
aclara que no se aplican a compras en comercios. Ese límite no autoriza una fase
comercial P2P ni sirve como umbral de escala. Por tanto:

- el flujo debe denominarse «Bizum profesional con conciliación manual»;
- no se usa Bizum entre particulares para cobrar el curso, ni siquiera a baja escala;
- David debe obtener alta o contrato del servicio profesional aplicable y conocer
  límites, costes, identificación del pagador, referencia, confirmación y devolución;
- si no existe una opción profesional sin coste y no se autoriza gasto, los pedidos
  permanecen cerrados; cambiar a otro medio de pago requiere una decisión de alcance;
- la conciliación y matrícula pueden seguir siendo manuales mientras cumplan los
  límites operativos medidos.

Fuentes: [Bizum para empresas](https://bizum.com/es/bizum-empresas/),
[aceptar Bizum en un comercio](https://bizum.com/es/faqs/tengo-un-comercio-o-establecimiento-presencial-que-tengo-que-hacer-para-aceptar-pagos-con-bizum/),
[límites de Bizum](https://bizum.com/es/faqs/tiene-algun-limite/) y
[Bizum para empresas de BBVA](https://www.bbva.es/empresas/productos/tpv/bizum-empresas.html).

## 2. Auditoría del estado técnico actual

### 2.1 Lo reutilizable

- `db/leads.ts` y `app/api/leads/route.ts` ya guardan leads con experimento,
  variante, consentimiento y UTM.
- El servidor ya rechaza leads de SS cuando
  `SS_CASOLAB_CAPTURE_ENABLED` no está activo.
- `db/events.ts` y `app/api/events/route.ts` proporcionan un embudo anónimo
  básico en D1.
- `lib/experiments.ts` define el experimento `ss-casolab` y tipos de evento.
- `.openai/hosting.json` enlaza D1 como `DB`.
- `lib/ss-casolab.ts` ya tiene taxonomía académica; no debe mezclarse con los
  datos del pedido o del pago.

### 2.2 Lo que no soporta el flujo nuevo

- `app/api/checkout/route.ts` solo devuelve una URL HTTPS externa. No crea
  pedidos ni sirve para un Bizum manual.
- `.env.example` presupone un checkout alojado y no tiene configuración de
  pedido, Bizum, WhatsApp, Moodle o administración.
- D1 solo contiene `leads` y `funnel_events`. Faltan pedidos, comprobaciones,
  matrículas y auditoría.
- `purchase_confirmed` está permitido en el endpoint público de eventos. Un
  visitante puede falsificar esa métrica. En el diseño nuevo, un evento de pago
  solo puede nacer en el servidor después de una verificación administrativa.
- `funnel_events` no tiene `event_id` único, por lo que no resiste reintentos o
  dobles clics de forma idempotente.
- Los SQL de compatibilidad ejecutan `CREATE TABLE IF NOT EXISTS` en cada
  escritura. El nuevo flujo debe usar una migración explícita y no DDL por pedido.
- El contrato vigente exige una confirmación firmada de un proveedor. Para Bizum
  manual debe existir otro contrato: confirmación humana autenticada contra el
  movimiento bancario.
- No existe API o integración Moodle.

### 2.3 Contradicción que debe resolverse

El contrato actual dice que solo un proveedor firmado puede crear una compra
`paid`. Esa regla es correcta para un checkout automático, pero imposible en el
piloto manual. Debe sustituirse por:

> Solo una acción administrativa autenticada, ejecutada después de comprobar el
> movimiento en la banca, puede confirmar un pago manual. El informe del cliente,
> una captura y un evento público nunca pueden hacerlo.

## 3. Flujo de usuario recomendado

### Paso 1. Información previa al pedido

Antes del botón final se muestra, en una misma vista:

- identidad y contacto del vendedor;
- producto y versión de la oferta;
- contenido disponible y calendario de futuras entregas;
- precio total, impuestos incluidos cuando proceda;
- duración del acceso;
- soporte incluido y tiempos de respuesta;
- forma de pago: Bizum sujeto a comprobación manual;
- plazo máximo para verificar y entregar acceso;
- desistimiento, devolución e incidencias;
- condiciones y privacidad versionadas.

La LSSI obliga a mostrar de forma permanente y accesible la identidad y contacto
del prestador. La normativa de consumo exige información destacada justo antes
del pedido y un botón que comunique sin ambigüedad la obligación de pago. Véanse
el [artículo 10 de la LSSI](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758#a10)
y el [artículo 98.2 del texto de consumidores](https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555#a98).

Botón recomendado:

> **Confirmar pedido de 49 € con obligación de pago**

No usar «Continuar», «Reservar ahora» o «Abrir WhatsApp» como único botón de
pedido. Si se desea una fase anterior no vinculante, su botón debe decir
«Generar borrador sin obligación de pago» y no crear el pedido contractual.

### Paso 2. Creación del pedido

`POST /api/orders` recibe:

- nombre;
- email para Moodle y confirmación contractual;
- producto y oferta seleccionados por el servidor, no por el navegador;
- aceptación de condiciones y su versión;
- reconocimiento de privacidad y su versión;
- elección separada sobre acceso inmediato y desistimiento, solo después de que
  un jurista valide la clasificación del producto;
- sesión y UTM acotados;
- campo honeypot.

El precio, moneda, duración y producto se cargan desde configuración del servidor.
Nunca se acepta del cliente un importe libre.

El servidor devuelve:

- referencia pública aleatoria, por ejemplo `SS-7K4P-9Q2M`;
- token de consulta independiente y de alta entropía;
- importe exacto;
- vencimiento, inicialmente 24 horas;
- instrucciones;
- enlace de WhatsApp con texto precargado.

La referencia no debe ser secuencial, contener email, teléfono ni nombre. Debe
tener al menos 50 bits aleatorios. El estado público se consulta con referencia y
token; conocer solo la referencia no permite leer el pedido.

### Paso 3. Instrucciones de Bizum

La pantalla presenta:

1. importe exacto;
2. número Bizum configurado fuera del repositorio;
3. nombre comercial o nombre del destinatario que el banco mostrará;
4. referencia que debe copiarse al concepto, si la aplicación bancaria lo
   permite;
5. advertencia de comprobar destinatario e importe antes de confirmar;
6. aviso de que el acceso no se entrega hasta verificar el abono;
7. plazo y tratamiento de pagos tardíos;
8. botón para informar del pago por WhatsApp.

No se debe afirmar que un Bizum enviado a un número equivocado puede cancelarse.
Bizum indica que el usuario debe contactar con el destinatario y con su banco
para conocer las opciones aplicables:
[envío a destinatario equivocado](https://bizum.com/es/faqs/me-he-equivocado-de-destinatario-al-enviar-un-bizum-que-puedo-hacer/).

### Paso 4. Aviso iniciado por el cliente en WhatsApp

Enlace:

```text
https://wa.me/<NUMERO_E164>?text=Hola%2C%20mi%20referencia%20es%20SS-7K4P-9Q2M.%20He%20enviado%20el%20Bizum.
```

Solo lleva la referencia. No incluir email, nombre, resultado académico ni otros
datos en la URL, porque una URL puede terminar en historiales y registros.

El clic genera `whatsapp_click`, pero no prueba que el mensaje se haya enviado.
La persona operadora marca `payment_reported` cuando recibe el mensaje.

WhatsApp Business puede usarse sin API mediante su aplicación gratuita, con
saludo, mensaje de ausencia y respuestas rápidas. Esas ayudas reducen escritura,
pero no automatizan conciliación ni matrícula. No usar bots no oficiales ni
automatización de WhatsApp Web. Fuente de producto:
[WhatsApp Business en Google Play](https://play.google.com/store/apps/details?id=com.whatsapp.w4b)
y [herramientas de WhatsApp Business](https://whatsappbusiness.com/products/business-app-features/).

Etiquetas sugeridas en la aplicación:

- `Pedido nuevo`;
- `Bizum comunicado`;
- `Necesita revisión`;
- `Pagado`;
- `Acceso enviado`;
- `Incidencia`;
- `Reembolso`.

Respuestas rápidas:

- `/recibido`: aviso recibido; verificación en la siguiente ventana operativa;
- `/falta`: no se localiza el abono; pedir hora aproximada y últimos cuatro
  dígitos del teléfono pagador;
- `/pagado`: pago comprobado; acceso en preparación;
- `/acceso`: acceso listo, URL de Moodle y uso del restablecimiento de contraseña;
- `/baja`: confirmación de baja de comunicaciones promocionales.

### Paso 5. Verificación humana

Dos ventanas laborables al día son suficientes para la beta. La persona operadora:

1. abre la aplicación bancaria por sus propios medios;
2. busca importe, fecha, concepto y pagador;
3. comprueba que la operación está abonada, no solo notificada;
4. ejecuta una acción administrativa autenticada;
5. el servidor registra verificador, fecha y huella HMAC de la referencia bancaria;
6. el pedido pasa a `paid` una sola vez.

No se deben guardar credenciales bancarias ni conectar un scraper. No se debe
confiar en capturas. Si un pago no puede localizarse, puede pedirse un justificante
redactado que muestre solo importe, fecha, destinatario y referencia de operación;
nunca saldo, IBAN completo u otros movimientos. La comprobación final sigue
haciéndose en la banca.

### Paso 6. Matrícula Moodle

V0, completamente gratis y prudente:

1. localizar o crear al usuario por email;
2. matricularlo manualmente en el curso y fijar vencimiento;
3. guardar identificadores Moodle, no contraseña;
4. enviar desde Moodle un restablecimiento o invitación;
5. marcar `access_provisioned`;
6. responder por WhatsApp con la URL y plazo de ayuda.

Nunca enviar una contraseña reutilizable por WhatsApp.

V1, todavía sin proveedor de pago:

- después de la verificación manual, llamar al servicio web estándar de Moodle
  con un token de mínimo privilegio;
- reutilizar usuario existente por email;
- matricular de forma idempotente;
- registrar error y dejar el pedido en `access_failed` para reintento;
- conservar una acción manual de recuperación.

## 4. Estados e idempotencia

### 4.1 Pedido

```text
awaiting_payment
  -> payment_reported
  -> needs_info
  -> paid
  -> access_pending
  -> access_provisioned
  -> customer_notified

awaiting_payment -> expired | cancelled
payment_reported -> rejected | awaiting_payment
paid | access_provisioned -> refund_pending -> refunded
```

`instructions_viewed` y `whatsapp_click` son eventos, no estados.

### 4.2 Reglas

- `public_reference` es única.
- `idempotency_key` es única por intento de creación. Un reintento HTTP devuelve
  el mismo pedido, no crea otro.
- una huella de referencia bancaria solo puede confirmar un pedido;
- `paid` solo admite transición desde una acción administrativa autenticada;
- `order_id` es único en matrícula;
- una matrícula existente se considera éxito idempotente;
- cada evento de servidor tiene `event_id` único;
- cada transición usa estado esperado: `UPDATE ... WHERE status = ?`;
- toda acción humana se guarda en un registro de auditoría inmutable;
- un pedido vencido pagado tarde pasa a revisión, nunca a acceso automático;
- un reembolso no borra el pedido ni el registro contable.

### 4.3 Acción administrativa sin panel de pago

Para V0 no hace falta construir un panel complejo. Una opción gratuita y más
segura que publicar un formulario admin es un comando local que llama a:

```text
POST /api/admin/orders/<id>/verify-payment
Authorization: Bearer <secreto largo cargado desde entorno local>
```

El secreto vive en variables de entorno de producción y en el almacén seguro del
operador. Nunca se coloca en URL, JavaScript, WhatsApp, documentación o Git. El
endpoint aplica comparación en tiempo constante, rate limit y auditoría. Más
adelante puede sustituirse por autenticación administrativa real.

## 5. Modelo de datos mínimo

### `orders`

- `id` UUID interno;
- `public_reference` única y opaca;
- `lookup_token_hash`;
- `idempotency_key` única;
- `product_code`, `offer_version`;
- `amount_cents`, `currency`;
- `buyer_name`, `buyer_email_normalized`;
- `status`, `expires_at`;
- `terms_version`, `terms_accepted_at`;
- `privacy_version`, `privacy_acknowledged_at`;
- campos separados para acceso inmediato y desistimiento, si proceden;
- `session_id`, UTM y ruta acotados;
- `created_at`, `updated_at`.

### `payment_reports`

- `id`, `order_id`;
- `channel = bizum_manual`;
- `reported_at`;
- hora aproximada y sufijo telefónico opcionales solo si hay incidencia;
- `status = reported | needs_info | matched | rejected`;
- sin captura por defecto.

### `payment_verifications`

- `id`, `order_id` único;
- `bank_reference_hmac` único;
- últimos caracteres de referencia solo para que el operador la reconozca;
- `verified_amount_cents`, `verified_at`, `verified_by`;
- `result`, `notes_code` cerrado;
- nunca credenciales, saldo o IBAN completo.

### `access_provisions`

- `id`, `order_id` único;
- `moodle_course_id`, `moodle_user_id`;
- `status = pending | provisioning | provisioned | failed | revoked`;
- `expires_at`, `attempt_count`, `last_error_code`;
- fechas de creación y actualización.

### `order_audit_log`

- `id`, `event_id` único, `order_id`;
- estado anterior y siguiente;
- actor `system | david | alba`;
- código de motivo, no texto libre salvo incidencia excepcional;
- fecha.

Los leads gratuitos siguen separados. Un lead no es un pedido y un pedido no es
un pago.

## 6. Automatización gratuita y trabajo manual

| Capacidad | Gratis y automática | Manual |
|---|---:|---:|
| Crear referencia y pedido | Sí | No |
| Mostrar instrucciones | Sí | No |
| Abrir chat con texto precargado | Sí | El cliente envía |
| Saludo/ausencia y respuestas rápidas | Parcial, app Business | Supervisión |
| Saber si el Bizum existe | No | Sí, banca |
| Detectar pago duplicado | Tras introducir referencia | Requiere verificación |
| Confirmar `paid` | Validación y persistencia | Decisión humana |
| Crear matrícula V0 | No | Sí |
| Crear matrícula con Moodle API | Sí, después de disponer de token | Recuperación |
| Enviar contraseña | No debe hacerse | Tampoco |
| Enviar invitación Moodle | Sí, si Moodle tiene correo | Configuración |
| Reembolsar | No | Sí, banco y registro |
| Expirar pedidos | Cálculo al consultar o tarea diaria | Revisión de pagos tardíos |
| Métricas y exportación | Sí | Revisión semanal |

Estimación, no hecho observado:

- caso normal con matrícula manual: 3–6 minutos por venta;
- 10 ventas al mes: 0,5–1 hora;
- 50 ventas al mes: 2,5–5 horas, más incidencias;
- 100 ventas al mes: 5–10 horas, antes de soporte e incidencias.

Estas cifras son hipótesis. Se miden desde el primer pedido y no justifican usar
la modalidad entre particulares.

## 7. Fraude y errores

| Riesgo | Tratamiento |
|---|---|
| Captura falsa | Nunca confirma pago; comprobar banca |
| Un pago usado para dos pedidos | HMAC de referencia bancaria única |
| Importe inferior | `needs_info`; no matricular |
| Importe superior | No devolver a terceros; conciliar y devolver solo al origen confirmado |
| Número Bizum equivocado | Mostrar destinatario esperado; el comprador debe comprobarlo |
| Referencia omitida | Cruce por importe, hora y sufijo; revisión manual |
| Pago tras vencimiento | Revisión; reactivar o devolver según condiciones |
| Doble clic o mala red | `idempotency_key` y referencia estable |
| Pedido ajeno consultado | Referencia más token secreto de consulta |
| Eventos falsos | Separar eventos públicos de estados de servidor |
| Robo de WhatsApp | Número dedicado, bloqueo del dispositivo y verificación en dos pasos |
| Suplantación en reembolso | Devolver solo al origen bancario confirmado |
| Escalado de soporte | Mensajes de plantilla, SLA visible y sin grupo |

No usar importes con céntimos artificialmente distintos para identificar compradores:
complica precio, factura, comunicación y devoluciones. La referencia y la
conciliación son el mecanismo correcto.

## 8. Privacidad y contratación

### Datos mínimos

El sitio guarda nombre, email, referencia, producto, importe, estado, aceptación
versionada, atribución y fechas. El teléfono no tiene por qué entrar en D1: el
comprador inicia el chat y WhatsApp ya lo muestra a la cuenta del negocio. Aun así,
es un dato tratado por el negocio y por WhatsApp, por lo que privacidad debe informar
del canal, finalidad, base, destinatarios, posibles transferencias y conservación.
Solo se guarda un sufijo en D1 si hace falta resolver una incidencia.

No enviar por WhatsApp:

- resultados del diagnóstico;
- dudas sobre casos personales de Seguridad Social;
- documentos de identidad;
- datos bancarios completos;
- contraseñas;
- capturas no redactadas.

### Bases separadas

- pedido, verificación, acceso y soporte: medidas precontractuales o contrato;
- factura y conservación contable: obligación legal aplicable;
- promoción por WhatsApp: consentimiento separado, salvo el supuesto limitado de
  relación previa y servicios similares, siempre con oposición sencilla.

La AEPD recuerda que WhatsApp es un medio electrónico sujeto a las reglas de
publicidad y que debe ofrecerse oposición fácil y gratuita. Usar `BAJA` como
respuesta y registrar la baja inmediatamente. Fuentes:
[publicidad no deseada de la AEPD](https://www.aepd.es/areas-de-actuacion/publicidad-no-deseada),
[orientación de la AEPD para pymes](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/directrices-de-aplicacion/pymes)
y [artículos 21 y 22 de la LSSI](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758#a21).

No añadir compradores automáticamente a listas, grupos o difusiones. No usar un
grupo de alumnos: expone números y aumenta moderación.

### Conservación

- pedidos no pagados: propuesta inicial de 90 días y posterior anonimización;
- incidencias no pagadas en WhatsApp: borrar cuando termine el plazo operativo,
  con objetivo máximo de 90 días;
- soporte: revisar y borrar tras el fin del acceso y la ventana de reclamación;
- pedidos pagados, facturas y trazabilidad: conservar durante el plazo que valide
  asesoría fiscal/mercantil;
- reclamaciones: bloqueo hasta cierre y plazo aplicable.

No fijar en código los plazos fiscales sin validación. El sistema D1 no debe
pretender ser un programa de facturación. La obligación de facturar y mantener
una pista fiable existe con independencia de que se cobre por Bizum:
[Reglamento de facturación](https://www.boe.es/eli/es/rd/2012/11/30/1619).

### Desistimiento y acceso inmediato

El curso puede combinar servicio y contenido digital. No debe suponerse una
exclusión automática del desistimiento. Para contenido digital sin soporte, la
excepción requiere consentimiento previo para comenzar durante el plazo,
conocimiento de la pérdida del derecho y confirmación en soporte duradero. Véase
el [artículo 103.m](https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555#a103).

Antes de abrir ventas deben validarse:

- clasificación del producto;
- casillas y texto exactos;
- momento de entrega;
- política de devolución;
- confirmación contractual en soporte duradero.

Aunque WhatsApp sea el canal operativo, mantener el email como dato obligatorio.
Es una decisión del producto para recuperación de acceso y prueba durable, no una
obligación de usar necesariamente ese canal. Moodle o el vendedor envían en soporte
duradero la confirmación contractual y la información precontractual antes de iniciar
el servicio. Confirmación contractual, comprobante de pago y factura son documentos
distintos. Un estado web modificable no debe ser la única confirmación.

### Información del vendedor y contratación electrónica

Antes del pedido deben publicarse los datos exigibles del artículo 10 LSSI: nombre
o denominación, domicilio o residencia, email y contacto directo, NIF, datos
registrales cuando procedan, y precio con indicación de impuestos. Los artículos
27 y 28 LSSI exigen además informar de pasos de contratación, archivo y acceso al
contrato, corrección de errores, idiomas y condiciones almacenables, y acusar la
recepción de la aceptación en el plazo aplicable. El flujo conserva la versión de
las condiciones y emite acuse durable; no basta un mensaje de WhatsApp.

El desistimiento general es de 14 días. Deben facilitarse información y formulario.
La excepción de contenido digital del artículo 103.m solo se aplica si concurren y
se registran por separado consentimiento previo, conocimiento de la pérdida y
confirmación; ninguna casilla puede venir premarcada. La clasificación del curso
como contenido, servicio o producto mixto queda pendiente de revisión externa.

## 9. Métricas fiables

### Eventos del navegador

- `landing_view`;
- `offer_view`;
- `order_form_start`;
- `bizum_instructions_viewed`;
- `whatsapp_click`.

Son señales de interfaz, no hechos bancarios.

### Eventos del servidor

- `order_created`;
- `payment_reported`;
- `payment_needs_info`;
- `payment_verified`;
- `payment_rejected`;
- `access_provisioning_started`;
- `access_provisioned`;
- `customer_notified`;
- `refund_requested`;
- `refund_confirmed`.

Solo `payment_verified` cuenta como venta. Cada evento tiene `event_id`, pedido,
oferta y UTM, sin texto de chat ni referencia bancaria cruda.

### Cuadro semanal

- visitas -> pedidos;
- pedidos -> instrucciones;
- instrucciones -> clic de WhatsApp;
- pedidos -> pagos comunicados;
- comunicados -> pagos verificados;
- pagos -> accesos provisionados;
- tiempo mediano hasta verificación;
- tiempo mediano hasta acceso;
- minutos humanos por venta;
- porcentaje de discrepancias;
- pedidos vencidos;
- reembolsos;
- mensajes de soporte por alumno.

## 10. Configuración que debe aportar David

Nunca aportar al repositorio la clave bancaria, PIN, contraseña, códigos SMS o
credenciales de Bizum.

### Banco y Bizum: bloqueo obligatorio

- entidad y tipo de cuenta;
- contrato o alta del servicio Bizum profesional aplicable;
- límites, comisiones y procedimiento de devolución;
- número dedicado asociado;
- nombre que verá el pagador;
- qué referencia/concepto muestra el extracto;
- fecha de revisión de estas condiciones.

### Negocio y contratación

- identidad legal, identificación fiscal, domicilio y email de contacto;
- precio final e impuestos;
- alcance, duración y fecha de entrega;
- política de desistimiento y devolución revisada;
- versiones aprobadas de condiciones y privacidad;
- procedimiento de factura y asesoría responsable.

### WhatsApp

- número E.164 de WhatsApp Business, preferiblemente dedicado;
- perfil comercial y horario;
- verificación en dos pasos;
- SLA público;
- responsables David/Alba y protocolo de vacaciones;
- textos de respuestas rápidas aprobados.

### Moodle

- URL y curso;
- método de alta manual V0;
- correo saliente y plantilla de invitación;
- duración de matrícula;
- usuario de prueba;
- para V1, servicio web y token de mínimo privilegio;
- procedimiento de baja, prórroga y reembolso.

### Variables de entorno propuestas

```text
SS_CASOLAB_ORDERING_ENABLED=false
SS_PRODUCT_CODE=ss-casolab-c1
SS_OFFER_VERSION=founder-v1
SS_PRICE_CENTS=4900
SS_CURRENCY=EUR
SS_ORDER_TTL_HOURS=24

SS_BIZUM_MODE=professional_manual
SS_BIZUM_PHONE_E164=
SS_BIZUM_RECIPIENT_LABEL=
SS_BANK_REFERENCE_HMAC_SECRET=

SS_WHATSAPP_PHONE_E164=
SS_WHATSAPP_SUPPORT_HOURS=

SS_TERMS_VERSION=
SS_PRIVACY_VERSION=
SS_SELLER_CONTACT_EMAIL=

SS_MOODLE_BASE_URL=
SS_MOODLE_COURSE_ID=
SS_MOODLE_ACCESS_DAYS=365
SS_MOODLE_TOKEN=

SS_ORDER_ADMIN_BEARER_SECRET=
SS_ORDER_LOOKUP_HMAC_SECRET=
```

El teléfono receptor se mostrará a compradores, pero se configura fuera de Git.
Los secretos son independientes y largos. `SS_CASOLAB_ORDERING_ENABLED` permanece en
`false` hasta superar todos los gates.

## 11. Gates de apertura

No abrir pedidos hasta marcar todos:

- [ ] Existe contrato o alta activa del servicio Bizum profesional y sus costes son compatibles con la prohibición de gasto.
- [ ] Se ha realizado un Bizum real de prueba y una devolución de prueba.
- [ ] Identidad, precio, impuestos y condiciones están publicados.
- [ ] Privacidad y desistimiento están revisados.
- [ ] El botón comunica obligación de pago.
- [ ] El servidor genera referencias y pedidos idempotentes.
- [ ] El endpoint público no puede emitir `purchase_confirmed`.
- [ ] La acción administrativa está protegida y auditada.
- [ ] Un pago falso no consigue acceso.
- [ ] Un mismo pago no consigue dos accesos.
- [ ] Existe un procedimiento para pagos sin referencia y pagos tardíos.
- [ ] Moodle puede crear, recuperar y revocar una matrícula.
- [ ] La invitación no contiene contraseña reutilizable.
- [ ] WhatsApp Business tiene 2FA, horario y respuestas rápidas.
- [ ] Se puede ejecutar un reembolso y registrar su evidencia.
- [ ] Las métricas separan aviso, verificación y acceso.

## 12. Decisión de escala

Mantener la conciliación manual del servicio profesional mientras concurran todas estas condiciones:

- máximo orientativo de 30–40 ventas al mes;
- menos de seis minutos humanos por venta normal;
- menos del 10 % de pagos requieren investigación;
- acceso entregado dentro del SLA;
- el contrato profesional sigue vigente y el banco mantiene sus condiciones;
- no se necesita mensajería saliente automatizada.

Automatizar la confirmación o integrar el proveedor cuando falle cualquiera o
cuando el coste humano sea mayor que el coste autorizado de automatización. La
modalidad profesional existe desde la primera venta; lo que escala aquí es la
conciliación, no la legitimidad comercial del canal.

## Fuentes consultadas

Todas consultadas el 29 de julio de 2026:

1. [Bizum: qué es y usos diferenciados](https://bizum.com/es/faqs/que-es-bizum/).
2. [Bizum: límites de operaciones entre personas](https://bizum.com/es/faqs/tiene-algun-limite/).
3. [Bizum para empresas](https://bizum.com/es/bizum-empresas/).
4. [Bizum: alta de cobro para comercios](https://bizum.com/es/faqs/tengo-un-comercio-o-establecimiento-presencial-que-tengo-que-hacer-para-aceptar-pagos-con-bizum/).
5. [Bizum: método de pago en comercio electrónico](https://bizum.com/es/metodo-de-pago-online/).
6. [Bizum: devolución de una compra](https://bizum.com/es/faqs/como-devuelvo-un-producto-comprado-con-bizum/).
7. [BBVA: Bizum para empresas y autónomos](https://www.bbva.es/empresas/productos/tpv/bizum-empresas.html).
8. [BOE: Ley 34/2002, LSSI](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758).
9. [BOE: texto refundido de consumidores](https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555).
10. [BOE: Reglamento de facturación](https://www.boe.es/eli/es/rd/2012/11/30/1619).
11. [AEPD: orientación para pymes](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/directrices-de-aplicacion/pymes).
12. [AEPD: publicidad no deseada y WhatsApp](https://www.aepd.es/areas-de-actuacion/publicidad-no-deseada).
13. [WhatsApp Business: herramientas de la aplicación](https://whatsappbusiness.com/products/business-app-features/).
