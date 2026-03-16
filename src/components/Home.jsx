import { translations } from '../i18n/translations'

export const Home = ({ onStart, lang, onAbout }) => {
  const t = translations[lang]

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4 pt-20">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg leading-tight text-balance break-keep">
          {t.homeHeroQuote}
        </h1>
        <p className="text-base md:text-lg mb-2 opacity-95 text-balance break-keep">
          {t.homeHeroSubtext}
        </p>
        <p className="text-sm mb-6 opacity-80">{t.subtitle}</p>

        <div className="bg-white/20 rounded-xl p-5 mb-8 backdrop-blur-md">
          <ul className="text-sm text-left space-y-2 mb-3">
            <li className="flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {t.featureViewColors}
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {t.featureLikeDislike}
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {t.featureRecommend}
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {t.featureLearn}
            </li>
          </ul>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-white opacity-90">{t.tip}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onStart}
            className="w-full sm:w-auto bg-white hover:bg-gray-100 text-purple-600 font-bold text-lg py-4 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
          >
            {t.startButton}
          </button>
          <div>
            <button
              onClick={onAbout}
              className="text-sm text-white/80 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
            >
              {t.homeLearnMore}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
