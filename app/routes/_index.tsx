import type { V2_MetaFunction } from "@remix-run/node";
import type { MotionValue } from "framer-motion";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { getTransformOrigin } from "~/utils";
import { Box } from "~/components/Box";
import TestImg from "../assets/test.png";
import TestTwoImg from "../assets/test2.png";
import { Link } from "@remix-run/react";

const MotionLink = motion(Link);

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

function Dock() {
  let mouseX = useMotionValue(Infinity);

  return (
    <Box
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto flex h-28 items-end gap-4 px-6 pb-7 overflow-visible bg-neonPink"
    >
      {[...Array(8).keys()].map((i) => (
        <AppIcon mouseX={mouseX} key={i} />
      ))}
    </Box>
  );
}

function AppIcon({ mouseX }: { mouseX: MotionValue }) {
  let ref = useRef<HTMLImageElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthSync = useTransform(distance, [-150, 0, 150], [64, 112, 64]);
  let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <MotionLink
      ref={ref}
      to="/smolspace"
      style={{
        // @ts-ignore
        width,
      }}
      className="aspect-square h-auto w-16 z-10 relative"
    >
      <motion.img
        src={TestImg}
        className="w-full h-full rounded-md bg-neonPink"
      ></motion.img>
    </MotionLink>
  );
}

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
      <div className="h-full relative flex flex-col">
        <div className="flex mt-24 flex-1 relative flex-col max-w-7xl gap-12 mx-auto h-full">
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
              className="grid-in-w2 bg-white/10 backdrop-blur-sm"
            >
              <img
                src={TestTwoImg}
                alt="test"
                className="aspect-square w-full h-full opacity-[0.85]"
              ></img>
            </Box>
            <Box className="grid-in-w3 bg-acid"></Box>
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
