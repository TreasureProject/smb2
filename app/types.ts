export type EnvVar = "PUBLIC_PARTYKIT_URL" | "PUBLIC_TROVE_API_KEY" | "CHAIN";

export type Env = {
  [key in EnvVar]: string;
};
