import { arbitrum, arbitrumSepolia } from "viem/chains";
import { TCollectionsToFetchWithoutAs } from "./api.server";

export const SOCIALS = [
  {
    name: "discord",
    url: "https://discord.gg/smolbrains"
  },
  {
    name: "x_twitter",
    url: "https://x.com/smolverse"
  },
  {
    name: "trove",
    url: "https://app.treasure.lol/games/smolverse"
  }
] as const;

export const TYPE_TO_IPFS: Record<
  TCollectionsToFetchWithoutAs<"degradables" | "smol-brains-land">,
  string
> = {
  "swol-jrs": "QmXFvo9fN9oS8yodqbptNJQtZtWwAMiA56AnLh48cL9YhL",
  "smol-jrs": "QmcqUaWavNytEjLRSJf3hc3hZfksa92vocvScV9ZTymNRq",
  "smol-cars": "QmYGuiC6wfpHav96Nud19hc5oREfiuGsNnY26GfBFAzMvj",
  swolercycles: "QmcEcc9dSQFLZWuxdnxPhSL4YSRWVM1y72DJUaN27q6QnD",
  "smol-treasures": "QmNeq6SL6d7vkYH1FJbmDimmCrA4A3yPr7mJzZWPqHPAhc",
  "smol-brains": "QmPgLw49FDqzjjUszxVRsvZ312o8njEvVTWv3Xrf4D8hRN"
};

export const ENABLED_CHAINS =
  import.meta.env.VITE_ENABLE_TESTNETS === "true"
    ? [arbitrumSepolia, arbitrum]
    : [arbitrum];

const ContractName = {
  DEGRADABLES: "DEGRADABLES",
  SWOL_JRS: "SWOL_JRS",
  SMOL_JRS: "SMOL_JRS",
  SMOL_CARS: "SMOL_CARS",
  SWOLERCYCLES: "SWOLERCYCLES",
  SMOL_TREASURES: "SMOL_TREASURES",
  SMOL_BRAINS: "SMOL_BRAINS",
  MAGIC: "MAGIC",
  SCHOOL: "SCHOOL",
  GYM: "GYM",
  SMOL_BODIES: "SMOL_BODIES",
  SMOL_WORLD: "SMOL_WORLD",
  SMOL_BRAINS_LAND: "SMOL_BRAINS_LAND"
} as const;

type ObjectValues<T> = T[keyof T];

export type TContractName = ObjectValues<typeof ContractName>;

export const CONTRACT_ADDRESSES: Record<
  number,
  Record<TContractName, `0x${string}`>
> = {
  [arbitrumSepolia.id]: {
    [ContractName.MAGIC]: "0x55d0cf68a1afe0932aff6f36c87efa703508191c",
    [ContractName.DEGRADABLES]: "0xd7fd29273c4bfc2498dca8f4f776dd2deac2ff32",
    [ContractName.SWOL_JRS]: "0x35373d1aD8dc3F4a988AD7801c82d12FB68370D2",
    [ContractName.SMOL_JRS]: "0xc8A4E44D49404342d23b51eB34cD77e8a96a9Fac",
    [ContractName.SMOL_CARS]: "0x9babC0D3f4669A09DD77B78bD08cA74502A68Fb4",
    [ContractName.SWOLERCYCLES]: "0xab7c19bcaf8EeD1229777759d85D71b79f9429C7",
    [ContractName.SMOL_TREASURES]: "0x891eA0433bbbE77101EBD4318eE00307DE64D3b6",
    [ContractName.SMOL_BRAINS]: "0x269b635c10dEE290310072c160eeb7279a4c32a9",
    [ContractName.SCHOOL]: "0x22f6272FdfF01f5E0866F50a03F229eA31D7fAf8",
    [ContractName.GYM]: "0xcba012978544aCD852971500D1163E556D5bC883",
    [ContractName.SMOL_BODIES]: "0x924597eA8D6841C31B878a9CA82c89DdB4E9a2F4",
    [ContractName.SMOL_WORLD]: "0xA4cBeEBBFbbE502c7Cbc2184B197909dBBA6B423",
    [ContractName.SMOL_BRAINS_LAND]:
      "0x256cF509d7bE4F7E1960FDa2FD2be4b18C19D73D"
  },
  [arbitrum.id]: {
    [ContractName.MAGIC]: "0x539bde0d7dbd336b79148aa742883198bbf60342",
    [ContractName.DEGRADABLES]: "0x8512c0C23fA937F6D3257F759e45dD7F52536A58",
    [ContractName.SWOL_JRS]: "0xAe0d0C4Cc3335FD49402781E406ADF3f02D41bcA",
    [ContractName.SMOL_JRS]: "0xF6Cc57C45CE730496b4d3Df36b9A4E4C3a1B9754",
    [ContractName.SMOL_CARS]: "0xB16966daD2B5a5282b99846B23dcDF8C47b6132C",
    [ContractName.SWOLERCYCLES]: "0xdf32aED1eB841A174Cb637eAa1707026319fb563",
    [ContractName.SMOL_TREASURES]: "0xc5295c6a183f29b7c962df076819d44e0076860e",
    [ContractName.SMOL_BRAINS]: "0xA7f1462e0EcdeEbDeE4FaF6681148Ca96Db78777",
    [ContractName.SCHOOL]: "0xBadDab83c79D3Aa8742d979609592BEe8499370d",
    [ContractName.GYM]: "0x66299ecC614b7A1920922bBa7527819c841174BD",
    [ContractName.SMOL_BODIES]: "0x17DaCAD7975960833f374622fad08b90Ed67D1B5",
    // TODO: update this address
    [ContractName.SMOL_WORLD]: "0x000000000000000000000",
    [ContractName.SMOL_BRAINS_LAND]:
      "0xd666d1CC3102cd03e07794A61E5F4333B4239F53"
  }
};
