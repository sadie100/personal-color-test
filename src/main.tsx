import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element '#root' was not found.");
}

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages tag #root with their path. Hydrate only when it matches the
// current URL; otherwise (e.g. the SPA fallback shell served to /test) render fresh.
if (rootElement.dataset.ssgPath && norm(rootElement.dataset.ssgPath) === norm(window.location.pathname)) {
  hydrateRoot(rootElement, app);
} else {
  rootElement.innerHTML = "";
  createRoot(rootElement).render(app);
}
