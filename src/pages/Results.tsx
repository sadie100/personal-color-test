import { Heart, X } from "lucide-react";
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
    containerClass: "border-hairline bg-surface",
    labelClass: "text-ink-3",
    valueClass: "text-ink",
    badgeClass: "bg-accent text-accent-fg",
    borderClass: "border-hairline",
  },
  second: {
    containerClass: "border-hairline bg-surface",
    labelClass: "text-ink-3",
    valueClass: "text-ink",
    badgeClass: "bg-hairline text-ink-2",
    borderClass: "border-hairline",
  },
  third: {
    containerClass: "border-hairline bg-surface",
    labelClass: "text-ink-3",
    valueClass: "text-ink",
    badgeClass: "bg-hairline text-ink-2",
    borderClass: "border-hairline",
  },
  worst: {
    containerClass: "border-hairline bg-surface",
    labelClass: "text-ink-3",
    valueClass: "text-ink",
    badgeClass: "bg-hairline text-ink-2",
    borderClass: "border-hairline",
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
  const [worstOpen, setWorstOpen] = useState(false);

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
            return bestTone ? buildSimpleCard(bestTone, t.results.best, "best") : null;
          })(),
          comparisonCards: [] as ToneCardData[],
          worstCard: (() => {
            const worstTone = getWorstSimpleResult(likedChips, dislikedChips);
            return worstTone ? buildSimpleCard(worstTone, t.results.worst, "worst") : null;
          })(),
        }
      : (() => {
          const bestResults = getBestResults(likedChips, dislikedChips, 3);
          const personalColorType = analyzePersonalColor(likedChips, dislikedChips);
          const secondaryBestResults = bestResults.slice(1, 3);
          const bestCard = personalColorType ? buildDetailedCard(personalColorType, t.results.best, "best") : null;
          const comparisonCards = secondaryBestResults.map((tone, index) =>
            buildDetailedCard(
              tone,
              index === 0 ? t.results.second : t.results.third,
              index === 0 ? "second" : "third",
            ),
          );
          const worstTone = getWorstResult(likedChips, dislikedChips);
          const worstCard = worstTone ? buildDetailedCard(worstTone, t.results.worst, "worst") : null;

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
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-paper">
        <p className="text-xl font-semibold text-ink">{t.results.noLikes}</p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-accent px-6 py-3 font-bold text-accent-fg transition-opacity hover:opacity-90"
        >
          {t.results.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-auto bg-paper p-6 pt-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-left">
          <h1 className="font-display text-4xl text-ink md:text-5xl">{t.results.header}</h1>
          <p className="mt-2 max-w-2xl text-ink-2">
            {mode === "simple" ? t.results.simpleIntro : t.results.paletteIntro}
          </p>
        </div>

        {resultState.bestCard && (
          <section className="mb-8">
            <p className="text-sm font-semibold tracking-wide text-ink-3 uppercase">
              {resultState.bestCard.label}
            </p>
            <h2 className="mt-1 font-display text-4xl text-ink md:text-6xl">
              {resultState.bestCard.displayName}
            </h2>
            <div className="mt-5 flex h-20 w-full overflow-hidden rounded-2xl border border-hairline md:h-28">
              {resultState.bestCard.paletteColors.map((color) => (
                <span
                  key={`best-strip-${color.id}`}
                  className="h-full flex-1"
                  style={{ backgroundColor: color.hex }}
                  title={getChipName(color, lang)}
                />
              ))}
            </div>
          </section>
        )}

        {resultState.comparisonCards.length > 0 && (
          <div className="mb-10 grid gap-3 sm:grid-cols-2">
            {resultState.comparisonCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-3 rounded-xl border border-hairline bg-surface p-3"
              >
                <div className="flex h-10 flex-1 overflow-hidden rounded-lg">
                  {card.previewColors.map((color) => (
                    <span
                      key={`${card.id}-${color.id}`}
                      className="h-full flex-1"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold text-ink-3">{card.label}</p>
                  <p className="text-sm font-bold text-ink">{card.displayName}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {topCards.length > 0 && (
          <div className="mb-10 rounded-3xl border border-hairline bg-surface p-6">
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
                        ? "border-transparent bg-accent text-accent-fg"
                        : "border-hairline bg-surface text-ink-2 hover:border-ink/40",
                    ].join(" ")}
                  >
                    {card.label}
                  </button>
                ))}
              </div>
            )}

            {activePaletteCard && (
              <PaletteSection
                title={mode === "simple" ? t.results.diagnosticChipTitle(activePaletteCard.label) : t.results.paletteTitle(activePaletteCard.label)}
                description={
                  mode === "simple"
                    ? t.results.simpleDiagnostics.best
                    : activePaletteCard.label === t.results.best
                      ? t.results.paletteDescriptions.best
                      : t.results.paletteDescriptions.comparison
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
          <section className="mb-10 rounded-3xl border border-hairline bg-surface">
            <button
              type="button"
              aria-expanded={worstOpen}
              aria-label={resultState.worstCard.label}
              onClick={() => setWorstOpen((value) => !value)}
              className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left"
            >
              <span>
                <span className="block text-sm font-semibold tracking-wide text-ink-3 uppercase">
                  {resultState.worstCard.label}
                </span>
                <span className="mt-0.5 block font-display text-2xl text-ink">
                  {resultState.worstCard.displayName}
                </span>
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-ink-3 transition-transform ${worstOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={worstOpen ? "px-6 pb-6" : "hidden"}>
              <PaletteSection
                title={mode === "simple" ? t.results.diagnosticChipTitle(t.results.worst) : t.results.paletteTitle(t.results.worst)}
                description={mode === "simple" ? t.results.simpleDiagnostics.worst : t.results.paletteDescriptions.worst}
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
            </div>
          </section>
        )}

        <div className="mb-6 rounded-2xl border border-hairline bg-surface p-6">
          <h3 className="mb-2 font-display text-xl text-ink">{t.results.analysisTitle}</h3>
          <p className="mb-3 text-sm text-ink-2">{t.results.analysisIntro}</p>
          <ul className="space-y-1 text-sm text-ink-2">
            <li>✓ {resultState.bestCard.baseTone === "Warm" ? t.undertone.warm : t.undertone.cool}</li>
            {resultState.bestCard.season === "Spring" && <li>✓ {t.traits.spring}</li>}
            {resultState.bestCard.season === "Summer" && <li>✓ {t.traits.summer}</li>}
            {resultState.bestCard.season === "Autumn" && <li>✓ {t.traits.autumn}</li>}
            {resultState.bestCard.season === "Winter" && <li>✓ {t.traits.winter}</li>}
            {resultState.bestCard.detailTone === "Light" && <li>✓ {t.traits.light}</li>}
            {resultState.bestCard.detailTone === "Bright" && <li>✓ {t.traits.bright}</li>}
            {resultState.bestCard.detailTone === "Muted" && <li>✓ {t.traits.muted}</li>}
            {resultState.bestCard.detailTone === "Dark" && <li>✓ {t.traits.dark}</li>}
          </ul>
        </div>

        <div className="mb-8 flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 rounded-lg bg-accent py-3 font-bold text-accent-fg transition-opacity hover:opacity-90"
          >
            {t.results.tryAgain}
          </button>
          <button
            onClick={() => {
              const urlToShare = shareUrl || window.location.href;
              void navigator.clipboard.writeText(urlToShare);
              window.alert(t.results.copied);
            }}
            className="flex-1 rounded-lg border border-hairline bg-surface py-3 font-bold text-ink transition-colors hover:bg-hairline/40"
          >
            {t.results.share}
          </button>
        </div>
      </div>
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
}: PaletteSectionProps) => {
  const likedCount = paletteColors.filter((color) => likedSelectionSet.has(color.hex)).length;
  const dislikedCount = paletteColors.filter((color) => dislikedSelectionSet.has(color.hex)).length;

  return (
    <div className="bg-surface pt-6">
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-2xl text-ink">{title}</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
            {badgeText}
          </span>
        </div>
        <p className="text-sm text-ink-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          <MetaPill text={t.results.badges.paletteCount(paletteColors.length)} />
          {badgeMode === "liked" && likedCount > 0 && <MetaPill text={t.results.badges.likedCount(likedCount)} tone="liked" />}
          {badgeMode === "disliked" && dislikedCount > 0 && (
            <MetaPill text={t.results.badges.dislikedCount(dislikedCount)} tone="disliked" />
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
              className={["rounded-2xl border bg-surface p-3 transition-shadow", borderClass, muted ? "opacity-75" : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="relative">
                <div
                  className="h-24 w-full rounded-xl border border-white/60 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={getChipName(color, lang)}
                />
                {badgeMode === "liked" && isLiked && <StickerBadge label={t.results.badges.liked} tone="liked" />}
                {badgeMode === "disliked" && isDisliked && <StickerBadge label={t.results.badges.disliked} tone="disliked" />}
              </div>
              <div className="pt-3">
                <p className="truncate text-sm font-semibold text-ink-2">{getChipName(color, lang)}</p>
                <p className="text-xs text-ink-3">{color.hex}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MetaPill = ({ text, tone = "default" }: MetaPillProps) => {
  if (tone === "default") {
    return (
      <span className="rounded-full border border-hairline bg-paper px-3 py-1 text-xs font-semibold text-ink-2">
        {text}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-fill px-3 py-1 text-xs font-semibold text-ink-2">
      {tone === "liked" ? (
        <Heart size={12} fill="currentColor" strokeWidth={0} aria-hidden />
      ) : (
        <X size={12} strokeWidth={2.5} aria-hidden />
      )}
      {text}
    </span>
  );
};

const StickerBadge = ({ label, tone }: StickerBadgeProps) => {
  const isLiked = tone === "liked";

  return (
    <span
      className={[
        "absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full shadow-sm ring-2 ring-surface",
        isLiked ? "bg-accent text-accent-fg" : "border border-hairline bg-surface text-ink",
      ].join(" ")}
    >
      {isLiked ? (
        <Heart size={15} fill="currentColor" strokeWidth={0} aria-hidden />
      ) : (
        <X size={16} strokeWidth={2.5} aria-hidden />
      )}
      <span className="sr-only">{label}</span>
    </span>
  );
};
