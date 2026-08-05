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

export const CURSOS: FichaCursoProps[] = [
  {
    code: "TCAE",
    tone: "tcae",
    title: "Cuidados Auxiliares de Enfermería",
    meta: "Servicios de salud · turno libre",
    items: [
      { title: "Temario por bloques", note: "con resúmenes y esquemas" },
      { title: "Tests por tema", note: "respuesta razonada" },
      { title: "Simulacros tipo examen", note: "y repaso general autocorregible" },
    ],
    price: {
      title: "Pago único",
      note: "acceso hasta el examen",
      value: "PRECIO EN FUNCIÓN DEL CURSO",
    },
    cta: { label: "Ver cursos TCAE", href: url("VITE_TCAE_URL", PRODUCT_URLS.tcae) },
  },
  {
    code: "TAI",
    tone: "tai",
    title: "Técnico Auxiliar de Informática",
    meta: "Estado · subgrupo C1",
    items: [
      { title: "Temario completo", note: "33 temas" },
      { title: "Tests y autoevaluaciones", note: "muchos más que temas" },
      { title: "Simulacros y prácticos", note: "las dos partes del ejercicio" },
    ],
    price: { title: "Pago único", note: "acceso hasta el examen", value: "59 €" },
    cta: { label: "Ver curso TAI", href: url("VITE_TAI_URL", PRODUCT_URLS.tai) },
  },
  {
    code: "SS",
    tone: "ss",
    title: "Administrativo Seguridad Social",
    meta: "Subgrupo C1 · acceso libre",
    items: [
      { title: "Temario general y específico", note: "36 temas redactados" },
      { title: "Tests por tema", note: "con normativa citada" },
      { title: "Supuestos prácticos", note: "como en el ejercicio" },
    ],
    price: { title: "Pago único", note: "acceso hasta el examen", value: "79 €" },
    cta: { label: "Ver curso SS", href: url("VITE_SS_URL", PRODUCT_URLS.ss) },
  },
  {
    code: "AUX. JUDICIAL",
    tone: "aux",
    title: "Auxilio Judicial",
    meta: "Justicia · subgrupo C2 · solo tests",
    items: [
      { title: "Cuestionarios por tema", note: "26 temas cubiertos" },
      { title: "Práctica intensiva", note: "90 cuestionarios distintos" },
      { title: "Corrección automática", note: "sin temario incluido" },
    ],
    price: { title: "Pago único", note: "acceso hasta el examen", value: "29 €" },
    cta: {
      label: "Ver Auxilio Judicial",
      href: url("VITE_AUX_JURIDICO_URL", PRODUCT_URLS.auxJuridico),
    },
  },
];

/** Ficha en espera de Moodle: no se renderiza hasta poner el flag a true. */
export const MOSTRAR_C2 = false;

export const WHATSAPP = "34640828654";

export const CURSO_C2: FichaCursoProps = {
  code: "C2",
  tone: "hub",
  title: "Auxiliar Administrativo del Estado",
  meta: "Subgrupo C2",
  items: [
    { title: "Normativa y psicotécnicos", note: "primera parte" },
    { title: "Actividad y ofimática", note: "segunda parte" },
  ],
  cta: { label: "Quiero apuntarme", href: `https://wa.me/${WHATSAPP}` },
};
