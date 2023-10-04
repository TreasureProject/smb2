import { useDrag } from "@use-gesture/react";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useSpring,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  useAnimate,
  stagger,
} from "framer-motion";
import { useEffect, useState } from "react";
import { distance } from "@popmotion/popcorn";
import type { TroveSmolToken } from "~/api";
import { fetchSmols } from "~/api";
import { json } from "@remix-run/node";
import { useCustomLoaderData } from "~/hooks/useCustomLoaderData";

// this is the height for the visible area on line 201, h-96.
const VISIBLE_AREA_HEIGHT = 384;
const BOX_HEIGHT = 100;

export const loader = async () => {
  const res = await fetchSmols();

  return json({
    data: res,
  });
};

const APP_LIST = [
  "Random",
  "Pokedex",
  "Todo",
  "Calculator",
  "Weather",
  "Github",
  "TicTacToe",
  "Snake",
  "Tetris",
  "Chess",
  "Calendar",
  "Chat",
  "Blog",
  "E-commerce",
  "Portfolio",
  "Spotify",
  "Youtube",
  "Netflix",
  "Twitter",
  "Instagram",
  "Facebook",
  "Reddit",
  "Google",
  "Amazon",
  "Twitch",
  "Discord",
  "Slack",
  "Whatsapp",
  "Netflix",
  "Twitter",
  "Instagram",
  "Facebook",
  "Reddit",
  "Google",
  "Amazon",
  "Twitch",
  "Discord",
  "Slack",
  "Whatsapp",
];

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
}: {
  apps: TroveSmolToken[];
  width: number;
  y: MotionValue<number>;
  x: MotionValue<number>;
  parentHeight: number;
}) => {
  return (
    <div className="grid grid-cols-[repeat(5,100px)] grid-rows-[100px] place-content-center gap-12">
      {apps.map((app) => (
        <Item
          parentHeight={parentHeight}
          x={x}
          key={app.tokenId}
          app={app}
          width={width}
          y={y}
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
}: {
  apps: TroveSmolToken[];
  width: number;
  y: MotionValue<number>;
  x: MotionValue<number>;
  parentHeight: number;
}) => {
  return (
    <div className="grid grid-cols-[repeat(7,100px)] grid-rows-[100px] place-content-center gap-12">
      {apps.map((app) => (
        <Item
          parentHeight={parentHeight}
          x={x}
          key={app.tokenId}
          app={app}
          width={width}
          y={y}
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
}: {
  app: TroveSmolToken;
  width: number;
  y: MotionValue<number>;
  x: MotionValue<number>;
  parentHeight: number;
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
        y: offsetRelative.get(),
      },
      {
        x: width / 2,
        y: parentHeight / 2,
      }
    );
  });

  const s = useTransform(d, [parentHeight, 0], [0.5, 1.4]);

  const transform = useMotionTemplate`scale(${useSpring(s, {
    stiffness: 5000,
    damping: 100,
    mass: 0.1,
  })})`;

  return (
    <motion.div
      initial={false}
      style={{
        transform,
      }}
      ref={attachRef}
      className="outline rounded-full overflow-hidden text-xl outline-neonPink text-white aspect-square"
    >
      <motion.img
        src={app.image.uri}
        className="w-full h-full select-none touch-none [-moz-user-select:none] [-webkit-user-drag:none]"
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
      pointer: {
        capture: false,
      },
    }
  );

  useEffect(() => {
    animate(
      "div",
      { y: [999, 0], opacity: [0, 1] },
      {
        type: "spring",

        ease: "easeInOut",
        delay: stagger(0.001),
      }
    );
  }, [animate]);

  return (
    <div className="h-full flex flex-col font-mono bg-troll">
      <div className="h-24 bg-red-500/50">
        <h1>GALLERY</h1>
      </div>
      <div
        ref={attachParentRef}
        className="flex-1 overflow-hidden [-webkit-mask-image:radial-gradient(60%_80%_at_center,white,transparent_65%)]"
      >
        <motion.div
          ref={attachRef}
          style={{
            y,
            x,
          }}
        >
          <div ref={scope} className="grid gap-10 p-4 touch-none relative">
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
                    />
                  );
                }
              })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
