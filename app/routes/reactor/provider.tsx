import { useFetcher } from "@remix-run/react";
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
  TCollectionsToFetch,
  TCollectionsToFetchWithoutAs,
  TroveToken,
  fetchTroveTokensForUser
} from "~/api.server";
import { loader } from "../get-inventory.$address";
import { useContractAddresses } from "~/useChainAddresses";
import { TransactionReceipt, decodeEventLog } from "viem";
import * as R from "remeda";

import * as ABIS from "~/artifacts";
import { isBurnAddress } from "~/utils";

export type Ttoken = {
  tokenId: string;
  type: TCollectionsToFetchWithoutAs<"degradables">;
  uri: string;
  supply: number;
};

function lootToRainbowTreasure(items?: TroveToken[]) {
  const colorCounts: Record<string, number> = {};
  const shapeCounts: Record<string, number> = {};
  const colorTokenIds: Record<string, bigint[]> = {};
  const shapeTokenIds: Record<string, bigint[]> = {};

  if (!items) return [];

  items.forEach((item) => {
    item.metadata.attributes.forEach((attribute) => {
      if (attribute.trait_type === "Color") {
        const color = attribute.value as string;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
        colorTokenIds[color] = colorTokenIds[color] || [];
        colorTokenIds[color].push(BigInt(item.tokenId));
      } else if (attribute.trait_type === "Shape") {
        const shape = attribute.value as string;
        shapeCounts[shape] = (shapeCounts[shape] || 0) + 1;
        shapeTokenIds[shape] = shapeTokenIds[shape] || [];
        shapeTokenIds[shape].push(BigInt(item.tokenId));
      }
    });
  });
  // 0 = BY_SHAPE
  // 1 = BY_COLOR
  const results: { tokenIds: bigint[]; craftType: 0 | 1 }[] = [];

  const createResultsForAttribute = (
    tokenIds: bigint[],
    craftType: "COLOR" | "SHAPE"
  ) => {
    for (let i = 0; i < tokenIds.length; i += 15) {
      if (i + 15 <= tokenIds.length) {
        results.push({
          tokenIds: tokenIds.slice(i, i + 15),
          craftType: craftType === "COLOR" ? 1 : 0
        });
      }
    }
  };

  for (const color in colorCounts) {
    if (colorCounts[color] >= 15) {
      createResultsForAttribute(colorTokenIds[color], "COLOR");
    }
  }

  for (const shape in shapeCounts) {
    if (shapeCounts[shape] >= 15) {
      if (
        !results.some((result) =>
          result.tokenIds.some((tokenId) =>
            shapeTokenIds[shape].includes(tokenId)
          )
        )
      ) {
        createResultsForAttribute(shapeTokenIds[shape], "SHAPE");
      }
    }
  }

  return results;
}

const template: {
  smolCarIds: bigint[];
  swolercycleIds: bigint[];
  treasureIds: bigint[];
  smolPetIds: bigint[];
  swolPetIds: bigint[];
  treasureAmounts: bigint[];
  vehicleSkinIds: bigint[];
  merkleProofsForSmolTraitShop: `0x${string}`[];
  smolTraitShopSkinCount: bigint;
  smolFemaleIds: bigint[];
} = {
  smolCarIds: [],
  swolercycleIds: [],
  treasureIds: [],
  smolPetIds: [],
  swolPetIds: [],
  treasureAmounts: [],
  vehicleSkinIds: [],
  merkleProofsForSmolTraitShop: [],
  smolTraitShopSkinCount: BigInt(0),
  smolFemaleIds: []
};

const TYPE_TO_IDS: Record<
  TCollectionsToFetchWithoutAs<"degradables">,
  string
> = {
  "swol-jrs": "swolPetIds",
  "smol-jrs": "smolPetIds",
  "smol-cars": "smolCarIds",
  swolercycles: "swolercycleIds",
  "smol-treasures": "treasureIds",
  "smol-brains": "smolFemaleIds"
} as const;

function normalizeSmolverseNft(tokens: Ttoken[]) {
  const newTemplate = R.clone(template);

  for (const token of tokens) {
    const key = TYPE_TO_IDS[token.type] as keyof typeof newTemplate;

    // for now
    if (key === "merkleProofsForSmolTraitShop") continue;

    if (key === "treasureIds") {
      const arrOrNumber = newTemplate["treasureAmounts"];
      if (Array.isArray(arrOrNumber)) {
        arrOrNumber.push(BigInt(token.supply));
      }
    }
    const arrOrNumber = newTemplate[key];

    if (Array.isArray(arrOrNumber)) {
      arrOrNumber.push(BigInt(token.tokenId));
    }
  }

  return newTemplate;
}

const ReactorContext = createContext<{
  state: State;
  dispatch: (action: Action) => void;
} | null>(null);

export const useReactor = () => {
  const context = useContext(ReactorContext);
  if (!context) {
    throw new Error("useReactor must be used within a ReactorProvider");
  }
  return context;
};

type Inventory = Awaited<ReturnType<typeof fetchTroveTokensForUser>>;

export type State = {
  message?: string;
  inventory: Inventory | null;
} & (
  | {
      // Scientist welcomes you
      state: "IDLE";
    }
  | {
      state: "NOT_CONNECTED";
      prevState: PickState<State, "USE_REACTOR" | "REROLL" | "IDLE">["state"];
    }
  | {
      state: "LOADING_INVENTORY";
      prevState: PickState<State, "USE_REACTOR" | "REROLL" | "IDLE">["state"];
    }
  | {
      // What is this?
      state: "WHAT_IS_THIS";
    }
  | {
      state: "USE_REACTOR";
    }
  | {
      state: "REACTOR__NO_SMOLVERSE_NFT";
    }
  | {
      state: "REACTOR__NO_DEGRADABLE";
    }
  | {
      state: "REACTOR__SELECTING_SMOLVERSE_NFT";
    }
  | {
      state: "REACTOR__SELECTED_SMOLVERSE_NFT";
      selectedTokens: Ttoken[];
    }
  | {
      state: "REACTOR__CONVERTING_SMOLVERSE_NFT_TO_DEGRADABLE";
    }
  | {
      state: "RESULT";
    }
  | {
      state: "REACTOR__MALFUNCTION";
      selectedTokens: Ttoken[];
    }
  | {
      state: "REACTOR__SELECT_OPTION";
      producableRainbowTreasures: ReturnType<typeof lootToRainbowTreasure>;
    }
  | {
      state: "REACTOR__SELECTING_DEGRADABLE";
    }
  | {
      state: "REACTOR__SELECTED_DEGRADABLES";
      producableRainbowTreasures: ReturnType<typeof lootToRainbowTreasure>;
    }
  | {
      state: "REACTOR__PRODUCING_RAINBOW_TREASURE";
    }
  | {
      state: "REACTOR__PRODUCED_RAINBOW_TREASURE";
    }
  | {
      state: "REROLL";
    }
  | {
      state: "SELECTING_RAINBOW_TREASURE_TO_REROLL";
    }
  | {
      state: "REROLL__REROLLING";
    }
  | {
      state: "REROLL__REROLLED";
    }
  | {
      state: "ERROR";
    }
);

type Action =
  | {
      type: "CONNECTED_TO_WALLET";
      prevState: PickState<State, "USE_REACTOR" | "REROLL" | "IDLE">["state"];
    }
  | {
      type: "DISCONNECTED_FROM_WALLET";
      prevState: PickState<State, "USE_REACTOR" | "REROLL" | "IDLE">["state"];
    }
  | {
      type: "LOAD_INVENTORY";
    }
  | {
      type: "CONNECTION_ERROR";
    }
  | {
      type: "NEXT";
      moveTo: PickState<
        State,
        "WHAT_IS_THIS" | "USE_REACTOR" | "REROLL"
      >["state"];
    }
  | {
      type: "PUT_BACK";
      state: PickState<State, "USE_REACTOR" | "REROLL" | "IDLE">["state"];
      inventory: Inventory;
    }
  | {
      type: "MISSING";
      category: "degradables" | "smolverse-nft";
    }
  | {
      type: "SELECTING_SMOLVERSE_NFT";
    }
  | {
      type: "SELECT_SMOLVERSE_NFT";
      tokens: Ttoken[];
    }
  | {
      type: "TRY_LUCK";
    }
  | {
      type: "MALFUNCTION";
    }
  | {
      type: "PRODUCING_DEGRADABLE";
    }
  | {
      type: "MOVE_TO_RAINBOW_TREASURE_DIALOG";
      degradables: Inventory["degradables"];
    }
  | {
      type: "DISPLAY_NFTS";
      rainbowTreasuresMinted: number;
      degradableMinted: {
        tokenId: string;
        uri: string;
        supply: number;
      }[];
    }
  | {
      type: "PRODUCE_RAINBOW_TREASURE_AUTOMATICALLY";
    }
  | {
      type: "SELECT_DEGRADABLES_TO_CONVERT_TO_RAINBOW_TREASURE";
    }
  | {
      type: "SELECTING_RAINBOW_TREASURE_TO_REROLL";
    }
  | {
      type: "CONFIRM_REROLL";
    }
  | {
      type: "RESTART";
    };

const BASE_TRANSITIONS: TTransition<State, Action> = {
  DISCONNECTED_FROM_WALLET: (ctx, payload) => {
    return {
      ...ctx,
      state: "NOT_CONNECTED",
      prevState: payload.prevState,
      inventory: null,
      message: "Open up your backpack. Let’s see what we’re working with here."
    };
  },
  MISSING: (ctx, { category }) => {
    if (category === "smolverse-nft") {
      return {
        ...ctx,
        state: "REACTOR__NO_SMOLVERSE_NFT",
        message:
          "Hmm, it looks like your backpack is empty. Please come back later once you’ve gotten your act together."
      };
    }
    if (category === "degradables") {
      return {
        ...ctx,
        state: "REACTOR__NO_DEGRADABLE",
        message:
          "Hmm, it looks like you don’t have the right ingredients in your backpack. You can try inputting random items, but there is no guarantee that a Rainbow Treasure will be produced. Do you wish to proceed?"
      };
    }
    return ctx;
  },
  RESTART: (ctx) => ({
    ...ctx,
    state: "IDLE",
    message: "Welcome to the rainbow factory. How can I help you today?"
  })
};

const transitions: TTransitions<State, Action> = {
  IDLE: {
    ...BASE_TRANSITIONS,
    NEXT: (ctx, { moveTo }) => {
      if (moveTo === "WHAT_IS_THIS") {
        return {
          ...ctx,
          state: "WHAT_IS_THIS",
          message:
            "The reactor converts ordinary household items into Rainbow Treasures, a resource that can be used to instantly evolve a Smol Brain. Please select the items in your backpack that you would like to convert into Rainbow Treasures."
        };
      }
      if (moveTo === "USE_REACTOR") {
        return {
          ...ctx,
          state: "USE_REACTOR",
          message: "Got it!"
        };
      }
      if (moveTo === "REROLL") {
        return {
          ...ctx,
          state: "REROLL",
          message:
            "Select the items in your backpack that you would like to convert. The reactor will randomly re-roll the color and type of a degradable Treasure for a flat rate of 1 MAGIC."
        };
      }
      return ctx;
    }
  },
  LOADING_INVENTORY: {
    ...BASE_TRANSITIONS,
    PUT_BACK: (ctx, payload) => {
      const state = ctx.prevState;
      return {
        ...ctx,
        state,
        message:
          state === "REROLL"
            ? "Select the items in your backpack that you would like to convert. The reactor will randomly re-roll the color and type of a degradable Treasure for a flat rate of 1 MAGIC."
            : // this is fine because when we transition to USE_REACTOR, we will check if inventory is null and instantly transition to other states
              ctx.message,
        inventory: payload.inventory
      };
    },
    CONNECTION_ERROR: (ctx) => ({
      ...ctx,
      state: "ERROR",
      message: "Connection error. Please try again."
    })
  },
  NOT_CONNECTED: {
    ...BASE_TRANSITIONS,
    CONNECTED_TO_WALLET: (ctx) => ({
      ...ctx,
      state: "LOADING_INVENTORY",
      message: "Checking your backpack..."
    })
  },
  WHAT_IS_THIS: {
    ...BASE_TRANSITIONS
  },
  USE_REACTOR: {
    ...BASE_TRANSITIONS,
    MOVE_TO_RAINBOW_TREASURE_DIALOG: (ctx, { degradables }) => {
      const producableRainbowTreasures = lootToRainbowTreasure(degradables);
      return {
        ...ctx,
        state: "REACTOR__SELECT_OPTION",
        message:
          "The machine isn’t working very well today. You will need to provide me 15 degradable Treasures of the same kind or color to produce 1 Rainbow Treasure. Or you can try your luck with random items from your backpack.",
        producableRainbowTreasures: producableRainbowTreasures
      };
    },
    LOAD_INVENTORY: (ctx) => {
      return {
        ...ctx,
        state: "LOADING_INVENTORY",
        prevState: ctx.state,
        message: "Checking your backpack..."
      };
    }
  },
  REACTOR__MALFUNCTION: {
    ...BASE_TRANSITIONS,
    PRODUCING_DEGRADABLE: (ctx) => {
      return {
        ...ctx,
        state: "REACTOR__CONVERTING_SMOLVERSE_NFT_TO_DEGRADABLE",
        message: "Producing degradable..."
      };
    }
  },
  REACTOR__NO_SMOLVERSE_NFT: {
    ...BASE_TRANSITIONS
  },
  REACTOR__NO_DEGRADABLE: {
    ...BASE_TRANSITIONS,
    SELECTING_SMOLVERSE_NFT: (ctx) => {
      return {
        ...ctx,
        state: "REACTOR__SELECTING_SMOLVERSE_NFT",
        message: "Selecting Smolverse NFT..."
      };
    }
  },
  REACTOR__SELECTING_SMOLVERSE_NFT: {
    ...BASE_TRANSITIONS,
    SELECT_SMOLVERSE_NFT: (ctx, { tokens }) => {
      return {
        ...ctx,
        state: "REACTOR__SELECTED_SMOLVERSE_NFT",
        message: "Selected Smolverse NFT",
        selectedTokens: tokens
      };
    }
  },
  REACTOR__SELECTED_SMOLVERSE_NFT: {
    ...BASE_TRANSITIONS,
    MALFUNCTION: (ctx) => {
      return {
        ...ctx,
        state: "REACTOR__MALFUNCTION",
        message: "Malfunction"
      };
    }
  },
  REACTOR__CONVERTING_SMOLVERSE_NFT_TO_DEGRADABLE: {
    ...BASE_TRANSITIONS
  },
  RESULT: {
    ...BASE_TRANSITIONS
  },
  REACTOR__SELECT_OPTION: {
    ...BASE_TRANSITIONS,
    PRODUCE_RAINBOW_TREASURE_AUTOMATICALLY: (ctx) => {
      return {
        ...ctx,
        state: "REACTOR__SELECTED_DEGRADABLES",
        message: "Producing Rainbow Treasure..."
      };
    },
    TRY_LUCK: (ctx) => {
      return {
        ...ctx,
        state: "REACTOR__SELECTING_SMOLVERSE_NFT",
        message: "Selecting Smolverse NFT..."
      };
    },
    SELECT_DEGRADABLES_TO_CONVERT_TO_RAINBOW_TREASURE: (ctx) => {
      return {
        ...ctx,
        state: "REACTOR__SELECTING_DEGRADABLE",
        message: "Selecting Degradables..."
      };
    }
  },
  REACTOR__SELECTING_DEGRADABLE: {},
  REACTOR__SELECTED_DEGRADABLES: {
    ...BASE_TRANSITIONS
  },
  REACTOR__PRODUCING_RAINBOW_TREASURE: {},
  REACTOR__PRODUCED_RAINBOW_TREASURE: {
    ...BASE_TRANSITIONS
  },
  REROLL: {
    ...BASE_TRANSITIONS
  },
  SELECTING_RAINBOW_TREASURE_TO_REROLL: {
    ...BASE_TRANSITIONS
  },
  REROLL__REROLLING: {
    ...BASE_TRANSITIONS
  },
  REROLL__REROLLED: {
    ...BASE_TRANSITIONS
  },
  ERROR: {
    ...BASE_TRANSITIONS
  }
};

const reducer = (state: State, action: Action) =>
  transition(state, action, transitions);

const useReactorReducer = () => {
  const [state, dispatch] = useReducer(reducer, {
    state: "IDLE",
    message: "Welcome to the rainbow factory. How can I help you today?",
    inventory: null
  });

  const contractAddresses = useContractAddresses();

  // crafting rainbow treasures
  const producableRainbowTreasures = matchProp(
    state,
    "producableRainbowTreasures"
  )?.producableRainbowTreasures;

  const { config: craftRainbowTreasuresConfig } = usePrepareContractWrite({
    address: contractAddresses["DEGRADABLES"],
    abi: ABIS.DEGRADABLES,
    functionName: "craftRainbowTreasures",
    args: [producableRainbowTreasures ?? []]
  });

  const craftRainbowTreasures = useContractWrite(craftRainbowTreasuresConfig);

  const craftRainbowTreasuresResult = useWaitForTransaction({
    hash: craftRainbowTreasures.data?.hash
  });

  useEffect(() => {
    if (
      craftRainbowTreasuresResult.status === "success" &&
      craftRainbowTreasuresResult.data
    ) {
      const data = craftRainbowTreasuresResult.data as TransactionReceipt;

      const result = data.logs
        .filter(
          ({ address }) =>
            address === contractAddresses["SMOL_TREASURES"].toLowerCase()
        )
        .map(({ data, topics }) =>
          decodeEventLog({
            strict: false,
            abi: ABIS.SMOL_TREASURES,
            eventName: "TransferSingle",
            data,
            topics
          })
        )
        .find(({ eventName }) => eventName === "TransferSingle")?.args;

      // reset internal state
      craftRainbowTreasures.reset();
      dispatch({ type: "DISPLAY_NFTS" });
    }
  }, [
    craftRainbowTreasuresResult.status,
    craftRainbowTreasuresResult.data,
    craftRainbowTreasures.reset
  ]);

  useEnter(state, "REACTOR__PRODUCING_RAINBOW_TREASURE", () => {
    craftRainbowTreasures.write?.();
  });

  // smolverse nft to degradable

  const produceDegradable = matchProp(state, "selectedTokens")?.selectedTokens;

  const { config: produceDegradableConfig } = usePrepareContractWrite({
    address: contractAddresses["DEGRADABLES"],
    abi: ABIS.DEGRADABLES,
    functionName: "convertToLoot",
    args: [
      produceDegradable ? normalizeSmolverseNft(produceDegradable) : template
    ]
  });

  const craftDegradable = useContractWrite(produceDegradableConfig);

  const craftDegradableResult = useWaitForTransaction({
    hash: craftDegradable.data?.hash
  });

  useEffect(() => {
    if (
      craftDegradableResult.status === "success" &&
      craftDegradableResult.data
    ) {
      const data = craftDegradableResult.data as TransactionReceipt;

      const result = data.logs
        .filter(
          ({ address }) =>
            address === contractAddresses["SMOL_TREASURES"].toLowerCase() ||
            address === contractAddresses["DEGRADABLES"].toLowerCase()
        )
        .map(({ address, data, topics }) => {
          // if its an ancient relic, we mint rainbow treasures instead so listening
          if (address === contractAddresses["SMOL_TREASURES"].toLowerCase()) {
            return decodeEventLog({
              strict: false,
              abi: ABIS.SMOL_TREASURES,
              eventName: "TransferSingle",
              data,
              topics
            });
          } else {
            return decodeEventLog({
              strict: false,
              abi: ABIS.DEGRADABLES,
              eventName: "LootTokenMinted",
              data,
              topics
            });
          }
        })
        .filter(
          ({ eventName }) =>
            eventName === "TransferSingle" || eventName === "LootTokenMinted"
        );

      const rainbowTreasuresMinted = result.find(
        (data) =>
          data.eventName === "TransferSingle" && isBurnAddress(data.args.from)
      )?.args;

      const degradablesMinted = result.filter(
        (data) => data.eventName === "LootTokenMinted"
      );

      console.log({ rainbowTreasuresMinted, degradablesMinted });

      // reset internal state
      craftDegradable.reset();
      dispatch({ type: "DISPLAY_NFTS" });

      // .find(({ eventName }) => eventName === "TransferSingle")?.args;
    }
  }, [
    craftDegradableResult.status,
    craftDegradableResult.data,
    craftDegradable.reset,
    dispatch
  ]);

  useEnter(state, "REACTOR__MALFUNCTION", () => {
    setTimeout(() => {
      craftDegradable.write?.();
    }, 1000);
  });

  const { isConnected, address } = useAccount();
  const connected = isConnected && address !== undefined;

  const fetcher = useFetcher<typeof loader>();

  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    if (connected || state.state === "IDLE" || state.state === "NOT_CONNECTED")
      return;

    dispatch({
      type: "DISCONNECTED_FROM_WALLET",
      prevState: state.state.includes("REACTOR")
        ? "USE_REACTOR"
        : state.state.includes("REROLL")
        ? "REROLL"
        : "IDLE"
    });
  }, [connected, dispatch, state.state]);

  useEnter(
    state,
    "NOT_CONNECTED",
    (ctx) => {
      fetcher.submit({}, { action: "/reset-fetcher", method: "post" });
      if (connected) {
        dispatch({ type: "CONNECTED_TO_WALLET", prevState: ctx.prevState });
      }
    },
    [connected]
  );

  useEnter(
    state,
    "LOADING_INVENTORY",
    (ctx) => {
      if (!connected) return;

      fetcherRef.current.load(`/get-inventory/${address}`);

      if (fetcher.state === "idle" && fetcher.data) {
        if (!fetcher.data.ok) {
          dispatch({ type: "CONNECTION_ERROR" });
          return;
        }

        dispatch({
          type: "PUT_BACK",
          state: ctx.prevState,
          inventory: fetcher.data.data
        });
      }
    },
    [fetcher.state]
  );

  useEnter(
    state,
    ["USE_REACTOR", "REROLL"],
    (ctx) => {
      if (!connected) return;

      if (!ctx.inventory && address) {
        dispatch({ type: "LOAD_INVENTORY" });
        return;
      }
      if (ctx.inventory) {
        if (ctx.inventory["degradables"]) {
          dispatch({
            type: "MOVE_TO_RAINBOW_TREASURE_DIALOG",
            degradables: ctx.inventory["degradables"]
          });
          return;
        }

        // if object is empty
        if (Object.keys(ctx.inventory).length === 0) {
          dispatch({ type: "MISSING", category: "smolverse-nft" });
          return;
        }

        // if degradables is missing
        if (!ctx.inventory["degradables"]) {
          dispatch({ type: "MISSING", category: "degradables" });
          return;
        }
      }
    },
    [connected, address]
  );

  return { state, dispatch };
};

export const ReactorProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { state, dispatch } = useReactorReducer();

  return (
    <ReactorContext.Provider value={{ state, dispatch }}>
      {children}
    </ReactorContext.Provider>
  );
};
