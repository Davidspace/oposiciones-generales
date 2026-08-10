# Transición de dominio del aula Moodle

Fecha de intervención: 10 de agosto de 2026.

## Estado

- URL canónica: `https://aula.academialorman.es`
- URL heredada: `https://aula.86.48.3.134.sslip.io`
- Curso SERGAS TCAE: `https://aula.academialorman.es/course/view.php?id=9`
- Moodle conserva un único `$CFG->wwwroot`, apuntando al dominio canónico.

## Compatibilidad aplicada

Apache redirige las solicitudes HTTPS del dominio heredado al dominio canónico con estado `307`. Este estado conserva el método y el cuerpo de las solicitudes `POST` que usa la aplicación móvil para obtener el token de acceso. La respuesta de transición incluye `Access-Control-Allow-Origin: *` para que la app pueda seguir la redirección entre ambos nombres de host.

No se modificaron cursos, usuarios, matrículas, contraseñas, tokens ni contenidos de Moodle.

Configuración modificada en el servidor:

- `/etc/apache2/sites-available/moodle-le-ssl.conf`
- módulo de Apache `headers`, habilitado para la cabecera de transición.

Copia previa disponible en el servidor:

- `/etc/apache2/sites-available/moodle-le-ssl.conf.bak-20260810-154356`

## Verificación realizada

- `apache2ctl configtest`: `Syntax OK`.
- servicio `apache2`: activo tras la recarga.
- el dominio antiguo redirige la raíz y conserva la ruta del curso.
- `POST /login/token.php` en el dominio antiguo devuelve `307`, conserva el cuerpo y termina en el endpoint canónico.
- el endpoint canónico de la app responde con CORS y procesa la solicitud.

## Instrucción para usuarios

La solución permanente es eliminar de la aplicación Moodle el centro guardado con `sslip.io` y añadir:

`https://aula.academialorman.es`

El dominio antiguo se conserva solo como transición. Cuando todos los usuarios activos hayan migrado y no haya accesos heredados durante un periodo acordado, se puede retirar la regla, el alias de Apache y ese nombre de la siguiente renovación del certificado.
