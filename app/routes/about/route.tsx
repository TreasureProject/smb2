import {
  motion,
  useAnimate,
  useMotionTemplate,
  animate,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useTransform
} from "framer-motion";
import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimationContainer } from "~/components/AnimationContainer";
import { Header } from "~/components/Header";
import { MotionIcon, Icon } from "~/components/Icons";
import NewspaperImg from "./assets/newspaper.png";
import HammerImg from "./assets/hammer.png";
import GameCoverBgImg from "./assets/graphic.png";
import SmolBrainsTextImg from "./assets/Text.png";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "atropos/atropos.min.css";
import Atropos from "atropos/react";
import { cn } from "~/utils";

// Smol Document Assets
import SmolBgImg from "./assets/smol-brain/BG.png";
import EEEImg from "./assets/smol-brain/EEE.png";
import LogoImg from "./assets/smol-brain/Logo.png";
import SmolImg from "./assets/smol-brain/Smol.png";
import TreasureTagImg from "./assets/smol-brain/TreasureTag.png";

import Meme1 from "./assets/meme1.avif";
import Meme1Fallback from "./assets/meme1.png";
import Planet1 from "./assets/Planet_1.png";
import Planet2 from "./assets/Planet_2.png";
import Planet3 from "./assets/Planet_3.png";
import DarkBrightDesktop from "./assets/Desktop.png";
import Wire from "./assets/Wire.png";
import Vector from "./assets/Vector.png";
import Shadow from "./assets/Shadow.png";
import DarkbrightSmol from "./assets/Smol.png";

import { DraggableWindow } from "~/components/DraggableWindow";

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

const useIsSafari = () => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
    setIsSafari(isSafariBrowser);
  }, []);

  return isSafari;
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
            alt="game cover"
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
  const parentRef = useRef<HTMLDivElement | null>(null);
  const x = useSpring(0, {
    stiffness: 5000,
    damping: 500,
    mass: 12
  });
  const z = useMotionValue(10);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [leave, setLeave] = useState(true);
  const [unplug, setUnplug] = useState(false);

  // need this because safari doesn't support animated avif
  const isSafari = useIsSafari();

  const grayscale = useSpring(0, {
    stiffness: 20,
    damping: 20
  });

  const maskedPercent = useTransform(() => 100 - grayscale.get());

  const animatedMaskedImage = useMotionTemplate`linear-gradient(black, transparent ${maskedPercent}%)`;
  const animatedFilter = useMotionTemplate`grayscale(${grayscale}%)`;

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
      delay: 0.3
    });

    _animate([
      [scope.current, { opacity: 1 }],
      [
        scope.current,
        { y: ["-150%", "-110%"] },
        { duration: 1, ease: "easeInOut" }
      ],
      [
        scope.current,
        {
          scale: [0.25, 1],
          y: ["-110%", "-60%"]
        },
        { duration: 1, ease: "easeInOut", delay: delayForSecondAnimation }
      ]
    ]);
  }, [_animate, scope, shakeCount, z]);

  return (
    <section
      ref={parentRef}
      style={
        {
          "--mask-image-url": `url(/img/crack${shakeCount}.svg)`
        } as CSSProperties
      }
      className="relative min-h-[50rem] overflow-hidden"
      onMouseMove={({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left - 40);
        mouseY.set(clientY - top - 40);
      }}
      onMouseEnter={() => setLeave(false)}
      onMouseLeave={() => {
        setLeave(true);
      }}
    >
      <motion.div
        style={{
          filter: animatedFilter
        }}
        className="h-full bg-[url(/img/pattern.png)] bg-cover bg-no-repeat"
      >
        <DraggableWindow parentRef={parentRef} className="right-24 top-2">
          <img
            src={isSafari ? Meme1Fallback : Meme1}
            className="aspect-square h-48 w-full"
            alt=""
          />
        </DraggableWindow>
        <DraggableWindow parentRef={parentRef} className="bottom-2 left-2">
          <img src={Planet1} className="aspect-square h-48 w-full" alt="" />
        </DraggableWindow>
        <DraggableWindow parentRef={parentRef} className="left-24 top-2">
          <img src={Planet2} className="aspect-square h-48 w-full" alt="" />
        </DraggableWindow>
        <DraggableWindow parentRef={parentRef} className="bottom-16 right-2">
          <img src={Planet3} className="aspect-square h-48 w-full" alt="" />
        </DraggableWindow>
        <AnimatePresence>
          {shakeCount !== 3 && !leave ? (
            <motion.img
              transition={{
                type: "spring",
                mass: 0.6,
                duration: 1
              }}
              initial={{
                scale: 1
              }}
              style={{
                x: mouseX,
                y: mouseY,
                position: "absolute",
                pointerEvents: "none",
                zIndex: 9999
              }}
              animate={{
                rotate: [0, 50],
                transition: {
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeOut"
                }
              }}
              exit={{
                opacity: 0,
                scale: 0
              }}
              src={HammerImg}
              alt="hammer"
              className="aspect-square h-auto w-12"
            />
          ) : null}
        </AnimatePresence>
        <motion.button
          style={{
            x,
            zIndex: z
          }}
          onClick={() => {
            if (shakeCount < 3) setShakeCount(shakeCount + 1);
          }}
          className="absolute -inset-x-12 inset-y-0 bg-troll/95 [mask-composite:exclude] [mask-image:var(--mask-image-url),linear-gradient(#fff_0_0)] [mask-position:50%_30%] [mask-repeat:no-repeat]"
        >
          <span className="sr-only">Toggle shake animation</span>
        </motion.button>
        <motion.img
          style={{
            x: "-50%",
            y: "-100%",
            scale: 0.25,
            opacity: 0
          }}
          src={SmolBrainsTextImg}
          ref={scope}
          className="absolute left-1/2 top-1/2 h-48"
          alt=""
        />
        <img
          src={DarkbrightSmol}
          alt="smol"
          className="absolute bottom-12 left-1/2 z-40 translate-x-[60%]"
        />
        <motion.div
          style={{
            maskImage: animatedMaskedImage,
            WebkitMaskImage: animatedMaskedImage
          }}
          className="absolute -bottom-6 left-1/2 z-30 h-36 w-36 select-none rounded-full bg-black/50 [transform:translate(35%,0)_rotateX(75deg)]"
        />
        <img
          src={Vector}
          aria-hidden="true"
          alt="paint splatter"
          className="absolute left-1/2 top-1/2 h-72 -translate-x-1/2 -translate-y-[60%]"
        />

        {/* neon pink light */}
        <div className="absolute bottom-16 left-1/2 z-20 h-80 w-80 -translate-x-1/2 bg-neonPink [mask-composite:exclude] [-webkit-mask-composite:destination-out] [mask-image:radial-gradient(transparent_10%,#000_70%),linear-gradient(#fff_0_0)]" />

        <img
          src={DarkBrightDesktop}
          alt="darkbright desktop"
          className="absolute bottom-20 left-1/2 z-30 -translate-x-1/2"
        />
        <motion.img
          style={{
            maskImage: animatedMaskedImage,
            WebkitMaskImage: animatedMaskedImage
          }}
          src={Shadow}
          className="absolute -bottom-6 
          left-1/2
          z-30 -translate-x-1/2 [mask-image:linear-gradient(black,transparent_80%)]"
          alt="Shadow"
        />
        <motion.div
          initial={false}
          animate={{
            bottom: "-3.5rem",
            x: "-80%",
            y: unplug ? "2.5rem" : "0rem"
          }}
          className="absolute left-1/2 z-30 -translate-x-1/2"
        >
          <img src={Wire} alt="wire" />
          <button
            className="absolute inset-0 h-full w-full"
            onClick={() =>
              setUnplug((u) => {
                if (u) {
                  grayscale.set(0);
                } else {
                  grayscale.set(100);
                }
                return !u;
              })
            }
          >
            <span className="sr-only">Toggle plug animation</span>
          </button>
        </motion.div>
      </motion.div>
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
          <div className="flex w-full animate-marquee">
            <p className="font-medium font-formula text-base leading-none capsize">
              NEWS ALERT! THE DAILY SMOLS HAVE BEEN HACKED BY UNKNOWN GROUP.
            </p>
          </div>
          <div className="absolute top-0 ml-4 flex w-full animate-marquee2">
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
