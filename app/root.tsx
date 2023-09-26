import { json } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
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
import SmearImg from "~/assets/smear.png";
import usePartySocket from "partysocket/react";
import peeImg from "~/assets/pee.png";
import { cn, getPublicKeys } from "./utils";
import { useDrag } from "@use-gesture/react";
import { interpolate } from "popmotion";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = () => {
  return json({
    ENV: getPublicKeys(process.env),
  });
};

function AnimatedOutlet() {
  const [outlet] = useState(useOutlet());
  return outlet;
}

export default function App() {
  const lastMessage = useRef({});
  const data = useLoaderData<typeof loader>() || lastMessage.current;
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

  const isRoot = location.pathname === "/";

  const blur = useMotionValue(isRoot ? 55 : 0);
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
    const blurValue = introRef.current.getBoundingClientRect().height + y;
    if (!heightRef.current) {
      heightRef.current = blurValue;
    }
    const b = interpolate([100, heightRef.current], [0, 55])(blurValue);
    blur.set(b);
  });

  useEffect(() => {
    if (data) lastMessage.current = data;
  }, [data]);

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
    host: data.ENV.PUBLIC_PARTYKIT_URL,
    room: "my-room",

    onOpen(e) {
      console.log("connected", e);
    },
    onMessage(e) {
      const msg = JSON.parse(e.data);

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

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className="cursor-[url(/img/MiddleFingerCursor.svg),auto] antialiased relative h-[100dvh] overflow-hidden"
        onMouseMove={({ currentTarget, clientX, clientY }) => {
          const { left, top } = currentTarget.getBoundingClientRect();
          mouseX.set(clientX - left - 40);
          mouseY.set(clientY - top - 40);
        }}
        onMouseDown={(e) => {
          if (smear.state !== "idle") return;

          setSmear({
            state: "active",
            x: e.clientX - e.currentTarget.offsetLeft,
            y: e.clientY - e.currentTarget.offsetTop,
          });
        }}
      >
        <MotionConfig
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          {/* demo */}
          <button
            className="absolute text-7xl border-[8px] border-black h-24 px-4 z-10 bottom-4 right-4 bg-black/10 backdrop-blur-xl"
            onClick={() => {
              ws.send(JSON.stringify({ type: "pee" }));
            }}
          >
            <span className="tracking-wide">PEE ON ONE OF {users}</span>
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
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={useLocation().pathname}
                initial={false}
                className="h-full absolute inset-0"
                exit={{
                  scale: 1,
                }}
              >
                <AnimatedOutlet />
              </motion.div>
            </AnimatePresence>
          </motion.div>
          {isRoot && (
            <motion.div
              style={{
                y,
              }}
              ref={introRef}
              className="absolute h-[100dvh] inset-0 bg-white/50 w-full touch-pan-x"
            >
              <div className="grid items-center justify-center py-12 max-w-7xl mx-auto h-full">
                <p className="text-black text-[40rem] leading-[0]">SMOL</p>
                <motion.div
                  ref={dragRef}
                  initial={{
                    x: "-50%",
                    y: "50%",
                  }}
                  animate={{
                    x: "-50%",
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
                    "absolute bottom-2 px-4 rounded-xl h-3 bg-gray-400 w-64 left-1/2 touch-none select-none"
                  )}
                ></motion.div>
              </div>
            </motion.div>
          )}
          <AnimatePresence>
            {smear.state === "active" && (
              <motion.img
                key="smear"
                initial={false}
                animate={{
                  opacity: 0.3,
                  x: smear.x - 50,
                  y: smear.y - 50,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 5,
                  ease: "easeOut",
                }}
                src={SmearImg}
                className="absolute w-[100px] h-[100px] rounded-full pointer-events-none"
              ></motion.img>
            )}
          </AnimatePresence>
        </MotionConfig>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
