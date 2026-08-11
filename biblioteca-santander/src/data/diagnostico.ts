export type EjercicioMini = "teorico" | "practico";
export type CasoMini = "catalogo" | "referencia";
export type BloqueMini =
  | "Convocatoria y parte general"
  | "Bibliotecas y servicios"
  | "Red de Santander y colecciones"
  | "Entrenamiento práctico";

export type PreguntaMini = {
  id: string;
  ejercicio: EjercicioMini;
  bloque: BloqueMini;
  tema: string;
  caso?: CasoMini;
  reserva?: boolean;
  enunciado: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
  fuente: { etiqueta: string; href: string };
};

export const CASOS_PRACTICOS: Record<CasoMini, { titulo: string; texto: string }> = {
  catalogo: {
    titulo: "Caso práctico · búsqueda en catálogo",
    texto:
      "Una persona solicita una novela de una autora conocida, pero no recuerda el título exacto. En el catálogo aparecen varias ediciones y una adaptación audiovisual. El ejercicio consiste en ordenar la búsqueda, comprobar la identidad de la obra y elegir el registro que responde a la petición.",
  },
  referencia: {
    titulo: "Caso práctico · obra de referencia",
    texto:
      "En el mostrador se pide una fecha, una definición y una fuente que pueda consultarse de forma verificable. Hay varias respuestas en Internet, pero solo una obra de referencia permite comprobar el dato y explicar de dónde sale.",
  },
};

const BOC = "https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=432055";
const CE = "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229";
const LPAC = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10565";

const source = (etiqueta: string, href: string) => ({ etiqueta, href });
const bases = source("Bases oficiales del Ayuntamiento de Santander", BOC);

export const PREGUNTAS_MINI: PreguntaMini[] = [
  {
    id: "teo-ejercicio-practico",
    ejercicio: "teorico",
    bloque: "Convocatoria y parte general",
    tema: "Bases",
    enunciado: "Según las bases, ¿cómo es el primer ejercicio de la oposición?",
    opciones: [
      "Cuatro supuestos prácticos en un máximo de dos horas",
      "Un tema escrito desarrollado en cuatro horas",
      "Una entrevista personal y una exposición oral",
      "Un test de 100 preguntas en treinta minutos",
    ],
    correcta: 0,
    explicacion: "El primer ejercicio es eliminatorio y consiste en resolver cuatro supuestos prácticos en un tiempo máximo de dos horas.",
    fuente: bases,
  },
  {
    id: "teo-ejercicio-test",
    ejercicio: "teorico",
    bloque: "Convocatoria y parte general",
    tema: "Bases",
    enunciado: "¿Qué formato tiene el segundo ejercicio?",
    opciones: [
      "50 preguntas tipo test en 50 minutos, más cinco de reserva",
      "40 preguntas tipo test en dos horas, sin reservas",
      "Un supuesto práctico de biblioteca en 50 minutos",
      "Una prueba oral sobre los 20 temas",
    ],
    correcta: 0,
    explicacion: "Las bases fijan un cuestionario de 50 preguntas, cinco preguntas de reserva y un tiempo máximo de 50 minutos.",
    fuente: bases,
  },
  {
    id: "teo-tema-red",
    ejercicio: "teorico",
    bloque: "Red de Santander y colecciones",
    tema: "Tema 17",
    enunciado: "¿Qué tema trata de forma específica la Red de Bibliotecas Municipales de Santander?",
    opciones: [
      "Su origen, objetivos, composición y organización",
      "La contratación de obras de construcción",
      "La historia completa de todas las bibliotecas españolas",
      "Los sistemas informáticos de la Administración del Estado",
    ],
    correcta: 0,
    explicacion: "El tema 17 se centra en la Red de Bibliotecas Municipales de Santander y en esos cuatro aspectos.",
    fuente: bases,
  },
  {
    id: "teo-tema-servicios",
    ejercicio: "teorico",
    bloque: "Red de Santander y colecciones",
    tema: "Tema 18",
    enunciado: "¿Cuál es el enfoque del tema 18 del programa?",
    opciones: [
      "Los servicios de la Red de Bibliotecas Municipales de Santander",
      "Los fondos patrimoniales e históricos de la Biblioteca Municipal",
      "La reforma de la Constitución Española",
      "El cómputo de plazos administrativos",
    ],
    correcta: 0,
    explicacion: "El tema 18 está dedicado a los servicios de la Red de Bibliotecas Municipales de Santander.",
    fuente: bases,
  },
  {
    id: "teo-tema-colecciones",
    ejercicio: "teorico",
    bloque: "Red de Santander y colecciones",
    tema: "Tema 19",
    enunciado: "Las colecciones de las bibliotecas municipales de Santander aparecen en el programa como:",
    opciones: [
      "Tipos de documentos",
      "Un listado de opositores admitidos",
      "Un catálogo de edificios municipales",
      "Una relación de sanciones disciplinarias",
    ],
    correcta: 0,
    explicacion: "El tema 19 aborda las colecciones y los tipos de documentos de las bibliotecas municipales de Santander.",
    fuente: bases,
  },
  {
    id: "teo-tema-patrimonio",
    ejercicio: "teorico",
    bloque: "Red de Santander y colecciones",
    tema: "Tema 20",
    enunciado: "¿Qué contenido corresponde al tema 20?",
    opciones: [
      "Los fondos patrimoniales e históricos de la Biblioteca Municipal de Santander",
      "Las redes bibliotecarias en toda Europa",
      "La organización de los órganos colegiados locales",
      "La inscripción en el Registro Civil",
    ],
    correcta: 0,
    explicacion: "El último tema del programa trata los fondos patrimoniales e históricos de la Biblioteca Municipal de Santander.",
    fuente: bases,
  },
  {
    id: "teo-proteccion-datos",
    ejercicio: "teorico",
    bloque: "Convocatoria y parte general",
    tema: "Tema 4",
    enunciado: "¿Por qué aparece la protección de datos en el programa?",
    opciones: [
      "Por su aplicación en bibliotecas",
      "Porque sustituye a toda la legislación bibliotecaria",
      "Porque solo se aplica a archivos históricos",
      "Porque regula exclusivamente los edificios públicos",
    ],
    correcta: 0,
    explicacion: "El tema 4 pide estudiar la legislación española de protección de datos y su aplicación en bibliotecas.",
    fuente: bases,
  },
  {
    id: "teo-propiedad-intelectual",
    ejercicio: "teorico",
    bloque: "Convocatoria y parte general",
    tema: "Tema 8",
    enunciado: "El tema 8 relaciona la propiedad intelectual con:",
    opciones: [
      "La incidencia de la ley en la gestión de bibliotecas",
      "La organización territorial del Estado",
      "La selección de personal funcionario",
      "La celebración de plenos municipales",
    ],
    correcta: 0,
    explicacion: "Las bases describen el tema 8 como la Ley de propiedad intelectual y su incidencia en la gestión de bibliotecas.",
    fuente: bases,
  },
  {
    id: "teo-animacion-lectura",
    ejercicio: "teorico",
    bloque: "Bibliotecas y servicios",
    tema: "Tema 14",
    enunciado: "¿Qué dos ideas aparecen unidas en el tema 14?",
    opciones: [
      "Extensión bibliotecaria y animación a la lectura",
      "Patrimonio cultural y procedimiento sancionador",
      "Redes informáticas y registro electrónico",
      "Contratación pública y recursos administrativos",
    ],
    correcta: 0,
    explicacion: "El tema 14 estudia la extensión bibliotecaria y la animación a la lectura, con sus objetivos y actividades.",
    fuente: bases,
  },
  {
    id: "teo-constitucion",
    ejercicio: "teorico",
    bloque: "Convocatoria y parte general",
    tema: "Tema 1",
    enunciado: "¿Qué principio aparece expresamente entre las garantías del artículo 9.3 de la Constitución?",
    opciones: [
      "La seguridad jurídica",
      "La censura previa",
      "La retroactividad de toda sanción desfavorable",
      "La arbitrariedad de los poderes públicos",
    ],
    correcta: 0,
    explicacion: "El artículo 9.3 garantiza, entre otros principios, la seguridad jurídica y prohíbe la arbitrariedad de los poderes públicos.",
    fuente: source("Constitución Española, artículo 9", `${CE}#a9`),
  },
  {
    id: "prac-catalogo-autora",
    ejercicio: "practico",
    caso: "catalogo",
    bloque: "Entrenamiento práctico",
    tema: "Práctica de catálogo",
    enunciado: "No recuerdas el título exacto, pero sí la autora. ¿Cuál es el primer paso más útil en una búsqueda por catálogo?",
    opciones: [
      "Comenzar por el punto de acceso de autor y comprobar después los títulos",
      "Elegir el primer resultado sin revisar la edición",
      "Buscar solo por la portada de una adaptación audiovisual",
      "Descartar todos los registros que tengan más de una edición",
    ],
    correcta: 0,
    explicacion: "Cuando el título es incierto, empezar por la autora reduce ruido. Después hay que comprobar título, edición y formato del registro.",
    fuente: bases,
  },
  {
    id: "prac-catalogo-edicion",
    ejercicio: "practico",
    caso: "catalogo",
    bloque: "Entrenamiento práctico",
    tema: "Práctica de catálogo",
    enunciado: "Aparecen dos registros con el mismo título y distinta fecha. ¿Qué comprobación evita elegir una edición incorrecta?",
    opciones: [
      "Comparar autoría, fecha, editorial y soporte con la petición",
      "Escoger siempre el registro más antiguo",
      "Escoger siempre el registro con más páginas",
      "Ignorar la fecha porque todos los registros son equivalentes",
    ],
    correcta: 0,
    explicacion: "La identificación bibliográfica exige contrastar los datos del registro con la obra solicitada, no decidir por un único campo.",
    fuente: bases,
  },
  {
    id: "prac-referencia-fuente",
    ejercicio: "practico",
    caso: "referencia",
    bloque: "Entrenamiento práctico",
    tema: "Obras de referencia",
    enunciado: "Te piden una definición que debe poder verificarse. ¿Qué respuesta demuestra mejor una búsqueda profesional?",
    opciones: [
      "Dar el dato y señalar la obra de referencia y la entrada consultada",
      "Copiar el primer resultado de un buscador sin indicar la fuente",
      "Responder de memoria aunque no estés seguro",
      "Enviar varios enlaces sin explicar cuál respalda la respuesta",
    ],
    correcta: 0,
    explicacion: "Una respuesta bibliográfica útil identifica la fuente consultada y permite volver a comprobar el dato.",
    fuente: bases,
  },
  {
    id: "prac-referencia-dato",
    ejercicio: "practico",
    caso: "referencia",
    bloque: "Entrenamiento práctico",
    tema: "Obras de referencia",
    enunciado: "Dos fuentes ofrecen fechas distintas para el mismo hecho. ¿Qué deberías hacer antes de elegir?",
    opciones: [
      "Comprobar la autoridad, fecha de actualización y alcance de cada fuente",
      "Elegir la respuesta más corta",
      "Elegir la fuente con el diseño más moderno",
      "Sumar las dos fechas y presentar la media",
    ],
    correcta: 0,
    explicacion: "La comparación de autoridad, actualización y alcance permite justificar la elección y detectar una posible diferencia de criterio.",
    fuente: bases,
  },
  {
    id: "reserva-teoria-biblioteca",
    ejercicio: "teorico",
    bloque: "Bibliotecas y servicios",
    tema: "Tema 12",
    reserva: true,
    enunciado: "¿Qué describe mejor una biblioteca pública en el programa?",
    opciones: [
      "Su concepto, función y servicios",
      "Solo sus fondos patrimoniales",
      "Solo sus instalaciones técnicas",
      "La organización del Gobierno autonómico",
    ],
    correcta: 0,
    explicacion: "El tema 12 se dedica al concepto, la función y los servicios de la biblioteca pública.",
    fuente: bases,
  },
  {
    id: "reserva-practica-catalogo",
    ejercicio: "practico",
    caso: "catalogo",
    bloque: "Entrenamiento práctico",
    tema: "Práctica de catálogo",
    reserva: true,
    enunciado: "Si la búsqueda devuelve demasiados resultados, ¿qué ajuste suele ayudar a acotarla?",
    opciones: [
      "Añadir un punto de acceso fiable, como autor o fecha",
      "Eliminar todos los términos de búsqueda",
      "Elegir el resultado al azar",
      "Buscar únicamente imágenes",
    ],
    correcta: 0,
    explicacion: "Añadir un punto de acceso controlado reduce resultados irrelevantes y facilita la comprobación del registro.",
    fuente: bases,
  },
];

export const PREGUNTAS_ORDINARIAS = PREGUNTAS_MINI.filter((item) => !item.reserva);
export const PREGUNTAS_TEORICAS = PREGUNTAS_ORDINARIAS.filter((item) => item.ejercicio === "teorico");
export const PREGUNTAS_PRACTICAS = PREGUNTAS_ORDINARIAS.filter((item) => item.ejercicio === "practico");
