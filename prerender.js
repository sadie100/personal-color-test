import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "dist");
const BUILD_DATE = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const { render, prerenderRoutes, ORIGIN, buildJsonLd } = await import(
  pathToFileURL(resolve(dist, "server/entry-server.js")).href
);

const template = readFileSync(resolve(dist, "index.html"), "utf-8");

const esc = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const applyMeta = ({ title, description }) => (html) => {
  const t = esc(title);
  const d = esc(description);
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(name="description"[\s\S]*?content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(property="og:description"[\s\S]*?content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(name="twitter:description"[\s\S]*?content=")[^"]*(")/, `$1${d}$2`);
};

const headLinks = ({ url, lang, alternates }) =>
  [
    `<link rel="canonical" href="${ORIGIN}${url}" />`,
    `<meta property="og:url" content="${ORIGIN}${url}" />`,
    `<link rel="alternate" hreflang="ko" href="${ORIGIN}${alternates.ko}" />`,
    `<link rel="alternate" hreflang="en" href="${ORIGIN}${alternates.en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${alternates.ko}" />`,
    `<meta property="og:locale" content="${lang === "ko" ? "ko_KR" : "en_US"}" />`,
  ]
    .map((line) => `    ${line}`)
    .join("\n");

for (const route of prerenderRoutes) {
  const appHtml = render(route.url);

  let html = template.replace(
    '<div id="root"></div>',
    `<div id="root" data-ssg-path="${route.url}">${appHtml}</div>`,
  );
  html = applyMeta(route)(html);
  html = html.replace("</head>", `${headLinks(route)}\n  </head>`);
  const ld = buildJsonLd(route);
  const ldScript = `    <script type="application/ld+json">${JSON.stringify(ld)}</script>`;
  html = html.replace("</head>", `${ldScript}\n  </head>`);
  if (route.lang === "en") {
    html = html.replace('<html lang="ko">', '<html lang="en">');
  }

  const outDir = route.url === "/" ? dist : resolve(dist, `.${route.url}`);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html, "utf-8");
  console.log("prerendered", route.url);
}

// Regenerate sitemap.xml with both languages + hreflang alternates (kept in sync with routes).
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...prerenderRoutes.map((route) =>
    [
      "  <url>",
      `    <loc>${ORIGIN}${route.url}</loc>`,
      `    <lastmod>${BUILD_DATE}</lastmod>`,
      `    <xhtml:link rel="alternate" hreflang="ko" href="${ORIGIN}${route.alternates.ko}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}${route.alternates.en}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${route.alternates.ko}" />`,
      "  </url>",
    ].join("\n"),
  ),
  "</urlset>",
  "",
].join("\n");
writeFileSync(resolve(dist, "sitemap.xml"), sitemap, "utf-8");

// The SSR bundle is only needed during prerendering — drop it from the deployed output.
rmSync(resolve(dist, "server"), { recursive: true, force: true });

console.log(`\nDone. ${prerenderRoutes.length} pages prerendered + sitemap.xml regenerated.`);
console.log("dist/index.html (ko home) doubles as the SPA fallback for /test, /results.");
