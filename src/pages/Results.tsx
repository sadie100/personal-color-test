import { useState } from "react";

import { StylingRecommendations } from "../components/StylingRecommendations";
import {
  colorData,
  getChipName,
  getPersonalColorTypeLabel,
  getSimpleResultDiagnosticChips,
  getSimpleResultTypeLabel,
  personalColorTypeMeta,
  simpleResultTypeMeta,
} from "../data/colorData";
import { translations } from "../i18n/translations";
import {
  analyzePersonalColor,
  analyzeSimplePersonalColor,
  getBestResults,
  getWorstResult,
  getWorstSimpleResult,
} from "../utils/analyzer";
import type {
  BaseTone,
  ColorChip,
  DetailTone,
  DiagnosticChip,
  Lang,
  PersonalColorType,
  Season,
  SimpleResultType,
  TestMode,
  TranslationSchema,
} from "../types";

type BadgeMode = "liked" | "disliked";
type MetaTone = "default" | BadgeMode;
type ToneCardVariant = "best" | "second" | "third" | "worst";

interface ResultsProps {
  mode: TestMode;
  likedChips: DiagnosticChip[];
  dislikedChips?: DiagnosticChip[];
  onRetry: () => void;
  lang: Lang;
  shareUrl?: string;
}

interface ToneCardStyle {
  containerClass: string;
  labelClass: string;
  valueClass: string;
  badgeClass: string;
  borderClass: string;
}

interface ToneCardData extends ToneCardStyle {
  id: string;
  label: string;
  displayName: string;
  paletteColors: ReadonlyArray<ColorChip>;
  previewColors: ReadonlyArray<ColorChip>;
  season: Season;
  baseTone: BaseTone;
  detailTone?: DetailTone;
}

interface ResultToneCardProps {
  card: ToneCardData;
  lang: Lang;
  className?: string;
  toneClassName?: string;
}

interface PaletteSectionProps {
  title: string;
  description: string;
  badgeText: string;
  paletteColors: ReadonlyArray<ColorChip>;
  badgeClass: string;
  borderClass: string;
  likedSelectionSet: ReadonlySet<string>;
  dislikedSelectionSet: ReadonlySet<string>;
  badgeMode?: BadgeMode;
  t: TranslationSchema;
  lang: Lang;
  muted?: boolean;
  insideCard?: boolean;
}

interface MetaPillProps {
  text: string;
  tone?: MetaTone;
}

interface StickerBadgeProps {
  label: string;
  tone: BadgeMode;
}

const buildSelectionSet = (chips: ReadonlyArray<DiagnosticChip>): Set<string> =>
  new Set(chips.map((chip) => chip.hex));

const isToneCardData = (card: ToneCardData | null): card is ToneCardData => card !== null;

const toneCardStyles: Record<ToneCardVariant, ToneCardStyle> = {
  best: {
    containerClass:
      "border-blue-100 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-lg shadow-blue-100/60",
    labelClass: "text-blue-600",
    valueClass: "text-slate-900",
    badgeClass: "bg-blue-100 text-blue-700",
    borderClass: "border-blue-200",
  },
  second: {
    containerClass: "border-indigo-100 bg-indigo-50/80 shadow-sm shadow-indigo-100/60",
    labelClass: "text-indigo-600",
    valueClass: "text-indigo-950",
    badgeClass: "bg-indigo-100 text-indigo-700",
    borderClass: "border-indigo-200",
  },
  third: {
    containerClass: "border-sky-100 bg-sky-50/80 shadow-sm shadow-sky-100/60",
    labelClass: "text-sky-600",
    valueClass: "text-sky-950",
    badgeClass: "bg-sky-100 text-sky-700",
    borderClass: "border-sky-200",
  },
  worst: {
    containerClass: "border-red-100 bg-red-50/85 shadow-sm shadow-red-100/60",
    labelClass: "text-red-600",
    valueClass: "text-red-950",
    badgeClass: "bg-red-100 text-red-700",
    borderClass: "border-red-200",
  },
};

export const Results = ({
  mode,
  likedChips,
  dislikedChips = [],
  onRetry,
  lang,
  shareUrl,
}: ResultsProps) => {
  const t = translations[lang];
  const [selectedPaletteToneId, setSelectedPaletteToneId] = useState<string | null>(null);

  const likedSelectionSet = buildSelectionSet(likedChips);
  const dislikedSelectionSet = buildSelectionSet(dislikedChips);

  const buildDetailedCard = (tone: PersonalColorType, label: string, variant: ToneCardVariant): ToneCardData => {
    const meta = personalColorTypeMeta[tone];
    const paletteColors = colorData[tone];

    return {
      id: tone,
      label,
      displayName: getPersonalColorTypeLabel(tone, lang),
      paletteColors,
      previewColors: paletteColors.slice(0, 5),
      season: meta.season,
      baseTone: meta.baseTone,
      detailTone: meta.detailTone,
      ...toneCardStyles[variant],
    };
  };

  const buildSimpleCard = (tone: SimpleResultType, label: string, variant: ToneCardVariant): ToneCardData => {
    const meta = simpleResultTypeMeta[tone];
    const paletteColors = getSimpleResultDiagnosticChips(tone);

    return {
      id: tone,
      label,
      displayName: getSimpleResultTypeLabel(tone, lang),
      paletteColors,
      previewColors: paletteColors.slice(0, 5),
      season: meta.season,
      baseTone: meta.baseTone,
      ...toneCardStyles[variant],
    };
  };

  const resultState =
    mode === "simple"
      ? {
          bestCard: (() => {
            const bestTone = analyzeSimplePersonalColor(likedChips, dislikedChips);
            return bestTone ? buildSimpleCard(bestTone, t.bestColor, "best") : null;
          })(),
          comparisonCards: [] as ToneCardData[],
          worstCard: (() => {
            const worstTone = getWorstSimpleResult(likedChips, dislikedChips);
            return worstTone ? buildSimpleCard(worstTone, t.worstColor, "worst") : null;
          })(),
        }
      : (() => {
          const bestResults = getBestResults(likedChips, dislikedChips, 3);
          const personalColorType = analyzePersonalColor(likedChips, dislikedChips);
          const secondaryBestResults = bestResults.slice(1, 3);
          const bestCard = personalColorType ? buildDetailedCard(personalColorType, t.bestColor, "best") : null;
          const comparisonCards = secondaryBestResults.map((tone, index) =>
            buildDetailedCard(
              tone,
              index === 0 ? t.secondBestColor : t.thirdBestColor,
              index === 0 ? "second" : "third",
            ),
          );
          const worstTone = getWorstResult(likedChips, dislikedChips);
          const worstCard = worstTone ? buildDetailedCard(worstTone, t.worstColor, "worst") : null;

          return {
            bestCard,
            comparisonCards,
            worstCard,
          };
        })();

  const topCards = [resultState.bestCard, ...resultState.comparisonCards].filter(isToneCardData);
  const activePaletteCard =
    (selectedPaletteToneId ? topCards.find((card) => card.id === selectedPaletteToneId) : null) ??
    topCards[0] ??
    null;

  if (!resultState.bestCard) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-linear-to-br from-gray-50 to-gray-100">
        <p className="text-xl font-semibold text-gray-700">{t.noLikes}</p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-600"
        >
          {t.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-auto bg-linear-to-br from-gray-50 to-gray-100 p-6 pt-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">{t.yourPersonalColor}</h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            {mode === "simple" ? t.simpleResultIntro : t.resultPaletteIntro}
          </p>
        </div>

        {topCards.length > 0 && (
          <div className="mb-6">
            {resultState.bestCard && (
              <div className="mx-auto mb-4 max-w-lg">
                <ResultToneCard
                  card={resultState.bestCard}
                  lang={lang}
                  className="min-h-[168px]"
                  toneClassName="text-3xl sm:text-4xl"
                />
              </div>
            )}
            {resultState.comparisonCards.length > 0 && (
              <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
                {resultState.comparisonCards.map((card) => (
                  <ResultToneCard
                    key={card.id}
                    card={card}
                    lang={lang}
                    className="min-h-[144px]"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {topCards.length > 0 && (
          <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-md">
            {topCards.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {topCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedPaletteToneId(card.id)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                      card.id === activePaletteCard?.id
                        ? `${card.badgeClass} border-transparent`
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                    ].join(" ")}
                  >
                    {card.label}
                  </button>
                ))}
              </div>
            )}

            {activePaletteCard && (
              <PaletteSection
                title={mode === "simple" ? t.diagnosticChipTitle(activePaletteCard.label) : t.paletteTitle(activePaletteCard.label)}
                description={
                  mode === "simple"
                    ? t.simpleBestDiagnosticDescription
                    : activePaletteCard.label === t.bestColor
                      ? t.bestPaletteDescription
                      : t.comparisonPaletteDescription
                }
                badgeText={activePaletteCard.displayName}
                paletteColors={activePaletteCard.paletteColors}
                badgeClass={activePaletteCard.badgeClass}
                borderClass={activePaletteCard.borderClass}
                likedSelectionSet={likedSelectionSet}
                dislikedSelectionSet={dislikedSelectionSet}
                badgeMode="liked"
                t={t}
                lang={lang}
                insideCard
              />
            )}
          </div>
        )}

        {mode === "detailed" && (
          <StylingRecommendations
            bestType={resultState.bestCard.id as PersonalColorType}
            displayName={resultState.bestCard.displayName}
            lang={lang}
            t={t}
          />
        )}

        {resultState.worstCard && (
          <>
            <div className="mb-6">
              <ResultToneCard card={resultState.worstCard} lang={lang} />
            </div>
            <PaletteSection
              title={mode === "simple" ? t.diagnosticChipTitle(t.worstColor) : t.paletteTitle(t.worstColor)}
              description={mode === "simple" ? t.simpleWorstDiagnosticDescription : t.worstPaletteDescription}
              badgeText={resultState.worstCard.displayName}
              paletteColors={resultState.worstCard.paletteColors}
              badgeClass={resultState.worstCard.badgeClass}
              borderClass={resultState.worstCard.borderClass}
              likedSelectionSet={likedSelectionSet}
              dislikedSelectionSet={dislikedSelectionSet}
              badgeMode="disliked"
              t={t}
              lang={lang}
              muted
            />
          </>
        )}

        <div className="mb-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
          <h3 className="mb-2 font-bold">{t.aboutColorType}</h3>
          <p className="mb-3 text-sm text-gray-700">{t.basedOn}</p>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>✓ {resultState.bestCard.baseTone === "Warm" ? t.warmUndertone : t.coolUndertone}</li>
            {resultState.bestCard.season === "Spring" && <li>✓ {t.springTrait}</li>}
            {resultState.bestCard.season === "Summer" && <li>✓ {t.summerTrait}</li>}
            {resultState.bestCard.season === "Autumn" && <li>✓ {t.autumnTrait}</li>}
            {resultState.bestCard.season === "Winter" && <li>✓ {t.winterTrait}</li>}
            {resultState.bestCard.detailTone === "Light" && <li>✓ {t.lightTrait}</li>}
            {resultState.bestCard.detailTone === "Bright" && <li>✓ {t.brightTrait}</li>}
            {resultState.bestCard.detailTone === "Muted" && <li>✓ {t.mutedTrait}</li>}
            {resultState.bestCard.detailTone === "Dark" && <li>✓ {t.darkTrait}</li>}
          </ul>
        </div>

        <div className="mb-8 flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 rounded-lg bg-blue-500 py-3 font-bold text-white transition-colors hover:bg-blue-600"
          >
            {t.tryAgain}
          </button>
          <button
            onClick={() => {
              const urlToShare = shareUrl || window.location.href;
              void navigator.clipboard.writeText(urlToShare);
              window.alert(t.copied);
            }}
            className="flex-1 rounded-lg bg-gray-500 py-3 font-bold text-white transition-colors hover:bg-gray-600"
          >
            {t.shareResult}
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultToneCard = ({
  card,
  lang,
  className = "",
  toneClassName = "",
}: ResultToneCardProps) => {
  return (
    <div
      className={["w-full flex-col items-center rounded-3xl border p-5 text-left", card.containerClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <p className={`mb-2 text-center text-sm font-semibold ${card.labelClass}`}>{card.label}</p>
      <p className={`text-center text-2xl font-bold ${card.valueClass} ${toneClassName}`}>{card.displayName}</p>
      {card.previewColors.length > 0 && (
        <div className="mt-5 flex justify-center gap-2">
          {card.previewColors.map((color) => (
            <span
              key={`${card.id}-${color.hex}`}
              className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color.hex }}
              title={getChipName(color, lang)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PaletteSection = ({
  title,
  description,
  badgeText,
  paletteColors,
  badgeClass,
  borderClass,
  likedSelectionSet,
  dislikedSelectionSet,
  badgeMode = "liked",
  t,
  lang,
  muted = false,
  insideCard = false,
}: PaletteSectionProps) => {
  const likedCount = paletteColors.filter((color) => likedSelectionSet.has(color.hex)).length;
  const dislikedCount = paletteColors.filter((color) => dislikedSelectionSet.has(color.hex)).length;

  return (
    <div
      className={[
        "rounded-3xl border border-slate-100 bg-white p-6",
        insideCard ? "rounded-none border-0 px-0 pb-0 shadow-none" : "mb-6 shadow-md",
      ].join(" ")}
    >
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
            {badgeText}
          </span>
        </div>
        <p className="text-sm text-slate-600">{description}</p>
        <div className="flex flex-wrap gap-2">
          <MetaPill text={t.paletteContainsCount(paletteColors.length)} />
          {badgeMode === "liked" && likedCount > 0 && <MetaPill text={t.likedMatchesCount(likedCount)} tone="liked" />}
          {badgeMode === "disliked" && dislikedCount > 0 && (
            <MetaPill text={t.dislikedMatchesCount(dislikedCount)} tone="disliked" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {paletteColors.map((color) => {
          const isLiked = likedSelectionSet.has(color.hex);
          const isDisliked = dislikedSelectionSet.has(color.hex);

          return (
            <div
              key={`${badgeText}-${color.id}`}
              className={["rounded-2xl border bg-white p-3 transition-shadow", borderClass, muted ? "opacity-75" : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="relative">
                <div
                  className="h-24 w-full rounded-xl border border-white/60 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={getChipName(color, lang)}
                />
                {badgeMode === "liked" && isLiked && <StickerBadge label={t.likedSticker} tone="liked" />}
                {badgeMode === "disliked" && isDisliked && <StickerBadge label={t.dislikedSticker} tone="disliked" />}
              </div>
              <div className="pt-3">
                <p className="truncate text-sm font-semibold text-slate-800">{getChipName(color, lang)}</p>
                <p className="text-xs text-slate-500">{color.hex}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MetaPill = ({ text, tone = "default" }: MetaPillProps) => {
  const toneClass =
    tone === "liked"
      ? "bg-rose-50 text-rose-600 border-rose-100"
      : tone === "disliked"
        ? "bg-red-50 text-red-600 border-red-100"
        : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}>
      {text}
    </span>
  );
};

const StickerBadge = ({ label, tone }: StickerBadgeProps) => {
  const toneClass =
    tone === "liked"
      ? "bg-rose-500 text-white shadow-rose-200"
      : "bg-red-500 text-white shadow-red-200";

  return (
    <span
      className={`absolute -right-2 -bottom-2 rotate-[-8deg] rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.16em] shadow-md ${toneClass}`}
    >
      {label}
    </span>
  );
};
