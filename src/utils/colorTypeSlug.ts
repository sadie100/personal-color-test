import type { ColorTypeSlug, PersonalColorType } from "../types";

const TYPE_TO_SLUG: Record<PersonalColorType, ColorTypeSlug> = {
  "Spring Light": "spring-light",
  "Spring Bright": "spring-bright",
  "Summer Light": "summer-light",
  "Summer Muted": "summer-muted",
  "Autumn Muted": "autumn-muted",
  "Autumn Dark": "autumn-dark",
  "Winter Bright": "winter-bright",
  "Winter Dark": "winter-dark",
};

const SLUG_TO_TYPE: Record<ColorTypeSlug, PersonalColorType> = {
  "spring-light": "Spring Light",
  "spring-bright": "Spring Bright",
  "summer-light": "Summer Light",
  "summer-muted": "Summer Muted",
  "autumn-muted": "Autumn Muted",
  "autumn-dark": "Autumn Dark",
  "winter-bright": "Winter Bright",
  "winter-dark": "Winter Dark",
};

export const colorTypeSlugs: ColorTypeSlug[] = [
  "spring-light",
  "spring-bright",
  "summer-light",
  "summer-muted",
  "autumn-muted",
  "autumn-dark",
  "winter-bright",
  "winter-dark",
];

export const toSlug = (type: PersonalColorType): ColorTypeSlug => TYPE_TO_SLUG[type];

export const fromSlug = (slug: string): ColorTypeSlug | null =>
  slug in SLUG_TO_TYPE ? (slug as ColorTypeSlug) : null;

export const slugToType = (slug: ColorTypeSlug): PersonalColorType => SLUG_TO_TYPE[slug];
