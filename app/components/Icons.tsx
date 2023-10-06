import { type SVGProps } from "react";
import spriteHref from "./icons/sprite.svg";
import { type IconName } from "./icons/name";

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
}) {
  return (
    <svg {...props}>
      <use href={`${spriteHref}#${name}`} />
    </svg>
  );
}
