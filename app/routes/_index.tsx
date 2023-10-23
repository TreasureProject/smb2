import type { MetaFunction } from "@remix-run/node";
import React from "react";
import { getTransformOrigin } from "~/utils";
import { Box } from "~/components/Box";
import TestImg from "../assets/test.webp";
import TestTwoImg from "../assets/test2.webp";

// const MotionLink = motion(Link);

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};

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
  return (
    <>
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
      <div className="relative mx-auto flex h-full max-w-5xl flex-1 items-center px-8 sm:px-12">
        <div className="grid gap-8 grid-areas-widgets [grid-auto-columns:1fr] [grid-auto-rows:1fr]">
          <Box
            as="link"
            to="/smolspace"
            state={getTransformOrigin}
            className="bg-white/10 backdrop-blur-sm grid-in-w1"
          >
            <img
              src={TestImg}
              alt="test"
              className="aspect-square h-full w-full opacity-[0.85]"
            ></img>
          </Box>
          <Box
            as="link"
            to="/gallery"
            state={getTransformOrigin}
            className="bg-white/10 backdrop-blur-sm grid-in-w2"
          >
            <img
              src={TestTwoImg}
              alt="test"
              className="aspect-square h-full w-full opacity-[0.85]"
            ></img>
          </Box>
          <Box
            as="link"
            to="/news"
            state={getTransformOrigin}
            className="bg-acid backdrop-blur-sm grid-in-w3"
          >
            <img
              src={TestTwoImg}
              alt="test"
              className="aspect-square h-full w-full opacity-[0.85]"
            ></img>
          </Box>
          <Box
            as="link"
            to="/about"
            state={getTransformOrigin}
            className="bg-sky-300 grid-in-w4"
          ></Box>
          <Box className="bg-purple-300 grid-in-w5"></Box>
          <Box className="grid-in-w6 bg-purple-300"></Box>
          <Box className="grid-in-w7 bg-purple-300"></Box>
          <Box className="grid-in-w8 bg-purple-300"></Box>
        </div>
      </div>
      {/* <div className="mx-auto flex basis-64 items-center">
          <Dock />
        </div> */}
    </>
  );
}
