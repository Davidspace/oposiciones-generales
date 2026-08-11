# Data Model

## DiagnosticQuestion

- `id`: identificador estable.
- `part`: `general`, `development` o `systems`.
- `area`: etiqueta pedagógica.
- `prompt`: enunciado.
- `options`: cuatro alternativas.
- `correctIndex`: índice de respuesta.
- `explanation`: corrección razonada.

## DiagnosticSession

- `route`: Desarrollo o Sistemas.
- `answers`: respuesta opcional por pregunta.
- `currentIndex`: posición actual.
- `completed`: estado final.

No se persiste ni transmite información.
