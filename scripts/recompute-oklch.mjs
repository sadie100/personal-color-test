import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { converter } from "culori";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, "../src/data/colorData.ts");
const theoryPath = resolve(__dirname, "../docs/THEORY.md");

const toOklch = converter("oklch");
const round = (value, digits) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const compute = (hex) => {
  const o = toOklch(hex);
  return { l: round(o.l, 3), c: round(o.c, 3), h: round(o.h ?? 0, 1) };
};

const formatOklch = ({ l, c, h }) => `oklch(${l} ${c} ${h})`;

const hexRe = /#[0-9A-Fa-f]{6}/;
const oklchRe = /oklch\([\d.]+\s+[\d.]+\s+[\d.]+\)/;

// --- 1. src/data/colorData.ts ---
let dataSource = readFileSync(dataPath, "utf8");
const chipRegex =
  /(createChip\(\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*")(#[0-9A-Fa-f]{6})(",\s*\{\s*l:\s*)[\d.]+(,\s*c:\s*)[\d.]+(,\s*h:\s*)[\d.]+(\s*\},)/g;

let chipCount = 0;
dataSource = dataSource.replace(chipRegex, (_, pre, hex, lPre, cPre, hPre, post) => {
  const { l, c, h } = compute(hex);
  chipCount += 1;
  return `${pre}${hex}${lPre}${l}${cPre}${c}${hPre}${h}${post}`;
});
writeFileSync(dataPath, dataSource);
console.log(`Updated ${chipCount} chips in src/data/colorData.ts`);

// --- 2. docs/THEORY.md ---
// Table-cell aware: split each line by `|`, then within each cell (or pair of
// adjacent cells) match an oklch token to the hex that shares its cell —
// falling back to the adjacent cell's hex if the oklch cell has no hex of its
// own. This prevents Pattern B from crossing into the next row's cell in
// tables that already pair oklch+hex inside a single cell.
let theorySource = readFileSync(theoryPath, "utf8");
let theoryCount = 0;

const lines = theorySource.split("\n");
const updatedLines = lines.map((line) => {
  if (!line.includes("oklch(") || !line.includes("#")) return line;
  if (!line.includes("|")) {
    // Non-table line: single-cell fallback (Pattern A only).
    return line.replace(
      /(`)(oklch\([\d.]+\s+[\d.]+\s+[\d.]+\))(`\s+`)(#[0-9A-Fa-f]{6})(`)/g,
      (_, q1, _oklch, sep, hex, q2) => {
        theoryCount += 1;
        return `${q1}${formatOklch(compute(hex))}${sep}${hex}${q2}`;
      },
    );
  }

  const cells = line.split("|");
  for (let i = 0; i < cells.length; i += 1) {
    const cell = cells[i];
    if (!oklchRe.test(cell)) continue;

    const inCellHex = cell.match(hexRe);
    const hex = inCellHex ? inCellHex[0] : cells[i - 1]?.match(hexRe)?.[0] ?? cells[i + 1]?.match(hexRe)?.[0];
    if (!hex) continue;

    cells[i] = cell.replace(oklchRe, () => {
      theoryCount += 1;
      return formatOklch(compute(hex));
    });
  }
  return cells.join("|");
});

writeFileSync(theoryPath, updatedLines.join("\n"));
console.log(`Updated ${theoryCount} oklch entries in docs/THEORY.md`);
