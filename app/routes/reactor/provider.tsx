import { useFetcher } from "@remix-run/react";
import {
  useReducer,
  createContext,
  useContext,
  useEffect,
  useRef
} from "react";
import { TTransition, TTransitions, transition, useEnter } from "react-states";
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
} & (
  | {
      // Scientist welcomes you
      state: "IDLE";
    }
  | {
      state: "NOT_CONNECTED";
    }
  | {
      // What is this?
      state: "WHAT_IS_THIS";
    }
  | {
      state: "USE_REACTOR";
    }
  | {
      state: "NO_SMOLVERSE_NFT";
    }
  | {
      state: "NO_SMOL_LOOT";
    }
  | {
      state: "SELECTING_SMOLVERSE_NFT";
    }
  | {
      state: "SELECTED_SMOLVERSE_NFT";
    }
  | {
      state: "CONVERTING_SMOLVERSE_NFT_TO_SMOL_LOOT";
    }
  | {
      state: "CONVERTED_SMOLVERSE_NFT_TO_SMOL_LOOT";
    }
  | {
      state: "MALFUNCTION";
    }
  | {
      state: "SELECTED_SMOL_LOOT";
      producableRainbowTreasures: number;
    }
  | {
      state: "PRODUCING_RAINBOW_TREASURE";
    }
  | {
      state: "PRODUCED_RAINBOW_TREASURE";
    }
  | {
      state: "REROLL";
    }
  | {
      state: "REROLLING";
    }
  | {
      state: "REROLLED";
    }
  | {
      state: "ERROR";
    }
);

type Action =
  | {
      type: "CONNECTED_TO_WALLET";
    }
  | {
      type: "DISCONNECTED_FROM_WALLET";
    }
  | {
      type: "KEEP_TRYING";
    }
  | {
      type: "CONNECTION_ERROR";
    }
  | {
      type: "SELECT_OPTION";
    }
  | {
      type: "MISSING";
      category: "smol-loot" | "smolverse-nft";
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
    }
  | {
      type: "PRODUCE_RAINBOW_TREASURE";
    }
  | {
      type: "CONFIRM_REROLL";
    };

const BASE_TRANSITIONS: TTransition<State, Action> = {
  CONNECTED_TO_WALLET: (ctx) => ({
    ...ctx,
    state: "IDLE",
    message: "Welcome to the rainbow factory. How can I help you today?"
  }),
  DISCONNECTED_FROM_WALLET: (ctx) => ({
    ...ctx,
    state: "NOT_CONNECTED",
    message: "Open up your backpack. Let’s see what we’re working with here."
  }),
  MISSING: (ctx, { category }) => {
    if (category === "smolverse-nft") {
      return {
        ...ctx,
        state: "NO_SMOLVERSE_NFT",
        message:
          "Hmm, it looks like your backpack is empty. Please come back later once you’ve gotten your act together."
      };
    }
    if (category === "smol-loot") {
      return {
        ...ctx,
        state: "NO_SMOL_LOOT",
        message:
          "Hmm, it looks like you don’t have the right ingredients in your backpack. You can try inputting random items, but there is no guarantee that a Rainbow Treasure will be produced. Do you wish to proceed?"
      };
    }
    return ctx;
  }
};

const transitions: TTransitions<State, Action> = {
  IDLE: {
    ...BASE_TRANSITIONS
  },
  NOT_CONNECTED: {
    ...BASE_TRANSITIONS
  },
  WHAT_IS_THIS: {
    ...BASE_TRANSITIONS
  },
  USE_REACTOR: {
    ...BASE_TRANSITIONS,
    KEEP_TRYING: (ctx) => ctx,
    CONNECTION_ERROR: (ctx) => ({
      ...ctx,
      state: "ERROR",
      message: "Connection error. Please try again."
    })
  },
  MALFUNCTION: {
    ...BASE_TRANSITIONS
  },
  NO_SMOLVERSE_NFT: {
    ...BASE_TRANSITIONS
  },
  NO_SMOL_LOOT: {
    ...BASE_TRANSITIONS
  },
  SELECTING_SMOLVERSE_NFT: {
    ...BASE_TRANSITIONS
  },
  SELECTED_SMOLVERSE_NFT: {
    ...BASE_TRANSITIONS
  },
  CONVERTING_SMOLVERSE_NFT_TO_SMOL_LOOT: {
    ...BASE_TRANSITIONS
  },
  CONVERTED_SMOLVERSE_NFT_TO_SMOL_LOOT: {
    ...BASE_TRANSITIONS
  },
  SELECTED_SMOL_LOOT: {
    ...BASE_TRANSITIONS
  },
  PRODUCING_RAINBOW_TREASURE: {
    ...BASE_TRANSITIONS
  },
  PRODUCED_RAINBOW_TREASURE: {
    ...BASE_TRANSITIONS
  },
  REROLL: {
    ...BASE_TRANSITIONS
  },
  REROLLING: {
    ...BASE_TRANSITIONS
  },
  REROLLED: {
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
    message: "Welcome to the rainbow factory. How can I help you today?"
  });

  const { isConnected, address } = useAccount();

  const connected = isConnected && address !== undefined;

  const fetcher = useFetcher<typeof loader>();

  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    if (!address) return;
    fetcherRef.current.load(`/get-inventory/${address}`);
  }, [address]);

  useEffect(() => {
    if (connected) {
      dispatch({ type: "CONNECTED_TO_WALLET" });
    } else {
      dispatch({ type: "DISCONNECTED_FROM_WALLET" });
    }
  }, [connected, dispatch]);

  useEnter(state, "USE_REACTOR", () => {
    const fetcher = fetcherRef.current;
    if (fetcher.state === "loading") {
      const id = setInterval(() => {
        dispatch({ type: "KEEP_TRYING" });
      }, 1000);

      return () => clearInterval(id);
    }

    // got data here
    if (fetcher.data && fetcher.state === "idle") {
      if (!fetcher.data.ok) {
        dispatch({ type: "CONNECTION_ERROR" });
        return;
      }
      const { data } = fetcher.data;

      // if smol-loot exists
      if (data["smol-loot"]) {
        dispatch({ type: "MOVE_TO_RAINBOW_TREASURE_DIALOG" });
        return;
      }

      // if object is empty
      if (Object.keys(data).length === 0) {
        dispatch({ type: "MISSING", category: "smolverse-nft" });
        return;
      }

      // if smol-loot is missing
      if (!data["smol-loot"]) {
        dispatch({ type: "MISSING", category: "smol-loot" });
        return;
      }
    }
  });

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
