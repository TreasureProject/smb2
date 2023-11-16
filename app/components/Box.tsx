import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent
} from "framer-motion";
import type { AnchorHTMLAttributes } from "react";
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
  state: (node: HTMLAnchorElement | null) => any;
}

type Props = (DivProps | ButtonProps | AnchorProps | LinkProps) & {
  isLoading?: boolean;
  name: string;
};

const Loading = ({ playAnimation = false }: { playAnimation?: boolean }) => {
  const width = useMotionValue(33);
  const ref = useRef<HTMLDivElement | null>(null);
  const [installed, setInstalled] = useState(false);
  const showIntro = useStore((state) => state.showIntro);

  useEffect(() => {
    const play = async () => {
      if (playAnimation && !showIntro) {
        await animate(width, 100, {
          duration: 3,
          ease: "easeOut"
        });

        const audio = new Audio(SuccessMp3);
        audio.play();

        return () => audio.pause();
      }
    };
    play();
  }, [playAnimation, width, showIntro]);

  const widthPx = useMotionTemplate`${width}%`;

  useMotionValueEvent(width, "change", (value) => {
    if (value === 100) setInstalled(true);
  });

  return (
    <motion.div
      initial={{
        opacity: 1
      }}
      animate={
        installed
          ? {
              opacity: 0,
              transition: {
                delay: 1
              }
            }
          : undefined
      }
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center bg-gray-500/20 backdrop-blur-sm",
        installed ? "z-10" : "z-40"
      )}
    >
      <div className="bg-neonPink p-1.5 sm:p-4">
        <Icon
          name="gear"
          className="h-8 w-8 animate-[spin_15s_linear_infinite] text-pepe sm:h-16 sm:w-16"
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
      <span className="mt-2 font-bold text-white font-neuebit text-lg leading-none capsize sm:text-2xl">
        {installed ? "Installed!" : "Installing..."}
      </span>
    </motion.div>
  );
};

export const Box = (props: Props) => {
  const className = cn("relative box", props.className);

  const { children, as, isLoading } = props;
  const [ref, setNodeRef] = useState<HTMLAnchorElement | null>(null);

  const animate = props.name === "spotlight";

  if (!as || as === "div") {
    const { className: _, as: __, isLoading: ___, ...rest } = props;
    return (
      <div className={className} {...rest}>
        <div className="relative h-full w-full">{children}</div>
        {isLoading && <Loading playAnimation={animate} />}
      </div>
    );
  }

  if (as === "button") {
    const { className: _, as: __, isLoading: ___, ...rest } = props;
    return (
      <div className={className}>
        <div className="relative h-full w-full">
          {children}
          {isLoading && <Loading playAnimation={animate} />}
          <button {...rest} className="absolute inset-0 z-30 h-full w-full">
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
        {isLoading && <Loading playAnimation={animate} />}
      </a>
    );
  }
  if (as === "link") {
    const { className: _, as: __, isLoading: ___, state, ...rest } = props;
    const disabled = props["aria-disabled"] === "true";
    return (
      <Link
        ref={setNodeRef}
        className={cn(className, disabled && "pointer-events-none")}
        state={state(ref)}
        {...rest}
      >
        <div className="relative h-full w-full">{children}</div>
        {isLoading && <Loading playAnimation={animate} />}
      </Link>
    );
  }
};
