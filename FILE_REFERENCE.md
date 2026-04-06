# File Reference Guide

## Project Root Files

| File                      | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| `package.json`            | Project dependencies and scripts          |
| `vite.config.js`          | Vite build configuration                  |
| `tailwind.config.js`      | Tailwind CSS configuration                |
| `postcss.config.js`       | PostCSS plugins (Tailwind + Autoprefixer) |
| `index.html`              | HTML entry point with React root div      |
| `README.md`               | Main project documentation                |
| `IMPLEMENTATION_GUIDE.md` | Detailed implementation summary           |
| `FILE_REFERENCE.md`       | This file - file structure guide          |

## Source Code (`src/`)

### Main Application Files

#### `App.jsx`

**Purpose**: Main application component with routing logic
**Responsibilities**:

- Screen state management (home/test/results)
- Liked colors state management
- Navigation between screens
- Passing props to child components
  **Key Functions**:
- `handleStartTest()`: Transitions to color test
- `handleTestComplete()`: Processes results and transitions
- `handleRetry()`: Resets state and returns to test

#### `main.jsx`

**Purpose**: React application entry point
**Responsibilities**:

- Creates React root
- Renders App component with StrictMode
- Mounts to DOM #root element

#### `index.css`

**Purpose**: Global styles
**Content**:

- Tailwind directives (@tailwind)
- Root HTML/body reset
- Font family setup
- Height/width constraints for full-screen layout

### Components (`src/components/`)

#### `Home.jsx`

**Purpose**: Welcome/landing screen
**Props**: `onStart` (function)
**Features**:

- Gradient background (blue → purple → pink)
- Feature list display
- Usage tip about holding screen to face
- Call-to-action button
  **Lines**: ~40

#### `ColorTest.jsx`

**Purpose**: Main color testing interface
**Props**: `onComplete` (function)
**State**:

- `currentIndex`: Position in shuffled colors
- `likedColors`: Array of liked color objects
- `dislikedColors`: Array of disliked color objects
- `isTransitioning`: Fade animation state
- `shuffledColors`: All colors randomly shuffled
  **Key Functions**:
- `handleNext(liked)`: Process like/dislike
- `handleSkip()`: Move to next color
- Keyboard event listener setup
  **Features**:
- Full-screen color display
- Progress tracking
- Smooth transitions
- Keyboard shortcut support
  **Lines**: ~80

#### `ColorCard.jsx`

**Purpose**: Full-screen color display component
**Props**:

- `color` (object): {name, hex, hsl}
- `isTransitioning` (boolean): Fade state
  **Features**:
- Full viewport coverage
- Color name and hex display
- Text shadow for readability on any color
- CSS transition for fade effect
  **Lines**: ~15

#### `SwipeButtons.jsx`

**Purpose**: User interaction buttons
**Props**:

- `onDislike` (function)
- `onLike` (function)
- `onSkip` (function)
- `hasMore` (boolean)
  **Features**:
- Three circular buttons (red/gray/green)
- Hover scale animations
- Touch-friendly sizing (14-16rem diameter)
- Tooltips showing keyboard shortcuts
  **Lines**: ~30

#### `ProgressBar.jsx`

**Purpose**: Visual progress indicator
**Props**:

- `current` (number): Current color index
- `total` (number): Total colors
  **Features**:
- Thin bar at top of screen
- Width percentage animation
- Semi-transparent background
  **Lines**: ~15

#### `Results.jsx`

**Purpose**: Diagnosis results display
**Props**:

- `likedColors` (array): All liked colors
- `onRetry` (function): Retry callback
  **Responsibilities**:
- Call analyzer to determine personal color type
- Get recommended colors from colorData
- Get avoid colors using opposite type mapping
- Display comprehensive results
  **Features**:
- Personal color type display (large gradient text)
- Grid of liked colors (user's choices)
- Grid of recommended colors (top 6)
- Grid of colors to avoid (top 6)
- Analysis explanation with bullet points
- Retry and Share buttons
  **Lines**: ~150

### Data (`src/data/`)

#### `colorData.js`

**Purpose**: Complete color database for all 12 seasonal types
**Exports**:

- `colorData` (object): 12 keys (season+tone), each with 15 colors
- `seasonTones` (array): List of all 12 season-tone combinations
- `getOppositeType(type)` (function): Returns opposite type

**Structure**:

```
colorData = {
  "Spring Light": [{name, hex, hsl}, ...],
  "Spring Bright": [...],
  "Spring Muted": [...],
  // ... 12 total keys
}
```

**Color Object Format**:

```javascript
{
  name: "Color Name",
  hex: "#RRGGBB",
  hsl: { h: 0-360, s: 0-100, l: 0-100 }
}
```

**Statistics**:

- Total colors: 180 (15 × 12)
- File size: ~15 KB
- All colors include HSL values for analysis
  **Lines**: ~300

### Utilities (`src/utils/`)

#### `analyzer.js`

**Purpose**: Color analysis and diagnosis algorithm
**Exports**:

- `analyzePersonalColor(likedColors)` → Returns "Season Tone" string
- `calculateAverageHue(hues)` → Returns averaged hue (0-360)
- `getRecommendedColors(type, colorData)` → Returns color array
- `getAvoidColors(type, colorData)` → Returns color array

**Algorithm Details**:

`analyzePersonalColor(likedColors)`:

1. Calculate average Lightness from all liked colors
2. Calculate average Saturation
3. Calculate average Hue (with circular mean)
4. Determine warm (Spring/Autumn) vs. cool (Summer/Winter) from hue
5. Determine season (Light/Bright/Muted) from lightness and saturation
6. Return combined "Season Tone" string

`calculateAverageHue(hues)`:

- Converts hues to radians
- Calculates sin/cos averages
- Uses atan2 to get angular average
- Handles 0°-360° circular nature
- Returns hue in 0-360 range

**Lines**: ~60

### Assets (`src/assets/`)

- Default Vite assets (React logo, Vite logo)
- Not used in the application

## Directory Structure

```
personal-color-test/
├── public/                 (Static assets)
├── src/
│   ├── assets/            (Default Vite assets)
│   ├── components/
│   │   ├── Home.jsx
│   │   ├── ColorTest.jsx
│   │   ├── ColorCard.jsx
│   │   ├── SwipeButtons.jsx
│   │   ├── ProgressBar.jsx
│   │   └── Results.jsx
│   ├── data/
│   │   └── colorData.js
│   ├── utils/
│   │   └── analyzer.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css            (Unused, can delete)
│   └── index.css
├── dist/                   (Build output)
├── node_modules/          (Dependencies)
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── IMPLEMENTATION_GUIDE.md
└── FILE_REFERENCE.md
```

## File Size Summary

| File               | Type       | Size    |
| ------------------ | ---------- | ------- |
| colorData.js       | Data       | ~15 KB  |
| ColorTest.jsx      | Component  | ~3 KB   |
| Results.jsx        | Component  | ~6 KB   |
| analyzer.js        | Utility    | ~2 KB   |
| Home.jsx           | Component  | ~1.5 KB |
| Other components   | Components | ~2 KB   |
| App.jsx            | Component  | ~1 KB   |
| index.css          | CSS        | <1 KB   |
| **Total (source)** |            | ~31 KB  |
| **Minified JS**    | Built      | ~210 KB |
| **CSS**            | Built      | ~5 KB   |

## Configuration Files Explained

### `vite.config.js`

Vite build configuration with React plugin for JSX transformation.

### `tailwind.config.js`

Tailwind CSS configuration with template paths and theme extensions.

### `postcss.config.js`

PostCSS configuration using @tailwindcss/postcss plugin (v4 approach).

### `package.json`

- Scripts: `dev`, `build`, `preview`
- Dependencies: react, react-dom
- Dev dependencies: vite, tailwindcss, @tailwindcss/postcss, postcss, autoprefixer, eslint

## Component Dependencies Map

```
App.jsx
├── imports Home from components/Home.jsx
├── imports ColorTest from components/ColorTest.jsx
│   ├── imports ColorCard from components/ColorCard.jsx
│   ├── imports SwipeButtons from components/SwipeButtons.jsx
│   ├── imports ProgressBar from components/ProgressBar.jsx
│   └── imports colorData from data/colorData.js
└── imports Results from components/Results.jsx
    ├── imports analyzePersonalColor from utils/analyzer.js
    ├── imports getRecommendedColors from utils/analyzer.js
    ├── imports getAvoidColors from utils/analyzer.js
    └── imports colorData from data/colorData.js
```

## Key Code Locations

| Functionality      | File             | Location    |
| ------------------ | ---------------- | ----------- |
| Screen routing     | App.jsx          | Lines 10-25 |
| Color shuffling    | ColorTest.jsx    | Lines 16-18 |
| Keyboard shortcuts | ColorTest.jsx    | Lines 51-60 |
| Analysis algorithm | analyzer.js      | Lines 1-30  |
| Hue averaging      | analyzer.js      | Lines 32-43 |
| UI buttons         | SwipeButtons.jsx | Lines 4-25  |
| Results display    | Results.jsx      | Lines 12-80 |
| Color data         | colorData.js     | All lines   |

---

**Last Updated**: 2026-03-16
**Total Files**: 20+ files (including configuration)
**Total Lines of Code**: ~800 lines
