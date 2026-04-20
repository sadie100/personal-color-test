export type Lang = "ko" | "en";

export type Screen = "home" | "test" | "results" | "about" | "types";

export type ColorTypeSlug =
  | "spring-light"
  | "spring-bright"
  | "summer-light"
  | "summer-muted"
  | "autumn-muted"
  | "autumn-dark"
  | "winter-bright"
  | "winter-dark";

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

export type AboutSeasonSlug = "spring" | "summer" | "autumn" | "winter";
export type AboutToneSlug = "light" | "bright" | "muted" | "dark";

export interface TranslationSchema {
  nav: NavNamespace;
  home: HomeNamespace;
  test: TestNamespace;
  hueCategory: HueCategoryNamespace;
  results: ResultsNamespace;
  undertone: UndertoneNamespace;
  traits: TraitsNamespace;
  about: AboutNamespace;
  styling: StylingNamespace;
  types: TypesNamespace;
  attribution: AttributionNamespace;
}

export interface NavNamespace {
  about: string;
  test: string;
  types: string;
}

export interface HomeFeaturesCopy {
  viewColors: string;
  likeDislike: string;
  recommend: string;
  learn: string;
}

export interface HomeHeroCopy {
  quote: string;
  subtext: string;
}

export interface HomeNamespace {
  subtitle: string;
  hero: HomeHeroCopy;
  learnMore: string;
  startButton: string;
  features: HomeFeaturesCopy;
  tip: string;
}

export interface TestModeVariantCopy {
  label: string;
  description: string;
  count: (count: number) => string;
}

export interface TestModeCopy {
  title: string;
  description: string;
  simple: TestModeVariantCopy;
  detailed: TestModeVariantCopy;
  startSelected: string;
}

export interface TestSetupCopy {
  title: string;
  description: string;
}

export interface TestProgressCopy {
  current: (label: string) => string;
  remaining: (count: number) => string;
  phases: string;
}

export interface TestNamespace {
  start: string;
  earlyExit: string;
  loading: string;
  liked: string;
  home: string;
  setup: TestSetupCopy;
  mode: TestModeCopy;
  progress: TestProgressCopy;
}

export interface HueCategoryNamespace {
  red: string;
  orange: string;
  yellow: string;
  green: string;
  blue: string;
  purplePink: string;
  neutral: string;
}

export interface ResultsPaletteDescriptions {
  best: string;
  comparison: string;
  worst: string;
}

export interface ResultsSimpleDiagnostics {
  best: string;
  worst: string;
}

export interface ResultsBadgesCopy {
  paletteCount: (count: number) => string;
  likedCount: (count: number) => string;
  dislikedCount: (count: number) => string;
  liked: string;
  disliked: string;
}

export interface ResultsNamespace {
  header: string;
  best: string;
  second: string;
  third: string;
  worst: string;
  paletteIntro: string;
  simpleIntro: string;
  paletteTitle: (label: string) => string;
  diagnosticChipTitle: (label: string) => string;
  paletteDescriptions: ResultsPaletteDescriptions;
  simpleDiagnostics: ResultsSimpleDiagnostics;
  badges: ResultsBadgesCopy;
  analysisTitle: string;
  analysisIntro: string;
  tryAgain: string;
  share: string;
  copied: string;
  shareText: (
    bestType: ResultTone,
    secondaryTypes?: ResultTone[],
    worstType?: ResultTone | null,
  ) => string;
  noLikes: string;
}

export interface UndertoneNamespace {
  warm: string;
  cool: string;
}

export interface TraitsNamespace {
  spring: string;
  summer: string;
  autumn: string;
  winter: string;
  light: string;
  bright: string;
  muted: string;
  dark: string;
}

export interface AboutSectionCopy {
  title: string;
  desc: string;
}

export interface AboutPccsCopy extends AboutSectionCopy {
  imageAlt: string;
}

export interface AboutSeasonsCopy {
  title: string;
  spring: AboutSectionCopy;
  summer: AboutSectionCopy;
  autumn: AboutSectionCopy;
  winter: AboutSectionCopy;
}

export interface AboutTonesCopy {
  title: string;
  light: AboutSectionCopy;
  bright: AboutSectionCopy;
  muted: AboutSectionCopy;
  dark: AboutSectionCopy;
}

export interface AboutHowItWorksCopy {
  title: string;
  step1: string;
  step2: string;
  step3: string;
}

export interface AboutNamespace {
  title: string;
  intro: string;
  whatIs: AboutSectionCopy;
  pccs: AboutPccsCopy;
  seasons: AboutSeasonsCopy;
  tones: AboutTonesCopy;
  howItWorks: AboutHowItWorksCopy;
  cta: string;
}

export interface StylingNamespace {
  title: string;
  subtitle: (type: string) => string;
  fabric: string;
  pattern: string;
  accessory: string;
  hair: string;
  makeup: string;
  keywords: string;
  skin: string;
  lip: string;
  eye: string;
  metal: string;
  accessorySize: string;
  sourceNote: string;
}

export interface TypeAttributesCopy {
  base: string;
  brightness: string;
  chroma: string;
  clarity: string;
}

export interface TypeContentCopy {
  title: string;
  tagline: string;
  summary: string;
  quote: string;
  attributes: TypeAttributesCopy;
  keywords: string[];
}

export interface TypeDetailCopy {
  baseLabel: string;
  brightnessLabel: string;
  chromaLabel: string;
  clarityLabel: string;
  keywordsLabel: string;
  pccsLabel: string;
  paletteLabel: string;
  beautyTitle: string;
  fashionTitle: string;
  prev: string;
  next: string;
  backToList: string;
  heroMetaSeason: (season: string) => string;
  heroMetaBase: (base: string) => string;
  heroMetaTone: (tone: string) => string;
}

export interface TypesNamespace {
  pageTitle: string;
  pageSubtitle: string;
  pageIntro: string;
  warmGroupTitle: string;
  warmGroupDesc: string;
  coolGroupTitle: string;
  coolGroupDesc: string;
  cardViewDetail: string;
  detail: TypeDetailCopy;
  "spring-light": TypeContentCopy;
  "spring-bright": TypeContentCopy;
  "summer-light": TypeContentCopy;
  "summer-muted": TypeContentCopy;
  "autumn-muted": TypeContentCopy;
  "autumn-dark": TypeContentCopy;
  "winter-bright": TypeContentCopy;
  "winter-dark": TypeContentCopy;
}

export interface AttributionNamespace {
  heading: string;
  line: string;
  source: string;
}

export type Translations = Record<Lang, TranslationSchema>;
