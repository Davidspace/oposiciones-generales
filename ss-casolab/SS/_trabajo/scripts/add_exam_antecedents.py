from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CONTENT_DIR = ROOT / "_trabajo" / "contenidos"
DATA_DIR = ROOT / "_trabajo" / "investigacion" / "analisis_examenes"
HEADING = "## Antecedentes de examen y puntos especialmente preguntados"
UPDATE_LINE = "> **Contenido actualizado y revisado a fecha de 30 de julio de 2026.**"


def compact(text: str, limit: int = 210) -> str:
    value = re.sub(r"\s+", " ", text).strip()
    if len(value) <= limit:
        return value
    shortened = value[: limit - 1].rsplit(" ", 1)[0]
    return shortened + "…"


def joined_counter(items: list[list[object]], empty: str) -> str:
    if not items:
        return empty
    return "; ".join(f"{name} ({count})" for name, count in items)


def make_section(
    topic_id: str,
    summary: dict,
    rows: list[dict],
) -> str:
    by_year = Counter(row["año"] for row in rows)
    year_text = ", ".join(
        f"{year}: {by_year.get(year, 0)}" for year in (2024, 2025, 2026)
    )
    theoretical = sum(row["caracter"] == "Teórico" for row in rows)
    practical = sum(row["caracter"] == "Práctico" for row in rows)
    reserves = sum(row["reserva"] == "Sí" for row in rows)
    annulled = sum(row["resultado_final"] == "Anulada" for row in rows)
    modified = sum(row["resultado_final"] == "Modificada" for row in rows)
    exception_count = sum(row["contiene_excepcion"] == "Sí" for row in rows)

    examples = sorted(
        rows,
        key=lambda row: (
            row["caracter"] != "Práctico",
            row["reserva"] != "Sí",
            row["año"],
            row["numero_pregunta"],
        ),
    )[:6]
    example_lines = []
    for row in examples:
        label = (
            f"{row['año']}, "
            f"{'supuesto' if row['caracter'] == 'Práctico' else 'teoría'} "
            f"{row['numero_pregunta']}"
        )
        if row["reserva"] == "Sí":
            label += ", reserva"
        example_lines.append(f"- **{label}:** {compact(row['enunciado'])}")

    if not example_lines:
        example_lines = [
            "- No se ha localizado una pregunta canónica atribuible con seguridad "
            "a este tema en el corpus disponible a la fecha de corte."
        ]

    return f"""
{HEADING}

El análisis se ha realizado sobre las preguntas oficiales de acceso libre publicadas para las convocatorias 2023, 2024 y 2025, con fecha de corte **30 de julio de 2026**. La base conserva las variantes necesarias para la trazabilidad, pero el recuento de frecuencia usa **una sola variante canónica por sesión**, de modo que los modelos o colores que únicamente permutan el orden o las opciones no se cuentan dos veces. Este criterio permite medir repeticiones reales entre sesiones sin inflar artificialmente la presencia del tema.

| Indicador | Resultado para {topic_id} |
|---|---:|
| Preguntas canónicas atribuidas | {len(rows)} |
| Distribución por año de examen | {year_text} |
| Teóricas / prácticas | {theoretical} / {practical} |
| Preguntas de reserva | {reserves} |
| Anuladas / con respuesta modificada | {annulled} / {modified} |
| Enunciados con excepción, negación o respuesta incorrecta | {exception_count} |

**Normas que más aparecen:** {joined_counter(summary.get("normas_mas_preguntadas", []), "sin una norma dominante identificable en el enunciado")}.

**Artículos o preceptos más repetidos:** {joined_counter(summary.get("articulos_mas_preguntados", []), "sin repetición suficiente de un artículo concreto")}.

**Formas de pregunta predominantes:** {joined_counter(summary.get("tipos_mas_frecuentes", []), "casuística heterogénea")}.

### Patrones observados

{chr(10).join(example_lines)}

### Cómo trasladarlo al estudio

1. **Priorice la literalidad útil.** Memorice la regla, su artículo y la excepción, pero comprenda antes quién actúa, sobre qué supuesto y con qué plazo.
2. **Entrene las negaciones.** En este tema se han localizado {exception_count} enunciados con fórmulas como «INCORRECTA», «NO», «salvo» o «excepto». Subraye siempre el mandato antes de leer las opciones.
3. **Separe regla estable y dato anual.** Cuando intervengan cuantías, bases, tipos, edades o porcentajes, anote el año de referencia y contraste la cifra con la norma consolidada vigente.
4. **Use las anulaciones como señal de riesgo.** Una pregunta anulada no desaparece del aprendizaje: suele revelar una redacción ambigua, una reforma reciente o dos preceptos que deben diferenciarse.
5. **No confunda frecuencia con seguridad de aparición.** El recuento describe el corpus disponible; no garantiza la distribución de una convocatoria futura ni permite excluir epígrafes poco preguntados.

"""


def main() -> None:
    frequency = json.loads(
        (DATA_DIR / "mapa_frecuencia.json").read_text(encoding="utf-8")
    )
    questions = json.loads(
        (DATA_DIR / "preguntas_oficiales.json").read_text(encoding="utf-8")
    )
    by_topic = {
        item["tema_id"]: item
        for item in frequency
    }
    canonical_rows: dict[str, list[dict]] = {}
    for row in questions:
        if row["computar_en_frecuencia"] != "Sí":
            continue
        canonical_rows.setdefault(row["tema_id"], []).append(row)

    updated: list[str] = []
    refreshed: list[str] = []
    for path in sorted(CONTENT_DIR.glob("*.md")):
        topic_id = path.stem
        text = path.read_text(encoding="utf-8")

        # Actualiza las expresiones de fecha de corte, pero respeta las líneas
        # que documentan la fecha propia de una versión consolidada del BOE.
        revised_lines = []
        for line in text.splitlines():
            if "consolidado a 29-07-2026" not in line:
                line = line.replace("29 de julio de 2026", "30 de julio de 2026")
                line = line.replace("hasta 29-07-2026", "hasta 30-07-2026")
                line = line.replace("a 29-07-2026", "a 30-07-2026")
            revised_lines.append(line)
        text = "\n".join(revised_lines).rstrip() + "\n"

        if UPDATE_LINE not in text:
            lines = text.splitlines()
            insertion = 1
            lines[insertion:insertion] = ["", UPDATE_LINE]
            text = "\n".join(lines).rstrip() + "\n"

        section = make_section(
            topic_id,
            by_topic[topic_id],
            canonical_rows.get(topic_id, []),
        )
        existing = re.search(
            r"(?ims)^## Antecedentes de examen y puntos especialmente preguntados\s*$"
            r".*?(?=^##\s+|\Z)",
            text,
        )
        if existing:
            text = (
                text[: existing.start()].rstrip()
                + "\n\n"
                + section.strip()
                + "\n\n"
                + text[existing.end():].lstrip()
            )
            path.write_text(text.rstrip() + "\n", encoding="utf-8")
            refreshed.append(topic_id)
            continue

        source_match = re.search(
            r"(?im)^## (?:Fuentes oficiales utilizadas|Fuentes oficiales|Normativa y fuentes oficiales).*$",
            text,
        )
        if source_match:
            text = (
                text[: source_match.start()].rstrip()
                + "\n\n"
                + section.strip()
                + "\n\n"
                + text[source_match.start():].lstrip()
            )
        else:
            text = text.rstrip() + "\n\n" + section.strip() + "\n"
        path.write_text(text, encoding="utf-8")
        updated.append(topic_id)

    print(
        json.dumps(
            {
                "updated_with_section": updated,
                "refreshed_section": refreshed,
                "files_total": len(updated) + len(refreshed),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
