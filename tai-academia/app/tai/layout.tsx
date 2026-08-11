import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TAI C1 | Temario, tests y simulacros | Academia LORMAN",
  description:
    "Haz una prueba gratuita TAI C1 de 12 preguntas sin registro, con resultado por partes y corrección explicada. Curso completo con 33 temas, tests y simulacros.",
  keywords: [
    "curso TAI",
    "Técnico Auxiliar de Informática",
    "oposiciones informática C1",
    "preparación online TAI",
  ],
  openGraph: {
    title: "Prueba gratuita TAI C1 | Academia LORMAN",
    description:
      "12 preguntas sin registro: parte general, ruta práctica, resultado por partes y corrección explicada al terminar.",
    type: "website",
    locale: "es_ES",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prueba gratuita TAI C1 | Academia LORMAN",
    description:
      "12 preguntas sin registro, con resultado por partes y corrección explicada al terminar.",
    images: ["/og.png"],
  },
};

export default function TaiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
