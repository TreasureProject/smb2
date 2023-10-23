import { forwardRef, type SVGProps } from "react";
import spriteHref from "./icons/sprite.svg";
import { type IconName } from "./icons/name";
import { motion } from "framer-motion";

export const Icon = forwardRef<
  SVGSVGElement,
  SVGProps<SVGSVGElement> & {
    name: IconName;
  }
>(({ name, ...props }, ref) => (
  <svg {...props} ref={ref}>
    <use href={`${spriteHref}#${name}`} />
  </svg>
));

export const MotionIcon = motion(Icon);

Icon.displayName = "Icon";
