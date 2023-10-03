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

const VISIBLE_AREA_HEIGHT = 384;

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
];

// function that takes in an array and returns a new array with this [[0, 1, 2], [3, 4, 5, 6], [7, 8, 9]]
function splitApps(apps: typeof APP_LIST) {
  let results = [];
  let isThree = true;

  for (let i = 0; i < apps.length; ) {
    if (isThree) {
      results.push(apps.slice(i, i + 3));
      i += 3;
    } else {
      results.push(apps.slice(i, i + 4));
      i += 4;
    }
    isThree = !isThree; // Toggle between 3 and 4
  }

  return results;
}

function useCallbackRef<TValue = unknown>(): [
  TValue | null,
  (ref: TValue | null) => void
] {
  return useState<TValue | null>(null);
}

const ThreeColumns = ({
  apps,
  variableHeight,
  height,
}: {
  apps: typeof APP_LIST;
  variableHeight: MotionValue<number>;
  height: number;
}) => {
  return (
    <div className="grid grid-cols-[repeat(3,100px)] grid-rows-[100px] place-content-center gap-4">
      {apps.map((app) => (
        <Item
          key={app}
          app={app}
          variableHeight={variableHeight}
          height={height}
        />
      ))}
    </div>
  );
};

const FourColumns = ({
  apps,
  variableHeight,
  height,
}: {
  apps: typeof APP_LIST;
  variableHeight: MotionValue<number>;
  height: number;
}) => {
  return (
    <div className="grid grid-cols-[repeat(4,100px)] grid-rows-[100px] place-content-center gap-4">
      {apps.map((app) => (
        <Item
          key={app}
          app={app}
          variableHeight={variableHeight}
          height={height}
        />
      ))}
    </div>
  );
};

const Item = ({
  app,
  variableHeight,
  height,
}: {
  app: (typeof APP_LIST)[number];
  variableHeight: MotionValue<number>;
  height: number;
}) => {
  const [ref, attachRef] = useCallbackRef<HTMLDivElement>();
  const heightPlusOffset = height + 50;
  const d = useTransform(() => {
    return distance(ref?.offsetTop ?? 0, variableHeight.get());
  });

  const s = useTransform(
    d,
    [
      heightPlusOffset,
      heightPlusOffset - VISIBLE_AREA_HEIGHT / 4.8,
      heightPlusOffset - VISIBLE_AREA_HEIGHT / 2,
      heightPlusOffset - VISIBLE_AREA_HEIGHT / 1.2,
      heightPlusOffset - VISIBLE_AREA_HEIGHT,
    ],
    [0, 0.9, 1, 0.9, 0]
  );
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
      className="border border-red-500 text-white"
    >
      {d}
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

  const variableHeight = useMotionValue(height);

  useEffect(() => {
    variableHeight.set(height);
  }, [height, variableHeight]);

  useDrag(
    ({ event, down, offset: [, oy] }) => {
      event.preventDefault();

      if (oy > 0 || Math.abs(oy) > height - VISIBLE_AREA_HEIGHT) return;
      // normalize this value between 0 and 1
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
    <div className="h-full grid place-content-center">
      <div className="border border-red-500 h-96 overflow-hidden">
        <motion.div
          className="grid gap-2 p-4 relative touch-none"
          ref={attachRef}
          style={{
            y,
          }}
        >
          {splitApps(APP_LIST).map((apps) => {
            if (apps.length === 4) {
              return (
                <FourColumns
                  key={apps.join("")}
                  apps={apps}
                  variableHeight={variableHeight}
                  height={height}
                />
              );
            } else {
              return (
                <ThreeColumns
                  key={apps.join("")}
                  apps={apps}
                  variableHeight={variableHeight}
                  height={height}
                />
              );
            }
          })}
        </motion.div>
      </div>
    </div>
  );
}
