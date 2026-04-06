import { useState } from "react";
import { analyzePersonalColor, getBestResults, getWorstResult } from "../utils/analyzer";
import { colorData } from "../data/colorData";
import { translations } from "../i18n/translations";

const getSelectionKey = (seasonTone, hex) => `${seasonTone}::${hex}`;

const buildSelectionSet = (colors) =>
  new Set(
    colors
      .filter((color) => color?.seasonTone && color?.hex)
      .map((color) => getSelectionKey(color.seasonTone, color.hex))
  );

const toneCardStyles = {
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

export const Results = ({ likedColors, dislikedColors = [], onRetry, lang }) => {
  const t = translations[lang];
  const bestResults = getBestResults(likedColors);
  const personalColorType = analyzePersonalColor(likedColors);
  const worstColorType = getWorstResult(dislikedColors, personalColorType);
  const secondaryBestResults = bestResults.slice(1, 3);
  const [selectedPaletteTone, setSelectedPaletteTone] = useState(personalColorType);

  const likedSelectionSet = buildSelectionSet(likedColors);
  const dislikedSelectionSet = buildSelectionSet(dislikedColors);

  const bestCard = personalColorType
    ? {
        label: t.bestColor,
        tone: personalColorType,
        viewActionLabel: t.viewPaletteAction,
        openActionLabel: t.openPaletteAction,
        ...toneCardStyles.best,
      }
    : null;

  const comparisonCards = secondaryBestResults.map((tone, index) => ({
    label: index === 0 ? t.secondBestColor : t.thirdBestColor,
    tone,
    viewActionLabel: t.viewPaletteAction,
    openActionLabel: t.openPaletteAction,
    ...(index === 0 ? toneCardStyles.second : toneCardStyles.third),
  }));

  const topCards = [bestCard, ...comparisonCards].filter(Boolean);
  const activePaletteTone = topCards.some((card) => card.tone === selectedPaletteTone)
    ? selectedPaletteTone
    : topCards[0]?.tone || null;
  const activePaletteCard = topCards.find((card) => card.tone === activePaletteTone) || null;

  const worstCard = worstColorType
    ? {
        label: t.worstColor,
        tone: worstColorType,
        ...toneCardStyles.worst,
      }
    : null;

  if (!personalColorType) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 gap-4">
        <p className="text-xl font-semibold text-gray-700">{t.noLikes}</p>
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          {t.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6 pt-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t.yourPersonalColor}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.resultPaletteIntro}</p>
        </div>

        {topCards.length > 0 && (
          <div className="bg-white rounded-3xl shadow-md p-6 mb-6 border border-slate-100">
            <div className="flex flex-col gap-2 mb-5">
              <h2 className="text-2xl font-bold text-slate-900">{t.compareTopMatches}</h2>
              <p className="text-sm text-slate-600">{t.topCardHint}</p>
            </div>
            {bestCard && (
              <div className="max-w-2xl mx-auto mb-4">
                <ResultToneCard
                  card={bestCard}
                  className="min-h-[168px]"
                  toneClassName="text-3xl sm:text-4xl"
                  previewColors={(colorData[bestCard.tone] || []).slice(0, 5)}
                />
              </div>
            )}
            {comparisonCards.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
                {comparisonCards.map((card) => (
                  <ResultToneCard
                    key={card.tone}
                    card={card}
                    className="min-h-[144px]"
                    previewColors={(colorData[card.tone] || []).slice(0, 5)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {topCards.length > 0 && (
          <div className="bg-white rounded-3xl shadow-md p-6 mb-6 border border-slate-100">
            <div className="flex flex-col gap-2 mb-5">
              <h2 className="text-2xl font-bold text-slate-900">{t.detailPaletteSectionTitle}</h2>
              <p className="text-sm text-slate-600">{t.detailPaletteHint}</p>
            </div>
            <div className="flex flex-wrap gap-3 mb-5">
              {topCards.map((card) => (
                <button
                  key={card.tone}
                  type="button"
                  onClick={() => setSelectedPaletteTone(card.tone)}
                  className={[
                    "px-4 py-2 rounded-full border text-sm font-semibold transition-colors",
                    card.tone === activePaletteTone
                      ? `${card.badgeClass} border-transparent`
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300",
                  ].join(" ")}
                >
                  {card.label}
                </button>
              ))}
            </div>

            {activePaletteCard && (
              <PaletteSection
                title={t.paletteTitle(activePaletteCard.label)}
                description={
                  activePaletteCard.label === t.bestColor
                    ? t.bestPaletteDescription
                    : t.comparisonPaletteDescription
                }
                tone={activePaletteCard.tone}
                badgeClass={activePaletteCard.badgeClass}
                borderClass={activePaletteCard.borderClass}
                likedSelectionSet={likedSelectionSet}
                dislikedSelectionSet={dislikedSelectionSet}
                badgeMode="liked"
                t={t}
                insideCard
              />
            )}
          </div>
        )}

        {worstCard && (
          <>
            <div className="mb-6">
              <ResultToneCard card={worstCard} />
            </div>
            <PaletteSection
              title={t.paletteTitle(t.worstColor)}
              description={t.worstPaletteDescription}
              tone={worstCard.tone}
              badgeClass={worstCard.badgeClass}
              borderClass={worstCard.borderClass}
              likedSelectionSet={likedSelectionSet}
              dislikedSelectionSet={dislikedSelectionSet}
              badgeMode="disliked"
              t={t}
              muted
            />
          </>
        )}

        <div className="bg-blue-50 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
          <h3 className="font-bold mb-2">{t.aboutColorType}</h3>
          <p className="text-sm text-gray-700 mb-3">{t.basedOn}</p>
          <ul className="text-sm text-gray-700 space-y-1">
            {personalColorType.includes("Spring") && (
              <>
                <li>✓ {t.warmUndertone}</li>
                <li>✓ {t.springTrait}</li>
              </>
            )}
            {personalColorType.includes("Summer") && (
              <>
                <li>✓ {t.coolUndertone}</li>
                <li>✓ {t.summerTrait}</li>
              </>
            )}
            {personalColorType.includes("Autumn") && (
              <>
                <li>✓ {t.warmUndertone}</li>
                <li>✓ {t.autumnTrait}</li>
              </>
            )}
            {personalColorType.includes("Winter") && (
              <>
                <li>✓ {t.coolUndertone}</li>
                <li>✓ {t.winterTrait}</li>
              </>
            )}
            {personalColorType.includes("Light") && <li>✓ {t.lightTrait}</li>}
            {personalColorType.includes("Bright") && <li>✓ {t.brightTrait}</li>}
            {personalColorType.includes("Muted") && <li>✓ {t.mutedTrait}</li>}
          </ul>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {t.tryAgain}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                t.shareText(personalColorType, secondaryBestResults, worstColorType)
              );
              alert(t.copied);
            }}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
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
  isActive = false,
  isInteractive = false,
  onClick,
  className = "",
  toneClassName = "",
  previewColors = [],
}) => {
  const Tag = isInteractive ? "button" : "div";

  return (
    <Tag
      type={isInteractive ? "button" : undefined}
      onClick={isInteractive ? onClick : undefined}
      className={[
        "w-full rounded-3xl border p-5 text-left transition-all",
        card.containerClass,
        isInteractive ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : "",
        isActive ? "ring-2 ring-offset-2 ring-slate-300" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm font-semibold mb-2 ${card.labelClass}`}>{card.label}</p>
          <p className={`text-2xl font-bold ${card.valueClass} ${toneClassName}`}>{card.tone}</p>
        </div>
        {isInteractive && (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${card.badgeClass}`}>
            {isActive ? card.openActionLabel : card.viewActionLabel}
          </span>
        )}
      </div>
      {previewColors.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2">
            {previewColors.map((color) => (
              <span
                key={`${card.tone}-${color.hex}`}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
    </Tag>
  );
};

const PaletteSection = ({
  title,
  description,
  tone,
  badgeClass,
  borderClass,
  likedSelectionSet,
  dislikedSelectionSet,
  badgeMode = "liked",
  t,
  muted = false,
  insideCard = false,
}) => {
  const paletteColors = colorData[tone] || [];

  if (paletteColors.length === 0) {
    return null;
  }

  const likedCount = paletteColors.filter((color) =>
    likedSelectionSet.has(getSelectionKey(tone, color.hex))
  ).length;
  const dislikedCount = paletteColors.filter((color) =>
    dislikedSelectionSet.has(getSelectionKey(tone, color.hex))
  ).length;

  return (
    <div
      className={[
        "bg-white rounded-3xl p-6 border border-slate-100",
        insideCard ? "shadow-none px-0 pb-0 border-0 rounded-none" : "shadow-md mb-6",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}>
            {tone}
          </span>
        </div>
        <p className="text-sm text-slate-600">{description}</p>
        <div className="flex flex-wrap gap-2">
          <MetaPill text={t.paletteContainsCount(paletteColors.length)} />
          {badgeMode === "liked" && likedCount > 0 && (
            <MetaPill text={t.likedMatchesCount(likedCount)} tone="liked" />
          )}
          {badgeMode === "disliked" && dislikedCount > 0 && (
            <MetaPill text={t.dislikedMatchesCount(dislikedCount)} tone="disliked" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {paletteColors.map((color) => {
          const isLiked = likedSelectionSet.has(getSelectionKey(tone, color.hex));
          const isDisliked = dislikedSelectionSet.has(getSelectionKey(tone, color.hex));

          return (
            <div
              key={`${tone}-${color.name}-${color.hex}`}
              className={[
                "rounded-2xl border bg-white p-3 transition-shadow",
                borderClass,
                muted ? "opacity-75" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="relative">
                <div
                  className="w-full h-24 rounded-xl shadow-sm border border-white/60"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                {badgeMode === "liked" && isLiked && (
                  <StickerBadge label={t.likedSticker} tone="liked" />
                )}
                {badgeMode === "disliked" && isDisliked && (
                  <StickerBadge label={t.dislikedSticker} tone="disliked" />
                )}
              </div>
              <div className="pt-3">
                <p className="text-sm font-semibold text-slate-800 truncate">{color.name}</p>
                <p className="text-xs text-slate-500">{color.hex}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MetaPill = ({ text, tone = "default" }) => {
  const toneClass =
    tone === "liked"
      ? "bg-rose-50 text-rose-600 border-rose-100"
      : tone === "disliked"
        ? "bg-red-50 text-red-600 border-red-100"
        : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${toneClass}`}>
      {text}
    </span>
  );
};

const StickerBadge = ({ label, tone }) => {
  const toneClass =
    tone === "liked"
      ? "bg-rose-500 text-white shadow-rose-200"
      : "bg-red-500 text-white shadow-red-200";

  return (
    <span
      className={`absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full text-[10px] font-black tracking-[0.16em] shadow-md rotate-[-8deg] ${toneClass}`}
    >
      {label}
    </span>
  );
};
