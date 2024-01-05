import { useReducer, useEffect } from "react";
import {
  TTransition,
  TTransitions,
  matchProp,
  transition,
  useEnter
} from "react-states";
import { useAccount, useWaitForTransaction } from "wagmi";
import { InventoryT } from "~/api.server";
import { loader } from "../get-inventory.$address";
import { loader as worldLoader, WorldInfoT } from "../generate-world";
import { useContractAddresses } from "~/useChainAddresses";
import { TransactionReceipt, decodeEventLog } from "viem";

import * as ABIS from "~/artifacts";
import { isBurnAddress } from "~/utils";
import { useFetcher } from "~/hooks/useFetcher";
import {
  usePrepareSmolWorldBurnOldSmolWorldToMintNewSmolWorld,
  useSmolWorldBurnOldSmolWorldToMintNewSmolWorld
} from "~/generated";
import { useApproval } from "~/hooks/useApprove";

interface BaseState {
  inventory: InventoryT | null;
}

interface IdleState extends BaseState {
  state: "IDLE";
}

interface LoadingInventoryState extends BaseState {
  state: "LOADING_INVENTORY";
}

interface EnterWorldState extends BaseState {
  state: "ENTER_WORLD";
  worldId: string;
  world: WorldInfoT;
}

interface GeneratingWorldState extends BaseState {
  state: "GENERATING_WORLD";
  worldId: string;
}

interface MissingWorldState extends BaseState {
  state: "MISSING_WORLD";
  landId: string | null;
}

interface NeedApprovalState extends BaseState {
  state: "NEED_APPROVAL";
  landId: string | null;
}

interface ApprovingLandState extends BaseState {
  state: "APPROVING_LAND";
  landId: string | null;
}

interface MintingWorldState extends BaseState {
  state: "MINTING_WORLD";
}

interface MissingLandState extends BaseState {
  state: "MISSING_LAND";
}

interface ErrorState extends BaseState {
  state: "ERROR";
}

export type State =
  | IdleState
  | LoadingInventoryState
  | EnterWorldState
  | GeneratingWorldState
  | MissingWorldState
  | NeedApprovalState
  | ApprovingLandState
  | MintingWorldState
  | MissingLandState
  | ErrorState;

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
      worldId: string;
    }
  | {
      type: "missing_world";
      landId: string | null;
    }
  | {
      type: "enter_world";
      world: WorldInfoT;
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
      type: "generate_world";
      worldId: string;
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
    load_inventory_success: (ctx, { inventory, worldId }) => ({
      ...ctx,
      inventory,
      worldId,
      state: "GENERATING_WORLD"
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
  GENERATING_WORLD: {
    enter_world: (ctx, { world }) => ({
      inventory: ctx.inventory,
      worldId: ctx.worldId,
      world,
      state: "ENTER_WORLD"
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
  MINTING_WORLD: {
    generate_world: (ctx, { worldId }) => ({
      ...ctx,
      worldId,
      state: "GENERATING_WORLD"
    })
  },
  ERROR: {
    ...BASE_TRANSITIONS
  }
};

const reducer = (state: State, action: Action) =>
  transition(state, action, transitions);

export const useMainReducer = () => {
  const worldReducer = useReducer(reducer, {
    state: "IDLE",
    inventory: null
  });

  const [state, dispatch] = worldReducer;

  const { isConnected, address } = useAccount();
  const connected = isConnected && address !== undefined;

  const contractAddresses = useContractAddresses();
  const [fetcherRef, fetcher] = useFetcher<typeof loader>({ key: "inventory" });
  const [worldFetcherRef, worldFetcher] = useFetcher<typeof worldLoader>();

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

      if (fetcher.state === "idle") {
        if (!fetcher.data) {
          fetcherRef.load(
            `/get-inventory/${address}?${new URLSearchParams({
              except:
                "degradables,smol-treasures,swol-jrs,smol-jrs,smol-cars,swolercycles"
            })}`
          );
        } else {
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
            worldId: fetcher.data.data["smol-world"][0].tokenId
          });
        }
      }
    },
    [connected, fetcher.state, fetcher.data]
  );

  useEnter(
    state,
    "GENERATING_WORLD",
    (ctx) => {
      const worldId = ctx.worldId;
      if (worldFetcher.state === "idle") {
        if (!worldFetcher.data) {
          worldFetcherRef.load(`/generate-world?worldTokenId=${worldId}`);
        } else {
          if (worldFetcher.data.ok) {
            dispatch({ type: "enter_world", world: worldFetcher.data.data });
            return;
          }

          dispatch({ type: "connection_error" });
        }
      }
    },
    [worldFetcher.state, worldFetcher.data]
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

      dispatch({
        type: "generate_world",
        worldId: (result?.args?.tokenId ?? BigInt(0)).toString()
      });

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
