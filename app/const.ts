import { arbitrum, arbitrumSepolia } from "viem/chains";

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

export const ENABLED_CHAINS = import.meta.env.VITE_ENABLE_TESTNETS
  ? [arbitrumSepolia, arbitrum]
  : [arbitrum];

const ContractName = {
  DEGRADABLES: "DEGRADABLES",
  SWOL_JRS: "SWOL_JRS",
  SMOL_JRS: "SMOL_JRS",
  SMOL_CARS: "SMOL_CARS",
  SWOLERCYCLES: "SWOLERCYCLES",
  SMOL_TREASURES: "SMOL_TREASURES",
  SMOL_BRAINS: "SMOL_BRAINS"
} as const;

type ObjectValues<T> = T[keyof T];

export type TContractName = ObjectValues<typeof ContractName>;

export const CONTRACT_ADDRESSES: Record<
  number,
  Record<TContractName, `0x${string}`>
> = {
  [arbitrumSepolia.id]: {
    [ContractName.DEGRADABLES]: "0x771860c280A06095E279d3eBc7267a9b29281c8c",
    [ContractName.SWOL_JRS]: "0x35373d1aD8dc3F4a988AD7801c82d12FB68370D2",
    [ContractName.SMOL_JRS]: "0xc8A4E44D49404342d23b51eB34cD77e8a96a9Fac",
    [ContractName.SMOL_CARS]: "0x9babC0D3f4669A09DD77B78bD08cA74502A68Fb4",
    [ContractName.SWOLERCYCLES]: "0xab7c19bcaf8EeD1229777759d85D71b79f9429C7",
    [ContractName.SMOL_TREASURES]: "0x891eA0433bbbE77101EBD4318eE00307DE64D3b6",
    [ContractName.SMOL_BRAINS]: "0x269b635c10dEE290310072c160eeb7279a4c32a9"
  },
  [arbitrum.id]: {
    [ContractName.DEGRADABLES]: "0x1f4F7cE3Bd6aF5e6E8cEeA5fF7FfBb2dAaE3Bd6a",
    [ContractName.SWOL_JRS]: "0x1f4F7cE3Bd6aF5e6E8cEeA5fF7FfBb2dAaE3Bd6a",
    [ContractName.SMOL_JRS]: "0x1f4F7cE3Bd6aF5e6E8cEeA5fF7FfBb2dAaE3Bd6a",
    [ContractName.SMOL_CARS]: "0x1f4F7cE3Bd6aF5e6E8cEeA5fF7FfBb2dAaE3Bd6a",
    [ContractName.SWOLERCYCLES]: "0x1f4F7cE3Bd6aF5e6E8cEeA5fF7FfBb2dAaE3Bd6a",
    [ContractName.SMOL_TREASURES]: "0x1f4F7cE3Bd6aF5e6E8cEeA5fF7FfBb2dAaE3Bd6a",
    [ContractName.SMOL_BRAINS]: "0x1f4F7cE3Bd6aF5e6E8cEeA5fF7FfBb2dAaE3Bd6a"
  }
};
