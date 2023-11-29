export type EnvVar =
  | "PUBLIC_PARTYKIT_URL"
  | "PUBLIC_TROVE_API_KEY"
  | "CHAIN"
  | "CONTENTFUL_ACCESS_TOKEN"
  | "PUBLIC_WALLETCONNECT_PROJECT_ID"
  | "PUBLIC_ENABLE_TESTNETS"
  | "PUBLIC_ALCHEMY_KEY";

export type Env = {
  [key in EnvVar]: string;
};

export type Weather = "sunny" | "rainy" | "snowy" | "windy" | "cloudy" | "fog";
