import { useNetwork } from "wagmi";

import { CONTRACT_ADDRESSES, ENABLED_CHAINS } from "~/const";

const useChainId = () => {
  const { chain } = useNetwork();
  if (chain && !chain.unsupported) {
    return chain.id;
  }

  return ENABLED_CHAINS[0].id;
};

export const useContractAddresses = () => {
  const chainId = useChainId();
  return CONTRACT_ADDRESSES[chainId];
};
