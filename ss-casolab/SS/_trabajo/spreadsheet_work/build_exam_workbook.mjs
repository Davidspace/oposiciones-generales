import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const ROOT = path.resolve("../..");
const DATA = path.join(ROOT, "_trabajo", "investigacion", "analisis_examenes");
const OUTPUT_DIR = path.join(ROOT, "08. Análisis de exámenes y preguntas");
const PREVIEW_DIR = path.join(ROOT, "_trabajo", "renders", "analisis_xlsx");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "Análisis de exámenes oficiales.xlsx");

const questions = JSON.parse(
  await fs.readFile(path.join(DATA, "preguntas_oficiales.json"), "utf8"),
);
const inventory = JSON.parse(
  await fs.readFile(path.join(DATA, "inventario_examenes.json"), "utf8"),
);
const frequency = JSON.parse(
  await fs.readFile(path.join(DATA, "mapa_frecuencia.json"), "utf8"),
);
const summary = JSON.parse(
  await fs.readFile(path.join(DATA, "resumen_analisis.json"), "utf8"),
);

await fs.mkdir(OUTPUT_DIR, { recursive: true });
await fs.mkdir(PREVIEW_DIR, { recursive: true });

const wb = Workbook.create();
const sheets = {
  resumen: wb.worksheets.add("Resumen"),
  inventario: wb.worksheets.add("Inventario"),
  preguntas: wb.worksheets.add("Preguntas oficiales"),
  frecuencia: wb.worksheets.add("Frecuencia por tema"),
  articulos: wb.worksheets.add("Artículos y cifras"),
  cambios: wb.worksheets.add("Anulaciones y cambios"),
  tendencias: wb.worksheets.add("Tendencias"),
  fuentes: wb.worksheets.add("Fuentes y límites"),
};

const COLORS = {
  navy: "#17324D",
  teal: "#0F766E",
  tealLight: "#DDF3EF",
  orange: "#E67E22",
  orangeLight: "#FCE8D5",
  blueLight: "#E8F0F8",
  gray: "#5F6B76",
  grayLight: "#F1F4F6",
  white: "#FFFFFF",
  border: "#CAD3DB",
  green: "#2E7D32",
  red: "#B42318",
};

function colLetter(n) {
  let out = "";
  let value = n;
  while (value > 0) {
    value -= 1;
    out = String.fromCharCode(65 + (value % 26)) + out;
    value = Math.floor(value / 26);
  }
  return out;
}

function tableRange(rowCount, colCount) {
  return `A1:${colLetter(colCount)}${rowCount}`;
}

function styleTitle(sheet, range, text, subtitle = null) {
  const titleRange = sheet.getRange(range);
  titleRange.merge();
  titleRange.values = [[text]];
  titleRange.format = {
    fill: COLORS.navy,
    font: { bold: true, color: COLORS.white, size: 18 },
    verticalAlignment: "center",
    horizontalAlignment: "left",
  };
  titleRange.format.rowHeight = 34;
  if (subtitle) {
    const row = Number(range.match(/\d+/)[0]) + 1;
    const endCol = range.split(":")[1].replace(/\d+/g, "");
    const sub = sheet.getRange(`A${row}:${endCol}${row}`);
    sub.merge();
    sub.values = [[subtitle]];
    sub.format = {
      fill: COLORS.tealLight,
      font: { color: COLORS.navy, italic: true, size: 10 },
      wrapText: true,
      verticalAlignment: "center",
    };
    sub.format.rowHeight = 30;
  }
}

function styleHeader(range) {
  range.format = {
    fill: COLORS.teal,
    font: { bold: true, color: COLORS.white },
    wrapText: true,
    verticalAlignment: "center",
    horizontalAlignment: "center",
    borders: { preset: "all", style: "thin", color: COLORS.border },
  };
  range.format.rowHeight = 30;
}

function styleBody(range) {
  range.format = {
    font: { color: "#1F2933", size: 9 },
    wrapText: true,
    verticalAlignment: "top",
    borders: { preset: "all", style: "thin", color: COLORS.border },
  };
}

function addTable(sheet, range, name) {
  const table = sheet.tables.add(range, true, name);
  table.style = "TableStyleMedium2";
  table.showBandedRows = true;
  table.showFilterButton = true;
  return table;
}

function writeMatrix(sheet, startRow, startCol, matrix) {
  if (!matrix.length || !matrix[0].length) return;
  sheet
    .getRangeByIndexes(startRow, startCol, matrix.length, matrix[0].length)
    .values = matrix;
}

function listText(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        Array.isArray(item) ? `${item[0]} (${item[1]})` : String(item),
      )
      .join("; ");
  }
  return value ?? "";
}

// Resumen
{
  const s = sheets.resumen;
  s.showGridLines = false;
  styleTitle(
    s,
    "A1:H1",
    "Análisis de exámenes oficiales · Administrativo de la Seguridad Social",
    "Acceso libre · fuentes oficiales · fecha de corte: 30 de julio de 2026",
  );
  s.getRange("A4:B11").values = [
    ["Indicador", "Valor"],
    ["Variantes analizadas", null],
    ["Preguntas registradas", null],
    ["Preguntas canónicas para frecuencia", null],
    ["Preguntas teóricas", null],
    ["Preguntas prácticas", null],
    ["Reservas registradas", null],
    ["Anuladas / modificadas", null],
  ];
  styleHeader(s.getRange("A4:B4"));
  styleBody(s.getRange("A5:B11"));
  const qLast = questions.length + 1;
  const qKeys = Object.keys(questions[0]);
  const qCol = Object.fromEntries(
    qKeys.map((key, index) => [key, colLetter(index + 1)]),
  );
  s.getRange("B5:B11").formulas = [
    ["=COUNTA(Inventario!A2:A7)"],
    [`=COUNTA('Preguntas oficiales'!$${qCol.id_pregunta}$2:$${qCol.id_pregunta}$${qLast})`],
    [`=COUNTIF('Preguntas oficiales'!$${qCol.computar_en_frecuencia}$2:$${qCol.computar_en_frecuencia}$${qLast},"Sí")`],
    [`=COUNTIF('Preguntas oficiales'!$${qCol.caracter}$2:$${qCol.caracter}$${qLast},"Teórico")`],
    [`=COUNTIF('Preguntas oficiales'!$${qCol.caracter}$2:$${qCol.caracter}$${qLast},"Práctico")`],
    [`=COUNTIF('Preguntas oficiales'!$${qCol.reserva}$2:$${qCol.reserva}$${qLast},"Sí")`],
    [`=COUNTIF('Preguntas oficiales'!$${qCol.resultado_final}$2:$${qCol.resultado_final}$${qLast},"Anulada")+COUNTIF('Preguntas oficiales'!$${qCol.resultado_final}$2:$${qCol.resultado_final}$${qLast},"Modificada")`],
  ];
  s.getRange("B5:B11").format.numberFormat = "0";
  s.getRange("D4:H4").merge();
  s.getRange("D4:H4").values = [["Criterio de lectura"]];
  styleHeader(s.getRange("D4:H4"));
  s.getRange("D5:H9").merge();
  s.getRange("D5:H9").values = [[
    "La base conserva las variantes oficiales seleccionadas para trazabilidad. " +
      "Las frecuencias usan una sola variante por sesión: Verde 2026 queda " +
      "registrado, pero no duplica el conjunto equivalente Rojo 2026. Los " +
      "modelos B permanecen archivados en PDF como permutaciones de orden y/o opciones.",
  ]];
  s.getRange("D5:H9").format = {
    fill: COLORS.blueLight,
    font: { color: COLORS.navy, size: 11 },
    wrapText: true,
    verticalAlignment: "center",
    borders: { preset: "all", style: "thin", color: COLORS.border },
  };
  s.getRange("A13:H13").merge();
  s.getRange("A13:H13").values = [[
    "© 2026 ACADEMIA LORMAN · Uso personal del alumnado. Verificar siempre la norma consolidada vigente.",
  ]];
  s.getRange("A13:H13").format = {
    fill: COLORS.grayLight,
    font: { bold: true, color: COLORS.gray, size: 9 },
    horizontalAlignment: "center",
  };
  s.getRange("A1:H15").format.columnWidth = 16;
  s.getRange("A:A").format.columnWidth = 34;
  s.getRange("D:H").format.columnWidth = 18;
  s.freezePanes.freezeRows(3);
}

// Inventario
{
  const s = sheets.inventario;
  s.showGridLines = false;
  const headers = Object.keys(inventory[0]);
  const rows = inventory.map((item) =>
    headers.map((key) => {
      if (key === "fecha_examen" && item[key]) {
        const [y, m, d] = item[key].split("-").map(Number);
        return new Date(Date.UTC(y, m - 1, d));
      }
      return item[key] ?? "";
    }),
  );
  writeMatrix(s, 0, 0, [headers, ...rows]);
  styleHeader(s.getRange(`A1:${colLetter(headers.length)}1`));
  styleBody(s.getRange(`A2:${colLetter(headers.length)}${rows.length + 1}`));
  addTable(s, tableRange(rows.length + 1, headers.length), "InventarioExamenes");
  const dateCol = headers.indexOf("fecha_examen") + 1;
  s.getRange(
    `${colLetter(dateCol)}2:${colLetter(dateCol)}${rows.length + 1}`,
  ).format.numberFormat = "dd/mm/yyyy";
  s.getUsedRange().format.autofitColumns();
  s.getRange("A:A").format.columnWidth = 14;
  s.getRange("B:B").format.columnWidth = 13;
  s.getRange("D:F").format.columnWidth = 24;
  s.getRange(`${colLetter(headers.length)}:${colLetter(headers.length)}`).format.columnWidth = 56;
  s.freezePanes.freezeRows(1);
}

// Preguntas oficiales
let questionColumns;
{
  const s = sheets.preguntas;
  s.showGridLines = false;
  questionColumns = Object.keys(questions[0]);
  const rows = questions.map((item) =>
    questionColumns.map((key) => {
      if (key === "fecha_examen") {
        const [y, m, d] = item[key].split("-").map(Number);
        return new Date(Date.UTC(y, m - 1, d));
      }
      return item[key] ?? "";
    }),
  );
  writeMatrix(s, 0, 0, [questionColumns, ...rows]);
  const endCol = colLetter(questionColumns.length);
  styleHeader(s.getRange(`A1:${endCol}1`));
  styleBody(s.getRange(`A2:${endCol}${rows.length + 1}`));
  addTable(
    s,
    tableRange(rows.length + 1, questionColumns.length),
    "PreguntasOficiales",
  );
  const dateCol = questionColumns.indexOf("fecha_examen") + 1;
  s.getRange(
    `${colLetter(dateCol)}2:${colLetter(dateCol)}${rows.length + 1}`,
  ).format.numberFormat = "dd/mm/yyyy";
  const textKeys = [
    "enunciado",
    "opcion_a",
    "opcion_b",
    "opcion_c",
    "opcion_d",
    "titulo_tema",
    "observacion_equivalencia",
  ];
  for (const key of textKeys) {
    const c = colLetter(questionColumns.indexOf(key) + 1);
    s.getRange(`${c}:${c}`).format.columnWidth = key === "enunciado" ? 58 : 38;
  }
  for (const key of [
    "id_pregunta",
    "id_pregunta_canonica",
    "fuente_pdf",
    "enlace_oficial",
  ]) {
    const c = colLetter(questionColumns.indexOf(key) + 1);
    s.getRange(`${c}:${c}`).format.columnWidth = 34;
  }
  s.getRange("A:Z").format.rowHeight = 38;
  s.freezePanes.freezeRows(1);
  s.freezePanes.freezeColumns(2);
}

// Frecuencia por tema (métricas calculadas sobre la base canónica)
{
  const s = sheets.frecuencia;
  s.showGridLines = false;
  const headers = [
    "Tema ID",
    "Bloque",
    "N.º oficial",
    "Título oficial",
    "Preguntas canónicas",
    "2024",
    "2025",
    "2026",
    "Prácticas",
    "Reservas",
    "Anuladas",
    "Modificadas",
    "Normas más citadas",
    "Artículos más citados",
    "Conceptos más frecuentes",
  ];
  const baseRows = frequency.map((item) => [
    item.tema_id,
    item.bloque,
    item.numero,
    item.titulo,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    listText(item.normas_mas_preguntadas),
    listText(item.articulos_mas_preguntados),
    listText(item.apartados_mas_preguntados),
  ]);
  writeMatrix(s, 0, 0, [headers, ...baseRows]);
  const qCol = Object.fromEntries(
    questionColumns.map((key, index) => [key, colLetter(index + 1)]),
  );
  const qLast = questions.length + 1;
  const formulas = frequency.map((_, index) => {
    const row = index + 2;
    const base = `'Preguntas oficiales'!`;
    const tema = `${base}$${qCol.tema_id}$2:$${qCol.tema_id}$${qLast}`;
    const canonical = `${base}$${qCol.computar_en_frecuencia}$2:$${qCol.computar_en_frecuencia}$${qLast}`;
    const year = `${base}$${qCol.año}$2:$${qCol.año}$${qLast}`;
    const character = `${base}$${qCol.caracter}$2:$${qCol.caracter}$${qLast}`;
    const reserve = `${base}$${qCol.reserva}$2:$${qCol.reserva}$${qLast}`;
    const result = `${base}$${qCol.resultado_final}$2:$${qCol.resultado_final}$${qLast}`;
    return [
      `=COUNTIFS(${tema},A${row},${canonical},"Sí")`,
      `=COUNTIFS(${tema},A${row},${canonical},"Sí",${year},2024)`,
      `=COUNTIFS(${tema},A${row},${canonical},"Sí",${year},2025)`,
      `=COUNTIFS(${tema},A${row},${canonical},"Sí",${year},2026)`,
      `=COUNTIFS(${tema},A${row},${canonical},"Sí",${character},"Práctico")`,
      `=COUNTIFS(${tema},A${row},${canonical},"Sí",${reserve},"Sí")`,
      `=COUNTIFS(${tema},A${row},${canonical},"Sí",${result},"Anulada")`,
      `=COUNTIFS(${tema},A${row},${canonical},"Sí",${result},"Modificada")`,
    ];
  });
  s.getRange(`E2:L${frequency.length + 1}`).formulas = formulas;
  styleHeader(s.getRange("A1:O1"));
  styleBody(s.getRange(`A2:O${frequency.length + 1}`));
  addTable(
    s,
    `A1:O${frequency.length + 1}`,
    "FrecuenciaTemas",
  );
  s.getRange(`E2:E${frequency.length + 1}`).conditionalFormats.add(
    "dataBar",
    { color: COLORS.teal, gradient: true },
  );
  s.getRange("A:C").format.columnWidth = 14;
  s.getRange("D:D").format.columnWidth = 58;
  s.getRange("E:L").format.columnWidth = 12;
  s.getRange("M:O").format.columnWidth = 38;
  s.freezePanes.freezeRows(1);
  s.freezePanes.freezeColumns(4);
}

// Artículos, plazos, cifras y edades
{
  const s = sheets.articulos;
  s.showGridLines = false;
  const selected = questions.filter(
    (q) =>
      q.computar_en_frecuencia === "Sí" &&
      (q.articulo_precepto || q.plazo_cifra_porcentaje_edad),
  );
  const headers = [
    "ID",
    "Año",
    "Tema",
    "Norma",
    "Artículo / precepto",
    "Plazo, cifra, porcentaje o edad",
    "Tipo",
    "Enunciado",
    "Respuesta definitiva",
    "Resultado",
  ];
  const rows = selected.map((q) => [
    q.id_pregunta,
    q.año,
    q.tema_id,
    q.norma,
    q.articulo_precepto,
    q.plazo_cifra_porcentaje_edad,
    q.tipo_pregunta,
    q.enunciado,
    q.respuesta_definitiva,
    q.resultado_final,
  ]);
  writeMatrix(s, 0, 0, [headers, ...rows]);
  styleHeader(s.getRange("A1:J1"));
  styleBody(s.getRange(`A2:J${rows.length + 1}`));
  addTable(s, `A1:J${rows.length + 1}`, "ArticulosPlazos");
  s.getRange("A:A").format.columnWidth = 34;
  s.getRange("D:G").format.columnWidth = 25;
  s.getRange("H:H").format.columnWidth = 62;
  s.freezePanes.freezeRows(1);
}

// Anulaciones y cambios de plantilla
{
  const s = sheets.cambios;
  s.showGridLines = false;
  const selected = questions.filter(
    (q) => q.resultado_final !== "Válida",
  );
  const headers = [
    "ID",
    "Fecha",
    "Modelo",
    "Parte",
    "N.º",
    "Tema",
    "Enunciado",
    "Provisional",
    "Definitiva",
    "Resultado",
    "Fuente",
  ];
  const rows = selected.map((q) => {
    const [y, m, d] = q.fecha_examen.split("-").map(Number);
    return [
      q.id_pregunta,
      new Date(Date.UTC(y, m - 1, d)),
      q.modelo,
      q.ejercicio,
      q.numero_pregunta,
      q.tema_id,
      q.enunciado,
      q.respuesta_provisional,
      q.respuesta_definitiva,
      q.resultado_final,
      q.fuente_pdf,
    ];
  });
  writeMatrix(s, 0, 0, [headers, ...rows]);
  styleHeader(s.getRange("A1:K1"));
  styleBody(s.getRange(`A2:K${rows.length + 1}`));
  addTable(s, `A1:K${rows.length + 1}`, "CambiosPlantilla");
  s.getRange(`B2:B${rows.length + 1}`).format.numberFormat = "dd/mm/yyyy";
  s.getRange("A:A").format.columnWidth = 34;
  s.getRange("G:G").format.columnWidth = 62;
  s.getRange("K:K").format.columnWidth = 44;
  s.getRange(`J2:J${rows.length + 1}`).conditionalFormats.add(
    "containsText",
    { text: "Anulada", format: { fill: "#FDE2E1", font: { color: COLORS.red, bold: true } } },
  );
  s.freezePanes.freezeRows(1);
}

// Tendencias
{
  const s = sheets.tendencias;
  s.showGridLines = false;
  styleTitle(
    s,
    "A1:H1",
    "Tendencias observadas en preguntas canónicas",
    "La frecuencia describe el corpus oficial disponible; no es una predicción de examen.",
  );
  const sorted = [...frequency]
    .sort((a, b) => b.preguntas - a.preguntas)
    .slice(0, 15);
  s.getRange("A4:D19").values = [
    ["Tema", "Preguntas", "Prácticas", "Reservas"],
    ...sorted.map((item) => [
      item.tema_id,
      item.preguntas,
      item.practicas,
      item.reservas,
    ]),
  ];
  styleHeader(s.getRange("A4:D4"));
  styleBody(s.getRange("A5:D19"));
  const chart = s.charts.add("bar", s.getRange("A4:B19"));
  chart.title = "15 temas con mayor presencia";
  chart.hasLegend = false;
  chart.xAxis = { axisType: "textAxis", textStyle: { fontSize: 9 } };
  chart.yAxis = { numberFormatCode: "0" };
  chart.setPosition("F4", "N20");
  s.getRange("A22:N22").merge();
  s.getRange("A22:N22").values = [[
    "Lectura recomendada: combine frecuencia, dificultad, anulaciones y peso práctico. Un tema poco frecuente puede ser decisivo.",
  ]];
  s.getRange("A22:N22").format = {
    fill: COLORS.orangeLight,
    font: { bold: true, color: COLORS.navy },
    wrapText: true,
  };
  s.getRange("A22:N22").format.rowHeight = 28;
  s.getRange("A:D").format.columnWidth = 16;
  s.freezePanes.freezeRows(3);
}

// Fuentes y límites metodológicos
{
  const s = sheets.fuentes;
  s.showGridLines = false;
  styleTitle(
    s,
    "A1:F1",
    "Fuentes oficiales, alcance y límites",
    "Documento de trabajo trazable; no sustituye la lectura de BOE y textos consolidados.",
  );
  const rows = [
    ["Fecha de corte", "30/07/2026"],
    ["Convocatoria vigente", "Resolución de 22/12/2025, BOE-A-2025-27158; corrección BOE-A-2026-5351."],
    ["Portal oficial 2025", "https://www.seg-social.es/wps/portal/wss/internet/InformacionUtil/9950/88beb45d-ca83-4bab-8162-f94ef2894562/e0c83707-3358-47a9-94d7-508221dad233"],
    ["Portal histórico 2024", "https://www.seg-social.es/wps/portal/wss/internet/InformacionUtil/9950/88beb45d-ca83-4bab-8162-f94ef2894562/7e46efac-32c8-4cf6-b3d3-d592c3560dff/rdpi_administrativos_2024"],
    ["Cobertura", "Convocatorias 2023, 2024 y 2025: sesiones ordinarias y extraordinarias publicadas a la fecha de corte."],
    ["Unidad de frecuencia", "Una variante canónica por sesión. Verde 2026 se conserva en la base, pero no se vuelve a contar."],
    ["Modelos B", "Archivados en PDF oficial. Son variantes por permutación; el análisis por tema usa la variante A canónica."],
    ["Extracción", "Texto PDF cuando existía capa textual; OCR Windows es-ES en cuestionarios escaneados. Todas las sesiones se validaron a 91 registros (73+18)."],
    ["Clasificación", "Reglas jurídicas por norma, artículo y concepto, con revisión individual de casos ambiguos. La columna método documenta el criterio."],
    ["Respuestas", "Se conservan plantilla provisional y definitiva, así como anulaciones y cambios."],
    ["Pendiente futuro", "Ejercicio extraordinario anunciado para 12/09/2026: no existe cuestionario a 30/07/2026 y no se inventa contenido."],
    ["Advertencia", "Las cifras de frecuencia describen el corpus disponible y no garantizan la distribución de una convocatoria futura."],
    ["Copyright", "© 2026 ACADEMIA LORMAN. Uso personal del alumnado."],
  ];
  s.getRange(`A4:B${rows.length + 4}`).values = [
    ["Campo", "Detalle"],
    ...rows,
  ];
  styleHeader(s.getRange("A4:B4"));
  styleBody(s.getRange(`A5:B${rows.length + 4}`));
  s.getRange("A:A").format.columnWidth = 26;
  s.getRange("B:B").format.columnWidth = 100;
  s.freezePanes.freezeRows(4);
}

// Auditoría programática: fórmulas sin errores e inspecciones compactas.
const errorTokens = ["#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#N/A"];
const formulaErrors = [];
for (const sheet of Object.values(sheets)) {
  const used = sheet.getUsedRange();
  const values = used?.values ?? [];
  for (let r = 0; r < values.length; r += 1) {
    for (let c = 0; c < (values[r]?.length ?? 0); c += 1) {
      const value = values[r][c];
      if (
        typeof value === "string" &&
        errorTokens.some((token) => value.includes(token))
      ) {
        formulaErrors.push(`${sheet.name}!${colLetter(c + 1)}${r + 1}=${value}`);
      }
    }
  }
}
if (formulaErrors.length) {
  throw new Error(`Errores de fórmula: ${formulaErrors.join("; ")}`);
}

const inspectLog = [];
for (const [name, range] of [
  ["Resumen", "A1:H13"],
  ["Inventario", "A1:L7"],
  ["Preguntas oficiales", "A1:P8"],
  ["Frecuencia por tema", "A1:O12"],
  ["Artículos y cifras", "A1:J10"],
  ["Anulaciones y cambios", "A1:K15"],
  ["Tendencias", "A1:N22"],
  ["Fuentes y límites", "A1:F17"],
]) {
  const inspected = await wb.inspect({
    kind: "region",
    sheetId: name,
    range,
    maxChars: 2500,
  });
  inspectLog.push(`## ${name}\n${inspected.ndjson ?? String(inspected)}`);
}
await fs.writeFile(
  path.join(PREVIEW_DIR, "inspeccion.txt"),
  inspectLog.join("\n\n"),
  "utf8",
);

const previewRanges = {
  Resumen: "A1:H13",
  Inventario: "A1:L7",
  "Preguntas oficiales": "A1:P18",
  "Frecuencia por tema": "A1:O20",
  "Artículos y cifras": "A1:J18",
  "Anulaciones y cambios": "A1:K16",
  Tendencias: "A1:N22",
  "Fuentes y límites": "A1:F17",
};
for (const [sheetName, range] of Object.entries(previewRanges)) {
  const blob = await wb.render({
    sheetName,
    range,
    format: "png",
    scale: 1,
    headers: true,
  });
  const safe = sheetName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
  await fs.writeFile(
    path.join(PREVIEW_DIR, `${safe}.png`),
    new Uint8Array(await blob.arrayBuffer()),
  );
}

const exported = await SpreadsheetFile.exportXlsx(wb);
await exported.save(OUTPUT_FILE);

console.log(
  JSON.stringify(
    {
      output: OUTPUT_FILE,
      sheets: Object.keys(previewRanges),
      rows_questions: questions.length,
      rows_frequency: frequency.length,
      rows_articles: questions.filter(
        (q) =>
          q.computar_en_frecuencia === "Sí" &&
          (q.articulo_precepto || q.plazo_cifra_porcentaje_edad),
      ).length,
      formula_errors: formulaErrors.length,
      previews: PREVIEW_DIR,
      summary,
    },
    null,
    2,
  ),
);
