/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_BETA_FF_PARAM?: string;
  readonly VITE_BETA_FF_VALUE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
