import type { LinksFunction } from "@remix-run/node";
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
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import stylesheet from "~/tailwind.css";
import SmearImg from "~/assets/smear.png";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

function AnimatedOutlet() {
  const [outlet] = useState(useOutlet());
  return outlet;
}

export default function App() {
  const [smear, setSmear] = useState({
    state: "idle",
    x: 0,
    y: 0,
  });

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
        onMouseDown={(e) => {
          if (smear.state !== "idle") return;

          setSmear({
            state: "active",
            x: e.clientX - e.currentTarget.offsetLeft,
            y: e.clientY - e.currentTarget.offsetTop,
          });
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={useLocation().pathname}
            initial={false}
            className="h-full absolute inset-0"
            exit={{
              scale: 1,
            }}
            transition={{
              duration: 5,
              ease: "easeOut",
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
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
