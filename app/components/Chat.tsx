import { TTransition, TTransitions, transition } from "react-states";

// What is a Smol Brain?
// Where can I buy a Smol Brain?
// Where is the Smolville game?
// Why is my Smol less rare than it was before?
// I would like to submit FUD.
// Something else.

// convert the above to an object with an enum for the keys
const options = {
  WHAT_IS_SMOL_BRAIN: "What is a Smol Brain?",
  WHERE_TO_BUY_SMOL_BRAIN: "Where can I buy a Smol Brain?",
  WHERE_IS_SMOLVILLE_GAME: "Where is the Smolville game?",
  WHY_IS_MY_SMOL_LESS_RARE: "Why is my Smol less rare than it was before?",
  SUBMIT_FUD: "I would like to submit FUD.",
  OTHER: "Something else."
};

type State =
  | {
      state: "INITIAL";
    }
  | {
      state: "OPTIONS";
    }
  | {
      state: "SMOL_BRAIN_INFO";
    }
  | {
      state: "BUYING_SMOL_BRAIN";
    }
  | {
      state: "SMOLVILLE_GAME_INFO";
    }
  | {
      state: "NFT_RARITY_EXPLANATION";
    }
  | {
      state: "FUD_SUBMISSION";
      fudType?: "PRE_DRAFTED" | "CUSTOM";
    }
  | {
      state: "OTHER_ISSUES";
    }
  | {
      state: "TRANSFER_REQUEST";
      numberOfPeopleAhead?: number;
      estimatedWaitTime?: number; // in days
    }
  | {
      state: "QUEUE_INFORMATION";
      queuePosition: number;
      waitTime: number; // in days
    };

type Action =
  | {
      type: "SELECT_OPTION";
      option: keyof typeof options;
    }
  | {
      type: "RETURN_TO_OPTIONS";
    }
  | {
      type: "SUBMIT_FUD";
      fudType: "PRE_DRAFTED" | "CUSTOM";
    };

const BASE_TRANSITIONS: TTransition<State, Action> = {
  RETURN_TO_OPTIONS: (ctx) => ({ ...ctx, state: "OPTIONS" })
};

const transitions: TTransitions<State, Action> = {
  INITIAL: {
    SELECT_OPTION: (ctx, { option }) => {
      switch (option) {
        case "WHAT_IS_SMOL_BRAIN":
          return { ...ctx, state: "SMOL_BRAIN_INFO" };
        case "WHERE_TO_BUY_SMOL_BRAIN":
          return { ...ctx, state: "BUYING_SMOL_BRAIN" };
        case "WHERE_IS_SMOLVILLE_GAME":
          return { ...ctx, state: "SMOLVILLE_GAME_INFO" };
        case "WHY_IS_MY_SMOL_LESS_RARE":
          return { ...ctx, state: "NFT_RARITY_EXPLANATION" };
        case "SUBMIT_FUD":
          return { ...ctx, state: "FUD_SUBMISSION" };
        case "OTHER":
          return { ...ctx, state: "OTHER_ISSUES" };
      }
    }
  },
  SMOL_BRAIN_INFO: {
    ...BASE_TRANSITIONS
  },
  BUYING_SMOL_BRAIN: {
    ...BASE_TRANSITIONS
  },
  SMOLVILLE_GAME_INFO: {
    ...BASE_TRANSITIONS
  },
  NFT_RARITY_EXPLANATION: {
    ...BASE_TRANSITIONS
  },
  FUD_SUBMISSION: {
    SUBMIT_FUD: (ctx, { fudType }) => {
      return { ...ctx, fudType };
    }
  },
  OTHER_ISSUES: {}
};

const reducer = (state: State, action: Action) =>
  transition(state, action, transitions);
