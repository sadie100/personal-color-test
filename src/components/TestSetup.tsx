import { useMemo, useState } from "react";

import { translations } from "../i18n/translations";
import type { Lang, TestConfiguration, TestMode } from "../types";
import { getSelectedColorCount } from "../utils/testSet";
import { LangToggle } from "./LangToggle";

interface TestSetupProps {
  lang: Lang;
  onToggleLang: (newLang: Lang) => void;
  onHome: () => void;
  onStart: (configuration: TestConfiguration) => void;
}

export const TestSetup = ({ lang, onToggleLang, onHome, onStart }: TestSetupProps) => {
  const t = translations[lang];
  const [selectedMode, setSelectedMode] = useState<TestMode>("simple");

  const simpleColorCount = useMemo(() => getSelectedColorCount("simple"), []);
  const detailedColorCount = useMemo(() => getSelectedColorCount("detailed"), []);

  const modeCards: Array<{
    mode: TestMode;
    title: string;
    description: string;
    countLabel: string;
  }> = [
    {
      mode: "simple",
      title: t.test.mode.simple.label,
      description: t.test.mode.simple.description,
      countLabel: t.test.mode.simple.count(simpleColorCount),
    },
    {
      mode: "detailed",
      title: t.test.mode.detailed.label,
      description: t.test.mode.detailed.description,
      countLabel: t.test.mode.detailed.count(detailedColorCount),
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-6 text-white sm:px-6">
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between gap-2">
        <button
          onClick={onHome}
          className="rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/25 active:scale-95"
        >
          {t.test.home}
        </button>
        <LangToggle lang={lang} onToggle={onToggleLang} />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl items-center justify-center pt-16">
        <div className="w-full rounded-3xl bg-white/15 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold sm:text-4xl">{t.test.setup.title}</h1>
            <p className="mt-3 text-sm text-white/90 sm:text-base">{t.test.setup.description}</p>
          </div>

          <div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {modeCards.map((card) => {
                const isSelected = selectedMode === card.mode;

                return (
                  <button
                    key={card.mode}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedMode(card.mode)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-white bg-white/20 shadow-md"
                        : "border-white/20 bg-black/10 text-white/75 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-lg font-semibold">{card.title}</span>
                    <span className="mt-2 block text-sm text-white/85">{card.description}</span>
                    <span className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/95">
                      {card.countLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onStart({
                mode: selectedMode,
              })
            }
            className="mt-8 w-full rounded-full bg-white px-6 py-4 text-base font-bold text-purple-700 shadow-lg transition hover:scale-[1.01] hover:bg-purple-50 disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-purple-300 disabled:hover:scale-100"
          >
            {t.test.mode.startSelected}
          </button>
        </div>
      </div>
    </div>
  );
};
