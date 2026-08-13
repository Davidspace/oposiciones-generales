/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA4_MEASUREMENT_ID?: string;
  readonly VITE_CLARITY_PROJECT_ID?: string;
  readonly VITE_PORTFOLIO_URL?: string;
  readonly VITE_WHATSAPP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
