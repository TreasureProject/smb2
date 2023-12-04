/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PARTYKIT_URL: string;
  readonly VITE_TROVE_API_KEY: string;
  readonly CHAIN: string;
  readonly CONTENTFUL_ACCESS_TOKEN: string;
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
  readonly VITE_ENABLE_TESTNETS: string;
  readonly VITE_ALCHEMY_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
