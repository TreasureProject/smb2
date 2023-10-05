import { useDrag } from "@use-gesture/react";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useSpring,
  useTransform,
  useMotionTemplate,
  useAnimate,
  animate as _animate,
} from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { distance } from "@popmotion/popcorn";
import type { TroveSmolToken } from "~/api";
import { fetchSmols } from "~/api";
import { json } from "@remix-run/node";
import { useCustomLoaderData } from "~/hooks/useCustomLoaderData";
import { Sheet, SheetContent, SheetHeader } from "~/components/ui/sheet";
import { interpolate } from "popmotion";

// this is the height for the visible area on line 201, h-96.
const BOX_HEIGHT = 200;

export const loader = async () => {
  const res = await fetchSmols();

  return json({
    data: res,
  });
};

// type WindowSize = {
//   width: number;
//   height: number;
// };

// export function useWindowSize(): WindowSize {
//   const [windowSize, setWindowSize] = useState<WindowSize>({
//     width: 0,
//     height: 0,
//   });

//   const handleSize = () => {
//     setWindowSize({
//       width: window.innerWidth,
//       height: window.innerHeight,
//     });
//   };

//   addEventListener("resize", handleSize);

//   useIsomorphicLayoutEffect(() => {
//     handleSize();
//   }, []);

//   return windowSize;
// }

function splitApps(apps: TroveSmolToken[]) {
  let results = [];
  let isSeven = true;

  for (let i = 0; i < apps.length; ) {
    if (isSeven) {
      results.push(apps.slice(i, i + 7));
      i += 7;
    } else {
      results.push(apps.slice(i, i + 5));
      i += 5;
    }
    isSeven = !isSeven;
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
      className="grid grid-cols-[repeat(3,100px)] grid-rows-[100px] xl:grid-cols-[repeat(5,var(--size))] xl:grid-rows-[var(--size)] place-content-center gap-12"
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
      className="grid grid-cols-[repeat(5,100px)] grid-rows-[100px] xl:grid-cols-[repeat(7,var(--size))] xl:grid-rows-[var(--size)] place-content-center gap-12"
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
  const offsetRelative = useTransform(() => {
    const yValue = Math.abs(y.get());

    const yPlusVisibleArea = yValue + parentHeight;

    const offsetTop = ref?.offsetTop ?? 0;

    if (offsetTop < yValue || offsetTop > yPlusVisibleArea) return 0;

    return offsetTop - yValue;
  });
  const d = useTransform(() => {
    return distance(
      {
        x: (ref?.offsetLeft ?? 0) + x.get() + BOX_HEIGHT / 2,
        y: offsetRelative.get() + BOX_HEIGHT / 2,
      },
      {
        x: width / 2,
        y: parentHeight / 2,
      }
    );
  });

  const s = useTransform(d, [parentHeight, parentHeight / 2, 0], [0.5, 0.7, 2]);

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
          duration: 1,
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
      initial={false}
      style={{
        scale,
      }}
      ref={attachRef}
      className="relative outline rounded-full overflow-hidden text-xl outline-neonPink text-white aspect-square"
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
  const height = dragRef?.getBoundingClientRect().height ?? 0;
  const width = dragRef?.getBoundingClientRect().width ?? 0;

  const parentHeight = parentRef?.getBoundingClientRect().height ?? 0;
  useDrag(
    ({ event, offset: [ox, oy] }) => {
      event.preventDefault();

      x.set(ox);

      if (oy > 0 || Math.abs(oy) > height - parentHeight) return;
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
    if (parentRef === null) return;
    _animate([
      [
        parentRef,
        {
          visibility: "visible",
        },
        {
          duration: 0,
        },
      ],
      [
        parentRef,
        {
          opacity: [0, 1],
        },
        {
          duration: 2,
        },
      ],
    ]);
  }, [animate, parentRef]);

  const triggerModal = (id: string) =>
    setOpenModal({ isOpen: true, targetTokenId: id });

  return (
    <motion.div
      className="h-full flex flex-col font-mono bg-[url(/img/stars.png)] bg-repeat"
      style={{
        backgroundPosition,
      }}
    >
      <div className="h-24 bg-red-500/50">
        <h1>GALLERY</h1>
      </div>
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
            className="relative"
            style={{
              y,
              x,
            }}
          >
            <div ref={scope} className="grid gap-16 p-4 touch-none relative">
              {data &&
                splitApps(data.data).map((apps) => {
                  if (apps.length === 7) {
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
        <SheetContent>
          <SheetHeader>
            <img
              src={
                data?.data.find((d) => d.tokenId === openModal.targetTokenId)
                  ?.image.uri || ""
              }
              alt=""
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
