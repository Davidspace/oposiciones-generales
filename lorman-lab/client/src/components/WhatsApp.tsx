/** Icono y enlace de WhatsApp reutilizables en los pies de Academia LORMAN. */

export const DEFAULT_WHATSAPP_URL = "https://wa.me/34640828654";

export function IconoWhatsApp({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.5 3.5A11.5 11.5 0 0 0 2.42 17.38L1.5 22.5l5.23-.9A11.5 11.5 0 1 0 20.5 3.5Z" />
      <path d="M8.18 6.98c.27-.6.55-.61.82-.61h.7c.2 0 .42.08.53.38l.72 1.73c.1.25.06.45-.08.63l-.56.7c-.15.18-.31.36-.13.67.18.31.8 1.31 1.72 2.12 1.18 1.04 2.18 1.36 2.49 1.52.31.16.49.13.67-.08l.76-.9c.2-.25.4-.2.67-.11l1.6.76c.27.13.45.2.52.31.07.11.07.66-.16 1.27-.23.61-1.32 1.17-1.84 1.22-.48.05-1.1.07-1.78-.14-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.18-1.15-1.53-1.15-2.93 0-1.4.72-2.08.98-2.36Z" />
    </svg>
  );
}

export function EnlaceWhatsApp({
  href = DEFAULT_WHATSAPP_URL,
  size = 17,
}: {
  href?: string;
  size?: number;
}) {
  return (
    <a
      className="lm-wa"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp de Academia LORMAN"
    >
      <IconoWhatsApp size={size} />
      <span>WhatsApp</span>
    </a>
  );
}
