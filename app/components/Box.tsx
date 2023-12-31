import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils";
import { Icon } from "./Icons";
import useStore from "~/store";
import SuccessMp3 from "~/assets/success.mp3";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div";
}

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  as: "button";
}

interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  as: "a";
}

interface LinkProps extends Omit<RemixLinkProps, "state"> {
  as: "link";
}

type Props = (DivProps | ButtonProps | AnchorProps | LinkProps) & {
  isLoading?: boolean;
  name: string;
};

const Loading = ({
  playAnimation,
  appInstalled,
  name
}: {
  playAnimation: boolean;
  appInstalled: boolean;
  name: string;
}) => {
  const width = useMotionValue(33);
  const ref = useRef<HTMLDivElement | null>(null);
  const showIntro = useStore((state) => state.showIntro);
  const installedApps = useStore((state) => state.installedApps);

  const [installed] = useState(() => appInstalled);

  const recentlyInstalled = appInstalled && !installed;

  const setInstalledApps = useStore((state) => state.setInstalledApps);

  useEffect(() => {
    if (playAnimation && !showIntro && !installed) {
      animate(width, 100, {
        duration: 10,
        ease: "easeOut"
      });
    }
  }, [playAnimation, width, showIntro]);

  const widthPx = useMotionTemplate`${width}%`;

  useMotionValueEvent(width, "change", (value) => {
    if (value === 100) {
      setInstalledApps([...installedApps, name]);
      const audio = new Audio(SuccessMp3);
      audio.play();
      audio.volume = 0.1;
    }
  });

  return (
    <motion.div
      initial={{
        opacity: installed ? 0 : 1
      }}
      animate={
        recentlyInstalled
          ? {
              opacity: 0,
              transition: {
                delay: 1
              }
            }
          : undefined
      }
      className={cn(
        "absolute inset-0 flex cursor-wait flex-col items-center justify-center bg-gray-500/20 backdrop-blur-sm",
        appInstalled ? "z-10" : "z-50"
      )}
    >
      <div className="bg-neonPink p-1 sm:p-4">
        <Icon
          name="gear"
          className="h-6 w-6 animate-[spin_15s_linear_infinite] text-pepe sm:h-16 sm:w-16"
        />
      </div>
      <div className="mt-4 h-1 w-2/3 bg-gray-300 sm:h-2">
        <motion.div
          style={{
            width: widthPx
          }}
          ref={ref}
          className="h-full bg-neonPink"
        ></motion.div>
      </div>
      <span className="mt-2 font-bold text-white font-neuebit leading-none capsize sm:text-2xl">
        {appInstalled ? "Installed!" : "Installing..."}
      </span>
    </motion.div>
  );
};

export const Box = (props: Props) => {
  const className = cn("relative box", props.className);

  const { children, as, isLoading } = props;
  const [ref, setNodeRef] = useState<HTMLAnchorElement | null>(null);

  const animate = props.name === "spotlight";
  const installedApps = useStore((state) => state.installedApps);

  const appInstalled = installedApps.includes(props.name);

  if (!as || as === "div") {
    const { className: _, as: __, isLoading: ___, ...rest } = props;
    return (
      <div className={className} {...rest}>
        <div className="relative h-full w-full">{children}</div>
        {isLoading && (
          <Loading
            name={props.name}
            playAnimation={animate}
            appInstalled={appInstalled}
          />
        )}
      </div>
    );
  }

  if (as === "button") {
    const { className: _, as: __, isLoading: ___, ...rest } = props;
    return (
      <div className={className}>
        <div className="relative h-full w-full">
          {children}
          {isLoading && (
            <Loading
              name={props.name}
              playAnimation={animate}
              appInstalled={appInstalled}
            />
          )}
          <button {...rest} className="absolute inset-0 z-40 h-full w-full">
            <span className="sr-only">{rest.name}</span>
          </button>
        </div>
      </div>
    );
  }
  if (as === "a") {
    const {
      className: _,
      as: __,
      target: ___,
      isLoading: ____,
      ...rest
    } = props;

    const disabled = props["aria-disabled"] === "true";

    return (
      <a
        className={cn(className, disabled && "pointer-events-none")}
        target="_blank"
        {...rest}
      >
        <div className="relative h-full w-full">{children}</div>
        {isLoading && (
          <Loading
            name={props.name}
            playAnimation={animate}
            appInstalled={appInstalled}
          />
        )}
      </a>
    );
  }
  if (as === "link") {
    const { className: _, as: __, isLoading: ___, ...rest } = props;
    const disabled = props["aria-disabled"] === "true";
    return (
      <Link
        ref={setNodeRef}
        className={cn(className, disabled && "pointer-events-none")}
        {...rest}
      >
        <div className="relative h-full w-full">{children}</div>
        {isLoading && (
          <Loading
            name={props.name}
            playAnimation={animate}
            appInstalled={appInstalled}
          />
        )}
      </Link>
    );
  }
};
