import {
  motion,
  useAnimate,
  useMotionTemplate,
  animate,
  useSpring,
  useMotionValue
} from "framer-motion";
import type { HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimationContainer } from "~/components/AnimationContainer";
import { Header } from "~/components/Header";
import { MotionIcon, Icon } from "~/components/Icons";
import NewspaperImg from "~/assets/newspaper.png";
import GameCoverImg from "~/assets/game-cover.png";
import GameCoverBgImg from "~/assets/graphic.png";
import SmolBrainsTextImg from "~/assets/Text.png";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "atropos/atropos.min.css";
import Atropos from "atropos/react";
import { cn } from "~/utils";

// Smol Document Assets
import SmolBgImg from "~/assets/smol-brain/BG.png";
import EEEImg from "~/assets/smol-brain/EEE.png";
import LogoImg from "~/assets/smol-brain/Logo.png";
import ShadowImg from "~/assets/smol-brain/Shadow.png";
import SmolImg from "~/assets/smol-brain/Smol.png";
import TreasureTagImg from "~/assets/smol-brain/TreasureTag.png";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet }
];

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
    <div className="absolute -bottom-32 right-0 flex">
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

const Documents = () => {
  let parentRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  return (
    <section className="relative bg-vroom">
      <div className="relative mx-auto max-w-6xl p-16">
        <div className="flex w-min flex-col">
          <div className="flex gap-4">
            <p className="font-normal text-white font-sans text-9xl leading-none capsize">
              DOCUMENTS
            </p>
            <div className="flex items-start gap-4">
              <button
                onClick={() => {
                  if (activeIndex === 0) return;

                  parentRef.current?.scroll(0, 0);
                  setActiveIndex(0);
                }}
                className="bg-pepe p-2 hover:bg-pepe/90"
              >
                <span className="sr-only">View all documents</span>
                <Icon name="left-arrow" className="h-9 w-9" />
              </button>
              <button
                onClick={() => {
                  parentRef.current?.scroll(activeIndex * 450, 0);
                  setActiveIndex(activeIndex + 1);
                }}
                className="bg-pepe p-2 hover:bg-pepe/90"
              >
                <span className="sr-only">View all documents</span>
                <Icon name="left-arrow" className="h-9 w-9 rotate-180" />
              </button>
            </div>
          </div>
          <p className="mt-4 font-bold text-white font-mono leading-none capsize">
            Here you will find the universal database of all documents. Learn
            more about everyone around you. We are uncovering new facts
            everyday!
          </p>
        </div>
        <div
          ref={parentRef}
          className="mt-8 flex w-screen snap-x snap-mandatory space-x-6 overflow-x-auto scroll-smooth py-8 [scrollbar-width:none] sm:space-x-14 [&::-webkit-scrollbar]:hidden"
        >
          {[...Array(10)].map((_, i) => (
            <Document i={i} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Document = ({ i }: { i: number }) => {
  const [scope, animate] = useAnimate();
  const [front, setFront] = useState(true);

  useEffect(() => {
    if (front) {
      animate(
        scope.current,
        {
          visibility: "hidden"
        },
        {
          delay: 0.5
        }
      );
    } else {
      animate(scope.current, {
        visibility: "visible"
      });
    }
  }, [scope, animate, front]);
  return (
    <div className="[perspective:1000px]">
      <motion.div
        animate={
          front
            ? { transform: "rotateY(0deg)" }
            : { transform: "rotateY(180deg)" }
        }
        className="relative flex [transform-style:preserve-3d]"
        key={i}
      >
        <div
          ref={scope}
          className={cn(
            "pointer-events-none absolute right-0 top-0 h-full w-96 select-none",
            front ? "pl-8" : "pr-8"
          )}
        >
          <img
            className="h-full w-full [transform:scaleX(-1)]"
            src={GameCoverBgImg}
          ></img>
        </div>
        <Atropos
          shadowScale={0.85}
          className="relative w-96 flex-none snap-start pl-8 [backface-visibility:hidden]"
        >
          <img src={SmolBgImg} alt="" />
          {/* <AtroposImg src={SmolBgImg} data-atropos-offset="5" alt="" /> */}
          <AtroposImg src={EEEImg} data-atropos-offset="1" alt="" />
          <AtroposImg src={LogoImg} data-atropos-offset="3" alt="" />
          <AtroposImg src={SmolImg} data-atropos-offset="2" alt="" />
          <AtroposImg src={TreasureTagImg} alt="" />
          <button
            onClick={() => setFront(!front)}
            className="absolute inset-0 h-full w-full"
          >
            <span className="sr-only">Toggle spin animation</span>
          </button>
        </Atropos>
        {!front && (
          <button
            onClick={() => setFront(!front)}
            className="absolute inset-0 h-full w-full"
          >
            <span className="sr-only">Toggle spin animation</span>
          </button>
        )}
      </motion.div>
    </div>
  );
};

const AtroposImg = ({
  src,
  className,
  alt,
  ...props
}: {
  src: string;
  alt: string;
} & HTMLAttributes<HTMLImageElement>) => (
  <img
    src={src}
    alt={alt}
    className={cn(
      "pointer-events-none absolute inset-0 h-full w-full max-w-none object-contain [transform-style:preserve-3d]",
      className
    )}
    {...props}
  />
);

const SmolXDarkbright = () => {
  const [shakeCount, setShakeCount] = useState(0);
  const [scope, _animate] = useAnimate();
  // fast shaking and gradually slow down
  const x = useSpring(0, {
    stiffness: 5000,
    damping: 500,
    mass: 12
  });
  const z = useMotionValue(10);

  useEffect(() => {
    animate(
      x,
      [shakeCount * 50, shakeCount * -50, shakeCount * 70, shakeCount * -70, 0],
      {
        duration: 0.3
      }
    );
  }, [shakeCount, x]);

  useEffect(() => {
    if (shakeCount !== 3) return;
    let delayForSecondAnimation = -0.75;

    animate(z, 0, {
      delay: 0.55
    });

    (async () => {
      await _animate([
        [
          scope.current,
          { y: ["-100%", "-50%"] },
          { duration: 1, ease: "easeInOut" }
        ],
        [
          scope.current,
          {
            scale: [0.25, 1],
            y: ["-50%", "0%"]
          },
          { duration: 1, ease: "easeInOut", delay: delayForSecondAnimation }
        ]
      ]);
    })();
  }, [_animate, scope, shakeCount, z]);

  return (
    <section className="relative bg-[url(/img/pattern.png)] bg-cover bg-no-repeat">
      <motion.button
        style={{ x, zIndex: z }}
        onClick={() => {
          if (shakeCount < 3) setShakeCount(shakeCount + 1);
        }}
        className="absolute -inset-x-12 inset-y-0 bg-troll/95 [mask-composite:exclude] [mask-image:url(/img/crack.png),linear-gradient(#fff_0_0)] [mask-position:50%_25%] [mask-repeat:no-repeat]"
      >
        <span className="sr-only">Toggle shake animation</span>
      </motion.button>
      <motion.img
        style={{
          x: "-50%",
          y: "-100%",
          scale: 0.25
        }}
        src={SmolBrainsTextImg}
        ref={scope}
        className="absolute left-1/2 top-1/2 h-48"
        alt=""
      />
      <div className="pointer-events-none relative z-30">
        <div>test</div>
        <div>test</div>

        <div>test</div>

        <div>test</div>

        <div>test</div>

        <div>test</div>
        <div>test</div>

        <div>test</div>

        <div>test</div>

        <div>test</div>

        <div>test</div>
        <div>test</div>
        <div>test</div>

        <div>test</div>

        <div>test</div>

        <div>test</div>

        <div>test</div>
        <div>test</div>

        <div>test</div>

        <div>test</div>

        <div>test</div>

        <div>test</div>
      </div>
    </section>
  );
};

export default function About() {
  return (
    <AnimationContainer className="flex flex-col overflow-x-hidden">
      <Header name="about" />
      <section className="relative bg-[radial-gradient(rgba(114,55,227,0.00)_0%,#5B26C1_100%)]">
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 grid-rows-1 place-items-center gap-y-16 py-32 lg:grid-cols-12 lg:gap-y-20">
          <div className="relative lg:col-span-5">
            <p className="absolute -top-7 z-20 -rotate-6 rounded-3xl bg-pepe px-4 pb-2.5 pt-2 font-black font-formula text-base leading-none capsize">
              THE DAILY
            </p>
            <img
              src={NewspaperImg}
              className="absolute -top-14 left-14 z-10 h-24 w-24"
              alt="newspaper"
            />
            <p className="relative text-white font-sans text-[28rem] leading-none capsize">
              SMOL
            </p>
          </div>
          <div className="relative w-full lg:col-span-7">
            <div className="mx-auto grid h-96 w-2/3 place-content-center border border-pepe">
              <span className="tracking-wide text-white text-6xl">
                Placeholder
              </span>
            </div>
            <AnimatedSticker />
          </div>
        </div>
      </section>
      <section className="relative bg-pepe py-4">
        <div className="relative flex">
          <div className="animate-marquee flex w-full">
            <p className="font-medium font-formula text-base leading-none capsize">
              NEWS ALERT! THE DAILY SMOLS HAVE BEEN HACKED BY UNKNOWN GROUP.
            </p>
          </div>
          <div className="animate-marquee2 absolute top-0 ml-4 flex w-full">
            <p className="font-medium font-formula text-base leading-none capsize">
              NEWS ALERT! THE DAILY SMOLS HAVE BEEN HACKED BY UNKNOWN GROUP.
            </p>
          </div>
        </div>
      </section>
      <Documents />
      <SmolXDarkbright />
    </AnimationContainer>
  );
}
