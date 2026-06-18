import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { diagnosticChips } from "./data/colorData";
import { About } from "./pages/About";
import { ColorTest } from "./pages/ColorTest";
import { ColorTypeDetail } from "./pages/ColorTypeDetail";
import { ColorTypes } from "./pages/ColorTypes";
import { Home } from "./pages/Home";
import { Results } from "./pages/Results";
import { DEFAULT_TITLE, getRouteMeta } from "./seo/routeMeta";
import type { DiagnosticChip, Lang, Screen, TestCompletePayload, TestMode } from "./types";
import { getLangFromPathname, localizePath, stripLangPrefix } from "./utils/localizePath";
import { createResultsSearchParams, getPayloadFromResultsSearchParams } from "./utils/resultShare";

const getPreviewChip = (id: string): DiagnosticChip => {
  const chip = diagnosticChips.find((entry) => entry.id === id);

  if (!chip) {
    throw new Error(`Missing preview chip: ${id}`);
  }

  return chip;
};

const PREVIEW_RESULT: TestCompletePayload = {
  mode: "detailed",
  likedChips: [
    getPreviewChip("detail-spring-bright-red"),
    getPreviewChip("detail-spring-bright-orange"),
    getPreviewChip("detail-bright-green"),
    getPreviewChip("detail-spring-bright-blue"),
  ],
  dislikedChips: [
    getPreviewChip("detail-summer-muted-blue"),
    getPreviewChip("detail-winter-dark-navy"),
  ],
};

const getScreenFromPathname = (rawPathname: string): Screen => {
  const pathname = stripLangPrefix(rawPathname);

  if (pathname === "/test") {
    return "test";
  }

  if (pathname === "/results") {
    return "results";
  }

  if (pathname === "/about") {
    return "about";
  }

  if (pathname === "/types" || pathname.startsWith("/types/")) {
    return "types";
  }

  return "home";
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [likedChips, setLikedChips] = useState<DiagnosticChip[]>([]);
  const [dislikedChips, setDislikedChips] = useState<DiagnosticChip[]>([]);
  const [testMode, setTestMode] = useState<TestMode | null>(null);
  const lang = getLangFromPathname(location.pathname);
  const screen = getScreenFromPathname(location.pathname);
  const logicalPathname = stripLangPrefix(location.pathname);
  const payloadFromQuery = useMemo(
    () =>
      logicalPathname === "/results"
        ? getPayloadFromResultsSearchParams(new URLSearchParams(location.search))
        : null,
    [logicalPathname, location.search],
  );
  const resolvedResultsPayload = useMemo(
    () => payloadFromQuery ?? (likedChips.length > 0 && testMode ? { mode: testMode, likedChips, dislikedChips } : null),
    [dislikedChips, likedChips, payloadFromQuery, testMode],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = getRouteMeta(location.pathname)?.title ?? DEFAULT_TITLE[lang];
  }, [lang, location.pathname]);

  useEffect(() => {
    const preview = new URLSearchParams(location.search).get("preview");
    if (preview === "about") {
      if (logicalPathname !== "/about") {
        navigate(localizePath(lang, "/about"), { replace: true });
      }
      return;
    }

    if (preview === "results") {
      const search = createResultsSearchParams(PREVIEW_RESULT).toString();
      navigate(
        {
          pathname: localizePath(lang, "/results"),
          search: search ? `?${search}` : "",
        },
        { replace: true },
      );
    }
  }, [lang, logicalPathname, location.search, navigate]);

  useEffect(() => {
    if (logicalPathname !== "/results") {
      return;
    }

    const currentParams = new URLSearchParams(location.search);

    if (payloadFromQuery) {
      const canonicalSearch = createResultsSearchParams(payloadFromQuery).toString();
      if (canonicalSearch !== currentParams.toString()) {
        navigate(
          {
            pathname: localizePath(lang, "/results"),
            search: canonicalSearch ? `?${canonicalSearch}` : "",
          },
          { replace: true },
        );
      }
      return;
    }

    if (likedChips.length > 0) {
      if (!testMode) {
        navigate(localizePath(lang, "/test"), { replace: true });
        return;
      }

      const currentPayload: TestCompletePayload = { mode: testMode, likedChips, dislikedChips };
      const canonicalSearch = createResultsSearchParams(currentPayload).toString();
      if (canonicalSearch && canonicalSearch !== currentParams.toString()) {
        navigate(
          {
            pathname: localizePath(lang, "/results"),
            search: `?${canonicalSearch}`,
          },
          { replace: true },
        );
      }
      return;
    }

    navigate(localizePath(lang, "/test"), { replace: true });
  }, [dislikedChips, lang, likedChips, logicalPathname, location.search, navigate, payloadFromQuery, testMode]);

  const handleToggleLang = (newLang: Lang) => {
    navigate({ pathname: localizePath(newLang, logicalPathname), search: location.search });
  };

  const goToResults = useCallback(
    (payload: TestCompletePayload) => {
      const search = createResultsSearchParams(payload).toString();
      navigate({
        pathname: localizePath(lang, "/results"),
        search: search ? `?${search}` : "",
      });
    },
    [lang, navigate],
  );

  const handleStartTest = useCallback(() => {
    navigate(localizePath(lang, "/test"));
  }, [lang, navigate]);

  const handleTestComplete = useCallback(
    (payload: TestCompletePayload) => {
      setTestMode(payload.mode);
      setLikedChips(payload.likedChips);
      setDislikedChips(payload.dislikedChips);
      goToResults(payload);
    },
    [goToResults],
  );

  const resetSelections = useCallback(() => {
    setTestMode(null);
    setLikedChips([]);
    setDislikedChips([]);
  }, []);

  const handleRetry = useCallback(() => {
    resetSelections();
    navigate(localizePath(lang, "/test"));
  }, [lang, navigate, resetSelections]);

  const handleGoHome = useCallback(() => {
    resetSelections();
    navigate(localizePath(lang, "/"));
  }, [lang, navigate, resetSelections]);

  const handleNavigate = useCallback(
    (target: Screen) => {
      if (target === "home") {
        handleGoHome();
        return;
      }

      if (target === "test") {
        handleStartTest();
        return;
      }

      if (target === "about") {
        navigate(localizePath(lang, "/about"));
        return;
      }

      if (target === "types") {
        navigate(localizePath(lang, "/types"));
        return;
      }

      if (target === "results") {
        if (!testMode) {
          navigate(localizePath(lang, "/test"));
          return;
        }

        const payload: TestCompletePayload = { mode: testMode, likedChips, dislikedChips };
        if (payload.likedChips.length > 0) {
          goToResults(payload);
        } else {
          navigate(localizePath(lang, "/test"));
        }
      }
    },
    [dislikedChips, goToResults, handleGoHome, handleStartTest, lang, likedChips, navigate, testMode],
  );

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const params = resolvedResultsPayload
      ? createResultsSearchParams(resolvedResultsPayload)
      : new URLSearchParams();
    const search = params.toString();
    return `${window.location.origin}${localizePath(lang, "/results")}${search ? `?${search}` : ""}`;
  }, [lang, resolvedResultsPayload]);

  const renderRoutes = (routeLang: Lang) => {
    const base = routeLang === "ko" ? "" : "/en";

    return (
      <>
        <Route
          path={base === "" ? "/" : base}
          element={<Home onStart={handleStartTest} lang={routeLang} onAbout={() => navigate(localizePath(routeLang, "/about"))} />}
        />
        <Route
          path={`${base}/about`}
          element={<About lang={routeLang} onStart={handleStartTest} onTypes={() => navigate(localizePath(routeLang, "/types"))} />}
        />
        <Route path={`${base}/types`} element={<ColorTypes lang={routeLang} />} />
        <Route path={`${base}/types/:typeId`} element={<ColorTypeDetail lang={routeLang} />} />
        <Route
          path={`${base}/test`}
          element={
            <ColorTest
              onComplete={handleTestComplete}
              onHome={handleGoHome}
              lang={routeLang}
              onToggleLang={handleToggleLang}
            />
          }
        />
        <Route
          path={`${base}/results`}
          element={
            <Results
              mode={resolvedResultsPayload?.mode ?? "detailed"}
              likedChips={resolvedResultsPayload?.likedChips ?? []}
              dislikedChips={resolvedResultsPayload?.dislikedChips ?? []}
              onRetry={handleRetry}
              lang={routeLang}
              shareUrl={shareUrl}
            />
          }
        />
      </>
    );
  };

  return (
    <div className="min-h-screen w-full">
      {screen !== "test" && (
        <Header
          lang={lang}
          onToggleLang={handleToggleLang}
          screen={screen}
          onNavigate={handleNavigate}
        />
      )}
      <Routes>
        {renderRoutes("ko")}
        {renderRoutes("en")}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {screen !== "test" && <Footer lang={lang} />}
    </div>
  );
}

export default App;
