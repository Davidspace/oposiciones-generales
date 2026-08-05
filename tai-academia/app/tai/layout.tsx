import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TAI C1 | Temario, tests y simulacros | Academia LORMAN",
  description:
    "33 temas, autoevaluaciones y simulacros para preparar las dos partes del ejercicio a tu ritmo.",
  keywords: [
    "curso TAI",
    "Técnico Auxiliar de Informática",
    "oposiciones informática C1",
    "preparación online TAI",
  ],
  openGraph: {
    title: "TAI C1 | Temario, tests y simulacros | Academia LORMAN",
    description:
      "Temario, tests y simulacros para preparar TAI C1. Pago único y acceso hasta el examen.",
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
