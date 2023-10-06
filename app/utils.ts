import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Env } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTransformOrigin(node: HTMLAnchorElement | null) {
  if (!node) return;
  const rect = node.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return {
    transformOrigin: `${centerX}px ${centerY}px`,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const strictEntries = <T extends Record<string, any>>(
  object: T
): [keyof T, T[keyof T]][] => {
  return Object.entries(object);
};

export function getPublicKeys(env: Env) {
  const publicKeys = {} as Env;
  for (const [key, value] of strictEntries(env)) {
    if (key.startsWith("PUBLIC_")) {
      publicKeys[key] = value;
    }
  }
  return publicKeys as Pick<Env, keyof Env & `PUBLIC_${string}`>;
}

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
      maximumFractionDigits: shouldRound ? 0 : 2,
    }) + "%"
  );
};
