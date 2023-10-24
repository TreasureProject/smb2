import { json } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
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
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import stylesheet from "~/tailwind.css";
import usePartySocket from "partysocket/react";
import peeImg from "~/assets/pee.webp";
import { cn, getPublicKeys } from "./utils";
import { useDrag } from "@use-gesture/react";
import { interpolate } from "popmotion";
import { useCustomLoaderData } from "./hooks/useCustomLoaderData";
import { ShaderCanvas } from "./components/GlslCanvas";
import iconHref from "./components/icons/sprite.svg";
import { Icon } from "./components/Icons";
import { ResponsiveProvider } from "./res-context";
import NProgress from "nprogress";

const INITIAL_BLUR_VALUE = 15;

const MotionSvg = motion(Icon);

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "preload",
    href: iconHref,
    as: "image",
    type: "image/svg+xml"
  }
];

export const loader = () => {
  return json({
    ENV: getPublicKeys(process.env)
  });
};

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
  const [users, setUsers] = useState(0);
  const [smear, setSmear] = useState({
    state: "idle",
    x: 0,
    y: 0
  });
  const [flicked, setFlicked] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const [showIntro, setShowIntro] = useState(isRoot);
  const overflowHide = location.pathname === "/gallery";
  const blur = useMotionValue(isRoot ? INITIAL_BLUR_VALUE : 0);
  const y = useSpring(0, {
    stiffness: 5000,
    damping: 200
  });
  const grayscale = useSpring(0, {
    stiffness: 20,
    damping: 20
  });

  const animatedFilter = useMotionTemplate`blur(${blur}px) grayscale(${grayscale}%)`;

  const heightRef = useRef(0);

  /* these refs track if the user intends to drag or not, so we only show the smear 
     when they click, not drag.
  */
  const isPotentialDrag = useRef(false);
  const isDragging = useRef(false);

  useMotionValueEvent(y, "change", (y) => {
    if (!introRef.current) return;

    // if we're at the top, unmount the intro
    if (Math.abs(y) === introRef.current.getBoundingClientRect().height) {
      setShowIntro(false);
    }
  });

  useMotionValueEvent(y, "change", (y) => {
    if (!introRef.current) return;
    const blurValue = introRef.current.getBoundingClientRect().height + y;
    if (!heightRef.current) {
      heightRef.current = blurValue;
    }
    const b = interpolate(
      [100, heightRef.current],
      [0, INITIAL_BLUR_VALUE]
    )(blurValue);
    blur.set(b);
  });

  useDrag(
    ({ event, down, movement: [, my] }) => {
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
    if (smear.state === "active") {
      setTimeout(() => {
        setSmear({
          state: "idle",
          x: 0,
          y: 0
        });
      }, 1000);
    }
  }, [smear.state]);

  const navigation = useLocation();

  useNProgress();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={cn(
          "relative h-[100dvh] cursor-[url(/img/MiddleFingerCursor.svg),auto] bg-intro antialiased",
          isRoot || overflowHide ? "overflow-hidden" : null
        )}
        onMouseMove={({ currentTarget, clientX, clientY }) => {
          if (isPotentialDrag.current) {
            isDragging.current = true;
          }

          const { left, top } = currentTarget.getBoundingClientRect();
          mouseX.set(clientX - left - 40);
          mouseY.set(clientY - top - 40);
        }}
        onMouseDown={() => (isPotentialDrag.current = true)}
        onMouseUp={(e) => {
          if (isPotentialDrag.current && !isDragging.current) {
            let target = e.target as HTMLElement | null;

            // only show smear when not interacting with interactive elements
            while (target != null) {
              if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.getAttribute("role") === "button"
              ) {
                return;
              }
              target = target.parentElement;
            }

            if (smear.state !== "idle") return;

            const { left, top } = e.currentTarget.getBoundingClientRect();

            setSmear({
              state: "active",
              x: e.clientX - left,
              y: e.clientY - top
            });
          }
          isPotentialDrag.current = false;
          isDragging.current = false;
        }}
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
            {/* demo */}
            {/* <button
            className="absolute text-white text-4xl border-[4px] border-white h-16 px-4 z-10 top-4 left-4 bg-black/10 backdrop-blur-xl"
            onClick={() => {
              ws.send(JSON.stringify({ type: "pee" }));
            }}
          >
            <span className="tracking-wide">{users} SMOLS ONLINE</span>
          </button> */}

            {/* <motion.button
            className="absolute text-7xl border-[8px] border-black h-24 px-4 z-10 bottom-0 right-0 bg-black/10 backdrop-blur-xl"
            layout
            layoutId="button"
            onClick={() =>
              setColorMode((c) => {
                if (c) {
                  grayscale.set(100);
                } else {
                  grayscale.set(0);
                }
                return !c;
              })
            }
          >
            <motion.span
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              key={colorMode ? "on" : "off"}
              className="tracking-wide"
            >
              {colorMode ? "TURN THE LIGHTS OFF" : "TURN THE LIGHTS ON"}
            </motion.span>
          </motion.button> */}

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
            <motion.div
              style={{
                filter: animatedFilter,
                transform: "translate3d(0, 0, 0)"
              }}
              className="relative h-full"
            >
              <ShaderCanvas
                className="absolute inset-0"
                setUniforms={{
                  u_saturation: 20.0,
                  u_complexity: 5.0,
                  u_twist: 30.0,
                  u_light: 1.0,
                  u_mix: 0.0
                }}
                frag={`
            #ifdef GL_ES
            precision mediump float;
            #endif

            uniform vec2 u_resolution;
            uniform float u_time;
            uniform float u_complexity;
            uniform float u_saturation;
            uniform float u_twist;
            uniform float u_light;
            uniform float u_mix;

            void main() {
              vec2 coord = (gl_FragCoord.xy - (u_resolution / 2.)) / max(u_resolution.y, u_resolution.x);
              float len = length(vec2(coord.x, coord.y));

              coord.x -= cos(coord.y + sin(len * u_twist)) * sin(u_time / 20.0);
              coord.y -= sin(coord.x + cos(len * (u_twist / 2.))) * sin(u_time / 10.0);

              float space = cos(atan(sin(len * coord.x), sin(len * coord.y)) * 6.);
              space /= 6.;

              space = fract(space * u_complexity) / 2.2;
              vec3 color = vec3(space);

              color.r *= sin(len * (1.2 - u_mix)) * u_saturation;
              color.g *= sin(len * (3.3 - u_mix)) * u_saturation;
              color.b *= sin(len * (4.3 - u_mix)) * u_saturation;

              if (u_light == 1.0) {
                color.r = cos(len * color.r);
                color.g = cos(len * color.g);
                color.b = cos(len * color.b);
              } else {
                color.r = 1. - abs(cos(len * color.r));
                color.g = 1. - abs(cos(len * color.g));
                color.b = 1. - abs(cos(len * color.b));
              }

              gl_FragColor = vec4(color, 1.0);
            }
        `}
              />

              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  style={{
                    filter: animatedFilter,
                    transform: "translate3d(0, 0, 0)"
                  }}
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
            </motion.div>
            {/* Only show the intro on the root page */}
            {isRoot && showIntro && (
              <motion.div
                style={{
                  y
                }}
                ref={introRef}
                className="absolute inset-0 h-[100dvh] w-full touch-pan-x bg-intro/70"
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
                    <div className="mx-auto w-max select-none tracking-wide text-white/80 text-2xl sm:text-4xl">
                      SWIPE UP TO UNLOCK
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
            <AnimatePresence>
              {smear.state === "active" && (
                <MotionSvg
                  key="smear"
                  initial={false}
                  animate={{
                    opacity: 1,
                    left: smear.x - 192,
                    top: smear.y - 192
                  }}
                  exit={{
                    opacity: 0
                  }}
                  transition={{
                    duration: 5,
                    ease: "easeOut"
                  }}
                  name="splash"
                  className="pointer-events-none absolute z-30 h-96 w-96 text-red-500"
                ></MotionSvg>
              )}
            </AnimatePresence>
          </MotionConfig>
        </ResponsiveProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
