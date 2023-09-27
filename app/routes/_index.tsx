import type { V2_MetaFunction } from "@remix-run/node";
import type { MotionValue } from "framer-motion";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { getTransformOrigin } from "~/utils";
import { Box } from "~/components/Box";
import TestImg from "../assets/test.png";
import TestTwoImg from "../assets/test2.png";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

function Dock() {
  let mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto flex h-16 items-end gap-4 rounded-2xl bg-vroom px-4 pb-3"
    >
      {[...Array(8).keys()].map((i) => (
        <AppIcon mouseX={mouseX} key={i} />
      ))}
    </motion.div>
  );
}

function AppIcon({ mouseX }: { mouseX: MotionValue }) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthSync = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square w-10 rounded-full bg-neonPink"
    />
  );
}

export default function Index() {
  // const [colorMode, setColorMode] = useState(true);

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
      <div className="h-full relative flex flex-col">
        <div className="flex flex-1 relative flex-col max-w-7xl gap-12 mx-auto h-full">
          <div className="grid grid-areas-widgets grid-cols-7 grid-rows-4 gap-8">
            <Box
              as="link"
              to="/smolspace"
              state={getTransformOrigin}
              className="grid-in-w1 bg-white/10 backdrop-blur-sm"
            >
              <img
                src={TestImg}
                alt="test"
                className="aspect-square w-full h-full opacity-[0.85]"
              ></img>
            </Box>
            <Box
              as="link"
              to="/smolspace"
              state={getTransformOrigin}
              className="grid-in-w2 bg-[#FF016C] bg-white/10 backdrop-blur-sm"
            >
              <img
                src={TestTwoImg}
                alt="test"
                className="aspect-square w-full h-full opacity-[0.85]"
              ></img>
            </Box>
            <Box className="grid-in-w3 bg-[#FA1DFA]"></Box>
            <Box className="grid-in-w4 bg-sky-300"></Box>
            <Box className="grid-in-w5 bg-purple-300"></Box>
          </div>
        </div>
        <div className="basis-64 mx-auto flex items-center">
          <Dock />
        </div>
      </div>
    </>
  );
}
