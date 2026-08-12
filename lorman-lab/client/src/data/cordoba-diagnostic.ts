export type CordobaBlock =
  | "Marco constitucional y general"
  | "Ayuntamiento de Córdoba"
  | "Gestión administrativa local"
  | "Administración digital y datos"
  | "Ofimática"
  | "Aplicación práctica";

export type CordobaQuestion = {
  id: string;
  topic: number;
  block: CordobaBlock;
  kind: "teorica" | "aplicada" | "microcaso";
  stem: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  source: { label: string; href: string; locator: string };
  caseText?: string;
};

const CE = "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229";
const EAA = "https://www.boe.es/buscar/act.php?id=BOE-A-2007-5825";
const LBRL = "https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392";
const LPRL = "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292";
const IGUALDAD = "https://www.boe.es/buscar/act.php?id=BOE-A-2007-6115";
const ROM = "https://www.cordoba.es/sites/default/files/PDF/Ayuntamiento/Reglamentos%20Org%C3%A1nicos/2025/BOP-A-2025-1985.pdf";
const TREBEP = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719";
const TRLRHL = "https://www.boe.es/buscar/act.php?id=BOE-A-2004-4214";
const LPAC = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10565";
const LRJSP = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10566";
const RGPD = "https://eur-lex.europa.eu/eli/reg/2016/679/oj";
const LIBREOFFICE = "https://help.libreoffice.org/latest/es/text/shared/main0100.html";
const GMAIL = "https://support.google.com/mail/?hl=es";

export const CORDOBA_DIAGNOSTIC: CordobaQuestion[] = [
  {
    id: "COR-D01", topic: 1, block: "Marco constitucional y general", kind: "teorica",
    stem: "¿En quién reside la soberanía nacional según la Constitución?",
    options: ["En las Cortes Generales", "En el pueblo español", "En el Gobierno", "En la Corona"],
    correctIndex: 1,
    explanation: "La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado.",
    source: { label: "Constitución Española", href: CE, locator: "art. 1.2" },
  },
  {
    id: "COR-D02", topic: 2, block: "Marco constitucional y general", kind: "teorica",
    stem: "¿Cómo se constituye Andalucía según su Estatuto de Autonomía?",
    options: ["Como región administrativa descentralizada", "Como nacionalidad histórica y Comunidad Autónoma", "Como comunidad foral", "Como entidad local supramunicipal"],
    correctIndex: 1,
    explanation: "Andalucía, como nacionalidad histórica, se constituye en Comunidad Autónoma dentro de la unidad de la nación española.",
    source: { label: "Estatuto de Autonomía para Andalucía", href: EAA, locator: "art. 1.1" },
  },
  {
    id: "COR-D03", topic: 3, block: "Marco constitucional y general", kind: "teorica",
    stem: "¿Cuáles son los elementos del municipio?",
    options: ["Territorio, población y organización", "Padrón, presupuesto y alcaldía", "Provincia, comarca y distrito", "Pleno, junta de gobierno y concejalías"],
    correctIndex: 0,
    explanation: "La Ley de Bases del Régimen Local identifica el territorio, la población y la organización.",
    source: { label: "Ley 7/1985, de Bases del Régimen Local", href: LBRL, locator: "art. 11.2" },
  },
  {
    id: "COR-D04", topic: 4, block: "Marco constitucional y general", kind: "teorica",
    stem: "¿Qué derecho reconoce la Ley de Prevención de Riesgos Laborales a las personas trabajadoras?",
    options: ["Una compensación automática por todo riesgo", "Una protección eficaz en materia de seguridad y salud", "Elegir unilateralmente el sistema preventivo", "Negarse a cualquier cambio organizativo"],
    correctIndex: 1,
    explanation: "La ley reconoce el derecho a una protección eficaz y el correlativo deber empresarial de protección.",
    source: { label: "Ley 31/1995, de Prevención de Riesgos Laborales", href: LPRL, locator: "arts. 14.1 y 14.2" },
  },
  {
    id: "COR-D05", topic: 5, block: "Marco constitucional y general", kind: "teorica",
    stem: "¿Cómo debe integrarse el principio de igualdad de trato entre mujeres y hombres en la actuación de los poderes públicos?",
    options: ["Solo en políticas laborales", "De forma transversal", "Únicamente mediante cuotas", "Solo cuando exista denuncia previa"],
    correctIndex: 1,
    explanation: "La transversalidad exige integrar activamente la igualdad en disposiciones y políticas públicas.",
    source: { label: "Ley Orgánica 3/2007", href: IGUALDAD, locator: "art. 15" },
  },
  {
    id: "COR-D06", topic: 6, block: "Ayuntamiento de Córdoba", kind: "teorica",
    stem: "Según el ROM de Córdoba de 2025, ¿qué órgano colabora colegiadamente en la dirección política y ejerce funciones ejecutivas y administrativas?",
    options: ["La Junta de Gobierno Local", "La Secretaría General del Pleno", "El Consejo Social de la Ciudad", "La Asesoría Jurídica"],
    correctIndex: 0,
    explanation: "Es la Junta de Gobierno Local, presidida por la persona titular de la Alcaldía.",
    source: { label: "Reglamento Orgánico Municipal de Córdoba de 2025", href: ROM, locator: "art. 147" },
  },
  {
    id: "COR-D07", topic: 7, block: "Ayuntamiento de Córdoba", kind: "teorica",
    stem: "¿Cómo se organiza funcionalmente el Ayuntamiento de Córdoba?",
    options: ["Solo en distritos", "En áreas de gobierno y órganos de gestión territorial integrados en los distritos", "En ministerios y delegaciones provinciales", "Exclusivamente en organismos autónomos"],
    correctIndex: 1,
    explanation: "El ROM combina áreas de gobierno con órganos de gestión territorial integrada en los distritos.",
    source: { label: "Reglamento Orgánico Municipal de Córdoba de 2025", href: ROM, locator: "art. 135" },
  },
  {
    id: "COR-D08", topic: 8, block: "Ayuntamiento de Córdoba", kind: "teorica",
    stem: "¿Qué tres vertientes comprende el control atribuido a la Intervención General Municipal?",
    options: ["Inspección, sanción y recaudación", "Función interventora, control financiero y control de eficacia", "Auditoría externa, tesorería y contabilidad", "Presupuesto, contratación y personal"],
    correctIndex: 1,
    explanation: "El ROM distingue función interventora, control financiero y control de eficacia.",
    source: { label: "Reglamento Orgánico Municipal de Córdoba de 2025", href: ROM, locator: "art. 177.1" },
  },
  {
    id: "COR-D09", topic: 9, block: "Gestión administrativa local", kind: "teorica",
    stem: "¿Cuál de estas categorías figura entre las clases de empleados públicos del TREBEP?",
    options: ["Personal funcionario de carrera", "Contratista de servicios", "Becario externo", "Cargo electo municipal"],
    correctIndex: 0,
    explanation: "El TREBEP incluye funcionarios de carrera, interinos, personal laboral y personal eventual.",
    source: { label: "Texto refundido del Estatuto Básico del Empleado Público", href: TREBEP, locator: "art. 8.2" },
  },
  {
    id: "COR-D10", topic: 10, block: "Gestión administrativa local", kind: "teorica",
    stem: "¿Qué clases de personal contempla la LBRL al servicio de las entidades locales?",
    options: ["Funcionariado de carrera, personal laboral y personal eventual", "Solo funcionarios de carrera", "Funcionarios y contratistas", "Personal estatal cedido y cargos electos"],
    correctIndex: 0,
    explanation: "La LBRL distingue funcionarios de carrera, personal laboral y personal eventual.",
    source: { label: "Ley 7/1985, de Bases del Régimen Local", href: LBRL, locator: "art. 89" },
  },
  {
    id: "COR-D11", topic: 11, block: "Gestión administrativa local", kind: "teorica",
    stem: "¿Cuál de estos conceptos es un tributo local?",
    options: ["El precio público", "La subvención", "La contribución especial", "La multa"],
    correctIndex: 2,
    explanation: "Los tributos locales comprenden tasas, contribuciones especiales e impuestos; el precio público no es un tributo.",
    source: { label: "Texto refundido de la Ley Reguladora de las Haciendas Locales", href: TRLRHL, locator: "arts. 2.1.b y 2.2" },
  },
  {
    id: "COR-D12", topic: 12, block: "Gestión administrativa local", kind: "teorica",
    stem: "¿Qué constituye el presupuesto general de una entidad local?",
    options: ["Una previsión informal de tesorería", "La expresión cifrada, conjunta y sistemática de obligaciones y derechos en los términos legales", "Solo el estado de gastos del ayuntamiento", "El inventario de bienes municipales"],
    correctIndex: 1,
    explanation: "El presupuesto general expresa de forma cifrada, conjunta y sistemática las obligaciones máximas y los derechos que se prevé liquidar.",
    source: { label: "Texto refundido de la Ley Reguladora de las Haciendas Locales", href: TRLRHL, locator: "art. 162" },
  },
  {
    id: "COR-D13", topic: 13, block: "Gestión administrativa local", kind: "teorica",
    stem: "¿Quién puede tener la condición de interesado en un procedimiento administrativo?",
    options: ["Solo quien lo inicia", "Quien lo promueve como titular de derechos o intereses legítimos y quienes puedan resultar afectados en los términos legales", "Cualquier persona que conozca el expediente", "Solo las administraciones públicas"],
    correctIndex: 1,
    explanation: "La LPAC incluye a promotores con derechos o intereses legítimos y a otras personas afectadas en los términos de su artículo 4.",
    source: { label: "Ley 39/2015, del Procedimiento Administrativo Común", href: LPAC, locator: "art. 4" },
  },
  {
    id: "COR-D14", topic: 14, block: "Gestión administrativa local", kind: "teorica",
    stem: "¿Cómo puede iniciarse un procedimiento administrativo?",
    options: ["Solo de oficio", "Solo a solicitud de la persona interesada", "De oficio o a solicitud de la persona interesada", "Únicamente por orden judicial"],
    correctIndex: 2,
    explanation: "La LPAC contempla la iniciación de oficio y a solicitud de persona interesada.",
    source: { label: "Ley 39/2015, del Procedimiento Administrativo Común", href: LPAC, locator: "art. 54" },
  },
  {
    id: "COR-D15", topic: 15, block: "Gestión administrativa local", kind: "teorica",
    stem: "¿Qué órgano aprueba inicialmente una ordenanza municipal?",
    options: ["La Alcaldía", "El Pleno", "La Junta de Gobierno en todo caso", "La Intervención"],
    correctIndex: 1,
    explanation: "La aprobación inicial de ordenanzas y reglamentos corresponde al Pleno.",
    source: { label: "Ley 7/1985 y ROM Córdoba 2025", href: LBRL, locator: "LBRL, arts. 22.2.d y 49.a; ROM, art. 214.1" },
  },
  {
    id: "COR-D16", topic: 16, block: "Administración digital y datos", kind: "aplicada",
    stem: "Una persona física no obligada quiere presentar electrónicamente una solicitud y necesita ayuda. ¿Qué respuesta es correcta?",
    options: ["Debe contratar asesoría privada", "La oficina de asistencia puede ayudarla y, con consentimiento, identificarla o firmar mediante personal habilitado en los términos legales", "Solo puede presentar en papel", "La Administración puede rechazarla por falta de conocimientos"],
    correctIndex: 1,
    explanation: "La asistencia comprende ayuda y, cuando proceda, identificación o firma por personal habilitado con consentimiento expreso.",
    source: { label: "Ley 39/2015, del Procedimiento Administrativo Común", href: LPAC, locator: "arts. 12.2 y 12.3" },
  },
  {
    id: "COR-D17", topic: 17, block: "Administración digital y datos", kind: "aplicada",
    stem: "Una web municipal muestra información, pero no identifica claramente su titular ni asegura autenticidad e integridad. ¿Puede considerarse sin más sede electrónica?",
    options: ["Sí, cualquier web pública es sede", "No; la sede exige titularidad y garantías específicas", "Sí, si contiene un logotipo", "Solo depende del número de visitas"],
    correctIndex: 1,
    explanation: "La sede no es cualquier página: exige titularidad pública y garantías específicas de identificación, integridad, veracidad y actualización.",
    source: { label: "Ley 40/2015, de Régimen Jurídico del Sector Público", href: LRJSP, locator: "art. 38" },
  },
  {
    id: "COR-D18", topic: 18, block: "Administración digital y datos", kind: "aplicada",
    stem: "Un formulario municipal pide datos de salud sin relación con el trámite. ¿Qué principio se vulnera de forma más directa?",
    options: ["Minimización de datos", "Portabilidad", "Publicidad activa", "Libertad de expresión"],
    correctIndex: 0,
    explanation: "Solicitar datos innecesarios para la finalidad del trámite vulnera el principio de minimización.",
    source: { label: "Reglamento General de Protección de Datos", href: RGPD, locator: "art. 5.1.c" },
  },
  {
    id: "COR-D19", topic: 19, block: "Ofimática", kind: "aplicada",
    stem: "Se quiere representar gráficamente una tabla de importes por mes. ¿Cuál es el flujo adecuado en LibreOffice Calc?",
    options: ["Seleccionar los datos e insertar un gráfico", "Convertir cada celda en comentario", "Guardar como texto antes de calcular", "Usar únicamente Writer"],
    correctIndex: 0,
    explanation: "El asistente de gráficos parte del rango seleccionado y permite elegir tipo, series y elementos del gráfico.",
    source: { label: "Ayuda oficial de LibreOffice", href: LIBREOFFICE, locator: "Calc, gráficos" },
  },
  {
    id: "COR-D20", topic: 20, block: "Ofimática", kind: "aplicada",
    stem: "Debes localizar en Gmail los correos de una persona concreta. ¿Qué operador de búsqueda es el más directo?",
    options: ["from:direccion@ejemplo.es", "size:0", "is:read", "has:nouserlabels"],
    correctIndex: 0,
    explanation: "El operador `from:` filtra los mensajes por remitente.",
    source: { label: "Ayuda oficial de Gmail", href: GMAIL, locator: "operadores de búsqueda" },
  },
  {
    id: "COR-D21", topic: 14, block: "Aplicación práctica", kind: "microcaso",
    caseText: "Una asociación vecinal presenta una solicitud para usar un espacio municipal. La unidad instructora detecta que falta un documento preceptivo y concede diez días para subsanar. Antes de que termine ese plazo, la asociación comunica expresamente que no desea continuar con la solicitud.",
    stem: "¿Qué actuación encaja mejor con la Ley 39/2015?",
    options: ["Declarar la caducidad automáticamente", "Tener por desistida a la asociación y declarar concluso el procedimiento, salvo que proceda continuarlo en los casos legales", "Imponer una sanción por no aportar el documento", "Resolver sobre el fondo como si la solicitud estuviera completa"],
    correctIndex: 1,
    explanation: "La comunicación expresa es un desistimiento. La Administración debe aceptarlo de plano y declarar concluso el procedimiento, con las salvedades del artículo 94.",
    source: { label: "Ley 39/2015, del Procedimiento Administrativo Común", href: LPAC, locator: "arts. 68, 84 y 94" },
  },
];

export const THEORY_COUNT = CORDOBA_DIAGNOSTIC.filter((item) => item.kind === "teorica").length;
export const APPLIED_COUNT = CORDOBA_DIAGNOSTIC.filter((item) => item.kind === "aplicada").length;
export const MICROCASE_COUNT = CORDOBA_DIAGNOSTIC.filter((item) => item.kind === "microcaso").length;
