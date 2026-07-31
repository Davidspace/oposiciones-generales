import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const AS_OF = "2026-07-30";
const NEXT_REVIEW = "2026-08-30";
const CREATED_BY = "codex-assisted-practical-draft";

const TRLGSS = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724";
const RECAUDATION = "https://www.boe.es/buscar/act.php?id=BOE-A-2004-15221";
const IMV = "https://www.boe.es/buscar/act.php?id=BOE-A-2021-21007";

const CASES = [
  {
    id: "MC03",
    sourceUrl: TRLGSS,
    title: "Primera liquidación de una plantilla",
    scenario:
      "Una empresa de nueva creación inicia su actividad el 1 de noviembre de 2026. Tiene tres personas trabajadoras en el Régimen General y abona una paga extraordinaria en junio y diciembre. La empresa debe preparar la primera liquidación de cuotas y comunicar cualquier incidencia de la plantilla.",
    assumptions: [
      "Las tres personas están incluidas en el Régimen General y no pertenecen a un sistema especial.",
      "La empresa está inscrita y dispone de un código de cuenta de cotización válido.",
      "Las retribuciones descritas son salariales y no existe una bonificación no indicada.",
      "El caso se resuelve con la normativa vigente al 30 de julio de 2026.",
    ],
    themes: ["ss-04"],
    claimPrefix: "ss-04",
    claimStart: 101,
    difficulty: "medium",
    durationMinutes: 12,
    competencies: [
      "Identificar el sujeto responsable del ingreso de las cuotas.",
      "Determinar los conceptos retributivos que integran la base de cotización.",
      "Aplicar el periodo ordinario de liquidación y pago.",
      "Distinguir la aportación empresarial de la aportación de la persona trabajadora.",
      "Reconocer la obligación de comunicar una variación relevante de la plantilla.",
    ],
    consistencyRules: [
      "Todas las decisiones usan noviembre de 2026 como primer periodo liquidable.",
      "La paga extraordinaria se integra mediante la prorrata que corresponda.",
      "El empresario mantiene la responsabilidad del ingreso de las cuotas propias y de las personas trabajadoras.",
    ],
    questions: [
      {
        id: "ss-04-q301",
        competency: "Identificar el sujeto responsable del ingreso de las cuotas.",
        epigraph: "Tema 4. Cotización y liquidación",
        prompt: "¿Quién debe ingresar ante la Tesorería la cuota empresarial y la cuota de las personas trabajadoras?",
        answer: "La empresa, como sujeto responsable del ingreso conjunto.",
        distractors: ["Cada persona trabajadora por separado.", "La entidad gestora que reconozca la prestación.", "La Inspección de Trabajo de oficio en todos los casos."],
        feedback: "La empresa ingresa su aportación y la de las personas trabajadoras, sin perjuicio del descuento de la aportación de estas en nómina.",
        claimStatement: "En el Régimen General, el empresario es responsable del cumplimiento de la obligación de cotizar y del ingreso de las aportaciones propias y de las personas trabajadoras.",
        sourceLocation: "TRLGSS, artículo 142",
      },
      {
        id: "ss-04-q302",
        competency: "Determinar los conceptos retributivos que integran la base de cotización.",
        epigraph: "Tema 4. Cotización y liquidación",
        prompt: "¿Cómo debe tratarse la paga extraordinaria de junio y diciembre al calcular la base mensual?",
        answer: "Debe computarse mediante la prorrata mensual de las pagas extraordinarias.",
        distractors: ["Solo se computa en el mes en que se cobra.", "Nunca forma parte de la base de cotización.", "Se sustituye siempre por una cantidad fija ajena a la retribución."],
        feedback: "Las percepciones de vencimiento superior al mensual se prorratean para determinar la base mensual, con las reglas y límites aplicables.",
        claimStatement: "La base de cotización comprende la remuneración total y las percepciones de vencimiento superior al mensual se prorratean en los términos legalmente previstos.",
        sourceLocation: "TRLGSS, artículo 147",
      },
      {
        id: "ss-04-q303",
        competency: "Aplicar el periodo ordinario de liquidación y pago.",
        epigraph: "Tema 4. Cotización y liquidación",
        prompt: "¿Cuál es el criterio general para el ingreso ordinario de las cuotas de noviembre?",
        answer: "Se ingresan dentro del plazo reglamentario del mes siguiente al periodo liquidado.",
        distractors: ["El mismo día en que comienza cada relación laboral.", "Solo cuando se publique la convocatoria de oposición.", "Al final del ejercicio natural, sin liquidaciones mensuales."],
        feedback: "El periodo de liquidación y el plazo reglamentario se aplican por mensualidades; no se espera al cierre del año.",
        claimStatement: "Las cuotas del Régimen General se liquidan por mensualidades y se ingresan dentro del plazo reglamentario correspondiente al periodo liquidado.",
        sourceLocation: "TRLGSS, artículos 18 y 29; Reglamento general de recaudación",
      },
      {
        id: "ss-04-q304",
        competency: "Distinguir la aportación empresarial de la aportación de la persona trabajadora.",
        epigraph: "Tema 4. Cotización y liquidación",
        prompt: "¿Qué puede hacer la empresa con la aportación de la persona trabajadora?",
        answer: "Puede descontarla de la nómina en los términos legalmente establecidos, pero debe ingresar el conjunto.",
        distractors: ["Puede dejar de ingresarla si la persona firma una renuncia.", "Debe pagarla siempre la persona directamente a la Tesorería.", "Debe transferirla a la entidad gestora de la prestación."],
        feedback: "El descuento en nómina no elimina la responsabilidad empresarial de ingresar el conjunto de la cotización.",
        claimStatement: "El empresario debe ingresar la aportación propia y la de las personas trabajadoras, pudiendo efectuar el descuento de esta última en la nómina conforme a la ley.",
        sourceLocation: "TRLGSS, artículo 142",
      },
      {
        id: "ss-04-q305",
        competency: "Reconocer la obligación de comunicar una variación relevante de la plantilla.",
        epigraph: "Tema 4. Cotización y liquidación",
        prompt: "Si cambia un dato de una relación laboral que afecta a la cotización, ¿qué debe hacer la empresa?",
        answer: "Comunicar la variación a la Tesorería dentro del plazo reglamentario.",
        distractors: ["Esperar a la siguiente convocatoria para comunicarla.", "Modificar solo el archivo interno de nóminas.", "Comunicarla únicamente a la entidad gestora de una prestación."],
        feedback: "Las variaciones de datos con relevancia para el encuadramiento o la cotización deben comunicarse a la Tesorería por la vía y en el plazo establecidos.",
        claimStatement: "Las empresas deben comunicar a la Tesorería las variaciones de los datos de las personas trabajadoras en los términos reglamentarios.",
        sourceLocation: "TRLGSS, artículos 16 y 139",
      },
    ],
  },
  {
    id: "MC04",
    sourceUrl: RECAUDATION,
    title: "Deuda, periodo voluntario y apremio",
    scenario:
      "Una empresa deja pendiente la liquidación de cuotas de febrero de 2026. Recibe una reclamación de deuda y no acredita el pago dentro del periodo indicado. Más tarde recibe una providencia de apremio y solicita un aplazamiento.",
    assumptions: [
      "La deuda está correctamente determinada y no existe un recurso que suspenda su exigibilidad.",
      "No se declara una garantía, pago parcial o causa de fuerza mayor distinta de las descritas.",
      "La empresa sigue de alta y mantiene actividad durante todo el caso.",
      "El caso se resuelve con la normativa vigente al 30 de julio de 2026.",
    ],
    themes: ["ss-05", "ss-06"],
    claimPrefix: "ss-05",
    claimStart: 101,
    difficulty: "medium",
    durationMinutes: 12,
    competencies: [
      "Distinguir el periodo voluntario del periodo ejecutivo.",
      "Identificar la función de la reclamación de deuda.",
      "Reconocer la providencia de apremio como inicio de la vía ejecutiva.",
      "Explicar el efecto de un aplazamiento concedido.",
      "Separar la deuda de cotización de una sanción administrativa.",
    ],
    consistencyRules: [
      "La empresa no puede tratar el periodo ejecutivo como una ampliación automática del periodo voluntario.",
      "La providencia de apremio se analiza después de la falta de ingreso en plazo.",
      "El aplazamiento solo produce los efectos que reconozca la resolución y la normativa aplicable.",
    ],
    questions: [
      {
        id: "ss-05-q301",
        theme: "ss-05",
        competency: "Distinguir el periodo voluntario del periodo ejecutivo.",
        epigraph: "Tema 5. Gestión recaudatoria en periodo voluntario",
        prompt: "¿Qué ocurre cuando termina el plazo voluntario sin que la empresa ingrese la deuda?",
        answer: "La deuda puede pasar a la vía ejecutiva conforme a las reglas de recaudación.",
        distractors: ["La deuda desaparece automáticamente.", "Se convierte en una prestación económica.", "Se mantiene indefinidamente en periodo voluntario sin consecuencias."],
        feedback: "La falta de ingreso en plazo permite iniciar la vía ejecutiva, con los actos y recargos que correspondan.",
        claimStatement: "La falta de ingreso de una deuda de Seguridad Social dentro del periodo voluntario permite iniciar la recaudación en vía ejecutiva.",
        sourceLocation: "TRLGSS, artículos 29 y 30",
      },
      {
        id: "ss-05-q302",
        theme: "ss-05",
        competency: "Identificar la función de la reclamación de deuda.",
        epigraph: "Tema 5. Gestión recaudatoria en periodo voluntario",
        prompt: "¿Qué finalidad tiene una reclamación de deuda de la Tesorería?",
        answer: "Determinar y exigir el importe pendiente con la información y los plazos previstos.",
        distractors: ["Reconocer una pensión de jubilación.", "Imponer por sí sola una pena penal.", "Sustituir la inscripción de la empresa."],
        feedback: "La reclamación es un acto recaudatorio dirigido a hacer efectiva una deuda, no un reconocimiento de prestación ni una sanción penal.",
        claimStatement: "La reclamación de deuda es un acto de gestión recaudatoria que identifica y exige una deuda de Seguridad Social en los supuestos legalmente previstos.",
        sourceLocation: "TRLGSS, artículos 33 y 34",
      },
      {
        id: "ss-06-q303",
        theme: "ss-06",
        competency: "Reconocer la providencia de apremio como inicio de la vía ejecutiva.",
        epigraph: "Tema 6. Recaudación en vía ejecutiva",
        prompt: "¿Qué expresa la providencia de apremio recibida por la empresa?",
        answer: "El inicio del procedimiento ejecutivo para cobrar la deuda no ingresada.",
        distractors: ["La apertura de un periodo voluntario nuevo sin límite.", "La afiliación de oficio de la plantilla.", "La concesión automática de un aplazamiento."],
        feedback: "La providencia de apremio dirige la ejecución recaudatoria; no concede por sí misma un nuevo periodo voluntario ni un aplazamiento.",
        claimStatement: "La providencia de apremio es el acto que inicia la vía ejecutiva de recaudación de las deudas de Seguridad Social.",
        sourceLocation: "TRLGSS, artículos 38 y 39; Reglamento general de recaudación",
      },
      {
        id: "ss-05-q304",
        theme: "ss-05",
        competency: "Explicar el efecto de un aplazamiento concedido.",
        epigraph: "Tema 5. Gestión recaudatoria en periodo voluntario",
        prompt: "Si la Tesorería concede un aplazamiento válido, ¿qué debe hacer la empresa?",
        answer: "Cumplir las condiciones, plazos y garantías fijados en la resolución.",
        distractors: ["Dejar de pagar hasta que termine la actividad.", "Considerar extinguida la deuda desde la solicitud.", "Aplicar el aplazamiento a cualquier sanción sin resolución."],
        feedback: "La solicitud no extingue la deuda; el aplazamiento concedido obliga a cumplir las condiciones de su resolución.",
        claimStatement: "El aplazamiento de una deuda de Seguridad Social produce los efectos previstos en la resolución y exige cumplir sus condiciones de pago.",
        sourceLocation: "TRLGSS, artículo 23; Reglamento general de recaudación",
      },
      {
        id: "ss-06-q305",
        theme: "ss-06",
        competency: "Separar la deuda de cotización de una sanción administrativa.",
        epigraph: "Tema 6. Recaudación en vía ejecutiva",
        prompt: "¿Cómo debe calificarse la cantidad pendiente por cuotas no ingresadas?",
        answer: "Como deuda de cotización exigible por los procedimientos recaudatorios.",
        distractors: ["Como una prestación contributiva a favor de la empresa.", "Como una sanción penal automática.", "Como una tasa municipal."],
        feedback: "La deuda de cuotas tiene naturaleza recaudatoria; pueden existir responsabilidades adicionales, pero no se transforma por ello en una prestación.",
        claimStatement: "Las cuotas no ingresadas constituyen una deuda de Seguridad Social que se exige mediante el procedimiento recaudatorio correspondiente.",
        sourceLocation: "TRLGSS, artículos 18 y 30",
      },
    ],
  },
  {
    id: "MC05",
    sourceUrl: TRLGSS,
    title: "Cadena de incapacidad",
    scenario:
      "Una trabajadora del Régimen General inicia una baja médica por enfermedad común. La situación continúa durante meses, se emite un alta médica y, después, aparece una nueva baja por una dolencia relacionada. El caso exige ordenar los efectos de cada fase.",
    assumptions: [
      "La trabajadora está afiliada y en alta o situación asimilada al alta cuando se inicia la incapacidad.",
      "No se declara accidente de trabajo ni una contingencia profesional.",
      "Los partes médicos son válidos y las fechas indicadas son las únicas relevantes.",
      "El caso se resuelve con la normativa vigente al 30 de julio de 2026.",
    ],
    themes: ["ss-07", "ss-08"],
    claimPrefix: "ss-07",
    claimStart: 101,
    difficulty: "high",
    durationMinutes: 14,
    competencies: [
      "Identificar la contingencia de incapacidad temporal.",
      "Aplicar la duración máxima ordinaria de la incapacidad temporal.",
      "Distinguir el alta médica de la declaración de incapacidad permanente.",
      "Reconocer el papel del Instituto Nacional de la Seguridad Social en las fases de control.",
      "Ordenar una nueva baja sin mezclarla con la situación anterior.",
    ],
    consistencyRules: [
      "La primera baja se analiza como contingencia común.",
      "El alta médica no equivale por sí sola a una incapacidad permanente.",
      "Cada nueva baja se vincula a sus propios hechos y fecha de efectos.",
    ],
    questions: [
      {
        id: "ss-07-q301",
        theme: "ss-07",
        competency: "Identificar la contingencia de incapacidad temporal.",
        epigraph: "Tema 7. Acción protectora",
        prompt: "¿Qué contingencia se analiza en la primera baja médica descrita?",
        answer: "Incapacidad temporal derivada de enfermedad común.",
        distractors: ["Jubilación contributiva.", "Desempleo total.", "Muerte y supervivencia."],
        feedback: "El escenario declara una enfermedad común y una baja médica temporal; no introduce accidente laboral ni jubilación.",
        claimStatement: "La incapacidad temporal protege la falta de capacidad para trabajar por enfermedad común o accidente durante el periodo legalmente previsto.",
        sourceLocation: "TRLGSS, artículos 169 y 172",
      },
      {
        id: "ss-08-q302",
        theme: "ss-08",
        competency: "Aplicar la duración máxima ordinaria de la incapacidad temporal.",
        epigraph: "Tema 8. Incapacidad temporal y permanente",
        prompt: "¿Cuál es la duración máxima ordinaria de la incapacidad temporal por enfermedad común?",
        answer: "365 días, con la posible prórroga legal de 180 días cuando proceda.",
        distractors: ["30 días en todos los casos.", "180 días sin posibilidad de prórroga.", "Indefinidamente hasta que la persona solicite jubilación."],
        feedback: "La regla general combina 365 días y, si se cumplen las condiciones, una prórroga de 180 días.",
        claimStatement: "La incapacidad temporal tiene una duración máxima de 365 días, prorrogable por otros 180 cuando se presuma la curación durante ese periodo.",
        sourceLocation: "TRLGSS, artículo 169",
      },
      {
        id: "ss-08-q303",
        theme: "ss-08",
        competency: "Distinguir el alta médica de la declaración de incapacidad permanente.",
        epigraph: "Tema 8. Incapacidad temporal y permanente",
        prompt: "¿Qué efecto tiene el alta médica que aparece en el caso?",
        answer: "Finaliza la situación de incapacidad temporal en la fecha que corresponda.",
        distractors: ["Reconoce automáticamente una incapacidad permanente.", "Concede una pensión de jubilación.", "Extiende siempre la baja seis meses más."],
        feedback: "El alta médica termina la incapacidad temporal; una incapacidad permanente exige su propio procedimiento y resolución.",
        claimStatement: "El alta médica pone fin a la situación de incapacidad temporal, sin equivaler automáticamente a una declaración de incapacidad permanente.",
        sourceLocation: "TRLGSS, artículos 170 y 174",
      },
      {
        id: "ss-07-q304",
        theme: "ss-07",
        competency: "Reconocer el papel del Instituto Nacional de la Seguridad Social en las fases de control.",
        epigraph: "Tema 7. Acción protectora",
        prompt: "¿Qué organismo tiene atribuidas funciones decisorias en las fases finales de control de la incapacidad temporal?",
        answer: "El Instituto Nacional de la Seguridad Social, en los términos previstos legalmente.",
        distractors: ["El ayuntamiento del domicilio.", "La empresa sin intervención del sistema.", "El Servicio Público de Empleo Estatal en todos los casos."],
        feedback: "La gestión y control de la incapacidad temporal se distribuyen, pero el INSS tiene atribuciones decisorias en las fases previstas por la ley.",
        claimStatement: "El Instituto Nacional de la Seguridad Social ejerce las competencias decisorias que la ley le atribuye en la incapacidad temporal y permanente.",
        sourceLocation: "TRLGSS, artículos 170 y 174",
      },
      {
        id: "ss-08-q305",
        theme: "ss-08",
        competency: "Ordenar una nueva baja sin mezclarla con la situación anterior.",
        epigraph: "Tema 8. Incapacidad temporal y permanente",
        prompt: "¿Cómo debe analizarse la nueva baja posterior al alta médica?",
        answer: "Como una nueva situación, atendiendo a su fecha, causa y reglas de recaída que procedan.",
        distractors: ["Como una prórroga automática de la primera baja.", "Como una jubilación anticipada.", "Como una deuda de cotización."],
        feedback: "La nueva baja no se incorpora sin más a la anterior; deben comprobarse sus hechos y, si procede, las reglas de recaída.",
        claimStatement: "Una baja posterior al alta se analiza según sus propios hechos y puede quedar sujeta a las reglas legales de nueva situación o recaída.",
        sourceLocation: "TRLGSS, artículos 169, 170 y 174",
      },
    ],
  },
  {
    id: "MC06",
    sourceUrl: TRLGSS,
    title: "Modalidad de jubilación",
    scenario:
      "Una persona trabajadora del Régimen General cumple la edad ordinaria y acredita una larga carrera de cotización. Valora jubilarse de forma ordinaria, solicitar una modalidad anticipada o compatibilizar parte del trabajo con la pensión.",
    assumptions: [
      "La persona reúne los periodos de cotización que se indican en cada pregunta.",
      "No se declara una profesión con coeficientes reductores ni una discapacidad específica.",
      "Las decisiones se refieren al régimen general de la pensión contributiva.",
      "El caso se resuelve con la normativa vigente al 30 de julio de 2026.",
    ],
    themes: ["ss-07", "ss-10"],
    claimPrefix: "ss-07",
    claimStart: 111,
    difficulty: "high",
    durationMinutes: 14,
    competencies: [
      "Identificar los requisitos generales de la jubilación contributiva.",
      "Distinguir jubilación ordinaria y anticipada voluntaria.",
      "Reconocer que la jubilación anticipada exige requisitos adicionales.",
      "Aplicar la idea de compatibilidad condicionada del trabajo con la pensión.",
      "Separar la modalidad de jubilación del cálculo de la cuantía.",
    ],
    consistencyRules: [
      "No se aplican coeficientes especiales que el escenario no declare.",
      "La modalidad se decide antes de calcular la cuantía.",
      "La compatibilidad entre trabajo y pensión siempre queda sujeta a las condiciones legales.",
    ],
    questions: [
      {
        id: "ss-07-q311",
        theme: "ss-07",
        competency: "Identificar los requisitos generales de la jubilación contributiva.",
        epigraph: "Tema 10. Jubilación contributiva",
        prompt: "¿Qué combinación describe el requisito general mínimo de cotización para la jubilación contributiva?",
        answer: "Quince años de cotización, con al menos dos dentro de los quince años anteriores al hecho causante.",
        distractors: ["Cinco años, todos en el último año.", "Quince meses sin ninguna cotización previa.", "Treinta y cinco años siempre, sin alternativa legal."],
        feedback: "La regla general exige 15 años, con la carencia específica de 2 años dentro de los 15 anteriores, sin perjuicio de otros requisitos.",
        claimStatement: "La pensión contributiva de jubilación exige, con carácter general, quince años de cotización y dos dentro de los quince años inmediatamente anteriores.",
        sourceLocation: "TRLGSS, artículo 205",
      },
      {
        id: "ss-10-q312",
        theme: "ss-10",
        competency: "Distinguir jubilación ordinaria y anticipada voluntaria.",
        epigraph: "Tema 10. Jubilación contributiva",
        prompt: "¿Qué distingue a la jubilación anticipada voluntaria de la ordinaria?",
        answer: "Permite adelantar la edad dentro de los límites legales y exige requisitos adicionales.",
        distractors: ["Permite jubilarse sin ninguna cotización.", "Elimina toda reducción de cuantía.", "Se concede siempre por decisión unilateral de la empresa."],
        feedback: "La anticipación no es automática: está limitada por edad, cotización, situación y demás requisitos, y puede afectar a la cuantía.",
        claimStatement: "La jubilación anticipada voluntaria es una modalidad limitada por requisitos específicos y puede aplicar coeficientes reductores.",
        sourceLocation: "TRLGSS, artículo 208",
      },
      {
        id: "ss-07-q313",
        theme: "ss-10",
        competency: "Reconocer que la jubilación anticipada exige requisitos adicionales.",
        epigraph: "Tema 10. Jubilación contributiva",
        prompt: "¿Qué debe comprobarse antes de aceptar una solicitud de jubilación anticipada?",
        answer: "La edad, la cotización, la situación de alta o asimilada y los demás requisitos de la modalidad.",
        distractors: ["Solo el salario del último mes.", "Únicamente la nacionalidad.", "La existencia de una incapacidad temporal vigente en cualquier caso."],
        feedback: "La modalidad se reconoce tras comprobar el conjunto de requisitos legales, no un único dato económico o personal.",
        claimStatement: "La jubilación anticipada voluntaria requiere comprobar conjuntamente edad, cotización y las demás condiciones de acceso previstas en la ley.",
        sourceLocation: "TRLGSS, artículo 208",
      },
      {
        id: "ss-10-q314",
        theme: "ss-10",
        competency: "Aplicar la idea de compatibilidad condicionada del trabajo con la pensión.",
        epigraph: "Tema 10. Jubilación contributiva",
        prompt: "¿Cómo debe calificarse la posibilidad de trabajar y percibir una pensión en jubilación activa?",
        answer: "Como una compatibilidad condicionada a los requisitos y efectos de la ley.",
        distractors: ["Como una compatibilidad absoluta sin límites.", "Como una prohibición absoluta en todo caso.", "Como una prestación de desempleo."],
        feedback: "La jubilación activa no elimina las condiciones legales: la compatibilidad, su porcentaje y sus efectos dependen de la modalidad y de los requisitos.",
        claimStatement: "La compatibilidad entre trabajo y pensión en la jubilación activa está sometida a las condiciones, porcentaje y efectos establecidos legalmente.",
        sourceLocation: "TRLGSS, artículo 214",
      },
      {
        id: "ss-10-q315",
        theme: "ss-10",
        competency: "Separar la modalidad de jubilación del cálculo de la cuantía.",
        epigraph: "Tema 10. Jubilación contributiva",
        prompt: "¿Qué orden de análisis es correcto en un expediente de jubilación?",
        answer: "Primero se comprueba la modalidad y los requisitos; después se calcula la cuantía aplicable.",
        distractors: ["Se calcula la cuantía antes de saber si existe derecho.", "Se concede siempre la cuantía máxima.", "La cuantía decide por sí sola la modalidad."],
        feedback: "El derecho y la modalidad deben estar determinados antes de aplicar las reglas de cálculo y porcentajes.",
        claimStatement: "El reconocimiento de la jubilación exige comprobar primero el derecho y la modalidad, y después aplicar las reglas de cálculo de la pensión.",
        sourceLocation: "TRLGSS, artículos 205 y 209",
      },
    ],
  },
  {
    id: "MC07",
    sourceUrl: TRLGSS,
    title: "Muerte y supervivencia",
    scenario:
      "Una persona fallece estando incluida en el sistema. Deja cónyuge, una hija de 19 años que estudia y un hijo adulto con una discapacidad reconocida. La familia solicita las prestaciones de muerte y supervivencia que considera aplicables.",
    assumptions: [
      "El fallecimiento y la situación de alta cumplen las condiciones generales declaradas.",
      "No existe sentencia de separación o divorcio con efectos distintos a los descritos.",
      "La hija y el hijo acreditan las circunstancias personales indicadas.",
      "El caso se resuelve con la normativa vigente al 30 de julio de 2026.",
    ],
    themes: ["ss-07", "ss-11"],
    claimPrefix: "ss-07",
    claimStart: 121,
    difficulty: "high",
    durationMinutes: 14,
    competencies: [
      "Identificar las prestaciones de muerte y supervivencia.",
      "Distinguir la pensión de viudedad de la pensión de orfandad.",
      "Aplicar los límites de edad y discapacidad en la orfandad.",
      "Reconocer el auxilio por defunción como prestación diferente.",
      "Evitar convertir la condición familiar en un reconocimiento automático.",
    ],
    consistencyRules: [
      "Cada posible beneficiario se analiza por separado.",
      "La relación familiar no sustituye los requisitos de la prestación.",
      "La prestación de viudedad y la de orfandad tienen reglas propias.",
    ],
    questions: [
      {
        id: "ss-07-q321",
        theme: "ss-07",
        competency: "Identificar las prestaciones de muerte y supervivencia.",
        epigraph: "Tema 11. Muerte y supervivencia",
        prompt: "¿Qué bloque de acción protectora debe analizar la familia?",
        answer: "Las prestaciones de muerte y supervivencia.",
        distractors: ["Solo la jubilación ordinaria.", "La cotización por desempleo.", "La incapacidad temporal de la persona fallecida."],
        feedback: "El fallecimiento activa el análisis de viudedad, orfandad y otras prestaciones de muerte y supervivencia.",
        claimStatement: "La acción protectora incluye prestaciones de muerte y supervivencia para las personas beneficiarias que cumplan los requisitos.",
        sourceLocation: "TRLGSS, capítulo XIV del título II",
      },
      {
        id: "ss-11-q322",
        theme: "ss-11",
        competency: "Distinguir la pensión de viudedad de la pensión de orfandad.",
        epigraph: "Tema 11. Muerte y supervivencia",
        prompt: "¿Qué prestación se analiza para el cónyuge superviviente?",
        answer: "La pensión de viudedad, si se cumplen sus requisitos.",
        distractors: ["La pensión de orfandad.", "El ingreso mínimo vital como prestación derivada.", "La incapacidad permanente del causante."],
        feedback: "La viudedad protege a quien mantiene la relación familiar o de pareja reconocida por la ley; la orfandad se analiza para hijos y asimilados.",
        claimStatement: "La pensión de viudedad protege al cónyuge o persona beneficiaria que reúna los requisitos establecidos tras el fallecimiento del causante.",
        sourceLocation: "TRLGSS, artículos 219 y 220",
      },
      {
        id: "ss-11-q323",
        theme: "ss-11",
        competency: "Aplicar los límites de edad y discapacidad en la orfandad.",
        epigraph: "Tema 11. Muerte y supervivencia",
        prompt: "¿Qué dato permite analizar una posible pensión de orfandad para la hija de 19 años?",
        answer: "Su edad está dentro del límite general, sin perjuicio del resto de requisitos.",
        distractors: ["La edad impide siempre la orfandad desde los 18 años.", "Solo puede acceder si tiene una relación laboral.", "La condición de estudiante convierte automáticamente la prestación en jubilación."],
        feedback: "La edad de 19 años no excluye por sí sola la orfandad; deben comprobarse además las condiciones del causante y del beneficiario.",
        claimStatement: "La pensión de orfandad puede reconocerse a hijos dentro de los límites de edad y demás condiciones establecidos por la ley.",
        sourceLocation: "TRLGSS, artículo 224",
      },
      {
        id: "ss-07-q324",
        theme: "ss-11",
        competency: "Reconocer el auxilio por defunción como prestación diferente.",
        epigraph: "Tema 11. Muerte y supervivencia",
        prompt: "¿Cómo debe calificarse el auxilio por defunción?",
        answer: "Como una prestación económica distinta de las pensiones de viudedad y orfandad.",
        distractors: ["Como una cuota de cotización mensual.", "Como una jubilación anticipada.", "Como una sanción por no comunicar el fallecimiento."],
        feedback: "El auxilio por defunción es una prestación específica de muerte y supervivencia y no sustituye a las pensiones.",
        claimStatement: "El auxilio por defunción es una prestación de muerte y supervivencia distinta de las pensiones de viudedad y orfandad.",
        sourceLocation: "TRLGSS, artículo 218",
      },
      {
        id: "ss-11-q325",
        theme: "ss-11",
        competency: "Evitar convertir la condición familiar en un reconocimiento automático.",
        epigraph: "Tema 11. Muerte y supervivencia",
        prompt: "¿Qué debe hacer la entidad gestora ante cada solicitud familiar?",
        answer: "Comprobar los requisitos del causante, del beneficiario y de la prestación solicitada.",
        distractors: ["Conceder todas las prestaciones sin comprobar datos.", "Denegar siempre la solicitud por existir varios familiares.", "Trasladar la decisión a la empresa del causante."],
        feedback: "El parentesco inicia el análisis, pero cada prestación exige comprobar sus requisitos y efectos.",
        claimStatement: "El reconocimiento de una prestación de muerte y supervivencia exige comprobar los requisitos del causante y de cada beneficiario.",
        sourceLocation: "TRLGSS, artículos 216 a 228",
      },
    ],
  },
  {
    id: "MC08",
    sourceUrl: IMV,
    title: "Acceso y mantenimiento del IMV",
    scenario:
      "Una unidad de convivencia solicita el ingreso mínimo vital. La solicitud incluye ingresos del ejercicio anterior, residencia en España y una variación posterior de los ingresos de una persona integrante. La unidad pregunta qué debe comunicar y cómo se revisa la prestación.",
    assumptions: [
      "La unidad de convivencia está constituida conforme a la definición legal y sus miembros están identificados.",
      "La residencia y los ingresos se acreditan con la documentación requerida.",
      "No se introduce una prestación autonómica incompatible ni una sanción.",
      "El caso se resuelve con la normativa vigente al 30 de julio de 2026.",
    ],
    themes: ["ss-07", "ss-12"],
    claimPrefix: "ss-07",
    claimStart: 131,
    difficulty: "high",
    durationMinutes: 14,
    competencies: [
      "Identificar el ámbito subjetivo del ingreso mínimo vital.",
      "Comprobar la residencia y la vulnerabilidad económica.",
      "Distinguir la unidad de convivencia de la persona individual.",
      "Reconocer la obligación de comunicar cambios relevantes.",
      "Aplicar la revisión periódica de la prestación.",
    ],
    consistencyRules: [
      "La unidad de convivencia se analiza con sus miembros y relaciones declaradas.",
      "Los ingresos y el patrimonio se valoran con el periodo y los umbrales aplicables.",
      "La variación posterior no se ignora por haber reconocido inicialmente la prestación.",
    ],
    questions: [
      {
        id: "ss-07-q331",
        theme: "ss-07",
        competency: "Identificar el ámbito subjetivo del ingreso mínimo vital.",
        epigraph: "Tema 12. Prestaciones no contributivas, asistenciales e IMV",
        prompt: "¿Qué prestación se está solicitando en el escenario?",
        answer: "El ingreso mínimo vital, prestación económica de la Seguridad Social.",
        distractors: ["La pensión contributiva de jubilación.", "La prestación por incapacidad temporal.", "Una cuota de recaudación ejecutiva."],
        feedback: "El IMV es una prestación económica no contributiva destinada a prevenir el riesgo de pobreza y exclusión social.",
        claimStatement: "El ingreso mínimo vital es una prestación económica de la Seguridad Social dirigida a prevenir el riesgo de pobreza y exclusión social.",
        sourceLocation: "Ley 19/2021, artículos 1 y 2",
      },
      {
        id: "ss-12-q332",
        theme: "ss-12",
        competency: "Comprobar la residencia y la vulnerabilidad económica.",
        epigraph: "Tema 12. Prestaciones no contributivas, asistenciales e IMV",
        prompt: "¿Qué debe comprobarse antes de reconocer el IMV?",
        answer: "La residencia y la situación de vulnerabilidad económica conforme a los requisitos legales.",
        distractors: ["Solo la edad de quien presenta la solicitud.", "La existencia de una deuda empresarial.", "El número de horas de clase semanal."],
        feedback: "El reconocimiento exige comprobar los requisitos subjetivos y económicos, no un único dato aislado.",
        claimStatement: "El reconocimiento del IMV exige acreditar la residencia y la vulnerabilidad económica en los términos de la Ley 19/2021.",
        sourceLocation: "Ley 19/2021, artículos 7 a 11",
      },
      {
        id: "ss-12-q333",
        theme: "ss-12",
        competency: "Distinguir la unidad de convivencia de la persona individual.",
        epigraph: "Tema 12. Prestaciones no contributivas, asistenciales e IMV",
        prompt: "¿Qué debe identificarse en la solicitud presentada por varias personas que conviven?",
        answer: "La unidad de convivencia y las personas que la integran, con sus relaciones y circunstancias.",
        distractors: ["Solo el miembro que presenta el formulario.", "La empresa en la que trabajó cada miembro.", "Únicamente el domicilio de la entidad gestora."],
        feedback: "La unidad de convivencia es relevante para determinar el ámbito subjetivo, los ingresos y la cuantía del IMV.",
        claimStatement: "La unidad de convivencia se define legalmente y sus integrantes deben identificarse para valorar el derecho al IMV.",
        sourceLocation: "Ley 19/2021, artículos 6 y 8",
      },
      {
        id: "ss-07-q334",
        theme: "ss-12",
        competency: "Reconocer la obligación de comunicar cambios relevantes.",
        epigraph: "Tema 12. Prestaciones no contributivas, asistenciales e IMV",
        prompt: "¿Qué debe hacer la unidad cuando aumentan los ingresos de una persona integrante?",
        answer: "Comunicar la variación cuando sea un dato relevante para la prestación.",
        distractors: ["Ocultarla hasta la siguiente renovación.", "Comunicarla solo a la empresa.", "Solicitar una jubilación por el cambio de ingresos."],
        feedback: "Los cambios que pueden afectar al derecho o a la cuantía deben comunicarse y pueden ser objeto de comprobación.",
        claimStatement: "Las personas beneficiarias del IMV deben comunicar las variaciones que puedan afectar al derecho o a la cuantía de la prestación.",
        sourceLocation: "Ley 19/2021, artículos 17 y 19",
      },
      {
        id: "ss-12-q335",
        theme: "ss-12",
        competency: "Aplicar la revisión periódica de la prestación.",
        epigraph: "Tema 12. Prestaciones no contributivas, asistenciales e IMV",
        prompt: "¿Cómo se mantiene el IMV cuando cambian los datos económicos?",
        answer: "La entidad gestora revisa el derecho y la cuantía con los datos y reglas aplicables.",
        distractors: ["La cuantía queda congelada para siempre.", "Se transforma automáticamente en jubilación.", "Solo se revisa si la persona renuncia."],
        feedback: "El IMV no queda inalterado: el derecho y la cuantía pueden revisarse con los datos económicos y familiares.",
        claimStatement: "El derecho al IMV y su cuantía se revisan conforme a los datos económicos y familiares y a las reglas de la Ley 19/2021.",
        sourceLocation: "Ley 19/2021, artículos 12, 13 y 17",
      },
    ],
  },
];

function provenance(summary) {
  return {
    createdBy: CREATED_BY,
    createdAt: AS_OF,
    changeLog: [
      {
        version: "0.1.0",
        date: AS_OF,
        changedBy: CREATED_BY,
        summary,
      },
    ],
  };
}

function writeJson(path, value) {
  return writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function errorType(index) {
  return [
    "confusion-conceptos",
    "confusion-plazos",
    "confusion-sujetos",
    "confusion-requisitos",
  ][index % 4];
}

function buildQuestion(practicalCase, question, claimId) {
  const theme = question.theme ?? practicalCase.themes[0];
  return {
    id: question.id,
    version: "0.1.0",
    status: "draft",
    themes: [theme],
    epigraph: question.epigraph,
    competency: question.competency,
    difficulty: practicalCase.difficulty,
    prompt: question.prompt,
    options: [
      {
        text: question.answer,
        isCorrect: true,
        feedback: question.feedback,
      },
      ...question.distractors.map((text, index) => ({
        text,
        isCorrect: false,
        feedback: `Esta alternativa no resuelve correctamente el hecho descrito. Revisa ${question.sourceLocation}.`,
        errorType: errorType(index),
        reviewTarget: `${question.epigraph}: ${question.competency}`,
      })),
    ],
    normativeClaimIds: [claimId],
    sources: [
      {
        url: question.sourceUrl ?? practicalCase.sourceUrl ?? TRLGSS,
        location: question.sourceLocation,
        consultedAt: AS_OF,
      },
    ],
    validFrom: AS_OF,
    validTo: null,
    legislationCutoffAt: AS_OF,
    visibility: "practice",
    academicReviewStatus: "pending",
    legalReviewStatus: "pending",
    nextReviewAt: NEXT_REVIEW,
    provenance: provenance(`Borrador inicial de ${practicalCase.id}, pregunta conectada al caso.`),
  };
}

async function generate() {
  const caseDirectory = resolve(projectRoot, "content-source/cases");
  const questionDirectory = resolve(projectRoot, "content-source/questions");
  const claimDirectory = resolve(projectRoot, "content-source/claims");
  await Promise.all([
    mkdir(caseDirectory, { recursive: true }),
    mkdir(questionDirectory, { recursive: true }),
    mkdir(claimDirectory, { recursive: true }),
  ]);

  const moduleCaseMap = new Map();
  for (const practicalCase of CASES) {
    const questionIds = [];
    const normativeClaimIds = [];
    for (const [index, question] of practicalCase.questions.entries()) {
      const claimId = `clm-${practicalCase.claimPrefix}-${String(practicalCase.claimStart + index).padStart(3, "0")}`;
      questionIds.push(question.id);
      normativeClaimIds.push(claimId);
      const sourceUrl = question.sourceUrl ?? practicalCase.sourceUrl ?? TRLGSS;
      const claim = {
        claimId,
        assetId: practicalCase.id,
        version: "0.1.0",
        statement: question.claimStatement,
        sourceUrl,
        sourceLocation: question.sourceLocation,
        officialPublication: sourceUrl === IMV ? "BOE-A-2021-21007" : sourceUrl === RECAUDATION ? "BOE-A-2004-15221" : "BOE-A-2015-11724",
        validFrom: AS_OF,
        validTo: null,
        legislationCutoffAt: AS_OF,
        owner: "equipo-editorial-ss-casolab",
        reviewStatus: "pending",
        sourceCheckedAt: AS_OF,
        reviewedAt: null,
        nextReviewAt: NEXT_REVIEW,
        dependentAssetIds: [practicalCase.id, question.id],
        provenance: provenance(`Afirmación normativa de borrador para ${practicalCase.id}.`),
      };
      const builtQuestion = buildQuestion(practicalCase, question, claimId);
      await Promise.all([
        writeJson(resolve(claimDirectory, `${claimId}.json`), claim),
        writeJson(resolve(questionDirectory, `${question.id}.json`), builtQuestion),
      ]);
    }

    const competencies = [...new Set(practicalCase.questions.map(({ competency }) => competency))];
    const coverage = practicalCase.questions.map((question) => ({
      themeId: question.theme ?? practicalCase.themes[0],
      competency: question.competency,
      questionIds: [question.id],
    }));
    const caseDocument = {
      id: practicalCase.id,
      version: "0.1.0",
      status: "draft",
      type: "microcase",
      title: practicalCase.title,
      scenario: practicalCase.scenario,
      originality: "original",
      assumptions: practicalCase.assumptions,
      themes: practicalCase.themes,
      competencies,
      coverage,
      questionIds,
      consistencyRules: practicalCase.consistencyRules,
      durationMinutes: practicalCase.durationMinutes,
      scoring: { correct: 1, wrong: -0.25, blank: 0 },
      difficulty: practicalCase.difficulty,
      visibility: "practice",
      normativeClaimIds,
      validFrom: AS_OF,
      validTo: null,
      legislationCutoffAt: AS_OF,
      nextReviewAt: NEXT_REVIEW,
      academicReviewStatus: "pending",
      legalReviewStatus: "pending",
      provenance: provenance(`Borrador original de ${practicalCase.id} con cinco decisiones conectadas.`),
    };
    await writeJson(resolve(caseDirectory, `${practicalCase.id}.json`), caseDocument);
    for (const theme of practicalCase.themes) {
      const ids = moduleCaseMap.get(theme) ?? [];
      ids.push(practicalCase.id);
      moduleCaseMap.set(theme, ids);
    }
  }

  const catalog = JSON.parse(await readFile(new URL("../content-source/catalog.json", import.meta.url), "utf8"));
  for (const theme of catalog.themes) {
    const newCaseIds = moduleCaseMap.get(theme.id) ?? [];
    if (newCaseIds.length === 0) continue;
    const modulePath = resolve(projectRoot, `content-source/modules/${theme.moduleId}/module.json`);
    const learningModule = JSON.parse(await readFile(modulePath, "utf8"));
    const merged = [...new Set([...(learningModule.microcaseIds ?? []), ...newCaseIds])].sort();
    if (JSON.stringify(merged) === JSON.stringify(learningModule.microcaseIds ?? [])) continue;
    learningModule.microcaseIds = merged;
    learningModule.version = "0.2.0";
    learningModule.provenance.changeLog.push({
      version: "0.2.0",
      date: AS_OF,
      changedBy: CREATED_BY,
      summary: "Asociación de microcasos prácticos adicionales; revisiones pendientes.",
    });
    await writeJson(modulePath, learningModule);
  }
  process.stdout.write(`Generados ${CASES.length} microcasos y ${CASES.reduce((sum, item) => sum + item.questions.length, 0)} preguntas prácticas de borrador.\n`);
}

await generate();
