import {
  CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import smol_brian from "./assets/smol_brian.mp4";
import Tv from "./assets/tv.png";
import {
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
import { ConnectKitButton } from "connectkit";
import reactor from "./assets/reactor.mp4";
import runningMp3 from "./assets/running.mp3";
import errorMp3 from "./assets/error.mp3";
import { Engine, Body, Render, Bodies, World, Runner, Events } from "matter-js";
import { cn } from "~/utils";
import belt from "./assets/belt.jpg";
import beltAnimation from "./assets/belt-animated.gif";
import { LinksFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useResponsive } from "~/contexts/responsive";
import scientist from "./assets/scientist.png";
import { ReactorProvider, useReactor } from "./provider";
import { useAccount } from "wagmi";

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

// million-ignore
const ReactorVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [danger, setDanger] = useState(false);

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

    video.currentTime = danger ? NORMAL_TIME + 1 : 0;
  }, [danger]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const running = new Audio(runningMp3);
    const error = new Audio(errorMp3);

    running.loop = true;
    error.loop = true;

    if (!playing) {
      running.pause();
      error.pause();
    } else {
      if (danger) {
        error.play();
        running.pause();
      } else {
        running.play();
        error.pause();
      }
    }

    const onRunningTimeUpdate = () => {
      const buffer = 0.5;
      if (running.currentTime > running.duration - buffer) {
        running.currentTime = 0;
      }
    };

    const onErrorTimeUpdate = () => {
      const buffer = 0.1;
      if (error.currentTime > error.duration - buffer) {
        error.currentTime = 0;
      }
    };

    running.addEventListener("timeupdate", onRunningTimeUpdate);

    error.addEventListener("timeupdate", onErrorTimeUpdate);

    return () => {
      running.pause();
      error.pause();
      running.removeEventListener("timeupdate", onRunningTimeUpdate);
      error.removeEventListener("timeupdate", onErrorTimeUpdate);
    };
  }, [danger, playing]);

  return (
    <>
      <video
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (!video) return;
          const duration = video.duration;
          if (danger) {
            if (video.currentTime > duration - 0.1) {
              video.currentTime = NORMAL_TIME + 1;
            }
          } else if (!danger && video.currentTime > NORMAL_TIME) {
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
      <div className="absolute bottom-6 right-24 z-10 sm:bottom-0">
        <div className="relative inline-block aspect-video h-28 overflow-hidden sm:h-80">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      </div>
      <Physics videoRef={videoRef} setDanger={setDanger} />
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
    </>
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
  setDanger
}: {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  setDanger: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const scene = useRef<HTMLDivElement | null>(null);
  const engine = useRef(Engine.create());
  const runner = useRef(Runner.create());
  const sensor = useRef<Body | null>(null);
  const { isMobile } = useResponsive();

  const { width, height } = useWindowSize();
  useEffect(() => {
    if (!scene.current) return;

    const cw = width;
    const ch = height;

    engine.current.gravity.y = 1;
    engine.current.gravity.x = 0.09;

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
      cw - (isMobile ? 97 : 385),
      ch - 80,
      isMobile ? 50 : 150,
      isMobile ? 30 : 120,
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
  }, [width, height, isMobile]);

  // Events
  useEffect(() => {
    Events.on(engine.current, "collisionStart", (e) => {
      for (var i = 0, j = e.pairs.length; i != j; ++i) {
        var pair = e.pairs[i];

        if (pair.bodyA === sensor.current || pair.bodyB === sensor.current) {
          if (videoRef.current?.paused) {
            videoRef.current?.play();
          }

          setTimeout(() => {
            setDanger(true);
          }, 5000);
        }
      }
    });
  }, [setDanger]);

  return (
    <div
      onClick={(e) => {
        const ball = Bodies.circle(
          e.clientX,
          e.clientY,
          10 + Math.random() * 30,
          {
            mass: 10,
            restitution: 0.1,
            // friction: 0.005,
            render: {
              fillStyle: "#0000ff"
            }
          }
        );
        World.add(engine.current.world, [ball]);
      }}
      className="absolute inset-0"
    >
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

  return (
    <motion.span className="whitespace-pre-line" {...props}>
      {displayText}
    </motion.span>
  );
}

function Conversation() {
  const { state } = useReactor();
  const { address } = useAccount();
  const message = state.message;

  const fetcher = useFetcher();

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    if (!address) return;
    fetcherRef.current.load(`/get-inventory/${address}`);
  }, [address]);

  console.log(fetcher.data, fetcher.state);
  return (
    <motion.div
      initial={{
        opacity: 0,
        transform: "translateY(100%)"
      }}
      animate={{
        opacity: 1,
        transform: "translateY(0%)"
      }}
      className="fixed bottom-12 z-30 w-full px-8"
    >
      <div className="relative">
        <div className="absolute bottom-full z-20 bg-troll px-2 py-1 font-bold text-white font-formula text-2xl">
          Scientist
        </div>
        <div className="absolute inset-0 rotate-2 bg-vroom"></div>
        <div className="relative z-10 flex bg-tang">
          <img src={scientist} className="h-auto w-52" />
          <div className="flex w-full flex-col p-8">
            <p className="min-h-0 overflow-y-auto text-white font-mono [flex:1_1_0]">
              {message && (
                <MessageRenderer
                  className="w-full"
                  message={message}
                  key={state.state}
                />
              )}
            </p>
            <button className="ml-auto rounded-md bg-white px-4 py-2 text-black font-formula">
              Reply
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Reactor() {
  return (
    <ReactorProvider>
      <ReactorInner />
    </ReactorProvider>
  );
}

const ReactorInner = () => {
  const { state } = useReactor();
  return (
    <div className="flex h-full min-h-full flex-col">
      <Header name="Reactor" />
      <div className="relative z-10">
        <ConnectKitButton />
      </div>
      <Conversation />
    </div>
  );
};
