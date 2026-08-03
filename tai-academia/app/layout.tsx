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
  const title = "TAI Academia | Técnico Auxiliar de Informática";
  const description =
    "Preparación digital para Técnico Auxiliar de Informática.";
  const imageUrl = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    alternates: { canonical: "/" },
    title,
    description,
    keywords: [
      "oposiciones TAI",
      "Técnico Auxiliar de Informática",
      "test TAI",
      "temario TAI",
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
