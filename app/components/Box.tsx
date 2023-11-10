import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import { motion } from "framer-motion";
import type { AnchorHTMLAttributes } from "react";
import { useState } from "react";
import { cn } from "~/utils";

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

export const Box = (props: Props) => {
  const className = cn("relative box", props.className);

  const { children, as } = props;
  const [ref, setNodeRef] = useState<HTMLAnchorElement | null>(null);

  if (!as || as === "div") {
    const { className: _, as: __, ...rest } = props;
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  if (as === "button") {
    const { className: _, as: __, ...rest } = props;
    return (
      <button className={className} {...rest}>
        {children}
      </button>
    );
  }
  if (as === "a") {
    const { className: _, as: __, target: ___, ...rest } = props;
    return (
      <a className={className} target="_blank" {...rest}>
        {children}
      </a>
    );
  }
  if (as === "link") {
    const { className: _, as: __, state, ...rest } = props;
    return (
      <Link ref={setNodeRef} className={className} state={state(ref)} {...rest}>
        {children}
      </Link>
    );
  }
};
