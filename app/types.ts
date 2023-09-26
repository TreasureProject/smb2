export type EnvVar = "PUBLIC_PARTYKIT_URL";

export type Env = {
  [key in EnvVar]: string;
};
