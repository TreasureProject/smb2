import { useLoaderData } from "@remix-run/react";
import {
  useReducer,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import {
  PickState,
  TTransition,
  TTransitions,
  matchProp,
  transition,
  useEnter
} from "react-states";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";
import {
  InventoryT,
  SmolWorldT,
  TCollectionsToFetchWithoutAs,
  TroveToken,
  fetchTroveTokensForUser
} from "~/api.server";
import { loader } from "../get-inventory.$address";
import { useContractAddresses } from "~/useChainAddresses";
import { TransactionReceipt, decodeEventLog } from "viem";

import * as ABIS from "~/artifacts";
import { isBurnAddress } from "~/utils";
import { useFetcher } from "~/hooks/useFetcher";
import {
  usePrepareSmolWorldBurnOldSmolWorldToMintNewSmolWorld,
  useSmolWorldBurnOldSmolWorldToMintNewSmolWorld,
  useSmolWorldTransferEvent
} from "~/generated";
import { useApproval } from "~/hooks/useApprove";

type State =
  | {
      state: "IDLE";
    }
  | {
      state: "LOADING_INVENTORY";
    }
  | {
      state: "ENTER_WORLD";
      inventory: InventoryT;
      smolWorldData: SmolWorldT | null;
    }
  | {
      state: "MISSING_WORLD";
      landId: string | null;
    }
  | {
      state: "NEED_APPROVAL";
      landId: string | null;
    }
  | {
      state: "APPROVING_LAND";
      landId: string | null;
    }
  | {
      state: "MINTING_WORLD";
    }
  | {
      state: "MISSING_LAND";
    }
  | {
      state: "ERROR";
    };

type Action =
  | {
      type: "connected_to_wallet";
    }
  | {
      type: "disconnected_from_wallet";
    }
  | {
      type: "load_inventory_success";
      inventory: InventoryT;
      smolWorldData: SmolWorldT | null;
    }
  | {
      type: "missing_world";
      landId: string | null;
    }
  | {
      type: "missing_land";
    }
  | {
      type: "missing_land_approval";
    }
  | {
      type: "approve_land";
    }
  | {
      type: "approve_land_success";
    }
  | {
      type: "mint_world";
    }
  | {
      type: "load_inventory_error";
    }
  | {
      type: "connection_error";
    };

const BASE_TRANSITIONS: TTransition<State, Action> = {
  disconnected_from_wallet: (ctx) => ({
    ...ctx,
    state: "IDLE"
  }),
  connection_error: (ctx) => ({
    ...ctx,
    state: "ERROR"
  })
};

const transitions: TTransitions<State, Action> = {
  IDLE: {
    ...BASE_TRANSITIONS,
    connected_to_wallet: (ctx) => ({
      ...ctx,
      state: "LOADING_INVENTORY"
    })
  },
  LOADING_INVENTORY: {
    ...BASE_TRANSITIONS,
    load_inventory_error: (ctx) => ({
      ...ctx,
      state: "ERROR"
    }),
    load_inventory_success: (ctx, { inventory, smolWorldData }) => ({
      ...ctx,
      inventory,
      smolWorldData,
      state: "ENTER_WORLD"
    }),
    missing_world: (ctx, { landId }) => ({
      ...ctx,
      landId,
      state: "MISSING_WORLD"
    }),
    missing_land: (ctx) => ({
      ...ctx,
      state: "MISSING_LAND"
    })
  },
  ENTER_WORLD: {
    ...BASE_TRANSITIONS
  },
  MISSING_LAND: {
    ...BASE_TRANSITIONS
  },
  APPROVING_LAND: {
    approve_land_success: (ctx) => ({
      ...ctx,
      state: "MISSING_WORLD"
    })
  },
  NEED_APPROVAL: {
    approve_land: (ctx) => ({
      ...ctx,
      state: "APPROVING_LAND"
    })
  },
  MISSING_WORLD: {
    ...BASE_TRANSITIONS,
    missing_land_approval: (ctx) => ({
      ...ctx,
      state: "NEED_APPROVAL"
    }),
    mint_world: (ctx) => ({
      ...ctx,
      state: "MINTING_WORLD"
    })
  },
  MINTING_WORLD: {},
  ERROR: {
    ...BASE_TRANSITIONS
  }
};

const reducer = (state: State, action: Action) =>
  transition(state, action, transitions);

export const useWorldReducer = () => {
  const worldReducer = useReducer(reducer, {
    state: "IDLE"
  });

  const [state, dispatch] = worldReducer;

  const { isConnected, address } = useAccount();
  const connected = isConnected && address !== undefined;

  const contractAddresses = useContractAddresses();
  const [fetcherRef, fetcher] = useFetcher<typeof loader>({ key: "inventory" });

  // reset state when disconnected
  useEffect(() => {
    if (connected) return;

    dispatch({
      type: "disconnected_from_wallet"
    });
  }, [connected, dispatch]);

  useEnter(
    state,
    "IDLE",
    () => {
      fetcher.submit({}, { action: "/reset-fetcher", method: "post" });
      if (connected) {
        dispatch({ type: "connected_to_wallet" });
      }
    },
    [connected]
  );

  useEnter(
    state,
    "LOADING_INVENTORY",
    () => {
      if (!connected) return;

      fetcherRef.load(`/get-inventory/${address}?_=${new Date().getTime()}`);

      if (fetcher.state === "idle" && fetcher.data) {
        if (!fetcher.data.ok) {
          dispatch({ type: "load_inventory_error" });
          return;
        }

        // no land and no world
        if (
          !fetcher.data.data["smol-world"] &&
          !fetcher.data.data["smol-brains-land"]
        ) {
          dispatch({ type: "missing_land" });
          return;
        }

        // has land but no world
        if (!fetcher.data.data["smol-world"]) {
          dispatch({
            type: "missing_world",
            landId: fetcher.data.data["smol-brains-land"]?.[0].tokenId ?? null
          });
          return;
        }

        dispatch({
          type: "load_inventory_success",
          inventory: fetcher.data.data,
          smolWorldData:
            fetcher.data.data["smol-world"][0].metadata.smolWorldData ?? null
        });
      }
    },
    [connected, fetcher.state]
  );

  // APPROVE LAND
  const { isApproved, approve, refetch, isSuccess } = useApproval({
    type: "smol-brains-land",
    operator: contractAddresses["SMOL_WORLD"]
  });

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isApproved) {
      dispatch({ type: "approve_land_success" });
    }
  }, [isApproved, dispatch]);

  useEnter(
    state,
    "APPROVING_LAND",
    () => {
      approve?.();
    },
    [approve]
  );

  useEnter(
    state,
    "MISSING_WORLD",
    () => {
      if (!isApproved) {
        dispatch({ type: "missing_land_approval" });
      }
    },
    [isApproved]
  );

  // MINT WORLD
  const landId = matchProp(state, "landId")?.landId;

  const {
    config: burnOldWorldToMintSmolWorldConfig,
    status: burnOldWorldToMintSmolWorldStatus
  } = usePrepareSmolWorldBurnOldSmolWorldToMintNewSmolWorld({
    address: contractAddresses["SMOL_WORLD"],
    args: [BigInt(landId ?? 0)],
    enabled: !!landId && isApproved
  });

  const burnOldWorldForNewWorld =
    useSmolWorldBurnOldSmolWorldToMintNewSmolWorld(
      burnOldWorldToMintSmolWorldConfig
    );

  const burnOldWorldForNewWorldResult = useWaitForTransaction(
    burnOldWorldForNewWorld.data
  );

  useEffect(() => {
    if (
      burnOldWorldToMintSmolWorldStatus === "error" ||
      burnOldWorldForNewWorld.status === "error"
    ) {
      dispatch({ type: "connection_error" });
    }
  }, [
    burnOldWorldToMintSmolWorldStatus,
    burnOldWorldForNewWorld.status,
    dispatch
  ]);

  useEffect(() => {
    if (
      burnOldWorldForNewWorldResult.status === "success" &&
      burnOldWorldForNewWorldResult.data
    ) {
      const data = burnOldWorldForNewWorldResult.data as TransactionReceipt;

      const result = data.logs
        .filter(
          ({ address }) =>
            address === contractAddresses["SMOL_WORLD"].toLowerCase()
        )
        .map(({ data, topics }) =>
          decodeEventLog({
            strict: false,
            abi: ABIS.SMOL_WORLD,
            eventName: "Transfer",
            data,
            topics
          })
        )
        .find(
          ({ eventName, args }) =>
            eventName === "Transfer" && isBurnAddress(args.from)
        );

      console.log({ result });

      burnOldWorldForNewWorld.reset();
    }
  }, [
    burnOldWorldForNewWorldResult.status,
    burnOldWorldForNewWorldResult.data,
    burnOldWorldForNewWorld.reset
  ]);

  useEnter(
    state,
    "MINTING_WORLD",
    () => {
      burnOldWorldForNewWorld.write?.();
    },
    [burnOldWorldForNewWorld.write]
  );

  return worldReducer;
};
