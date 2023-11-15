import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
  useOutlet,
  useNavigation,
  useFetchers
} from "@remix-run/react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import usePartySocket from "partysocket/react";
import peeImg from "~/assets/pee.webp";
import { cn, getPublicKeys } from "./utils";
import { useDrag } from "@use-gesture/react";
import { interpolate } from "popmotion";
import { useCustomLoaderData } from "./hooks/useCustomLoaderData";
import iconHref from "./components/icons/sprite.svg";
import { Icon } from "./components/Icons";
import { ResponsiveProvider } from "./contexts/responsive";
import { EasterEggProvider, useEasterEgg } from "./contexts/easteregg";

import "./tailwind.css";

import NProgress from "nprogress";
import { BananaCanvas } from "./components/BananaCanvas";
import { getDomainUrl } from "./seo";
import { tinykeys } from "tinykeys";

const INITIAL_BLUR_VALUE = 15;

const MotionSvg = motion(Icon);

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: iconHref,
    as: "image",
    type: "image/svg+xml"
  }
];

export const loader = ({ request }: LoaderFunctionArgs) => {
  return json({
    requestInfo: {
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname
    },
    ENV: getPublicKeys(process.env)
  });
};

export type Loader = typeof loader;

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

function useNProgress() {
  let transition = useNavigation();

  let fetchers = useFetchers();

  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global transition (Link and Form), then use them to
   * determine if the app is idle or if it's loading.
   * Here we consider both loading and submitting as loading.
   */
  let state = useMemo<"idle" | "loading">(
    function getGlobalState() {
      let states = [
        transition.state,
        ...fetchers.map((fetcher) => fetcher.state)
      ];
      if (states.every((state) => state === "idle")) return "idle";
      return "loading";
    },
    [transition.state, fetchers]
  );

  useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (state === "loading") NProgress.start();
    // when the state is idle then we can to complete the progress bar
    if (state === "idle") NProgress.done();
  }, [state]);
}

function AnimatedOutlet() {
  const [outlet] = useState(useOutlet());
  return outlet;
}

export default function App() {
  const data = useCustomLoaderData<typeof loader>();

  const location = useLocation();
  const isRoot = location.pathname === "/";
  const overflowHide = location.pathname === "/gallery";
  return (
    <EasterEggProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body
          className={cn(
            "relative h-[100dvh] bg-[url(/img/stars.webp)] bg-repeat antialiased [overscroll-behavior:none]",
            isRoot || overflowHide ? "overflow-hidden" : null
          )}
        >
          <AppInner />

          <ScrollRestoration />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data?.ENV)}`
            }}
          />
          <LiveReload />
          <Scripts />
        </body>
      </html>
    </EasterEggProvider>
  );
}

function AppInner() {
  const data = useCustomLoaderData<typeof loader>();
  const [users, setUsers] = useState(0);

  const [flicked, setFlicked] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const [showIntro, setShowIntro] = useState(isRoot);
  const y = useSpring(0, {
    stiffness: 5000,
    damping: 200
  });

  const hue = useSpring(0, {
    stiffness: 100,
    damping: 20
  });

  const yTransform = useMotionTemplate`translate(0, ${y}px)`;

  const hueFilter = useMotionTemplate`hue-rotate(${hue}deg)`;

  const { konamiActivated } = useEasterEgg();

  useMotionValueEvent(y, "change", (y) => {
    if (!introRef.current) return;

    // if we're at the top, unmount the intro
    if (Math.abs(y) === introRef.current.getBoundingClientRect().height) {
      setShowIntro(false);
    }
  });

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      ArrowUp: () => {
        if (!introRef.current) return;
        y.set(-introRef.current?.getBoundingClientRect().height);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useDrag(
    ({ down, movement: [, my] }) => {
      if (my > 0 || !introRef.current) return;
      const isAboveCenter =
        my + introRef.current?.getBoundingClientRect().height / 2 < 0;

      if (down) {
        y.set(my);
        return;
      }

      if (!isAboveCenter) {
        y.set(0);
      } else {
        y.set(-introRef.current?.getBoundingClientRect().height);
      }
    },
    {
      axis: "y",
      target: dragRef,
      pointer: {
        capture: false
      }
    }
  );
  const ws = usePartySocket({
    host: data?.ENV.PUBLIC_PARTYKIT_URL || "localhost:1999",
    room: "my-room",

    onOpen(e) {
      console.log("connected", e);
    },
    onMessage(e) {
      const msg = JSON.parse(e.data);
      console.log({ msg });
      if (msg.type === "connect" || msg.type === "disconnect") {
        setUsers(msg.count);
      }

      if (msg.type === "pee") {
        setFlicked(true);
      }

      if (msg.type === "sent") {
        console.log("sent", msg);
      }
    },
    onClose() {
      console.log("disconnected");
    },
    onError(e) {
      console.log("connected");
    }
  });

  useEffect(() => {
    if (!flicked) return;

    setTimeout(() => {
      setFlicked(false);
    }, 5000);
  }, [flicked]);

  useEffect(() => {
    const animation = animate(hue, 360, {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    });

    if (!konamiActivated) {
      animation.cancel();
      hue.set(0);
    }

    return () => animation.cancel();
  }, [konamiActivated, hue]);

  const navigation = useLocation();

  useNProgress();

  return (
    <motion.div
      style={{
        filter: hueFilter
      }}
      className="h-full"
    >
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="outline">
            <feMorphology
              in="SourceAlpha"
              result="DILATED"
              operator="dilate"
              radius="4"
            ></feMorphology>

            <feFlood
              floodColor="#0E072D"
              floodOpacity="1"
              result="FUD"
            ></feFlood>
            <feComposite
              in="FUD"
              in2="DILATED"
              operator="in"
              result="OUTLINE"
            ></feComposite>

            <feMerge>
              <feMergeNode in="OUTLINE" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="rgb-split">
            <feOffset in="SourceGraphic" dx="0.5" dy="0.5" result="layer-one" />
            <feComponentTransfer in="layer-one" result="red">
              <feFuncR type="identity" />
              <feFuncG type="discrete" tableValues="0" />
              <feFuncB type="discrete" tableValues="0" />
            </feComponentTransfer>

            <feOffset
              in="SourceGraphic"
              dx="-0.5"
              dy="-0.5"
              result="layer-two"
            />
            <feComponentTransfer in="layer-two" result="cyan">
              <feFuncR type="discrete" tableValues="0" />
              <feFuncG type="identity" />
              <feFuncB type="identity" />
            </feComponentTransfer>

            <feBlend in="red" in2="cyan" mode="screen" result="color-split" />
          </filter>
        </defs>
      </svg>
      <ResponsiveProvider>
        <MotionConfig
          transition={{
            duration: 0.25,
            ease: "easeOut"
          }}
        >
          <AnimatePresence initial={false}>
            {flicked && (
              <motion.img
                transition={{
                  type: "spring",
                  mass: 0.6,
                  duration: 1
                }}
                style={{
                  x: mouseX,
                  y: mouseY,
                  position: "absolute",
                  pointerEvents: "none",
                  zIndex: 9999
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: [0, 360]
                }}
                exit={{
                  opacity: 0,
                  scale: 0
                }}
                src={peeImg}
                alt="pee"
                className="aspect-square h-auto w-12"
              />
            )}
          </AnimatePresence>

          <div className="relative h-full">
            <BananaCanvas />

            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={navigation.pathname}
                initial={false}
                className="absolute inset-0 z-10 h-full"
                exit={{
                  scale: 1,
                  opacity: 0
                }}
              >
                <AnimatedOutlet />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Only show the intro on the root page */}
          {isRoot && showIntro && (
            <motion.div
              style={{
                transform: yTransform
              }}
              ref={introRef}
              className="absolute inset-0 z-10 h-[100dvh] w-full touch-pan-x bg-intro/90 backdrop-blur-md"
            >
              <div className="mx-auto grid h-full max-w-7xl items-center justify-center py-12">
                <p className="relative text-white">
                  <span className="absolute -top-12 rotate-[355deg] select-none text-pepe font-oakley text-2xl sm:text-3xl">
                    WELCOME BACK
                  </span>
                  <span className="select-none font-sans text-[20rem] leading-none capsize sm:text-[32rem]">
                    SMOL
                  </span>
                </p>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <Icon
                    name="chevron-up"
                    className="mx-auto h-6 w-6 select-none text-white/80 sm:h-8 sm:w-8"
                  />
                  <div className="mx-auto w-max select-none font-bold tracking-wide text-white/80 font-formula text-xs sm:text-lg">
                    SWIPE UP / ↑ KEY TO UNLOCK
                  </div>
                  <motion.div
                    ref={dragRef}
                    initial={{
                      y: "50%"
                    }}
                    animate={{
                      y: ["10%", "0%"]
                    }}
                    transition={{
                      y: {
                        duration: 1.5,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatType: "reverse"
                      }
                    }}
                    className={cn(
                      "flex h-12 touch-none select-none items-center px-4"
                    )}
                  >
                    <div className="h-2.5 w-40 rounded-xl bg-gray-400/80 sm:h-4 sm:w-64"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </MotionConfig>
      </ResponsiveProvider>
    </motion.div>
  );
}
