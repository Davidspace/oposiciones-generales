from __future__ import annotations

import json
import re
import ssl
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "06. Fuentes y control de actualización" / "Registro de normativa esencial.json"
TARGET = ROOT / "05. Normativa" / "Normas oficiales utilizadas"
REPORT = ROOT / "_trabajo" / "qa" / "descarga_normativa.json"
USER_AGENT = "Mozilla/5.0 Codex official-source archiver"
SPECIAL_URLS = {
    "EUR-Lex-12016M-TXT": (
        "https://eur-lex.europa.eu/resource.html?format=PDF&"
        "uri=cellar%3A9e8d52e1-2c70-11e6-b497-01aa75ed71a1.0023.01%2FDOC_1"
    ),
}


def safe_name(value: str, max_len: int = 82) -> str:
    value = re.sub(r'[<>:"/\\|?*]', " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value[:max_len].rstrip()


def is_pdf(path: Path) -> bool:
    try:
        return path.stat().st_size > 1000 and path.read_bytes()[:4] == b"%PDF"
    except OSError:
        return False


def download_one(index: int, norm: dict) -> dict:
    filename = f"{index:02d} - {safe_name(norm['short'])} - {norm['ref']}.pdf"
    target = TARGET / filename
    temp = target.with_suffix(target.suffix + ".download")
    url = SPECIAL_URLS.get(norm["ref"], norm["pdf_url"])
    if is_pdf(target):
        return {
            "index": index,
            "reference": norm["ref"],
            "name": norm["short"],
            "url": url,
            "relative_path": str(target.relative_to(ROOT)),
            "status": "already_present",
            "bytes": target.stat().st_size,
            "error": None,
        }

    candidates = [url]
    publication_match = re.search(
        r"BOE de (\d{2})-(\d{2})-(\d{4})", norm.get("publication", "")
    )
    if norm["ref"].startswith("BOE-A-") and publication_match:
        day, month, year = publication_match.groups()
        original = (
            f"https://www.boe.es/boe/dias/{year}/{month}/{day}/pdfs/"
            f"{norm['ref']}.pdf"
        )
        if original not in candidates:
            candidates.append(original)

    last_error = None
    used_url = url
    for candidate in candidates:
        used_url = candidate
        try:
            request = urllib.request.Request(candidate, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=35, context=ssl.create_default_context()) as response:
                content_type = (response.headers.get("Content-Type") or "").lower()
                data = response.read()
            if len(data) < 1000 or not data.startswith(b"%PDF"):
                raise ValueError(
                    f"Respuesta no PDF ({content_type or 'sin content-type'}, {len(data)} bytes)"
                )
            temp.write_bytes(data)
            temp.replace(target)
            return {
                "index": index,
                "reference": norm["ref"],
                "name": norm["short"],
                "url": candidate,
                "relative_path": str(target.relative_to(ROOT)),
                "status": "downloaded",
                "bytes": target.stat().st_size,
                "error": None,
            }
        except Exception as exc:  # noqa: BLE001 - se registra el error oficial
            last_error = f"{type(exc).__name__}: {exc}"
            try:
                temp.unlink(missing_ok=True)
            except OSError:
                pass
            time.sleep(0.4)

    return {
        "index": index,
        "reference": norm["ref"],
        "name": norm["short"],
        "url": used_url,
        "relative_path": str(target.relative_to(ROOT)),
        "status": "error",
        "bytes": target.stat().st_size if target.exists() else 0,
        "error": last_error,
    }


def main() -> None:
    TARGET.mkdir(parents=True, exist_ok=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    norms = registry["normas"]
    results: list[dict] = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {
            executor.submit(download_one, index, norm): index
            for index, norm in enumerate(norms, 1)
        }
        for future in as_completed(futures):
            results.append(future.result())
    results.sort(key=lambda item: item["index"])
    payload = {
        "fecha_corte": "2026-07-30",
        "total": len(results),
        "correctos": sum(item["status"] != "error" for item in results),
        "errores": sum(item["status"] == "error" for item in results),
        "archivos": results,
    }
    REPORT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
