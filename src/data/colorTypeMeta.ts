import type {
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
  /** Tailwind gradient classes (without the `bg-gradient-to-*` direction). */
  gradientClass: string;
  /** border-color utility for top accent on cards. */
  borderClass: string;
  /** soft background tint for cards. */
  bgClass: string;
  /** hero text color — either "text-white" or "text-slate-900". */
  heroTextClass: string;
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
    gradientClass: "from-amber-200 via-orange-200 to-yellow-100",
    borderClass: "border-amber-300",
    bgClass: "bg-amber-50",
    heroTextClass: "text-slate-900",
    pccs: "Pale, Light",
  },
  "spring-bright": {
    slug: "spring-bright",
    type: "Spring Bright",
    season: "Spring",
    detailTone: "Bright",
    base: "Warm",
    signatureHex: "#FF8C00",
    gradientClass: "from-rose-400 via-amber-400 to-yellow-300",
    borderClass: "border-rose-400",
    bgClass: "bg-rose-50",
    heroTextClass: "text-white",
    pccs: "Bright, Vivid",
  },
  "summer-light": {
    slug: "summer-light",
    type: "Summer Light",
    season: "Summer",
    detailTone: "Light",
    base: "Cool",
    signatureHex: "#C8D8F0",
    gradientClass: "from-sky-200 via-indigo-200 to-fuchsia-100",
    borderClass: "border-sky-300",
    bgClass: "bg-sky-50",
    heroTextClass: "text-slate-900",
    pccs: "Pale, Light",
  },
  "summer-muted": {
    slug: "summer-muted",
    type: "Summer Muted",
    season: "Summer",
    detailTone: "Muted",
    base: "Cool",
    signatureHex: "#8098C0",
    gradientClass: "from-slate-400 via-indigo-300 to-purple-300",
    borderClass: "border-slate-400",
    bgClass: "bg-slate-50",
    heroTextClass: "text-white",
    pccs: "Soft, Light grayish, Grayish, Dull, Strong",
  },
  "autumn-muted": {
    slug: "autumn-muted",
    type: "Autumn Muted",
    season: "Autumn",
    detailTone: "Muted",
    base: "Warm",
    signatureHex: "#C8B860",
    gradientClass: "from-stone-400 via-amber-500 to-orange-400",
    borderClass: "border-stone-400",
    bgClass: "bg-stone-50",
    heroTextClass: "text-white",
    pccs: "Soft, Light grayish, Grayish, Dull, Strong",
  },
  "autumn-dark": {
    slug: "autumn-dark",
    type: "Autumn Dark",
    season: "Autumn",
    detailTone: "Dark",
    base: "Warm",
    signatureHex: "#8B2020",
    gradientClass: "from-amber-800 via-orange-700 to-red-800",
    borderClass: "border-amber-700",
    bgClass: "bg-amber-50",
    heroTextClass: "text-white",
    pccs: "Deep, Dark, Dark grayish",
  },
  "winter-bright": {
    slug: "winter-bright",
    type: "Winter Bright",
    season: "Winter",
    detailTone: "Bright",
    base: "Cool",
    signatureHex: "#FF1493",
    gradientClass: "from-fuchsia-500 via-purple-500 to-sky-500",
    borderClass: "border-fuchsia-500",
    bgClass: "bg-fuchsia-50",
    heroTextClass: "text-white",
    pccs: "Pale, Bright, Vivid, Strong, Deep",
  },
  "winter-dark": {
    slug: "winter-dark",
    type: "Winter Dark",
    season: "Winter",
    detailTone: "Dark",
    base: "Cool",
    signatureHex: "#001850",
    gradientClass: "from-indigo-900 via-slate-800 to-slate-900",
    borderClass: "border-indigo-800",
    bgClass: "bg-slate-100",
    heroTextClass: "text-white",
    pccs: "Deep, Dark, Dark grayish",
  },
};

export const warmSlugs: ColorTypeSlug[] = [
  "spring-light",
  "spring-bright",
  "autumn-muted",
  "autumn-dark",
];

export const coolSlugs: ColorTypeSlug[] = [
  "summer-light",
  "summer-muted",
  "winter-bright",
  "winter-dark",
];
