import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBurnAddress = (address: `0x${string}` | undefined) =>
  address?.startsWith("0x000") ?? false;

export const formatNumber = (
  value: number | string,
  options?: Intl.NumberFormatOptions
) =>
  (typeof value === "string" ? parseFloat(value) : value).toLocaleString(
    "en-US",
    options
  );

export const formatPercent = (percentage: string | number, rounded = false) => {
  const number =
    (typeof percentage === "string" ? parseFloat(percentage) : percentage) *
    100;
  const shouldRound = rounded && number >= 1;
  return (
    formatNumber(shouldRound ? Math.round(number) : number, {
      minimumFractionDigits: 0,
      maximumFractionDigits: shouldRound ? 0 : 2
    }) + "%"
  );
};
