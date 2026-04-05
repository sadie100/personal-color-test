import {
  analyzePersonalColor,
  getAvoidColors,
  getBestResults,
  getRecommendedColors,
  getWorstResult,
} from "../utils/analyzer";
import { colorData } from "../data/colorData";
import { translations } from "../i18n/translations";

export const Results = ({ likedColors, dislikedColors = [], onRetry, lang }) => {
  const t = translations[lang];
  const bestResults = getBestResults(likedColors);
  const personalColorType = analyzePersonalColor(likedColors);
  const worstColorType = getWorstResult(dislikedColors, personalColorType);
  const recommendedColors = getRecommendedColors(personalColorType, colorData);
  const avoidColors = getAvoidColors(worstColorType, colorData);

  const topRecommended = recommendedColors.slice(0, 6);
  const topAvoid = avoidColors.slice(0, 6);
  const secondaryBestResults = bestResults.slice(1, 3);
  const rankedResultCards = [
    secondaryBestResults[0]
      ? {
          label: t.secondBestColor,
          value: secondaryBestResults[0],
          containerClass: "border-indigo-100 bg-indigo-50/70",
          labelClass: "text-indigo-600",
          valueClass: "text-indigo-900",
        }
      : null,
    secondaryBestResults[1]
      ? {
          label: t.thirdBestColor,
          value: secondaryBestResults[1],
          containerClass: "border-sky-100 bg-sky-50/70",
          labelClass: "text-sky-600",
          valueClass: "text-sky-900",
        }
      : null,
    worstColorType
      ? {
          label: t.worstColor,
          value: worstColorType,
          containerClass: "border-red-100 bg-red-50/70",
          labelClass: "text-red-600",
          valueClass: "text-red-900",
        }
      : null,
  ].filter(Boolean);

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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t.yourPersonalColor}</h1>
          <div className="inline-block bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-2">{t.bestColor}</p>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {personalColorType}
            </p>
          </div>
        </div>

        {rankedResultCards.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            {rankedResultCards.map((result) => (
              <div
                key={result.label}
                className={`rounded-lg border p-4 shadow-sm ${result.containerClass}`}
              >
                <p className={`text-sm font-semibold mb-2 ${result.labelClass}`}>{result.label}</p>
                <p className={`text-lg font-bold ${result.valueClass}`}>{result.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Liked Colors */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{t.colorsYouLiked} ({likedColors.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {likedColors.map((color, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-full h-20 rounded-lg shadow-md border-2 border-gray-200 mb-2"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <p className="text-xs text-center text-gray-600 truncate w-full">
                  {color.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Colors */}
        {topRecommended.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold">{t.recommendedColors}</h2>
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                {personalColorType}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {topRecommended.map((color, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-full h-20 rounded-lg shadow-md border-2 border-green-200 mb-2"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                  <p className="text-xs text-center text-gray-600 truncate w-full">
                    {color.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Colors to Avoid */}
        {topAvoid.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold">{t.colorsToAvoid}</h2>
              <span className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-full">
                {worstColorType}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {topAvoid.map((color, i) => (
                <div key={i} className="flex flex-col items-center opacity-60">
                  <div
                    className="w-full h-20 rounded-lg shadow-md border-2 border-red-200 mb-2"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                  <p className="text-xs text-center text-gray-600 truncate w-full">
                    {color.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Info */}
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

        {/* Action Buttons */}
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
