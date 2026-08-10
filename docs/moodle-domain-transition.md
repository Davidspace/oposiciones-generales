# Transición de dominio del aula Moodle

Fecha de intervención: 10 de agosto de 2026.

## Estado

- URL canónica: `https://aula.academialorman.es`
- URL heredada: `https://aula.86.48.3.134.sslip.io`
- Curso SERGAS TCAE: `https://aula.academialorman.es/course/view.php?id=9`
- Moodle conserva un único `$CFG->wwwroot`, apuntando al dominio canónico.

## Compatibilidad aplicada

Apache redirige las solicitudes web `GET` y `HEAD` del dominio heredado al dominio canónico con estado `307`, conservando la ruta y la consulta. Las solicitudes `POST` de la aplicación móvil no se redirigen: Moodle las rechaza con `requirecorrectaccess` para impedir que una conexión guardada con `sslip.io` quede autenticada parcialmente.

Esta separación es necesaria porque la app relaciona el token y las URLs de archivos con el centro exacto que el usuario añadió. Si el centro local es `sslip.io`, pero Moodle genera los archivos desde `aula.academialorman.es`, la app puede mostrar el curso y no añadir el token a los recursos. El resultado visible es `missingparam: token`.

La respuesta del host heredado incluye `Access-Control-Allow-Origin: *` para que la aplicación pueda leer el error de migración en vez de recibir un fallo de red opaco.

No se modificaron cursos, usuarios, matrículas, contraseñas, tokens ni contenidos de Moodle.

Configuración modificada en el servidor:

- `/etc/apache2/sites-available/moodle-le-ssl.conf`
- módulo de Apache `headers`, habilitado para la cabecera de transición.

Copia previa disponible en el servidor:

- `/etc/apache2/sites-available/moodle-le-ssl.conf.bak-20260810-154356`

## Verificación realizada

- `apache2ctl configtest`: `Syntax OK`.
- servicio `apache2`: activo tras la recarga.
- el dominio antiguo redirige la raíz y conserva la ruta del curso para navegación web.
- `POST /login/token.php` en el dominio antiguo devuelve `requirecorrectaccess` y no crea una conexión móvil parcial.
- el endpoint canónico de la app responde con CORS y procesa la solicitud.
- los 26 PDF del curso SERGAS TCAE respondieron correctamente mediante el endpoint móvil canónico con la matrícula de prueba existente.

## Instrucción para usuarios

La solución permanente es eliminar de la aplicación Moodle el centro guardado con `sslip.io` y añadir:

`https://aula.academialorman.es`

El dominio antiguo se conserva solo como transición. Cuando todos los usuarios activos hayan migrado y no haya accesos heredados durante un periodo acordado, se puede retirar la regla, el alias de Apache y ese nombre de la siguiente renovación del certificado.
