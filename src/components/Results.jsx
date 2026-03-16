import { analyzePersonalColor, getRecommendedColors, getAvoidColors } from "../utils/analyzer";
import { colorData } from "../data/colorData";

export const Results = ({ likedColors, onRetry }) => {
  const personalColorType = analyzePersonalColor(likedColors);
  const recommendedColors = getRecommendedColors(personalColorType, colorData);
  const avoidColors = getAvoidColors(personalColorType, colorData);

  // Select top 6 from each
  const topRecommended = recommendedColors.slice(0, 6);
  const topAvoid = avoidColors.slice(0, 6);

  if (!personalColorType) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 gap-4">
        <p className="text-xl font-semibold text-gray-700">좋아요한 색이 없어서 분석할 수 없어요.</p>
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          다시 시작
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Personal Color</h1>
          <div className="inline-block bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-2">Your Color Type</p>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {personalColorType}
            </p>
          </div>
        </div>

        {/* Liked Colors */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Colors You Liked ({likedColors.length})</h2>
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
            <h2 className="text-xl font-bold mb-4">Recommended Colors for You</h2>
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
            <h2 className="text-xl font-bold mb-4">Colors to Avoid</h2>
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
          <h3 className="font-bold mb-2">About Your Color Type</h3>
          <p className="text-sm text-gray-700 mb-3">
            Based on your color preferences, your dominant characteristics are:
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            {personalColorType.includes("Spring") && (
              <>
                <li>✓ Warm undertone (Spring/Autumn family)</li>
                <li>✓ Preference for bright, warm colors</li>
              </>
            )}
            {personalColorType.includes("Summer") && (
              <>
                <li>✓ Cool undertone (Summer/Winter family)</li>
                <li>✓ Preference for soft, cool colors</li>
              </>
            )}
            {personalColorType.includes("Autumn") && (
              <>
                <li>✓ Warm undertone (Spring/Autumn family)</li>
                <li>✓ Preference for deep, warm colors</li>
              </>
            )}
            {personalColorType.includes("Winter") && (
              <>
                <li>✓ Cool undertone (Summer/Winter family)</li>
                <li>✓ Preference for deep, cool colors</li>
              </>
            )}
            {personalColorType.includes("Light") && (
              <li>✓ High lightness preference</li>
            )}
            {personalColorType.includes("Bright") && (
              <li>✓ High saturation preference</li>
            )}
            {personalColorType.includes("Muted") && (
              <li>✓ Lower saturation preference</li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              const text = `My Personal Color is ${personalColorType}! 🎨`;
              navigator.clipboard.writeText(text);
              alert("Copied to clipboard!");
            }}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Share Result
          </button>
        </div>
      </div>
    </div>
  );
};
