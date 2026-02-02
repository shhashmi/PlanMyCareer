/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ADVANCED_ASSESSMENT_STAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
