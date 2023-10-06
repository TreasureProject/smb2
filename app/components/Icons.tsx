import { forwardRef, type SVGProps } from "react";
import spriteHref from "./icons/sprite.svg";
import { type IconName } from "./icons/name";

// tranform this to use forwardRef
// export function Icon({
//   name,
//   ...props
// }: SVGProps<SVGSVGElement> & {
//   name: IconName;
// }) {
//   return (
//     <svg {...props}>
//       <use href={`${spriteHref}#${name}`} />
//     </svg>
//   );
// }
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

Icon.displayName = "Icon";
