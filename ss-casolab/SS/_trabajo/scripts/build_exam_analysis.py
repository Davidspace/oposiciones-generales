from __future__ import annotations

import csv
import json
import re
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path

import pdfplumber
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
PROGRAM_PATH = ROOT / "_trabajo" / "investigacion" / "programa_maestro.json"
OCR_DIR = ROOT / "_trabajo" / "investigacion" / "ocr"
EXAM_DIR = ROOT / "01. Información oficial de la oposición" / "Exámenes oficiales anteriores"
TEMPLATE_DIR = ROOT / "01. Información oficial de la oposición" / "Plantillas oficiales"
OUTPUT_DIR = ROOT / "08. Análisis de exámenes y preguntas"
DATA_DIR = ROOT / "_trabajo" / "investigacion" / "analisis_examenes"

PROCESS_2023_URL = (
    "https://www.seg-social.es/wps/portal/wss/internet/InformacionUtil/9950/"
    "88beb45d-ca83-4bab-8162-f94ef2894562"
)
PROCESS_2024_URL = (
    "https://www.seg-social.es/wps/portal/wss/internet/InformacionUtil/9950/"
    "88beb45d-ca83-4bab-8162-f94ef2894562/7e46efac-32c8-4cf6-b3d3-d592c3560dff/"
    "rdpi_administrativos_2024"
)
PROCESS_2025_URL = (
    "https://www.seg-social.es/wps/portal/wss/internet/InformacionUtil/9950/"
    "88beb45d-ca83-4bab-8162-f94ef2894562/e0c83707-3358-47a9-94d7-508221dad233"
)

TOPIC_OVERRIDES: dict[str, str] = {
    "2024_conv2023_ordinario_A-T26": "S01",
    "2024_conv2023_ordinario_A-T25": "S02",
    "2024_conv2023_ordinario_A-T38": "S05",
    "2024_conv2023_ordinario_A-T47": "S07",
    "2024_conv2023_ordinario_A-T57": "S12",
    "2024_conv2023_ordinario_A-T69": "S12",
    "2024_conv2023_ordinario_A-P07": "S04",
    "2024_conv2023_ordinario_A-P04": "S03",
    "2024_conv2023_ordinario_A-P18": "S09",
    "2025_conv2023_extraordinario-T49": "S01",
    "2025_conv2023_extraordinario-T17": "G17",
    "2025_conv2023_extraordinario-T28": "S03",
    "2025_conv2023_extraordinario-T29": "S03",
    "2025_conv2023_extraordinario-T36": "S09",
    "2025_conv2023_extraordinario-T44": "S12",
    "2025_conv2023_extraordinario-T50": "S12",
    "2025_conv2023_extraordinario-T53": "S01",
    "2025_conv2023_extraordinario-T55": "S04",
    "2025_conv2023_extraordinario-T56": "S04",
    "2025_conv2023_extraordinario-P01": "S03",
    "2025_conv2023_extraordinario-P03": "S05",
    "2025_conv2023_extraordinario-P04": "S05",
    "2025_conv2023_extraordinario-P05": "S04",
    "2025_conv2023_extraordinario-P16": "S08",
    "2025_conv2023_extraordinario-P18": "S04",
    "2025_conv2024_ordinario_A-T08": "G07",
    "2025_conv2024_ordinario_A-T13": "G13",
    "2025_conv2024_ordinario_A-T25": "S01",
    "2025_conv2024_ordinario_A-T29": "S03",
    "2025_conv2024_ordinario_A-T46": "S07",
    "2025_conv2024_ordinario_A-T54": "S09",
    "2025_conv2024_ordinario_A-T56": "S09",
    "2025_conv2024_ordinario_A-T65": "S11",
    "2025_conv2024_ordinario_A-P01": "S03",
    "2025_conv2024_ordinario_A-P02": "S03",
    "2025_conv2024_ordinario_A-P04": "S04",
    "2025_conv2024_ordinario_A-P05": "S04",
    "2025_conv2024_ordinario_A-P09": "S09",
    "2025_conv2024_ordinario_A-P10": "S09",
    "2025_conv2024_ordinario_A-P17": "S08",
    "2025_conv2024_extraordinario-T26": "S01",
    "2025_conv2024_extraordinario-T24": "S01",
    "2025_conv2024_extraordinario-T25": "S01",
    "2025_conv2024_extraordinario-T30": "S03",
    "2025_conv2024_extraordinario-T31": "S02",
    "2025_conv2024_extraordinario-T48": "S08",
    "2025_conv2024_extraordinario-T51": "S09",
    "2025_conv2024_extraordinario-T57": "S11",
    "2025_conv2024_extraordinario-T58": "S11",
    "2025_conv2024_extraordinario-P01": "S02",
    "2026_conv2025_rojo_A-T51": "S07",
    "2026_conv2025_rojo_A-T01": "G01",
    "2026_conv2025_rojo_A-T17": "G13",
    "2026_conv2025_rojo_A-T20": "G16",
    "2026_conv2025_rojo_A-T58": "S09",
    "2026_conv2025_rojo_A-T65": "S12",
    "2026_conv2025_rojo_A-P02": "S03",
    "2026_conv2025_rojo_A-P05": "S04",
    "2026_conv2025_rojo_A-P09": "S06",
    "2026_conv2025_verde_A-T66": "S07",
    "2026_conv2025_verde_A-T16": "G01",
    "2026_conv2025_verde_A-T10": "G13",
    "2026_conv2025_verde_A-T02": "G16",
    "2026_conv2025_verde_A-T54": "S09",
    "2026_conv2025_verde_A-T48": "S12",
    "2026_conv2025_verde_A-P02": "S03",
    "2026_conv2025_verde_A-P05": "S04",
    "2026_conv2025_verde_A-P09": "S06",
}


@dataclass
class ExamSource:
    key: str
    convocatoria: int
    fecha: str
    modelo: str
    questionnaire: Path
    questionnaire_kind: str
    definitive_template: Path
    provisional_template: Path
    portal_url: str
    theory_ocr: Path | None = None
    practical_ocr: Path | None = None
    color: str | None = None
    template_table_indexes: tuple[int, ...] | None = None
    skip_to_page_two: bool = False


def normalize_ascii(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value)
    return "".join(ch for ch in decomposed if not unicodedata.combining(ch)).lower()


def normalize_spaces(value: str) -> str:
    value = value.replace("\u00ad", "")
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def pdf_text(path: Path) -> str:
    reader = PdfReader(str(path))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def first_nonempty(row: list[str | None]) -> str:
    return " ".join(str(cell).strip() for cell in row if cell and str(cell).strip())


def parse_template_tables(
    path: Path,
    table_indexes: tuple[int, ...] | None = None,
) -> dict[tuple[str, int], str]:
    with pdfplumber.open(path) as pdf:
        tables = pdf.pages[0].extract_tables()
    if table_indexes is not None:
        tables = [tables[index] for index in table_indexes]

    answers: dict[tuple[str, int], str] = {}
    for table in tables:
        header = " ".join(first_nonempty(row) for row in table[:4]).upper()
        exercise = "Segunda parte" if "SUPUESTO" in header else "Primera parte"
        reserve = False
        for row in table[4:]:
            joined = first_nonempty(row).upper()
            if "PREGUNTAS DE RESERVA" in joined:
                reserve = True
                continue
            number = None
            answer = None
            for cell in row:
                text = str(cell).strip().upper() if cell is not None else ""
                if number is None and re.fullmatch(r"\d{1,3}", text):
                    number = int(text)
                if text in {"A", "B", "C", "D", "ANULADA"}:
                    answer = text
            if number is None or answer is None:
                continue
            if reserve:
                number += 15 if exercise == "Segunda parte" else 70
            answers[(exercise, number)] = answer
    return answers


def parse_number_token(token: str) -> int | None:
    value = token.translate(
        str.maketrans(
            {
                "I": "1",
                "l": "1",
                "i": "1",
                "O": "0",
                "o": "0",
                "Q": "0",
                "Z": "2",
                "C": "0",
                "c": "0",
                "S": "5",
                "s": "5",
                "B": "8",
            }
        )
    )
    return int(value) if value.isdigit() else None


QUESTION_LINE = re.compile(
    r"^\s*([0-9IlioOQZCcSsB]{1,4})(?:\s*[\.,]\s*-?\s*|\s*-\s*|\s+)(.+?)\s*$"
)
OPTION_LINE = re.compile(r"^\s*([a-dA-D])\)\s*(.*)$")
PAGE_MARKER = re.compile(r"^===== P.*GINA\s+\d+\s+=====$", re.IGNORECASE)
PAGE_FOOTER = re.compile(r"^P[aá]gina\s+\d+\s+de\s+\d+", re.IGNORECASE)


def trim_layout_cover(text: str) -> str:
    lines = text.splitlines()
    page_two = None
    for index, line in enumerate(lines):
        if re.search(r"P.*GINA\s+2\s+=====", line, flags=re.IGNORECASE):
            page_two = index
            break
    return "\n".join(lines[page_two:] if page_two is not None else lines)


def parse_question_section(
    text: str,
    exercise: str,
    ordinary: int,
    reserves: int,
) -> list[dict]:
    expected_visual = list(range(1, ordinary + 1)) + list(range(1, reserves + 1))
    expected_global = list(range(1, ordinary + 1)) + list(
        range(ordinary + 1, ordinary + reserves + 1)
    )
    questions: list[dict] = []
    current: dict | None = None
    expected_index = 0
    reserve_started = False

    for raw in text.splitlines():
        line = raw.strip()
        if not line or PAGE_MARKER.match(line) or PAGE_FOOTER.match(line):
            continue
        if line.upper() == "PREGUNTAS DE RESERVA":
            reserve_started = True
            continue
        if line.upper() == "SEGUNDA PARTE":
            continue

        match = QUESTION_LINE.match(line)
        accepted = False
        if match and expected_index < len(expected_visual):
            number = parse_number_token(match.group(1))
            waiting_for_reserve = expected_index >= ordinary and not reserve_started
            if not waiting_for_reserve and number == expected_visual[expected_index]:
                if current is not None:
                    questions.append(current)
                current = {
                    "ejercicio": exercise,
                    "numero": expected_global[expected_index],
                    "reserva": expected_index >= ordinary,
                    "lines": [match.group(2)],
                }
                expected_index += 1
                accepted = True
        if accepted:
            continue
        if current is not None:
            current["lines"].append(line)

    if current is not None:
        questions.append(current)

    for question in questions:
        stem_lines: list[str] = []
        options: dict[str, list[str]] = {}
        current_option: str | None = None
        for line in question.pop("lines"):
            option_match = OPTION_LINE.match(line)
            if option_match:
                current_option = option_match.group(1).lower()
                options[current_option] = [option_match.group(2)]
            elif current_option is None:
                stem_lines.append(line)
            else:
                options[current_option].append(line)
        question["enunciado"] = normalize_spaces(" ".join(stem_lines))
        question["opciones"] = {
            key: normalize_spaces(" ".join(value)) for key, value in options.items()
        }
    return questions


def split_combined_exam(text: str) -> tuple[str, str]:
    parts = re.split(
        r"(?im)^\s*(?:SEGUNDA PARTE|SUPUESTO PR[ÁA]CTICO)\s*$",
        text,
        maxsplit=1,
    )
    if len(parts) != 2:
        raise ValueError("No se encontró el separador SEGUNDA PARTE.")
    return parts[0], parts[1]


TOPIC_KEYWORDS: dict[str, list[tuple[str, int]]] = {
    "G01": [
        ("reforma constitucional", 12),
        ("estructura de la constitucion", 10),
        ("articulo 167", 8),
        ("articulo 168", 8),
        ("titulo preliminar", 6),
    ],
    "G02": [
        ("derechos fundamentales", 10),
        ("libertades publicas", 9),
        ("recurso de amparo", 8),
        ("suspension de derechos", 8),
        ("articulo 14", 4),
        ("titulo i", 3),
    ],
    "G03": [
        ("tribunal constitucional", 12),
        ("ley organica 2/1979", 12),
        ("magistrados del tribunal constitucional", 10),
    ],
    "G04": [
        ("rey", 8),
        ("regencia", 12),
        ("corona", 12),
        ("refrendo", 12),
        ("sucesion", 7),
    ],
    "G05": [
        ("cortes generales", 10),
        ("congreso de los diputados", 8),
        ("senado", 7),
        ("defensor del pueblo", 12),
        ("diputacion permanente", 10),
    ],
    "G06": [
        ("poder judicial", 10),
        ("consejo general del poder judicial", 12),
        ("tribunal supremo", 9),
        ("tribunales de instancia", 9),
        ("jurisdiccion militar", 8),
    ],
    "G07": [
        ("consejo de ministros", 10),
        ("presidente del gobierno", 9),
        ("mocion de censura", 9),
        ("cuestion de confianza", 9),
        ("consejo de estado", 12),
        ("ley 50/1997", 10),
    ],
    "G08": [
        ("ley 40/2015", 5),
        ("subsecretario", 10),
        ("secretaria general tecnica", 10),
        ("delegado del gobierno", 10),
        ("administracion del estado en el exterior", 12),
        ("direccion general", 6),
    ],
    "G09": [
        ("comunidad autonoma", 9),
        ("comunidades autonomas", 9),
        ("estatuto de autonomia", 10),
        ("municipio", 8),
        ("provincia", 7),
        ("articulo 155", 8),
    ],
    "G10": [
        ("parlamento europeo", 10),
        ("comision europea", 10),
        ("consejo europeo", 10),
        ("tribunal de justicia de la union", 12),
        ("tratado de la union europea", 6),
    ],
    "G11": [
        ("reglamento de la union", 9),
        ("directiva", 9),
        ("decision", 8),
        ("derecho de la union europea", 10),
        ("articulo 288", 10),
        ("actos delegados", 9),
    ],
    "G12": [
        ("ministerio de inclusion", 12),
        ("direccion general de ordenacion", 12),
        ("secretaria de estado de la seguridad social", 9),
        ("real decreto 501/2024", 12),
    ],
    "G13": [
        ("fuentes del derecho administrativo", 12),
        ("codigo civil", 6),
        ("jerarquia normativa", 9),
        ("costumbre", 5),
    ],
    "G14": [
        ("decreto-ley", 10),
        ("decreto legislativo", 10),
        ("potestad reglamentaria", 10),
        ("reglamento", 4),
        ("ley organica", 6),
    ],
    "G15": [
        ("acto administrativo", 9),
        ("nulidad", 8),
        ("anulabilidad", 8),
        ("notificacion", 6),
        ("revision de oficio", 10),
        ("eficacia del acto", 8),
    ],
    "G16": [
        ("interesado", 8),
        ("representacion", 7),
        ("apoderamiento", 9),
        ("silencio administrativo", 10),
        ("terminos y plazos", 9),
        ("capacidad de obrar", 9),
    ],
    "G17": [
        ("iniciacion", 7),
        ("instruccion", 7),
        ("informacion publica", 9),
        ("ejecucion forzosa", 10),
        ("terminacion del procedimiento", 9),
        ("tramite de audiencia", 9),
    ],
    "G18": [
        ("recurso de alzada", 12),
        ("recurso de reposicion", 12),
        ("recurso extraordinario de revision", 12),
        ("contencioso-administrativa", 10),
    ],
    "G19": [
        ("empleados publicos", 10),
        ("funcionario", 7),
        ("trebep", 10),
        ("incompatibilidades", 9),
        ("regimen disciplinario", 10),
        ("trienios", 8),
    ],
    "G20": [
        ("atencion al ciudadano", 10),
        ("quejas", 8),
        ("peticiones", 8),
        ("informacion administrativa", 10),
    ],
    "G21": [
        ("igualdad efectiva", 8),
        ("violencia de genero", 10),
        ("discapacidad", 9),
        ("dependencia", 9),
        ("personas lgtbi", 10),
        ("ley 4/2023", 10),
    ],
    "G22": [
        ("datos personales", 10),
        ("reglamento (ue) 2016/679", 12),
        ("proteccion de datos", 12),
        ("responsable del tratamiento", 9),
    ],
    "G23": [
        ("registro electronico", 10),
        ("archivo electronico", 10),
        ("relacionarse electronicamente", 12),
        ("sede electronica", 9),
        ("notificacion electronica", 8),
    ],
    "S01": [
        ("articulo 41 de la constitucion", 12),
        ("ley general de la seguridad social", 4),
        ("entidad gestora", 7),
        ("servicio comun", 7),
        ("inss", 4),
        ("tgss", 4),
    ],
    "S02": [
        ("campo de aplicacion", 10),
        ("regimen especial", 8),
        ("regimen general", 4),
        ("trabajadores autonomos", 8),
        ("sistema especial", 9),
        ("pluriactividad", 9),
    ],
    "S03": [
        ("afiliacion", 10),
        ("alta", 7),
        ("baja", 7),
        ("inscripcion de empresas", 10),
        ("codigo de cuenta de cotizacion", 9),
        ("convenio especial", 11),
        ("real decreto 84/1996", 10),
    ],
    "S04": [
        ("base de cotizacion", 11),
        ("tipo de cotizacion", 10),
        ("liquidacion de cuotas", 10),
        ("real decreto 2064/1995", 12),
        ("cotizacion", 6),
        ("cuota", 5),
    ],
    "S05": [
        ("periodo voluntario", 10),
        ("aplazamiento", 10),
        ("devolucion de ingresos indebidos", 12),
        ("capital coste", 12),
        ("reclamacion de deuda", 9),
        ("medios de pago", 8),
    ],
    "S06": [
        ("providencia de apremio", 12),
        ("embargo", 11),
        ("enajenacion", 10),
        ("terceria", 12),
        ("credito incobrable", 12),
        ("via ejecutiva", 12),
    ],
    "S07": [
        ("accion protectora", 12),
        ("automaticidad", 11),
        ("anticipo de prestaciones", 11),
        ("reintegro de prestaciones indebidas", 10),
        ("contingencia profesional", 8),
        ("responsabilidad en orden a las prestaciones", 12),
    ],
    "S08": [
        ("incapacidad temporal", 11),
        ("incapacidad permanente", 11),
        ("lesiones permanentes no incapacitantes", 12),
        ("alta medica", 8),
        ("baja medica", 6),
        ("menstruacion incapacitante", 10),
    ],
    "S09": [
        ("nacimiento y cuidado", 12),
        ("cuidado del lactante", 10),
        ("riesgo durante el embarazo", 12),
        ("riesgo durante la lactancia", 12),
        ("cancer u otra enfermedad grave", 12),
        ("prestaciones familiares", 9),
        ("parto multiple", 9),
    ],
    "S10": [
        ("jubilacion", 10),
        ("edad de jubilacion", 10),
        ("jubilacion anticipada", 12),
        ("jubilacion parcial", 12),
        ("jubilacion flexible", 12),
        ("ley 27/2011", 10),
    ],
    "S11": [
        ("viudedad", 12),
        ("orfandad", 12),
        ("muerte y supervivencia", 12),
        ("auxilio por defuncion", 12),
        ("favor de familiares", 11),
    ],
    "S12": [
        ("ingreso minimo vital", 12),
        ("no contributiva", 10),
        ("pension de invalidez no contributiva", 12),
        ("pension de jubilacion no contributiva", 12),
        ("carencia de rentas", 8),
    ],
    "S13": [
        ("patrimonio de la seguridad social", 12),
        ("fondo de reserva", 12),
        ("recursos financieros", 10),
        ("pago de prestaciones", 8),
        ("adquisicion", 5),
        ("enajenacion patrimonial", 10),
    ],
}


def strong_topic_rule(text: str, exercise: str) -> str | None:
    """Clasificación jurídica determinista para normas y conceptos inequívocos."""

    value = normalize_ascii(text)

    # Bloque general: normas o instituciones con correspondencia unívoca.
    general_rules: list[tuple[str, tuple[str, ...]]] = [
        ("G03", ("ley organica 2/1979", "tribunal constitucional")),
        ("G06", ("ley organica 6/1985", "consejo general del poder judicial", "tribunal supremo")),
        ("G12", ("real decreto 501/2024", "direccion general de ordenacion de la seguridad social")),
        ("G07", ("ley 50/1997", "mocion de censura", "cuestion de confianza", "consejo de estado")),
        ("G08", ("ley 40/2015", "departamentos ministeriales", "subsecretario", "delegado del gobierno")),
        ("G19", ("real decreto legislativo 5/2015", "estatuto basico del empleado publico", "trebep", "incompatibilidades")),
        ("G20", ("ley organica 4/2001", "derecho de peticion", "quejas y sugerencias", "informacion administrativa")),
        ("G21", ("ley organica 3/2007", "ley organica 312007", "ley 4/2023", "real decreto legislativo 1/2013", "violencia de genero", "oficina de atencion a la discapacidad")),
        ("G22", ("reglamento (ue) 2016/679", "proteccion de datos personales", "responsable del tratamiento")),
        ("G23", ("real decreto 203/2021", "expediente electronico", "registro electronico", "archivo electronico", "sede electronica", "relacionarse electronicamente", "notificacion por medios electronicos")),
    ]
    for topic, needles in general_rules:
        if any(needle in value for needle in needles):
            if topic == "G07" and re.search(r"articulo\s+24", value):
                return "G14"
            return topic

    # Procedimiento administrativo: el artículo y la institución evitan
    # confundir actos, procedimiento, recursos y administración electrónica.
    if "ley 39/2015" in value or "procedimiento administrativo comun" in value:
        article_match = re.search(r"art(?:iculo|\.)\s+(\d+)", value)
        article = int(article_match.group(1)) if article_match else None
        if any(term in value for term in ("recurso de alzada", "recurso potestativo", "recurso extraordinario")):
            return "G18"
        if any(term in value for term in ("nulidad", "anulabilidad", "revision de oficio", "acto administrativo")):
            return "G15"
        if any(term in value for term in ("interesado", "representacion", "apoderamiento", "silencio administrativo", "obligacion de resolver", "identificacion y firma")):
            return "G16"
        if any(term in value for term in ("iniciacion", "iniciado", "iniciados", "instruccion", "informacion publica", "ejecucion forzosa", "finalizacion del procedimiento")):
            return "G17"
        if article is not None:
            if 34 <= article <= 52 or 106 <= article <= 111:
                return "G15"
            if 3 <= article <= 33:
                return "G16"
            if 53 <= article <= 105:
                return "G17"
            if 112 <= article <= 126:
                return "G18"

    if "ley 29/1998" in value or "jurisdiccion contencioso" in value:
        return "G18"

    # Unión Europea: el artículo 288 y la tipología de actos son fuentes;
    # instituciones, composición y competencias pertenecen al tema G10.
    if any(term in value for term in ("tratado de la union europea", "tratado de funcionamiento de la union europea", "union europea")):
        if any(term in value for term in ("articulo 218", "articulo 288", "articulo 290", "reglamentos, directivas", "derecho derivado", "actos delegados", "efecto directo", "primacia")):
            return "G11"
        return "G10"
    if "acta unica europea" in value:
        return "G11"

    if "codigo civil" in value and any(term in value for term in ("articulo 1", "articulo 2", "fuentes", "entrada en vigor")):
        return "G13"
    if "derecho a la huelga" in value:
        return "G02"

    # Constitución: se atiende al órgano o tramo material del articulado.
    if "constitucion espanola" in value or "constitucion indica" in value:
        article_match = re.search(r"art(?:iculo|\.)\s+(\d+)", value)
        article = int(article_match.group(1)) if article_match else None
        if any(term in value for term in ("reforma constitucional", "reformas constitucionales", "articulo 167", "articulo 168")):
            return "G01"
        if article is not None:
            if article in {41, 43, 49, 50} and (
                "seguridad social" in value
                or "principios rectores" in value
                or exercise == "Segunda parte"
            ):
                return "S01"
            if 56 <= article <= 65:
                return "G04"
            if article in {93, 94, 95, 96}:
                return "G13"
            if article == 54:
                return "G05"
            if 66 <= article <= 96:
                return "G05" if article not in {81, 82, 85, 86} else "G14"
            if 97 <= article <= 116:
                return "G07"
            if 117 <= article <= 127:
                return "G06"
            if 137 <= article <= 158:
                return "G09"
            if 166 <= article <= 169:
                return "G01"
            if 10 <= article <= 55:
                return "G02"
            if article < 10:
                return "G01"
        if any(term in value for term in ("rey", "regencia", "corona", "refrendo")):
            return "G04"
        if any(term in value for term in ("cortes generales", "congreso", "senado", "camaras")):
            return "G05"
        if any(term in value for term in ("comunidad autonoma", "estatuto de autonomia", "municipio", "provincia")):
            return "G09"
        if any(term in value for term in ("derechos fundamentales", "libertades publicas", "titulo i")):
            return "G02"
        if any(term in value for term in ("titulo preliminar", "estructura", "capitulo primero")):
            return "G01"

    if any(term in value for term in ("decreto-ley", "potestad reglamentaria", "proyectos de ley", "ley organica")) or (
        "decreto legislativo" in value
        and "ley general de la seguridad social" not in value
        and "real decreto legislativo 8/2015" not in value
    ):
        return "G14"

    # Bloque específico: reglamentos nucleares.
    if "real decreto 84/1996" in value or any(
        term in value
        for term in (
            "inscripcion de empresas",
            "solicitud de afiliacion",
            "convenio especial",
            "codigo de cuenta de cotizacion",
        )
    ):
        return "S03"
    if "real decreto 2064/1995" in value or "reglamento general sobre cotizacion" in value:
        return "S04"
    if "real decreto 1415/2004" in value or "reglamento general de recaudacion" in value:
        article_match = re.search(r"art(?:iculo|\.)\s+(\d+)", value)
        article = int(article_match.group(1)) if article_match else None
        if article is not None and article >= 81:
            return "S06"
        return "S05"

    if any(term in value for term in ("providencia de apremio", "procedimiento de apremio", "embargo", "subasta", "terceria", "credito incobrable", "licitador", "perito")):
        return "S06"
    if any(term in value for term in ("aplazamiento", "devolucion de ingresos indebidos", "reclamacion de deuda", "periodo voluntario", "pago de la deuda", "intereses de demora")):
        return "S05"
    if any(term in value for term in ("base de cotizacion", "tipo de cotizacion", "liquidacion de cuotas", "cuota obrera", "beneficios en la cotizacion")):
        return "S04"

    if any(term in value for term in ("incapacidad temporal", "incapacidad permanente", "lesiones permanentes", "equipo de valoracion de incapacidades", "real decreto 1300/1995")):
        return "S08"
    if any(term in value for term in ("nacimiento y cuidado", "cuidado de lactante", "riesgo durante el embarazo", "parto o adopcion", "hijo o menor a cargo", "cuidado de hijos", "cancer u otra enfermedad grave", "prestaciones familiares")):
        return "S09"
    if "jubil" in value:
        return "S10"
    if any(term in value for term in ("viudedad", "orfandad", "muerte y supervivencia", "favor de familiares", "auxilio por defuncion")):
        return "S11"
    if any(term in value for term in ("ingreso minimo vital", "ley 19/2021", "no contributiva", "prestacion por razon de necesidad", "residentes en el exterior")):
        return "S12"
    if any(term in value for term in ("patrimonio unico", "fondo de reserva", "gestion financiera", "ordenador general de pagos", "mecanismo de equidad intergeneracional", "recursos financieros")):
        return "S13"
    if any(term in value for term in ("accion protectora", "automaticidad", "anticipo de prestaciones", "recargo de las prestaciones", "complementos a minimos", "revalorizacion de las pensiones", "actos de terrorismo", "caducara el derecho", "prescribira el derecho")):
        return "S07"
    if any(term in value for term in ("regimen especial", "regimen general", "campo de aplicacion", "trabajadores por cuenta propia", "trabajadores autonomos", "familiares del empresario")):
        return "S02"
    if any(term in value for term in ("titulo iv", "titulo v")) and "seguridad social" in value:
        return "S02"
    if "titulo vi" in value and "seguridad social" in value:
        return "S12"

    # Artículos inequívocos del TRLGSS cuando el enunciado no nombra la figura.
    if "ley general de la seguridad social" in value:
        article_match = re.search(r"art(?:iculo|\.)\s+(\d+)", value)
        article = int(article_match.group(1)) if article_match else None
        if article is not None:
            if 1 <= article <= 6 or 66 <= article <= 80:
                return "S01"
            if 7 <= article <= 17 or article in {136, 251, 252, 253, 254, 255, 305}:
                return "S02"
            if 18 <= article <= 39 or 141 <= article <= 153:
                return "S04"
            if 42 <= article <= 61 or 154 <= article <= 168:
                return "S07"
            if 103 <= article <= 135:
                return "S13"
            if 169 <= article <= 176 or 193 <= article <= 203:
                return "S08"
            if 177 <= article <= 192 or 235 <= article <= 237 or 351 <= article <= 362:
                return "S09"
            if 204 <= article <= 215:
                return "S10"
            if 216 <= article <= 234:
                return "S11"
            if 363 <= article <= 373:
                return "S12"
        # Preguntas de estructura, títulos y principios generales del texto.
        if any(term in value for term in ("titulo del texto refundido", "disposiciones adicionales", "estructura del texto refundido", "principios de")):
            return "S01"

    return None


def classify_topic(
    text: str,
    exercise: str,
    number: int,
    themes: dict[str, dict],
) -> tuple[str, int, str]:
    normalized = normalize_ascii(text)
    strong = strong_topic_rule(text, exercise)
    if strong is not None:
        return strong, 100, "Alta"

    # La primera parte mezcla ambos bloques y, en 2026, los modelos de color
    # permutan el orden. Solo el supuesto práctico puede restringirse siempre
    # al bloque específico.
    if exercise == "Segunda parte":
        candidates = [key for key in themes if key.startswith("S")]
    else:
        candidates = list(themes)

    scores: dict[str, int] = {}
    for topic in candidates:
        score = 0
        for keyword, weight in TOPIC_KEYWORDS.get(topic, []):
            if re.search(
                rf"(?<!\w){re.escape(keyword)}(?!\w)",
                normalized,
            ):
                score += weight
        scores[topic] = score

    best = max(candidates, key=lambda key: (scores[key], -int(key[1:])))
    score = scores[best]
    if score == 0:
        if exercise == "Segunda parte":
            best = "S07"
        elif number <= 30:
            best = "G01"
        else:
            best = "S01"
    confidence = "Alta" if score >= 12 else "Media" if score >= 7 else "Baja"
    return best, score, confidence


def extract_norm(text: str) -> str:
    patterns = [
        r"(Constituci[oó]n Espa[nñ]ola)",
        r"(Ley Org[aá]nica\s+\d+/\d{4}[^,.;:]*)",
        r"(Ley\s+\d+/\d{4}[^,.;:]*)",
        r"(Real Decreto-ley\s+\d+/\d{4}[^,.;:]*)",
        r"(Real Decreto Legislativo\s+\d+/\d{4}[^,.;:]*)",
        r"(Real Decreto\s+\d+/\d{4}[^,.;:]*)",
        r"(Reglamento\s*\(UE\)\s*\d+/\d+)",
        r"(Tratado de (?:la )?Uni[oó]n Europea)",
        r"(Tratado de Funcionamiento de la Uni[oó]n Europea)",
        r"(texto refundido de la Ley General de la Seguridad Social)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return normalize_spaces(match.group(1))
    return ""


def extract_article(text: str) -> str:
    matches = re.findall(
        r"art[ií]culo(?:s)?\s+(\d+(?:\.\d+)?(?:\s*(?:y|a)\s*\d+(?:\.\d+)?)?)",
        text,
        flags=re.IGNORECASE,
    )
    return "; ".join(dict.fromkeys(matches[:4]))


ORGANISMS = [
    "Instituto Nacional de la Seguridad Social",
    "INSS",
    "Tesorería General de la Seguridad Social",
    "TGSS",
    "Instituto Social de la Marina",
    "ISM",
    "Gerencia de Informática de la Seguridad Social",
    "Servicio Jurídico de la Administración de la Seguridad Social",
    "mutua colaboradora",
    "Servicio Público de Empleo Estatal",
    "SEPE",
    "Inspección de Trabajo y Seguridad Social",
    "Tribunal Constitucional",
    "Tribunal Supremo",
    "Consejo General del Poder Judicial",
    "Consejo de Ministros",
    "Parlamento Europeo",
    "Comisión Europea",
]


def extract_organisms(text: str) -> str:
    normalized = normalize_ascii(text)
    found = []
    for organism in ORGANISMS:
        if normalize_ascii(organism) in normalized:
            found.append(organism)
    return "; ".join(dict.fromkeys(found))


def extract_numbers(text: str) -> str:
    patterns = [
        r"\b\d+(?:[.,]\d+)?\s*(?:d[ií]as?|mes(?:es)?|a[nñ]os?|semanas?|horas?)\b",
        r"\b\d+(?:[.,]\d+)?\s*(?:%|por ciento)\b",
        r"\b\d{1,3}\s*a[nñ]os?\s+de\s+edad\b",
    ]
    matches: list[str] = []
    for pattern in patterns:
        matches.extend(re.findall(pattern, text, flags=re.IGNORECASE))
    return "; ".join(dict.fromkeys(normalize_spaces(item) for item in matches[:8]))


def classify_question_type(text: str, topic: str) -> str:
    normalized = normalize_ascii(text)
    rules = [
        ("Cálculos", ("calcule", "importe", "base reguladora", "cuantia")),
        ("Plazos", ("plazo", "hasta que dia", "dias", "meses")),
        ("Competencias", ("competencia", "competente", "corresponde a")),
        ("Órganos", ("organo", "se adscribe", "composicion")),
        ("Causas de suspensión", ("suspension", "suspender")),
        ("Causas de extinción", ("extincion", "extingue")),
        ("Personas beneficiarias", ("beneficiari", "derecho a la prestacion")),
        ("Requisitos", ("requisito", "periodo minimo", "carencia")),
        ("Procedimientos", ("procedimiento", "tramite", "solicitud")),
        ("Definiciones", ("concepto", "se entiende por")),
    ]
    for label, keywords in rules:
        if any(keyword in normalized for keyword in keywords):
            return label
    topic_types = {
        "S03": "Afiliación, altas y bajas",
        "S04": "Cotización",
        "S05": "Recaudación",
        "S06": "Recaudación ejecutiva",
        "S08": "Incapacidad",
        "S09": "Prestaciones familiares",
        "S10": "Jubilación",
        "S11": "Muerte y supervivencia",
        "S12": "Prestaciones no contributivas",
    }
    return topic_types.get(topic, "Artículos literales")


def difficulty(text: str, exercise: str) -> str:
    normalized = normalize_ascii(text)
    if exercise == "Segunda parte":
        return "Alta" if len(text) > 260 or re.search(r"\d", text) else "Media"
    if len(text) > 320 or any(
        token in normalized
        for token in ("excepto", "incorrecta", "calcule", "salvo", "combinacion")
    ):
        return "Alta"
    if len(text) < 150 and not re.search(r"\d", text):
        return "Básica"
    return "Media"


def concept(text: str, topic: str) -> str:
    normalized = normalize_ascii(text)
    concepts = [
        "reforma constitucional",
        "derechos fundamentales",
        "silencio administrativo",
        "notificación",
        "recurso de alzada",
        "afiliación",
        "alta",
        "baja",
        "base de cotización",
        "liquidación de cuotas",
        "aplazamiento",
        "providencia de apremio",
        "embargo",
        "incapacidad temporal",
        "incapacidad permanente",
        "nacimiento y cuidado de menor",
        "jubilación anticipada",
        "jubilación",
        "viudedad",
        "orfandad",
        "ingreso mínimo vital",
        "Fondo de Reserva",
    ]
    for item in concepts:
        item_normalized = normalize_ascii(item)
        if re.search(rf"(?<!\w){re.escape(item_normalized)}(?!\w)", normalized):
            return item
    return topic


def make_exam_sources() -> list[ExamSource]:
    return [
        ExamSource(
            key="2024_conv2023_ordinario_A",
            convocatoria=2023,
            fecha="2024-11-30",
            modelo="A",
            questionnaire=EXAM_DIR / "2024 Convocatoria 2023 - Cuestionario libre Modelo A.pdf",
            questionnaire_kind="separate_layout",
            definitive_template=TEMPLATE_DIR
            / "2024 Convocatoria 2023 - Plantilla definitiva acceso libre.pdf",
            provisional_template=TEMPLATE_DIR
            / "2024 Convocatoria 2023 - Plantilla provisional acceso libre.pdf",
            portal_url=PROCESS_2023_URL,
            theory_ocr=OCR_DIR / "2024_conv2023_libre_A_layout.txt",
            practical_ocr=OCR_DIR / "2024_conv2023_practico_A_layout.txt",
            template_table_indexes=(0, 1, 2),
        ),
        ExamSource(
            key="2025_conv2023_extraordinario",
            convocatoria=2023,
            fecha="2025-01-25",
            modelo="Extraordinario",
            questionnaire=EXAM_DIR
            / "2025 Convocatoria 2023 - Examen extraordinario acceso libre.pdf",
            questionnaire_kind="combined_text",
            definitive_template=TEMPLATE_DIR
            / "2025 Convocatoria 2023 - Plantilla definitiva extraordinario.pdf",
            provisional_template=TEMPLATE_DIR
            / "2025 Convocatoria 2023 - Plantilla provisional extraordinario.pdf",
            portal_url=PROCESS_2023_URL,
            template_table_indexes=(0, 1, 2),
        ),
        ExamSource(
            key="2025_conv2024_ordinario_A",
            convocatoria=2024,
            fecha="2025-09-13",
            modelo="A",
            questionnaire=EXAM_DIR / "2025 Convocatoria 2024 - Acceso libre Modelo A.pdf",
            questionnaire_kind="combined_layout",
            definitive_template=TEMPLATE_DIR
            / "2025 Convocatoria 2024 - Plantilla definitiva acceso libre.pdf",
            provisional_template=TEMPLATE_DIR
            / "2025 Convocatoria 2024 - Plantilla provisional acceso libre.pdf",
            portal_url=PROCESS_2024_URL,
            theory_ocr=OCR_DIR / "2025_conv2024_libre_A_layout.txt",
            template_table_indexes=(0, 1, 2),
            skip_to_page_two=True,
        ),
        ExamSource(
            key="2025_conv2024_extraordinario",
            convocatoria=2024,
            fecha="2025-10-26",
            modelo="Extraordinario",
            questionnaire=EXAM_DIR
            / "2025 Convocatoria 2024 - Examen extraordinario acceso libre.pdf",
            questionnaire_kind="combined_text",
            definitive_template=TEMPLATE_DIR
            / "2025 Convocatoria 2024 - Plantilla definitiva extraordinario.pdf",
            provisional_template=TEMPLATE_DIR
            / "2025 Convocatoria 2024 - Plantilla provisional extraordinario.pdf",
            portal_url=PROCESS_2024_URL,
            template_table_indexes=(0, 1, 2),
        ),
        ExamSource(
            key="2026_conv2025_rojo_A",
            convocatoria=2025,
            fecha="2026-06-28",
            modelo="Rojo A",
            questionnaire=EXAM_DIR
            / "2026 Convocatoria 2025 - Acceso libre Rojo A.pdf",
            questionnaire_kind="combined_layout",
            definitive_template=TEMPLATE_DIR
            / "2026 Convocatoria 2025 - Plantilla definitiva Modelo A.pdf",
            provisional_template=TEMPLATE_DIR
            / "2026 Convocatoria 2025 - Plantilla provisional Modelo A.pdf",
            portal_url=PROCESS_2025_URL,
            theory_ocr=OCR_DIR / "2026_conv2025_rojo_A_layout.txt",
            color="Rojo",
            template_table_indexes=(0, 1, 2),
            skip_to_page_two=True,
        ),
        ExamSource(
            key="2026_conv2025_verde_A",
            convocatoria=2025,
            fecha="2026-06-28",
            modelo="Verde A",
            questionnaire=EXAM_DIR
            / "2026 Convocatoria 2025 - Acceso libre Verde A.pdf",
            questionnaire_kind="combined_layout",
            definitive_template=TEMPLATE_DIR
            / "2026 Convocatoria 2025 - Plantilla definitiva Modelo A.pdf",
            provisional_template=TEMPLATE_DIR
            / "2026 Convocatoria 2025 - Plantilla provisional Modelo A.pdf",
            portal_url=PROCESS_2025_URL,
            theory_ocr=OCR_DIR / "2026_conv2025_verde_A_layout.txt",
            color="Verde",
            template_table_indexes=(3, 4, 5),
            skip_to_page_two=True,
        ),
    ]


def parse_exam(source: ExamSource) -> list[dict]:
    if source.questionnaire_kind == "separate_layout":
        theory_text = source.theory_ocr.read_text(encoding="utf-8")
        practical_text = source.practical_ocr.read_text(encoding="utf-8")
    elif source.questionnaire_kind == "combined_layout":
        text = source.theory_ocr.read_text(encoding="utf-8")
        if source.skip_to_page_two:
            text = trim_layout_cover(text)
        theory_text, practical_text = split_combined_exam(text)
    else:
        text = pdf_text(source.questionnaire)
        theory_text, practical_text = split_combined_exam(text)

    questions = parse_question_section(theory_text, "Primera parte", 70, 3)
    questions.extend(parse_question_section(practical_text, "Segunda parte", 15, 3))
    return questions


def build_inventory() -> list[dict]:
    rows = [
        {
            "convocatoria": 2023,
            "fecha_examen": "2024-11-30",
            "acceso": "Libre",
            "ejercicio": "Ejercicio único: cuestionario + supuesto",
            "modelo": "A y B",
            "preguntas": 85,
            "reservas": 6,
            "duracion_minutos": 120,
            "enlace_oficial": PROCESS_2023_URL,
            "plantilla_provisional": "Sí",
            "plantilla_definitiva": "Sí",
            "preguntas_anuladas": "Supuesto A: 7, 10 y 12; supuesto B: 3, 5 y 15",
            "observaciones": "Cuestionario y supuesto publicados en PDF separados; modelos A y B archivados.",
        },
        {
            "convocatoria": 2023,
            "fecha_examen": "2025-01-25",
            "acceso": "Libre",
            "ejercicio": "Ejercicio extraordinario",
            "modelo": "Único",
            "preguntas": 85,
            "reservas": 6,
            "duracion_minutos": 120,
            "enlace_oficial": PROCESS_2023_URL,
            "plantilla_provisional": "Sí",
            "plantilla_definitiva": "Sí",
            "preguntas_anuladas": "Ninguna en plantilla definitiva",
            "observaciones": "Incidencias de la convocatoria 2023.",
        },
        {
            "convocatoria": 2024,
            "fecha_examen": "2025-09-13",
            "acceso": "Libre",
            "ejercicio": "Ejercicio único: cuestionario + supuesto",
            "modelo": "A y B",
            "preguntas": 85,
            "reservas": 6,
            "duracion_minutos": 120,
            "enlace_oficial": PROCESS_2024_URL,
            "plantilla_provisional": "Sí",
            "plantilla_definitiva": "Sí",
            "preguntas_anuladas": "Modelo A: 62 y 65; modelo B: 39 y 42",
            "observaciones": "Modelos A y B archivados; análisis canónico sobre modelo A.",
        },
        {
            "convocatoria": 2024,
            "fecha_examen": "2025-10-26",
            "acceso": "Libre",
            "ejercicio": "Ejercicio extraordinario",
            "modelo": "Único",
            "preguntas": 85,
            "reservas": 6,
            "duracion_minutos": 120,
            "enlace_oficial": PROCESS_2024_URL,
            "plantilla_provisional": "Sí",
            "plantilla_definitiva": "Sí",
            "preguntas_anuladas": "Ninguna en plantilla definitiva",
            "observaciones": "Ejercicio extraordinario de la convocatoria 2024.",
        },
        {
            "convocatoria": 2025,
            "fecha_examen": "2026-06-28",
            "acceso": "Libre",
            "ejercicio": "Ejercicio único: cuestionario + supuesto",
            "modelo": "Rojo A/B y Verde A/B",
            "preguntas": 170,
            "reservas": 12,
            "duracion_minutos": 120,
            "enlace_oficial": PROCESS_2025_URL,
            "plantilla_provisional": "Sí",
            "plantilla_definitiva": "Sí",
            "preguntas_anuladas": (
                "Rojo A/B: teoría 29 y 43, supuesto 8. "
                "Verde A/B: teoría 29 y 39, supuesto 8."
            ),
            "observaciones": (
                "Dos cuadernillos de contenido (rojo y verde), cada uno con modelos A/B. "
                "El análisis evita duplicar A y B."
            ),
        },
        {
            "convocatoria": 2025,
            "fecha_examen": "2026-09-12",
            "acceso": "Libre",
            "ejercicio": "Ejercicio extraordinario anunciado",
            "modelo": "Pendiente",
            "preguntas": "",
            "reservas": "",
            "duracion_minutos": "",
            "enlace_oficial": PROCESS_2025_URL,
            "plantilla_provisional": "Pendiente",
            "plantilla_definitiva": "Pendiente",
            "preguntas_anuladas": "Pendiente",
            "observaciones": (
                "A fecha de corte 30-07-2026 solo consta la convocatoria del ejercicio; "
                "cuestionario y plantillas aún no existen."
            ),
        },
    ]
    return rows


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    program = json.loads(PROGRAM_PATH.read_text(encoding="utf-8"))
    themes = {item["id"]: item for item in program["temas"]}

    all_rows: list[dict] = []
    parse_audit: list[dict] = []
    for source in make_exam_sources():
        final_answers = parse_template_tables(
            source.definitive_template, source.template_table_indexes
        )
        provisional_answers = parse_template_tables(
            source.provisional_template, source.template_table_indexes
        )
        questions = parse_exam(source)
        parse_audit.append(
            {
                "key": source.key,
                "questions": len(questions),
                "expected": 91,
                "theory": sum(q["ejercicio"] == "Primera parte" for q in questions),
                "practical": sum(q["ejercicio"] == "Segunda parte" for q in questions),
                "computada_en_frecuencia": source.color != "Verde",
            }
        )
        if len(questions) != 91:
            raise ValueError(
                f"{source.key}: se esperaban 91 preguntas y se obtuvieron {len(questions)}."
            )

        for question in questions:
            key = (question["ejercicio"], question["numero"])
            question_id = (
                f"{source.key}-"
                f"{'T' if question['ejercicio'] == 'Primera parte' else 'P'}"
                f"{question['numero']:02d}"
            )
            final = final_answers.get(key, "")
            provisional = provisional_answers.get(key, "")
            if final == "ANULADA":
                result = "Anulada"
            elif provisional and final and provisional != final:
                result = "Modificada"
            else:
                result = "Válida"

            topic_id, score, confidence = classify_topic(
                question["enunciado"],
                question["ejercicio"],
                question["numero"],
                themes,
            )
            classification_method = (
                "Regla jurídica determinista" if score == 100 else "Ponderación de palabras clave"
            )
            if question_id in TOPIC_OVERRIDES:
                topic_id = TOPIC_OVERRIDES[question_id]
                score = 100
                confidence = "Alta"
                classification_method = "Revisión jurídica individual"
            theme = themes[topic_id]
            question_text = question["enunciado"]
            options = dict(question["opciones"])
            if question_id == "2025_conv2024_ordinario_A-T38":
                split = re.split(r"\s+e\)\s+", question_text, maxsplit=1)
                if len(split) == 2:
                    question_text = split[0]
                    options["a"] = split[1]
            elif question_id == "2025_conv2024_ordinario_A-P11":
                split = question_text.split("?", maxsplit=1)
                if len(split) == 2 and split[1].strip():
                    question_text = split[0].strip() + "?"
                    options["a"] = split[1].strip()
            elif question_id == "2024_conv2023_ordinario_A-T72":
                split = re.split(r"\s+C\s+Por\s+", options.get("b", ""), maxsplit=1)
                if len(split) == 2:
                    options["b"] = split[0]
                    options["c"] = "Por " + split[1]
            elif question_id == "2025_conv2023_extraordinario-T02":
                split = re.split(r"\s+d\s*\)\s*", options.get("c", ""), maxsplit=1)
                if len(split) == 2:
                    options["c"] = split[0]
                    options["d"] = split[1]
            elif question_id == "2026_conv2025_verde_A-T59":
                options["b"] = "40%."
            normalized = normalize_ascii(question_text)
            if source.color:
                model_family = "Rojo/Verde A/B"
                equivalence_note = (
                    "Los colores y modelos reproducen el mismo conjunto de preguntas "
                    "con orden y/o opciones permutados; Rojo A es la variante canónica "
                    "para frecuencias y Verde A se conserva como control de cobertura."
                )
            elif source.modelo == "A":
                model_family = "A/B"
                equivalence_note = (
                    "Modelo A usado como variante canónica; el modelo B oficial está "
                    "archivado y permuta el orden y/o las opciones."
                )
            else:
                model_family = "Único"
                equivalence_note = "Cuestionario extraordinario sin modelo paralelo."
            all_rows.append(
                {
                    "id_pregunta": question_id,
                    "año": int(source.fecha[:4]),
                    "convocatoria": source.convocatoria,
                    "fecha_examen": source.fecha,
                    "tipo_acceso": "Acceso libre",
                    "ejercicio": question["ejercicio"],
                    "modelo": source.modelo,
                    "familia_modelos": model_family,
                    "computar_en_frecuencia": "No" if source.color == "Verde" else "Sí",
                    "observacion_equivalencia": equivalence_note,
                    "numero_pregunta": question["numero"],
                    "reserva": "Sí" if question["reserva"] else "No",
                    "enunciado": question_text,
                    "opcion_a": options.get("a", ""),
                    "opcion_b": options.get("b", ""),
                    "opcion_c": options.get("c", ""),
                    "opcion_d": options.get("d", ""),
                    "tema_id": topic_id,
                    "tema_oficial": theme["numero_oficial"],
                    "bloque": theme["bloque"],
                    "titulo_tema": theme["titulo"],
                    "apartado_concreto": concept(question_text, topic_id),
                    "norma": extract_norm(question_text),
                    "articulo_precepto": extract_article(question_text),
                    "tipo_pregunta": classify_question_type(question_text, topic_id),
                    "dificultad": difficulty(question_text, question["ejercicio"]),
                    "concepto_principal": concept(question_text, topic_id),
                    "organismo_implicado": extract_organisms(question_text),
                    "plazo_cifra_porcentaje_edad": extract_numbers(question_text),
                    "contiene_excepcion": (
                        "Sí"
                        if any(
                            token in normalized
                            for token in (
                                "salvo",
                                "excepto",
                                "incorrecta",
                                "no es",
                                "unicamente",
                            )
                        )
                        else "No"
                    ),
                    "caracter": (
                        "Práctico"
                        if question["ejercicio"] == "Segunda parte"
                        else "Teórico"
                    ),
                    "respuesta_provisional": provisional,
                    "respuesta_definitiva": final,
                    "resultado_final": result,
                    "fuente_pdf": str(source.questionnaire.relative_to(ROOT)),
                    "enlace_oficial": source.portal_url,
                    "metodo_extraccion": (
                        "Texto PDF"
                        if source.questionnaire_kind == "combined_text"
                        else "OCR Windows es-ES sobre PDF oficial"
                    ),
                    "puntuacion_clasificacion": score,
                    "confianza_clasificacion": confidence,
                    "metodo_clasificacion": classification_method,
                }
            )

    red_rows = [row for row in all_rows if row["modelo"] == "Rojo A"]
    for row in all_rows:
        if row["modelo"] != "Verde A":
            row["id_pregunta_canonica"] = row["id_pregunta"]
            row["similitud_canonica"] = 1.0
            continue
        candidates = [
            candidate
            for candidate in red_rows
            if candidate["ejercicio"] == row["ejercicio"]
        ]
        best = max(
            candidates,
            key=lambda candidate: SequenceMatcher(
                None,
                normalize_ascii(row["enunciado"]),
                normalize_ascii(candidate["enunciado"]),
            ).ratio(),
        )
        similarity = SequenceMatcher(
            None,
            normalize_ascii(row["enunciado"]),
            normalize_ascii(best["enunciado"]),
        ).ratio()
        if similarity < 0.85:
            raise ValueError(
                f"No se pudo vincular con seguridad {row['id_pregunta']} "
                f"a su variante Roja (similitud {similarity:.3f})."
            )
        row["id_pregunta_canonica"] = best["id_pregunta"]
        row["similitud_canonica"] = round(similarity, 4)

    inventory = build_inventory()
    (DATA_DIR / "inventario_examenes.json").write_text(
        json.dumps(inventory, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (DATA_DIR / "preguntas_oficiales.json").write_text(
        json.dumps(all_rows, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (DATA_DIR / "auditoria_parseo.json").write_text(
        json.dumps(parse_audit, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    if all_rows:
        with (DATA_DIR / "preguntas_oficiales.csv").open(
            "w", encoding="utf-8-sig", newline=""
        ) as stream:
            writer = csv.DictWriter(stream, fieldnames=list(all_rows[0]))
            writer.writeheader()
            writer.writerows(all_rows)
    with (DATA_DIR / "inventario_examenes.csv").open(
        "w", encoding="utf-8-sig", newline=""
    ) as stream:
        writer = csv.DictWriter(stream, fieldnames=list(inventory[0]))
        writer.writeheader()
        writer.writerows(inventory)

    by_topic: dict[str, list[dict]] = defaultdict(list)
    for row in all_rows:
        if row["computar_en_frecuencia"] == "Sí":
            by_topic[row["tema_id"]].append(row)

    frequency: list[dict] = []
    for topic_id, theme in themes.items():
        rows = by_topic.get(topic_id, [])
        norms = Counter(row["norma"] for row in rows if row["norma"])
        articles = Counter(
            article.strip()
            for row in rows
            for article in row["articulo_precepto"].split(";")
            if article.strip()
        )
        types = Counter(row["tipo_pregunta"] for row in rows)
        concepts = Counter(row["concepto_principal"] for row in rows)
        years = sorted({row["año"] for row in rows})
        frequency.append(
            {
                "tema_id": topic_id,
                "bloque": theme["bloque"],
                "numero": theme["numero_oficial"],
                "titulo": theme["titulo"],
                "preguntas": len(rows),
                "años": years,
                "apartados_mas_preguntados": concepts.most_common(5),
                "normas_mas_preguntadas": norms.most_common(5),
                "articulos_mas_preguntados": articles.most_common(8),
                "tipos_mas_frecuentes": types.most_common(5),
                "reservas": sum(row["reserva"] == "Sí" for row in rows),
                "anuladas": sum(row["resultado_final"] == "Anulada" for row in rows),
                "modificadas": sum(
                    row["resultado_final"] == "Modificada" for row in rows
                ),
                "practicas": sum(row["caracter"] == "Práctico" for row in rows),
                "clasificacion_baja_confianza": sum(
                    row["confianza_clasificacion"] == "Baja" for row in rows
                ),
            }
        )
    (DATA_DIR / "mapa_frecuencia.json").write_text(
        json.dumps(frequency, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    total = len(all_rows)
    canonical_rows = [
        row for row in all_rows if row["computar_en_frecuencia"] == "Sí"
    ]
    audit = {
        "fecha_corte": "2026-07-30",
        "variantes_cuestionario_analizadas": len(make_exam_sources()),
        "sesiones_canonicas": 5,
        "preguntas_registradas": total,
        "preguntas_canonicas_para_frecuencia": len(canonical_rows),
        "variantes_paralelas_excluidas_de_frecuencia": total - len(canonical_rows),
        "teoricas": sum(row["caracter"] == "Teórico" for row in all_rows),
        "practicas": sum(row["caracter"] == "Práctico" for row in all_rows),
        "reservas": sum(row["reserva"] == "Sí" for row in all_rows),
        "anuladas": sum(row["resultado_final"] == "Anulada" for row in all_rows),
        "modificadas": sum(row["resultado_final"] == "Modificada" for row in all_rows),
        "baja_confianza": sum(
            row["confianza_clasificacion"] == "Baja" for row in all_rows
        ),
        "criterio_modelos": (
            "La base conserva A de cada familia y los dos colores A de 2026 para "
            "trazabilidad. Los modelos B oficiales se conservan en PDF como "
            "variantes de orden/opciones. Las frecuencias cuentan una sola variante "
            "por sesión y no duplican Verde 2026."
        ),
        "parseo": parse_audit,
    }
    (DATA_DIR / "resumen_analisis.json").write_text(
        json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(audit, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
