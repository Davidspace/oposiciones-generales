/* ============================================================
   HUB COMÚN — fichas editoriales
   Destino: lorman-lab/client/src/data/fichas.ts
   Solo cifras respaldadas por el repositorio:
     TCAE  → client/src/data/tcae-tests.ts (16 tests por tema + 1 repaso)
     TAI   → tai-academia/app/tai/page.tsx (33 temas, 33 autoev., 10 simulacros, 12 meses, 59 €)
     SS    → ss-casolab content:validate (36 temas, 36 tests, 14 casos) + page.tsx (49 €, 6 meses)
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
    status: "Contenido completo · matrícula en preparación",
    indicators: [
      { value: "33", label: "temas en PDF + 33 autoevaluaciones" },
      { value: "10", label: "simulacros: 5 del bloque III y 5 del IV" },
      { value: "12", label: "meses de acceso al aula" },
      { value: "59 €", label: "precio de lanzamiento previsto", tone: true },
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
    status: "Estructura completa · publicación en revisión",
    indicators: [
      { value: "36", label: "temas: 23 generales + 13 específicos" },
      { value: "36", label: "tests organizados por tema" },
      { value: "14", label: "casos prácticos estructurados" },
      { value: "49 €", label: "precio fundador previsto · 6 meses", tone: true },
    ],
    primary: { label: "Ver SS CasoLab", href: PRODUCT_URLS.ss },
    secondary: { label: "Resolver el microcaso", href: `${PRODUCT_URLS.ss}#microcaso` },
  },
  {
    code: "C2",
    tone: "c2",
    admin: "Administración General del Estado · subgrupo C2",
    title: "Auxiliar Administrativo del Estado",
    description:
      "Superficie de validación: normativa, psicotécnicos, actividad administrativa y ofimática.",
    status: "Validación local · sin venta",
    indicators: [
      { value: "5", label: "preguntas de muestra gratuita" },
      { value: "—", label: "precio no publicado todavía" },
    ],
    primary: { label: "Hacer la prueba gratuita", href: `${PRODUCT_URLS.c2}#prueba` },
    secondary: { label: "Ver el examen", href: `${PRODUCT_URLS.c2}#examen` },
  },
];
