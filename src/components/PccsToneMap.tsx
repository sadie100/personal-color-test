import { translations } from "../i18n/translations";
import type { Lang } from "../types";

interface PccsToneMapProps {
  lang: Lang;
}

interface PccsTone {
  abbr: string;
  name: string;
  /** 채도 버킷 1(낮음)~4(높음) */
  col: number;
  /** 명도 버킷 1(높음)~4(낮음) */
  row: number;
  hex: string;
}

// PCCS 12톤 — 채도×명도 좌표 + 대표색(단일 휴 라더, illustrative).
// PCCS 톤은 본래 휴 독립이나, 여기서는 톤 진행을 한눈에 보이도록 단일 레드 휴로 표현한다.
const pccsTones: ReadonlyArray<PccsTone> = [
  { abbr: "p", name: "Pale", col: 1, row: 1, hex: "#EBD3D0" },
  { abbr: "lt", name: "Light", col: 2, row: 1, hex: "#E8A9A0" },
  { abbr: "b", name: "Bright", col: 3, row: 1, hex: "#E4574C" },
  { abbr: "ltg", name: "Light grayish", col: 1, row: 2, hex: "#C9B6B2" },
  { abbr: "sf", name: "Soft", col: 2, row: 2, hex: "#C98579" },
  { abbr: "s", name: "Strong", col: 3, row: 2, hex: "#C0392B" },
  { abbr: "v", name: "Vivid", col: 4, row: 2, hex: "#E8301A" },
  { abbr: "g", name: "Grayish", col: 1, row: 3, hex: "#8C7A75" },
  { abbr: "d", name: "Dull", col: 2, row: 3, hex: "#9C5B50" },
  { abbr: "dp", name: "Deep", col: 3, row: 3, hex: "#8E2B20" },
  { abbr: "dkg", name: "Dark grayish", col: 1, row: 4, hex: "#4A3D3A" },
  { abbr: "dk", name: "Dark", col: 2, row: 4, hex: "#5C2A22" },
];

export const PccsToneMap = ({ lang }: PccsToneMapProps) => {
  const t = translations[lang].about.pccs;

  return (
    <div>
      <div className="flex gap-3">
        <div
          className="flex flex-col items-center justify-between py-1 text-xs text-ink-3"
          aria-hidden
        >
          <span>{t.high}</span>
          <span className="tracking-wide [writing-mode:vertical-rl]">{t.axisLightness}</span>
          <span>{t.low}</span>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-4 grid-rows-4 gap-2">
            {pccsTones.map((tone) => (
              <div
                key={tone.abbr}
                className="flex flex-col rounded-xl border border-hairline bg-fill p-2"
                style={{ gridColumn: tone.col, gridRow: tone.row }}
              >
                <span
                  className="h-10 w-full rounded-md border border-hairline"
                  style={{ backgroundColor: tone.hex }}
                />
                <span className="mt-1.5 font-display text-sm text-ink">{tone.abbr}</span>
                <span className="text-[11px] leading-tight text-ink-3">{tone.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-ink-3" aria-hidden>
            <span>{t.low}</span>
            <span className="tracking-wide">{t.axisSaturation}</span>
            <span>{t.high}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
