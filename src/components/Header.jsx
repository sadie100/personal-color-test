import { useState } from "react";
import { LangToggle } from "./LangToggle";
import { translations } from "../i18n/translations";

export const Header = ({ lang, onToggleLang, screen, onNavigate }) => {
  const t = translations[lang];
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (target) => {
    onNavigate(target);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => handleNav("home")}
          className="cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-lg font-bold text-transparent"
        >
          Personal Color Test
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <button
            onClick={() => handleNav("about")}
            className={`cursor-pointer text-sm font-medium transition-colors ${
              screen === "about"
                ? "border-b-2 border-purple-500 pb-0.5 text-purple-600"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => handleNav("test")}
            className="cursor-pointer rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
          >
            {t.navTest}
          </button>
          <LangToggle lang={lang} onToggle={onToggleLang} />
        </nav>

        {/* Mobile: lang toggle + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <LangToggle lang={lang} onToggle={onToggleLang} />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="cursor-pointer p-2 text-gray-600 hover:text-gray-900"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="space-y-2 border-t border-gray-100 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
          <button
            onClick={() => handleNav("about")}
            className={`block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              screen === "about" ? "bg-purple-50 text-purple-600" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => handleNav("test")}
            className="block w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-2.5 text-left text-sm font-semibold text-white"
          >
            {t.navTest}
          </button>
        </div>
      )}
    </header>
  );
};
