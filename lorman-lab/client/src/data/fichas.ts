/* ============================================================
   HUB COMÚN — fichas editoriales
   Destino: lorman-lab/client/src/data/fichas.ts
   Solo cifras respaldadas por el repositorio:
     TCAE  → client/src/data/tcae-tests.ts (16 tests por tema + 1 repaso)
     TAI   → tai-academia/app/tai/page.tsx (33 temas, 33 autoev., 10 simulacros, 95 €, hasta examen)
     SS    → ss-casolab content:validate (36 temas, 36 tests, práctica) + page.tsx (49 €, hasta examen)
     C2    → administrativo-estado/app/page.tsx (5 preguntas de muestra; sin precio publicado)
   ============================================================ */

import type { FichaOposicionProps } from "@/components/FichaOposicion";
import { PRODUCT_URLS } from "@/lib/portfolio-links";

export const FICHAS: FichaOposicionProps[] = [
  {
    code: "TCAE",
    tone: "tcae",
    admin: "Servicios de salud · SAS · SMS · IMAS · SERMAS",
    title: "Técnico en Cuidados Auxiliares de Enfermería",
    description:
      "Temarios, resúmenes, autoevaluaciones y simulacros disponibles en la línea sanitaria.",
    status: "Contenido disponible",
    indicators: [
      { value: "16", label: "tests por tema en la muestra local" },
      { value: "1", label: "repaso general autocorregible" },
    ],
    primary: { label: "Explorar el aula TCAE", href: `${PRODUCT_URLS.tcae}#precios` },
    secondary: { label: "Ver muestra", href: "/test-tcae-sas" },
  },
  {
    code: "TAI",
    tone: "tai",
    admin: "Administración del Estado · subgrupo C1",
    title: "Técnico Auxiliar de Informática",
    description:
      "El aula reúne los temas, las autoevaluaciones y los simulacros de las dos partes del ejercicio.",
    status: "Contenido completo · acceso hasta el examen",
    indicators: [
      { value: "33", label: "temas en PDF + 33 autoevaluaciones" },
      { value: "10", label: "simulacros: 5 del bloque III y 5 del IV" },
      { value: "examen", label: "acceso hasta la fecha del examen" },
      { value: "95 €", label: "pago único", tone: true },
    ],
    primary: { label: "Ver el curso TAI C1", href: PRODUCT_URLS.tai },
    secondary: { label: "Ver la ruta", href: `${PRODUCT_URLS.tai}#ruta` },
  },
  {
    code: "SS",
    tone: "ss",
    admin: "Administración de la Seguridad Social · subgrupo C1",
    title: "Administrativo de la Seguridad Social",
    description:
      "Temario general y específico, tests por tema y práctica orientada al supuesto del ejercicio.",
    status: "Contenido disponible · acceso hasta el examen",
    indicators: [
      { value: "36", label: "temas: 23 generales + 13 específicos" },
      { value: "36", label: "tests organizados por tema" },
      { value: "14", label: "casos prácticos estructurados" },
      { value: "49 €", label: "pago único", tone: true },
    ],
    primary: { label: "Ver SS CasoLab", href: PRODUCT_URLS.ss },
    secondary: { label: "Resolver el microcaso", href: `${PRODUCT_URLS.ss}#microcaso` },
  },
  {
    code: "AJ C2",
    tone: "juridico",
    admin: "Administración de Justicia · subgrupo C2",
    title: "Auxilio Judicial · tests",
    description:
      "Práctica autocorregible para el curso de Auxilio Judicial: temas, repasos, supuestos, simulacros y modelos oficiales dentro del aula.",
    status: "Contenido disponible · acceso por Moodle",
    indicators: [
      { value: "26", label: "temas organizados en el aula" },
      { value: "90", label: "cuestionarios únicos auditados" },
      { value: "10", label: "supuestos prácticos" },
      { value: "5", label: "modelos de examen oficial" },
    ],
    primary: { label: "Ver Auxilio Judicial", href: PRODUCT_URLS.auxJuridico },
    secondary: { label: "Ver el alcance", href: `${PRODUCT_URLS.auxJuridico}#alcance` },
  },
];

/** El producto C2 permanece fuera de la rejilla hasta que finalice su preparación. */
export const HIDDEN_C2_URL = PRODUCT_URLS.c2;
