from __future__ import annotations

import json
from pathlib import Path

from docx import Document


ROOT = Path(__file__).resolve().parents[2]
FOLDERS = (
    "01. Información oficial de la oposición",
    "02. Temas redactados",
    "03. Test por temas",
    "04. Simulacros",
    "05. Normativa",
    "06. Fuentes y control de actualización",
    "07. Informes de revisión",
    "08. Análisis de exámenes y preguntas",
)


def main() -> None:
    paths = sorted(
        path
        for folder in FOLDERS
        for path in (ROOT / folder).rglob("*.docx")
    )
    updated = []
    for path in paths:
        document = Document(path)
        properties = document.core_properties
        properties.author = "ACADEMIA LORMAN"
        properties.last_modified_by = "ACADEMIA LORMAN"
        if not properties.title:
            properties.title = path.stem
        if not properties.subject:
            properties.subject = (
                "Cuerpo Administrativo de la Administración de la Seguridad Social, "
                "subgrupo C1, acceso libre"
            )
        document.save(path)
        updated.append(str(path.relative_to(ROOT)))
    print(
        json.dumps(
            {
                "updated": len(updated),
                "author": "ACADEMIA LORMAN",
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
