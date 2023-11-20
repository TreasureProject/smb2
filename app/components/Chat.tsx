import { animate } from "framer-motion";
import React from "react";
import { useEffect, useReducer } from "react";
import {
  TTransition,
  TTransitions,
  transition,
  useDevtools,
  useEnter
} from "react-states";
import { useSocket } from "~/contexts/socket";

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const options = {
  HELP_BANANA_PHONE: "I need help with my banana phone.",
  GO_SHOPPING: "Go shopping.",
  SOCIAL_CALENDAR: "Social calendar.",
  DL_SMOLVILLE_GAME: "I need help downloading the Smolville Game.",
  SUBMIT_FUD: "I would like to submit a complaint.",
  WHY_AM_I_SPECIAL: "Why am I special?",
  OTHER: "Something else.",
  POKE: "Poke"
};

const fudOptions = {
  PRICE_LOW: "I bought an NFT that has gone down in price.",
  GAME_NOT_HERE: "The game is not here yet.",
  OWN_FUD: "Make my own FUD"
};

const helpOptions1 = {
  YES: "Yes",
  NO: "No"
};

const carrierOption = {
  YES: "Yes",
  NO_WARRANTY:
    "I bought my banana phone on the black market and do not have a warranty."
};

const vitaminPurchaseOptions = {
  ONE_TIME: "One-time purchase",
  MONTHLY_SUBSCRIPTION: "Monthly subscription"
};

const helpOptions2 = {
  KEYS_STICKY: "Keys are sticky",
  SERVICE_DISCONNECTED: "My service has been disconnected",
  DOWNLOAD_GAME: "I need help downloading the Smolville Game",
  ORDER_VITAMINS: "Order more Rainbow Treasure vitamins",
  WHERE_APP: "Where did my Smol World app go?"
};

const RequestMessage = () => {
  return (
    <div className="flex flex-col space-y-1.5">
      <span>
        There are{" "}
        <span className="font-bold">{Math.floor(Math.random() * 100000)}</span>{" "}
        people ahead of you.
      </span>
      <span>
        Estimated wait time:{" "}
        <span className="font-bold">
          {Math.floor(Math.random() * 5000)} days
        </span>
      </span>
    </div>
  );
};

const BusMessage = () => {
  const [randomSeconds, setRandomSeconds] = React.useState(
    () => Math.floor(Math.random() * 5000) + 100
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setRandomSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [randomSeconds]);

  return (
    <span>
      There will be one arriving in{" "}
      <span className="font-bold">{randomSeconds} seconds</span>
    </span>
  );
};

const LateBalanceMessage = () => {
  const [randomFee, setRandomFee] = React.useState(
    // random number between 1 million and 3 million
    () => Math.floor(Math.random() * 2000000) + 1000000
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setRandomFee((seconds) => seconds + 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [randomFee]);

  return (
    <span>
      You currently have an overdue balance of{" "}
      <span className="font-bold">
        {/* format randomFee, without dollar and trailing 0 */}
        {randomFee
          .toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
          })
          .slice(1, -3)}{" "}
        MAGIC
      </span>
    </span>
  );
};

export function newMessage(
  message: string,
  by: "user" | "bot",
  options?: {
    [key: string]: string;
  },
  type?: "initial" | "other",
  custom?: React.ReactNode
) {
  return {
    message,
    by,
    timestamp: new Date().toISOString(),
    options: options ?? null,
    type: type ?? "other",
    custom: custom ?? null
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
      state: "HELP_BANANA_PHONE";
    }
  | {
      state: "BANANA.KEYS_STICKY";
    }
  | {
      state: "BANANA.KEYS_STICKY_NO";
    }
  | {
      state: "BANANA.ORDER_VITAMINS";
    }
  | {
      state: "BANANA.ORDER_VITAMINS_PROCEED";
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
      state: "POKE_REQUEST";
    }
  | {
      state: "POKED";
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
      type: "OTHER_OPTION";
      option: string;
    }
  | {
      type: "VITAMINS_ORDER_ERROR";
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
      type: "POKE";
      targetLocation: string;
    }
  | {
      type: "RESET";
    };

const SELECT_OPTION_TRANSITION: TTransition<State, Action> = {
  SELECT_INITIAL_OPTION: (ctx, { option }) => {
    switch (option) {
      case options.HELP_BANANA_PHONE:
        return {
          ...ctx,
          state: "HELP_BANANA_PHONE",
          messages: [
            ...ctx.messages,
            newMessage(options.HELP_BANANA_PHONE, "user"),
            newMessage(
              "I’m sorry to hear that. Could you please explain more about the specific problem you’re having?",
              "bot",
              helpOptions2
            )
          ]
        };
      case options.GO_SHOPPING:
        return {
          ...ctx,
          messages: [
            ...ctx.messages,
            newMessage(options.GO_SHOPPING, "user"),
            newMessage(
              "Great! We have recently added the shop as its own dedicated app that comes pre-installed with your banana phone. Check the home screen for the “Fashion” app.\n\nIs there something else I can help you with?",
              "bot",
              options,
              "initial"
            )
          ]
        };
      case options.DL_SMOLVILLE_GAME:
        return {
          ...ctx,
          messages: [
            ...ctx.messages,
            newMessage(options.DL_SMOLVILLE_GAME, "user"),
            newMessage(
              "That’s odd. It looks like you have already installed the free-to-play Smolville Game on your home screen. Your Internet connection must have been interrupted during download. Please click on the app to restart your installation.",
              "bot",
              options,
              "initial"
            )
          ]
        };
      case options.SOCIAL_CALENDAR:
        return {
          ...ctx,
          messages: [
            ...ctx.messages,
            newMessage(options.SOCIAL_CALENDAR, "user"),
            newMessage(
              "Hmm. It looks like there are no upcoming IRL events scheduled. Smol Brains have held parties in New York, Singapore, and other places, but I’m not seeing any events in the near future.\n\nCheck back later. If you’d like to have your event added to the Smol Brains social calendar, please contact Smol Preeminent on Twitter or join our Discord to speak to a member of our staff.\n\n Is there something else I can help you with?",
              "bot",
              options,
              "initial"
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
              "I’m sorry to hear that. I will be happy to help you fill out a complaint for the Smolverse Care Team. If you’d like, I could go ahead and pre-draft some FUD for you. Click on one of these options to have a pre-drafted complaint, or choose “Make My Own FUD” to write your own.",
              "bot",
              fudOptions
            )
          ]
        };
      case options.WHY_AM_I_SPECIAL:
        return {
          ...ctx,
          messages: [
            ...ctx.messages,
            newMessage(options.WHY_AM_I_SPECIAL, "user"),
            newMessage(
              "Smol Brains are some of the most special organisms in the universe. They were the first known species to transform from Internet jpegs into living beings with their own civilization. Over time, the Smolverse expanded to include an entire genus of monkeys — Smol Brains, Smol Bodies, and Smol Jrs. The technological wizardry that brought you to life was the first of its kind in many ways. Smol Brain DNA consists of physical traits that can be overwritten and evolved without requiring the need for a new body. Smols can hyper-evolve and devolve in a way no other lifeform can. This aspect of the Smol Brain – as well as other biological components – make you as a Smol unique from everything else in the living or digital world. You are special and loved. Is there something else I can help you with?",
              "bot",
              options,
              "initial"
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
      case options.POKE:
        return {
          ...ctx,
          state: "POKE_REQUEST",
          messages: [
            ...ctx.messages,
            newMessage(options.POKE, "user"),
            newMessage("Sure. Let me poke someone...", "bot")
          ]
        };
      default: {
        return ctx;
      }
    }
  }
};

const RESET_TRANSITION: TTransition<State, Action> = {
  RESET: () => ({ state: "INITIAL", messages: [] })
};

const BASE_TRANSITIONS: TTransition<State, Action> = {
  ...RESET_TRANSITION,
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
          options,
          "initial"
        )
      ]
    })
  },
  WELCOME: {
    ...SELECT_OPTION_TRANSITION
  },
  HELP_BANANA_PHONE: {
    OTHER_OPTION: (ctx, { option }) => {
      switch (option) {
        case helpOptions2.KEYS_STICKY:
          return {
            ...ctx,
            state: "BANANA.KEYS_STICKY",
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                "Sticky keys are usually caused by dirty paws. Begin by washing your paws. Next, lightly rub an alcohol wipe over the keys to remove any smudges or food crumbs. You should be able to use your banana phone keyboard now. Did this solve the problem?",
                "bot",
                helpOptions1
              )
            ]
          };
        case helpOptions2.SERVICE_DISCONNECTED:
          return {
            ...ctx,
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                "Ah yes, it looks like your service was disconnected due to a payment failure. I am unable to access your Smol Bank records, but I would suggest making sure that you have sufficient funds to cover your most recent bill.",
                "bot",
                options,
                "initial",
                <LateBalanceMessage />
              )
            ]
          };
        case helpOptions2.DOWNLOAD_GAME:
          return {
            ...ctx,
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                "That’s odd. It looks like you have already installed the free-to-play Smolville Game on your home screen. Please click on the app on the home screen to begin playing the game.",
                "bot",
                options,
                "initial"
              )
            ]
          };
        case helpOptions2.ORDER_VITAMINS:
          return {
            ...ctx,
            state: "BANANA.ORDER_VITAMINS",
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                "Happy to help! R.T. vitamins by Smol Bryan Supplements are used for achieving instant self-improvement for a Smol Brain without the need for exercise or healthy eating habits. It is currently a best seller on the Treasure marketplace. I have your account details from your last purchase. Would you like to make a one-time purchase or start a monthly subscription?",
                "bot",
                vitaminPurchaseOptions
              )
            ]
          };
        case helpOptions2.WHERE_APP:
          return {
            ...ctx,
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                `Smol World was recently removed in the latest banana phone OS update.\n\n
                Smol World – not to be confused with the free-to-play Smolville game – is a controversial TV experiment launched in 2024. The show features 24-7 coverage of Miniature Smols, which are smart-contract based replicas of Smol Brain consciousness. The experiment’s stated aim was to see whether the Miniature Smols could create their own civilization. Viewers are able to lightly guide them in their effort. The Smol Anthropological Society released a report highlighting several concerns with the program, including unhealthy voyeurism on the part of users, and existential risks to Smolverse if the subjects were to become self-aware.\n\n
                Re-downloading Smol World will require “jailbreaking” your device. Jailbreaking results in a void of your service warranty, and I will be unable to assist you if you perform this change to your banana phone.
                `,
                "bot",
                options,
                "initial"
              )
            ]
          };

        default: {
          return ctx;
        }
      }
    },
    ...BASE_TRANSITIONS
  },

  "BANANA.KEYS_STICKY": {
    OTHER_OPTION: (ctx, { option }) => {
      switch (option) {
        case helpOptions1.YES:
          return {
            ...ctx,
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                "Great! Is there something else I can help you with?",
                "bot",
                options,
                "initial"
              )
            ]
          };
        case helpOptions1.NO:
          return {
            ...ctx,
            state: "BANANA.KEYS_STICKY_NO",
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                "Hmm. I would recommend taking your banana phone into your local carrier store to have them take a look. Do you need help finding a location?",
                "bot",
                carrierOption
              )
            ]
          };
        default: {
          return ctx;
        }
      }
    },
    ...BASE_TRANSITIONS
  },
  "BANANA.KEYS_STICKY_NO": {
    OTHER_OPTION: (ctx, { option }) => {
      switch (option) {
        case carrierOption.YES:
          return {
            ...ctx,
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                "It looks like the closest location to you is 282 Skull Canyon Dr. You can get there using the Moon Rock Expressway or taking a Smol Bus.",
                "bot",
                options,
                "initial",
                <BusMessage />
              )
            ]
          };
        case carrierOption.NO_WARRANTY:
          return {
            ...ctx,
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                "Oh my. It seems I cannot help you there. However, we have received reports that smashing your banana phone into a rock will sometimes dislodge food crumbs stuck underneath the keyboard. Make sure to smash the back of the phone into the rock rather than the screen. We are not responsible for any damages that might result.",
                "bot",
                options,
                "initial"
              )
            ]
          };
        default: {
          return ctx;
        }
      }
    },
    ...BASE_TRANSITIONS
  },
  "BANANA.ORDER_VITAMINS": {
    OTHER_OPTION: (ctx, { option }) => {
      switch (option) {
        case vitaminPurchaseOptions.ONE_TIME:
        case vitaminPurchaseOptions.MONTHLY_SUBSCRIPTION:
          return {
            ...ctx,
            state: "BANANA.ORDER_VITAMINS_PROCEED",
            messages: [
              ...ctx.messages,
              newMessage(option, "user"),
              newMessage(
                "OK, great. Please wait while I process your request...",
                "bot"
              )
            ]
          };
        default: {
          return ctx;
        }
      }
    },
    ...RESET_TRANSITION
  },
  "BANANA.ORDER_VITAMINS_PROCEED": {
    VITAMINS_ORDER_ERROR: (ctx) => ({
      ...ctx,
      messages: [
        ...ctx.messages,
        newMessage(
          "Uh oh. It looks like your credit card company has rejected the transaction. I would recommend calling them directly. Your Smol Bank account might also be frozen. I cannot tell without having access to your account records. I’m afraid that there is not much else I can do for you. The only other suggestion I would have is if you are using Rainbow Treasures for medical not cosmetic reasons, you can make your own vitamins by following this recipe:\n\n1 Moon Rock\n1 Teaspoon of Alien Relic\n1 cup Coconut Juice\n\nFinely grind the Moon Rock into powder and place it in a pot. Do the same with the Alien Relic and measure out 1 teaspoon. Stir the teaspoon into the pot with the moon rock. (Preserve the remainder in a warm, dry place.) Add 1 cup of Coconut Juice and stir vigorously. Boil for 4-5 minutes.. Reduce heat to medium for an additional 5-6 minutes. Drain pot. Allow powder to dry for 24 hours then add to Size 0 Smol Bryan Gelatin Capsules.\n\nPlease be advised that homemade R.T. vitamins will vary in potency. Smol Brains are not advised to use homemade remedies for an extended period of time. Monitor yourself for possible overdose symptoms, which include loss of smell, hallucinations, unusual hair growth, impulsive or inappropriate behavior, and NFT bagholding.\n\nIs there something else I can help you with?",
          "bot",
          options,
          "initial"
        )
      ]
    }),
    ...BASE_TRANSITIONS
  },

  FUD_SUBMISSION: {
    OTHER_OPTION: (ctx, { option }) => {
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
                options,
                "initial"
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
    ...BASE_TRANSITIONS
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
            "Great. I have now received your FUD and submitted it to the Smolverse Care Team. They will analyze your complaint and provide the team with written feedback on the exact changes to make to best serve your needs. Thank you for being here!\n\nIs there something else I can help you with today?",
            "bot",
            options,
            "initial"
          )
        ]
      };
    },
    ...RESET_TRANSITION
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
          state: "TRANSFER_REQUEST",
          messages: [
            ...ctx.messages,
            newMessage(message, "user"),
            newMessage(
              "OK, great. I understand that you would like to speak to another custom service agent. I will transfer you to them now. You can also call 1913151222518195 to speak to someone that way. Have a great day!",
              "bot",
              undefined,
              undefined,
              <RequestMessage />
            )
          ]
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
    ...RESET_TRANSITION
  },
  TRANSFER_REQUEST: {
    ...RESET_TRANSITION
  },
  POKE_REQUEST: {
    POKE: (ctx, { targetLocation }) => ({
      ...ctx,
      state: "POKED",
      messages: [
        ...ctx.messages,
        newMessage(
          targetLocation === "none"
            ? "Boo. No ones online :("
            : `Poked a smol from ${getFlagEmoji(targetLocation)}.`,
          "bot",
          options,
          "initial"
        )
      ]
    }),
    ...RESET_TRANSITION
  },
  POKED: {
    ...BASE_TRANSITIONS
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

  const [state, dispatch] = chatReducer;

  const { ws, pokedTargetLocation } = useSocket();

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (state.state === "POKE_REQUEST") {
      if (!pokedTargetLocation) return;

      if (pokedTargetLocation !== "none") {
        id = setTimeout(() => {
          dispatch({
            type: "POKE",
            targetLocation: pokedTargetLocation
          });
        }, 5000);

        return () => clearTimeout(id);
      } else {
        id = setTimeout(() => {
          dispatch({
            type: "POKE",
            targetLocation: "none"
          });
        }, 5000);

        return () => clearTimeout(id);
      }
    }
  }, [pokedTargetLocation, state.state, dispatch]);

  useEnter(state, "POKE_REQUEST", () => {
    ws.send(
      JSON.stringify({
        type: "poke"
      })
    );
  });

  useEnter(state, "BANANA.ORDER_VITAMINS_PROCEED", () => {
    const id = setTimeout(() => {
      dispatch({
        type: "VITAMINS_ORDER_ERROR"
      });
    }, 5000);

    return () => clearTimeout(id);
  });

  return chatReducer;
};
