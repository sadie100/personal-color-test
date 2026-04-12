export type Lang = "ko" | "en";

export type Screen = "home" | "test" | "results" | "about";

export type HueCategory = "red" | "orange" | "yellow" | "green" | "blue" | "purplePink" | "neutral";

export type BaseTone = "Warm" | "Cool";

export type Season = "Spring" | "Summer" | "Autumn" | "Winter";

export type DetailTone = "Light" | "Bright" | "Muted" | "Dark";

export type PersonalColorType =
  | "Spring Light"
  | "Spring Bright"
  | "Summer Light"
  | "Summer Muted"
  | "Autumn Muted"
  | "Autumn Dark"
  | "Winter Bright"
  | "Winter Dark";

export type SimpleResultType = "Spring Warm" | "Summer Cool" | "Autumn Warm" | "Winter Cool";

export type ResultTone = PersonalColorType | SimpleResultType;

export type TestMode = "simple" | "detailed";

export type DiagnosticPhase = "base" | "season" | "detail";

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export interface ColorChip {
  id: string;
  name: string;
  nameKo: string;
  nameEn: string;
  hex: string;
  oklch: Oklch;
  hueCategory: HueCategory;
}

export interface DiagnosticChip extends ColorChip {
  diagnosticPhase: DiagnosticPhase;
  targetTypes: PersonalColorType[];
}

export type Color = ColorChip;

export type ColorDataMap = Record<PersonalColorType, ColorChip[]>;

export interface TestCompletePayload {
  mode: TestMode;
  likedChips: DiagnosticChip[];
  dislikedChips: DiagnosticChip[];
}

export type TestCompleteResult = TestCompletePayload;

export interface TestConfiguration {
  mode: TestMode;
}

export type AboutSeasonTitleKey =
  | "aboutSpringTitle"
  | "aboutSummerTitle"
  | "aboutAutumnTitle"
  | "aboutWinterTitle";

export type AboutSeasonDescKey =
  | "aboutSpringDesc"
  | "aboutSummerDesc"
  | "aboutAutumnDesc"
  | "aboutWinterDesc";

export type AboutToneTitleKey =
  | "aboutLightTitle"
  | "aboutBrightTitle"
  | "aboutMutedTitle"
  | "aboutDarkTitle";

export type AboutToneDescKey =
  | "aboutLightDesc"
  | "aboutBrightDesc"
  | "aboutMutedDesc"
  | "aboutDarkDesc";

export interface TranslationSchema {
  navAbout: string;
  navTest: string;
  subtitle: string;
  homeHeroQuote: string;
  homeHeroSubtext: string;
  homeLearnMore: string;
  featureViewColors: string;
  featureLikeDislike: string;
  featureRecommend: string;
  featureLearn: string;
  tip: string;
  startButton: string;
  liked: string;
  loading: string;
  homeButton: string;
  earlyExit: string;
  testSetupTitle: string;
  testSetupDescription: string;
  testModeTitle: string;
  testModeDescription: string;
  testModeSimple: string;
  testModeSimpleDescription: string;
  testModeSimpleCount: (count: number) => string;
  testModeDetailed: string;
  testModeDetailedDescription: string;
  testModeDetailedCount: (count: number) => string;
  testStartSelected: string;
  testCurrentMode: (label: string) => string;
  testRemainingColors: (count: number) => string;
  testIncludedPhases: string;
  hueCategoryRed: string;
  hueCategoryOrange: string;
  hueCategoryYellow: string;
  hueCategoryGreen: string;
  hueCategoryBlue: string;
  hueCategoryPurplePink: string;
  hueCategoryNeutral: string;
  yourPersonalColor: string;
  bestColor: string;
  secondBestColor: string;
  thirdBestColor: string;
  worstColor: string;
  resultPaletteIntro: string;
  paletteTitle: (label: string) => string;
  bestPaletteDescription: string;
  comparisonPaletteDescription: string;
  worstPaletteDescription: string;
  paletteContainsCount: (count: number) => string;
  likedMatchesCount: (count: number) => string;
  dislikedMatchesCount: (count: number) => string;
  likedSticker: string;
  dislikedSticker: string;
  aboutColorType: string;
  basedOn: string;
  tryAgain: string;
  shareResult: string;
  copied: string;
  shareText: (
    bestType: ResultTone,
    secondaryTypes?: ResultTone[],
    worstType?: ResultTone | null,
  ) => string;
  noLikes: string;
  warmUndertone: string;
  coolUndertone: string;
  springTrait: string;
  summerTrait: string;
  autumnTrait: string;
  winterTrait: string;
  lightTrait: string;
  brightTrait: string;
  mutedTrait: string;
  darkTrait: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutWhatIsPC: string;
  aboutWhatIsPCDesc: string;
  aboutPCCSTitle: string;
  aboutPCCSDesc: string;
  aboutPCCSImageAlt: string;
  aboutSeasonsTitle: string;
  aboutSpringTitle: string;
  aboutSpringDesc: string;
  aboutSummerTitle: string;
  aboutSummerDesc: string;
  aboutAutumnTitle: string;
  aboutAutumnDesc: string;
  aboutWinterTitle: string;
  aboutWinterDesc: string;
  aboutTonesTitle: string;
  aboutLightTitle: string;
  aboutLightDesc: string;
  aboutBrightTitle: string;
  aboutBrightDesc: string;
  aboutMutedTitle: string;
  aboutMutedDesc: string;
  aboutDarkTitle: string;
  aboutDarkDesc: string;
  aboutHowItWorks: string;
  aboutStep1: string;
  aboutStep2: string;
  aboutStep3: string;
  aboutCTA: string;
}

export type Translations = Record<Lang, TranslationSchema>;
