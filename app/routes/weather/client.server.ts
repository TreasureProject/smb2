import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";

export const client = createPublicClient({
  chain: arbitrum,
  transport: http(
    `https://arb-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`
  )
});
