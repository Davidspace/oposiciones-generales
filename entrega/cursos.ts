/**
 * Datos de las fichas del hub. Una entrada por producto.
 * Regla: el tipo de contenido va en `items[].title` (grande) y las cifras
 * en `items[].note` (pequeño). El precio solo aparece si está cerrado.
 *
 * Estado actual (2026-08-03):
 *  - TCAE: abierto, precio según servicio de salud → sin fila de precio.
 *  - TAI: curso completo, 95 € pago único, acceso hasta el examen.
 *  - SS: abierto, 49 € pago único, acceso hasta el examen.
 *  - Auxilio Judicial: solo tests, sin temario.
 *  - Auxiliar Administrativo del Estado C2: OCULTO (Moodle no preparado).
 */

import type { FichaCursoProps } from "./FichaCurso";

const url = (key: string, fallback: string) =>
  (typeof process !== "undefined" && process.env?.[key]) || fallback;

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
    cta: {
      label: "Ver curso TCAE",
      href: url("NEXT_PUBLIC_TCAE_URL", "/tcae"),
    },
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
    price: {
      title: "Pago único",
      note: "acceso hasta el examen",
      value: "95 €",
    },
    cta: { label: "Ver curso TAI", href: url("NEXT_PUBLIC_TAI_URL", "/tai") },
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
    price: {
      title: "Pago único",
      note: "acceso hasta el examen",
      value: "49 €",
    },
    cta: { label: "Ver curso SS", href: url("NEXT_PUBLIC_SS_URL", "/ss-casolab") },
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
    cta: {
      label: "Ver Auxilio Judicial",
      href: url("NEXT_PUBLIC_AUX_JURIDICO_URL", "/auxiliar-juridico"),
    },
  },
];

/** Ficha en espera de Moodle: no se renderiza hasta poner el flag a true. */
export const MOSTRAR_C2 = false;

export const CURSO_C2: FichaCursoProps = {
  code: "C2",
  tone: "hub",
  title: "Auxiliar Administrativo del Estado",
  meta: "Subgrupo C2",
  items: [
    { title: "Normativa y psicotécnicos", note: "primera parte" },
    { title: "Actividad y ofimática", note: "segunda parte" },
  ],
  cta: { label: "Quiero apuntarme", href: "https://wa.me/34640828654" },
};

export const WHATSAPP = "34640828654";
