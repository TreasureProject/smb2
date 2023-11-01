export type EnvVar =
  | "PUBLIC_PARTYKIT_URL"
  | "PUBLIC_TROVE_API_KEY"
  | "CHAIN"
  | "PUBLIC_ALCHEMY_KEY";

export type Env = {
  [key in EnvVar]: string;
};
