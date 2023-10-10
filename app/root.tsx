import { json } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useOutlet,
} from "@remix-run/react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import stylesheet from "~/tailwind.css";
import usePartySocket from "partysocket/react";
import peeImg from "~/assets/pee.png";
import { cn, getPublicKeys } from "./utils";
import { useDrag } from "@use-gesture/react";
import { interpolate } from "popmotion";
import { useCustomLoaderData } from "./hooks/useCustomLoaderData";
import { ShaderCanvas } from "./components/GlslCanvas";
import iconHref from "./components/icons/sprite.svg";
import { Icon } from "./components/Icons";

const INITIAL_BLUR_VALUE = 15;

const MotionSvg = motion(Icon);

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "preload",
    href: iconHref,
    as: "image",
    type: "image/svg+xml",
  },
];

export const loader = () => {
  return json({
    ENV: getPublicKeys(process.env),
  });
};

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

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
    y: 0,
  });
  const [flicked, setFlicked] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(true);

  const isRoot = location.pathname === "/";
  const overflowHide = location.pathname === "/gallery";
  const blur = useMotionValue(INITIAL_BLUR_VALUE);
  const y = useSpring(0, {
    stiffness: 5000,
    damping: 200,
  });
  const grayscale = useSpring(0, {
    stiffness: 20,
    damping: 20,
  });

  const animatedFilter = useMotionTemplate`blur(${blur}px) grayscale(${grayscale}%)`;

  const heightRef = useRef(0);

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
      event.preventDefault();

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
        capture: false,
      },
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
    },
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
          y: 0,
        });
      }, 1000);
    }
  }, [smear.state]);

  const navigation = useLocation();

  console.log({ navigation });
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
          "cursor-[url(/img/MiddleFingerCursor.svg),auto] antialiased relative h-[100dvh] bg-intro",
          isRoot || overflowHide ? "overflow-hidden" : null
        )}
        onMouseMove={({ currentTarget, clientX, clientY }) => {
          const { left, top } = currentTarget.getBoundingClientRect();
          mouseX.set(clientX - left - 40);
          mouseY.set(clientY - top - 40);
        }}
        onMouseDown={(e) => {
          if (smear.state !== "idle") return;

          const { left, top } = e.currentTarget.getBoundingClientRect();

          setSmear({
            state: "active",
            x: e.clientX - left,
            y: e.clientY - top,
          });
        }}
      >
        <MotionConfig
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
        >
          {/* demo */}
          <button
            className="absolute text-white text-4xl border-[4px] border-white h-16 px-4 z-10 top-4 left-4 bg-black/10 backdrop-blur-xl"
            onClick={() => {
              ws.send(JSON.stringify({ type: "pee" }));
            }}
          >
            <span className="tracking-wide">{users} SMOLS ONLINE</span>
          </button>

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
                  duration: 1,
                }}
                style={{
                  x: mouseX,
                  y: mouseY,
                  position: "absolute",
                  pointerEvents: "none",
                  zIndex: 9999,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: [0, 360],
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                }}
                src={peeImg}
                alt="pee"
                className="w-12 h-auto aspect-square"
              />
            )}
          </AnimatePresence>
          <motion.div
            style={{
              filter: animatedFilter,
              transform: "translate3d(0, 0, 0)",
            }}
            className="h-full relative"
          >
            <ShaderCanvas
              className="absolute inset-0"
              setUniforms={{
                u_saturation: 20.0,
                u_complexity: 5.0,
                u_twist: 30.0,
                u_light: 1.0,
                u_mix: 0.0,
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
                  transform: "translate3d(0, 0, 0)",
                }}
                key={navigation.pathname}
                initial={false}
                className="h-full absolute inset-0 z-10"
                exit={{
                  scale: 1,
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
                y,
              }}
              ref={introRef}
              className="absolute h-[100dvh] inset-0 bg-intro/70 w-full touch-pan-x"
            >
              <div className="grid items-center justify-center py-12 max-w-7xl mx-auto h-full">
                <p className="text-white relative text-[20rem] sm:text-[32rem] leading-[0]">
                  <span className="absolute -top-44 sm:-top-64 rotate-[355deg] font-oakley text-pepe text-2xl sm:text-3xl select-none">
                    WELCOME BACK
                  </span>
                  <span className="select-none">SMOL</span>
                </p>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <Icon
                    name="chevron-up"
                    className="w-6 h-6 sm:w-8 sm:h-8 mx-auto select-none text-white/80"
                  />
                  <div className="mx-auto select-none w-max text-white/80 text-2xl sm:text-4xl tracking-wide">
                    SWIPE UP TO UNLOCK
                  </div>
                  <motion.div
                    ref={dragRef}
                    initial={{
                      y: "50%",
                    }}
                    animate={{
                      y: ["10%", "0%"],
                    }}
                    transition={{
                      y: {
                        duration: 1.5,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                      },
                    }}
                    className={cn(
                      "px-4 h-12 flex items-center touch-none select-none"
                    )}
                  >
                    <div className="bg-gray-400/80 w-40 sm:w-64 rounded-xl h-2.5 sm:h-4"></div>
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
                  top: smear.y - 192,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 5,
                  ease: "easeOut",
                }}
                name="splash"
                className="absolute z-30 w-96 h-96 text-red-500 pointer-events-none"
              ></MotionSvg>
            )}
          </AnimatePresence>
        </MotionConfig>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
