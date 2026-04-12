import { useMemo, useState } from "react";

import { translations } from "../i18n/translations";
import type { HueCategory, Lang, TestConfiguration, TranslationSchema } from "../types";
import { allHueCategories, getSelectedColorCount } from "../utils/testSet";
import { LangToggle } from "./LangToggle";

interface TestSetupProps {
  lang: Lang;
  onToggleLang: (newLang: Lang) => void;
  onHome: () => void;
  onStart: (configuration: TestConfiguration) => void;
}

const hueCategoryTranslationKeyMap: Record<
  HueCategory,
  | "hueCategoryRed"
  | "hueCategoryOrange"
  | "hueCategoryYellow"
  | "hueCategoryGreen"
  | "hueCategoryBlue"
  | "hueCategoryPurplePink"
  | "hueCategoryNeutral"
> = {
  red: "hueCategoryRed",
  orange: "hueCategoryOrange",
  yellow: "hueCategoryYellow",
  green: "hueCategoryGreen",
  blue: "hueCategoryBlue",
  purplePink: "hueCategoryPurplePink",
  neutral: "hueCategoryNeutral",
};

const getHueCategoryLabel = (category: HueCategory, translation: TranslationSchema): string =>
  translation[hueCategoryTranslationKeyMap[category]];

export const TestSetup = ({ lang, onToggleLang, onHome, onStart }: TestSetupProps) => {
  const t = translations[lang];
  const [selectedCategories, setSelectedCategories] = useState<HueCategory[]>([...allHueCategories]);

  const selectedColorCount = useMemo(
    () => getSelectedColorCount(selectedCategories),
    [selectedCategories],
  );

  const handleToggleCategory = (category: HueCategory) => {
    setSelectedCategories((currentCategories) => {
      if (currentCategories.includes(category)) {
        if (currentCategories.length === 1) {
          return currentCategories;
        }

        return currentCategories.filter((currentCategory) => currentCategory !== category);
      }

      return [...currentCategories, category];
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-6 text-white sm:px-6">
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between gap-2">
        <button
          onClick={onHome}
          className="rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/25 active:scale-95"
        >
          {t.homeButton}
        </button>
        <LangToggle lang={lang} onToggle={onToggleLang} />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl items-center justify-center pt-16">
        <div className="w-full rounded-3xl bg-white/15 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold sm:text-4xl">{t.testSetupTitle}</h1>
            <p className="mt-3 text-sm text-white/90 sm:text-base">{t.testSetupDescription}</p>
          </div>

          <div className="rounded-2xl bg-black/10 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{t.testCategoryTitle}</h2>
                <p className="mt-1 text-sm text-white/85">{t.testCategoryDescription}</p>
              </div>
              <div className="text-sm text-white/90 sm:text-right">
                <p>{t.testSelectedCategoryCount(selectedCategories.length)}</p>
                <p>{t.testSelectedColorCount(selectedColorCount)}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allHueCategories.map((category) => {
                const isSelected = selectedCategories.includes(category);

                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleToggleCategory(category)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-white bg-white/20 shadow-md"
                        : "border-white/20 bg-black/10 text-white/75 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{getHueCategoryLabel(category, t)}</span>
                  </button>
                );
              })}
            </div>

            {selectedCategories.length === 0 && <p className="mt-4 text-sm text-red-100">{t.testCategoryRequired}</p>}
          </div>

          <button
            type="button"
            onClick={() =>
              onStart({
                selectedCategories,
              })
            }
            disabled={selectedCategories.length === 0}
            className="mt-8 w-full rounded-full bg-white px-6 py-4 text-base font-bold text-purple-700 shadow-lg transition hover:scale-[1.01] hover:bg-purple-50 disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-purple-300 disabled:hover:scale-100"
          >
            {t.testStartSelected}
          </button>
        </div>
      </div>
    </div>
  );
};
