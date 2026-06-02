import { AttributionNote } from "../components/AttributionNote";
import { colorData, personalColorTypes } from "../data/colorData";
import { translations } from "../i18n/translations";
import type { Lang } from "../types";

interface HomeProps {
  onStart: () => void;
  lang: Lang;
  onAbout: () => void;
}

// 8개 퍼스널 컬러 타입에서 각 2색씩 = 16개 실 데이터 미리보기
const heroChips = personalColorTypes.flatMap((type) => colorData[type].slice(0, 2));

export const Home = ({ onStart, lang, onAbout }: HomeProps) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen w-full bg-paper px-4 pt-24 pb-16">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
        <div className="text-left">
          <h1 className="font-display text-5xl leading-tight break-keep text-ink md:text-6xl">
            {t.home.hero.quote}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed break-keep text-ink-2 md:text-lg">
            {t.home.hero.subtext}
          </p>
          <p className="mt-3 text-sm text-ink-3">{t.home.subtitle}</p>

          <div className="mt-8 flex flex-col items-start gap-3">
            <button
              onClick={onStart}
              className="cursor-pointer rounded-lg bg-accent px-8 py-4 text-base font-bold text-accent-fg transition-transform hover:opacity-90 active:scale-95"
            >
              {t.home.startButton}
            </button>
            <button
              onClick={onAbout}
              className="cursor-pointer text-sm text-ink-2 underline underline-offset-4 transition-colors hover:text-ink"
            >
              {t.home.learnMore}
            </button>
          </div>
        </div>

        <div aria-hidden className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {heroChips.map((chip, index) => (
            <div
              key={`${chip.hex}-${index}`}
              className="aspect-square rounded-xl border border-hairline shadow-sm"
              style={{ backgroundColor: chip.hex }}
            />
          ))}
        </div>
      </div>

      <AttributionNote lang={lang} variant="light" className="mt-16" />
    </div>
  );
};
