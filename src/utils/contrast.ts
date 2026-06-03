import { wcagContrast } from "culori";

export const INK = "#14110f";
export const PAPER = "#fafaf7";

/**
 * 칩 배경색 위에서 더 잘 읽히는 텍스트색을 고른다.
 * ink/paper 두 후보 중 WCAG 대비가 높은 쪽을 반환한다.
 */
export const getReadableInkColor = (hex: string): typeof INK | typeof PAPER => {
  const bg = hex.startsWith("#") ? hex : `#${hex}`;
  return wcagContrast(bg, INK) >= wcagContrast(bg, PAPER) ? INK : PAPER;
};
