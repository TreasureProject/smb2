import type { LinksFunction, MetaFunction } from "@remix-run/node";
import React, { useEffect, useState } from "react";
import { getTransformOrigin } from "~/utils";
import { Box } from "~/components/Box";
import Frens from "../assets/frens.webp";
import Art from "../assets/art.webp";
import Gallery from "../assets/gallery.webp";
import Goals from "../assets/goals.webp";
import News from "../assets/news.webp";
import Tv from "../assets/tv.webp";
import Fashion from "../assets/fashion.webp";
import Spotlight from "../assets/spotlight.webp";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useKonami } from "~/contexts/konami";
import SmolMusicVideo from "~/assets/smol-musicvideo.mp4";
import { useIdleTimer } from "react-idle-timer";

import Peek from "~/assets/peek.gif";

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
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center px-8 sm:px-12">
        <div
          ref={scope}
          className="grid h-[36rem] grid-cols-2 gap-8 sm:grid-cols-6 sm:grid-rows-[0.7fr_1fr_min-content_min-content]"
        >
          <Box
            as="link"
            to="/about"
            state={getTransformOrigin}
            className="relative bg-white/10 backdrop-blur-sm sm:col-start-1 sm:col-end-3 sm:row-start-1 sm:row-end-2"
          >
            <img
              src={News}
              alt="News"
              className="aspect-video h-full w-full opacity-[0.85]"
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
                  className="absolute bottom-full left-1/2 z-10 h-24 w-24 -translate-x-1/2"
                  alt="peek smol"
                />
              )}
            </AnimatePresence>
          </Box>
          <Box
            as="link"
            to="/gallery"
            state={getTransformOrigin}
            className="bg-white/10 backdrop-blur-sm sm:col-start-3 sm:col-end-4 sm:row-start-1 sm:row-end-2"
          >
            <img
              src={Gallery}
              alt="gallery"
              className="aspect-video h-full w-full opacity-[0.85]"
            ></img>
          </Box>
          <Box
            as="link"
            to="/about"
            state={getTransformOrigin}
            className="bg-white/10 backdrop-blur-sm sm:col-start-4 sm:col-end-5 sm:row-start-1 sm:row-end-2"
          >
            <img
              src={Art}
              alt="art"
              className="aspect-video h-full w-full opacity-[0.85]"
            ></img>
          </Box>
          <Box
            as="link"
            to="/spotlight"
            state={getTransformOrigin}
            className="relative bg-white/10 sm:col-start-5 sm:col-end-7 sm:row-start-1 sm:row-end-3"
          >
            <img
              src={Spotlight}
              alt="spotlight"
              className="aspect-square h-full w-full opacity-[0.85]"
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
                  className="absolute bottom-0 left-full z-10 h-24 w-24 rotate-90"
                  alt="peek smol"
                />
              )}
            </AnimatePresence>
          </Box>
          <Box
            as="a"
            href="https://shop.smolverse.lol/"
            className="relative bg-white/10 backdrop-blur-sm sm:col-start-1 sm:col-end-3 sm:row-start-2 sm:row-end-5"
          >
            <img
              src={Fashion}
              alt="fashion"
              className="aspect-square h-full w-full opacity-[0.85]"
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
                  className="absolute bottom-0 right-full z-10 h-24 w-24 -rotate-90"
                  alt="peek smol"
                />
              )}
            </AnimatePresence>
          </Box>
          <Box
            as="link"
            to="/tv"
            state={getTransformOrigin}
            className="bg-white/10 backdrop-blur-sm sm:col-start-3 sm:col-end-5 sm:row-start-2 sm:row-end-5"
          >
            <img
              src={Tv}
              alt="tv"
              className="aspect-square h-full w-full opacity-[0.85]"
            ></img>
          </Box>
          <Box
            as="link"
            to="/news"
            state={getTransformOrigin}
            className="relative bg-white/10 backdrop-blur-sm sm:col-start-5 sm:col-end-6 sm:row-start-3 sm:row-end-5"
          >
            <img
              src={Goals}
              alt="goals"
              className="aspect-square h-full w-full opacity-[0.85]"
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
                  className="absolute left-1/2 top-full z-10 h-24 w-24 -translate-x-1/2 -rotate-180"
                  alt="peek smol"
                />
              )}
            </AnimatePresence>
          </Box>
          <Box
            as="link"
            to="/smolspace"
            state={getTransformOrigin}
            className="bg-white/10 backdrop-blur-sm sm:col-start-6 sm:col-end-7 sm:row-start-3 sm:row-end-5"
          >
            <img
              src={Frens}
              alt="frens"
              className="aspect-square h-full w-full opacity-[0.85]"
            ></img>
          </Box>
        </div>
      </div>
      {/* <div className="mx-auto flex basis-64 items-center">
          <Dock />
        </div> */}
    </>
  );
}
