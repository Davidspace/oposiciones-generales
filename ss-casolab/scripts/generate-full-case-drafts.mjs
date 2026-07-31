import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const AS_OF = "2026-07-30";
const NEXT_REVIEW = "2026-08-30";
const CREATED_BY = "codex-assisted-full-case-draft";

const TRLGSS = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724";
const RECAUDATION = "https://www.boe.es/buscar/act.php?id=BOE-A-2004-15221";
const LPAC = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10565";
const LJCA = "https://www.boe.es/buscar/act.php?id=BOE-A-1998-16718";
const IMV = "https://www.boe.es/buscar/act.php?id=BOE-A-2021-21007";

function item(theme, competency, prompt, answer, claimStatement, sourceLocation, sourceUrl = TRLGSS) {
  return { theme, competency, prompt, answer, claimStatement, sourceLocation, sourceUrl };
}

const CASES = [
  {
    id: "CP02",
    title: "Deuda empresarial, aplazamiento y vÃ­a ejecutiva",
    sourceUrl: RECAUDATION,
    themes: ["ss-04", "ss-05", "ss-06", "ss-07", "g-15", "g-17", "g-18"],
    difficulty: "high",
    durationMinutes: 40,
    scenario:
      "Una empresa mantiene impagadas las cuotas de mayo de 2026 y presenta una liquidaciÃ³n complementaria con errores en la base. La TesorerÃ­a General de la Seguridad Social corrige la deuda y emite una reclamaciÃ³n. La empresa no ingresa dentro del plazo, recibe una providencia de apremio, solicita un aplazamiento y comunica que parte de sus bienes estÃ¡n depositados por un tercero. Al mismo tiempo, una persona trabajadora solicita una prestaciÃ³n y la empresa pretende que la deuda recaudatoria determine por sÃ­ sola la respuesta sobre esa prestaciÃ³n.",
    assumptions: [
      "La deuda corresponde a cuotas del RÃ©gimen General y estÃ¡ identificada por periodo y sujeto responsable.",
      "No existe pago completo, suspensiÃ³n cautelar ni resoluciÃ³n firme que deje sin efecto la deuda.",
      "La solicitud de aplazamiento se presenta despuÃ©s de la providencia y no equivale por sÃ­ sola a una concesiÃ³n.",
      "Los hechos se resuelven con la normativa vigente al 30 de julio de 2026.",
      "La prestaciÃ³n de la persona trabajadora se analiza con sus propios requisitos y no se sustituye por la deuda empresarial.",
    ],
    consistencyRules: [
      "La reclamaciÃ³n y la providencia se ordenan segÃºn la fase recaudatoria que corresponde.",
      "La solicitud de aplazamiento no extingue ni concede automÃ¡ticamente el aplazamiento.",
      "Las actuaciones administrativas deben estar motivadas, notificadas y sujetas a los recursos procedentes.",
      "La deuda de cotizaciÃ³n y el reconocimiento de una prestaciÃ³n son decisiones relacionadas, pero no intercambiables.",
    ],
    questions: [
      item("ss-04", "Determinar el sujeto responsable del ingreso de las cuotas", "Â¿QuiÃ©n responde frente a la TesorerÃ­a por el ingreso conjunto de las cuotas del RÃ©gimen General?", "La empresa, como sujeto responsable del ingreso de sus aportaciones y de las de las personas trabajadoras.", "En el RÃ©gimen General el empresario es responsable del cumplimiento de la obligaciÃ³n de cotizar y del ingreso conjunto.", "TRLGSS, artÃ­culo 142"),
      item("ss-04", "Distinguir una liquidaciÃ³n complementaria de una deuda ya exigible", "Â¿QuÃ© debe comprobarse al detectar un error en la base de mayo?", "Debe identificarse el periodo, la base correcta y la diferencia que procede liquidar conforme a las reglas aplicables.", "La liquidaciÃ³n de diferencias exige identificar el periodo y los elementos de cotizaciÃ³n que generan la deuda.", "TRLGSS, artÃ­culos 18 y 29"),
      item("ss-05", "Ordenar el paso del periodo voluntario al ejecutivo", "Â¿QuÃ© efecto produce la falta de ingreso al terminar el plazo voluntario?", "Permite iniciar la recaudaciÃ³n en vÃ­a ejecutiva con los actos y recargos previstos.", "La falta de ingreso en periodo voluntario permite iniciar la vÃ­a ejecutiva de recaudaciÃ³n.", "TRLGSS, artÃ­culos 29 y 30", RECAUDATION),
      item("ss-05", "Identificar la funciÃ³n de una reclamaciÃ³n de deuda", "Â¿CÃ³mo debe calificarse la reclamaciÃ³n emitida por la TesorerÃ­a?", "Como un acto recaudatorio que identifica y exige una deuda en los supuestos legalmente previstos.", "La reclamaciÃ³n de deuda es un acto de gestiÃ³n recaudatoria dirigido a exigir el importe pendiente.", "TRLGSS, artÃ­culos 33 y 34", RECAUDATION),
      item("ss-05", "Valorar los efectos de solicitar un aplazamiento", "Â¿QuÃ© efecto tiene la mera solicitud de aplazamiento?", "No extingue la deuda ni equivale a una concesiÃ³n; deben cumplirse las condiciones de la resoluciÃ³n que, en su caso, lo conceda.", "La solicitud de aplazamiento no extingue la deuda y sus efectos dependen de la resoluciÃ³n concedida.", "TRLGSS, artÃ­culo 23", RECAUDATION),
      item("ss-06", "Reconocer el inicio de la vÃ­a ejecutiva", "Â¿QuÃ© acto inicia la vÃ­a ejecutiva descrita en el caso?", "La providencia de apremio, cuando concurren los presupuestos legales.", "La providencia de apremio inicia la vÃ­a ejecutiva de recaudaciÃ³n de la deuda.", "TRLGSS, artÃ­culos 38 y 39", RECAUDATION),
      item("ss-06", "Distinguir deuda principal, recargo e intereses", "Â¿CÃ³mo debe tratarse el recargo que acompaÃ±a a la deuda ejecutiva?", "Como un concepto accesorio exigible conforme a la fase y al plazo de ingreso, separado de la cuota principal.", "Los recargos y demÃ¡s conceptos accesorios se aplican conforme a la fase recaudatoria y no sustituyen la cuota principal.", "TRLGSS, artÃ­culos 30 y 31", RECAUDATION),
      item("ss-06", "Identificar motivos de oposiciÃ³n a la vÃ­a ejecutiva", "Â¿QuÃ© debe hacer la empresa si alega que la deuda ya fue pagada?", "Acreditar el pago y plantear la oposiciÃ³n por el cauce y dentro del plazo previstos.", "El pago acreditado puede ser relevante para oponerse a la ejecuciÃ³n dentro del procedimiento establecido.", "TRLGSS, artÃ­culo 46", RECAUDATION),
      item("ss-06", "Ordenar el embargo de bienes", "Â¿En quÃ© momento puede analizarse el embargo de bienes de la empresa?", "DespuÃ©s de iniciarse la vÃ­a ejecutiva y conforme al orden y lÃ­mites reglamentarios.", "El embargo se integra en la fase ejecutiva y debe respetar el procedimiento y los lÃ­mites aplicables.", "Reglamento general de recaudaciÃ³n, procedimiento de apremio", RECAUDATION),
      item("g-15", "Motivar un acto administrativo recaudatorio", "Â¿QuÃ© debe contener la resoluciÃ³n que rechaza la alegaciÃ³n de la empresa?", "Los hechos, fundamentos y razones que permitan conocer por quÃ© se mantiene la deuda.", "Los actos que limitan derechos o resuelven procedimientos deben estar motivados en los casos previstos por la ley.", "Ley 39/2015, artÃ­culo 35", LPAC),
      item("g-17", "Distinguir ejecutividad y ejecuciÃ³n forzosa", "Â¿QuÃ© relaciÃ³n existe entre la resoluciÃ³n y la ejecuciÃ³n de la deuda?", "La ejecutividad permite exigir el cumplimiento y la ejecuciÃ³n forzosa requiere respetar sus presupuestos y procedimiento.", "La ejecutividad y la ejecuciÃ³n forzosa son efectos diferenciados de los actos administrativos.", "Ley 39/2015, artÃ­culos 98 y 99", LPAC),
      item("g-18", "Seleccionar el recurso administrativo procedente", "Â¿QuÃ© debe comprobarse antes de elegir entre alzada y reposiciÃ³n?", "El tipo de acto, el Ã³rgano que lo dicta y si pone fin o no a la vÃ­a administrativa.", "La elecciÃ³n del recurso depende del Ã³rgano, del acto y de si este pone fin a la vÃ­a administrativa.", "Ley 39/2015, artÃ­culos 121 a 124", LPAC),
      item("ss-07", "Separar la deuda empresarial de la acciÃ³n protectora", "Â¿CÃ³mo debe analizarse la solicitud de prestaciÃ³n de la persona trabajadora?", "Con los requisitos de la contingencia y de la prestaciÃ³n, sin convertir la deuda empresarial en una respuesta automÃ¡tica.", "La acciÃ³n protectora exige comprobar sus requisitos propios y no se resuelve Ãºnicamente por la existencia de una deuda empresarial.", "TRLGSS, artÃ­culos 165 y 166"),
      item("ss-05", "Aplicar el principio de identificaciÃ³n del periodo", "Â¿QuÃ© dato no puede faltar al imputar un pago parcial?", "El periodo y la deuda a la que debe aplicarse, conforme a las reglas de imputaciÃ³n.", "La imputaciÃ³n de un pago exige identificar la deuda y el periodo al que se aplica.", "TRLGSS, artÃ­culos 18 y 30", RECAUDATION),
      item("ss-06", "Distinguir la intervenciÃ³n de un tercero en el embargo", "Â¿QuÃ© debe comprobarse si los bienes embargados estÃ¡n depositados por un tercero?", "La titularidad, la custodia y las obligaciones del tercero dentro del procedimiento de apremio.", "La presencia de un tercero obliga a comprobar su posiciÃ³n y las reglas de depÃ³sito y embargo.", "Reglamento general de recaudaciÃ³n, embargo y depÃ³sito", RECAUDATION),
      item("g-17", "Ordenar una notificaciÃ³n administrativa", "Â¿QuÃ© efecto tiene una notificaciÃ³n defectuosa sobre el plazo de recurso?", "Debe analizarse si la notificaciÃ³n permite conocer el acto y sus recursos antes de computar el plazo.", "El cÃ³mputo del plazo de recurso depende de una notificaciÃ³n practicada conforme a la ley.", "Ley 39/2015, artÃ­culos 40 a 44", LPAC),
      item("ss-07", "Reconocer la responsabilidad en la acciÃ³n protectora", "Â¿QuÃ© debe evitarse al estudiar una posible responsabilidad empresarial?", "Confundir la responsabilidad que proceda con el reconocimiento automÃ¡tico de la prestaciÃ³n solicitada.", "La responsabilidad y el derecho a la prestaciÃ³n se comprueban con sus propios presupuestos legales.", "TRLGSS, artÃ­culo 167"),
      item("g-18", "Distinguir la vÃ­a administrativa y judicial", "Â¿QuÃ© debe comprobarse antes de acudir a la jurisdicciÃ³n contencioso-administrativa?", "El acto impugnable, la legitimaciÃ³n y el cumplimiento de los requisitos y plazos procesales.", "El acceso a la jurisdicciÃ³n contencioso-administrativa exige identificar el acto y cumplir sus requisitos procesales.", "Ley 29/1998, artÃ­culos 25 y 46", LJCA),
    ],
  },
  {
    id: "CP03",
    title: "Accidente, incapacidad y protecciÃ³n familiar",
    sourceUrl: TRLGSS,
    themes: ["ss-07", "ss-08", "ss-11"],
    difficulty: "high",
    durationMinutes: 40,
    scenario:
      "Una persona trabajadora sufre un accidente durante su jornada y comienza una situaciÃ³n de incapacidad temporal. La baja se prolonga, pasa el control de la duraciÃ³n ordinaria y posteriormente se estudia una posible incapacidad permanente. Durante el proceso fallece el causante. Quedan cÃ³nyuge, una hija menor y un hijo mayor con discapacidad acreditada, que solicitan prestaciones de muerte y supervivencia.",
    assumptions: [
      "El accidente ocurre con ocasiÃ³n o por consecuencia del trabajo y la relaciÃ³n laboral estÃ¡ vigente.",
      "Los partes mÃ©dicos y la situaciÃ³n de alta son vÃ¡lidos en las fechas indicadas.",
      "El fallecimiento se produce antes de cerrar todas las actuaciones de incapacidad permanente.",
      "Los familiares acreditan las relaciones declaradas, sin circunstancias adicionales de separaciÃ³n o exclusiÃ³n.",
      "Los hechos se resuelven con la normativa vigente al 30 de julio de 2026.",
    ],
    consistencyRules: [
      "La contingencia profesional se identifica antes de aplicar la duraciÃ³n y el control de la incapacidad temporal.",
      "El alta mÃ©dica, la incapacidad permanente y el fallecimiento son hitos diferentes.",
      "Cada familiar se analiza con la prestaciÃ³n, edad y requisitos que le correspondan.",
    ],
    questions: [
      item("ss-07", "Clasificar el accidente como contingencia profesional", "Â¿CÃ³mo debe calificarse el hecho causante inicial?", "Como accidente de trabajo, porque ocurre con ocasiÃ³n o por consecuencia del trabajo.", "El accidente de trabajo es la lesiÃ³n corporal sufrida con ocasiÃ³n o por consecuencia del trabajo por cuenta ajena.", "TRLGSS, artÃ­culo 156"),
      item("ss-07", "Distinguir contingencia profesional y comÃºn", "Â¿QuÃ© dato debe fijarse antes de estudiar la prestaciÃ³n?", "La contingencia profesional y su relaciÃ³n causal con el trabajo.", "La calificaciÃ³n de la contingencia determina las reglas de la acciÃ³n protectora que deben aplicarse.", "TRLGSS, artÃ­culos 156 y 157"),
      item("ss-08", "Identificar la incapacidad temporal protegida", "Â¿QuÃ© situaciÃ³n describe la baja mÃ©dica inicial?", "Una incapacidad temporal derivada de accidente de trabajo.", "La incapacidad temporal protege la imposibilidad temporal de trabajar por accidente o enfermedad en los tÃ©rminos legales.", "TRLGSS, artÃ­culos 169 y 172"),
      item("ss-08", "Aplicar la duraciÃ³n mÃ¡xima ordinaria", "Â¿CuÃ¡l es la regla general de duraciÃ³n de la incapacidad temporal?", "365 dÃ­as, con la posible prÃ³rroga legal de 180 dÃ­as cuando proceda.", "La incapacidad temporal dura como mÃ¡ximo 365 dÃ­as y puede prorrogarse por otros 180 en los supuestos legales.", "TRLGSS, artÃ­culo 169"),
      item("ss-08", "Reconocer el control tras los 365 dÃ­as", "Â¿QuÃ© Ã³rgano debe intervenir en la fase de control posterior a los 365 dÃ­as?", "El Instituto Nacional de la Seguridad Social, conforme a sus competencias legales.", "El INSS ejerce las competencias de control y decisiÃ³n en las fases posteriores de la incapacidad temporal.", "TRLGSS, artÃ­culo 170"),
      item("ss-08", "Distinguir las causas de extinciÃ³n de la incapacidad temporal", "Â¿QuÃ© debe comprobarse al emitir un alta mÃ©dica?", "La fecha y causa de extinciÃ³n de la incapacidad temporal, sin confundirla con una incapacidad permanente.", "El alta mÃ©dica puede extinguir la incapacidad temporal, pero no equivale por sÃ­ sola a incapacidad permanente.", "TRLGSS, artÃ­culo 174"),
      item("ss-08", "Clasificar la incapacidad permanente", "Â¿QuÃ© debe valorarse para reconocer una incapacidad permanente?", "La reducciÃ³n anatÃ³mica o funcional y su repercusiÃ³n sobre la capacidad laboral en el grado legal correspondiente.", "La incapacidad permanente exige valorar reducciones graves, susceptibles de determinaciÃ³n objetiva y previsiblemente definitivas.", "TRLGSS, artÃ­culos 193 y 194"),
      item("ss-08", "Distinguir revisiÃ³n y compatibilidad", "Â¿QuÃ© debe hacerse si aparecen nuevas lesiones tras una resoluciÃ³n?", "Comprobar si procede una revisiÃ³n conforme a la causa, plazo y grado previstos.", "La revisiÃ³n de la incapacidad permanente exige respetar sus causas y procedimiento legales.", "TRLGSS, artÃ­culos 200 y 201"),
      item("ss-07", "Separar la prestaciÃ³n y la responsabilidad empresarial", "Â¿QuÃ© anÃ¡lisis es independiente del reconocimiento de la prestaciÃ³n?", "La posible responsabilidad empresarial por incumplimientos y el derecho de la persona a la protecciÃ³n deben analizarse separadamente.", "La responsabilidad empresarial no sustituye el examen de los requisitos de la prestaciÃ³n.", "TRLGSS, artÃ­culo 167"),
      item("ss-11", "Identificar la pensiÃ³n de viudedad", "Â¿QuÃ© prestaciÃ³n puede solicitar el cÃ³nyuge superviviente?", "La pensiÃ³n de viudedad, si acredita los requisitos legales.", "La viudedad protege al cÃ³nyuge o persona beneficiaria que reÃºna los requisitos tras el fallecimiento.", "TRLGSS, artÃ­culos 219 y 220"),
      item("ss-11", "Identificar la pensiÃ³n de orfandad", "Â¿QuÃ© prestaciÃ³n debe estudiarse para la hija menor?", "La pensiÃ³n de orfandad, con los requisitos del causante y de la beneficiaria.", "La orfandad se reconoce a los hijos que cumplen los requisitos de edad y demÃ¡s condiciones legales.", "TRLGSS, artÃ­culo 224"),
      item("ss-11", "Aplicar la discapacidad en la orfandad", "Â¿QuÃ© dato resulta relevante para el hijo mayor con discapacidad?", "La discapacidad acreditada y sus efectos sobre los lÃ­mites y requisitos de la pensiÃ³n de orfandad.", "La discapacidad puede modificar el anÃ¡lisis de edad y mantenimiento de la orfandad conforme a la ley.", "TRLGSS, artÃ­culo 224"),
      item("ss-11", "Distinguir el auxilio por defunciÃ³n", "Â¿CÃ³mo debe calificarse el auxilio por defunciÃ³n?", "Como una prestaciÃ³n econÃ³mica distinta de las pensiones de viudedad y orfandad.", "El auxilio por defunciÃ³n es una prestaciÃ³n especÃ­fica de muerte y supervivencia.", "TRLGSS, artÃ­culo 218"),
      item("ss-07", "Comprobar los requisitos de la acciÃ³n protectora", "Â¿QuÃ© debe hacerse antes de reconocer cualquiera de las prestaciones?", "Comprobar hecho causante, sujeto beneficiario, requisitos y efectos de la prestaciÃ³n concreta.", "La acciÃ³n protectora exige comprobar los requisitos de cada prestaciÃ³n y no solo el parentesco o la baja mÃ©dica.", "TRLGSS, artÃ­culos 165 y 166"),
      item("ss-08", "Distinguir efectos de una contingencia profesional", "Â¿QuÃ© debe evitarse al aplicar la regla de la contingencia profesional?", "No sustituir la calificaciÃ³n profesional por una regla general de enfermedad comÃºn no descrita.", "La contingencia profesional tiene reglas propias y debe mantenerse durante el anÃ¡lisis del supuesto.", "TRLGSS, artÃ­culos 156 y 172"),
      item("ss-08", "Ordenar la transiciÃ³n entre incapacidad temporal y permanente", "Â¿QuÃ© orden de anÃ¡lisis es correcto?", "Primero se identifica la situaciÃ³n temporal y sus efectos; despuÃ©s se valora si procede iniciar o resolver la permanente.", "La incapacidad temporal y la permanente tienen hechos y procedimientos diferenciados que deben ordenarse.", "TRLGSS, artÃ­culos 169, 174 y 193"),
      item("ss-11", "Acreditar la condiciÃ³n de beneficiario", "Â¿QuÃ© debe comprobar la entidad gestora para cada familiar?", "La relaciÃ³n con el causante, la edad o discapacidad y el resto de requisitos de la prestaciÃ³n solicitada.", "El reconocimiento de muerte y supervivencia exige comprobar individualmente la condiciÃ³n de beneficiario.", "TRLGSS, artÃ­culos 219 a 228"),
      item("ss-07", "Distinguir reconocimiento, pago y revisiÃ³n", "Â¿QuÃ© debe separarse en la resoluciÃ³n final?", "El reconocimiento del derecho, sus efectos econÃ³micos, el pago y las posibles revisiones.", "Las fases de reconocimiento, pago y revisiÃ³n tienen reglas y efectos propios.", "TRLGSS, artÃ­culos 169, 193 y 230"),
    ],
  },
  {
    id: "CP04",
    title: "Unidad familiar con cuidados, jubilaciÃ³n e IMV",
    sourceUrl: TRLGSS,
    themes: ["ss-07", "ss-09", "ss-10", "ss-12", "ss-13"],
    difficulty: "high",
    durationMinutes: 42,
    scenario:
      "Una unidad familiar solicita una prestaciÃ³n por nacimiento y cuidado de menor mientras una de sus personas adultas trabaja a tiempo parcial. En la misma familia, otra persona se aproxima a la jubilaciÃ³n y pregunta por la modalidad anticipada y la compatibilidad con trabajo. Los ingresos familiares disminuyen y se estudia el acceso al ingreso mÃ­nimo vital. El expediente incluye cambios de convivencia, una reclamaciÃ³n frente a una resoluciÃ³n y una incidencia en el pago de una prestaciÃ³n ya reconocida.",
    assumptions: [
      "La unidad familiar declara residencia, convivencia, ingresos y patrimonio con la documentaciÃ³n indicada.",
      "La persona solicitante cumple las condiciones de afiliaciÃ³n y alta que correspondan a la prestaciÃ³n por nacimiento y cuidado.",
      "La persona que consulta por jubilaciÃ³n no tiene todavÃ­a reconocida una pensiÃ³n y mantiene una actividad laboral parcial.",
      "Los datos variables se deben comprobar con la normativa vigente al 30 de julio de 2026.",
      "La reclamaciÃ³n y la incidencia de pago no alteran por sÃ­ solas el derecho hasta que exista resoluciÃ³n.",
    ],
    consistencyRules: [
      "Cada prestaciÃ³n se analiza por su hecho causante, beneficiario y requisitos.",
      "El IMV exige valorar la unidad de convivencia y los datos econÃ³micos aplicables.",
      "La jubilaciÃ³n, el IMV y el pago de prestaciones no se resuelven con una misma regla automÃ¡tica.",
      "Los recursos se presentan contra el acto y dentro del plazo procedente.",
    ],
    questions: [
      item("ss-09", "Identificar la prestaciÃ³n por nacimiento y cuidado", "Â¿QuÃ© prestaciÃ³n debe estudiarse ante el nacimiento descrito?", "La prestaciÃ³n por nacimiento y cuidado de menor, si se cumplen sus requisitos.", "La prestaciÃ³n por nacimiento y cuidado protege la suspensiÃ³n y el cuidado del menor en los supuestos legales.", "TRLGSS, artÃ­culo 177"),
      item("ss-09", "Comprobar el sujeto beneficiario", "Â¿QuÃ© debe comprobarse respecto de la persona que trabaja a tiempo parcial?", "Su situaciÃ³n de afiliaciÃ³n, alta, periodo de cotizaciÃ³n y demÃ¡s requisitos de la prestaciÃ³n.", "El trabajo a tiempo parcial no elimina por sÃ­ solo la necesidad de comprobar los requisitos subjetivos y contributivos.", "TRLGSS, artÃ­culo 178"),
      item("ss-09", "Aplicar la duraciÃ³n y los efectos", "Â¿QuÃ© debe fijarse al reconocer la prestaciÃ³n por nacimiento?", "El periodo de suspensiÃ³n protegido, sus efectos econÃ³micos y las reglas de disfrute aplicables.", "La prestaciÃ³n se reconoce con la duraciÃ³n y los efectos que establecen las reglas del nacimiento y cuidado.", "TRLGSS, artÃ­culos 177 y 178"),
      item("ss-07", "Clasificar la acciÃ³n protectora aplicable", "Â¿QuÃ© orden de anÃ¡lisis evita mezclar las prestaciones familiares?", "Identificar primero el hecho causante y despuÃ©s elegir la prestaciÃ³n y sus requisitos.", "La clasificaciÃ³n del hecho causante precede a la comprobaciÃ³n de requisitos de cada prestaciÃ³n.", "TRLGSS, artÃ­culos 165 y 166"),
      item("ss-10", "Aplicar el periodo mÃ­nimo de cotizaciÃ³n para jubilaciÃ³n", "Â¿QuÃ© debe comprobarse antes de valorar la modalidad de jubilaciÃ³n?", "La edad, el periodo de cotizaciÃ³n y la carencia especÃ­fica exigida.", "La jubilaciÃ³n contributiva exige comprobar edad y carencia general y especÃ­fica conforme a la ley.", "TRLGSS, artÃ­culo 205"),
      item("ss-10", "Distinguir jubilaciÃ³n ordinaria y anticipada", "Â¿QuÃ© caracteriza la modalidad anticipada voluntaria?", "Permite adelantar la edad dentro de lÃ­mites legales y exige requisitos adicionales y posibles reducciones.", "La jubilaciÃ³n anticipada voluntaria estÃ¡ limitada por edad, cotizaciÃ³n y demÃ¡s condiciones legales.", "TRLGSS, artÃ­culo 208"),
      item("ss-10", "Aplicar la compatibilidad de trabajo y pensiÃ³n", "Â¿CÃ³mo debe analizarse el trabajo parcial durante una jubilaciÃ³n activa?", "Como una compatibilidad condicionada a la modalidad, requisitos, porcentaje y efectos previstos.", "La compatibilidad entre trabajo y pensiÃ³n depende de las condiciones y efectos de la jubilaciÃ³n activa.", "TRLGSS, artÃ­culo 214"),
      item("ss-12", "Identificar el ingreso mÃ­nimo vital", "Â¿QuÃ© prestaciÃ³n se estÃ¡ valorando para la unidad familiar?", "El ingreso mÃ­nimo vital, con sus requisitos subjetivos y econÃ³micos.", "El IMV es una prestaciÃ³n econÃ³mica de la Seguridad Social dirigida a prevenir pobreza y exclusiÃ³n social.", "Ley 19/2021, artÃ­culos 1 y 2", IMV),
      item("ss-12", "Definir la unidad de convivencia", "Â¿QuÃ© debe identificarse antes de calcular el IMV?", "Las personas que integran la unidad de convivencia y sus relaciones y circunstancias.", "La unidad de convivencia es relevante para determinar el derecho y la cuantÃ­a del IMV.", "Ley 19/2021, artÃ­culos 6 y 8", IMV),
      item("ss-12", "Comprobar vulnerabilidad econÃ³mica", "Â¿QuÃ© datos deben revisarse para valorar el acceso al IMV?", "Los ingresos, patrimonio y demÃ¡s umbrales aplicables al periodo de referencia.", "El reconocimiento del IMV exige comprobar la vulnerabilidad econÃ³mica con los datos y umbrales legales.", "Ley 19/2021, artÃ­culos 7 a 11", IMV),
      item("ss-12", "Aplicar la obligaciÃ³n de comunicar cambios", "Â¿QuÃ© debe hacer la unidad cuando cambia la convivencia o aumentan sus ingresos?", "Comunicar la variaciÃ³n relevante y aportar la informaciÃ³n que permita revisar el derecho.", "Las personas beneficiarias del IMV deben comunicar las variaciones que puedan afectar al derecho o a la cuantÃ­a.", "Ley 19/2021, artÃ­culos 17 y 19", IMV),
      item("ss-12", "Reconocer la revisiÃ³n periÃ³dica", "Â¿QuÃ© puede hacer la entidad gestora con los nuevos datos econÃ³micos?", "Revisar el derecho y la cuantÃ­a conforme a las reglas aplicables.", "El derecho al IMV y su cuantÃ­a pueden revisarse con los datos econÃ³micos y familiares.", "Ley 19/2021, artÃ­culos 12, 13 y 17", IMV),
      item("ss-13", "Distinguir reconocimiento y pago", "Â¿CÃ³mo debe tratarse una incidencia en el pago de una prestaciÃ³n ya reconocida?", "Como una incidencia de ejecuciÃ³n o pago que no sustituye al acto de reconocimiento del derecho.", "El reconocimiento del derecho y la ordenaciÃ³n y materializaciÃ³n del pago son fases diferenciadas.", "TRLGSS, tÃ­tulo I, gestiÃ³n financiera y pago"),
      item("ss-13", "Elegir el recurso administrativo", "Â¿QuÃ© debe comprobarse al impugnar la resoluciÃ³n del expediente?", "El tipo de acto, si pone fin a la vÃ­a administrativa, el recurso procedente y el plazo.", "La vÃ­a de recurso se determina por la naturaleza del acto y por las reglas de la Ley 39/2015.", "Ley 39/2015, artÃ­culos 121 a 124", LPAC),
      item("ss-07", "Separar compatibilidad e incompatibilidad", "Â¿QuÃ© debe comprobarse cuando coinciden varias prestaciones familiares y econÃ³micas?", "Las reglas de compatibilidad, incompatibilidad y opciÃ³n de cada prestaciÃ³n concreta.", "Las prestaciones no se acumulan ni se excluyen sin aplicar sus reglas especÃ­ficas de compatibilidad.", "TRLGSS, artÃ­culos 163 y 165"),
      item("ss-09", "Reconocer una prestaciÃ³n familiar adicional", "Â¿QuÃ© debe hacerse si aparece una situaciÃ³n de cuidado distinta del nacimiento?", "Identificar el hecho causante y comprobar si corresponde una prestaciÃ³n familiar especÃ­fica.", "Las prestaciones familiares se distinguen por su hecho causante, sujeto, duraciÃ³n y requisitos.", "TRLGSS, artÃ­culos 187 y 188"),
      item("ss-10", "Distinguir jubilaciÃ³n parcial", "Â¿QuÃ© debe analizarse si la persona reduce su jornada y solicita jubilaciÃ³n parcial?", "La edad, el contrato de relevo cuando proceda, la cotizaciÃ³n y las condiciones de la modalidad.", "La jubilaciÃ³n parcial exige comprobar sus requisitos propios y no se presume por reducir la jornada.", "TRLGSS, artÃ­culo 215"),
      item("ss-13", "Ordenar el pago a la persona beneficiaria", "Â¿QuÃ© debe verificarse antes de materializar el pago?", "La resolución firme o ejecutiva, la persona destinataria, la cuantÃ­a y la forma de pago aplicable.", "La materializaciÃ³n del pago exige verificar el acto que reconoce el derecho y los datos de la persona beneficiaria.", "TRLGSS, tÃ­tulo I, gestiÃ³n financiera y pago"),
    ],
  },
];

const ERROR_TYPES = [
  "confusion-conceptos",
  "confusion-plazos",
  "confusion-sujetos",
  "confusion-requisitos",
  "confusion-competencias",
  "confusion-secuencia",
];

function provenance(summary) {
  return {
    createdBy: CREATED_BY,
    createdAt: AS_OF,
    changeLog: [{ version: "0.1.0", date: AS_OF, changedBy: CREATED_BY, summary }],
  };
}

function officialPublication(url) {
  if (url === IMV) return "BOE-A-2021-21007";
  if (url === RECAUDATION) return "BOE-A-2004-15221";
  if (url === LPAC) return "BOE-A-2015-10565";
  if (url === LJCA) return "BOE-A-1998-16718";
  return "BOE-A-2015-11724";
}

function writeJson(path, value) {
  return writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function buildQuestion(practicalCase, question, questionId, claimId, position) {
  const sourceUrl = question.sourceUrl ?? practicalCase.sourceUrl;
  const distractors = [
    `Aplicar la regla contraria sin comprobar ${question.competency.toLowerCase()}.`,
    "Resolver el punto solo con la fecha del caso y sin consultar la norma aplicable.",
    "Trasladar la decisiÃ³n a otra prestaciÃ³n, sujeto u Ã³rgano sin justificaciÃ³n legal.",
  ];
  return {
    id: questionId,
    version: "0.1.0",
    status: "draft",
    themes: [question.theme],
    epigraph: `${practicalCase.id} — decisión ${position + 1}`,
    competency: question.competency,
    difficulty: practicalCase.difficulty,
    prompt: question.prompt,
    options: [
      { text: question.answer, isCorrect: true, feedback: `Respuesta propuesta: ${question.feedback ?? question.answer}` },
      ...distractors.map((text, index) => ({
        text,
        isCorrect: false,
        feedback: `Esta alternativa no aplica correctamente el supuesto. Revisar ${question.sourceLocation}.`,
        errorType: ERROR_TYPES[index % ERROR_TYPES.length],
        reviewTarget: `${practicalCase.id}: ${question.competency}`,
      })),
    ],
    normativeClaimIds: [claimId],
    sources: [{ url: sourceUrl, location: question.sourceLocation, consultedAt: AS_OF }],
    validFrom: AS_OF,
    validTo: null,
    legislationCutoffAt: AS_OF,
    visibility: "assessment-only",
    academicReviewStatus: "pending",
    legalReviewStatus: "pending",
    nextReviewAt: NEXT_REVIEW,
    provenance: provenance(`Borrador de ${practicalCase.id}, decisiÃ³n conectada al supuesto.`),
  };
}

async function generate() {
  const casesDirectory = resolve(projectRoot, "content-source/cases");
  const questionsDirectory = resolve(projectRoot, "content-source/questions");
  const claimsDirectory = resolve(projectRoot, "content-source/claims");
  await Promise.all([
    mkdir(casesDirectory, { recursive: true }),
    mkdir(questionsDirectory, { recursive: true }),
    mkdir(claimsDirectory, { recursive: true }),
  ]);

  let questionCount = 0;
  for (const practicalCase of CASES) {
    const questionIds = [];
    const mainQuestionIds = [];
    const reserveQuestionIds = [];
    const normativeClaimIds = [];
    const coverageByTheme = new Map();
    const qidStart = practicalCase.id === "CP02" ? 401 : practicalCase.id === "CP03" ? 501 : 601;

    for (const [index, question] of practicalCase.questions.entries()) {
      const number = qidStart + index;
      const questionId = `${question.theme}-q${number}`;
      const claimId = `clm-${question.theme}-${number}`;
      const sourceUrl = question.sourceUrl ?? practicalCase.sourceUrl;
      questionIds.push(questionId);
      (index < 15 ? mainQuestionIds : reserveQuestionIds).push(questionId);
      normativeClaimIds.push(claimId);
      const coverage = coverageByTheme.get(question.theme) ?? [];
      coverage.push({ competency: question.competency, questionId });
      coverageByTheme.set(question.theme, coverage);
      const claim = {
        claimId,
        assetId: practicalCase.id,
        version: "0.1.0",
        statement: question.claimStatement,
        sourceUrl,
        sourceLocation: question.sourceLocation,
        officialPublication: officialPublication(sourceUrl),
        validFrom: AS_OF,
        validTo: null,
        legislationCutoffAt: AS_OF,
        owner: "equipo-editorial-ss-casolab",
        reviewStatus: "pending",
        sourceCheckedAt: AS_OF,
        reviewedAt: null,
        nextReviewAt: NEXT_REVIEW,
        dependentAssetIds: [practicalCase.id, questionId],
        provenance: provenance(`AfirmaciÃ³n normativa de borrador para ${practicalCase.id}.`),
      };
      await Promise.all([
        writeJson(resolve(claimsDirectory, `${claimId}.json`), claim),
        writeJson(resolve(questionsDirectory, `${questionId}.json`), buildQuestion(practicalCase, question, questionId, claimId, index)),
      ]);
      questionCount += 1;
    }

    const competencies = practicalCase.questions.map(({ competency }) => competency);
    const coverage = practicalCase.questions.map((question, index) => ({
      themeId: question.theme,
      competency: question.competency,
      questionIds: [questionIds[index]],
    }));
    const caseDocument = {
      id: practicalCase.id,
      version: "0.1.0",
      status: "draft",
      type: "full-case",
      title: practicalCase.title,
      scenario: practicalCase.scenario,
      originality: "original",
      assumptions: practicalCase.assumptions,
      themes: practicalCase.themes,
      competencies,
      coverage,
      questionIds,
      mainQuestionIds,
      reserveQuestionIds,
      consistencyRules: practicalCase.consistencyRules,
      durationMinutes: practicalCase.durationMinutes,
      scoring: { correct: 1, wrong: -0.25, blank: 0 },
      difficulty: practicalCase.difficulty,
      visibility: "assessment-only",
      normativeClaimIds,
      validFrom: AS_OF,
      validTo: null,
      legislationCutoffAt: AS_OF,
      nextReviewAt: NEXT_REVIEW,
      academicReviewStatus: "pending",
      legalReviewStatus: "pending",
      provenance: provenance(`Borrador original de ${practicalCase.id} con quince decisiones principales y tres reservas.`),
    };
    await writeJson(resolve(casesDirectory, `${practicalCase.id}.json`), caseDocument);
  }
  process.stdout.write(`Generados ${CASES.length} supuestos completos y ${questionCount} preguntas de borrador.\n`);
}

await generate();
