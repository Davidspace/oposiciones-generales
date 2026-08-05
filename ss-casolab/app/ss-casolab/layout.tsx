import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrativo SS C1 | Temario, tests y supuestos | Academia LORMAN",
  description:
    "36 temas, tests por tema y supuestos prácticos para preparar Administrativo de la Seguridad Social C1.",
  keywords: [
    "Administrativo de la Seguridad Social C1",
    "supuesto práctico Seguridad Social",
    "oposiciones Seguridad Social C1",
    "casos prácticos Seguridad Social",
  ],
  openGraph: {
    title: "Administrativo SS C1 | Temario, tests y supuestos | Academia LORMAN",
    description:
      "Temario, tests y supuestos prácticos en una ruta de 36 temas.",
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
    title: "Administrativo SS C1 | Temario, tests y supuestos | Academia LORMAN",
    description:
      "Temario, tests y supuestos prácticos en una ruta de 36 temas.",
    images: ["/ss-casolab-og.png"],
  },
};

export default function SsCasoLabLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
