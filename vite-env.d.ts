interface ImportMetaEnv {
  VITE_GEMINI_API_KEY: string;
  // add other env vars here
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
/// <reference types="vite/client" />
