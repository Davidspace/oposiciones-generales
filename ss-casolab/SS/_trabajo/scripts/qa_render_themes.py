from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from docx_to_pdf_reportlab import convert


def main() -> None:
    generation = json.loads(
        (ROOT / "_trabajo" / "qa" / "informe_generacion.json").read_text(
            encoding="utf-8"
        )
    )
    output_dir = ROOT / "_trabajo" / "qa" / "render_temarios_pdf"
    output_dir.mkdir(parents=True, exist_ok=True)
    results = {}
    for theme_id, item in generation["themes"].items():
        input_path = ROOT / item["output"]
        output_path = output_dir / f"{theme_id}.pdf"
        results[theme_id] = convert(input_path, output_path)
        results[theme_id]["word_count"] = item["word_count"]

    report = {
        "themes": results,
        "count": len(results),
        "minimum_pages": min(item["pages"] for item in results.values()),
        "maximum_pages": max(item["pages"] for item in results.values()),
        "below_15_pages": [
            theme_id for theme_id, item in results.items() if item["pages"] < 15
        ],
    }
    path = ROOT / "_trabajo" / "qa" / "auditoria_paginas_temarios.json"
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        json.dumps(
            {
                "count": report["count"],
                "minimum_pages": report["minimum_pages"],
                "maximum_pages": report["maximum_pages"],
                "below_15_pages": report["below_15_pages"],
                "report": str(path.relative_to(ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
