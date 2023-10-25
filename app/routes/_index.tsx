import type { LinksFunction, MetaFunction } from "@remix-run/node";
import React from "react";
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

// const MotionLink = motion(Link);

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

// function Dock() {
//   let mouseX = useMotionValue(Infinity);

//   return (
//     <Box
//       onMouseMove={(e) => mouseX.set(e.pageX)}
//       onMouseLeave={() => mouseX.set(Infinity)}
//       className="mx-auto flex h-28 items-end gap-4 overflow-visible bg-neonPink px-6 pb-7"
//     >
//       {[...Array(8).keys()].map((i) => (
//         <AppIcon mouseX={mouseX} key={i} />
//       ))}
//     </Box>
//   );
// }

// function AppIcon({ mouseX }: { mouseX: MotionValue }) {
//   let ref = useRef<HTMLImageElement>(null);

//   let distance = useTransform(mouseX, (val) => {
//     let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

//     return val - bounds.x - bounds.width / 2;
//   });

//   let widthSync = useTransform(distance, [-150, 0, 150], [64, 112, 64]);
//   let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

//   return (
//     <MotionLink
//       ref={ref}
//       to="/smolspace"
//       style={{
//         // @ts-ignore
//         width
//       }}
//       className="relative z-10 aspect-square h-auto w-16"
//     >
//       <img src={TestImg} className="h-full w-full rounded-md bg-neonPink"></img>
//     </MotionLink>
//   );
// }

export default function Index() {
  const [scope, _animate] = useAnimate();
  const { activated } = useKonami();
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
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
            className="bg-white/10 backdrop-blur-sm sm:col-start-1 sm:col-end-3 sm:row-start-1 sm:row-end-2"
          >
            <img
              src={News}
              alt="News"
              className="aspect-square h-full w-full opacity-[0.85]"
            ></img>
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
              className="aspect-square h-full w-full opacity-[0.85]"
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
              className="aspect-square h-full w-full opacity-[0.85]"
            ></img>
          </Box>
          <Box
            as="link"
            to="/spotlight"
            state={getTransformOrigin}
            className="bg-white/10 sm:col-start-5 sm:col-end-7 sm:row-start-1 sm:row-end-3"
          >
            <img
              src={Spotlight}
              alt="spotlight"
              className="aspect-square h-full w-full opacity-[0.85]"
            ></img>
          </Box>
          <Box
            as="a"
            href="https://shop.smolverse.lol/"
            className="bg-white/10 backdrop-blur-sm sm:col-start-1 sm:col-end-3 sm:row-start-2 sm:row-end-5"
          >
            <img
              src={Fashion}
              alt="fashion"
              className="aspect-square h-full w-full opacity-[0.85]"
            ></img>
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
            className="bg-white/10 backdrop-blur-sm sm:col-start-5 sm:col-end-6 sm:row-start-3 sm:row-end-5"
          >
            <img
              src={Goals}
              alt="goals"
              className="aspect-square h-full w-full opacity-[0.85]"
            ></img>
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
