# Informe de incidencias y decisiones editoriales

## 1. Finalidad

Este informe recoge las incidencias detectadas durante la investigación, redacción, generación y revisión, así como la decisión adoptada.

## 2. Incidencias de fuentes

### 2.1. PDF dañados en la primera descarga

Dos listados oficiales no podían abrirse correctamente después de la primera descarga. Se descargaron de nuevo desde la fuente institucional y se repitió la validación completa.

**Resultado:** 60 PDF, 3.787 páginas y cero errores de lectura.

### 2.2. Secuencia de publicaciones

La convocatoria generó listas, modificaciones, aclaraciones y plantillas sucesivas. Consultar solo el primer documento podía producir información incompleta.

**Decisión:** conservar la secuencia cronológica completa en carpetas separadas y crear un índice técnico.

### 2.3. Proceso no cerrado

A 30 de julio de 2026 existía examen extraordinario anunciado para septiembre y no constaban todavía relación final de aprobados, destinos y nombramientos.

**Decisión:** describir el estado como provisional y no anticipar resultados.

## 3. Incidencias jurídicas

### 3.1. Doble fecha de referencia

El tribunal fijó 4 de marzo de 2026 como cierre de legislación, mientras que el material se actualiza a 29 de julio.

**Decisión:** separar visualmente respuesta del examen ordinario y actualización posterior.

### 3.2. Reformas con vigencia diferida

Varias reformas publicadas en 2025 y 2026 contienen períodos transitorios o entrada en vigor futura.

**Decisión:** comprobar publicación, entrada en vigor y aplicación; no equipararlas.

### 3.3. Organización judicial

La Ley Orgánica 1/2025 modifica la organización y crea instituciones cuya aplicación no es uniforme desde la publicación.

**Decisión:** explicar el calendario y el régimen transitorio. En particular, no atribuir al CGPJ constituido en 2024 una comisión diferida al primer Consejo posterior a la ley.

### 3.4. Oferta de Empleo Público de 2026

La OEP 2026 contiene plazas del mismo cuerpo, pero no pertenece automáticamente a la convocatoria de 2025.

**Decisión:** tratarla como previsión para una convocatoria posterior.

## 4. Incidencias editoriales

### 4.1. Encabezados largos

Los títulos literales de algunos temas exceden el espacio del encabezado.

**Decisión:** usar en el encabezado un identificador corto y conservar el título completo en portada.

### 4.2. Caracteres prohibidos

Los dos puntos de los títulos oficiales no son válidos en nombres de archivo de Windows.

**Decisión:** sustituirlos por guion solo en el nombre del archivo.

### 4.3. Longitud de ruta

Los títulos extensos podían superar límites prácticos de ruta.

**Decisión:** aplicar acortamiento determinista al nombre, manteniendo número y comienzo identificativo.

### 4.4. Numeración

Las listas automáticas podían continuar la numeración de un bloque anterior.

**Decisión:** usar numeración explícita en los apartados donde es necesario reiniciar.

### 4.5. Corte de preguntas

La primera versión del test permitía separar opciones y justificación entre páginas.

**Decisión:** mantener unido el bloque completo siempre que cabe en una página.

### 4.6. Justificaciones no visibles

La fuente de los test contenía comentarios técnicos de verificación que no aparecían en Word.

**Decisión:** convertirlos en una explicación visible sombreada con dificultad y fundamento.

## 5. Incidencias técnicas

### 5.1. Motor de renderizado

LibreOffice no estaba disponible en el entorno. La conversión inicial mediante automatización invisible de Word no resultó estable.

**Decisión:** utilizar Microsoft Word para las exportaciones de control y Poppler para renderizar los PDF en imágenes. La revisión técnica del DOCX se complementa con comprobación ZIP/XML.

### 5.2. Archivos en uso

Un documento abierto puede bloquear su regeneración.

**Decisión:** cerrar la copia de comprobación antes de ejecutar de nuevo el generador, sin interferir con otros documentos del usuario.

## 6. Criterio de cierre

Una incidencia se considera cerrada cuando:

1. Se identifica su causa.
2. Se aplica una corrección reproducible.
3. Se repite el control afectado.
4. No aparecen errores equivalentes en la muestra.
5. La decisión queda documentada.

Las limitaciones que dependen de publicaciones futuras no pueden cerrarse técnicamente; se convierten en advertencias de actualización.
