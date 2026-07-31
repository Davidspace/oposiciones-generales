import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curso completo TAI 2026 | Academia LORMAN",
  description:
    "Curso completo TAI C1: 33 temas, 33 autoevaluaciones y 10 simulacros para preparar las dos partes del ejercicio.",
  keywords: [
    "curso TAI",
    "Técnico Auxiliar de Informática",
    "oposiciones informática C1",
    "preparación online TAI",
  ],
  openGraph: {
    title: "Curso completo TAI 2026 | Academia LORMAN",
    description:
      "Contenido del aula LORMAN, precio de lanzamiento y ruta de autoestudio para TAI C1.",
    type: "website",
    locale: "es_ES",
    images: ["/og.png"],
  },
};

export default function TaiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
