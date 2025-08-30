// /lib/utils.ts
import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names nicely (shadcn helper) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Read and normalize backend base URL from env */
export function httpBase() {
  const u = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!u) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");
  return u.replace(/\/$/, "");
}

/** Derive ws/wss base from http/https */
export function wsBase() {
  return httpBase().replace(/^https?/i, (m) => (m.toLowerCase() === "https" ? "wss" : "ws"));
}

/** Create a short title from the first user message */
export function titleFromMessage(msg: string) {
  const t = msg.trim().replace(/\s+/g, " ");
  return t.length <= 60 ? t : t.slice(0, 57) + "...";
}
