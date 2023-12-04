import {
  CSSProperties,
  useEffect,
  useLayoutEffect,
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
import { ReactorProvider, State, Ttoken, useReactor } from "./provider";
import { useAccount } from "wagmi";
import { PickState, match, matchProp } from "react-states";
import { Drawer } from "vaul";
import { TCollectionsToFetchWithoutAs, TroveToken } from "~/api.server";
import { Icon } from "~/components/Icons";
import { useApproval } from "~/hooks/useApprove";

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

// million-ignore
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
  | "REACTOR__SELECTED_DEGRADABLES"
  | "REACTOR__MALFUNCTION"
  | "REACTOR__CONVERTING_SMOLVERSE_NFT_TO_DEGRADABLE"
>;

// million-ignore
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
      <div className="absolute bottom-4 right-0 z-10 sm:bottom-0 sm:right-24">
        <div className="relative inline-block aspect-video h-40 overflow-hidden sm:h-80">
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

  const data = matchProp(state, "selectedTokens")?.selectedTokens;

  const { width, height } = useWindowSize();
  useEffect(() => {
    if (!scene.current) return;

    const cw = width;
    const ch = height;

    engine.current.gravity.y = 1;
    engine.current.gravity.x = 1;

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

    sensor.current = Bodies.rectangle(
      cw - (isMobile ? 160 : 385),
      ch - (isMobile ? 70 : 80),
      isMobile ? 40 : 150,
      isMobile ? 40 : 120,
      {
        isSensor: true,
        isStatic: true
      }
    );

    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, ch - 35, cw, 20, { isStatic: true }),
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
  }, [width, height, isMobile, data]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    let count = 0;
    if (!data) return;

    id = setInterval(() => {
      const currentNft = data[count];
      if (!currentNft) return;
      const ball = Bodies.rectangle(-10, height - 150, 100, 100, {
        mass: 10,
        restitution: 0.1,
        render: {
          sprite: {
            texture: currentNft.uri,
            xScale: currentNft.type === "smol-treasures" ? 0.16 : 0.285,
            yScale: currentNft.type === "smol-treasures" ? 0.15 : 0.285
          }
        }
      });
      World.add(engine.current.world, ball);

      if (count++ === data.length) {
        clearInterval(id);
      }
    }, 600);

    return () => clearInterval(id);
  }, [data, width]);

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

// million-ignore
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

// million-ignore
const Button = ({
  children,
  isDialog = false,
  ...props
}: {
  children: React.ReactNode;
  isDialog?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const button = (
    <button
      {...props}
      className="w-full rounded-md bg-white px-4 py-2 text-black font-formula text-[0.6rem] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-base"
    >
      {children}
    </button>
  );

  return isDialog ? <Drawer.Trigger asChild>{button}</Drawer.Trigger> : button;
};

function Conversation() {
  const { state, dispatch } = useReactor();
  const { address } = useAccount();
  const message = state.message;

  const fetcher = useFetcher();

  const { setOpen } = useModal();

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    if (!address) return;
    fetcherRef.current.load(`/get-inventory/${address}`);
  }, [address]);

  const buttonGroups = () =>
    match(state, {
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
            I need to convert a Treasure into another kind.
          </Button>
        </>
      ),
      NOT_CONNECTED: () => (
        <Button onClick={() => setOpen(true)}>Open Backpack (wallet)</Button>
      ),
      LOADING_INVENTORY: () => null,
      WHAT_IS_THIS: () => (
        <Button onClick={() => dispatch({ type: "RESTART" })}>Back</Button>
      ),
      USE_REACTOR: () => null,
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
                ? "Not enough Degradables"
                : `Produce ${producableRainbowTreasures.length} Rainbow Treasure(s)`}
            </Button>
            {/* <Button
              disabled={ctx.producableRainbowTreasures.length === 0}
              onClick={() =>
                dispatch({
                  type: "SELECT_DEGRADABLES_TO_CONVERT_TO_RAINBOW_TREASURE"
                })
              }
            >
              Select Degradables to convert
            </Button> */}
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
      REACTOR__CONVERTED_SMOLVERSE_NFT_TO_DEGRADABLE: () => null,
      REACTOR__CONVERTING_SMOLVERSE_NFT_TO_DEGRADABLE: () => null,
      REACTOR__MALFUNCTION: () => null,
      REACTOR__SELECTED_DEGRADABLES: () => null,
      REACTOR__SELECTING_SMOLVERSE_NFT: () => null,
      REACTOR__PRODUCED_RAINBOW_TREASURE: () => null,
      REACTOR__PRODUCING_RAINBOW_TREASURE: () => null,
      REACTOR__SELECTING_DEGRADABLE: () => null,
      REROLL: () => (
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
            onClick={() =>
              dispatch({
                type: "SELECTING_RAINBOW_TREASURE_TO_REROLL"
              })
            }
          >
            Select a Rainbow Treasure
          </Button>
        </>
      ),
      SELECTING_RAINBOW_TREASURE_TO_REROLL: () => null,
      REROLL__REROLLED: () => null,
      REROLL__REROLLING: () => null,
      ERROR: () => null
    });

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
              REACTOR__SELECTING_SMOLVERSE_NFT: () => (
                <SelectSmolverseNFTDialog />
              )
            },
            (otherStates) => []
          ))()}
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// const templateConversionInput = {
//   smolCarIds: [],
//   swolercycleIds: [],
//   treasureIds: [],
//   smolPetIds: [],
//   swolPetIds: [],
//   treasureAmounts: [],
//   vehicleSkinIds: [],
//   merkleProofsForSmolTraitShop: [],
//   smolTraitShopSkinCount: 0,
//   smolFemaleIds: []
// };

// million-ignore
const SelectSmolverseNFTDialog = () => {
  const { dispatch, state } = useReactor();
  const [items, setItems] = useState<Ttoken[]>([]);

  // inventory except degradables key
  const inventory = { ...state.inventory };

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
        <div className="flex">
          <Drawer.Close asChild>
            <Button
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
    tokens = tokens.filter((t) => {
      const gender = t.metadata.attributes.find(
        (a) => a.trait_type === "Gender"
      );
      return gender?.value === "Male";
    });
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
          <div className="absolute inset-0 z-40 grid h-full w-full place-items-center bg-grayOne/90">
            <Button onClick={() => approve()}>Approve</Button>
          </div>
        )}
        {selected && (
          <div className="absolute right-2 top-2 z-10 bg-fud p-2">
            <Icon name="check" className="h-8 w-8 text-white" />
          </div>
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
                  uri: token.image.uri
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
      <div className="relative z-10">
        <ConnectKitButton />
      </div>
      <AnimatePresence>
        {state.state !== "REACTOR__SELECTED_SMOLVERSE_NFT" &&
        state.state !== "REACTOR__SELECTED_DEGRADABLES" &&
        state.state !== "REACTOR__MALFUNCTION" &&
        state.state !== "REACTOR__CONVERTING_SMOLVERSE_NFT_TO_DEGRADABLE" ? (
          <Conversation />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {state.state === "REACTOR__SELECTED_SMOLVERSE_NFT" ||
        state.state === "REACTOR__SELECTED_DEGRADABLES" ||
        state.state === "REACTOR__MALFUNCTION" ||
        state.state === "REACTOR__CONVERTING_SMOLVERSE_NFT_TO_DEGRADABLE" ? (
          <ReactorVideo src={reactor} state={state} />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
