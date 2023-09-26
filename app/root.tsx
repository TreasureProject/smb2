import { json } from "@remix-run/node";
import type { LoaderArgs, LinksFunction } from "@remix-run/node";
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
  useMotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import stylesheet from "~/tailwind.css";
import SmearImg from "~/assets/smear.png";
import usePartySocket from "partysocket/react";
import peeImg from "~/assets/pee.png";
import { getPublicKeys } from "./utils";

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
  const data = useLoaderData<typeof loader>();
  const [users, setUsers] = useState(0);
  const [smear, setSmear] = useState({
    state: "idle",
    x: 0,
    y: 0,
  });
  const [flicked, setFlicked] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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

      if (msg.type === "flickoff") {
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
        className="cursor-[url(/img/MiddleFingerCursor.svg),auto] antialiased relative h-[100dvh]"
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
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          {/* demo */}
          <button
            className="absolute text-7xl border-[8px] border-black h-24 px-4 z-10 bottom-0 right-0 bg-black/10 backdrop-blur-xl"
            onClick={() => {
              ws.send(JSON.stringify({ type: "flickoff" }));
            }}
          >
            <span className="tracking-wide">PEE ON ONE OF {users}</span>
          </button>
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
