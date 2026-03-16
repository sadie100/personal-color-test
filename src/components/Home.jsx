import { translations } from "../i18n/translations";
import { LangToggle } from "./LangToggle";

export const Home = ({ onStart, lang, onToggleLang }) => {
  const t = translations[lang];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        <div className="flex justify-end mb-4">
          <LangToggle
            lang={lang}
            onToggle={onToggleLang}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          />
        </div>

        <h1 className="text-5xl font-bold mb-4">{t.title}</h1>
        <p className="text-xl mb-4">{t.subtitle}</p>

        <div className="bg-white/20 rounded-lg p-6 mb-8 backdrop-blur-md">
          <ul className="text-sm text-left space-y-2 mb-4">
            <li>✓ {t.featureViewColors}</li>
            <li>✓ {t.featureLikeDislike}</li>
            <li>✓ {t.featureRecommend}</li>
            <li>✓ {t.featureLearn}</li>
          </ul>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-white opacity-90">{t.tip}</p>
        </div>

        <button
          onClick={onStart}
          className="bg-white hover:bg-gray-100 text-purple-600 font-bold text-lg py-4 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          {t.startButton}
        </button>
      </div>
    </div>
  );
};
