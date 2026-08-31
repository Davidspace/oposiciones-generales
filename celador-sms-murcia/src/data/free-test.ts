export type FreeTestQuestion = {
  id: string;
  block: "Común" | "Específica";
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  source: string;
};

/**
 * Muestra propia basada en el programa oficial vigente.
 * No reproduce preguntas de bancos comerciales ni enunciados de exámenes oficiales.
 */
export const FREE_TEST: FreeTestQuestion[] = [
  {
    id: "sms-free-01",
    block: "Común",
    question: "Según la Constitución Española, los ciudadanos tienen derecho a acceder a las funciones y cargos públicos:",
    options: [
      "Sin más requisito que la mayoría de edad",
      "En condiciones de igualdad, con los requisitos que señalen las leyes",
      "Solo después de prestar servicios en una Administración",
      "De acuerdo exclusivamente con su antigüedad",
    ],
    answer: 1,
    explanation: "El artículo 23.2 reconoce el acceso en condiciones de igualdad a las funciones y cargos públicos, con los requisitos que señalen las leyes.",
    source: "Constitución Española, artículo 23.2",
  },
  {
    id: "sms-free-02",
    block: "Común",
    question: "Según la Ley 4/1994, de Salud de la Región de Murcia, el mapa sanitario regional se ordena en demarcaciones territoriales denominadas:",
    options: ["Distritos sanitarios", "Sectores asistenciales", "Áreas de salud", "Zonas hospitalarias"],
    answer: 2,
    explanation: "El artículo 12.1 establece que el mapa sanitario de la Región de Murcia se ordena en áreas de salud.",
    source: "Ley 4/1994, de Salud de la Región de Murcia, artículo 12.1",
  },
  {
    id: "sms-free-03",
    block: "Común",
    question: "¿Cuál de las siguientes conductas es un deber del personal estatutario de los servicios de salud?",
    options: [
      "Mantener actualizados los conocimientos y aptitudes necesarios para sus funciones",
      "Elegir libremente cualquier puesto de trabajo del servicio de salud",
      "Rechazar las instrucciones relacionadas con su nombramiento",
      "Delegar en otro trabajador el cumplimiento de su jornada",
    ],
    answer: 0,
    explanation: "El personal estatutario debe mantener debidamente actualizados los conocimientos y aptitudes necesarios para ejercer sus funciones.",
    source: "Ley 55/2003, Estatuto Marco, artículo 19.c",
  },
  {
    id: "sms-free-04",
    block: "Común",
    question: "¿Cuál de las siguientes NO forma parte del régimen general de situaciones del personal estatutario fijo enumerado en el artículo 62.1 de la Ley 55/2003?",
    options: ["Servicio activo", "Servicios especiales", "Suspensión de funciones", "Expectativa de destino"],
    answer: 3,
    explanation: "La expectativa de destino no figura en la relación general del artículo 62.1. El apartado 2 permite que las comunidades autónomas regulen esta y otras situaciones adicionales.",
    source: "Ley 55/2003, Estatuto Marco, artículo 62.1 y 62.2",
  },
  {
    id: "sms-free-05",
    block: "Común",
    question: "De acuerdo con la Ley 40/2015, una sede electrónica es:",
    options: [
      "Cualquier página web que publique información administrativa",
      "Una dirección electrónica disponible mediante redes de telecomunicaciones cuya titularidad corresponde a una Administración u organismo público",
      "Un buzón de correo reservado al personal empleado público",
      "Una aplicación privada utilizada para pedir cita previa",
    ],
    answer: 1,
    explanation: "La sede electrónica es una dirección electrónica accesible por redes de telecomunicaciones y cuya titularidad corresponde a una Administración, organismo público o entidad de Derecho Público.",
    source: "Ley 40/2015, de Régimen Jurídico del Sector Público, artículo 38.1",
  },
  {
    id: "sms-free-06",
    block: "Común",
    question: "¿Cuáles son los instrumentos esenciales para gestionar y aplicar el plan de prevención de riesgos laborales?",
    options: [
      "La vigilancia de la salud y el régimen disciplinario",
      "La formación inicial y el reconocimiento médico anual",
      "La evaluación de riesgos y la planificación de la actividad preventiva",
      "El comité de empresa y la memoria económica",
    ],
    answer: 2,
    explanation: "La Ley de Prevención de Riesgos Laborales identifica como instrumentos esenciales la evaluación de riesgos y la planificación de la actividad preventiva.",
    source: "Ley 31/1995, de Prevención de Riesgos Laborales, artículo 16.2",
  },
  {
    id: "sms-free-07",
    block: "Común",
    question: "Existe discriminación directa por razón de sexo cuando una persona:",
    options: [
      "Es, ha sido o pudiera ser tratada de manera menos favorable que otra en una situación comparable por razón de su sexo",
      "Recibe un trato diferente basado en un criterio neutro que perjudica especialmente a un sexo",
      "Solicita la aplicación de un plan de igualdad",
      "Participa en una medida de acción positiva",
    ],
    answer: 0,
    explanation: "La opción A reproduce los elementos de la discriminación directa. La opción B describe la discriminación indirecta.",
    source: "Ley Orgánica 3/2007, para la igualdad efectiva de mujeres y hombres, artículo 6",
  },
  {
    id: "sms-free-08",
    block: "Específica",
    question: "Según la Ley 41/2002, ¿qué se entiende por paciente?",
    options: [
      "La persona que acompaña a quien recibe asistencia sanitaria",
      "Toda persona inscrita en una tarjeta sanitaria, aunque no reciba asistencia",
      "La persona que utiliza servicios de educación y promoción de la salud",
      "La persona que requiere asistencia sanitaria y está sometida a cuidados profesionales para mantener o recuperar su salud",
    ],
    answer: 3,
    explanation: "La ley denomina paciente a quien requiere asistencia sanitaria y está sometido a cuidados profesionales para mantener o recuperar su salud.",
    source: "Ley 41/2002, de autonomía del paciente, artículo 3",
  },
  {
    id: "sms-free-09",
    block: "Específica",
    question: "La infección que aparece durante la hospitalización y que no estaba presente ni en incubación al ingreso se denomina:",
    options: ["Comunitaria", "Nosocomial", "Congénita", "Oportunista"],
    answer: 1,
    explanation: "Una infección nosocomial es la adquirida durante la asistencia hospitalaria y que no estaba presente ni incubándose cuando se produjo el ingreso.",
    source: "Programa específico Celador-Subalterno SMS 2022, tema 2",
  },
  {
    id: "sms-free-10",
    block: "Específica",
    question: "Un paciente de rehabilitación pregunta al celador por el diagnóstico y la evolución de su lesión. ¿Cómo debe actuar?",
    options: [
      "Explicarle el diagnóstico si ha leído su historia clínica",
      "Darle una valoración personal para tranquilizarlo",
      "Orientar la consulta hacia el profesional sanitario responsable, sin ofrecer información clínica por su cuenta",
      "Pedir a otro paciente que le explique un caso similar",
    ],
    answer: 2,
    explanation: "El celador no interpreta diagnósticos ni tratamientos. Debe mantener la confidencialidad y dirigir la consulta al profesional sanitario responsable.",
    source: "Programa específico Celador-Subalterno SMS 2022, temas 1 y 3",
  },
  {
    id: "sms-free-11",
    block: "Específica",
    question: "¿Cuál de los siguientes productos de un almacén sanitario se considera material no fungible?",
    options: ["Guantes desechables", "Gasas estériles", "Una almohada reutilizable", "Depresores linguales"],
    answer: 2,
    explanation: "El material fungible se consume con el uso. Una almohada reutilizable permanece y puede utilizarse repetidamente, por lo que es material no fungible.",
    source: "Programa específico Celador-Subalterno SMS 2022, tema 4",
  },
  {
    id: "sms-free-12",
    block: "Específica",
    question: "Si se indica colocar a un paciente en posición de Fowler, la colocación correcta es:",
    options: [
      "Decúbito supino con la cabecera elevada entre 45 y 60 grados y las piernas ligeramente flexionadas",
      "Decúbito prono con la cabeza girada hacia un lado",
      "Decúbito supino con los pies más altos que la cabeza",
      "Decúbito lateral con la pierna superior totalmente extendida",
    ],
    answer: 0,
    explanation: "En Fowler, el paciente permanece en decúbito supino con el tronco elevado aproximadamente entre 45 y 60 grados; las piernas pueden mantenerse ligeramente flexionadas.",
    source: "Programa específico Celador-Subalterno SMS 2022, tema 5",
  },
  {
    id: "sms-free-13",
    block: "Específica",
    question: "Para reducir una hoja A3 y que su contenido ocupe proporcionalmente una hoja A4, ¿qué escala aproximada debe seleccionarse en la fotocopiadora?",
    options: ["50 %", "71 %", "100 %", "141 %"],
    answer: 1,
    explanation: "Los formatos de la serie A mantienen la proporción entre lados. El paso de A3 a A4 supone una reducción lineal aproximada al 71 %.",
    source: "Programa específico Celador-Subalterno SMS 2022, tema 6; norma ISO 216",
  },
  {
    id: "sms-free-14",
    block: "Específica",
    question: "En Windows, ¿qué combinación de teclas abre directamente el Administrador de tareas?",
    options: ["Alt + F4", "Windows + E", "Ctrl + P", "Ctrl + Mayús + Esc"],
    answer: 3,
    explanation: "Ctrl + Mayús + Esc abre directamente el Administrador de tareas. Las otras combinaciones cierran la ventana activa, abren el Explorador o lanzan la impresión.",
    source: "Programa específico Celador-Subalterno SMS 2022, tema 7; soporte de Microsoft Windows",
  },
  {
    id: "sms-free-15",
    block: "Específica",
    question: "El personal de enfermería indica al celador que traslade a un paciente para realizarle una tomografía computarizada (TAC). ¿A qué área debe dirigirlo?",
    options: ["Radiodiagnóstico", "Rehabilitación", "Anatomía Patológica", "Farmacia hospitalaria"],
    answer: 0,
    explanation: "La tomografía computarizada es una prueba de imagen que se realiza en el área de Radiodiagnóstico.",
    source: "Programa específico Celador-Subalterno SMS 2022, tema 2",
  },
];
