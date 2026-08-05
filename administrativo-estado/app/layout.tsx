import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",", 1)[0]
    .trim();
  const localHost =
    host !== null &&
    /^(?:localhost|127(?:\.[0-9]{1,3}){3}|\[::1\])(?::[0-9]+)?$/u.test(host);
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : localHost
        ? "http"
        : "https";
  const metadataBase = host
    ? new URL(`${protocol}://${host}`)
    : new URL("http://localhost:3000");
  const title = "Auxiliar AGE C2 | Prueba gratuita | Academia LORMAN";
  const description =
    "Prueba gratuita de cinco preguntas de normativa, psicotécnicos y ofimática para Auxiliar Administrativo del Estado C2.";
  const imageUrl = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    alternates: { canonical: "/" },
    title,
    description,
    keywords: [
      "oposiciones auxiliar administrativo estado",
      "auxiliar administrativo C2",
      "psicotécnicos auxiliar administrativo",
      "ofimática Windows 11 Microsoft 365 oposición",
      "Cuerpo General Auxiliar Administración del Estado",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_ES",
      images: [{ url: imageUrl, width: 1731, height: 909 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
