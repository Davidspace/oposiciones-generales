from __future__ import annotations

import json
import re
import sys
import unicodedata
from collections import defaultdict
from difflib import SequenceMatcher
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import build_simulacros as simulations


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = "".join(char for char in value if not unicodedata.combining(char))
    return re.sub(r"\W+", " ", value.casefold()).strip()


def main() -> None:
    _, bank = simulations.load_bank()
    questions = [question for items in bank.values() for question in items]
    normalized = [(question, normalize(question.stem)) for question in questions]

    exact_groups: defaultdict[str, list[str]] = defaultdict(list)
    for question, stem in normalized:
        exact_groups[stem].append(question.source_id)
    exact = [
        {"stem": stem, "ids": ids}
        for stem, ids in exact_groups.items()
        if len(ids) > 1
    ]

    near = []
    for index, (left, left_text) in enumerate(normalized):
        left_tokens = set(left_text.split())
        for right, right_text in normalized[index + 1 :]:
            length_ratio = min(len(left_text), len(right_text)) / max(
                len(left_text), len(right_text), 1
            )
            if length_ratio < 0.72:
                continue
            right_tokens = set(right_text.split())
            union = left_tokens | right_tokens
            jaccard = len(left_tokens & right_tokens) / max(len(union), 1)
            if jaccard < 0.58:
                continue
            ratio = SequenceMatcher(None, left_text, right_text).ratio()
            if ratio >= 0.90:
                near.append(
                    {
                        "left": left.source_id,
                        "right": right.source_id,
                        "similarity": round(ratio, 4),
                        "left_stem": left.stem,
                        "right_stem": right.stem,
                    }
                )

    near.sort(key=lambda item: item["similarity"], reverse=True)
    report = {
        "questions": len(questions),
        "unique_exact_stems": len(exact_groups),
        "duplicate_exact_stems": len(questions) - len(exact_groups),
        "exact_groups": exact,
        "near_duplicate_pairs_090": near,
        "method": (
            "Normalización Unicode y de puntuación para duplicados exactos; "
            "prefiltro de longitud y Jaccard, seguido de SequenceMatcher >= 0,90 "
            "para pares similares."
        ),
    }
    path = ROOT / "_trabajo" / "qa" / "auditoria_duplicados_preguntas.json"
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        json.dumps(
            {
                "questions": report["questions"],
                "duplicate_exact_stems": report["duplicate_exact_stems"],
                "near_duplicate_pairs_090": len(near),
                "top_pairs": near[:20],
                "report": str(path.relative_to(ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
