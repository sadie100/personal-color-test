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

const hasMatchingBaseTone = (chip: DiagnosticChip, baseTone: BaseTone): boolean =>
  chip.targetTypes.every((type) => personalColorTypeMeta[type].baseTone === baseTone);

const hasMatchingSeason = (chip: DiagnosticChip, season: Season): boolean =>
  chip.targetTypes.every((type) => personalColorTypeMeta[type].season === season);

const chips = {
  warmPink: createChip("base-warm-pink", "페일 살몬", "Pale Salmon", "#FDB5A9", { l: 0.837, c: 0.086, h: 29.6 }, "red"),
  coolPink: createChip("base-cool-pink", "소프트 핑크", "Soft Pink", "#FFACB9", { l: 0.828, c: 0.099, h: 9.2 }, "purplePink"),
  warmYellow: createChip("base-warm-yellow", "라이트 옐로우", "Light Yellow", "#FFF382", { l: 0.951, c: 0.135, h: 103.2 }, "yellow"),
  coolYellow: createChip("base-cool-yellow", "라이트 레몬", "Light Lemon", "#FAFF7B", { l: 0.971, c: 0.155, h: 110.9 }, "yellow"),
  warmGreen: createChip("base-warm-green", "라이트 옐로우 그린", "Light Yellow Green", "#D1FE7E", { l: 0.939, c: 0.163, h: 125.4 }, "green"),
  coolGreen: createChip("base-cool-green", "라이트 씨 그린", "Light Sea Green", "#95F8B9", { l: 0.902, c: 0.128, h: 155 }, "green"),
  warmBlue: createChip("base-warm-blue", "라이트 시안", "Light Cyan", "#95FFFA", { l: 0.935, c: 0.099, h: 191.7 }, "blue"),
  coolBlue: createChip("base-cool-blue", "로빈 에그 블루", "Robin's Egg Blue", "#AEE1F8", { l: 0.882, c: 0.061, h: 227.3 }, "blue"),
  ivory: createChip("base-ivory", "오프 화이트", "Off White", "#FEF9DD", { l: 0.979, c: 0.037, h: 98.7 }, "neutral"),
  whiteBasic: createChip("base-white", "아이스 그레이", "Ice Grey", "#F4FCFF", { l: 0.986, c: 0.009, h: 222.1 }, "neutral"),

  springSeasonRed: createChip("season-spring-red", "라이트 피치", "Light Peach", "#FFDACA", { l: 0.915, c: 0.047, h: 44.7 }, "red"),
  autumnSeasonRed: createChip("season-autumn-red", "카민", "Carmine", "#A00605", { l: 0.446, c: 0.18, h: 29 }, "red"),
  springSeasonOrange: createChip("season-spring-orange", "위트", "Wheat", "#FFDD8C", { l: 0.909, c: 0.107, h: 87.5 }, "orange"),
  autumnSeasonOrange: createChip("season-autumn-orange", "번트 오렌지", "Burnt Orange", "#BF4E14", { l: 0.565, c: 0.159, h: 42.8 }, "orange"),
  springSeasonGreen: createChip("season-spring-green", "라이트 그래스 그린", "Light Grass Green", "#9CFD5F", { l: 0.903, c: 0.213, h: 135.4 }, "green"),
  autumnSeasonGreen: createChip("season-autumn-green", "다키시 그린", "Darkish Green", "#35721B", { l: 0.493, c: 0.135, h: 138.1 }, "green"),
  summerSeasonRed: createChip("season-summer-red", "베리 라이트 퍼플", "Very Light Purple", "#FFC7EA", { l: 0.889, c: 0.078, h: 340.9 }, "purplePink"),
  winterSeasonRed: createChip("season-winter-red", "크랜베리", "Cranberry", "#9E0030", { l: 0.444, c: 0.178, h: 16 }, "red"),
  summerSeasonBlue: createChip("season-summer-blue", "페일 스카이 블루", "Pale Sky Blue", "#C6E7FF", { l: 0.912, c: 0.048, h: 239.7 }, "blue"),
  winterSeasonBlue: createChip("season-winter-blue", "로열", "Royal", "#011893", { l: 0.321, c: 0.194, h: 264.3 }, "blue"),
  summerSeasonPurple: createChip("season-summer-purple", "페일 라벤더", "Pale Lavender", "#E8D6FB", { l: 0.902, c: 0.053, h: 307.2 }, "purplePink"),
  winterSeasonPurple: createChip("season-winter-purple", "인디고", "Indigo", "#521B93", { l: 0.383, c: 0.179, h: 297.9 }, "purplePink"),

  springLightPink: createChip("detail-spring-light-pink", "라이트 피치", "Light Peach", "#FFDACA", { l: 0.915, c: 0.047, h: 44.7 }, "purplePink"),
  springLightPeach: createChip("detail-spring-light-peach", "페일 피치", "Pale Peach", "#FEE0AC", { l: 0.919, c: 0.075, h: 81.2 }, "orange"),
  springLightCreamYellow: createChip("detail-spring-light-cream-yellow", "라이트 탠", "Light Tan", "#FEEFB1", { l: 0.95, c: 0.08, h: 96.1 }, "yellow"),
  springLightLime: createChip("detail-spring-light-lime", "라이트 라이트 그린", "Light Light Green", "#D7FAA3", { l: 0.94, c: 0.117, h: 126.4 }, "green"),
  springLightMint: createChip("detail-spring-light-mint", "페일 아쿠아", "Pale Aqua", "#B1FBEA", { l: 0.935, c: 0.077, h: 178.6 }, "green"),

  springBrightRed: createChip("detail-spring-bright-red", "코랄", "Coral", "#FF5747", { l: 0.682, c: 0.206, h: 29 }, "red"),
  springBrightOrange: createChip("detail-spring-bright-orange", "버터스카치", "Butterscotch", "#FFB645", { l: 0.826, c: 0.15, h: 74.3 }, "orange"),
  springBrightYellow: createChip("detail-spring-bright-yellow", "선 옐로우", "Sun Yellow", "#FFE434", { l: 0.914, c: 0.178, h: 99.8 }, "yellow"),
  brightSharedGreen: createChip("detail-bright-green", "틸리시 그린", "Tealish Green", "#00D662", { l: 0.765, c: 0.212, h: 149.7 }, "green"),
  springBrightBlue: createChip("detail-spring-bright-blue", "브라이트 스카이 블루", "Bright Sky Blue", "#19CBFF", { l: 0.785, c: 0.146, h: 225.4 }, "blue"),

  autumnMutedRose: createChip("detail-autumn-muted-rose", "블러쉬", "Blush", "#E99582", { l: 0.751, c: 0.106, h: 33.4 }, "red"),
  autumnMutedOrange: createChip("detail-autumn-muted-orange", "데저트", "Desert", "#DEA749", { l: 0.763, c: 0.127, h: 78 }, "orange"),
  autumnMutedGold: createChip("detail-autumn-muted-gold", "그리니시 베이지", "Greenish Beige", "#D4C753", { l: 0.818, c: 0.137, h: 102.9 }, "yellow"),
  autumnMutedSage: createChip("detail-autumn-muted-sage", "라이켄", "Lichen", "#8AB77C", { l: 0.732, c: 0.096, h: 138.4 }, "green"),
  autumnMutedBlue: createChip("detail-autumn-muted-blue", "그레이 블루", "Greyblue", "#66AFBA", { l: 0.71, c: 0.075, h: 208 }, "blue"),

  autumnDarkRed: createChip("detail-autumn-dark-red", "브라운 레드", "Brown Red", "#962B15", { l: 0.452, c: 0.146, h: 33.3 }, "red"),
  autumnDarkRust: createChip("detail-autumn-dark-rust", "웜 브라운", "Warm Brown", "#984800", { l: 0.495, c: 0.127, h: 51.9 }, "orange"),
  autumnDarkGold: createChip("detail-autumn-dark-gold", "머스타드 브라운", "Mustard Brown", "#A18200", { l: 0.618, c: 0.126, h: 91.9 }, "yellow"),
  autumnDarkGreen: createChip("detail-autumn-dark-green", "딥 그린", "Deep Green", "#276106", { l: 0.437, c: 0.131, h: 137.8 }, "green"),
  autumnDarkTeal: createChip("detail-autumn-dark-teal", "페트롤", "Petrol", "#005D6E", { l: 0.441, c: 0.078, h: 215.8 }, "blue"),

  summerLightPink: createChip("detail-summer-light-pink", "페일 핑크", "Pale Pink", "#FFCADC", { l: 0.89, c: 0.064, h: 356.2 }, "purplePink"),
  summerLightMint: createChip("detail-summer-light-mint", "페일 터쿼이즈", "Pale Turquoise", "#B6FCD9", { l: 0.935, c: 0.084, h: 162.5 }, "green"),
  summerLightBlue: createChip("detail-summer-light-blue", "페일 스카이 블루", "Pale Sky Blue", "#C6E7FF", { l: 0.912, c: 0.048, h: 239.7 }, "blue"),
  summerLightLavender: createChip("detail-summer-light-lavender", "페일 라벤더", "Pale Lavender", "#DDD5FC", { l: 0.892, c: 0.054, h: 294.7 }, "purplePink"),
  summerLightPurple: createChip("detail-summer-light-purple", "베리 라이트 퍼플", "Very Light Purple", "#F4D4FB", { l: 0.908, c: 0.062, h: 320.2 }, "purplePink"),

  summerMutedDustyRose: createChip("detail-summer-muted-dusty-rose", "소프트 핑크", "Soft Pink", "#E7B5CA", { l: 0.824, c: 0.064, h: 351.5 }, "red"),
  summerMutedGreen: createChip("detail-summer-muted-green", "민트 블루", "Mint Blue", "#75D1A5", { l: 0.791, c: 0.11, h: 161.7 }, "green"),
  summerMutedBlue: createChip("detail-summer-muted-blue", "라이트 그레이 블루", "Light Grey Blue", "#91C0DE", { l: 0.785, c: 0.066, h: 236.7 }, "blue"),
  summerMutedLavender: createChip("detail-summer-muted-lavender", "파스텔 블루", "Pastel Blue", "#B6B7E8", { l: 0.795, c: 0.069, h: 283.8 }, "purplePink"),
  summerMutedPurple: createChip("detail-summer-muted-purple", "페일 바이올렛", "Pale Violet", "#CCB1D9", { l: 0.796, c: 0.063, h: 314.8 }, "purplePink"),

  winterBrightPink: createChip("detail-winter-bright-pink", "바비 핑크", "Barbie Pink", "#FF35A1", { l: 0.674, c: 0.248, h: 353.9 }, "purplePink"),
  winterBrightGreen: createChip("detail-winter-bright-green", "알게 그린", "Algae Green", "#00C061", { l: 0.707, c: 0.187, h: 151.7 }, "green"),
  winterBrightBlue: createChip("detail-winter-bright-blue", "일렉트릭 블루", "Electric Blue", "#005CFF", { l: 0.545, c: 0.252, h: 262 }, "blue"),
  winterBrightPurple: createChip("detail-winter-bright-purple", "일렉트릭 퍼플", "Electric Purple", "#A317FF", { l: 0.578, c: 0.291, h: 304.6 }, "purplePink"),
  winterBrightMagenta: createChip("detail-winter-bright-magenta", "핫 퍼플", "Hot Purple", "#CC00F4", { l: 0.619, c: 0.299, h: 318.7 }, "purplePink"),

  winterDarkWine: createChip("detail-winter-dark-wine", "레드 퍼플", "Red Purple", "#89034A", { l: 0.411, c: 0.165, h: 358.1 }, "red"),
  winterDarkGreen: createChip("detail-winter-dark-green", "에버그린", "Evergreen", "#003A26", { l: 0.308, c: 0.067, h: 163.1 }, "green"),
  winterDarkNavy: createChip("detail-winter-dark-navy", "로열", "Royal", "#011893", { l: 0.321, c: 0.194, h: 264.3 }, "blue"),
  winterDarkPurple: createChip("detail-winter-dark-purple", "인디고", "Indigo", "#521B93", { l: 0.383, c: 0.179, h: 297.9 }, "purplePink"),
  winterDarkMagenta: createChip("detail-winter-dark-magenta", "다키시 퍼플", "Darkish Purple", "#6F0072", { l: 0.382, c: 0.177, h: 327 }, "purplePink"),
};

export const simpleDiagnosticChips: DiagnosticChip[] = [
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
];

export const detailedDiagnosticChips: DiagnosticChip[] = [
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

export const diagnosticChips: DiagnosticChip[] = [...simpleDiagnosticChips, ...detailedDiagnosticChips];

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

export const getSimpleResultDiagnosticChips = (type: SimpleResultType): DiagnosticChip[] => {
  const { baseTone, season } = simpleResultTypeMeta[type];

  return simpleDiagnosticChips.filter((chip) => {
    if (chip.diagnosticPhase === "base") {
      return hasMatchingBaseTone(chip, baseTone);
    }

    if (chip.diagnosticPhase === "season") {
      return hasMatchingSeason(chip, season);
    }

    return false;
  });
};

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
