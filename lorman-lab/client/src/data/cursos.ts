/**
 * Datos de las fichas del hub. Una entrada por producto.
 * Regla: el tipo de contenido va en `items[].title` (grande) y las cifras
 * en `items[].note` (pequeño). El precio solo aparece si está cerrado.
 *
 * Las URLs admiten variables VITE_* para el despliegue. Los valores por
 * defecto proceden del catálogo interno y mantienen los enlaces actuales.
 */

import type { FichaCursoProps } from "@/components/FichaCurso";
import { PRODUCT_URLS } from "@/lib/portfolio-links";

const runtimeEnv = import.meta.env as Record<string, string | undefined>;
const url = (key: string, fallback: string) => runtimeEnv[key]?.trim() || fallback;

export const WHATSAPP = "34640828654";

const whatsappCourse = (course: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola, quiero información sobre ${course}.`)}`;

export const CURSOS: FichaCursoProps[] = [
  {
    code: "TCAE",
    tone: "tcae",
    title: "Cuidados Auxiliares de Enfermería",
    meta: "Servicios de salud · turno libre",
    items: [
      { title: "Temario por bloques", note: "resúmenes y esquemas" },
      { title: "Tests por tema", note: "respuesta razonada" },
      { title: "Simulacros tipo examen", note: "repaso general autocorregible" },
    ],
    price: {
      title: "Pago único",
      note: "acceso hasta el examen",
      value: "SEGÚN SERVICIO DE SALUD",
    },
    cta: { label: "Elegir servicio de salud", href: url("VITE_TCAE_URL", PRODUCT_URLS.tcae) },
  },
  {
    code: "TAI",
    tone: "tai",
    title: "Técnico Auxiliar de Informática",
    meta: "Administración del Estado · subgrupo C1",
    items: [
      { title: "Temario completo", note: "33 temas" },
      { title: "Tests y autoevaluaciones", note: "práctica por tema" },
      { title: "Simulacros de las dos partes", note: "teóricos y prácticos" },
    ],
    price: { title: "Pago único", note: "acceso hasta el examen", value: "69 €" },
    cta: { label: "Ver curso TAI", href: url("VITE_TAI_URL", PRODUCT_URLS.tai) },
  },
  {
    code: "SS",
    tone: "ss",
    title: "Administrativo de la Seguridad Social",
    meta: "Subgrupo C1 · acceso libre",
    items: [
      { title: "Temario general y específico", note: "36 temas redactados" },
      { title: "Tests por tema", note: "con normativa citada" },
      { title: "Supuestos prácticos", note: "decide como en el ejercicio" },
    ],
    price: { title: "Pago único", note: "acceso hasta el examen", value: "79 €" },
    cta: { label: "Ver curso SS", href: url("VITE_SS_URL", PRODUCT_URLS.ss) },
  },
  {
    code: "AGE C2",
    tone: "tai",
    title: "Auxiliar Administrativo del Estado",
    meta: "Administración General del Estado · subgrupo C2",
    items: [
      { title: "Normativa y psicotécnicos", note: "primera parte del ejercicio" },
      { title: "Actividad administrativa y ofimática", note: "segunda parte" },
      { title: "Práctica guiada", note: "pregunta por el acceso" },
    ],
    cta: { label: "Preguntar por Estado", href: whatsappCourse("Auxiliar Administrativo del Estado") },
  },
  {
    code: "SAS",
    tone: "tcae",
    title: "Auxiliar Administrativo/a del SAS",
    meta: "Servicio Andaluz de Salud · acceso libre y promoción interna",
    items: [
      { title: "Programa común y específico", note: "ruta ordenada por bloques" },
      { title: "Tests y repasos", note: "práctica flexible" },
      { title: "Supuestos y simulacros", note: "preparación orientada al ejercicio" },
    ],
    cta: { label: "Preguntar por SAS", href: whatsappCourse("Auxiliar Administrativo del SAS") },
  },
  {
    code: "CÓRDOBA",
    tone: "cordoba",
    title: "Auxiliar Administrativo/a del Ayuntamiento de Córdoba",
    meta: "Ayuntamiento de Córdoba · subgrupo C2 · 55 plazas",
    items: [
      { title: "Programa oficial", note: "20 epígrafes auditados" },
      { title: "Diagnóstico gratuito", note: "teoría, aplicación y microcaso" },
      { title: "Pack fundador", note: "temas, preguntas y supuestos" },
    ],
    price: { title: "Pago único", note: "pack inicial disponible", value: "69 €" },
    cta: { label: "Ver curso Córdoba", href: url("VITE_CORDOBA_URL", PRODUCT_URLS.cordoba) },
  },
  {
    code: "AUX. JUDICIAL",
    tone: "aux",
    title: "Auxilio Judicial",
    meta: "Justicia · subgrupo C2 · solo tests",
    items: [
      { title: "Programa cubierto con tests", note: "26 temas · sin material teórico" },
      { title: "Práctica variada", note: "por tema, repaso, supuestos y simulacros" },
      { title: "Corrección al momento", note: "aprende de cada intento" },
    ],
    price: { title: "Pago único", note: "acceso hasta el examen", value: "29 €" },
    cta: {
      label: "Ver Auxilio Judicial",
      href: url("VITE_AUX_JURIDICO_URL", PRODUCT_URLS.auxJuridico),
    },
  },
];

