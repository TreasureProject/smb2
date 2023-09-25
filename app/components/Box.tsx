import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import { useState } from "react";
import { cn } from "~/utils";

type Props =
  | ({
      as?: "button";
    } & React.HTMLAttributes<HTMLButtonElement>)
  | ({
      as: "a";
    } & React.HTMLAttributes<HTMLAnchorElement>)
  | ({
      as: "link";
      state: (node: HTMLAnchorElement | null) => any;
    } & Omit<RemixLinkProps, "state">);

export const Box = (props: Props) => {
  const className = cn("relative overflow-hidden box", props.className);

  const { children, as } = props;
  const [ref, setNodeRef] = useState<HTMLAnchorElement | null>(null);

  if (!as || as === "button") {
    const { className: _, as: __, ...rest } = props;
    return (
      <button className={className} {...rest}>
        {children}
      </button>
    );
  }
  if (as === "a") {
    const { className: _, as: __, ...rest } = props;
    return (
      <a className={className} {...rest}>
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
