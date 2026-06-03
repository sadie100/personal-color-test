import type {
  AboutSeasonSlug,
  BaseTone,
  ColorTypeSlug,
  DetailTone,
  PersonalColorType,
  Season,
} from "../types";

export interface ColorTypeMeta {
  slug: ColorTypeSlug;
  type: PersonalColorType;
  season: Season;
  detailTone: DetailTone;
  base: BaseTone;
  signatureHex: string;
  /** border-color utility for top accent on cards. */
  borderClass: string;
  /** soft background tint for cards. */
  bgClass: string;
  /** THEORY.md §7 PCCS tone list (language-neutral). */
  pccs: string;
}

export const colorTypeMetas: Record<ColorTypeSlug, ColorTypeMeta> = {
  "spring-light": {
    slug: "spring-light",
    type: "Spring Light",
    season: "Spring",
    detailTone: "Light",
    base: "Warm",
    signatureHex: "#F5D8B8",
    borderClass: "border-amber-300",
    bgClass: "bg-amber-50",
    pccs: "Pale, Light",
  },
  "spring-bright": {
    slug: "spring-bright",
    type: "Spring Bright",
    season: "Spring",
    detailTone: "Bright",
    base: "Warm",
    signatureHex: "#FF8C00",
    borderClass: "border-rose-400",
    bgClass: "bg-rose-50",
    pccs: "Bright, Vivid",
  },
  "summer-light": {
    slug: "summer-light",
    type: "Summer Light",
    season: "Summer",
    detailTone: "Light",
    base: "Cool",
    signatureHex: "#C8D8F0",
    borderClass: "border-sky-300",
    bgClass: "bg-sky-50",
    pccs: "Pale, Light",
  },
  "summer-muted": {
    slug: "summer-muted",
    type: "Summer Muted",
    season: "Summer",
    detailTone: "Muted",
    base: "Cool",
    signatureHex: "#8098C0",
    borderClass: "border-slate-400",
    bgClass: "bg-slate-50",
    pccs: "Soft, Light grayish, Grayish, Dull, Strong",
  },
  "autumn-muted": {
    slug: "autumn-muted",
    type: "Autumn Muted",
    season: "Autumn",
    detailTone: "Muted",
    base: "Warm",
    signatureHex: "#C8B860",
    borderClass: "border-stone-400",
    bgClass: "bg-stone-50",
    pccs: "Soft, Light grayish, Grayish, Dull, Strong",
  },
  "autumn-dark": {
    slug: "autumn-dark",
    type: "Autumn Dark",
    season: "Autumn",
    detailTone: "Dark",
    base: "Warm",
    signatureHex: "#8B2020",
    borderClass: "border-amber-700",
    bgClass: "bg-amber-50",
    pccs: "Deep, Dark, Dark grayish",
  },
  "winter-bright": {
    slug: "winter-bright",
    type: "Winter Bright",
    season: "Winter",
    detailTone: "Bright",
    base: "Cool",
    signatureHex: "#FF1493",
    borderClass: "border-fuchsia-500",
    bgClass: "bg-fuchsia-50",
    pccs: "Pale, Bright, Vivid, Strong, Deep",
  },
  "winter-dark": {
    slug: "winter-dark",
    type: "Winter Dark",
    season: "Winter",
    detailTone: "Dark",
    base: "Cool",
    signatureHex: "#001850",
    borderClass: "border-indigo-800",
    bgClass: "bg-slate-100",
    pccs: "Deep, Dark, Dark grayish",
  },
};

export interface SeasonSlugGroup {
  season: Season;
  seasonSlug: AboutSeasonSlug;
  slugs: ColorTypeSlug[];
}

/** 8타입을 시즌별 2개씩 묶는다 (UI_FEEDBACK §3.4 P2-10). */
export const seasonSlugGroups: SeasonSlugGroup[] = [
  { season: "Spring", seasonSlug: "spring", slugs: ["spring-light", "spring-bright"] },
  { season: "Summer", seasonSlug: "summer", slugs: ["summer-light", "summer-muted"] },
  { season: "Autumn", seasonSlug: "autumn", slugs: ["autumn-muted", "autumn-dark"] },
  { season: "Winter", seasonSlug: "winter", slugs: ["winter-bright", "winter-dark"] },
];
