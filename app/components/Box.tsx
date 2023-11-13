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
  // disabled?: boolean;
};

const Loading = () => (
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-500/20 backdrop-blur-sm">
    <div className="bg-neonPink p-4">
      <Icon
        name="gear"
        className="h-16 w-16 animate-[spin_15s_linear_infinite] text-pepe"
      />
    </div>
    <div className="mt-4 h-2 w-2/3 bg-gray-300">
      <div className="h-full w-1/3 bg-neonPink"></div>
    </div>
    <span className="mt-2 font-bold text-white font-neuebit text-2xl leading-none capsize">
      Installing...
    </span>
  </div>
);

export const Box = (props: Props) => {
  const className = cn("relative box", props.className);

  const { children, as } = props;
  const [ref, setNodeRef] = useState<HTMLAnchorElement | null>(null);

  if (!as || as === "div") {
    const { className: _, as: __, ...rest } = props;
    return (
      <div className={className} {...rest}>
        <div className="relative h-full w-full">{children}</div>
        {props.isLoading && <Loading />}
      </div>
    );
  }

  if (as === "button") {
    const { className: _, as: __, ...rest } = props;
    return (
      <button className={className} {...rest}>
        <div className="relative h-full w-full">{children}</div>
        {props.isLoading && <Loading />}
      </button>
    );
  }
  if (as === "a") {
    const { className: _, as: __, target: ___, ...rest } = props;

    const disabled = props["aria-disabled"] === "true";

    return (
      <a
        className={cn(className, disabled && "pointer-events-none")}
        target="_blank"
        {...rest}
      >
        <div className="relative h-full w-full">{children}</div>
        {props.isLoading && <Loading />}
      </a>
    );
  }
  if (as === "link") {
    const { className: _, as: __, state, ...rest } = props;
    const disabled = props["aria-disabled"] === "true";
    return (
      <Link
        ref={setNodeRef}
        className={cn(className, disabled && "pointer-events-none")}
        state={state(ref)}
        {...rest}
      >
        <div className="relative h-full w-full">{children}</div>
        {props.isLoading && <Loading />}
      </Link>
    );
  }
};
