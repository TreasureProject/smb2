import { useReducer } from "react";
import {
  TTransition,
  TTransitions,
  transition,
  useDevtools,
  useEnter
} from "react-states";

export const options = {
  WHAT_IS_SMOL_BRAIN: "What is a Smol Brain?",
  WHERE_TO_BUY_SMOL_BRAIN: "Where can I buy a Smol Brain?",
  WHERE_IS_SMOLVILLE_GAME: "Where is the Smolville game?",
  WHY_IS_MY_SMOL_LESS_RARE: "Why is my Smol less rare than it was before?",
  SUBMIT_FUD: "I would like to submit FUD.",
  OTHER: "Something else."
};

export const fudOptions = {
  PRICE_LOW:
    "The price has gone down since I bought it, which makes me unhappy.",
  GAME_NOT_HERE: "The game is not here yet.",
  OWN_FUD: "Make my own FUD"
};

export function newMessage(
  message: string,
  by: "user" | "bot",
  options?: {
    [key: string]: string;
  },
  type?: "initial" | "fud" | "request"
) {
  return {
    message,
    by,
    timestamp: new Date().toISOString(),
    options: options ?? null,
    type: type ?? "initial"
  };
}

export type Message = ReturnType<typeof newMessage>;

type State = {
  messages: Message[];
} & (
  | {
      state: "INITIAL";
    }
  | {
      state: "WELCOME";
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
    }
  | {
      state: "FUD_SUBMITTING";
    }
  | {
      state: "FUD_SUBMITTED";
    }
  | {
      state: "OTHER_ISSUES";
      commentCount: number;
    }
  | {
      state: "TRANSFER_REQUEST";
      numberOfPeopleAhead?: number;
      estimatedWaitTime?: number;
    }
);

type Action =
  | {
      type: "GREET";
    }
  | {
      type: "SELECT_INITIAL_OPTION";
      option: (typeof options)[keyof typeof options];
    }
  | {
      type: "SELECT_FUD_OPTION";
      option: (typeof fudOptions)[keyof typeof fudOptions];
    }
  | {
      type: "RETURN_TO_OPTIONS";
    }
  | {
      type: "SUBMIT_FUD";
    }
  | {
      type: "INSERT_COMMENT";
      message: string;
    }
  | {
      type: "RESET";
    };

const SELECT_OPTION_TRANSITION: TTransition<State, Action> = {
  SELECT_INITIAL_OPTION: (ctx, { option }) => {
    switch (option) {
      case options.WHAT_IS_SMOL_BRAIN:
        return {
          ...ctx,
          state: "SMOL_BRAIN_INFO",
          messages: [
            ...ctx.messages,
            newMessage(options.WHAT_IS_SMOL_BRAIN, "user"),
            newMessage(
              "Smol Brains are a species of monkey resembling a chimpanzee. In 2021, a team of artists in Brazil and the United States launched a profile picture collection featuring the Smol Brains and distributed it for free to the public. It became an unexpected success, allowing the team to continue growing and develop a video game based on the lives of the Smols. The Smolville game, upcoming in 2024, will be the first of hopefully many titles based around Smols.",
              "bot",
              options
            )
          ]
        };
      case options.WHERE_TO_BUY_SMOL_BRAIN:
        return {
          ...ctx,
          state: "BUYING_SMOL_BRAIN",
          messages: [
            ...ctx.messages,
            newMessage(options.WHERE_TO_BUY_SMOL_BRAIN, "user"),
            newMessage(
              "Smol Brains are monkeys and should not be owned as property. Please do not buy or sell Smols. However, you can collect images of their likeness on the Treasure marketplace.",
              "bot",
              options
            )
          ]
        };
      case options.WHERE_IS_SMOLVILLE_GAME:
        return {
          ...ctx,
          state: "SMOLVILLE_GAME_INFO",
          messages: [
            ...ctx.messages,
            newMessage(options.WHERE_IS_SMOLVILLE_GAME, "user"),
            newMessage(
              "The Smolville game is currently under development. Please click here to watch gameplay footage.",
              "bot",
              options
            )
          ]
        };
      case options.WHY_IS_MY_SMOL_LESS_RARE:
        return {
          ...ctx,
          state: "NFT_RARITY_EXPLANATION",
          messages: [
            ...ctx.messages,
            newMessage(options.WHY_IS_MY_SMOL_LESS_RARE, "user"),
            newMessage(
              "If you are referring to the Smol Brains profile picture collection, then the rarity of your NFT has likely changed because another user has evolved their Smol’s appearance. Rarity is a term used in NFT communities to describe the uniqueness of an NFT’s particular traits relative to the collection at large. Smol Brains were the first dynamic profile picture, putting forward the idea of perpetual user-driven updates to their artwork to create a forever-evolving collection. If your NFT has become less rare, it means that someone else has upgraded their Smol into a rarer version. But fear not. Every time a Smol Brain is updated, the other Smols are credited in a resource called Rainbow Treasures for their proportional loss in rarity. Rainbow Treasures allow a user to update their Smol, enabling every user to either participate in the on-going collection evolution or trade their Treasures to another user looking to change their Smol.",
              "bot",
              options
            )
          ]
        };
      case options.SUBMIT_FUD:
        return {
          ...ctx,
          state: "FUD_SUBMISSION",
          messages: [
            ...ctx.messages,
            newMessage(options.SUBMIT_FUD, "user"),
            newMessage(
              "OK, great. I understand that you would like to create FUD regarding the Smol Brains project. If you’d like, I could go ahead and pre-draft some FUD for you. Click on one of these options to have a pre-drafted complaint submitted to the team, or choose “Make My Own” to write your own.",
              "bot",
              fudOptions,
              "fud"
            )
          ]
        };
      case options.OTHER:
        return {
          ...ctx,
          state: "OTHER_ISSUES",
          commentCount: 0,
          messages: [
            ...ctx.messages,
            newMessage(options.OTHER, "user"),
            newMessage("OK, what can I help you with?", "bot")
          ]
        };
      default: {
        return ctx;
      }
    }
  }
};
const BASE_TRANSITIONS: TTransition<State, Action> = {
  RETURN_TO_OPTIONS: (ctx) => ({ ...ctx, state: "WELCOME" }),
  RESET: () => ({ state: "INITIAL", messages: [] }),
  ...SELECT_OPTION_TRANSITION
};

const transitions: TTransitions<State, Action> = {
  INITIAL: {
    GREET: (ctx) => ({
      ...ctx,
      state: "WELCOME",
      messages: [
        newMessage(
          "Hello! I am your customer service representative. What can I assist you with today?",
          "bot",
          options
        )
      ]
    })
  },
  WELCOME: {
    ...SELECT_OPTION_TRANSITION
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
    RESET: () => ({ state: "INITIAL", messages: [] }),
    SELECT_FUD_OPTION: (ctx, { option }) => {
      switch (option) {
        case fudOptions.GAME_NOT_HERE:
        case fudOptions.PRICE_LOW:
          return {
            ...ctx,
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                "Great. I have now sent along your FUD to the Smolverse Care Team. They will be sure to share it with the team later today and make appropriate changes to the project to best serve your needs. Thank you for being here! Is there something else I can help you with today?",
                "bot",
                options
              )
            ]
          };
        case fudOptions.OWN_FUD:
          return {
            ...ctx,
            state: "FUD_SUBMITTING",
            messages: [
              ...ctx.messages,
              newMessage(
                "OK, please write your FUD below. I will send it along to the Smolverse Care Team.",
                "bot"
              )
            ]
          };
        default: {
          return ctx;
        }
      }
    },
    ...SELECT_OPTION_TRANSITION
  },
  FUD_SUBMITTING: {
    INSERT_COMMENT: (ctx, { message }) => {
      return {
        ...ctx,
        state: "FUD_SUBMITTED",
        messages: [
          ...ctx.messages,
          newMessage(message, "user"),
          newMessage(
            "Great. I have now received your FUD and submitted it to the Smolverse Care Team. They will analyze your complaint and provide the team with written feedback on the exact changes to make to best serve your needs. Thank you for being here! Is there something else I can help you with today?",
            "bot",
            options
          )
        ]
      };
    }
  },
  FUD_SUBMITTED: {
    ...BASE_TRANSITIONS
  },
  OTHER_ISSUES: {
    INSERT_COMMENT: (ctx, { message }) => {
      const commentCount = ctx.commentCount + 1;

      const comment =
        commentCount === 1
          ? "I’m sorry. It seems that I am not understanding you. Can you please re-explain?"
          : "I think I understand. Are you saying that you would like me to transfer you to another customer service representative?";

      if (commentCount === 3) {
        return {
          ...ctx,
          messages: [
            ...ctx.messages,
            newMessage(message, "user"),
            newMessage(
              "OK, great. I understand that you would like to speak to another custom service agent. I will transfer you to them now. You can also call 1913151222518195 to speak to someone that way. Have a great day!",
              "bot",
              undefined,
              "request"
            )
          ],
          state: "TRANSFER_REQUEST"
        };
      }

      return {
        ...ctx,
        messages: [
          ...ctx.messages,
          newMessage(message, "user"),
          newMessage(comment, "bot")
        ],
        commentCount: ctx.commentCount + 1
      };
    },
    RESET: () => ({ state: "INITIAL", messages: [] })
  },
  TRANSFER_REQUEST: {
    RESET: () => ({ state: "INITIAL", messages: [] })
  }
};

const reducer = (state: State, action: Action) =>
  transition(state, action, transitions);

export const useChat = (initialState?: State) => {
  const chatReducer = useReducer(
    reducer,
    initialState || {
      state: "INITIAL",
      messages: []
    }
  );

  return chatReducer;
};
