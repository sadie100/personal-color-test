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
    <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => handleNav("home")}
          className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 cursor-pointer"
        >
          Personal Color Test
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleNav("about")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              screen === "about"
                ? "text-purple-600 border-b-2 border-purple-500 pb-0.5"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => handleNav("test")}
            className="text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full hover:opacity-90 transition-opacity cursor-pointer active:scale-95"
          >
            {t.navTest}
          </button>
          <LangToggle lang={lang} onToggle={onToggleLang} />
        </nav>

        {/* Mobile: lang toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <LangToggle lang={lang} onToggle={onToggleLang} />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 space-y-2">
          <button
            onClick={() => handleNav("about")}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              screen === "about" ? "text-purple-600 bg-purple-50" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => handleNav("test")}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 cursor-pointer"
          >
            {t.navTest}
          </button>
        </div>
      )}
    </header>
  );
};
