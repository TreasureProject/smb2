import { useDrag } from "@use-gesture/react";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useSpring,
  useTransform,
  useMotionTemplate,
  animate as _animate,
  useIsPresent,
  useMotionValueEvent
} from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { distance } from "@popmotion/popcorn";
import type { TroveSmolToken, searchSmol } from "~/api";
import { fetchSmols } from "~/api";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCustomLoaderData } from "~/hooks/useCustomLoaderData";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { interpolate } from "popmotion";
import { Icon } from "~/components/Icons";
import { AnimationContainer } from "~/components/AnimationContainer";
import { PitchShift, Player, loaded } from "tone";
import { Header } from "~/components/Header";
import { useResponsive } from "~/contexts/responsive";
import { useFetcher } from "@remix-run/react";
import PurpleMonke from "./assets/purpleMonke.webp";
import { Loading } from "~/components/Loading";

const MotionIcon = motion(Icon);
// this is the height for the visible area on line 201, h-96.
const BOX_HEIGHT = 200;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "0";

  const res = await fetchSmols(Number(page));

  return json({
    data: res,
    page: Number(page)
  });
};

function splitApps(apps: TroveSmolToken[], isMobile: boolean = false) {
  let results = [];
  let isFirst = true;
  const first = isMobile ? 5 : 7;
  const second = isMobile ? 4 : 6;

  for (let i = 0; i < apps.length; i++) {
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
  openModal
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
          "--size": `${BOX_HEIGHT}px`
        } as CSSProperties
      }
      className="grid grid-cols-[repeat(4,100px)] grid-rows-[100px] place-content-center gap-10 sm:grid-cols-[repeat(6,var(--size))] sm:grid-rows-[var(--size)] sm:gap-12"
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
  openModal
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
          "--size": `${BOX_HEIGHT}px`
        } as CSSProperties
      }
      className="grid grid-cols-[repeat(5,100px)] grid-rows-[100px] place-content-center gap-10 sm:grid-cols-[repeat(7,var(--size))] sm:grid-rows-[var(--size)] sm:gap-12"
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
  openModal
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
        y: offsetRelative
      },
      {
        x: width / 2,
        y: 0
      }
    );
  });

  const s = useTransform(d, [parentHeight, 0, -parentHeight], [0.3, 1.3, 0.3]);

  const scale = useSpring(s, {
    stiffness: 500,
    damping: 100,
    mass: 0.1
  });

  useEffect(() => {
    if (ref === null) return;
    const runAnimation = async () => {
      await _animate(
        ref,
        { y: ["99%", "0%"], opacity: [0, 1] },
        {
          duration: 0.5,
          ease: "easeOut"
        }
      );

      _animate(
        ref,
        {
          y: ["0%", "5%", "0%"]
        },
        {
          duration: interpolate([0.5, 0.8, 1.4], [6, 4, 2])(s.get()),
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "reverse"
        }
      );
    };
    runAnimation();
  }, [ref, s]);

  return (
    <motion.div
      style={{
        scale
      }}
      ref={attachRef}
      className="relative aspect-square overflow-hidden rounded-full text-white ring-4 ring-transparent ring-offset-2 ring-offset-transparent transition-shadow duration-200 text-xl hover:ring-white/50 hover:ring-offset-black"
    >
      <motion.img
        src={app.image.uri}
        className="h-full w-full touch-none select-none [-webkit-user-drag:none]"
      />
      <button
        className="absolute inset-0 h-full w-full"
        onClick={() => openModal(app.tokenId)}
      />
    </motion.div>
  );
};

const GalleryInner = ({
  width,
  parentHeight,
  x,
  y
} // targetSmolId
: {
  width: number;
  parentHeight: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
  // targetSmolId: string | null;
}) => {
  const initialData = useCustomLoaderData<typeof loader>();
  const [pageData, setPageData] = useState(initialData?.data);
  const fetcher = useFetcher<typeof loader>();
  // const smolFetcher = useFetcher<ReturnType<typeof searchSmol>>();
  const { isMobile } = useResponsive();
  const loadedPages = useRef<number[]>([]);
  const [openModal, setOpenModal] = useState<{
    isOpen: boolean;
    targetTokenId: string | null;
  }>({
    isOpen: false,
    targetTokenId: null
  });

  // TODO: remove this when fetcher is memoized properly
  // const fetcherRef = useRef(smolFetcher);
  // useEffect(() => {
  //   fetcherRef.current = smolFetcher;
  // }, [smolFetcher]);

  // useEffect(() => {
  //   if (!targetSmolId) return;

  //   fetcherRef.current.load(
  //     `/search?${new URLSearchParams({ tokenId: targetSmolId }).toString()}`
  //   );
  // }, [targetSmolId]);

  const page = fetcher.data
    ? fetcher.data.page + 1
    : (initialData?.page || 0) + 1;

  const isLoading = useRef(false);

  useEffect(() => {
    if (fetcher.data) {
      setPageData((d) => {
        return [...(d ?? []), ...(fetcher.data?.data ?? [])];
      });
    }
  }, [fetcher.data]);

  // const data = smolFetcher.data ?? pageData;
  const data = pageData;

  const loadMore = () => {
    if (loadedPages.current.includes(page)) return;
    isLoading.current = true;
    fetcher.load(`/gallery?page=${page}`);
    loadedPages.current.push(page);
    isLoading.current = false;
  };

  useMotionValueEvent(y, "change", (value) => {
    if (
      Math.abs(value) > parentHeight * page - parentHeight / 2 &&
      !isLoading.current
    ) {
      loadMore();
    }
  });

  const triggerModal = (id: string) =>
    setOpenModal({ isOpen: true, targetTokenId: id });

  const targetSmol = data?.find((d) => d.tokenId === openModal.targetTokenId);

  return (
    <Sheet
      open={openModal.isOpen}
      onOpenChange={(isOpen) =>
        setOpenModal((modal) => ({
          ...modal,
          isOpen
        }))
      }
    >
      <div className="relative grid touch-none gap-16 p-4">
        {data &&
          splitApps(data, isMobile).map((apps) => {
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
      <SheetContent className="bg-[#1C122F]">
        {targetSmol ? <SidePopup smol={targetSmol} /> : null}
      </SheetContent>
    </Sheet>
  );
};

export default function Gallery() {
  const y = useSpring(0, {
    stiffness: 5000,
    damping: 500
  });
  const x = useSpring(0, {
    stiffness: 5000,
    damping: 500
  });
  const [dragRef, attachRef] = useCallbackRef<HTMLDivElement>();
  const [parentRef, attachParentRef] = useCallbackRef<HTMLDivElement>();
  // const [targetSmolId, setTargetSmolId] = useState<string | null>(null);
  const width = dragRef?.getBoundingClientRect().width ?? 0;

  const isPresent = useIsPresent();

  const parentHeight = parentRef?.getBoundingClientRect().height ?? 0;

  useDrag(
    ({ offset: [ox, oy] }) => {
      x.set(ox);
      if (oy > 0) return;
      y.set(oy);
    },
    {
      from: () => {
        return [x.get(), y.get()];
      },
      target: dragRef ?? undefined,
      bounds: { left: -0, right: 0 },

      rubberband: true,
      filterTaps: true
    }
  );

  const backgroundPosition = useMotionTemplate`calc(${x} * -0.3px) calc(${y} * -0.3px`;

  useEffect(() => {
    if (parentRef === null || !isPresent) return;
    _animate([
      [
        parentRef,
        {
          visibility: "visible"
        },
        {
          duration: 1
        }
      ],
      [
        parentRef,
        {
          opacity: [0, 1]
        },
        {
          duration: 4
        }
      ]
    ]);
  }, [isPresent, parentRef]);

  return (
    <AnimationContainer
      className="relative flex h-full flex-col bg-[url(/img/stars.webp)] bg-repeat brightness-125"
      style={{
        backgroundPosition
      }}
    >
      <Icon
        name="splash"
        className="pointer-events-none absolute -right-44 bottom-[86%] h-96 w-96 text-pepe"
      />
      <Header name="gallery" />

      <div
        ref={attachParentRef}
        className="invisible relative grid flex-1 justify-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-black [mask-image:radial-gradient(transparent,black_95%)]"></div>
        <motion.div
          ref={attachRef}
          className="touch-none"
          style={{
            y,
            x
          }}
        >
          <GalleryInner
            width={width}
            parentHeight={parentHeight}
            x={x}
            y={y}
            // targetSmolId={targetSmolId}
          />
        </motion.div>
        {/* <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white text-3xl">
          <button onClick={() => {
            setTargetSmolId("1000");
            y.set(0)
          }}>Set up</button>
        </div> */}
      </div>
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

  const fetcher = useFetcher<{ location: string }>();
  // TODO: remove this when fetcher is memoized properly
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  // fetch location information about the smol
  useEffect(() => {
    const searchParams = new URLSearchParams({ id: String(smol.tokenId) });

    fetcherRef.current.load(`/location?${searchParams.toString()}`);
  }, [smol.tokenId]);

  const iq =
    (smol.metadata.attributes.find((a) => a.trait_type === "IQ")
      ?.value as number) ?? 0;

  useEffect(() => {
    const load = async () => {
      const searchParams = new URLSearchParams({ id: String(smol.tokenId) });

      player.current = new Player({
        url: `/speech.wav?${searchParams.toString()}`,
        loop: false,
        autostart: false
      });

      const pitchShift = new PitchShift({
        pitch: gender === "male" ? -4 : 10
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
    <div className="relative flex h-full flex-col">
      <img
        src={PurpleMonke}
        className="absolute bottom-0 right-full h-auto w-16"
        alt="Purple monke pulling the sheet"
      />
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
          color: color ?? "white"
        }}
        className="pointer-events-none absolute -left-12 top-48 z-10 h-36 w-32 fill-current sm:top-72 sm:w-40 lg:top-64 lg:h-48"
      />
      <Icon
        name="splash"
        style={{
          color: color ?? "white"
        }}
        className="pointer-events-none absolute -right-12 top-44 z-10 h-36 w-32 fill-current sm:top-[17rem] lg:top-60 lg:h-48 lg:w-40"
      />
      <div className="relative flex h-full flex-col gap-4 p-4">
        <div className="flex justify-between">
          <div className="flex flex-col space-y-2">
            <p className="font-bold text-[#BFB9CA] font-formula text-sm leading-none capsize">
              SMOL BRAIN
            </p>
            <p className="font-black text-grayTwo font-formula text-5xl leading-none capsize">
              {smol.tokenId}
            </p>
          </div>
          <div className="flex items-center space-x-2 self-center bg-[#36225E] px-4 py-3">
            <Icon name="brain" className="h-6 w-6 text-white" />
            <span className="font-extrabold text-grayTwo font-formula leading-none capsize">
              {new Intl.NumberFormat("en-US").format(iq)}
            </span>
          </div>
        </div>
        <div className="mt-4 flex h-full flex-col">
          {fetcher.state === "loading" ? (
            <div className="grid flex-1 place-items-center">
              <Loading className="h-12 w-12 text-white" />
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 bg-[#36225E] px-4 py-2.5">
                <Icon name="geotag" className="h-6 w-6 text-white" />
                <span className="font-bold text-grayTwo font-formula leading-none capsize">
                  {fetcher.data?.location ?? "UNKNOWN"}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-[#36225E] px-4 py-2.5">
                <Icon name="work" className="h-6 w-6 text-white" />
                <span className="font-bold text-grayTwo font-formula leading-none capsize">
                  DESIGNER
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-1 items-end">
            <div className="flex w-full flex-col space-y-1">
              <button
                onClick={() => playSound()}
                className="inline-flex h-12 w-full items-center justify-center bg-acid py-4 font-bold font-formula"
              >
                <MotionIcon
                  animate={
                    ringing
                      ? {
                          rotate: 360
                        }
                      : undefined
                  }
                  name="call"
                  className="h-8 w-8"
                />
                <span className="ml-1">
                  {ringing
                    ? "Ringing..."
                    : audioRef.current && !audioRef.current.paused
                    ? `00:${seconds < 10 ? `0${seconds}` : seconds}`
                    : `Call ${smol.tokenId}`}
                </span>
              </button>
              <a
                href={`https://app.treasure.lol/collection/smol-brains/${smol.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center bg-troll py-4 font-bold font-formula"
              >
                VIEW MORE DETAILS
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
