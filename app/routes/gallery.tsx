import { useDrag } from "@use-gesture/react";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useSpring,
  useTransform,
  useMotionTemplate,
  useAnimate,
  animate as _animate,
  useIsomorphicLayoutEffect,
  useIsPresent,
  useMotionValueEvent,
} from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { distance } from "@popmotion/popcorn";
import type { TroveSmolToken } from "~/api";
import { fetchSmols } from "~/api";
import { json } from "@remix-run/node";
import { useCustomLoaderData } from "~/hooks/useCustomLoaderData";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { interpolate } from "popmotion";
import { Icon } from "~/components/Icons";
import { AnimationContainer } from "~/components/AnimationContainer";
import { PitchShift, Player, loaded } from "tone";
import { Link } from "@remix-run/react";
import { Header } from "~/components/Header";

const MotionIcon = motion(Icon);
// this is the height for the visible area on line 201, h-96.
const BOX_HEIGHT = 200;

const filterTraits = [
  "Background",
  "Body",
  "Clothes",
  "Glasses",
  "Hat",
  "Naked",
  "Mouth",
  "Gender",
];

export const loader = async () => {
  const res = await fetchSmols();

  return json({
    data: res,
  });
};

type WindowSize = {
  width: number;
  height: number;
};

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    addEventListener("resize", handleSize);
    return () => removeEventListener("resize", handleSize);
  }, []);
  useIsomorphicLayoutEffect(() => {
    handleSize();
  }, []);

  return windowSize;
}

function splitApps(apps: TroveSmolToken[], isMobile: boolean = false) {
  let results = [];
  let isFirst = true;
  const first = isMobile ? 5 : 7;
  const second = isMobile ? 4 : 6;

  for (let i = 0; i < apps.length; ) {
    if (isFirst) {
      results.push(apps.slice(i, i + first));
      i += first;
    } else {
      results.push(apps.slice(i, i + second));
      i += second;
    }
    isFirst = !isFirst;
  }

  return results;
}

function useCallbackRef<TValue = unknown>(): [
  TValue | null,
  (ref: TValue | null) => void
] {
  return useState<TValue | null>(null);
}

const FiveColumns = ({
  apps,
  width,
  y,
  x,
  parentHeight,
  openModal,
}: {
  apps: TroveSmolToken[];
  width: number;
  y: MotionValue<number>;
  x: MotionValue<number>;
  parentHeight: number;
  openModal: (id: string) => void;
}) => {
  return (
    <div
      style={
        {
          "--size": `${BOX_HEIGHT}px`,
        } as CSSProperties
      }
      className="grid grid-cols-[repeat(4,100px)] grid-rows-[100px] sm:grid-cols-[repeat(6,var(--size))] sm:grid-rows-[var(--size)] place-content-center gap-10 sm:gap-12"
    >
      {apps.map((app) => (
        <Item
          parentHeight={parentHeight}
          x={x}
          key={app.tokenId}
          app={app}
          width={width}
          y={y}
          openModal={openModal}
        />
      ))}
    </div>
  );
};

const SevenColumns = ({
  apps,
  width,
  y,
  x,
  parentHeight,
  openModal,
}: {
  apps: TroveSmolToken[];
  width: number;
  y: MotionValue<number>;
  x: MotionValue<number>;
  parentHeight: number;
  openModal: (id: string) => void;
}) => {
  return (
    <div
      style={
        {
          "--size": `${BOX_HEIGHT}px`,
        } as CSSProperties
      }
      className="grid grid-cols-[repeat(5,100px)] grid-rows-[100px] sm:grid-cols-[repeat(7,var(--size))] sm:grid-rows-[var(--size)] place-content-center gap-10 sm:gap-12"
    >
      {apps.map((app) => (
        <Item
          parentHeight={parentHeight}
          x={x}
          key={app.tokenId}
          app={app}
          width={width}
          y={y}
          openModal={openModal}
        />
      ))}
    </div>
  );
};

const Item = ({
  app,
  width,
  y,
  x,
  parentHeight,
  openModal,
}: {
  app: TroveSmolToken;
  width: number;
  y: MotionValue<number>;
  x: MotionValue<number>;
  parentHeight: number;
  openModal: (id: string) => void;
}) => {
  const [ref, attachRef] = useCallbackRef<HTMLDivElement>();

  const d = useTransform(() => {
    const { top } = ref?.getBoundingClientRect() ?? { top: 0 };
    const offsetRelative = parentHeight - top - parentHeight / 2;
    return distance(
      {
        x: (ref?.offsetLeft ?? 0) + x.get() + BOX_HEIGHT / 2,
        y: offsetRelative,
      },
      {
        x: width / 2,
        y: 0,
      }
    );
  });

  const s = useTransform(d, [parentHeight, 0, -parentHeight], [0.3, 1.3, 0.3]);

  const scale = useSpring(s, {
    stiffness: 500,
    damping: 100,
    mass: 0.1,
  });

  useEffect(() => {
    if (ref === null) return;
    const runAnimation = async () => {
      await _animate(
        ref,
        { y: ["99%", "0%"], opacity: [0, 1] },
        {
          duration: 0.5,
          ease: "easeOut",
        }
      );

      _animate(
        ref,
        {
          y: ["0%", "5%", "0%"],
        },
        {
          duration: interpolate([0.5, 0.8, 1.4], [6, 4, 2])(s.get()),
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "reverse",
        }
      );
    };
    runAnimation();
  }, [ref, s]);

  return (
    <motion.div
      style={{
        scale,
      }}
      ref={attachRef}
      className="relative transition-shadow duration-200 ring-4 ring-offset-2 ring-offset-transparent hover:ring-offset-black rounded-full overflow-hidden text-xl hover:ring-white/50 ring-transparent text-white aspect-square"
    >
      <motion.img
        src={app.image.uri}
        className="w-full h-full select-none touch-none [-moz-user-select:none] [-webkit-user-drag:none]"
      />
      <button
        className="absolute inset-0 h-full w-full"
        onClick={() => openModal(app.tokenId)}
      />
    </motion.div>
  );
};

export default function Gallery() {
  const y = useSpring(0, {
    stiffness: 5000,
    damping: 500,
  });
  const x = useSpring(0, {
    stiffness: 5000,
    damping: 500,
  });
  const [scope, animate] = useAnimate();
  const { width: windowWidth } = useWindowSize();

  const isMobile = windowWidth < 640;
  const data = useCustomLoaderData<typeof loader>();
  const [dragRef, attachRef] = useCallbackRef<HTMLDivElement>();
  const [parentRef, attachParentRef] = useCallbackRef<HTMLDivElement>();
  const [openModal, setOpenModal] = useState<{
    isOpen: boolean;
    targetTokenId: string | null;
  }>({
    isOpen: false,
    targetTokenId: null,
  });
  const [page, setPage] = useState(1);
  const height = dragRef?.getBoundingClientRect().height ?? 0;
  const width = dragRef?.getBoundingClientRect().width ?? 0;

  const isPresent = useIsPresent();

  const parentHeight = parentRef?.getBoundingClientRect().height ?? 0;

  useDrag(
    ({ offset: [ox, oy] }) => {
      x.set(ox);

      if (oy > 0 || Math.abs(oy) > parentHeight * page) {
        return;
      }
      
      y.set(oy);
    },
    {
      from: () => {
        return [x.get(), y.get()];
      },
      target: dragRef ?? undefined,
      bounds: { left: -0, right: 0 },

      rubberband: true,
      filterTaps: true,
    }
  );

  const backgroundPosition = useMotionTemplate`calc(${x} * -0.3px) calc(${y} * -0.3px`;

  useEffect(() => {
    if (parentRef === null || !isPresent) return;
    _animate([
      [
        parentRef,
        {
          visibility: "visible",
        },
        {
          duration: 1,
        },
      ],
      [
        parentRef,
        {
          opacity: [0, 1],
        },
        {
          duration: 4,
        },
      ],
    ]);
  }, [animate, isPresent, parentRef]);

  const triggerModal = (id: string) =>
    setOpenModal({ isOpen: true, targetTokenId: id });

  const targetSmol = data?.data.find(
    (d) => d.tokenId === openModal.targetTokenId
  );

  const isLoading = useRef(false);

  const loadMore = () => {
    isLoading.current = true;
    console.log("loaded more");
    setPage((curr) => curr + 1);
    isLoading.current = false;
  }
  
  useMotionValueEvent(y, "change", (value) => {
    if (Math.abs(value) > ((parentHeight * page) - (parentHeight / 2)) && !isLoading.current) {
      loadMore();
    }
  });

  return (
    <AnimationContainer
      className="h-full relative flex flex-col bg-[url(/img/stars.png)] bg-repeat brightness-125"
      style={{
        backgroundPosition,
      }}
    >
      <Icon
        name="splash"
        className="absolute text-pepe bottom-[86%] -right-44 w-96 h-96 pointer-events-none"
      />
      <Header name="gallery" />
      <Sheet
        open={openModal.isOpen}
        onOpenChange={(isOpen) =>
          setOpenModal((modal) => ({
            ...modal,
            isOpen,
          }))
        }
      >
        <div
          ref={attachParentRef}
          className="invisible relative grid place-content-center flex-1 overflow-hidden"
        >
          <div className="z-10 absolute pointer-events-none inset-0 bg-black [-webkit-mask-image:radial-gradient(transparent,black_95%)]"></div>
          <motion.div
            ref={attachRef}
            className="relative touch-none"
            style={{
              y,
              x,
            }}
          >
            <div ref={scope} className="grid gap-16 p-4 touch-none relative">
              {data &&
                splitApps(Array.from({ length: page }).flatMap(() => data.data), isMobile).map((apps) => {
                  const length = isMobile ? 5 : 7;
                  if (apps.length === length) {
                    return (
                      <SevenColumns
                        key={apps.map((d) => d.tokenId).join(",")}
                        apps={apps}
                        width={width}
                        y={y}
                        x={x}
                        parentHeight={parentHeight}
                        openModal={triggerModal}
                      />
                    );
                  } else {
                    return (
                      <FiveColumns
                        key={apps.map((d) => d.tokenId).join(",")}
                        apps={apps}
                        width={width}
                        y={y}
                        x={x}
                        parentHeight={parentHeight}
                        openModal={triggerModal}
                      />
                    );
                  }
                })}
            </div>
          </motion.div>
        </div>
        <SheetContent className="bg-[#1C122F] overflow-hidden">
          {targetSmol ? <SidePopup smol={targetSmol} /> : null}
        </SheetContent>
      </Sheet>
    </AnimationContainer>
  );
}

const SidePopup = ({ smol }: { smol: TroveSmolToken }) => {
  const [color, setColor] = useState<string | null>(null);
  const [ringing, setRinging] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const player = useRef<Player | null>(null);

  const gender =
    smol.metadata.attributes.find((a) => a.trait_type === "Gender")?.value ??
    "male";

  useEffect(() => {
    const load = async () => {
      const searchParams = new URLSearchParams({ id: String(smol.tokenId) });

      player.current = new Player({
        url: `/speech.wav?${searchParams.toString()}`,
        loop: false,
        autostart: false,
      });

      const pitchShift = new PitchShift({
        pitch: gender === "male" ? -4 : 10,
      }).toDestination();

      await loaded();
      player.current.connect(pitchShift);
    };

    load();
  }, [gender, smol.tokenId]);

  const playSound = () => {
    if (ringing || (player.current && player.current.state === "started"))
      return;

    setRinging(true);

    setTimeout(() => {
      setRinging(false);
      player.current?.start();
    }, 2000);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (!audioRef.current?.paused) {
        const id = setInterval(() => {
          setSeconds((s) => s + 1);
        }, 1000);
        return () => clearInterval(id);
      } else {
        setSeconds(0);
      }
    }
  }, [audioRef.current?.paused]);

  return (
    <div className="relative flex flex-col h-full">
      <img
        src={smol.image.uri}
        crossOrigin="anonymous"
        className="w-full"
        onLoad={(e) => {
          const canvas = document.createElement("canvas");
          canvas.width = e.currentTarget.width;
          canvas.height = e.currentTarget.height;
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          ctx.drawImage(e.currentTarget, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // get the first three values of the first pixel
          const r = imageData.data[0];
          const g = imageData.data[1];
          const b = imageData.data[2];

          // get the rgb string
          const rgb = `rgb(${r},${g},${b})`;
          setColor(rgb);
        }}
        alt=""
      />
      <Icon
        name="splash"
        style={{
          color: color ?? "white",
        }}
        className="fill-current z-10 pointer-events-none absolute top-48 sm:top-72 lg:top-64 -left-12 w-32 h-36 sm:w-40 lg:h-48"
      />
      <Icon
        name="splash"
        style={{
          color: color ?? "white",
        }}
        className="fill-current z-10 pointer-events-none absolute top-44 sm:top-[17rem] lg:top-60 -right-12 w-32 h-36 lg:w-40 lg:h-48"
      />
      <div className="p-4 flex gap-4 flex-col h-full relative">
        <div className="gap-2 grid-cols-2 grid flex-1">
          {smol.rarity.scoreBreakdown
            .filter((data) => filterTraits.includes(data.trait))
            .map((data) => {
              return (
                <div
                  key={`${data.trait}-${data.value}`}
                  className="relative text-white group font-formula font-bold uppercase bg-[#443560]"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute grid place-items-center inset-0 h-full w-full bg-[#7237E3] transition-all duration-300">
                    <p className="text-sm">{data.score.toFixed(2)}%</p>
                  </div>
                  <div className="flex py-2 h-full gap-1 items-center justify-center flex-col">
                    <p className="text-white/50 text-xs sm:text-sm">
                      {data.trait}
                    </p>
                    <p className="text-sm sm:text-lg">{data.value}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <button
          onClick={() => playSound()}
          className="h-12 font-formula font-bold bg-acid inline-flex py-4 border items-center justify-center"
        >
          <MotionIcon
            animate={
              ringing
                ? {
                    rotate: 360,
                  }
                : undefined
            }
            name="call"
            className="w-8 h-8"
          />
          <span className="ml-1">
            {ringing
              ? "Ringing..."
              : audioRef.current && !audioRef.current.paused
              ? `00:${seconds < 10 ? `0${seconds}` : seconds}`
              : `Call ${smol.tokenId}`}
          </span>
        </button>
      </div>
    </div>
  );
};
