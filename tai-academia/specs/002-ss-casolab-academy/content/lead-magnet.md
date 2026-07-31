# Lead magnet inicial — Diagnóstico de cinco decisiones

**Estado:** implementado como borrador; no publicable hasta superar la revisión de `MC01`, privacidad y captura.

## Función en el embudo

El recurso permite probar el método antes de dejar datos. No es un PDF de temario ni una muestra recortada del producto de pago. Es una actividad original que reproduce el ciclo que se venderá:

`regla → decisión → explicación de cada alternativa → tipo de error → repaso → reintento`.

## Propuesta de valor

> Resuelve cinco decisiones conectadas sobre afiliación y alta. Descubre qué regla confundiste y qué actividad debes repetir.

Nombre público provisional: **Diagnóstico de afiliación y alta en ocho minutos**.

## Comprador al que cualifica

- Prepara Administrativo de la Administración de la Seguridad Social C1 por turno libre.
- Ya estudia o está valorando empezar.
- Quiere preparar test y supuesto sin depender de una clase semanal.
- Valora una corrección explicada y una ruta concreta de repaso.

No cualifica por renta, precio máximo, profesión, edad ni horas disponibles. El formulario no pregunta cuánto pagaría.

## Contenido exacto

- Contexto original de `MC01`: `Un alta que llega tarde`.
- Cinco preguntas conectadas.
- Cuatro alternativas y feedback específico por alternativa.
- Puntuación directa: `+1`, `−0,25` y `0` en blanco.
- Resultado con aciertos, errores y blancos.
- Clasificación del error dominante.
- Ruta de repaso y reintento.
- Fuentes oficiales enlazadas y fecha de corte visible.

La fuente canónica está en `content-source/cases/MC01.json` y en las preguntas `ss-03-q101..q105`. La landing no contiene otra copia del caso.

## Entrega y CTA

1. La persona abre cualquiera de las tres variantes de la landing.
2. Resuelve el diagnóstico completo sin registro.
3. Consulta la corrección y la ruta de repaso.
4. Puede dejar WhatsApp, email opcional, fase y bloqueo para recibir la ruta y el aviso de apertura.
5. Puede consultar la oferta; el pedido solo aparece si el gate comercial está habilitado.

CTA antes del diagnóstico: **Resolver el microcaso**.

CTA después del resultado: **Recibir mi ruta de repaso**.

No se usa una descarga bloqueada por formulario. La muestra conserva valor aunque la persona no deje datos.

## Fuentes y límites

- Convocatoria y sistema de puntuación: [BOE-A-2025-27158](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-27158).
- Afiliación, altas y bajas: fuentes BOE y Seguridad Social declaradas en las preguntas y claims canónicos de `MC01`.
- El recurso no estima la nota del tribunal, no garantiza aprobar y no resuelve situaciones personales.
- No reproduce preguntas oficiales ni materiales de terceros.

## Datos y privacidad

- Resolver el diagnóstico no exige nombre, teléfono ni email.
- La analítica solo se activa con configuración válida y no acepta eventos de pago desde el navegador.
- La captación permanece cerrada si falta URL HTTPS de privacidad, versión de privacidad o flag explícito.
- WhatsApp es obligatorio únicamente para solicitar la ruta; el email es opcional.
- No se solicitan precio, presupuesto, salario, notas libres ni copias de conversaciones.

## Revisión necesaria

Antes de publicar:

- Alba revisa relato, claves, feedback, dificultad y ruta de repaso.
- La revisión normativa confirma fuentes, artículos, corte y ausencia de excepciones omitidas.
- La revisión jurídica comprueba que el caso no presenta como asesoramiento una simplificación didáctica.
- David verifica móvil, teclado, analítica, privacidad, formulario y CTA en preview protegido.

Hasta registrar esas evidencias, `/api/ss-diagnostic` debe responder `publicable: false` y no entregar el contenido al cliente.

## Métricas del experimento

- Sesiones de landing.
- Inicio del diagnóstico.
- Finalización del diagnóstico.
- Distribución agregada de resultado y error dominante.
- Contactos consentidos.
- Aperturas de oferta y pedidos.
- Pagos verificados, nunca avisos de pago.

Señal inicial de utilidad: al menos el 60 % de quienes empiezan termina las cinco decisiones. La demanda solo se valida con pagos verificados.

## Qué no crear todavía

- Un ebook o temario gratuito paralelo.
- Una corrección individual del diagnóstico.
- Un segundo formulario de investigación.
- Un test de precio.
- Automatizaciones de WhatsApp no autorizadas.
- Más lead magnets hasta que este alcance el umbral definido en V012.
