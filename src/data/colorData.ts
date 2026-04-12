import type {
  BaseTone,
  ColorChip,
  ColorDataMap,
  DiagnosticChip,
  DetailTone,
  HueCategory,
  Lang,
  PersonalColorType,
  SimpleResultType,
  Season,
} from "../types";

interface PersonalColorTypeMeta {
  slug: string;
  labelKo: string;
  labelEn: string;
  season: Season;
  baseTone: BaseTone;
  detailTone: DetailTone;
}

interface SimpleResultTypeMeta {
  slug: string;
  labelKo: string;
  labelEn: string;
  season: Season;
  baseTone: BaseTone;
  paletteTypes: readonly PersonalColorType[];
}

const createChip = (
  id: string,
  nameKo: string,
  nameEn: string,
  hex: string,
  oklch: { l: number; c: number; h: number },
  hueCategory: HueCategory,
): ColorChip => ({
  id,
  name: nameEn,
  nameKo,
  nameEn,
  hex,
  oklch,
  hueCategory,
});

const createDiagnosticChip = (
  chip: ColorChip,
  diagnosticPhase: DiagnosticChip["diagnosticPhase"],
  targetTypes: PersonalColorType[],
): DiagnosticChip => ({
  ...chip,
  diagnosticPhase,
  targetTypes,
});

export const personalColorTypes = [
  "Spring Light",
  "Spring Bright",
  "Summer Light",
  "Summer Muted",
  "Autumn Muted",
  "Autumn Dark",
  "Winter Bright",
  "Winter Dark",
] as const satisfies readonly PersonalColorType[];

export const personalColorTypeMeta: Record<PersonalColorType, PersonalColorTypeMeta> = {
  "Spring Light": {
    slug: "spring-light",
    labelKo: "봄 웜 라이트",
    labelEn: "Spring Warm Light",
    season: "Spring",
    baseTone: "Warm",
    detailTone: "Light",
  },
  "Spring Bright": {
    slug: "spring-bright",
    labelKo: "봄 웜 브라이트",
    labelEn: "Spring Warm Bright",
    season: "Spring",
    baseTone: "Warm",
    detailTone: "Bright",
  },
  "Summer Light": {
    slug: "summer-light",
    labelKo: "여름 쿨 라이트",
    labelEn: "Summer Cool Light",
    season: "Summer",
    baseTone: "Cool",
    detailTone: "Light",
  },
  "Summer Muted": {
    slug: "summer-muted",
    labelKo: "여름 쿨 뮤트",
    labelEn: "Summer Cool Muted",
    season: "Summer",
    baseTone: "Cool",
    detailTone: "Muted",
  },
  "Autumn Muted": {
    slug: "autumn-muted",
    labelKo: "가을 웜 뮤트",
    labelEn: "Autumn Warm Muted",
    season: "Autumn",
    baseTone: "Warm",
    detailTone: "Muted",
  },
  "Autumn Dark": {
    slug: "autumn-dark",
    labelKo: "가을 웜 다크",
    labelEn: "Autumn Warm Dark",
    season: "Autumn",
    baseTone: "Warm",
    detailTone: "Dark",
  },
  "Winter Bright": {
    slug: "winter-bright",
    labelKo: "겨울 쿨 브라이트",
    labelEn: "Winter Cool Bright",
    season: "Winter",
    baseTone: "Cool",
    detailTone: "Bright",
  },
  "Winter Dark": {
    slug: "winter-dark",
    labelKo: "겨울 쿨 다크",
    labelEn: "Winter Cool Dark",
    season: "Winter",
    baseTone: "Cool",
    detailTone: "Dark",
  },
};

export const simpleResultTypes = ["Spring Warm", "Summer Cool", "Autumn Warm", "Winter Cool"] as const satisfies readonly SimpleResultType[];

export const simpleResultTypeMeta: Record<SimpleResultType, SimpleResultTypeMeta> = {
  "Spring Warm": {
    slug: "spring-warm",
    labelKo: "봄 웜",
    labelEn: "Spring Warm",
    season: "Spring",
    baseTone: "Warm",
    paletteTypes: ["Spring Light", "Spring Bright"],
  },
  "Summer Cool": {
    slug: "summer-cool",
    labelKo: "여름 쿨",
    labelEn: "Summer Cool",
    season: "Summer",
    baseTone: "Cool",
    paletteTypes: ["Summer Light", "Summer Muted"],
  },
  "Autumn Warm": {
    slug: "autumn-warm",
    labelKo: "가을 웜",
    labelEn: "Autumn Warm",
    season: "Autumn",
    baseTone: "Warm",
    paletteTypes: ["Autumn Muted", "Autumn Dark"],
  },
  "Winter Cool": {
    slug: "winter-cool",
    labelKo: "겨울 쿨",
    labelEn: "Winter Cool",
    season: "Winter",
    baseTone: "Cool",
    paletteTypes: ["Winter Bright", "Winter Dark"],
  },
};

export const getPersonalColorTypeLabel = (type: PersonalColorType, lang: Lang): string =>
  lang === "ko" ? personalColorTypeMeta[type].labelKo : personalColorTypeMeta[type].labelEn;

export const getSimpleResultTypeLabel = (type: SimpleResultType, lang: Lang): string =>
  lang === "ko" ? simpleResultTypeMeta[type].labelKo : simpleResultTypeMeta[type].labelEn;

export const getChipName = (chip: ColorChip, lang: Lang): string => (lang === "ko" ? chip.nameKo : chip.nameEn);

const chips = {
  warmPink: createChip("base-warm-pink", "웜 핑크", "Warm Pink", "#E8B4A0", { l: 0.82, c: 0.06, h: 45 }, "red"),
  coolPink: createChip("base-cool-pink", "쿨 핑크", "Cool Pink", "#F4B4C8", { l: 0.82, c: 0.08, h: 350 }, "purplePink"),
  warmYellow: createChip("base-warm-yellow", "웜 옐로우", "Warm Yellow", "#F5E6A0", { l: 0.93, c: 0.08, h: 95 }, "yellow"),
  coolYellow: createChip("base-cool-yellow", "쿨 옐로우", "Cool Yellow", "#F5F5A0", { l: 0.95, c: 0.1, h: 105 }, "yellow"),
  warmGreen: createChip("base-warm-green", "웜 그린", "Warm Green", "#D0E870", { l: 0.88, c: 0.14, h: 118 }, "green"),
  coolGreen: createChip("base-cool-green", "쿨 그린", "Cool Green", "#A0F0C8", { l: 0.9, c: 0.1, h: 165 }, "green"),
  warmBlue: createChip("base-warm-blue", "웜 블루", "Warm Blue", "#80F0E8", { l: 0.9, c: 0.08, h: 185 }, "blue"),
  coolBlue: createChip("base-cool-blue", "쿨 블루", "Cool Blue", "#C8D8E8", { l: 0.87, c: 0.04, h: 240 }, "blue"),
  ivory: createChip("base-ivory", "아이보리", "Ivory", "#FDF5E0", { l: 0.97, c: 0.02, h: 90 }, "neutral"),
  whiteBasic: createChip("base-white", "화이트", "White", "#E8F0F8", { l: 0.96, c: 0.01, h: 240 }, "neutral"),

  springSeasonRed: createChip("season-spring-red", "봄 레드", "Spring Red", "#F5D8D0", { l: 0.9, c: 0.04, h: 30 }, "red"),
  autumnSeasonRed: createChip("season-autumn-red", "가을 레드", "Autumn Red", "#8B0000", { l: 0.35, c: 0.14, h: 25 }, "red"),
  springSeasonOrange: createChip("season-spring-orange", "봄 오렌지", "Spring Orange", "#F5E0B0", { l: 0.92, c: 0.06, h: 85 }, "orange"),
  autumnSeasonOrange: createChip("season-autumn-orange", "가을 오렌지", "Autumn Orange", "#B0601E", { l: 0.5, c: 0.12, h: 50 }, "orange"),
  springSeasonGreen: createChip("season-spring-green", "봄 그린", "Spring Green", "#A0F060", { l: 0.86, c: 0.18, h: 130 }, "green"),
  autumnSeasonGreen: createChip("season-autumn-green", "가을 그린", "Autumn Green", "#3A5F20", { l: 0.38, c: 0.1, h: 135 }, "green"),
  summerSeasonRed: createChip("season-summer-red", "여름 레드", "Summer Red", "#F8C8D8", { l: 0.86, c: 0.07, h: 350 }, "purplePink"),
  winterSeasonRed: createChip("season-winter-red", "겨울 레드", "Winter Red", "#8B0028", { l: 0.35, c: 0.16, h: 355 }, "red"),
  summerSeasonBlue: createChip("season-summer-blue", "여름 블루", "Summer Blue", "#D8E8F8", { l: 0.94, c: 0.02, h: 240 }, "blue"),
  winterSeasonBlue: createChip("season-winter-blue", "겨울 블루", "Winter Blue", "#000080", { l: 0.28, c: 0.14, h: 260 }, "blue"),
  summerSeasonPurple: createChip("season-summer-purple", "여름 퍼플", "Summer Purple", "#E0D0F0", { l: 0.9, c: 0.05, h: 300 }, "purplePink"),
  winterSeasonPurple: createChip("season-winter-purple", "겨울 퍼플", "Winter Purple", "#400080", { l: 0.3, c: 0.18, h: 295 }, "purplePink"),

  springLightPink: createChip("detail-spring-light-pink", "라이트 핑크", "Light Pink", "#F5D0D0", { l: 0.88, c: 0.04, h: 15 }, "purplePink"),
  springLightPeach: createChip("detail-spring-light-peach", "라이트 피치", "Light Peach", "#F5D8B8", { l: 0.9, c: 0.05, h: 65 }, "orange"),
  springLightCreamYellow: createChip("detail-spring-light-cream-yellow", "크림 옐로우", "Cream Yellow", "#F5F0C8", { l: 0.95, c: 0.05, h: 100 }, "yellow"),
  springLightLime: createChip("detail-spring-light-lime", "라이트 라임", "Light Lime", "#E0F0B0", { l: 0.93, c: 0.08, h: 118 }, "green"),
  springLightMint: createChip("detail-spring-light-mint", "라이트 민트", "Light Mint", "#C8F0E8", { l: 0.92, c: 0.05, h: 175 }, "green"),

  springBrightRed: createChip("detail-spring-bright-red", "브라이트 레드", "Bright Red", "#FF4040", { l: 0.6, c: 0.22, h: 25 }, "red"),
  springBrightOrange: createChip("detail-spring-bright-orange", "브라이트 오렌지", "Bright Orange", "#FF8C00", { l: 0.72, c: 0.18, h: 65 }, "orange"),
  springBrightYellow: createChip("detail-spring-bright-yellow", "브라이트 옐로우", "Bright Yellow", "#FFD700", { l: 0.87, c: 0.17, h: 90 }, "yellow"),
  brightSharedGreen: createChip("detail-bright-green", "브라이트 그린", "Bright Green", "#00C850", { l: 0.7, c: 0.18, h: 150 }, "green"),
  springBrightBlue: createChip("detail-spring-bright-blue", "브라이트 블루", "Bright Blue", "#1E90FF", { l: 0.62, c: 0.16, h: 245 }, "blue"),

  autumnMutedRose: createChip("detail-autumn-muted-rose", "뮤트 로즈", "Muted Rose", "#D89090", { l: 0.7, c: 0.07, h: 18 }, "red"),
  autumnMutedOrange: createChip("detail-autumn-muted-orange", "뮤트 오렌지", "Muted Orange", "#D8A050", { l: 0.74, c: 0.11, h: 70 }, "orange"),
  autumnMutedGold: createChip("detail-autumn-muted-gold", "뮤트 골드", "Muted Gold", "#C8B860", { l: 0.77, c: 0.1, h: 98 }, "yellow"),
  autumnMutedSage: createChip("detail-autumn-muted-sage", "세이지 그린", "Sage Green", "#98B878", { l: 0.73, c: 0.07, h: 135 }, "green"),
  autumnMutedBlue: createChip("detail-autumn-muted-blue", "뮤트 블루", "Muted Blue", "#80A8B8", { l: 0.7, c: 0.04, h: 220 }, "blue"),

  autumnDarkRed: createChip("detail-autumn-dark-red", "다크 레드", "Dark Red", "#8B2020", { l: 0.37, c: 0.12, h: 22 }, "red"),
  autumnDarkRust: createChip("detail-autumn-dark-rust", "러스트", "Rust", "#A05818", { l: 0.47, c: 0.12, h: 55 }, "orange"),
  autumnDarkGold: createChip("detail-autumn-dark-gold", "다크 골드", "Dark Gold", "#8B7D20", { l: 0.55, c: 0.1, h: 95 }, "yellow"),
  autumnDarkGreen: createChip("detail-autumn-dark-green", "다크 그린", "Dark Green", "#2B5520", { l: 0.36, c: 0.09, h: 140 }, "green"),
  autumnDarkTeal: createChip("detail-autumn-dark-teal", "다크 틸", "Dark Teal", "#185868", { l: 0.38, c: 0.06, h: 210 }, "blue"),

  summerLightPink: createChip("detail-summer-light-pink", "라이트 핑크", "Light Pink", "#F0C0D0", { l: 0.85, c: 0.05, h: 350 }, "purplePink"),
  summerLightMint: createChip("detail-summer-light-mint", "라이트 민트", "Light Mint", "#C0F0D0", { l: 0.91, c: 0.06, h: 155 }, "green"),
  summerLightBlue: createChip("detail-summer-light-blue", "라이트 블루", "Light Blue", "#C8D8F0", { l: 0.88, c: 0.04, h: 245 }, "blue"),
  summerLightLavender: createChip("detail-summer-light-lavender", "라이트 라벤더", "Light Lavender", "#D8D0E8", { l: 0.87, c: 0.04, h: 290 }, "purplePink"),
  summerLightPurple: createChip("detail-summer-light-purple", "라이트 퍼플", "Light Purple", "#E8C8E8", { l: 0.86, c: 0.05, h: 320 }, "purplePink"),

  summerMutedDustyRose: createChip("detail-summer-muted-dusty-rose", "더스티 로즈", "Dusty Rose", "#C89098", { l: 0.68, c: 0.05, h: 5 }, "red"),
  summerMutedGreen: createChip("detail-summer-muted-green", "뮤트 그린", "Muted Green", "#70B888", { l: 0.7, c: 0.07, h: 158 }, "green"),
  summerMutedBlue: createChip("detail-summer-muted-blue", "뮤트 블루", "Muted Blue", "#8098C0", { l: 0.67, c: 0.06, h: 250 }, "blue"),
  summerMutedLavender: createChip("detail-summer-muted-lavender", "뮤트 라벤더", "Muted Lavender", "#9890C0", { l: 0.67, c: 0.06, h: 285 }, "purplePink"),
  summerMutedPurple: createChip("detail-summer-muted-purple", "뮤트 퍼플", "Muted Purple", "#A888B0", { l: 0.65, c: 0.05, h: 310 }, "purplePink"),

  winterBrightPink: createChip("detail-winter-bright-pink", "핫 핑크", "Hot Pink", "#FF1493", { l: 0.58, c: 0.24, h: 345 }, "purplePink"),
  winterBrightBlue: createChip("detail-winter-bright-blue", "브라이트 블루", "Bright Blue", "#0050FF", { l: 0.48, c: 0.22, h: 260 }, "blue"),
  winterBrightPurple: createChip("detail-winter-bright-purple", "퍼플", "Purple", "#7830C0", { l: 0.45, c: 0.2, h: 295 }, "purplePink"),
  winterBrightMagenta: createChip("detail-winter-bright-magenta", "마젠타", "Magenta", "#D000D0", { l: 0.55, c: 0.24, h: 320 }, "purplePink"),

  winterDarkWine: createChip("detail-winter-dark-wine", "다크 와인", "Dark Wine", "#700028", { l: 0.3, c: 0.12, h: 355 }, "red"),
  winterDarkGreen: createChip("detail-winter-dark-green", "다크 그린", "Dark Green", "#003828", { l: 0.25, c: 0.06, h: 165 }, "green"),
  winterDarkNavy: createChip("detail-winter-dark-navy", "다크 네이비", "Dark Navy", "#001850", { l: 0.2, c: 0.09, h: 260 }, "blue"),
  winterDarkPurple: createChip("detail-winter-dark-purple", "다크 퍼플", "Dark Purple", "#380068", { l: 0.25, c: 0.14, h: 295 }, "purplePink"),
  winterDarkMagenta: createChip("detail-winter-dark-magenta", "다크 마젠타", "Dark Magenta", "#680050", { l: 0.3, c: 0.12, h: 335 }, "purplePink"),
};

export const diagnosticChips: DiagnosticChip[] = [
  createDiagnosticChip(chips.warmPink, "base", ["Spring Light", "Spring Bright", "Autumn Muted", "Autumn Dark"]),
  createDiagnosticChip(chips.coolPink, "base", ["Summer Light", "Summer Muted", "Winter Bright", "Winter Dark"]),
  createDiagnosticChip(chips.warmYellow, "base", ["Spring Light", "Spring Bright", "Autumn Muted", "Autumn Dark"]),
  createDiagnosticChip(chips.coolYellow, "base", ["Summer Light", "Summer Muted", "Winter Bright", "Winter Dark"]),
  createDiagnosticChip(chips.warmGreen, "base", ["Spring Light", "Spring Bright", "Autumn Muted", "Autumn Dark"]),
  createDiagnosticChip(chips.coolGreen, "base", ["Summer Light", "Summer Muted", "Winter Bright", "Winter Dark"]),
  createDiagnosticChip(chips.warmBlue, "base", ["Spring Light", "Spring Bright", "Autumn Muted", "Autumn Dark"]),
  createDiagnosticChip(chips.coolBlue, "base", ["Summer Light", "Summer Muted", "Winter Bright", "Winter Dark"]),
  createDiagnosticChip(chips.ivory, "base", ["Spring Light", "Spring Bright", "Autumn Muted", "Autumn Dark"]),
  createDiagnosticChip(chips.whiteBasic, "base", ["Summer Light", "Summer Muted", "Winter Bright", "Winter Dark"]),

  createDiagnosticChip(chips.springSeasonRed, "season", ["Spring Light", "Spring Bright"]),
  createDiagnosticChip(chips.autumnSeasonRed, "season", ["Autumn Muted", "Autumn Dark"]),
  createDiagnosticChip(chips.springSeasonOrange, "season", ["Spring Light", "Spring Bright"]),
  createDiagnosticChip(chips.autumnSeasonOrange, "season", ["Autumn Muted", "Autumn Dark"]),
  createDiagnosticChip(chips.springSeasonGreen, "season", ["Spring Light", "Spring Bright"]),
  createDiagnosticChip(chips.autumnSeasonGreen, "season", ["Autumn Muted", "Autumn Dark"]),
  createDiagnosticChip(chips.summerSeasonRed, "season", ["Summer Light", "Summer Muted"]),
  createDiagnosticChip(chips.winterSeasonRed, "season", ["Winter Bright", "Winter Dark"]),
  createDiagnosticChip(chips.summerSeasonBlue, "season", ["Summer Light", "Summer Muted"]),
  createDiagnosticChip(chips.winterSeasonBlue, "season", ["Winter Bright", "Winter Dark"]),
  createDiagnosticChip(chips.summerSeasonPurple, "season", ["Summer Light", "Summer Muted"]),
  createDiagnosticChip(chips.winterSeasonPurple, "season", ["Winter Bright", "Winter Dark"]),

  createDiagnosticChip(chips.springLightPink, "detail", ["Spring Light"]),
  createDiagnosticChip(chips.springLightPeach, "detail", ["Spring Light"]),
  createDiagnosticChip(chips.springLightCreamYellow, "detail", ["Spring Light"]),
  createDiagnosticChip(chips.springLightLime, "detail", ["Spring Light"]),
  createDiagnosticChip(chips.springLightMint, "detail", ["Spring Light"]),
  createDiagnosticChip(chips.springBrightRed, "detail", ["Spring Bright"]),
  createDiagnosticChip(chips.springBrightOrange, "detail", ["Spring Bright"]),
  createDiagnosticChip(chips.springBrightYellow, "detail", ["Spring Bright"]),
  createDiagnosticChip(chips.brightSharedGreen, "detail", ["Spring Bright", "Winter Bright"]),
  createDiagnosticChip(chips.springBrightBlue, "detail", ["Spring Bright"]),
  createDiagnosticChip(chips.autumnMutedRose, "detail", ["Autumn Muted"]),
  createDiagnosticChip(chips.autumnMutedOrange, "detail", ["Autumn Muted"]),
  createDiagnosticChip(chips.autumnMutedGold, "detail", ["Autumn Muted"]),
  createDiagnosticChip(chips.autumnMutedSage, "detail", ["Autumn Muted"]),
  createDiagnosticChip(chips.autumnMutedBlue, "detail", ["Autumn Muted"]),
  createDiagnosticChip(chips.autumnDarkRed, "detail", ["Autumn Dark"]),
  createDiagnosticChip(chips.autumnDarkRust, "detail", ["Autumn Dark"]),
  createDiagnosticChip(chips.autumnDarkGold, "detail", ["Autumn Dark"]),
  createDiagnosticChip(chips.autumnDarkGreen, "detail", ["Autumn Dark"]),
  createDiagnosticChip(chips.autumnDarkTeal, "detail", ["Autumn Dark"]),
  createDiagnosticChip(chips.summerLightPink, "detail", ["Summer Light"]),
  createDiagnosticChip(chips.summerLightMint, "detail", ["Summer Light"]),
  createDiagnosticChip(chips.summerLightBlue, "detail", ["Summer Light"]),
  createDiagnosticChip(chips.summerLightLavender, "detail", ["Summer Light"]),
  createDiagnosticChip(chips.summerLightPurple, "detail", ["Summer Light"]),
  createDiagnosticChip(chips.summerMutedDustyRose, "detail", ["Summer Muted"]),
  createDiagnosticChip(chips.summerMutedGreen, "detail", ["Summer Muted"]),
  createDiagnosticChip(chips.summerMutedBlue, "detail", ["Summer Muted"]),
  createDiagnosticChip(chips.summerMutedLavender, "detail", ["Summer Muted"]),
  createDiagnosticChip(chips.summerMutedPurple, "detail", ["Summer Muted"]),
  createDiagnosticChip(chips.winterBrightPink, "detail", ["Winter Bright"]),
  createDiagnosticChip(chips.winterBrightBlue, "detail", ["Winter Bright"]),
  createDiagnosticChip(chips.winterBrightPurple, "detail", ["Winter Bright"]),
  createDiagnosticChip(chips.winterBrightMagenta, "detail", ["Winter Bright"]),
  createDiagnosticChip(chips.winterDarkWine, "detail", ["Winter Dark"]),
  createDiagnosticChip(chips.winterDarkGreen, "detail", ["Winter Dark"]),
  createDiagnosticChip(chips.winterDarkNavy, "detail", ["Winter Dark"]),
  createDiagnosticChip(chips.winterDarkPurple, "detail", ["Winter Dark"]),
  createDiagnosticChip(chips.winterDarkMagenta, "detail", ["Winter Dark"]),
];

export const colorData: ColorDataMap = {
  "Spring Light": [
    chips.springLightPink,
    chips.springLightPeach,
    chips.springLightCreamYellow,
    chips.springLightLime,
    chips.springLightMint,
  ],
  "Spring Bright": [
    chips.springBrightRed,
    chips.springBrightOrange,
    chips.springBrightYellow,
    chips.brightSharedGreen,
    chips.springBrightBlue,
  ],
  "Summer Light": [
    chips.summerLightPink,
    chips.summerLightMint,
    chips.summerLightBlue,
    chips.summerLightLavender,
    chips.summerLightPurple,
  ],
  "Summer Muted": [
    chips.summerMutedDustyRose,
    chips.summerMutedGreen,
    chips.summerMutedBlue,
    chips.summerMutedLavender,
    chips.summerMutedPurple,
  ],
  "Autumn Muted": [
    chips.autumnMutedRose,
    chips.autumnMutedOrange,
    chips.autumnMutedGold,
    chips.autumnMutedSage,
    chips.autumnMutedBlue,
  ],
  "Autumn Dark": [
    chips.autumnDarkRed,
    chips.autumnDarkRust,
    chips.autumnDarkGold,
    chips.autumnDarkGreen,
    chips.autumnDarkTeal,
  ],
  "Winter Bright": [
    chips.winterBrightPink,
    chips.brightSharedGreen,
    chips.winterBrightBlue,
    chips.winterBrightPurple,
    chips.winterBrightMagenta,
  ],
  "Winter Dark": [
    chips.winterDarkWine,
    chips.winterDarkGreen,
    chips.winterDarkNavy,
    chips.winterDarkPurple,
    chips.winterDarkMagenta,
  ],
};

export const getSimpleResultPalette = (type: SimpleResultType): ColorChip[] =>
  simpleResultTypeMeta[type].paletteTypes.flatMap((paletteType) => colorData[paletteType]);

const oppositeTypeMap: Record<PersonalColorType, PersonalColorType> = {
  "Spring Light": "Autumn Dark",
  "Spring Bright": "Autumn Muted",
  "Summer Light": "Winter Dark",
  "Summer Muted": "Winter Bright",
  "Autumn Muted": "Spring Bright",
  "Autumn Dark": "Spring Light",
  "Winter Bright": "Summer Muted",
  "Winter Dark": "Summer Light",
};

export const getOppositeType = (type: PersonalColorType): PersonalColorType => oppositeTypeMap[type];
