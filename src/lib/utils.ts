import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const ICON_CONTAINER_BASE =
  "rounded-xl bg-cream/80 border border-deep-brown/8 text-deep-brown shadow-sm";
