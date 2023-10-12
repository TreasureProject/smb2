import { motion } from "framer-motion";
import { useState } from "react";
import { AnimationContainer } from "~/components/AnimationContainer";
import { Header } from "~/components/Header";
import { MotionIcon, Icon } from "~/components/Icons";

const animationProps = {
  animate: { y: ["4.5rem", "4rem"] },
  initial: { y: "4.5rem" },
  transition: {
    y: {
      duration: 1.5,
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

export default function About() {
  const [isAnimating, setIsAnimating] = useState(false);
  return (
    <AnimationContainer className="flex flex-col">
      <Header name="about" />
      <section className="relative bg-[radial-gradient(rgba(114,55,227,0.00)_0%,#5B26C1_100%)]">
        <div className="container mx-auto px-8 sm:px-12">
          hello world hello world hello world hello world
        </div>
        hello world hello world hello world hello world
        <div className="absolute flex">
          <Icon
            name="tag"
            className="w-40 h-40 bottom-1/2 translate-y-[90%] translate-x-[35%]"
          />
          <motion.div className="flex items-center [perspective:1000px] flex-col">
            <motion.div
              animate={
                isAnimating
                  ? { transform: "rotateY(360deg)" }
                  : { transform: "rotateY(0deg)" }
              }
              transition={{ duration: 2, ease: [0.27, 0.85, 0.32, 1] }}
              className="relative inline-block [transform-style:preserve-3d]"
            >
              <MotionIcon
                {...animationProps}
                name="smol-smoke"
                className="contrast-0"
              />
              <MotionIcon
                {...animationProps}
                name="smol-smoke"
                className="absolute top-0 left-0 right-0 bottom-0 [backface-visibility:hidden]"
              />
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="absolute inset-0 h-full w-full translate-y-16"
              >
                <span className="sr-only">Toggle spin animation</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ width: "13rem", height: "13rem" }}
              animate={{
                width: ["13rem", "12rem"],
                height: ["13rem", "12rem"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="bg-black/50 w-48 h-48 rounded-full [transform:rotateX(75deg)]"
            ></motion.div>
          </motion.div>
        </div>
      </section>
    </AnimationContainer>
  );
}
