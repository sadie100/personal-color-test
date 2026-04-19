import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Header } from "./components/Header";
import { diagnosticChips } from "./data/colorData";
import "./index.css";
import { About } from "./pages/About";
import { ColorTest } from "./pages/ColorTest";
import { ColorTypeDetail } from "./pages/ColorTypeDetail";
import { ColorTypes } from "./pages/ColorTypes";
import { Home } from "./pages/Home";
import { Results } from "./pages/Results";
import type { DiagnosticChip, Lang, Screen, TestCompletePayload, TestMode } from "./types";
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

const getScreenFromPathname = (pathname: string): Screen => {
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
  const [lang, setLang] = useState<Lang>("ko");
  const screen = getScreenFromPathname(location.pathname);
  const payloadFromQuery = useMemo(
    () =>
      location.pathname === "/results"
        ? getPayloadFromResultsSearchParams(new URLSearchParams(location.search))
        : null,
    [location.pathname, location.search],
  );
  const resolvedResultsPayload = useMemo(
    () => payloadFromQuery ?? (likedChips.length > 0 && testMode ? { mode: testMode, likedChips, dislikedChips } : null),
    [dislikedChips, likedChips, payloadFromQuery, testMode],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const preview = new URLSearchParams(location.search).get("preview");
    if (preview === "about") {
      if (location.pathname !== "/about") {
        navigate("/about", { replace: true });
      }
      return;
    }

    if (preview === "results") {
      const search = createResultsSearchParams(PREVIEW_RESULT).toString();
      navigate(
        {
          pathname: "/results",
          search: search ? `?${search}` : "",
        },
        { replace: true },
      );
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (location.pathname !== "/results") {
      return;
    }

    const currentParams = new URLSearchParams(location.search);

    if (payloadFromQuery) {
      const canonicalSearch = createResultsSearchParams(payloadFromQuery).toString();
      if (canonicalSearch !== currentParams.toString()) {
        navigate(
          {
            pathname: "/results",
            search: canonicalSearch ? `?${canonicalSearch}` : "",
          },
          { replace: true },
        );
      }
      return;
    }

    if (likedChips.length > 0) {
      if (!testMode) {
        navigate("/test", { replace: true });
        return;
      }

      const currentPayload: TestCompletePayload = { mode: testMode, likedChips, dislikedChips };
      const canonicalSearch = createResultsSearchParams(currentPayload).toString();
      if (canonicalSearch && canonicalSearch !== currentParams.toString()) {
        navigate(
          {
            pathname: "/results",
            search: `?${canonicalSearch}`,
          },
          { replace: true },
        );
      }
      return;
    }

    navigate("/test", { replace: true });
  }, [dislikedChips, likedChips, location.pathname, location.search, navigate, payloadFromQuery, testMode]);

  const handleToggleLang = (newLang: Lang) => setLang(newLang);

  const goToResults = useCallback(
    (payload: TestCompletePayload) => {
      const search = createResultsSearchParams(payload).toString();
      navigate({
        pathname: "/results",
        search: search ? `?${search}` : "",
      });
    },
    [navigate],
  );

  const handleStartTest = useCallback(() => {
    navigate("/test");
  }, [navigate]);

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
    navigate("/test");
  }, [navigate, resetSelections]);

  const handleGoHome = useCallback(() => {
    resetSelections();
    navigate("/");
  }, [navigate, resetSelections]);

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
        navigate("/about");
        return;
      }

      if (target === "types") {
        navigate("/types");
        return;
      }

      if (target === "results") {
        if (!testMode) {
          navigate("/test");
          return;
        }

        const payload: TestCompletePayload = { mode: testMode, likedChips, dislikedChips };
        if (payload.likedChips.length > 0) {
          goToResults(payload);
        } else {
          navigate("/test");
        }
      }
    },
    [dislikedChips, goToResults, handleGoHome, handleStartTest, likedChips, navigate, testMode],
  );

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const params = resolvedResultsPayload
      ? createResultsSearchParams(resolvedResultsPayload)
      : new URLSearchParams();
    const search = params.toString();
    return `${window.location.origin}/results${search ? `?${search}` : ""}`;
  }, [resolvedResultsPayload]);

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
        <Route
          path="/"
          element={<Home onStart={handleStartTest} lang={lang} onAbout={() => navigate("/about")} />}
        />
        <Route path="/about" element={<About lang={lang} onStart={handleStartTest} />} />
        <Route path="/types" element={<ColorTypes lang={lang} />} />
        <Route path="/types/:typeId" element={<ColorTypeDetail lang={lang} />} />
        <Route
          path="/test"
          element={
            <ColorTest
              onComplete={handleTestComplete}
              onHome={handleGoHome}
              lang={lang}
              onToggleLang={handleToggleLang}
            />
          }
        />
        <Route
          path="/results"
          element={
            <Results
              mode={resolvedResultsPayload?.mode ?? "detailed"}
              likedChips={resolvedResultsPayload?.likedChips ?? []}
              dislikedChips={resolvedResultsPayload?.dislikedChips ?? []}
              onRetry={handleRetry}
              lang={lang}
              shareUrl={shareUrl}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
