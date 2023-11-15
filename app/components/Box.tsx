import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import { motion } from "framer-motion";
import type { AnchorHTMLAttributes } from "react";
import { useState } from "react";
import { cn } from "~/utils";
import { Icon } from "./Icons";

const MotionLink = motion(Link);

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
};

const Loading = () => (
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-500/20 backdrop-blur-sm">
    <div className="bg-neonPink p-1.5 sm:p-4">
      <Icon
        name="gear"
        className="h-8 w-8 animate-[spin_15s_linear_infinite] text-pepe sm:h-16 sm:w-16"
      />
    </div>
    <div className="mt-4 h-1 w-2/3 bg-gray-300 sm:h-2">
      <div className="h-full w-1/3 bg-neonPink"></div>
    </div>
    <span className="mt-2 font-bold text-white font-neuebit text-lg leading-none capsize sm:text-2xl">
      Installing...
    </span>
  </div>
);

export const Box = (props: Props) => {
  const className = cn("relative box", props.className);

  const { children, as, isLoading } = props;
  const [ref, setNodeRef] = useState<HTMLAnchorElement | null>(null);

  if (!as || as === "div") {
    const { className: _, as: __, isLoading: ___, ...rest } = props;
    return (
      <div className={className} {...rest}>
        <div className="relative h-full w-full">{children}</div>
        {isLoading && <Loading />}
      </div>
    );
  }

  if (as === "button") {
    const { className: _, as: __, isLoading: ___, ...rest } = props;
    return (
      <button className={className} {...rest}>
        <div className="relative h-full w-full">{children}</div>
        {isLoading && <Loading />}
      </button>
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
        {isLoading && <Loading />}
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
        {isLoading && <Loading />}
      </Link>
    );
  }
};
