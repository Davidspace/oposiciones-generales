# Informe de revisión editorial y técnica

## 1. Objeto

Este informe documenta los criterios de edición, maquetación y control técnico aplicados a los materiales de la oposición.

## 2. Especificación común

| Elemento | Criterio |
|---|---|
| Papel | A4 |
| Márgenes | 25,4 mm |
| Fuente | Arial |
| Texto general | 11 puntos |
| Interlineado | 1,15 |
| Encabezado | Código, tema y fecha |
| Pie | Aviso legal y página |
| Títulos | Jerarquía visual azul |
| Tablas | Rejilla, encabezado repetido y anchos fijos |
| Portada | Tipo, número, título literal, fecha y aviso |

La maqueta busca lectura prolongada, impresión doméstica y edición posterior en Word. Se evita depender de tipografías no estándar, objetos flotantes o fondos que dificulten la impresión.

## 3. Estructura de los temas

Los temas se han normalizado con:

1. Portada.
2. Desarrollo por epígrafes.
3. Cuadros y tablas.
4. Alertas y errores frecuentes.
5. Resumen.
6. Datos preguntables.
7. Fuentes.

Los títulos del archivo se saneaban únicamente cuando Windows no admite un carácter, especialmente los dos puntos. El título completo y literal se conserva dentro del documento.

## 4. Estructura de los test

Cada bloque de pregunta se mantiene unido siempre que cabe en una página:

- Enunciado.
- Opciones a), b), c) y d).
- Respuesta correcta en negrita.
- Justificación sombreada.
- Nivel de dificultad.

Esta regla evita que una opción o la explicación aparezcan aisladas en la página siguiente. Cuando el bloque completo no pudiera caber por su extensión, Word conserva la integridad máxima posible.

## 5. Controles automáticos

| Control | Resultado esperado |
|---|---|
| Integridad DOCX | ZIP y XML esenciales correctos |
| Número de temas | 36 |
| Número de test | 36 |
| Preguntas por test | 30 |
| Opciones por pregunta | 4 |
| Respuestas correctas | 30 |
| Dificultad | 8/14/8 |
| Distribución de claves | A8/B8/C7/D7 |
| PDF oficiales | Legibles y con páginas |
| Simulacros | 20 tríadas documentales |

Los resultados se almacenan en informes JSON de control, además de la tabla final en Word.

## 6. Revisión visual

La plantilla se probó con un tema completo y un test completo exportados mediante Microsoft Word. Se inspeccionaron:

- Portada.
- Encabezados y pies.
- Numeración.
- Saltos de página.
- Tablas.
- Alineación.
- Justificaciones.
- Aviso legal.

Después de la prueba se acortó el encabezado, se corrigió el reinicio de listas y se mantuvo unido cada bloque de test.

La validación final debe incluir una muestra representativa de documentos de títulos cortos y largos, temas con tablas densas y simulacros.

## 7. Accesibilidad y legibilidad

- Contraste alto entre texto y fondo.
- El color no es el único portador de información.
- Fuente estándar y cuerpo suficiente.
- Tablas con encabezados.
- Jerarquía de títulos consistente.
- Alternativas identificadas por letra.
- No se utilizan imágenes con texto esencial.

## 8. Nombres y rutas

Windows no permite ciertos caracteres en nombres de archivo y limita la longitud de ruta. El sistema:

- Sustituye los dos puntos por guion.
- Elimina caracteres prohibidos.
- Acorta nombres excepcionalmente largos.
- Conserva el título literal dentro del documento.
- Mantiene el número oficial al principio.

Esta decisión evita archivos inaccesibles sin alterar el programa.

## 9. Resultado

La colección utiliza una plantilla homogénea, editable e imprimible. Los controles mecánicos no sustituyen la revisión humana, pero reducen errores repetitivos y dejan evidencia reproducible del cierre.
