import { TCollectionsToFetchWithoutAs, TroveToken } from "~/api.server";
import {
  useErc20Approve,
  useErc721SetApprovalForAll,
  useErc1155SetApprovalForAll,
  usePrepareErc20Approve,
  usePrepareErc721SetApprovalForAll,
  usePrepareErc1155SetApprovalForAll,
  useErc721IsApprovedForAll,
  useErc1155IsApprovedForAll
} from "~/generated";
import { useContractAddresses } from "~/useChainAddresses";
import { TContractName } from "~/const";
import { useAccount, useWaitForTransaction } from "wagmi";
import { erc } from "@wagmi/cli/plugins";
import { useCallback } from "react";

type Props = {
  type: TCollectionsToFetchWithoutAs<"degradables">;
  operator: `0x${string}`;
};

const TYPE_TO_CONTRACT_NAME: Record<
  TCollectionsToFetchWithoutAs<"degradables">,
  TContractName
> = {
  "swol-jrs": "SWOL_JRS",
  "smol-jrs": "SMOL_JRS",
  "smol-cars": "SMOL_CARS",
  swolercycles: "SWOLERCYCLES",
  "smol-treasures": "SMOL_TREASURES",
  "smol-brains": "SMOL_BRAINS",
  "smol-brains-land": "SMOL_BRAINS_LAND"
} as const;

const useApprove = ({ type, operator }: Props) => {
  const contractAddresses = useContractAddresses();
  const contractName = TYPE_TO_CONTRACT_NAME[type];
  const address = contractAddresses[contractName];
  const ercType = contractName !== "SMOL_TREASURES" ? "ERC721" : "ERC1155";

  const { config: erc721ApproveConfig } = usePrepareErc721SetApprovalForAll({
    address,
    args: [operator, true],
    enabled: ercType === "ERC721"
  });
  const erc721Approve = useErc721SetApprovalForAll(erc721ApproveConfig);
  const { isSuccess: isERC721ApproveSuccess } = useWaitForTransaction(
    erc721Approve.data
  );

  const { config: erc1155ApproveConfig } = usePrepareErc1155SetApprovalForAll({
    address,
    args: [operator, true],
    enabled: ercType === "ERC1155"
  });
  const erc1155Approve = useErc1155SetApprovalForAll(erc1155ApproveConfig);
  const { isSuccess: isERC1155ApproveSuccess } = useWaitForTransaction(
    erc1155Approve.data
  );

  const approve = useCallback(() => {
    if (ercType === "ERC721") {
      erc721Approve.write?.();
    } else {
      erc1155Approve.write?.();
    }
  }, [ercType, erc721Approve.write, erc1155Approve.write]);

  return {
    approve,
    isSuccess: isERC721ApproveSuccess || isERC1155ApproveSuccess
  };
};

const useIsApproved = ({ type, operator }: Props) => {
  const { address } = useAccount();
  const contractAddresses = useContractAddresses();
  const contractName = TYPE_TO_CONTRACT_NAME[type];
  const collectionAddress = contractAddresses[contractName];
  const ercType = contractName !== "SMOL_TREASURES" ? "ERC721" : "ERC1155";

  const {
    data: erc721IsApprovedForAll,
    refetch: refetchERC721IsApprovedForAll
  } = useErc721IsApprovedForAll({
    address: collectionAddress,
    args: [address ?? "0x", operator],
    enabled: ercType === "ERC721"
  });

  const {
    data: erc1155IsApprovedForAll,
    refetch: refetchERC1155IsApprovedForAll
  } = useErc1155IsApprovedForAll({
    address: collectionAddress,
    args: [address ?? "0x", operator],
    enabled: ercType === "ERC1155"
  });

  const refetch = useCallback(() => {
    refetchERC721IsApprovedForAll();
    refetchERC1155IsApprovedForAll();
  }, [refetchERC721IsApprovedForAll, refetchERC1155IsApprovedForAll]);

  return {
    isApproved: !!erc721IsApprovedForAll || !!erc1155IsApprovedForAll,
    refetch
  };
};

export const useApproval = ({ type, operator }: Props) => {
  const { isApproved, refetch } = useIsApproved({
    type,
    operator
  });
  const { approve, isSuccess } = useApprove({
    type,
    operator
  });
  return {
    isApproved,
    approve,
    refetch,
    isSuccess
  };
};
