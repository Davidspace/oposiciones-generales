import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SS CasoLab | Academia de Seguridad Social C1",
  description:
    "Prepara los 23 temas generales, los 13 específicos y el supuesto práctico de Administrativo de la Seguridad Social C1.",
  keywords: [
    "Administrativo de la Seguridad Social C1",
    "supuesto práctico Seguridad Social",
    "oposiciones Seguridad Social C1",
    "casos prácticos Seguridad Social",
  ],
  openGraph: {
    title: "SS CasoLab | Academia de Seguridad Social C1",
    description:
      "Teoría breve, preguntas explicadas y supuestos en una ruta de 36 temas.",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "/ss-casolab-og.png",
        width: 1729,
        height: 910,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SS CasoLab | Academia de Seguridad Social C1",
    description:
      "Teoría breve, preguntas explicadas y supuestos en una ruta de 36 temas.",
    images: ["/ss-casolab-og.png"],
  },
};

export default function SsCasoLabLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
