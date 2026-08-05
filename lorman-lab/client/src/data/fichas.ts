/* ============================================================
   HUB COMÚN — fichas editoriales
   Destino: lorman-lab/client/src/data/fichas.ts
   Solo cifras respaldadas por el repositorio:
     TCAE  → client/src/data/tcae-tests.ts (16 tests por tema + 1 repaso)
     TAI   → tai-academia/app/tai/page.tsx (33 temas, 33 autoev., 10 simulacros, 12 meses, 59 €)
     SS    → ss-casolab content:validate (36 temas, 36 tests, 14 casos) + page.tsx (79 €, acceso hasta el examen)
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
      "Temarios, resúmenes, autoevaluaciones y simulacros para preparar TCAE según tu servicio de salud.",
    status: "Contenido disponible · consulta tu versión",
    indicators: [
      { value: "16", label: "preguntas por tema en la muestra" },
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
      "33 temas, autoevaluaciones y simulacros para preparar las dos partes del ejercicio.",
    status: "Contenido disponible · acceso por WhatsApp",
    indicators: [
      { value: "33", label: "temas en PDF + 33 autoevaluaciones" },
      { value: "10", label: "simulacros: 5 del bloque III y 5 del IV" },
      { value: "hasta", label: "el día del examen" },
      { value: "59 €", label: "pago único · acceso hasta el examen", tone: true },
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
      "36 temas, tests por tema y supuestos prácticos para preparar el ejercicio.",
    status: "Contenido disponible · acceso por WhatsApp",
    indicators: [
      { value: "36", label: "temas: 23 generales + 13 específicos" },
      { value: "36", label: "tests organizados por tema" },
      { value: "14", label: "casos prácticos estructurados" },
      { value: "79 €", label: "pago único · acceso hasta el examen", tone: true },
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
      "Prueba gratuita de normativa, psicotécnicos, actividad administrativa y ofimática.",
    status: "Muestra gratuita · aula en preparación",
    indicators: [
      { value: "5", label: "preguntas de muestra gratuita" },
      { value: "—", label: "precio no publicado todavía" },
    ],
    primary: { label: "Hacer la prueba gratuita", href: `${PRODUCT_URLS.c2}#prueba` },
    secondary: { label: "Ver el examen", href: `${PRODUCT_URLS.c2}#examen` },
  },
  {
    code: "AJ C2",
    tone: "juridico",
    admin: "Administración de Justicia · subgrupo C2",
    title: "Auxilio Judicial · tests",
    description:
      "Práctica autocorregible para Auxilio Judicial: 26 temas y 90 cuestionarios distintos. Solo tests, sin temario.",
    status: "Contenido disponible · acceso por WhatsApp",
    indicators: [
      { value: "26", label: "temas organizados en el aula" },
      { value: "90", label: "cuestionarios únicos auditados" },
      { value: "29 €", label: "pago único · acceso hasta el examen", tone: true },
    ],
    primary: { label: "Ver Auxilio Judicial", href: PRODUCT_URLS.auxJuridico },
    secondary: { label: "Ver el alcance", href: `${PRODUCT_URLS.auxJuridico}#alcance` },
  },
];
