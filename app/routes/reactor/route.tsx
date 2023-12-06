import {
  CSSProperties,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
// import smol_brian from "./assets/smol_brian.mp4";
// import Tv from "./assets/tv.png";
import {
  AnimatePresence,
  HTMLMotionProps,
  animate,
  motion,
  useAnimate,
  useMotionValue,
  useTransform
} from "framer-motion";
import "./reactor.css";
import { commonMeta } from "~/seo";
import { Header } from "~/components/Header";
import { ConnectKitButton, useModal } from "connectkit";
import reactor from "./assets/reactor.mp4";
import { Engine, Body, Render, Bodies, World, Runner, Events } from "matter-js";
import { cn } from "~/utils";
import belt from "./assets/belt.jpg";
import beltAnimation from "./assets/belt-animated.gif";
import { LinksFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useResponsive } from "~/contexts/responsive";
import scientist from "./assets/scientist.png";
import {
  ReactorProvider,
  State,
  TroveTokenToItem,
  Ttoken,
  lootToRainbowTreasure,
  useReactor
} from "./provider";
import { useAccount, useBalance, useWaitForTransaction } from "wagmi";
import { PickState, match, matchProp } from "react-states";
import { Drawer } from "vaul";
import { TCollectionsToFetchWithoutAs, TroveToken } from "~/api.server";
import { Icon } from "~/components/Icons";
import { useApproval } from "~/hooks/useApprove";
import rainbowTreasure from "./assets/rainbow.gif";
import * as R from "remeda";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { useContractAddresses } from "~/useChainAddresses";
import {
  useErc20Allowance,
  useErc20Approve,
  usePrepareErc20Approve
} from "~/generated";
import { parseEther } from "viem";
import { mapper } from "./lootIdMapper";

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: beltAnimation,
    as: "image",
    type: "image/gif"
  }
];

export const meta = commonMeta;

const NORMAL_TIME = 3;

// const GreenScreenVideo = ({ src }: { src: string }) => {
//   const [scope, animate] = useAnimate();

//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [playing, setPlaying] = useState(false);

//   useEffect(() => {
//     const updateCanvas = () => {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;

//       if (!canvas || !video) return;

//       const ctx = canvas.getContext("2d");

//       if (!ctx || video.paused || video.ended) return;

//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//       let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       let l = frame.data.length / 4;

//       for (let i = 0; i < l; i++) {
//         let r = frame.data[i * 4 + 0];
//         let g = frame.data[i * 4 + 1];
//         let b = frame.data[i * 4 + 2];
//         const greenTolerance = 40;
//         if (
//           g > 85.7 - greenTolerance &&
//           g < 85.7 + greenTolerance &&
//           r < 45 &&
//           b < 45
//         ) {
//           frame.data[i * 4 + 3] = 0;
//         }
//       }

//       ctx.putImageData(frame, 0, 0);
//       requestAnimationFrame(updateCanvas);
//     };

//     if (playing) {
//       requestAnimationFrame(updateCanvas);
//     }
//   }, [playing]);

//   useEffect(() => {
//     const animation = async () => {
//       await animate(
//         scope.current,
//         {
//           y: [-1500, 0]
//         },
//         {
//           duration: 0.3,
//           ease: "linear"
//         }
//       );

//       await animate(
//         scope.current,
//         {
//           rotate: [12, 0, -4, 0],
//           transformOrigin: ["0% 100%", "100% 100%"]
//         },
//         {
//           duration: 0.1,
//           ease: "linear"
//         }
//       );
//     };

//     animation();
//   }, [animate, scope]);

//   return (
//     <div>
//       <video
//         onPlay={() => {
//           setPlaying(true);
//         }}
//         onPause={() => {
//           setPlaying(false);
//         }}
//         ref={videoRef}
//         src={src}
//         crossOrigin="anonymous"
//         className="hidden"
//         playsInline
//       />

//       <motion.div
//         initial={{
//           rotate: 12,
//           transformOrigin: "0% 100%",
//           y: -1500
//         }}
//         ref={scope}
//         className="relative inline-block w-80 overflow-hidden sm:w-[30rem]"
//       >
//         <button
//           className="absolute inset-0 z-30 h-full w-full"
//           onClick={() => {
//             if (playing) {
//               videoRef.current?.pause();
//             } else {
//               videoRef.current?.play();
//             }
//           }}
//         ></button>
//         <img src={Tv} className="relative z-20 h-full w-full" />
//         <div className="crt absolute bottom-[22.2%] left-[-20%] z-10 h-[47%] w-[110%] ">
//           <canvas ref={canvasRef} className="h-full" />
//         </div>
//       </motion.div>
//     </div>
//   );
// };

type ReactorVideoState = PickState<
  State,
  | "REACTOR__SELECTED_SMOLVERSE_NFT"
  | "REACTOR__PRODUCING_RAINBOW_TREASURE"
  | "REACTOR__MALFUNCTION"
  | "REACTOR__CONVERTING_SMOLVERSE_NFT_TO_DEGRADABLE"
  | "REROLL__REROLLING"
>;

const ReactorVideo = ({
  src,
  state
}: {
  src: string;
  state: ReactorVideoState;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const updateCanvas = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!canvas || !video) return;

      const ctx = canvas.getContext("2d");
      if (!ctx || video.ended) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let l = frame.data.length / 4;

      for (let i = 0; i < l; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];

        if (r > 215 && g > 215 && b > 215) {
          frame.data[i * 4 + 3] = 0;
        }
      }

      ctx.putImageData(frame, 0, 0);
      requestAnimationFrame(updateCanvas);
    };

    requestAnimationFrame(updateCanvas);
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime =
      state.state === "REACTOR__MALFUNCTION" ? NORMAL_TIME + 1 : 0;
  }, [state.state]);

  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
    >
      <video
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (!video) return;
          const duration = video.duration;
          if (state.state === "REACTOR__MALFUNCTION") {
            if (video.currentTime > duration - 0.3) {
              video.currentTime = NORMAL_TIME + 1;
            }
          } else if (video.currentTime > NORMAL_TIME) {
            video.currentTime = 0;
          }
        }}
        onPlay={() => {
          setPlaying(true);
        }}
        onPause={() => {
          setPlaying(false);
        }}
        ref={videoRef}
        src={src}
        crossOrigin="anonymous"
        className="hidden"
        playsInline
        autoPlay
        loop
      />
      <div className="absolute bottom-4 right-0 z-10 sm:-bottom-2 sm:right-24">
        <div className="relative inline-block aspect-video h-40 overflow-hidden sm:h-96">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      </div>
      <Physics videoRef={videoRef} state={state} />
      <div
        style={
          {
            "--belt": `url(${playing ? beltAnimation : belt})`
          } as CSSProperties
        }
        className={cn(
          "absolute bottom-0 z-10 h-12 w-full bg-contain [background-image:var(--belt)]"
        )}
      ></div>
    </motion.div>
  );
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useIsomorphicLayoutEffect(() => {
    handleSize();

    window.addEventListener("resize", handleSize);

    return () => window.removeEventListener("resize", handleSize);
  }, []);

  return windowSize;
};

function Physics({
  videoRef,
  state
}: {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  state: ReactorVideoState;
}) {
  const scene = useRef<HTMLDivElement | null>(null);
  const engine = useRef(Engine.create());
  const runner = useRef(Runner.create());
  const sensor = useRef<Body | null>(null);
  const { isMobile } = useResponsive();
  const { dispatch } = useReactor();

  const { width, height } = useWindowSize();
  useEffect(() => {
    if (!scene.current) return;

    const cw = width;
    const ch = height;

    engine.current.gravity.y = 1;
    engine.current.gravity.x = isMobile ? 0.2 : 0.5;

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent"
      }
    });

    const reactorPosition = isMobile ? 160 : 440;

    sensor.current = Bodies.rectangle(
      cw - reactorPosition,
      ch - (isMobile ? 65 : 100),
      isMobile ? 40 : 180,
      isMobile ? 50 : 140,
      {
        isSensor: true,
        isStatic: true
      }
    );

    World.add(engine.current.world, [
      Bodies.rectangle(
        0,
        ch - 35,
        cw + sensor.current.position.x - (isMobile ? 200 : 600),
        20,
        {
          isStatic: true
        }
      ),
      Bodies.rectangle(
        cw - reactorPosition + (isMobile ? 70 : 180) / 1.5,
        ch - (isMobile ? 65 : 100),
        isMobile ? 40 : 90,
        isMobile ? 50 : 140,
        {
          render: {
            visible: false
          },
          isStatic: true
        }
      ),
      sensor.current
    ]);

    Runner.run(runner.current, engine.current);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.current.world, false);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.textures = {};
    };
  }, [width, height, isMobile]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    let count = 0;

    if (
      state.state !== "REACTOR__SELECTED_SMOLVERSE_NFT" &&
      state.state !== "REACTOR__PRODUCING_RAINBOW_TREASURE" &&
      state.state !== "REROLL__REROLLING"
    )
      return;

    if (state.state === "REACTOR__SELECTED_SMOLVERSE_NFT") {
      id = setInterval(() => {
        const data = matchProp(state, "selectedTokens")?.selectedTokens;

        const currentNft = data[count];

        if (!currentNft) return;

        const ball = Bodies.rectangle(
          -10,
          height - 400,
          isMobile ? 25 : 100,
          isMobile ? 25 : 100,
          {
            mass: 10,
            restitution: 0.1,
            render: {
              sprite: {
                texture: currentNft.uri,
                xScale:
                  currentNft.type === "smol-treasures"
                    ? isMobile
                      ? 0.08
                      : 0.16
                    : isMobile
                    ? 0.142
                    : 0.285,
                yScale:
                  currentNft.type === "smol-treasures"
                    ? isMobile
                      ? 0.075
                      : 0.15
                    : isMobile
                    ? 0.142
                    : 0.285
              }
            }
          }
        );
        World.add(engine.current.world, ball);
        if (count++ === data.length) {
          clearInterval(id);
        }
      }, 600);

      return () => clearInterval(id);
    } else if (state.state === "REACTOR__PRODUCING_RAINBOW_TREASURE") {
      id = setInterval(() => {
        const data = matchProp(state, "producableRainbowTreasures")
          ?.producableRainbowTreasures;

        const combined = data
          .reduce<string[]>((acc, d) => {
            return [...acc, ...d.tokens.map((t) => t.uri)];
          }, [])
          .slice(0, 100);

        const currentNftImage = combined[count];

        if (!currentNftImage) return;

        const ball = Bodies.circle(-10, height - 400, isMobile ? 20 : 50, {
          mass: 20,
          restitution: 0.1,
          render: {
            sprite: {
              texture: currentNftImage,
              xScale: isMobile ? 0.12 : 0.27,
              yScale: isMobile ? 0.12 : 0.27
            }
          }
        });
        World.add(engine.current.world, ball);
        if (count++ === combined.length) {
          clearInterval(id);
        }
      }, 200);

      return () => clearInterval(id);
    } else {
      id = setInterval(() => {
        const data = matchProp(state, "degradablesToReroll")
          ?.degradablesToReroll;

        const currentNFt = data[count];

        if (!currentNFt) return;

        const ball = Bodies.circle(-10, height - 400, isMobile ? 20 : 50, {
          mass: 20,
          restitution: 0.1,
          render: {
            sprite: {
              texture: currentNFt.image.uri,
              xScale: isMobile ? 0.12 : 0.27,
              yScale: isMobile ? 0.12 : 0.27
            }
          }
        });
        World.add(engine.current.world, ball);
        if (count++ === data.length) {
          clearInterval(id);
        }
      }, 200);

      return () => clearInterval(id);
    }
  }, [state, height, isMobile]);

  // Events
  useEffect(() => {
    Events.on(engine.current, "collisionStart", (e) => {
      for (var i = 0, j = e.pairs.length; i != j; ++i) {
        var pair = e.pairs[i];
        if (pair.bodyA === sensor.current || pair.bodyB === sensor.current) {
          if (videoRef.current?.paused) {
            videoRef.current?.play();
          }

          if (state.state === "REACTOR__SELECTED_SMOLVERSE_NFT") {
            setTimeout(() => {
              dispatch({
                type: "MALFUNCTION"
              });
            }, 5000);
          }
        }
      }
    });
  }, [dispatch, state.state, videoRef]);

  return (
    <div className="absolute inset-0">
      <div ref={scene} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export function MessageRenderer({
  message,
  ...props
}: {
  message: string;
} & HTMLMotionProps<"span">) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    message.slice(0, latest)
  );
  useEffect(() => {
    const animateText = async () => {
      await animate(count, message.length, {
        duration: message.length * 0.02,
        ease: "linear"
      });
    };

    animateText();
  }, [message, count]);

  return <motion.span {...props}>{displayText}</motion.span>;
}

const Button = ({
  children,
  isDialog = false,
  primary = false,
  ...props
}: {
  children: React.ReactNode;
  isDialog?: boolean;
  primary?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const button = (
    <button
      {...props}
      className={cn(
        "w-full rounded-md bg-white px-4 py-2 text-black font-formula text-[0.6rem] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-base",
        primary && "bg-troll font-semibold uppercase tracking-wider text-white"
      )}
    >
      {children}
    </button>
  );

  return isDialog ? <Drawer.Trigger asChild>{button}</Drawer.Trigger> : button;
};

function Conversation() {
  const { state, dispatch } = useReactor();
  const message = state.message;

  const { setOpen } = useModal();

  const buttonGroups = () =>
    match(
      state,
      {
        IDLE: () => (
          <>
            <Button
              onClick={() =>
                dispatch({
                  type: "NEXT",
                  moveTo: "WHAT_IS_THIS"
                })
              }
            >
              What is this?
            </Button>
            <Button
              onClick={() =>
                dispatch({
                  type: "NEXT",
                  moveTo: "USE_REACTOR"
                })
              }
            >
              I need to use the reactor.
            </Button>
            <Button
              onClick={() =>
                dispatch({
                  type: "NEXT",
                  moveTo: "REROLL"
                })
              }
            >
              I need to convert a Degradable into another kind.
            </Button>
          </>
        ),
        NOT_CONNECTED: () => (
          <Button onClick={() => setOpen(true)}>Open Backpack (wallet)</Button>
        ),
        WHAT_IS_THIS: () => (
          <Button onClick={() => dispatch({ type: "RESTART" })}>Back</Button>
        ),
        REACTOR__NO_SMOLVERSE_NFT: () => (
          <Button onClick={() => dispatch({ type: "RESTART" })}>Back</Button>
        ),
        REACTOR__NO_DEGRADABLE: () => (
          <Button
            isDialog
            onClick={() =>
              dispatch({
                type: "SELECTING_SMOLVERSE_NFT"
              })
            }
          >
            Yes
          </Button>
        ),
        REACTOR__SELECTED_SMOLVERSE_NFT: () => null,
        REACTOR__SELECT_OPTION: (ctx) => {
          const producableRainbowTreasures = ctx.producableRainbowTreasures;
          return (
            <>
              <Button
                disabled={ctx.producableRainbowTreasures.length === 0}
                onClick={() =>
                  dispatch({
                    type: "PRODUCE_RAINBOW_TREASURE_AUTOMATICALLY"
                  })
                }
              >
                {producableRainbowTreasures.length === 0
                  ? "No matching degradables"
                  : `Produce ${producableRainbowTreasures.length} Rainbow Treasure(s)`}
              </Button>
              <Button
                isDialog
                onClick={() =>
                  dispatch({
                    type: "TRY_LUCK"
                  })
                }
              >
                Try my luck
              </Button>
            </>
          );
        },

        REROLL: (ctx) => {
          const degradables = ctx.inventory?.degradables ?? [];
          return (
            <>
              <Button
                onClick={() =>
                  dispatch({
                    type: "RESTART"
                  })
                }
              >
                Back
              </Button>
              <Button
                isDialog
                disabled={degradables.length === 0}
                onClick={() =>
                  dispatch({
                    type: "SELECT_RAINBOW_TREASURE_TO_REROLL"
                  })
                }
              >
                {degradables.length === 0
                  ? "You do not own any Degradables"
                  : "Select Degradables"}
              </Button>
            </>
          );
        },

        ERROR: () => (
          <Button
            onClick={() =>
              dispatch({
                type: "RESTART"
              })
            }
          >
            Back
          </Button>
        )
      },
      (otherStates) => []
    );

  return (
    <Drawer.Root dismissible={false}>
      <motion.div
        initial={{
          opacity: 0,
          transform: "translateY(100%)"
        }}
        animate={{
          opacity: 1,
          transform: "translateY(0%)"
        }}
        exit={{
          opacity: 0,
          transform: "translateY(100%)"
        }}
        className="fixed bottom-12 z-30 w-full px-8"
      >
        <div className="relative">
          <div className="absolute bottom-full right-0 z-20 bg-troll px-2 py-1 font-bold text-white font-formula text-2xl sm:left-0 sm:right-auto">
            Scientist
          </div>
          <div className="absolute inset-0 h-[250px] rotate-2 bg-vroom sm:h-auto"></div>
          <div className="relative z-10 flex h-[250px] bg-tang sm:h-auto">
            <img
              src={scientist}
              className="absolute bottom-full left-0 h-24 w-20 sm:relative sm:h-auto sm:w-52 sm:scale-100"
            />
            <div className="flex w-full flex-col p-4 sm:p-8">
              {/* <span className="text-white font-mono">state: {state.state}</span> */}
              <p className="min-h-0 overflow-y-auto text-white font-mono [flex:1_1_0]">
                {message && (
                  <MessageRenderer
                    className="w-full whitespace-pre-line text-xs sm:text-base"
                    message={message}
                    key={state.state}
                  />
                )}
              </p>
              <div className="space-y-1.5 sm:ml-auto sm:space-x-2 sm:space-y-0">
                {buttonGroups()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        {(() =>
          match(
            state,
            {
              REACTOR__SELECTING_SMOLVERSE_NFT: (state) => (
                <SelectSmolverseNFTDialog state={state} />
              ),
              SELECTING_RAINBOW_TREASURE_TO_REROLL: (state) => (
                <RerollDialog state={state} />
              )
            },
            (otherStates) => []
          ))()}
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function getNormalizedValue(expireAt: number) {
  const SECONDS_IN_A_DAY = 86400;
  const DAYS = 30;

  const createdAt = expireAt - DAYS * SECONDS_IN_A_DAY; // createdAt is expireAt - 30 days
  const currentDate = new Date().getTime() / 1000; // Current date in epoch seconds
  const totalDuration = expireAt - createdAt; // Total duration from creation to expiration

  // If the current date is before creation, return 100
  if (currentDate <= createdAt) {
    return 100;
  }

  // If the current date is after expiration, return 0
  if (currentDate >= expireAt) {
    return 0;
  }

  const elapsedTime = expireAt - currentDate; // Time remaining until expiration
  const normalizedValue = (elapsedTime / totalDuration) * 100; // Normalize to a percentage

  return normalizedValue;
}

const RerollDialog = ({
  state
}: {
  state: PickState<State, "SELECTING_RAINBOW_TREASURE_TO_REROLL">;
}) => {
  const { dispatch } = useReactor();
  const [selected, setSelected] = useState<TroveToken[]>([]);
  const degradables = state.inventory?.degradables;
  const { address } = useAccount();
  const contracts = useContractAddresses();
  const balance = useBalance({
    address: address,
    token: contracts["MAGIC"]
  });
  const { config: erc20ApproveConfig } = usePrepareErc20Approve({
    address: contracts["MAGIC"],
    args: [contracts["DEGRADABLES"], parseEther(String(selected.length))]
  });

  const erc20Approve = useErc20Approve(erc20ApproveConfig);

  const { isSuccess: isERC20ApproveSuccess } = useWaitForTransaction(
    erc20Approve.data
  );

  const { data: allowance, refetch: refetchAllowance } = useErc20Allowance({
    address: contracts["MAGIC"],
    args: [address ?? "0x0", contracts["DEGRADABLES"]]
  });

  const isApproved =
    !!allowance && allowance >= parseEther(String(selected.length));

  useEffect(() => {
    if (isERC20ApproveSuccess) {
      refetchAllowance();
    }
  }, [isERC20ApproveSuccess]);

  const magicInWallet = parseFloat(balance?.data?.formatted ?? "0");

  if (!degradables) return null;

  const producableList = useMemo(
    () =>
      lootToRainbowTreasure(degradables.map(TroveTokenToItem)).reduce<string[]>(
        (acc, d) => {
          return [...acc, ...d.tokens.map((t) => t.tokenId)];
        },
        []
      ),
    [degradables]
  );

  return (
    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-10 mt-24 flex h-[90%] items-stretch rounded-t-[10px] bg-[#261F2D]">
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        <div className="grid grid-cols-2 gap-6 overflow-auto px-6 py-12 [grid-auto-rows:max-content] sm:grid-cols-5">
          {degradables.map((degradable) => {
            const isSelected = selected.includes(degradable);

            const expireAt = degradable.metadata.attributes.find(
              (a) => a.trait_type === "Use-By Date"
            )?.value as number | undefined;

            const canBeUsedToProduceRainbowTreasure = producableList.includes(
              degradable.tokenId
            );

            const expirePercentage = getNormalizedValue(expireAt ?? 0);

            return (
              <div
                key={degradable.tokenId}
                className={cn(
                  "relative inline-block bg-[#483B53] p-2",
                  isSelected && "bg-[#DCD0E7]"
                )}
              >
                {canBeUsedToProduceRainbowTreasure && (
                  <Icon
                    name="exclamation-mark"
                    className="absolute -top-2 right-2 z-20 h-8 w-8"
                  />
                )}
                {isSelected && (
                  <div className="absolute right-2 top-2 z-10 bg-fud p-2">
                    <Icon name="check" className="h-8 w-8 text-white" />
                  </div>
                )}
                {expireAt && (
                  <div className="absolute bottom-2 left-1/2 z-10 grid w-full -translate-x-1/2 place-items-center p-2">
                    <div className="h-1 w-2/3 bg-gray-300 sm:h-2">
                      <div
                        style={{
                          width: `${expirePercentage}%`
                        }}
                        className={cn(
                          "h-full",
                          expirePercentage < 20
                            ? "bg-rage"
                            : expirePercentage < 50
                            ? "bg-pepe"
                            : expirePercentage < 100
                            ? "bg-acid"
                            : "bg-rage"
                        )}
                      ></div>
                    </div>
                  </div>
                )}
                <img
                  src={degradable.image.uri}
                  className="relative h-full w-full"
                />
                <button
                  className="absolute inset-0 z-20 h-full w-full"
                  onClick={() => {
                    if (isSelected) {
                      setSelected(
                        selected.filter((s) => s.tokenId !== degradable.tokenId)
                      );
                    } else {
                      setSelected([...selected, degradable]);
                    }
                  }}
                ></button>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col space-y-3 px-6 py-4">
          <div className="flex flex-col justify-between space-y-2 sm:flex-row">
            <div className="flex items-center">
              <Icon name="exclamation-mark" className="h-5 w-5 text-white" />
              <p className="text-white font-mono text-[0.6rem] sm:text-xs">
                - This degradable can be used to craft Rainbow Treasures.
              </p>
            </div>
            <p className="text-white font-mono text-xs">
              <span className="font-bold">{magicInWallet}</span> MAGIC
            </p>
          </div>
          {isApproved ? (
            <Drawer.Close asChild>
              <Button
                primary
                onClick={() =>
                  dispatch({
                    type: "CONFIRM_REROLL",
                    degradablesToReroll: selected
                  })
                }
                disabled={
                  selected.length === 0 ||
                  magicInWallet === 0 ||
                  magicInWallet < selected.length
                }
              >
                {magicInWallet < selected.length || magicInWallet === 0 ? (
                  <span>Insufficient MAGIC</span>
                ) : (
                  <span>
                    Reroll{" "}
                    {selected.length !== 0 && `for ${selected.length} MAGIC`}
                  </span>
                )}
              </Button>
            </Drawer.Close>
          ) : (
            <Button
              disabled={selected.length === 0}
              onClick={() => erc20Approve?.write?.()}
            >
              Approve{" "}
              {selected.length !== 0 && `${selected.length} MAGIC to be spent`}
            </Button>
          )}
        </div>
      </div>
    </Drawer.Content>
  );
};

const ResultDialog = ({ state }: { state: PickState<State, "RESULT"> }) => {
  const { dispatch } = useReactor();
  const { degradableMinted, rainbowTreasuresMinted, degradablesRerolled } =
    state;
  const [index, setIndex] = useState(1);
  const degradableMintedRef = useRef<HTMLDivElement | null>(null);
  const rainbowTreasureMintedRef = useRef<HTMLDivElement | null>(null);

  const maxIndex =
    degradableMinted.length > 0 && rainbowTreasuresMinted > 0 ? 2 : 1;

  useEffect(() => {
    const run = async () => {
      const commonAnimation = async (
        element: HTMLDivElement,
        delay: number = 0
      ) => {
        await animate(
          element,
          {
            transform: [
              "translateY(-999%) translateX(-50%)",
              "translateY(0%) translateX(-50%)"
            ]
          },
          {
            duration: 0.8,
            delay,
            ease: "linear"
          }
        );

        await animate(
          element,
          {
            rotate: [12, 0, -4, 0],
            transformOrigin: ["0% 100%", "100% 100%"]
          },
          {
            duration: 0.1,
            ease: "linear"
          }
        );
      };

      if (maxIndex === 1) {
        if (degradableMinted.length > 0 && degradableMintedRef.current) {
          await commonAnimation(degradableMintedRef.current, 0.5);
        } else if (
          rainbowTreasuresMinted > 0 &&
          rainbowTreasureMintedRef.current
        ) {
          await commonAnimation(rainbowTreasureMintedRef.current);
        }
      } else {
        if (index === 1 && degradableMinted.length > 0) {
          if (degradableMintedRef.current) {
            await commonAnimation(degradableMintedRef.current, 0.5);
          }
        } else if (index === 2 && rainbowTreasuresMinted > 0) {
          if (degradableMintedRef.current) {
            await animate(
              degradableMintedRef.current,
              {
                // slide out to the right
                transform: ["translateX(-50%)", "translateX(999%)"]
              },
              {
                duration: 0.5,
                ease: "easeIn"
              }
            );
          }
          if (rainbowTreasureMintedRef.current) {
            await commonAnimation(rainbowTreasureMintedRef.current);
          }
        }
      }
    };
    run();
  }, [maxIndex, index, degradableMinted, rainbowTreasuresMinted]);

  const degradableMintedSlice = degradableMinted.slice(0, 10);

  const currentDegradables = state.inventory?.["degradables"];

  const availableToProduceRainbowTreasure = lootToRainbowTreasure(
    [
      ...(currentDegradables ? currentDegradables : []),
      ...(degradableMinted.length > 0 ? degradableMinted : degradablesRerolled)
    ].map((degradable) => {
      if ("collectionAddr" in degradable) {
        return TroveTokenToItem(degradable);
      }

      const { colorName, shapeName } = mapper[degradable.lootId];

      return {
        tokenId: degradable.tokenId,
        uri: `https://ipfs.io/ipfs/QmaVzSLBXppoHAPZb8ZL6Z8vk9z2usuANgcgE8Wg1jf1qN/${colorName.toLowerCase()}/${shapeName.toLowerCase()}.png`,
        attributes: [
          {
            trait_type: "Color",
            value: colorName
          },
          {
            trait_type: "Shape",
            value: shapeName
          }
        ]
      };
    })
  );

  const leftOver = degradableMinted.length - degradableMintedSlice.length;

  return (
    <DialogContent className="border-none bg-transparent p-0 shadow-none font-mono sm:rounded-none">
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        {degradableMintedSlice.length > 0 ? (
          <motion.div
            initial={{
              rotate: 12,
              transform: "translateY(-999%), translateX(-50%)"
            }}
            ref={degradableMintedRef}
            className="absolute left-1/2 flex flex-col items-center"
          >
            <div className="flex items-end px-4">
              <div className="flex w-max -space-x-12 sm:-space-x-16">
                {degradableMintedSlice.map((degradable, i) => {
                  const { colorName, shapeName } = mapper[degradable.lootId];
                  return (
                    <img
                      style={{
                        zIndex: degradableMintedSlice.length - i
                      }}
                      className="relative inline-block h-16 w-16 sm:h-24 sm:w-24"
                      src={`https://ipfs.io/ipfs/QmaVzSLBXppoHAPZb8ZL6Z8vk9z2usuANgcgE8Wg1jf1qN/${colorName.toLowerCase()}/${shapeName.toLowerCase()}.png`}
                      alt={`${colorName} ${shapeName}`}
                    />
                  );
                })}
              </div>
              {leftOver > 0 && (
                <span className="whitespace-nowrap font-bold text-white font-formula text-xl">
                  + {leftOver}
                </span>
              )}
            </div>
            {availableToProduceRainbowTreasure.length > 0 ? (
              <p className="mt-8  text-center text-white font-formula text-xs sm:text-sm">
                Looks like you can make{" "}
                <span className="font-bold">
                  {availableToProduceRainbowTreasure.length}
                </span>{" "}
                Rainbow Treasure(s) in total!
              </p>
            ) : null}
          </motion.div>
        ) : null}

        {rainbowTreasuresMinted > 0 ? (
          <motion.div
            initial={{
              rotate: 12,
              transform: "translateY(-999%), translateX(-50%)"
            }}
            ref={rainbowTreasureMintedRef}
            className="absolute left-1/2 flex h-32 w-32 -translate-x-1/2 translate-y-[-999%] flex-col items-center space-y-1"
          >
            <img src={rainbowTreasure} className="h-full w-full" />
            <span className="font-bold text-neonPink font-formula text-2xl">
              {rainbowTreasuresMinted}x
            </span>
          </motion.div>
        ) : null}

        {degradablesRerolled.length > 0 ? (
          <div>
            <div className="grid max-h-[27rem] grid-cols-3 overflow-auto sm:grid-cols-4">
              {degradablesRerolled.map((degradable) => {
                const { colorName, shapeName } = mapper[degradable.lootId];

                return (
                  <div
                    key={degradable.previousDegradable.tokenId + 1}
                    className="relative h-24 w-24"
                  >
                    <motion.img
                      animate={{
                        opacity: 0
                      }}
                      transition={{
                        delay: 0.5,
                        duration: 1.5
                      }}
                      src={degradable.previousDegradable.image.uri}
                      className="h-full w-full opacity-100"
                    />
                    <motion.img
                      animate={{
                        opacity: 1
                      }}
                      transition={{
                        delay: 0.5,
                        duration: 1
                      }}
                      className="absolute inset-0 z-10 opacity-0"
                      src={`https://ipfs.io/ipfs/QmaVzSLBXppoHAPZb8ZL6Z8vk9z2usuANgcgE8Wg1jf1qN/${colorName.toLowerCase()}/${shapeName.toLowerCase()}.png`}
                      alt={`${colorName} ${shapeName}`}
                    />
                  </div>
                );
              })}
            </div>
            {availableToProduceRainbowTreasure.length > 0 ? (
              <p className="mt-8 whitespace-nowrap text-white font-formula">
                Looks like you can make{" "}
                <span className="font-bold">
                  {availableToProduceRainbowTreasure.length}
                </span>{" "}
                Rainbow Treasure(s) in total!
              </p>
            ) : null}
          </div>
        ) : null}
        <div
          className={cn(
            "mt-48 flex space-x-2",
            degradablesRerolled.length > 0 && "mx-auto mt-8"
          )}
        >
          <Drawer.Close asChild>
            <Button
              onClick={() =>
                dispatch({
                  type: "RESTART"
                })
              }
            >
              Back
            </Button>
          </Drawer.Close>
          {index < maxIndex && (
            <Button
              primary
              onClick={() =>
                setIndex((prev) => {
                  return prev + 1;
                })
              }
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

const SelectSmolverseNFTDialog = ({
  state
}: {
  state: PickState<State, "REACTOR__SELECTING_SMOLVERSE_NFT">;
}) => {
  const { dispatch } = useReactor();
  const [items, setItems] = useState<Ttoken[]>([]);

  // inventory except degradables key
  const inventory = useMemo(() => R.clone(state.inventory), [state.inventory]);

  if (!inventory) return null;

  delete inventory["degradables"];

  return (
    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-10 mt-24 flex h-[90%] items-stretch rounded-t-[10px] bg-[#261F2D]">
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        <div className="grid grid-cols-2 gap-6 overflow-auto px-6 py-12 [grid-auto-rows:max-content] sm:grid-cols-5">
          {Object.entries(inventory).map(([type, tokens]) => {
            return (
              <RenderTokens
                key={type}
                type={type as TCollectionsToFetchWithoutAs<"degradables">}
                tokens={tokens}
                items={items}
                setItems={setItems}
              />
            );
          })}
        </div>
        <div className="flex flex-col space-y-2 px-6 py-4">
          <div className="bg-[#0F082E] p-6">
            <p className="text-white font-formula text-xs sm:text-lg">
              The degradables you make will expire after 30 days.
            </p>
          </div>
          <Drawer.Close asChild>
            <Button
              primary
              disabled={items.length === 0}
              onClick={() =>
                dispatch({
                  type: "SELECT_SMOLVERSE_NFT",
                  tokens: items
                })
              }
            >
              Confirm
            </Button>
          </Drawer.Close>
        </div>
      </div>
    </Drawer.Content>
  );
};

export const RenderTokens = ({
  type,
  tokens,
  items,
  setItems
}: {
  type: TCollectionsToFetchWithoutAs<"degradables">;
  tokens: TroveToken[];
  items: Ttoken[];
  setItems: React.Dispatch<React.SetStateAction<Ttoken[]>>;
}) => {
  // only allow Female to be selected
  if (type === "smol-brains") {
    console.log(tokens);
    tokens = tokens.filter((t) => {
      const gender = t.metadata.attributes.find(
        (a) => a.trait_type === "Gender"
      );
      return gender?.value === "female";
    });
  }

  if (type === "smol-treasures") {
    tokens = tokens.filter((t) => t.tokenId !== "10"); // rainbow treasure
  }

  const { isApproved, approve, refetch, isSuccess } = useApproval({ type });

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  return tokens.map((token) => {
    const selected = items.find(
      (s) => s.tokenId === token.tokenId && s.type === type
    );
    return (
      <div
        key={token.tokenId}
        className={cn(
          "relative inline-block bg-[#483B53] p-2",
          selected && "bg-[#DCD0E7]"
        )}
      >
        {!isApproved && (
          <div className="absolute inset-0 z-40 grid h-full w-full place-items-center bg-grayOne/80 px-4 backdrop-blur-sm">
            <Button onClick={() => approve()}>Approve</Button>
          </div>
        )}
        {selected && (
          <div className="absolute right-2 top-2 z-10 bg-fud p-2">
            <Icon name="check" className="h-8 w-8 text-white" />
          </div>
        )}
        {type === "smol-treasures" && (
          <span className="absolute left-6 top-5 z-10 font-bold font-mono text-sm sm:left-7 sm:text-base">
            {token.queryUserQuantityOwned}x
          </span>
        )}
        <img src={token.image.uri} className="relative h-full w-full" />
        <button
          className="absolute inset-0 z-20 h-full w-full"
          onClick={() => {
            if (selected) {
              setItems(
                items.filter(
                  (s) => s.tokenId !== token.tokenId || s.type !== type
                )
              );
            } else {
              setItems([
                ...items,
                {
                  tokenId: token.tokenId,
                  type: type,
                  uri: token.image.uri,
                  supply: token.queryUserQuantityOwned ?? 0
                }
              ]);
            }
          }}
        ></button>
      </div>
    );
  });
};

export default function Reactor() {
  return (
    <ReactorProvider>
      <ReactorInner />
    </ReactorProvider>
  );
}

const ReactorInner = () => {
  const { state, dispatch } = useReactor();
  return (
    <div className="flex h-full min-h-full flex-col">
      <Header name="Reactor" />
      <div className="relative z-10 ml-auto px-4 pt-4">
        <ConnectKitButton />
      </div>
      <AnimatePresence>
        {state.state !== "REACTOR__SELECTED_SMOLVERSE_NFT" &&
        state.state !== "REACTOR__PRODUCING_RAINBOW_TREASURE" &&
        state.state !== "REACTOR__MALFUNCTION" &&
        state.state !== "REACTOR__CONVERTING_SMOLVERSE_NFT_TO_DEGRADABLE" &&
        state.state !== "RESULT" &&
        state.state !== "REROLL__REROLLING" ? (
          <Conversation />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {state.state === "REACTOR__SELECTED_SMOLVERSE_NFT" ||
        state.state === "REACTOR__PRODUCING_RAINBOW_TREASURE" ||
        state.state === "REACTOR__MALFUNCTION" ||
        state.state === "REACTOR__CONVERTING_SMOLVERSE_NFT_TO_DEGRADABLE" ||
        state.state === "REROLL__REROLLING" ? (
          <ReactorVideo src={reactor} state={state} />
        ) : null}
      </AnimatePresence>
      <Dialog open={state.state === "RESULT"}>
        {state.state === "RESULT" && <ResultDialog state={state} />}
      </Dialog>
    </div>
  );
};
