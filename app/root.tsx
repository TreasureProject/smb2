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
  MotionValue,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import eeeImg from "~/assets/eee.png";
import { cn, getPublicKeys } from "./utils";
import { useDrag } from "@use-gesture/react";
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
import { SocketContextProvider, useSocket } from "./contexts/socket";

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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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
          onMouseMove={({ currentTarget, clientX, clientY }) => {
            const { left, top } = currentTarget.getBoundingClientRect();
            mouseX.set(clientX - left - 40);
            mouseY.set(clientY - top - 40);
          }}
        >
          <AppInner mouseX={mouseX} mouseY={mouseY} />
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

function AppInner({
  mouseX,
  mouseY
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const hue = useSpring(0, {
    stiffness: 100,
    damping: 20
  });

  const hueFilter = useMotionTemplate`hue-rotate(${hue}deg)`;

  const { konamiActivated } = useEasterEgg();

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
      <SocketContextProvider>
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
              <feOffset
                in="SourceGraphic"
                dx="0.5"
                dy="0.5"
                result="layer-one"
              />
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
              <Flick mouseX={mouseX} mouseY={mouseY} />
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
          </MotionConfig>
        </ResponsiveProvider>
      </SocketContextProvider>
    </motion.div>
  );
}

const Flick = ({
  mouseX,
  mouseY
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) => {
  const { flicked } = useSocket();

  return (
    <>
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
          src={eeeImg}
          alt="eee"
          className="aspect-square h-auto w-12"
        />
      )}
    </>
  );
};
