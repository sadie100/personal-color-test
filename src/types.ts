export type Lang = "ko" | "en";

export type Screen = "home" | "test" | "results" | "about";

export type TestPreset = "full" | "core";

export type HueCategory = "red" | "orange" | "yellow" | "green" | "blue" | "purplePink" | "neutral";

export type SeasonTone =
  | "Spring Light"
  | "Spring Bright"
  | "Spring Muted"
  | "Summer Light"
  | "Summer Bright"
  | "Summer Muted"
  | "Autumn Light"
  | "Autumn Bright"
  | "Autumn Muted"
  | "Winter Light"
  | "Winter Bright"
  | "Winter Muted";

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export interface Color {
  name: string;
  hex: string;
  hsl: Hsl;
}

export interface ColorWithSeason extends Color {
  seasonTone: SeasonTone;
}

export type ColorDataMap = Record<SeasonTone, Color[]>;

export interface TestCompletePayload {
  likedColors: ColorWithSeason[];
  dislikedColors: ColorWithSeason[];
}

export type TestCompleteResult = TestCompletePayload | ColorWithSeason[];

export interface TestConfiguration {
  preset: TestPreset;
  selectedCategories: HueCategory[];
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

export type AboutToneTitleKey = "aboutLightTitle" | "aboutBrightTitle" | "aboutMutedTitle";

export type AboutToneDescKey = "aboutLightDesc" | "aboutBrightDesc" | "aboutMutedDesc";

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
  testPresetHelper: string;
  testPresetFull: string;
  testPresetFullDescription: string;
  testPresetCore: string;
  testPresetCoreDescription: string;
  testCategoryTitle: string;
  testCategoryDescription: string;
  testCategoryRequired: string;
  testSelectedColorCount: (count: number) => string;
  testSelectedCategoryCount: (count: number) => string;
  testStartSelected: string;
  testCurrentCategory: (label: string) => string;
  testRemainingColors: (count: number) => string;
  testRemainingInCategory: (count: number) => string;
  testCategoryOrderTitle: string;
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
    bestType: SeasonTone,
    secondaryTypes?: SeasonTone[],
    worstType?: SeasonTone | null,
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
  aboutHowItWorks: string;
  aboutStep1: string;
  aboutStep2: string;
  aboutStep3: string;
  aboutCTA: string;
}

export type Translations = Record<Lang, TranslationSchema>;
