import { translations } from "../i18n/translations";

export const Home = ({ onStart, lang, onAbout }) => {
  const t = translations[lang];

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4 pt-20">
      <div className="max-w-2xl text-center text-white">
        <h1 className="mb-3 text-4xl leading-tight font-bold text-balance break-keep drop-shadow-lg md:text-5xl">
          {t.homeHeroQuote}
        </h1>
        <p className="mb-2 text-base text-balance break-keep opacity-95 md:text-lg">
          {t.homeHeroSubtext}
        </p>
        <p className="mb-6 text-sm opacity-80">{t.subtitle}</p>

        <div className="mb-8 rounded-xl bg-white/20 p-5 backdrop-blur-md">
          <ul className="mb-3 space-y-2 text-left text-sm">
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0"
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
                className="mt-0.5 h-4 w-4 shrink-0"
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
                className="mt-0.5 h-4 w-4 shrink-0"
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
                className="mt-0.5 h-4 w-4 shrink-0"
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

        <div className="mb-6 space-y-3">
          <p className="text-sm text-white opacity-90">{t.tip}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onStart}
            className="w-full cursor-pointer rounded-full bg-white px-8 py-4 text-lg font-bold text-purple-600 shadow-lg transition-all hover:scale-105 hover:bg-gray-100 active:scale-95 sm:w-auto"
          >
            {t.startButton}
          </button>
          <div>
            <button
              onClick={onAbout}
              className="cursor-pointer text-sm text-white/80 underline underline-offset-4 transition-colors hover:text-white"
            >
              {t.homeLearnMore}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
