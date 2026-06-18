/* eslint-disable react-refresh/only-export-components -- build-time SSR entry, not part of client fast-refresh */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import App from "./App";

export { prerenderRoutes, ORIGIN } from "./seo/routeMeta";
export { buildJsonLd } from "./seo/jsonLd";

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
