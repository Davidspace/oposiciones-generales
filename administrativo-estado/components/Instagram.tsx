/** Icono de Instagram (Lucide, trazo 1.5) y enlace sutil reutilizable. */

export const INSTAGRAM_URL = "https://www.instagram.com/tcae_academia_lm/";

export function IconoInstagram({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

export function EnlaceInstagram({ size = 17 }: { size?: number }) {
  return (
    <a
      className="lm-ig"
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram de Academia LORMAN"
    >
      <IconoInstagram size={size} />
      <span>Instagram</span>
    </a>
  );
}
