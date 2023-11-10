import type { LinksFunction, MetaFunction } from "@remix-run/node";
import React, { useState } from "react";
import { getTransformOrigin } from "~/utils";
import { Box } from "~/components/Box";
import Weather from "../assets/apps/Weather.webp";
import Gallery from "../assets/apps/Gallery.webp";
import Goals from "../assets/apps/Goals.mp4";
import News from "../assets/apps/News.webp";
import Tv from "../assets/apps/TV.webp";
import Fashion from "../assets/apps/Fashion.webp";
import CCTV from "../assets/apps/CCTV.webp";
import CCTVCamera from "../assets/apps/Camera.gif";
import Games from "../assets/apps/Games.webp";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useKonami } from "~/contexts/konami";
import SmolMusicVideo from "~/assets/smol-musicvideo.mp4";
import { useIdleTimer } from "react-idle-timer";

import Peek from "~/assets/peek.gif";
import Peek2 from "~/assets/peek2.gif";
import Peek3 from "~/assets/peek3.gif";
import Peek4 from "~/assets/peek4.gif";
import Peek5 from "~/assets/peek5.gif";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: SmolMusicVideo,
    as: "video",
    type: "video/mp4"
  }
];

export default function Index() {
  const [scope, _animate] = useAnimate();
  const { activated } = useKonami();
  const [state, setState] = useState<"idle" | "active">("active");
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  useIdleTimer({
    onIdle: () => setState("idle"),
    onActive: () => setState("active"),
    timeout: 5000,
    throttle: 500
  });

  React.useEffect(() => {
    const animation = _animate(
      "a",
      {
        x: [0, -10, 10, -10, 10, 0],
        y: [0, -5, 5, -5, 5, 0]
      },
      {
        duration: 0.5,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        repeat: Infinity,
        repeatType: "reverse"
      }
    );

    if (!activated) {
      animation.cancel();
    }

    return () => animation.cancel();
  }, [_animate, activated]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!activated) {
      video.pause();
      video.currentTime = 0;
    } else {
      video.play();
    }
  }, [activated]);

  return (
    <>
      <AnimatePresence>
        {activated && (
          <motion.video
            preload="auto"
            playsInline
            ref={videoRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            loop
            className="absolute inset-0 h-full w-full object-fill"
          >
            <source src={SmolMusicVideo} type="video/mp4" />
          </motion.video>
        )}
      </AnimatePresence>
      <svg width={0} className="hidden">
        <defs>
          <filter id="rgb-split">
            <feOffset in="SourceGraphic" dx="2" dy="4" result="layer-one" />
            <feComponentTransfer in="layer-one" result="red">
              <feFuncR type="identity" />
              <feFuncG type="discrete" tableValues="0" />
              <feFuncB type="discrete" tableValues="0" />
            </feComponentTransfer>

            <feOffset in="SourceGraphic" dx="-2" dy="-4" result="layer-two" />
            <feComponentTransfer in="layer-two" result="cyan">
              <feFuncR type="discrete" tableValues="0" />
              <feFuncG type="identity" />
              <feFuncB type="identity" />
            </feComponentTransfer>

            <feBlend in="red" in2="cyan" mode="screen" result="color-split" />
          </filter>
        </defs>
      </svg>
      <div className="relative mx-auto grid h-full max-w-7xl place-items-center px-10 py-12 sm:px-12">
        <div
          ref={scope}
          className="grid grid-cols-2 gap-4 [grid-auto-rows:20%] sm:grid-cols-4 sm:grid-rows-2 sm:gap-8"
        >
          <Box
            as="link"
            to="/news"
            state={getTransformOrigin}
            className="relative"
          >
            <img
              src={News}
              alt="News"
              className="aspect-square h-full w-full"
            ></img>
            <AnimatePresence>
              {state === "idle" && (
                <motion.img
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0
                  }}
                  src={Peek}
                  className="absolute bottom-full left-1/2 z-10 h-8 w-8 -translate-x-1/2 sm:h-24 sm:w-24"
                  alt="peek smol"
                />
              )}
            </AnimatePresence>
          </Box>
          <Box as="link" to="/gallery" state={getTransformOrigin}>
            <img
              src={Gallery}
              alt="gallery"
              className="aspect-square h-full w-full"
            ></img>
          </Box>
          <Box as="link" to="/about" state={getTransformOrigin}>
            <img
              src={Weather}
              alt="art"
              className="aspect-square h-full w-full"
            ></img>
          </Box>
          <Box
            as="link"
            to="/spotlight"
            state={getTransformOrigin}
            className="relative bg-white/10"
          >
            <img
              src={Games}
              alt="Games"
              className="aspect-square h-full w-full"
            ></img>
            <AnimatePresence>
              {state === "idle" && (
                <motion.img
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0
                  }}
                  src={Peek5}
                  className="absolute bottom-full right-24 z-10 h-8 w-8 sm:h-24 sm:w-24"
                  alt="peek smol"
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {state === "idle" && (
                <motion.img
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0
                  }}
                  src={Peek2}
                  className="absolute bottom-4 left-full z-10 h-8 w-8 rotate-90 sm:h-24 sm:w-24"
                  alt="peek smol"
                />
              )}
            </AnimatePresence>
          </Box>
          <Box as="a" href="https://shop.smolverse.lol/" className="relative">
            <img
              src={Fashion}
              alt="fashion"
              className="aspect-square h-full w-full"
            ></img>
            <AnimatePresence>
              {state === "idle" && (
                <motion.img
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0
                  }}
                  src={Peek3}
                  className="absolute bottom-4 right-full z-10 h-8 w-8 -rotate-90 sm:h-24 sm:w-24"
                  alt="peek smol"
                />
              )}
            </AnimatePresence>
          </Box>
          <Box as="link" to="/tv" state={getTransformOrigin}>
            <img
              src={Tv}
              alt="tv"
              className="aspect-square h-full w-full"
            ></img>
          </Box>
          <Box
            as="link"
            to="/goals"
            state={getTransformOrigin}
            className="relative"
          >
            <div className="relative h-full overflow-hidden">
              <span className="relative z-10 ml-4 inline-block text-white text-8xl leading-none capsize sm:text-[12rem]">
                GOALS
              </span>
              <video
                preload="auto"
                playsInline
                loop
                muted
                autoPlay
                className="absolute -bottom-1/2 -right-[40%] h-[175%] min-w-[175%] -rotate-[30deg] -scale-x-100 object-cover"
              >
                <source src={Goals} type="video/mp4" />
              </video>
            </div>
            <AnimatePresence>
              {state === "idle" && (
                <motion.img
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0
                  }}
                  src={Peek4}
                  className="absolute left-1/2 top-full z-10 h-8 w-8 -translate-x-1/2 -rotate-180 sm:h-24 sm:w-24"
                  alt="peek smol"
                />
              )}
            </AnimatePresence>
          </Box>
          <Box as="link" to="/smolspace" state={getTransformOrigin}>
            <div className="relative h-full overflow-hidden">
              <img
                src={CCTV}
                alt="CCTV"
                className="aspect-square h-full w-full"
              ></img>
              <img
                src={CCTVCamera}
                className="absolute -bottom-1/4 left-10 h-full w-full"
                alt="CCTV Camera"
              />
              <div className="absolute inset-0 bg-rage/90 [mask-image:linear-gradient(transparent_75%,black)]"></div>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}
