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
import Tag from "./assets/Tag.png";

import peeImg from "~/assets/pee.png";

import TwerkSmol from "./assets/twerkSmol.png";

import { DraggableWindow } from "~/components/DraggableWindow";
import { useResponsive } from "~/res-context";

const navigation = {
  collections: [
    { name: "Smol Brains", href: "#" },
    { name: "Smol Bodies", href: "#" },
    { name: "Smol Jrs", href: "#" }
  ],
  siteMap: [
    { name: "Store", href: "#" },
    { name: "Buy", href: "#" },
    { name: "Merch", href: "#" }
  ],
  about: [
    { name: "History", href: "#" },
    { name: "Team", href: "#" },
    { name: "Docs", href: "#" }
  ]

  // social: [
  //   {
  //     name: "Facebook",
  //     href: "#",
  //     icon: (props) => (
  //       <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
  //         <path
  //           fillRule="evenodd"
  //           d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
  //           clipRule="evenodd"
  //         />
  //       </svg>
  //     )
  //   },
  //   {
  //     name: "Instagram",
  //     href: "#",
  //     icon: (props) => (
  //       <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
  //         <path
  //           fillRule="evenodd"
  //           d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
  //           clipRule="evenodd"
  //         />
  //       </svg>
  //     )
  //   },
  //   {
  //     name: "Twitter",
  //     href: "#",
  //     icon: (props) => (
  //       <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
  //         <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  //       </svg>
  //     )
  //   },
  //   {
  //     name: "GitHub",
  //     href: "#",
  //     icon: (props) => (
  //       <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
  //         <path
  //           fillRule="evenodd"
  //           d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
  //           clipRule="evenodd"
  //         />
  //       </svg>
  //     )
  //   },
  //   {
  //     name: "YouTube",
  //     href: "#",
  //     icon: (props) => (
  //       <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
  //         <path
  //           fillRule="evenodd"
  //           d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
  //           clipRule="evenodd"
  //         />
  //       </svg>
  //     )
  //   }
  // ]
};

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

  const { isMobile } = useResponsive();

  return (
    <div className="absolute -bottom-32 -right-12 flex sm:right-0">
      <Icon
        name="tag"
        className="relative z-10 h-24 w-24 translate-x-[85%] translate-y-[120%] sm:h-40 sm:w-40 sm:translate-x-[35%] sm:translate-y-[90%]"
      />
      <motion.div className="relative flex flex-col items-center [perspective:1000px]">
        <motion.div
          animate={
            isAnimating
              ? { transform: "rotateY(360deg)" }
              : { transform: "rotateY(0deg)" }
          }
          transition={{ duration: 2, ease: [0.27, 0.85, 0.32, 1] }}
          className="relative z-10 inline-block [transform-style:preserve-3d]"
        >
          <MotionIcon
            {...animationProps}
            name="smol-smoke"
            className="h-24 w-auto select-none contrast-0 sm:h-auto"
          />
          <MotionIcon
            {...animationProps}
            name="smol-smoke"
            className="absolute inset-0 h-24 w-auto select-none [backface-visibility:hidden] sm:h-auto"
          />
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="absolute inset-0 h-full w-full translate-y-16"
          >
            <span className="sr-only">Toggle spin animation</span>
          </button>
        </motion.div>

        <motion.div
          animate={{
            width: isMobile ? ["10rem", "9rem"] : ["13rem", "12rem"],
            height: isMobile ? ["10rem", "9rem"] : ["13rem", "12rem"]
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="relative select-none rounded-full bg-black/50 [transform:rotateX(75deg)]"
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
            <p className="font-normal text-white font-sans text-7xl leading-none capsize sm:text-9xl">
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
                <Icon name="left-arrow" className="h-6 w-6 sm:h-9 sm:w-9" />
              </button>
              <button
                onClick={() => {
                  parentRef.current?.scroll(activeIndex * 450, 0);
                  setActiveIndex(activeIndex + 1);
                }}
                className="bg-pepe p-2 hover:bg-pepe/90"
              >
                <span className="sr-only">View all documents</span>
                <Icon
                  name="left-arrow"
                  className="h-6 w-6 rotate-180 sm:h-9 sm:w-9"
                />
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
    <div className="w-64 flex-shrink-0 [perspective:1000px] sm:w-96">
      {/* TODO: fix the first one affecting layout when rotating */}
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
            "pointer-events-none absolute right-0 top-0 h-full w-full flex-none select-none",
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
          className="relative h-full w-full flex-none snap-start pl-8 [backface-visibility:hidden]"
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
      [
        scope.current,
        { y: ["-150%", "-110%"], opacity: 1 },
        { duration: 1, ease: "easeInOut" }
      ],
      // [scope.current, { opacity: 1 }, { duration: 0.5 }],
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
      className="relative h-[50rem]"
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
            className="aspect-square h-24 w-24 sm:h-48 sm:w-full"
            alt=""
          />
        </DraggableWindow>
        <DraggableWindow parentRef={parentRef} className="bottom-2 left-2">
          <img
            src={Planet1}
            className="aspect-square h-24 w-24 sm:h-48 sm:w-full"
            alt=""
          />
        </DraggableWindow>
        <DraggableWindow parentRef={parentRef} className="left-24 top-2">
          <img
            src={Planet2}
            className="aspect-square h-24 w-24 sm:h-48 sm:w-full"
            alt=""
          />
        </DraggableWindow>
        <DraggableWindow parentRef={parentRef} className="bottom-16 right-2">
          <img
            src={Planet3}
            className="aspect-square h-24 w-24 sm:h-48 sm:w-full"
            alt=""
          />
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
        {/* TODO: desktop safari has a weird z-index bug. works on mobile though */}
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
        <motion.div
          ref={scope}
          style={{
            x: "-50%",
            y: "-100%",
            scale: 0.25,
            opacity: 0
          }}
          className="absolute left-1/2 top-1/2 z-40 text-center"
        >
          <img src={SmolBrainsTextImg} alt="" className="h-48" />
          <p className="-mt-3 inline-block -rotate-3 rounded-full bg-acid px-3 py-2 font-bold font-formula text-lg leading-none capsize">
            IN COLLABORATION WITH
          </p>
        </motion.div>
        <img
          src={DarkbrightSmol}
          alt="smol"
          className="absolute bottom-12 left-1/2 z-40 h-auto w-24 translate-x-[60%] sm:w-auto"
        />
        <motion.div
          style={{
            maskImage: animatedMaskedImage,
            WebkitMaskImage: animatedMaskedImage
          }}
          className="absolute -bottom-6 left-1/2 z-30 h-36 w-36 select-none rounded-full bg-black/50 [transform:translate(20%,0)_rotateX(75deg)] sm:[transform:translate(35%,0)_rotateX(75deg)]"
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
          className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 [mask-image:linear-gradient(black,transparent_80%)] sm:-bottom-6"
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

const WhatTheFuck = () => {
  return (
    <section className="relative">
      <div className="grid grid-cols-1 xl:grid-cols-2">
        <div className="bg-rage py-24">
          <div className="mx-auto flex w-max flex-col space-y-6 pr-20">
            <p className="rotate-3 pl-16 font-bold text-white font-mondwest text-7xl leading-none capsize">
              what the
            </p>
            <p className="relative rotate-3 pl-48 font-bold text-pepe font-mondwest text-7xl leading-none capsize">
              <Icon
                name="fuck"
                className="absolute -bottom-6 left-2 -m-3 h-28 w-48 -rotate-3 bg-[url(/img/Splat.png)] bg-center bg-no-repeat p-3  [background-size:130%]"
              />
              is a
            </p>
            <p className="relative text-pepe font-sans text-[20rem] leading-none capsize">
              <Icon
                name="exclamation-mark"
                className="absolute -right-24 top-12 h-20 w-12"
              />
              <Icon
                name="question-mark"
                className="absolute -right-20 -top-16 w-16"
              />
              <img
                src={TwerkSmol}
                className="absolute -right-24 bottom-0 h-auto w-40"
                alt="smol twerking"
              />
              HUMAN
            </p>
          </div>
        </div>
        <div className="bg-pepe">
          <WhatTheFuckScrollSection />
        </div>
      </div>
    </section>
  );
};

const messages = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
];

const WhatTheFuckScrollSection = () => {
  let [activeIndex, setActiveIndex] = useState(0);
  let slideContainerRef = useRef<HTMLDivElement | null>(null);
  let slideRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let observer = new window.IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (entry.isIntersecting) {
            setActiveIndex(
              slideRefs.current.indexOf(entry.target as HTMLDivElement)
            );
            break;
          }
        }
      },
      {
        root: slideContainerRef.current,
        threshold: 0.6
      }
    );

    for (let slide of slideRefs.current) {
      if (slide) {
        observer.observe(slide);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [slideContainerRef, slideRefs]);
  return (
    <div className="flex h-full flex-col p-16">
      <div
        ref={slideContainerRef}
        className="-mb-4 flex flex-1 snap-x snap-mandatory -space-x-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] sm:-space-x-6 [&::-webkit-scrollbar]:hidden"
      >
        {messages.map((message, messageIndex) => (
          <div
            key={messageIndex}
            ref={(ref) => ref && (slideRefs.current[messageIndex] = ref)}
            className="w-full flex-none snap-center px-4 sm:px-6"
          >
            <p className="font-bold font-mono text-4xl leading-none capsize">
              {message}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="font-lazer text-4xl">
          {activeIndex + 1}/{messages.length}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (activeIndex === 0) return;

              slideRefs.current[activeIndex - 1].scrollIntoView({
                block: "nearest",
                inline: "nearest"
              });
            }}
            className="bg-black p-2"
          >
            <span className="sr-only">go to slide {activeIndex - 1}</span>
            <Icon
              name="left-arrow"
              className="h-6 w-6 text-pepe sm:h-9 sm:w-9"
            />
          </button>
          <button
            onClick={() => {
              const ref = slideRefs.current[activeIndex + 1];

              if (!ref) return;

              ref.scrollIntoView({
                block: "nearest",
                inline: "nearest"
              });
            }}
            className="bg-black p-2"
          >
            <span className="sr-only">go to slide {activeIndex + 1}</span>
            <Icon
              name="left-arrow"
              className="h-6 w-6 rotate-180 text-pepe sm:h-9 sm:w-9"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function About() {
  return (
    <AnimationContainer className="flex flex-col overflow-x-hidden">
      <Header name="about" />
      <section className="relative bg-[radial-gradient(rgba(114,55,227,0.00)_0%,#5B26C1_100%)]">
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 grid-rows-1 place-items-center gap-y-16 py-24 sm:py-32 lg:grid-cols-12 lg:gap-y-20">
          <div className="relative lg:col-span-5">
            <p className="absolute -top-7 z-20 -rotate-6 rounded-3xl bg-pepe px-4 pb-2.5 pt-2 font-black font-formula text-base leading-none capsize">
              THE DAILY
            </p>
            <img
              src={NewspaperImg}
              className="absolute -top-14 left-14 z-10 h-24 w-24"
              alt="newspaper"
            />
            <p className="relative text-white font-sans text-[20rem] leading-none capsize sm:text-[28rem]">
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
            <p className="flex-shrink-0 font-medium font-formula text-sm leading-none capsize sm:text-base">
              NEWS ALERT! THE DAILY SMOLS HAVE BEEN HACKED BY UNKNOWN GROUP.
            </p>
          </div>
          <div className="absolute top-0 ml-48 flex w-full animate-marquee2 sm:ml-4">
            <p className="flex-shrink-0 font-medium font-formula text-sm leading-none capsize sm:text-base">
              NEWS ALERT! THE DAILY SMOLS HAVE BEEN HACKED BY UNKNOWN GROUP.
            </p>
          </div>
        </div>
      </section>
      <Documents />
      <WhatTheFuck />
      <SmolXDarkbright />
      <section className="relative bg-acid/90 bg-[url(/img/green-banner.svg)] bg-cover bg-no-repeat py-4">
        <div className="mx-auto flex w-min items-center space-x-3">
          <p className="font-sans text-7xl leading-none capsize">SMOL</p>
          <Icon name="x" className="h-4 w-4" />
          <Icon name="darkbright" className="h-16 w-16" />
        </div>
      </section>
      <footer
        aria-labelledby="footer-heading"
        className="relative overflow-hidden bg-[linear-gradient(90deg,#7237E3,#1938F2_25%)] px-4 pb-4 pt-8"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        {/* 4 arrows */}
        <div
          className="absolute right-4 top-4 flex space-x-2"
          aria-hidden="true"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Icon
              key={i}
              name="left-arrow"
              className="h-8 w-8 rotate-[225deg]"
            />
          ))}
        </div>
        {/* SMOLSMOL pattern */}
        <div className="absolute inset-x-0 bottom-0 h-10" aria-hidden="true">
          <Icon name="SMOLSMOL" className="h-full w-full" />
        </div>
        <div className="xl:grid xl:grid-cols-6">
          <div className="relative col-span-2">
            <p className="text-acid font-sans text-[20rem] leading-none capsize">
              SMOL
            </p>
            <img
              src={peeImg}
              className="absolute -bottom-2 left-24 h-auto w-32"
              alt="smol peeing"
            />
            <img
              src={Tag}
              className="absolute left-36 top-2 h-auto w-32"
              alt="smol peeing"
            />
            <Icon
              name="splash"
              className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 text-acid"
            />
          </div>
          <div className="col-span-4 mt-16 self-end justify-self-end md:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-8">
              <div>
                <h3 className="font-semibold text-white font-formula text-xl leading-6 capsize">
                  Collections
                </h3>
                <ul className="mt-4 space-y-3">
                  {navigation.collections.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-white font-formula text-xs leading-6 capsize hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-white font-formula text-xl leading-6 capsize">
                  Site Map
                </h3>
                <ul className="mt-4 space-y-3">
                  {navigation.siteMap.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-white font-formula text-xs leading-6 capsize hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-white font-formula text-xl leading-6 capsize">
                  About
                </h3>
                <ul className="mt-4 space-y-3">
                  {navigation.about.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-white font-formula text-xs leading-6 capsize hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-center justify-between bg-acid p-4">
          <p className="mt-0 font-bold font-mono text-base leading-5 capsize md:text-2xl">
            SMOL © 2021-2023 Treasure
          </p>
          <div className="flex space-x-6">
            <a href="#">
              <p className="font-bold font-mono text-base leading-5 capsize md:text-2xl">
                Terms of Service
              </p>
            </a>
            <a href="#">
              <p className="font-bold font-mono text-base leading-5 capsize md:text-2xl">
                Privacy Policy
              </p>
            </a>
          </div>
        </div>
      </footer>
    </AnimationContainer>
  );
}
