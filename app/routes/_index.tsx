import type { V2_MetaFunction } from "@remix-run/node";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { useDrag } from "@use-gesture/react";
import React, { useRef, useState } from "react";
import { interpolate } from "popmotion";
import { cn, getTransformOrigin } from "~/utils";
import { Box } from "~/components/Box";
import TestImg from "../assets/test.png";
import TestTwoImg from "../assets/test2.png";
import { ShaderCanvas } from "~/components/GlslCanvas";
import { useControls } from "leva";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const dragRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const [colorMode, setColorMode] = useState(true);
  const blur = useMotionValue(55);
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

  useDrag(
    ({ down, movement: [, my] }) => {
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

  const { u_saturation, u_complexity, u_twist, u_light, u_mix } = useControls({
    u_saturation: 20.0,
    u_complexity: 3.0,
    u_twist: 5.0,
    u_light: 0.0,
    u_mix: 2.0,
  });

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
      <div className="relative h-full">
        <motion.div
          className="h-full py-12 relative"
          style={{
            filter: animatedFilter,
            transform: "translate3d(0, 0, 0)",
          }}
        >
          <ShaderCanvas
            className="absolute inset-0"
            setUniforms={React.useMemo(
              () => ({
                u_saturation,
                u_complexity,
                u_twist,
                u_light,
                u_mix,
              }),
              [u_complexity, u_light, u_mix, u_saturation, u_twist]
            )}
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
          <motion.button
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
          </motion.button>
          <div className="flex relative flex-col max-w-7xl gap-12 mx-auto h-full">
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
        </motion.div>
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
                "absolute bottom-2 px-4 rounded-xl h-3 bg-gray-400 w-64 left-1/2 touch-none"
              )}
            ></motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
