import { useDrag } from "@use-gesture/react";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { useEffect, useState } from "react";
import { distance } from "@popmotion/popcorn";

// this is the height for the visible area on line 201, h-96.
const VISIBLE_AREA_HEIGHT = 384;
const BOX_HEIGHT = 100;

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

function splitApps(apps: typeof APP_LIST) {
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
  height,
  width,
  y,
}: {
  apps: typeof APP_LIST;
  height: number;
  width: number;
  y: MotionValue<number>;
}) => {
  return (
    <div className="grid grid-cols-[repeat(5,100px)] grid-rows-[100px] place-content-center gap-4">
      {apps.map((app) => (
        <Item key={app} app={app} height={height} width={width} y={y} />
      ))}
    </div>
  );
};

const SevenColumns = ({
  apps,
  height,
  width,
  y,
}: {
  apps: typeof APP_LIST;
  height: number;
  width: number;
  y: MotionValue<number>;
}) => {
  return (
    <div className="grid grid-cols-[repeat(7,100px)] grid-rows-[100px] place-content-center gap-4">
      {apps.map((app) => (
        <Item key={app} app={app} height={height} width={width} y={y} />
      ))}
    </div>
  );
};

const Item = ({
  app,

  height,
  width,
  y,
}: {
  app: (typeof APP_LIST)[number];
  height: number;
  width: number;
  y: MotionValue<number>;
}) => {
  const [ref, attachRef] = useCallbackRef<HTMLDivElement>();

  const offsetRelative = useTransform(() => {
    const yValue = Math.abs(y.get());

    const yPlusVisibleArea = yValue + VISIBLE_AREA_HEIGHT;

    const offsetTop = ref?.offsetTop ?? 0;

    if (offsetTop < yValue || offsetTop > yPlusVisibleArea) return 0;

    return offsetTop - yValue;
  });
  const d = useTransform(() =>
    distance(
      {
        x: (ref?.offsetLeft ?? 0) + BOX_HEIGHT / 2,
        y: offsetRelative.get(),
      },
      {
        x: width / 2,
        y: VISIBLE_AREA_HEIGHT / 2,
      }
    )
  );

  const s = useTransform(d, [VISIBLE_AREA_HEIGHT, 0], [0.1, 1.1]);

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
      className="border text-xl border-red-500 text-white"
    >
      <span className="block truncate">{app}</span>
    </motion.div>
  );
};

export default function Gallery() {
  const y = useSpring(0, {
    stiffness: 5000,
    damping: 500,
  });
  const [dragRef, attachRef] = useCallbackRef<HTMLDivElement>();

  const height = dragRef?.getBoundingClientRect().height ?? 0;
  const width = dragRef?.getBoundingClientRect().width ?? 0;

  const variableHeight = useMotionValue(height);

  useEffect(() => {
    variableHeight.set(height);
  }, [height, variableHeight]);

  useDrag(
    ({ event, offset: [, oy] }) => {
      event.preventDefault();

      if (oy > 0 || Math.abs(oy) > height - VISIBLE_AREA_HEIGHT) return;
      variableHeight.set(height - oy);
      y.set(oy);
    },
    {
      from: () => {
        return [0, y.get()];
      },
      target: dragRef ?? undefined,
      pointer: {
        capture: false,
      },
    }
  );

  return (
    <div className="h-full grid place-content-center font-mono">
      <div className="border border-red-500 h-96 overflow-hidden">
        <motion.div
          className="grid gap-2 p-4 touch-none relative"
          ref={attachRef}
          style={{
            y,
          }}
        >
          {splitApps(APP_LIST).map((apps) => {
            if (apps.length === 7) {
              return (
                <SevenColumns
                  key={apps.join("")}
                  apps={apps}
                  height={height}
                  width={width}
                  y={y}
                />
              );
            } else {
              return (
                <FiveColumns
                  key={apps.join("")}
                  apps={apps}
                  height={height}
                  width={width}
                  y={y}
                />
              );
            }
          })}
        </motion.div>
      </div>
    </div>
  );
}
