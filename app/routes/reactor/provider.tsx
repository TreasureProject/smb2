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
  transition,
  useEnter
} from "react-states";
import { useAccount } from "wagmi";
import {
  TCollectionsToFetch,
  TroveToken,
  fetchTroveTokensForUser
} from "~/api.server";
import { loader } from "../get-inventory.$address";

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

type State = {
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
      state: "REACTOR__NO_SMOL_LOOT";
    }
  | {
      state: "REACTOR__SELECTING_SMOLVERSE_NFT";
    }
  | {
      state: "REACTOR__SELECTED_SMOLVERSE_NFT";
      selectedTokens: string[];
    }
  | {
      state: "REACTOR__CONVERTING_SMOLVERSE_NFT_TO_SMOL_LOOT";
    }
  | {
      state: "REACTOR__CONVERTED_SMOLVERSE_NFT_TO_SMOL_LOOT";
    }
  | {
      state: "REACTOR__MALFUNCTION";
    }
  | {
      state: "REACTOR__CONFIRM_PRODUCING_RAINBOW_TREASURES";
      producableRainbowTreasures: number;
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
      token: TroveToken;
      category: TCollectionsToFetch;
    }
  | {
      type: "TRY_LUCK";
    }
  | {
      type: "MOVE_TO_RAINBOW_TREASURE_DIALOG";
      degradables: Inventory["degradables"];
    }
  | {
      type: "PRODUCE_RAINBOW_TREASURE";
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
        state: "REACTOR__NO_SMOL_LOOT",
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
      return {
        ...ctx,
        state: "REACTOR__CONFIRM_PRODUCING_RAINBOW_TREASURES",
        message:
          "The machine isn’t working very well today. You will need to provide me 15 degradable Treasures of the same kind or color to produce 1 Rainbow Treasure. Or you can try your luck with random items from your backpack.",
        producableRainbowTreasures: 1
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
    ...BASE_TRANSITIONS
  },
  REACTOR__NO_SMOLVERSE_NFT: {
    ...BASE_TRANSITIONS
  },
  REACTOR__NO_SMOL_LOOT: {
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
    SELECT_SMOLVERSE_NFT: (ctx, { token, category }) => {
      return {
        ...ctx,
        state: "REACTOR__SELECTED_SMOLVERSE_NFT",
        message: "Selected Smolverse NFT",
        selectedTokens: Array.from({ length: 10 }).map((_, i) => i.toString())
      };
    }
  },
  REACTOR__SELECTED_SMOLVERSE_NFT: {
    ...BASE_TRANSITIONS
  },
  REACTOR__CONVERTING_SMOLVERSE_NFT_TO_SMOL_LOOT: {
    ...BASE_TRANSITIONS
  },
  REACTOR__CONVERTED_SMOLVERSE_NFT_TO_SMOL_LOOT: {
    ...BASE_TRANSITIONS
  },
  REACTOR__CONFIRM_PRODUCING_RAINBOW_TREASURES: {
    ...BASE_TRANSITIONS,
    PRODUCE_RAINBOW_TREASURE: (ctx) => {
      return {
        ...ctx,
        state: "REACTOR__PRODUCING_RAINBOW_TREASURE",
        message: "Producing Rainbow Treasure..."
      };
    },
    TRY_LUCK: (ctx) => {
      return {
        ...ctx,
        state: "REACTOR__SELECTING_SMOLVERSE_NFT",
        message: "Selecting Smolverse NFT..."
      };
    }
  },
  REACTOR__PRODUCING_RAINBOW_TREASURE: {
    ...BASE_TRANSITIONS
  },
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
