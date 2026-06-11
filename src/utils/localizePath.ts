import type { Lang } from "../types";

export const getLangFromPathname = (pathname: string): Lang =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ko";

/** 논리 경로(무접두 ko 경로)를 해당 언어 URL로 변환. "/" + en → "/en" */
export const localizePath = (lang: Lang, path: string): string =>
  lang === "ko" ? path : path === "/" ? "/en" : `/en${path}`;

/** URL → 논리 경로(접두 제거). "/en/about" → "/about", "/en" → "/" */
export const stripLangPrefix = (pathname: string): string => {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
};
