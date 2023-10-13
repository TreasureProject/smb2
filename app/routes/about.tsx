import { motion } from "framer-motion";
import { useState } from "react";
import { AnimationContainer } from "~/components/AnimationContainer";
import { Header } from "~/components/Header";
import { MotionIcon, Icon, Test } from "~/components/Icons";
import NewspaperImg from "~/assets/newspaper.png";

const animationProps = {
  animate: { y: ["4.5rem", "4rem"] },
  initial: { y: "4.5rem" },
  transition: {
    y: {
      duration: 1.5,
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

const AnimatedSticker = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="absolute flex">
      <Icon
        name="tag"
        className="bottom-1/2 h-40 w-40 translate-x-[35%] translate-y-[90%]"
      />
      <motion.div className="flex flex-col items-center [perspective:1000px]">
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
            className="select-none contrast-0"
          />
          <MotionIcon
            {...animationProps}
            name="smol-smoke"
            className="absolute bottom-0 left-0 right-0 top-0 select-none [backface-visibility:hidden]"
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
            height: ["13rem", "12rem"]
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="h-48 w-48 select-none rounded-full bg-black/50 [transform:rotateX(75deg)]"
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default function About() {
  return (
    <AnimationContainer className="flex flex-col">
      <Header name="about" />
      <section className="relative bg-[radial-gradient(rgba(114,55,227,0.00)_0%,#5B26C1_100%)]">
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 grid-rows-1 gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pb-36 lg:pt-20 xl:py-32">
          <div className="relative lg:col-span-5">
            hello world hello world hello world hello world
            <p className="absolute rounded-3xl bg-pepe px-4 py-2 font-bold font-formula text-base leading-none capsize">
              THE DAILY
            </p>
            <img src={NewspaperImg} className="h-24 w-24" />
            <p className="relative text-white font-sans text-[20rem] leading-none capsize">
              SMOL
            </p>
          </div>
          <div className="relative lg:col-span-7">
            hello world hello world hello world hello world
            <AnimatedSticker />
          </div>
        </div>
      </section>
    </AnimationContainer>
  );
}
