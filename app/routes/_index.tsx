import type { LinksFunction, MetaFunction } from "@remix-run/node";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "~/utils";
import { Box } from "~/components/Box";
import Weather from "../assets/apps/Weather.webp";
import Gallery from "../assets/apps/Gallery.webp";
import Goals from "../assets/apps/Goals.mp4";
import News from "../assets/apps/News.webp";
import Tv from "../assets/apps/TV.webp";
import Fashion from "../assets/apps/Fashion.webp";
import Reactor from "../assets/apps/reactor.gif";
import Games from "../assets/apps/Games.mp4";
import Gym from "../assets/apps/Gym.webp";
import School from "../assets/apps/School.webp";

import {
  AnimatePresence,
  HTMLMotionProps,
  animate,
  motion,
  stagger,
  useAnimate,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform
} from "framer-motion";
import { useEasterEgg } from "~/contexts/easteregg";
import SmolMusicVideo from "~/assets/smol-musicvideo.mp4";
import { useIdleTimer } from "react-idle-timer";
import { tinykeys } from "tinykeys";
import useStore from "~/store";
import ErrorMp3 from "~/assets/error.mp3";

import Peek from "~/assets/peek.gif";
import Peek2 from "~/assets/peek2.gif";
import Peek3 from "~/assets/peek3.gif";
import Peek4 from "~/assets/peek4.gif";
import Peek5 from "~/assets/peek5.gif";
import Meem from "~/assets/meem.webp";

import { useChat, Message } from "~/components/Chat";
import { commonMeta } from "~/seo";
import LofiMp3 from "~/assets/lofi.mp3";
import { useDrag } from "@use-gesture/react";
import { Icon } from "~/components/Icons";
import { Link } from "@remix-run/react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { SOCIALS } from "~/const";

export const meta = commonMeta;

const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: SmolMusicVideo,
    as: "video",
    type: "video/mp4"
  },
  {
    rel: "preload",
    href: Goals,
    as: "video",
    type: "video/mp4"
  },
  {
    rel: "preload",
    href: Games,
    as: "video",
    type: "video/mp4"
  },
  {
    rel: "preload",
    href: LofiMp3,
    as: "audio",
    type: "aduio/mpeg"
  },
  {
    rel: "preload",
    href: ErrorMp3,
    as: "audio",
    type: "aduio/mpeg"
  }
];

export function MessageRenderer({
  message,
  reducer,
  ...props
}: {
  message: Message;
  reducer: ReturnType<typeof useChat>;
} & HTMLMotionProps<"span">) {
  const count = useMotionValue(0);
  const { by, options, type, custom } = message;
  const [state, dispatch] = reducer;
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    message.message.slice(0, latest)
  );
  const countDivRef = React.useRef<HTMLDivElement | null>(null);
  const [scope, listAnimate] = useAnimate();
  useEffect(() => {
    let id: NodeJS.Timeout;

    const objDiv = document.getElementById("scroller");
    const animateTextAndScroller = async () => {
      // always scroll to bottom on update
      id = setInterval(() => {
        if (objDiv) {
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      }, 100);

      await animate(count, message.message.length, {
        type: "tween",
        // slow down duration based on message length
        duration: message.message.length * 0.04,
        ease: "linear"
      });

      if (countDivRef.current) {
        await animate(
          countDivRef.current,
          {
            display: "block",
            opacity: [0, 1]
          },
          {
            duration: 0.5
          }
        );
      }

      if (options) {
        await listAnimate(
          "li",
          { display: "list-item", opacity: [0, 1] },
          {
            duration: 0.5,
            delay: staggerMenuItems
          }
        );
      }

      clearInterval(id);
    };

    if (by === "bot") {
      animateTextAndScroller();
    } else {
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    }

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div ref={scope}>
      <motion.span className="whitespace-pre-line" {...props}>
        {by === "bot" ? displayText : message.message}
      </motion.span>
      {custom && (
        <div className="mt-2 hidden" ref={countDivRef}>
          {custom}
        </div>
      )}
      {options && (
        <ul
          className={cn(
            "space-y-1.5",
            state.messages[state.messages.length - 1].timestamp ===
              message.timestamp
              ? "block"
              : "hidden"
          )}
        >
          {Object.values(options).map((option) => {
            return (
              <li
                key={option}
                className="relative hidden cursor-pointer rounded-md border border-gray-200 px-3 py-2 transition-colors first:mt-2 hover:bg-dream hover:text-neonPink"
              >
                {option}
                <button
                  onClick={() => {
                    dispatch({
                      type:
                        type === "initial"
                          ? "SELECT_INITIAL_OPTION"
                          : "OTHER_OPTION",
                      option
                    });
                  }}
                  className="absolute inset-0 h-full w-full"
                >
                  <span className="sr-only">Select {option}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const Chat = () => {
  const reducer = useChat();

  const [state, dispatch] = reducer;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [activate, setActivate] = React.useState<"idle" | "open" | "close">(
    "idle"
  );
  const ref = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (event.target === buttonRef.current) return;

      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActivate("close");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      Escape: () => {
        setActivate("close");
      }
    });
    return () => {
      unsubscribe();
    };
  });

  useEffect(() => {
    if (activate === "close") {
      dispatch({
        type: "RESET"
      });
    } else if (activate === "open") {
      dispatch({
        type: "GREET"
      });
    }
  }, [activate]);

  const renderInput =
    state.state === "FUD_SUBMITTING" || state.state === "OTHER_ISSUES";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative [perspective:1000px]">
        <img
          src={Meem}
          className="relative z-10 h-8 w-8 -scale-x-100 [mask-image:linear-gradient(black_90%,transparent_100%)] sm:bottom-4 sm:right-1 sm:h-24 sm:w-24"
          alt="mEEm"
        />
        <div className="absolute -bottom-6 -right-2 h-12 w-12 select-none rounded-full bg-black/90 [transform:rotateX(75deg)] sm:-bottom-10 sm:h-28 sm:w-28"></div>
        <button
          ref={buttonRef}
          className="absolute inset-0 z-20 h-full w-full"
          onClick={(e) => {
            setActivate(activate === "open" ? "close" : "open");
          }}
        ></button>
      </div>
      <AnimatePresence>
        {activate === "open" && (
          <motion.div
            initial={{
              opacity: 0,
              transform: "scale(0)"
            }}
            animate={{
              opacity: 1,
              transform: "scale(1)"
            }}
            exit={{
              opacity: 0,
              transform: "scale(0)"
            }}
            ref={ref}
            className="absolute bottom-0 right-12 w-[calc(100vw-92px)] origin-bottom-right overflow-hidden rounded-[28px] bg-gradient-to-br from-troll to-acid p-4 shadow-[0_4px_12px_rgba(31,33,36,0.2),0_2px_6px_rgba(31,33,36,0.05)] sm:right-28 sm:w-[520px]"
          >
            <div className="flex h-[calc(100vh-160px)] flex-col">
              <div
                className={cn(
                  "flex-1 overflow-y-scroll",
                  renderInput ? "pb-8" : "pb-0"
                )}
                id="scroller"
              >
                {state.messages.map((message) => {
                  const fromBot = message.by === "bot";
                  const key = `${message.message}-${message.timestamp}-${message.by}`;
                  if (fromBot) {
                    return (
                      <div className="[overflow-anchor:none]" key={key}>
                        <div className="mb-4 flex">
                          <span className="mr-2 mt-0.5 h-7 w-7 rounded-full bg-gradient-to-r from-neonPink to-vroom p-1.5">
                            <svg
                              viewBox="2 2 23 23"
                              className="h-5 w-5 fill-white"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.702 4.253a.625.625 0 0 1 1.096 0l.196.358c.207.378.517.688.895.895l.358.196a.625.625 0 0 1 0 1.097l-.358.196a2.25 2.25 0 0 0-.895.894l-.196.359a.625.625 0 0 1-1.096 0l-.196-.359a2.25 2.25 0 0 0-.895-.894l-.358-.196a.625.625 0 0 1 0-1.097l.358-.196a2.25 2.25 0 0 0 .895-.895l.196-.358Z"
                                fill="#00000"
                              ></path>
                              <path
                                fillRule="evenodd"
                                d="M12.948 7.89c-.18-1.167-1.852-1.19-2.064-.029l-.03.164a3.756 3.756 0 0 1-3.088 3.031c-1.15.189-1.173 1.833-.03 2.054l.105.02a3.824 3.824 0 0 1 3.029 3.029l.032.165c.233 1.208 1.963 1.208 2.196 0l.025-.129a3.836 3.836 0 0 1 3.077-3.045c1.184-.216 1.12-1.928-.071-2.107a3.789 3.789 0 0 1-3.18-3.154Zm-.944 6.887a5.34 5.34 0 0 1 2.542-2.647 5.305 5.305 0 0 1-2.628-2.548 5.262 5.262 0 0 1-2.488 2.508 5.329 5.329 0 0 1 2.574 2.687Z"
                                fill="#00000"
                              ></path>
                            </svg>
                          </span>
                          <div className="mr-12">
                            <div className="shrink overflow-hidden rounded-[12px] border border-solid border-[#EEEFF0] bg-white px-3 py-2 text-[#1F2124] shadow-sm font-mono text-xs">
                              <MessageRenderer
                                message={message}
                                reducer={reducer}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="[overflow-anchor:none]" key={key}>
                      <div className="mb-4 ml-16 flex flex-row-reverse">
                        <div className="flex flex-col gap-1 rounded-[12px] bg-[#393342] px-3 py-2 text-white font-mono text-xs leading-5">
                          <MessageRenderer
                            message={message}
                            reducer={reducer}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {renderInput && (
                <div className="box-border flex w-full items-center justify-between rounded-xl border border-solid border-[#E1E3E5] bg-white pl-5 transition-all duration-300 ease-in-out font-mono focus-within:drop-shadow-lg">
                  <form
                    className="flex w-full justify-between"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const currentTarget = e
                        .currentTarget[0] as HTMLInputElement;

                      dispatch({
                        type: "INSERT_COMMENT",
                        message: currentTarget.value
                      });
                      // clear input
                      currentTarget.value = "";
                    }}
                  >
                    <input
                      placeholder="Ask assistant anything..."
                      ref={inputRef}
                      className="h-12 grow resize-none overflow-auto bg-transparent py-4 pr-3 outline-none text-xs leading-4 sm:text-sm"
                    ></input>
                    <button type="submit" className="mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        className="transition-all duration-300 ease-in-out hover:fill-[#393342]"
                      >
                        <path
                          className="fill-[#CCCCCC] transition-all duration-300 ease-in-out"
                          d="M1.0615 0.64157C1.30468 0.466297 1.62886 0.452657 1.8859 0.606882L13.1359 7.35688C13.3618 7.49242 13.5 7.73655 13.5 8C13.5 8.26345 13.3618 8.50758 13.1359 8.64312L1.8859 15.3931C1.62886 15.5473 1.30468 15.5337 1.0615 15.3584C0.818323 15.1832 0.702866 14.8799 0.767893 14.5873L2.06507 8.75L6 8.75C6.41421 8.75 6.75 8.41421 6.75 8C6.75 7.58579 6.41421 7.25 6 7.25L2.06507 7.25L0.767893 1.4127C0.702866 1.12008 0.818323 0.816842 1.0615 0.64157Z"
                        ></path>
                      </svg>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Music = () => {
  const [mute, setMute] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio(LofiMp3);
    audioRef.current.loop = true;
    audioRef.current.play();

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    audioRef.current!.muted = mute;
  }, [mute]);

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-slate-100/10 px-3 py-2 backdrop-blur-lg">
      <div className="flex flex-col pr-12">
        <p className="text-white text-xs">Pink Hat Posse</p>
        <p className="text-grayOne text-xs">Smol Funk</p>
      </div>
      <div className="grid h-full grid-cols-11 justify-center gap-[2px] bg-transparent">
        {[...Array(11)].map((_, i) => (
          <motion.div
            animate={{
              height: !mute
                ? [
                    20 % (i + 1),
                    Math.floor(Math.random() * 20),
                    Math.floor(Math.random() * 20),
                    Math.floor(Math.random() * 20),
                    Math.floor(Math.random() * 20),
                    Math.floor(Math.random() * 20),
                    20 % (i + 1)
                  ]
                : 1
            }}
            transition={
              !mute
                ? {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                : {}
            }
            key={i}
            className="col-span-1 mx-auto my-auto h-6 w-[1.25px] scale-125 rounded-full bg-gradient-to-t from-troll to-neonRed"
          ></motion.div>
        ))}
        <button
          onClick={() => setMute(!mute)}
          className="absolute inset-0 h-full w-full"
        >
          <span className="sr-only">{mute ? "unmute" : "mute"}</span>
        </button>
      </div>
    </div>
  );
};

export default function Index() {
  const introRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);

  const showIntro = useStore((state) => state.showIntro);
  const setShowIntro = useStore((state) => state.setShowIntro);
  const y = useSpring(0, {
    stiffness: 5000,
    damping: 200
  });
  const yTransform = useMotionTemplate`translate(0, ${y}px)`;

  const [scope, _animate] = useAnimate();
  const { konamiActivated, lofiActivated } = useEasterEgg();
  const [state, setState] = useState<"idle" | "active">("active");
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  useIdleTimer({
    onIdle: () => setState("idle"),
    onActive: () => setState("active"),
    timeout: 5000,
    throttle: 500
  });

  useMotionValueEvent(y, "change", (y) => {
    if (!introRef.current) return;

    // if we're at the top, unmount the intro
    if (Math.abs(y) === introRef.current.getBoundingClientRect().height) {
      setShowIntro(false);
    }
  });

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      ArrowUp: () => {
        if (!introRef.current) return;
        y.set(-introRef.current?.getBoundingClientRect().height);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useDrag(
    ({ down, movement: [, my] }) => {
      if (my > 0 || !introRef.current) return;

      const isAboveCenter =
        my + introRef.current?.getBoundingClientRect().height / 8 < 0;

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
        capture: false
      }
    }
  );

  React.useEffect(() => {
    const animation = _animate(
      ":scope>.box",
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

    if (!konamiActivated) {
      animation.cancel();
    }

    return () => animation.cancel();
  }, [_animate, konamiActivated]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!konamiActivated) {
      video.pause();
      video.currentTime = 0;
    } else {
      video.play();
    }
  }, [konamiActivated]);

  return (
    <>
      <AnimatePresence>
        {konamiActivated && (
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

      <div className="relative mx-auto flex h-full max-w-7xl flex-col">
        <motion.div
          animate={{
            opacity: lofiActivated ? 0 : 1
          }}
          className={cn(
            "grid flex-1 place-items-center px-24 sm:px-12",
            lofiActivated && "pointer-events-none"
          )}
        >
          <Dialog>
            <div
              ref={scope}
              className="grid grid-cols-2 gap-6 [grid-auto-rows:1fr] sm:grid-cols-5 sm:grid-rows-2 sm:gap-8 sm:[grid-auto-rows:20%]"
            >
              <Box name="news" as="link" to="/news" className="relative">
                <img
                  src={News}
                  alt="News"
                  className="aspect-square h-full w-full"
                ></img>
                <AnimatePresence>
                  {state === "idle" && (
                    <motion.img
                      initial={{
                        opacity: 0
                      }}
                      animate={{
                        opacity: 1
                      }}
                      exit={{
                        opacity: 0
                      }}
                      src={Peek}
                      className="absolute bottom-full left-1/2 z-10 h-8 w-8 -translate-x-1/2 sm:h-24 sm:w-24"
                      alt="peek smol"
                    />
                  )}
                </AnimatePresence>
              </Box>
              <Box name="gallery" as="link" to="/gallery">
                <img
                  src={Gallery}
                  alt="gallery"
                  className="aspect-square h-full w-full"
                ></img>
              </Box>
              <Box name="weather" as="link" to="/weather">
                <img
                  src={Weather}
                  alt="art"
                  className="aspect-square h-full w-full"
                ></img>
              </Box>
              <Box
                name="goals"
                as="link"
                to="/goals"
                className="relative bg-black"
              >
                <div className="relative h-full overflow-hidden">
                  <span className="relative z-10 ml-2 inline-block text-white text-5xl leading-none capsize sm:ml-4 sm:text-[5rem] lg:text-[9.5rem]">
                    GOALS
                  </span>
                  <video
                    preload="auto"
                    playsInline
                    loop
                    muted
                    autoPlay
                    className="absolute -bottom-1/2 -right-[40%] h-[175%] min-w-[175%] -rotate-[30deg] -scale-x-100 object-cover"
                  >
                    <source src={Goals} type="video/mp4" />
                  </video>
                </div>
                <AnimatePresence>
                  {state === "idle" && (
                    <motion.img
                      initial={{
                        opacity: 0
                      }}
                      animate={{
                        opacity: 1
                      }}
                      exit={{
                        opacity: 0
                      }}
                      src={Peek4}
                      className="absolute left-1/2 top-full z-10 h-8 w-8 -translate-x-1/2 -rotate-180 sm:h-24 sm:w-24"
                      alt="peek smol"
                    />
                  )}
                </AnimatePresence>
              </Box>
              <DialogTrigger asChild>
                <Box
                  name="spotlight"
                  as="button"
                  isLoading
                  className="relative bg-white/10"
                >
                  <video
                    preload="auto"
                    playsInline
                    loop
                    muted
                    autoPlay
                    className="aspect-square h-full w-full"
                  >
                    <source src={Games} type="video/mp4" />
                  </video>

                  <AnimatePresence>
                    {state === "idle" && (
                      <motion.img
                        initial={{
                          opacity: 0
                        }}
                        animate={{
                          opacity: 1
                        }}
                        exit={{
                          opacity: 0
                        }}
                        src={Peek5}
                        className="absolute bottom-full right-8 z-10 h-8 w-8 sm:right-24 sm:h-24 sm:w-24"
                        alt="peek smol"
                      />
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {state === "idle" && (
                      <motion.img
                        initial={{
                          opacity: 0
                        }}
                        animate={{
                          opacity: 1
                        }}
                        exit={{
                          opacity: 0
                        }}
                        src={Peek2}
                        className="absolute bottom-12 left-full z-10 h-8 w-8 rotate-90 sm:h-24 sm:w-24"
                        alt="peek smol"
                      />
                    )}
                  </AnimatePresence>
                </Box>
              </DialogTrigger>
              <Box
                name="fashion"
                as="a"
                href="https://shop.smolverse.lol/"
                className="relative"
              >
                <img
                  src={Fashion}
                  alt="fashion"
                  className="aspect-square h-full w-full"
                ></img>
                <AnimatePresence>
                  {state === "idle" && (
                    <motion.img
                      initial={{
                        opacity: 0
                      }}
                      animate={{
                        opacity: 1
                      }}
                      exit={{
                        opacity: 0
                      }}
                      src={Peek3}
                      className="absolute bottom-4 right-full z-10 h-8 w-8 -rotate-90 sm:h-24 sm:w-24"
                      alt="peek smol"
                    />
                  )}
                </AnimatePresence>
              </Box>
              <Box name="tv" as="link" to="/tv">
                <img
                  src={Tv}
                  alt="tv"
                  className="aspect-square h-full w-full"
                ></img>
              </Box>
              <Box name="school" as="link" to="/school">
                <img
                  src={School}
                  alt="school"
                  className="aspect-square h-full w-full"
                ></img>
              </Box>
              <Box name="gym" as="link" to="/gym">
                <img
                  src={Gym}
                  alt="gym"
                  className="aspect-square h-full w-full"
                ></img>
              </Box>
              <Box name="rainbow" as="link" to="/reactor">
                <div className="relative h-full overflow-hidden bg-rage">
                  <span className="relative z-10 ml-2 inline-block text-white text-5xl leading-none capsize sm:ml-4 sm:text-[6rem] lg:text-[7.5rem]">
                    REACTOR
                  </span>
                  <img
                    src={Reactor}
                    className="absolute bottom-0 w-full object-cover"
                  />
                </div>
              </Box>
            </div>
            <DialogContent className="border-none p-0 font-mono sm:rounded-none">
              <ErrorDialog />
            </DialogContent>
          </Dialog>
          <Chat />
        </motion.div>

        <motion.div
          animate={{
            opacity: lofiActivated ? 0 : 1
          }}
          className={cn(
            "z-10 mx-auto flex h-12 justify-center space-x-8 sm:absolute sm:bottom-12 sm:left-1/2 sm:-translate-x-1/2 sm:space-x-12",
            lofiActivated && "pointer-events-none"
          )}
        >
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Icon
                name={social.name}
                className="h-7 w-7 text-intro transition-transform group-hover:scale-110 sm:h-12 sm:w-12"
              />
            </a>
          ))}
        </motion.div>
      </div>
      <AnimatePresence>
        {lofiActivated && (
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="fixed bottom-4 right-4 font-mono"
          >
            <Music />
          </motion.div>
        )}
      </AnimatePresence>
      {showIntro && (
        <motion.div
          style={{
            transform: yTransform
          }}
          ref={introRef}
          className="absolute inset-0 z-50 h-[100dvh] w-full touch-pan-x bg-intro/90 backdrop-blur-md"
        >
          <div className="mx-auto grid h-full max-w-7xl items-center justify-center py-12">
            <p className="relative text-white">
              <span className="absolute -top-12 rotate-[355deg] select-none text-pepe font-oakley text-2xl sm:text-3xl">
                WELCOME BACK
              </span>
              <span className="select-none font-sans text-[20rem] leading-none capsize sm:text-[32rem]">
                SMOL
              </span>
            </p>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <Icon
                name="chevron-up"
                className="mx-auto h-6 w-6 select-none text-white/80 sm:h-8 sm:w-8"
              />
              <div className="mx-auto w-max select-none font-bold tracking-wide text-white/80 font-formula text-xs sm:text-lg">
                SWIPE UP / ↑ KEY TO UNLOCK
              </div>
              <motion.div
                ref={dragRef}
                initial={{
                  y: "50%"
                }}
                animate={{
                  y: ["10%", "0%"]
                }}
                transition={{
                  y: {
                    duration: 1.5,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
                className={cn(
                  "flex h-12 touch-none select-none items-center px-4"
                )}
              >
                <div className="h-2.5 w-40 rounded-xl bg-gray-400/80 sm:h-4 sm:w-64"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

const ErrorDialog = () => {
  const [troll, setTroll] = useState(false);
  useEffect(() => {
    const audio = new Audio(ErrorMp3);
    audio.play();

    return () => audio.pause();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
            <Icon name="x" className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg">Error</h1>
        </div>
        <DialogClose asChild>
          <button className="text-gray-500 focus:outline-none">
            <Icon name="x" className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
      </div>
      <div className="flex p-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
          <Icon name="x" className="h-8 w-8 text-white" />
        </div>
        <p className="ml-4 text-sm">
          Uh oh! It looks like you fat fingered the keyboard. Which app did you
          want to open?
        </p>
      </div>
      <div className="flex justify-around bg-grayTwo p-5">
        <Link
          to="/weather"
          className="inline-flex w-44 justify-center border-2 border-black px-4 py-2 focus:outline-none"
        >
          WEATHER
        </Link>
        <Link
          to="/weather"
          onMouseEnter={() => {
            setTroll(true);
          }}
          onMouseLeave={() => {
            setTroll(false);
          }}
          className="inline-flex w-44 justify-center border-2 border-black px-4 py-2 focus:outline-none"
        >
          {troll ? "WEATHER" : "SMOLVILLE GAME"}
        </Link>
      </div>
    </>
  );
};
