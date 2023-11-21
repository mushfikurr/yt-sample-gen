import { twMerge as twMergeOriginal } from "tailwind-merge";
import clsx from "clsx";

export function cn(...args) {
  return twMergeOriginal(clsx(args));
}
