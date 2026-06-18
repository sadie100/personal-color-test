import { useMemo, useState } from "react";

import { translations } from "../i18n/translations";
import type { Lang, TestConfiguration, TestDisplayMode, TestMode } from "../types";
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
  const [selectedMode, setSelectedMode] = useState<TestMode>("detailed");
  const [selectedDisplay, setSelectedDisplay] = useState<TestDisplayMode>("camera");

  const displayOptions: Array<{
    value: TestDisplayMode;
    label: string;
    description: string;
  }> = [
    {
      value: "camera",
      label: t.test.display.camera.label,
      description: t.test.display.camera.description,
    },
    {
      value: "chip",
      label: t.test.display.chip.label,
      description: t.test.display.chip.description,
    },
  ];

  const simpleColorCount = useMemo(() => getSelectedColorCount("simple"), []);
  const detailedColorCount = useMemo(() => getSelectedColorCount("detailed"), []);

  const modeCards: Array<{
    mode: TestMode;
    title: string;
    description: string;
    countLabel: string;
    recommended?: string;
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
      recommended: t.test.mode.detailed.recommended,
    },
  ];

  return (
    <div className="bg-paper text-ink relative min-h-screen w-full px-4 py-6 sm:px-6">
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between gap-2">
        <button
          onClick={onHome}
          className="border-hairline bg-surface text-ink hover:bg-hairline/40 rounded-lg border px-4 py-2 text-sm font-semibold transition active:scale-95"
        >
          {t.test.home}
        </button>
        <LangToggle lang={lang} onToggle={onToggleLang} />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl items-center justify-center pt-16">
        <div className="border-hairline bg-surface w-full rounded-3xl border p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="font-display text-ink text-3xl sm:text-4xl">{t.test.setup.title}</h1>
            <p className="text-ink-2 mt-3 text-sm sm:text-base">{t.test.setup.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-ink-3 mb-3 text-sm font-semibold tracking-wide uppercase">
              {t.test.display.title}
            </h2>
            <div
              role="radiogroup"
              aria-label={t.test.display.title}
              className="border-hairline bg-paper grid grid-cols-2 gap-2 rounded-2xl border p-1.5"
            >
              {displayOptions.map((option) => {
                const isSelected = selectedDisplay === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedDisplay(option.value)}
                    className={`rounded-xl px-3 py-2.5 text-center transition ${
                      isSelected ? "bg-accent text-accent-fg" : "text-ink-2 hover:bg-hairline/40"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span
                      className={`mt-1 block text-xs ${
                        isSelected ? "text-accent-fg/80" : "text-ink-3"
                      }`}
                    >
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div
              role="radiogroup"
              aria-label={t.test.setup.title}
              className="mt-5 grid gap-3 sm:grid-cols-5"
            >
              {modeCards.map((card) => {
                const isSelected = selectedMode === card.mode;
                const isRecommended = Boolean(card.recommended);

                return (
                  <button
                    key={card.mode}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedMode(card.mode)}
                    className={[
                      "rounded-2xl border px-4 py-4 text-left transition",
                      isRecommended ? "sm:col-span-3" : "sm:col-span-2",
                      isSelected
                        ? "border-ink bg-paper shadow-sm"
                        : "border-hairline bg-surface text-ink-2 hover:border-ink/40",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-ink block text-lg font-semibold">{card.title}</span>
                      {isRecommended && (
                        <span className="bg-accent text-accent-fg rounded-full px-2.5 py-0.5 text-xs font-bold">
                          {card.recommended}
                        </span>
                      )}
                    </span>
                    <span className="text-ink-2 mt-2 block text-sm">{card.description}</span>
                    <span className="border-hairline text-ink-3 mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold">
                      {card.countLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <section
            aria-label={t.test.setup.howTo.title}
            className="border-hairline bg-paper mt-6 rounded-2xl border p-4 sm:p-5"
          >
            <h3 className="text-ink-3 text-sm font-semibold tracking-wide uppercase">
              {t.test.setup.howTo.title}
            </h3>
            <ul className="text-ink-2 mt-3 space-y-2.5 text-sm leading-relaxed">
              <li className="flex gap-3">
                <span aria-hidden className="mt-0.5 text-base">
                  ↔
                </span>
                <span>{t.test.setup.howTo.swipe}</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-0.5 text-base">
                  ✦
                </span>
                <span>{t.test.setup.howTo.judge}</span>
              </li>
            </ul>
          </section>

          <button
            type="button"
            onClick={() =>
              onStart({
                mode: selectedMode,
                displayMode: selectedDisplay,
              })
            }
            className="bg-accent text-accent-fg mt-6 w-full rounded-lg px-6 py-4 text-base font-bold transition hover:opacity-90 active:scale-95"
          >
            {t.test.mode.startSelected}
          </button>
        </div>
      </div>
    </div>
  );
};
