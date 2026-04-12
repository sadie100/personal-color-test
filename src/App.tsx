import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { About } from "./components/About";
import { ColorTest } from "./components/ColorTest";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { Results } from "./components/Results";
import "./index.css";
import type { ColorWithSeason, Lang, Screen, TestCompletePayload, TestCompleteResult } from "./types";
import { createResultsSearchParams, getPayloadFromResultsSearchParams } from "./utils/resultShare";

const PREVIEW_RESULT: TestCompletePayload = {
  likedColors: [
    {
      hex: "#FFA07A",
      name: "Light Salmon",
      hsl: { h: 17, s: 100, l: 74 },
      seasonTone: "Autumn Light",
    },
    {
      hex: "#DEB887",
      name: "Burlywood",
      hsl: { h: 34, s: 57, l: 70 },
      seasonTone: "Autumn Light",
    },
    { hex: "#FFD700", name: "Gold", hsl: { h: 51, s: 100, l: 50 }, seasonTone: "Spring Bright" },
    {
      hex: "#FF8C00",
      name: "Dark Orange",
      hsl: { h: 33, s: 100, l: 50 },
      seasonTone: "Autumn Bright",
    },
    {
      hex: "#D2691E",
      name: "Chocolate",
      hsl: { h: 25, s: 75, l: 47 },
      seasonTone: "Autumn Bright",
    },
    {
      hex: "#FAFAD2",
      name: "Light Goldenrod",
      hsl: { h: 60, s: 100, l: 84 },
      seasonTone: "Autumn Light",
    },
  ],
  dislikedColors: [
    {
      hex: "#4682B4",
      name: "Muted Blue",
      hsl: { h: 207, s: 44, l: 49 },
      seasonTone: "Summer Muted",
    },
    {
      hex: "#4A7C7E",
      name: "Muted Teal",
      hsl: { h: 175, s: 24, l: 41 },
      seasonTone: "Summer Muted",
    },
    {
      hex: "#967BB6",
      name: "Muted Purple",
      hsl: { h: 280, s: 35, l: 63 },
      seasonTone: "Summer Muted",
    },
    {
      hex: "#0000FF",
      name: "Pure Blue",
      hsl: { h: 240, s: 100, l: 50 },
      seasonTone: "Winter Bright",
    },
  ],
};

const getResultPayload = (result: TestCompleteResult): TestCompletePayload => {
  if (Array.isArray(result)) {
    return {
      likedColors: result,
      dislikedColors: [],
    };
  }

  return result;
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

  return "home";
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [likedColors, setLikedColors] = useState<ColorWithSeason[]>([]);
  const [dislikedColors, setDislikedColors] = useState<ColorWithSeason[]>([]);
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
    () => payloadFromQuery ?? (likedColors.length > 0 ? { likedColors, dislikedColors } : null),
    [dislikedColors, likedColors, payloadFromQuery],
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

    if (likedColors.length > 0) {
      const currentPayload: TestCompletePayload = { likedColors, dislikedColors };
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
  }, [dislikedColors, likedColors, location.pathname, location.search, navigate, payloadFromQuery]);

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
    (result: TestCompleteResult) => {
      const payload = getResultPayload(result);
      setLikedColors(payload.likedColors);
      setDislikedColors(payload.dislikedColors);
      goToResults(payload);
    },
    [goToResults],
  );

  const resetSelections = useCallback(() => {
    setLikedColors([]);
    setDislikedColors([]);
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

      if (target === "results") {
        const payload: TestCompletePayload = { likedColors, dislikedColors };
        if (payload.likedColors.length > 0) {
          goToResults(payload);
        } else {
          navigate("/test");
        }
      }
    },
    [dislikedColors, goToResults, handleGoHome, handleStartTest, likedColors, navigate],
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
              likedColors={resolvedResultsPayload?.likedColors ?? []}
              dislikedColors={resolvedResultsPayload?.dislikedColors ?? []}
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
