import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Instagram,
  Laptop,
  Layers3,
  MessageCircle,
  Smartphone,
  Sparkles,
  Star,
  Timer,
} from "lucide-react";

const whatsappNumber = "34640828654";
const instagramUrl = "https://www.instagram.com/academialorman/";

const whatsappText =
  "Hola Academia LORMAN, quiero información sobre los cursos online.";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
const smsExamWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hola Academia LORMAN, he visto la prueba del examen SMS de TCAE y quiero más preguntas, simulacros e información del curso SMS.",
)}`;
const imasExamWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hola Academia LORMAN, he visto la prueba del examen IMAS Murcia de TCAE y quiero más preguntas, simulacros e información del curso IMAS.",
)}`;
const sermasExamWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hola Academia LORMAN, he visto la prueba del examen SERMAS Madrid de TCAE y quiero más preguntas, simulacros e información del curso SERMAS Madrid.",
)}`;

const courses = [
  {
    title: "Curso SERMAS Madrid",
    subtitle: "TCAE Comunidad de Madrid",
    badge: "Nuevo",
    price: "95 €",
    detail: "pago único",
    description:
      "Curso online TCAE SERMAS Madrid con temario desarrollado, resúmenes, autoevaluaciones, simulacros y acceso al aula virtual.",
    features: ["Temario desarrollado", "Autoevaluaciones", "Simulacros tipo examen"],
    highlighted: true,
  },
  {
    title: "Curso TCAE-SAS",
    badge: "Moodle online",
    price: "25 €/mes",
    detail: "durante 10 meses",
    description:
      "Curso online TCAE-SAS con acceso a Moodle, clases grabadas, temario organizado, test y materiales de estudio.",
    features: ["Clases grabadas", "Temario por bloques", "Test de repaso"],
  },
  {
    title: "Celador Conductor-SAS",
    badge: "Moodle online",
    price: "25 €/mes",
    detail: "curso online",
    description:
      "Curso online para Celador Conductor-SAS con clases grabadas, temario organizado, test y acceso al aula virtual.",
    features: ["Clases grabadas", "Temario por bloques", "Autoevaluaciones"],
  },
  {
    title: "Curso IMAS Express",
    badge: "Curso intensivo",
    price: "45 €",
    detail: "pago único",
    description:
      "Preparación express con materiales claros, test y recursos online para estudiar de forma práctica.",
    features: ["Formato rápido", "Simulacros", "Autoevaluaciones"],
    highlighted: true,
  },
  {
    title: "Curso SMS",
    subtitle: "Servicio Murciano de Salud",
    badge: "Destacado",
    price: "90 €",
    detail: "pago único",
    description:
      "Curso online con temas desarrollados, esquemas/resúmenes, autoevaluaciones y simulacros tipo examen.",
    features: ["Temas desarrollados", "Precio especial IMAS", "Simulacros tipo examen"],
  },
  {
    title: "Celador SMS",
    subtitle: "Servicio Murciano de Salud",
    badge: "Próximamente",
    price: "Próximamente",
    detail: "apertura pendiente",
    description:
      "Curso en preparación para Celador SMS con tema desarrollado, resúmenes, autoevaluaciones y simulacros.",
    features: ["Tema desarrollado", "Resúmenes", "Autoevaluaciones y simulacros"],
  },
];

const includes = [
  { icon: Laptop, title: "Clases grabadas SAS", text: "TCAE-SAS y Celador Conductor-SAS incluyen clases grabadas para estudiar a tu ritmo." },
  { icon: FileText, title: "Temarios desarrollados", text: "Contenido redactado y ordenado para avanzar paso a paso." },
  { icon: Layers3, title: "Esquemas y resúmenes", text: "Repasos visuales para memorizar lo más importante." },
  { icon: ClipboardCheck, title: "Test y autoevaluaciones", text: "Preguntas por temas con corrección para detectar fallos." },
  { icon: Timer, title: "Simulacros tipo examen", text: "Práctica con ejercicios similares al formato oficial." },
  { icon: BookOpen, title: "Acceso a Moodle", text: "Todo el material dentro de un aula virtual organizada." },
  { icon: Smartphone, title: "Móvil y ordenador", text: "Estudia desde donde puedas, cuando puedas." },
  { icon: CheckCircle2, title: "Material actualizado", text: "Recursos estructurados y revisados durante el curso." },
  { icon: MessageCircle, title: "Acompañamiento", text: "Contacto directo para pedir información y resolver dudas." },
];

const moodleItems = [
  "Temario organizado por bloques",
  "Tema/resumen para estudiar",
  "Autoevaluaciones por tema",
  "Preguntas tipo test",
  "Simulacros tipo examen",
];

const sermasExamPreviewQuestions = [
  {
    number: "01",
    question:
      "Según el artículo 75 del Estatuto del Personal Sanitario no Facultativo, ¿cuál de estas tareas no corresponde a las funciones habituales del auxiliar de enfermería en servicios de enfermería?",
    options: [
      "Colaborar en la administración de medicamentos por vía oral y rectal, con exclusión de la vía parenteral.",
      "Colaborar en la recogida de datos termométricos y comunicar signos de interés al personal sanitario titulado.",
      "Colaborar en el rasurado de las personas enfermas.",
      "Recoger y limpiar el instrumental empleado en intervenciones quirúrgicas y ordenar vitrinas y arsenal.",
    ],
  },
  {
    number: "02",
    question:
      "En comunicación no verbal y metacomunicación, ¿qué afirmación no encaja con los axiomas de Watzlawick?",
    options: [
      "La comunicación tiene un nivel de contenido y otro de relación.",
      "La secuencia de la comunicación influye en cómo se interpreta el mensaje.",
      "La comunicación puede expresarse de forma digital y analógica.",
      "Toda interacción se define como asimétrica y complementaria.",
    ],
  },
  {
    number: "03",
    question:
      "¿A partir de qué valor aproximado de presión mantenida sobre una zona corporal se considera que puede iniciarse la oclusión capilar?",
    options: ["30 mmHg", "70 mmHg", "50 mmHg", "Ninguna de las anteriores"],
  },
  {
    number: "04",
    question:
      "En la alimentación del paciente paliativo, ¿cuál es la pauta más adecuada de forma general?",
    options: [
      "Asegurar que coma al menos la mitad de todo lo que se le ofrece.",
      "Obligarle a comer en el horario fijado aunque no tenga apetito.",
      "Permitir que coma lo que quiera, cuando quiera y en la cantidad que tolere.",
      "Impedir que la familia le lleve comida para evitar cambios en la dieta.",
    ],
  },
  {
    number: "05",
    question:
      "¿Cuál de las siguientes afirmaciones sobre la recogida y transporte de muestras biológicas es verdadera?",
    options: [
      "La muestra debe estar en contacto con desinfectantes o antisépticos para conservarse mejor.",
      "No es necesario identificar el recipiente con los datos del paciente y el tipo de muestra.",
      "El laboratorio debe disponer de un manual claro y conciso con normas de recogida y transporte.",
      "Todas las muestras biológicas son exclusivamente de origen humano.",
    ],
  },
];

const smsExamPreviewQuestions = [
  {
    number: "01",
    question:
      "El paciente presentó alteraciones del comportamiento y agresividad, lo que llevó a la actuación de la policía y traslado a urgencias. ¿Cuál sería la actuación en el servicio de urgencias psiquiátricas con pacientes agresivos o agitados? Indicar la incorrecta.",
    options: [
      "La sujeción se llevará a cabo por todo el equipo presente, incluido el médico psiquiatra.",
      "El médico y la enfermera responsable del paciente deben ser avisados de inmediato.",
      "Si es en presencia de otros pacientes, se les pedirá que abandonen las dependencias para poder resolver la situación con agilidad.",
      "En el momento de la reducción del paciente se procurará no causarle daño.",
    ],
  },
  {
    number: "02",
    question:
      "El paciente fue sedado. ¿Cuál de las precauciones previas a la hora de administrar un fármaco es la correcta?",
    options: [
      "Decidir la dosis adecuada según la respuesta del paciente.",
      "Verificar la identidad del paciente y la medicación correcta antes de la administración.",
      "Administrar la medicación por la vía más rápida.",
      "Registrar únicamente la hora de administración.",
    ],
  },
  {
    number: "03",
    question:
      "A la hora de administrar un medicamento vía oral, ¿cuál de estos no es una consideración especial a tener en cuenta?",
    options: [
      "Los medicamentos no usados se regresan a los recipientes, para su reutilización.",
      "No se deben administrar medicamentos de un recipiente mal rotulado.",
      "Los medicamentos de sabor desagradable se administrarán mezclados con zumo y con sorbete.",
      "No se debe perder de vista el carrito de unidosis o bandeja de medicamentos.",
    ],
  },
  {
    number: "04",
    question:
      "En la exploración general que se le hace al paciente, se registra la TA sistólica de 131 y diastólica de 59 mmHg, ¿cómo se denomina a la presión máxima registrada durante el ciclo cardíaco?",
    options: ["TA diastólica", "TA media", "TA diferencial", "TA sistólica"],
  },
  {
    number: "05",
    question:
      "La frecuencia cardíaca del paciente fue de 85 l.p.m. En un adulto en reposo, este valor se considera generalmente dentro del rango de:",
    options: ["Bradicardia", "Taquicardia", "Pulso acelerado", "Arritmia"],
  },
  {
    number: "06",
    question:
      "Se registraron las constantes vitales del paciente al llegar a urgencias, ¿cuál es la importancia del registro de datos en una gráfica ordinaria?",
    options: [
      "Es un requisito administrativo sin valor clínico.",
      "Ayuda a tener una visión global del enfermo con tan solo ver la hoja de gráfica.",
      "Sirve para un solo día y tener un control horario de las constantes vitales, así como otros parámetros.",
      "Es muy utilizada en UCI y en la sala de despertar o reanimación posoperatoria.",
    ],
  },
  {
    number: "07",
    question:
      "El paciente fue contenido en cama de psiquiatría con 5 puntos de sujeción. ¿En qué situaciones está indicada este tipo de contención? Indicar la incorrecta.",
    options: [
      "En conductas violentas de un paciente que resulten peligrosas para él mismo o para los demás.",
      "En agitación no controlable con medicamentos.",
      "Cuando representen una amenaza para su integridad física debido a la negación del paciente a descansar, beber, dormir, etc.",
      "En pacientes con sospechas de alteraciones violentas.",
    ],
  },
  {
    number: "08",
    question:
      "La impresión diagnóstica del paciente es psicosis. ¿Qué tipo de manifestaciones caracterizan a la psicosis orgánica?",
    options: [
      "Agresión contra sí mismo y contra otros.",
      "Pensamiento desorganizado e ilógico.",
      "Delirios, desorientación, agresividad, hostilidad.",
      "Baja autoestima, alteración de los límites del ego.",
    ],
  },
  {
    number: "09",
    question: "¿Qué es la contención mecánica en psiquiatría?",
    options: [
      "El uso de medicación para controlar la agitación del paciente.",
      "El uso de sujeciones físicas para limitar la movilidad del paciente.",
      "Terapia cognitivo-conductual para pacientes agresivos.",
      "Técnica de relajación para reducir el estrés.",
    ],
  },
  {
    number: "10",
    question: "¿Cuál es el propósito de la sedación en este paciente?",
    options: [
      "Reducir la ansiedad y la agitación.",
      "Inducir el sueño.",
      "Controlar la presión arterial.",
      "Mejorar la saturación de oxígeno.",
    ],
  },
  {
    number: "11",
    question: "¿Qué es la heteroagresividad en el contexto de este paciente?",
    options: [
      "Agresividad hacia sí mismo.",
      "Agresividad hacia los demás.",
      "Agresividad hacia objetos.",
      "Agresividad hacia sí mismo y hacia los demás.",
    ],
  },
  {
    number: "12",
    question: "¿Cuál puede ser un efecto adverso potencial de la sujeción mecánica?",
    options: [
      "Reducción del estrés.",
      "Lesiones físicas.",
      "Mejora el estado de ánimo.",
      "Aumento de la colaboración.",
    ],
  },
  {
    number: "13",
    question:
      "Se procede al ingreso involuntario del paciente en el área de psiquiatría. Ortega Monasterio y Talón Navarro (1986), dan una serie de indicaciones médicas que aconsejan un internamiento forzoso, ¿cuál de las siguientes no es una de esas indicaciones?",
    options: [
      "Pérdida o grave disminución de la autonomía personal.",
      "Riesgo de heteroagresividad.",
      "Riesgo de autoagresividad.",
      "Enfermedad mental que suponga una carga para la persona que esté a su cuidado.",
    ],
  },
  {
    number: "14",
    question:
      "El padre del paciente no sabe cómo afrontar esta situación y decide iniciar terapia familiar. ¿Hacia dónde tienden los objetivos generales de un programa tipo, cuando hablamos de terapia familiar? Indicar la incorrecta.",
    options: [
      "Formar coterapeutas y que expandan sus conocimientos al resto de la familia.",
      "Conseguir la responsabilidad y colaboración del paciente con el trabajo del centro.",
      "Facilitar el conocimiento y uso de recursos comunitarios.",
      "Ofrecer una visión realista del problema en psiquiatría.",
    ],
  },
  {
    number: "15",
    question: "¿Cuál es el objetivo de las terapias conductuales?",
    options: [
      "Reducir la necesidad de medicación.",
      "Mejorar la adherencia al tratamiento.",
      "Aumentar la frecuencia de los síntomas.",
      "La extinción o reducción de una conducta inapropiada que perjudica al sujeto.",
    ],
  },
  {
    number: "16",
    question:
      "¿Cómo se denomina al equipo de profesionales de diferentes disciplinas que atendieron al paciente con un objetivo común en el servicio de urgencias?",
    options: [
      "Equipo de trabajo individual.",
      "Servicio de mantenimiento.",
      "Equipo multidisciplinar o interdisciplinar.",
      "Personal administrativo.",
    ],
  },
  {
    number: "17",
    question:
      "Al paciente se le administró oxígeno por medio de gafas nasales, ¿qué dispositivo de oxigenoterapia permite alcanzar concentraciones de oxígeno superiores al 60-80%?",
    options: [
      "Gafas nasales o cánulas nasales.",
      "Mascarilla tipo Venturi o ventimask.",
      "Mascarilla facial simple.",
      "Mascarilla con bolsa reservorio sin reciclado o reciclado parcial.",
    ],
  },
  {
    number: "18",
    question: "La OMS define la salud mental como:",
    options: [
      "Estado completo de bienestar mental, físico y social y no meramente la ausencia de enfermedad o dolencia.",
      "La adaptación óptima al entorno.",
      "La capacidad de realizar actividades diarias.",
      "Resultado de la presencia de aspectos psicológicos, afectivos y sociales sobre la salud, necesarios para alcanzar un estado de completo bienestar.",
    ],
  },
  {
    number: "19",
    question: "Si la TA del paciente es de 131/59 mmHg, se considera:",
    options: ["Hipotensión", "Normotensión", "Hipertensión", "Crisis hipertensiva"],
  },
  {
    number: "20",
    question:
      "¿Cuál de las siguientes funciones en atención primaria no debe realizar el TCAE?",
    options: [
      "La aplicación de tratamientos curativos de carácter no medicamentoso.",
      "Preparación de consultas programadas.",
      "Ayudar a los pacientes para su exploración y tratamiento.",
      "La recogida y limpieza del instrumental clínico.",
    ],
  },
];

const imasExamPreviewQuestions = [
  {
    number: "01",
    question:
      "La Constitución Española de 1978 establece en su artículo 1 que son valores superiores del ordenamiento jurídico:",
    options: [
      "La libertad, la justicia y la autonomía de las regiones.",
      "La justicia y la igualdad de los pueblos.",
      "La libertad, la justicia, la igualdad y el pluralismo político.",
      "La libertad, la igualdad y la equidad.",
    ],
  },
  {
    number: "02",
    question:
      "¿Qué artículo de la Constitución Española proclama que los españoles son iguales ante la Ley, sin que pueda prevalecer discriminación alguna?",
    options: ["Artículo 9", "Artículo 11", "Artículo 14", "Artículo 18"],
  },
  {
    number: "03",
    question:
      "Tienen la consideración de órganos directivos de la Administración General:",
    options: [
      "Los secretarios generales y los directores generales.",
      "Los secretarios autonómicos y los vicesecretarios.",
      "Los subdirectores generales y órganos asimilados.",
      "Todas son correctas.",
    ],
  },
  {
    number: "04",
    question:
      "Los decretos por los que se establecen los órganos directivos de las diferentes consejerías se aprueban por:",
    options: [
      "El Presidente del Gobierno Regional.",
      "El Consejo de Gobierno.",
      "La Asamblea Regional.",
      "El Consejo de Gobierno, a propuesta del Presidente.",
    ],
  },
  {
    number: "05",
    question:
      "Según el artículo 3 del Decreto Legislativo 1/2001, no se integrará en la Función Pública Regional:",
    options: [
      "El personal laboral de la Administración Pública de la Región de Murcia.",
      "El personal eventual de la Administración Pública de la Región de Murcia.",
      "El personal que presta servicios en la Asamblea Regional.",
      "El personal estatutario del Servicio Murciano de Salud.",
    ],
  },
  {
    number: "06",
    question:
      "Siempre que por Ley o en el Derecho de la Unión Europea no se exprese otro cómputo, cuando los plazos se señalen por días:",
    options: [
      "Se entiende que éstos son naturales.",
      "Se entiende que éstos son hábiles.",
      "Se entiende que éstos son naturales, excluyéndose del cómputo los sábados, domingos y festivos.",
      "Se entiende que éstos son hábiles, excluyéndose del cómputo los sábados, domingos y festivos.",
    ],
  },
  {
    number: "07",
    question:
      "Art. 4 de la Ley 4/1982, Estatuto de Autonomía para la Región de Murcia:",
    options: [
      "La bandera contiene 7 castillos almenados y 4 coronas reales.",
      "La bandera contiene 4 castillos almenados y 7 coronas reales.",
      "La bandera contiene 5 castillos almenados y 4 coronas reales.",
      "La bandera contiene 7 castillos almenados y 5 coronas reales.",
    ],
  },
  {
    number: "08",
    question:
      "Art. 24 de la Ley 4/1982. Las elecciones serán convocadas por el Presidente de la Comunidad Autónoma, de manera que se realicen:",
    options: [
      "El primer domingo de mayo cada 4 años.",
      "El segundo domingo de mayo cada 4 años.",
      "El tercer domingo de mayo cada 4 años.",
      "El cuarto domingo de mayo cada 4 años.",
    ],
  },
  {
    number: "09",
    question:
      "Las almohadillas de polietileno hinchadas con aire y ubicadas a los lados de la cama para prevenir lesiones y caídas, se denominan:",
    options: [
      "Protectores de las barandillas.",
      "Centinelas de cama.",
      "Arco de cama.",
      "a) y b) son correctas.",
    ],
  },
  {
    number: "10",
    question:
      "¿Qué lesión elemental primaria de la piel es aquella que se manifiesta sobreelevada y de contenido sólido, inferior a 1 cm de diámetro?",
    options: ["Mácula", "Nódulo", "Pápula", "Ampolla"],
  },
  {
    number: "11",
    question: "¿Cuál de las siguientes pinzas se utiliza para hemostasia?",
    options: [
      "Pinzas de Doyen.",
      "Pinzas cangrejo.",
      "Pinzas de Adson.",
      "Pinzas de Crile.",
    ],
  },
  {
    number: "12",
    question: "La sonda Malecot:",
    options: [
      "Es una sonda rígida de una sola luz.",
      "Se emplea en el drenaje renal y suprapúbico.",
      "Es una sonda semirrígida y su inserción es quirúrgica.",
      "Es una sonda flexible con dos o tres luces en su interior.",
    ],
  },
  {
    number: "13",
    question: "Es un aminoácido no esencial:",
    options: ["Triptófano", "Cistina", "Lisina", "Valina"],
  },
  {
    number: "14",
    question: "¿Cuál es la dieta inicial en pacientes con infarto agudo de miocardio?",
    options: [
      "Líquidos por vía oral.",
      "Dieta blanda.",
      "Dieta semiblanda.",
      "Líquidos por vía parenteral.",
    ],
  },
  {
    number: "15",
    question:
      "Según la escalera analgésica de la OMS de 1986, ¿qué fármaco pertenece al segundo escalón?",
    options: ["Tramadol", "Metadona", "Fentanilo", "Paracetamol"],
  },
  {
    number: "16",
    question:
      "¿Cuál es la vía que suele tolerar mejor el paciente sometido a cuidados paliativos si se le administra analgesia?",
    options: ["Parenteral", "Cutánea", "Oral", "Respiratoria"],
  },
  {
    number: "17",
    question:
      "¿Qué antagonista específico existe para tratar la intoxicación aguda por opiáceos?",
    options: ["Rohipnol", "Metadona", "Naloxona", "Cannabis"],
  },
  {
    number: "18",
    question:
      "En función de la clasificación realizada por NAHAS según sus características farmacológicas, ¿cuál de las siguientes drogas es un depresor del sistema nervioso central?",
    options: ["Anfetaminas", "Heroína", "Benzodiacepinas", "Marihuana"],
  },
  {
    number: "19",
    question:
      "En relación a la desinfección, señale el enunciado que NO es correcto:",
    options: [
      "La desinfección es un procedimiento que consiste en suprimir los microorganismos patógenos.",
      "Los productos bacteriostáticos son aquellos que matan a los microorganismos.",
      "Se denominan antisépticos a aquellos productos químicos utilizados para la desinfección de piel, heridas y cavidades del organismo.",
      "Entre las cualidades que debe tener un antiséptico, nos encontramos que tiene que tener un amplio espectro de acción.",
    ],
  },
  {
    number: "20",
    question:
      "En relación a la desinfección y la esterilización señale el enunciado falso:",
    options: [
      "Antes de proceder a la esterilización de un objeto no hace falta limpiarlo.",
      "Los detergentes ácidos son aquellos cuyo pH es de 5 o inferior.",
      "Se denomina desinfección final o terminal a aquella que se realiza cuando se ha producido el alta del paciente.",
      "Una de las barreras más efectivas para evitar el contacto de los microorganismos con tejidos estériles es la piel intacta.",
    ],
  },
];

function scrollTo(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <a href="#" className="flex items-center gap-3" aria-label="Academia LORMAN">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#112245] text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-wide text-[#112245]">
                Academia LORMAN
              </span>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">
                Cursos online de normativa y oposiciones
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            <button onClick={() => scrollTo("cursos")} className="hover:text-[#0f9f9a]">
              Cursos
            </button>
            <button onClick={() => scrollTo("moodle")} className="hover:text-[#0f9f9a]">
              Moodle
            </button>
            <button onClick={() => scrollTo("examen-imas")} className="hover:text-[#0f9f9a]">
              Examen IMAS
            </button>
            <button onClick={() => scrollTo("examen-sms")} className="hover:text-[#0f9f9a]">
              Examen SMS
            </button>
            <button onClick={() => scrollTo("precios")} className="hover:text-[#0f9f9a]">
              Precios
            </button>
            <button onClick={() => scrollTo("contacto")} className="hover:text-[#0f9f9a]">
              Contacto
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#112245] shadow-sm hover:border-[#0f9f9a] sm:inline-flex"
              aria-label="Ver Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0f9f9a] px-3 text-sm font-bold text-white shadow-sm hover:bg-[#0b817d]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="overflow-hidden bg-[#112245] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:py-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-[#ffd447]">
              <Sparkles className="h-4 w-4" />
              Estudia a tu ritmo con acceso a Moodle
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Academia LORMAN
            </h1>
            <p className="mt-4 text-xl font-semibold text-[#8ee9e4]">
              Cursos online de normativa y oposiciones
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              Estudia a tu ritmo con temarios organizados, test, simulacros y acceso a Moodle.
              Elige TCAE-SAS, Celador Conductor-SAS, IMAS Express, SMS o Celador SMS según tu objetivo.
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              <Button
                asChild
                className="h-12 w-full rounded-lg bg-[#ffd447] px-6 text-base font-extrabold text-[#112245] hover:bg-[#f5c51f]"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Pedir información por WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-lg border-white/40 bg-transparent px-4 text-sm font-bold text-white hover:bg-white hover:text-[#112245] sm:px-6 sm:text-base"
              >
                <a href="/#examen-sms">
                  Ir a la prueba del examen SMS
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-lg border-white/40 bg-transparent px-4 text-sm font-bold text-white hover:bg-white hover:text-[#112245] sm:px-6 sm:text-base"
              >
                <a href="/#examen-imas">
                  Ir a la prueba del examen IMAS
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-lg border-white/40 bg-white/10 px-6 text-base font-bold text-white hover:bg-white hover:text-[#112245]"
              >
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                  Ver Instagram
                </a>
              </Button>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                <strong className="block text-2xl text-[#ffd447]">6</strong>
                <span className="text-xs text-slate-200">cursos abiertos</span>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                <strong className="block text-2xl text-[#ffd447]">24/7</strong>
                <span className="text-xs text-slate-200">aula virtual</span>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                <strong className="block text-2xl text-[#ffd447]">Moodle</strong>
                <span className="text-xs text-slate-200">móvil y PC</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-2xl">
              <div className="rounded-[1.25rem] bg-slate-50 p-4 text-slate-950 shadow-xl">
                <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#0f9f9a]">
                      Aula Moodle
                    </p>
                    <h2 className="text-lg font-extrabold text-[#112245]">
                      Panel de estudio
                    </h2>
                  </div>
                  <div className="flex gap-1">
                    <span className="h-3 w-3 rounded-full bg-[#ffd447]" />
                    <span className="h-3 w-3 rounded-full bg-[#0f9f9a]" />
                    <span className="h-3 w-3 rounded-full bg-[#112245]" />
                  </div>
                </div>
                <div className="grid gap-3">
                  {moodleItems.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e7fbfa] text-[#0f9f9a]">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-[#112245] p-4 text-white">
                  <p className="text-sm font-semibold text-[#8ee9e4]">Simulacro activo</p>
                  <div className="mt-3 h-3 rounded-full bg-white/15">
                    <div className="h-3 w-2/3 rounded-full bg-[#ffd447]" />
                  </div>
                  <p className="mt-3 text-sm text-slate-200">
                    Test, autoevaluaciones y progreso en un solo lugar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cursos" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="font-bold uppercase tracking-wide text-[#0f9f9a]">Cursos disponibles</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#112245] sm:text-4xl">
              Elige el curso que encaja con tu oposición
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              TCAE-SAS y Celador Conductor-SAS incluyen clases grabadas. En IMAS Express, SMS y Celador SMS tendrás tema desarrollado, resúmenes, autoevaluaciones y simulacros.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
            {courses.map((course) => (
              <Card
                key={course.title}
                className={`overflow-hidden rounded-lg border-0 shadow-lg ${
                  course.highlighted ? "ring-2 ring-[#ffd447]" : ""
                }`}
              >
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full bg-[#e7fbfa] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#0f9f9a]">
                        {course.badge}
                      </span>
                      <h3 className="mt-4 text-2xl font-extrabold text-[#112245]">
                        {course.title}
                      </h3>
                      {course.subtitle && (
                        <p className="mt-1 font-semibold text-slate-500">{course.subtitle}</p>
                      )}
                    </div>
                    {course.highlighted && <Star className="h-6 w-6 fill-[#ffd447] text-[#ffd447]" />}
                  </div>
                  <div className="mb-4 rounded-lg bg-[#f6f8fb] p-4">
                    <p
                      className={`font-extrabold text-[#112245] ${
                        course.price === "Próximamente" ? "text-xl" : "text-3xl"
                      }`}
                    >
                      {course.price}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{course.detail}</p>
                  </div>
                  <p className="mb-5 leading-7 text-slate-600">{course.description}</p>
                  <ul className="mb-6 grid gap-2 text-sm font-semibold text-slate-700">
                    {course.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#0f9f9a]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {course.title === "Curso SMS" && (
                    <a
                      href="/#examen-sms"
                      className="mb-4 inline-flex items-center text-sm font-extrabold text-[#112245] underline underline-offset-4 hover:text-[#0f9f9a]"
                    >
                      Ver la prueba del examen SMS
                    </a>
                  )}
                  {course.title === "Curso IMAS Express" && (
                    <a
                      href="/#examen-imas"
                      className="mb-4 inline-flex items-center text-sm font-extrabold text-[#112245] underline underline-offset-4 hover:text-[#0f9f9a]"
                    >
                      Ver la prueba del examen IMAS
                    </a>
                  )}
                  {course.title === "Curso SERMAS Madrid" && (
                    <a
                      href="/#examen-sermas"
                      className="mb-4 inline-flex items-center text-sm font-extrabold text-[#112245] underline underline-offset-4 hover:text-[#0f9f9a]"
                    >
                      Ver la prueba del examen SERMAS
                    </a>
                  )}
                  <Button asChild className="mt-auto h-11 rounded-lg bg-[#0f9f9a] font-bold hover:bg-[#0b817d]">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      Información por WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 max-w-3xl">
            <p className="font-bold uppercase tracking-wide text-[#0f9f9a]">Qué incluye</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#112245] sm:text-4xl">
              Todo lo necesario para estudiar con orden
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {includes.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="rounded-lg border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#112245] text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-extrabold text-[#112245]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="moodle" className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-bold uppercase tracking-wide text-[#0f9f9a]">Acceso a Moodle</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#112245] sm:text-4xl">
              Así estudiarás dentro de Moodle
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Todo el material estará organizado en el aula virtual para que puedas avanzar paso a paso,
              consultar los temas, realizar test y practicar con simulacros.
            </p>
            <div className="mt-6 grid gap-3">
              {moodleItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-[#0f9f9a]" />
                  <span className="font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-xl">
            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#0f9f9a]">
                    Academia LORMAN
                  </p>
                  <h3 className="text-xl font-extrabold text-[#112245]">Curso SMS</h3>
                </div>
                <Laptop className="h-7 w-7 text-[#112245]" />
              </div>
              <div className="space-y-3">
                {[
                  ["Bloque I", "Temas desarrollados y resúmenes"],
                  ["Bloque II", "Autoevaluaciones por tema"],
                  ["Simulacros", "Práctica tipo examen"],
                  ["Calificaciones", "Revisión de aciertos y errores"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-[#112245]">{title}</h4>
                        <p className="mt-1 text-sm text-slate-500">{text}</p>
                      </div>
                      <span className="rounded-full bg-[#e7fbfa] px-3 py-1 text-xs font-bold text-[#0f9f9a]">
                        Moodle
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="examen-sermas" className="bg-[#f7fbff] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <p className="font-bold uppercase tracking-wide text-[#0f9f9a]">
              Prueba del examen SERMAS
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#112245] sm:text-4xl">
              5 preguntas de muestra para TCAE Comunidad de Madrid
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Hemos preparado una pequeña prueba inspirada en preguntas de convocatorias publicadas
              de TCAE de la Comunidad de Madrid para que puedas ver el estilo de examen que suele
              aparecer en SERMAS.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-lg border-[#0f9f9a] px-6 text-base font-extrabold text-[#0f9f9a] hover:bg-[#0f9f9a] hover:text-white"
              >
                <a href={sermasExamWhatsappUrl} target="_blank" rel="noopener noreferrer">
                  Quiero más preguntas del SERMAS
                </a>
              </Button>
              <a
                href="/#examen-sermas"
                className="inline-flex items-center justify-center text-sm font-extrabold text-[#112245] underline underline-offset-4 hover:text-[#0f9f9a]"
              >
                Ir directamente a la prueba SERMAS
              </a>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {sermasExamPreviewQuestions.map((item) => (
              <Card key={item.number} className="rounded-lg border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#e7fbfa] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#0f9f9a]">
                      Pregunta {item.number}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Comunidad de Madrid
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold leading-7 text-[#112245]">
                    {item.question}
                  </h3>
                  <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
                    {item.options.map((option, index) => (
                      <li
                        key={`${item.number}-${index}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <span className="font-extrabold text-[#112245]">
                          {String.fromCharCode(97 + index)})
                        </span>{" "}
                        {option}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 rounded-lg border-0 bg-[#112245] text-white shadow-xl">
            <CardContent className="flex flex-col gap-5 p-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#8ee9e4]">
                  Para seguir practicando
                </p>
                <h3 className="mt-2 text-2xl font-extrabold">
                  ¿Quieres más preguntas, autoevaluaciones y simulacros SERMAS?
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-200">
                  Esta prueba es solo una muestra. Si quieres seguir practicando con más material
                  de TCAE Comunidad de Madrid, escríbenos y te informamos del curso completo.
                </p>
              </div>
              <Button
                asChild
                className="h-12 rounded-lg bg-[#ffd447] px-6 text-base font-extrabold text-[#112245] hover:bg-[#f5c51f]"
              >
                <a href={sermasExamWhatsappUrl} target="_blank" rel="noopener noreferrer">
                  Pedir más información
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="examen-imas" className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <p className="font-bold uppercase tracking-wide text-[#0f9f9a]">
              Prueba del examen IMAS
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#112245] sm:text-4xl">
              20 preguntas reales del examen publicado de TCAE Murcia 2024
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Hemos preparado una muestra basada en el examen oficial publicado
              por Empleo Público de la Región de Murcia el 5 de mayo de 2024
              para que puedas practicar con el tipo de preguntas que suelen
              trabajarse en TCAE IMAS Murcia.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-lg border-[#0f9f9a] px-6 text-base font-extrabold text-[#0f9f9a] hover:bg-[#0f9f9a] hover:text-white"
              >
                <a href={imasExamWhatsappUrl} target="_blank" rel="noopener noreferrer">
                  Quiero más preguntas del IMAS
                </a>
              </Button>
              <a
                href="/#examen-imas"
                className="inline-flex items-center justify-center text-sm font-extrabold text-[#112245] underline underline-offset-4 hover:text-[#0f9f9a]"
              >
                Ir directamente a Prueba del examen IMAS
              </a>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {imasExamPreviewQuestions.map((item) => (
              <Card key={item.number} className="rounded-lg border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#e7fbfa] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#0f9f9a]">
                      Pregunta {item.number}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Examen real Murcia 2024
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold leading-7 text-[#112245]">
                    {item.question}
                  </h3>
                  <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
                    {item.options.map((option, index) => (
                      <li
                        key={`${item.number}-${index}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <span className="font-extrabold text-[#112245]">
                          {String.fromCharCode(97 + index)})
                        </span>{" "}
                        {option}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 rounded-lg border-0 bg-[#112245] text-white shadow-xl">
            <CardContent className="flex flex-col gap-5 p-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#8ee9e4]">
                  Para seguir practicando
                </p>
                <h3 className="mt-2 text-2xl font-extrabold">
                  ¿Quieres más preguntas reales, test y simulacros IMAS?
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-200">
                  Esta prueba es solo una muestra. Si quieres seguir practicando
                  con más preguntas, autocorrecciones y material orientado a
                  TCAE Murcia, escríbenos y te informamos por WhatsApp.
                </p>
              </div>
              <Button
                asChild
                className="h-12 rounded-lg bg-[#ffd447] px-6 text-base font-extrabold text-[#112245] hover:bg-[#f5c51f]"
              >
                <a href={imasExamWhatsappUrl} target="_blank" rel="noopener noreferrer">
                  Pedir más información
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="examen-sms" className="bg-[#eef8f7] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <p className="font-bold uppercase tracking-wide text-[#0f9f9a]">
              Prueba del examen SMS
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#112245] sm:text-4xl">
              20 preguntas reales del último examen publicado de TCAE SMS
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Hemos tomado una muestra del examen oficial publicado por Empleo
              Público de la Región de Murcia para que puedas ver el nivel y el
              tipo de preguntas que aparecen en TCAE del Servicio Murciano de
              Salud.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-lg border-[#0f9f9a] px-6 text-base font-extrabold text-[#0f9f9a] hover:bg-[#0f9f9a] hover:text-white"
              >
                <a href={smsExamWhatsappUrl} target="_blank" rel="noopener noreferrer">
                  Quiero más preguntas del SMS
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {smsExamPreviewQuestions.map((item) => (
              <Card key={item.number} className="rounded-lg border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#e7fbfa] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#0f9f9a]">
                      Pregunta {item.number}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Examen real SMS
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold leading-7 text-[#112245]">
                    {item.question}
                  </h3>
                  <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
                    {item.options.map((option, index) => (
                      <li
                        key={`${item.number}-${index}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <span className="font-extrabold text-[#112245]">
                          {String.fromCharCode(97 + index)})
                        </span>{" "}
                        {option}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 rounded-lg border-0 bg-[#112245] text-white shadow-xl">
            <CardContent className="flex flex-col gap-5 p-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#8ee9e4]">
                  Para seguir practicando
                </p>
                <h3 className="mt-2 text-2xl font-extrabold">
                  ¿Quieres más preguntas reales, autoevaluaciones y simulacros SMS?
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-200">
                  Esta es solo una muestra. Si quieres seguir haciendo más examen
                  SMS de TCAE, ver correcciones y acceder al curso completo,
                  escríbenos y te informamos por WhatsApp.
                </p>
              </div>
              <Button
                asChild
                className="h-12 rounded-lg bg-[#ffd447] px-6 text-base font-extrabold text-[#112245] hover:bg-[#f5c51f]"
              >
                <a href={smsExamWhatsappUrl} target="_blank" rel="noopener noreferrer">
                  Pedir más información
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="precios" className="bg-[#112245] py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="font-bold uppercase tracking-wide text-[#ffd447]">Precios</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Precios claros desde el primer momento
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-7">
            {[
              ["SERMAS Madrid", "95 €", "pago único"],
              ["TCAE-SAS", "25 €/mes", "durante 10 meses"],
              ["Celador Conductor-SAS", "25 €/mes", "curso online"],
              ["IMAS Express", "45 €", "pago único"],
              ["SMS", "90 €", "pago único"],
              ["SMS alumnos IMAS", "65 €", "precio especial"],
              ["Celador SMS", "Próximamente", "apertura pendiente"],
            ].map(([name, price, detail]) => (
              <div key={name} className="rounded-lg border border-white/15 bg-white/10 p-5 text-center">
                <p className="text-sm font-bold uppercase tracking-wide text-[#8ee9e4]">{name}</p>
                <p
                  className={`mt-3 font-extrabold text-[#ffd447] ${
                    price === "Próximamente" ? "text-lg" : "text-3xl"
                  }`}
                >
                  {price}
                </p>
                <p className="mt-2 text-sm text-slate-200">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="font-bold uppercase tracking-wide text-[#0f9f9a]">Contacto</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#112245] sm:text-4xl">
            ¿Quieres matricularte o pedir más información?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Escríbenos y te indicamos el curso que mejor encaja contigo, el precio y los pasos para entrar al aula.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-lg bg-[#0f9f9a] px-7 text-base font-extrabold hover:bg-[#0b817d]">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-lg border-[#112245] px-7 text-base font-extrabold text-[#112245] hover:bg-[#112245] hover:text-white"
            >
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                Síguenos en Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="text-lg font-extrabold">Academia LORMAN</p>
            <p className="mt-1 text-sm text-slate-400">Cursos online de normativa y oposiciones.</p>
          </div>
          <div className="flex justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f9f9a] text-white"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-950"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0f9f9a] text-white shadow-2xl transition hover:scale-105 hover:bg-[#0b817d]"
        aria-label="Pide información por WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </main>
  );
}
