# 퍼스널컬러 진단 웹 애플리케이션

An interactive web application for discovering your personal color type through a Tinder-style color preference test. This project implements the 12-season personal color system (Light/Bright/Muted × Spring/Summer/Autumn/Winter).

## 🎨 Features

- **Full-screen color testing**: View colors at full screen to test against your skin tone
- **Tinder-style interaction**: Like, dislike, or skip colors with intuitive buttons
- **Keyboard shortcuts**: Use arrow keys (←/→) and spacebar for hands-free navigation
- **Intelligent diagnosis**: Analyzes color preferences to determine your seasonal color type
- **Personalized recommendations**: Shows recommended colors and colors to avoid
- **Detailed results**: View your personal color type with comprehensive analysis
- **Responsive design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **React 18**: UI framework
- **Vite**: Fast build tool and dev server
- **Tailwind CSS v4**: Utility-first CSS framework
- **JavaScript (ES6+)**: Color analysis and state management

## 📁 Project Structure

```
personal-color-test/
├── src/
│   ├── components/
│   │   ├── ColorTest.jsx       # Main color testing interface
│   │   ├── ColorCard.jsx       # Full-screen color display
│   │   ├── SwipeButtons.jsx    # Like/Dislike/Skip buttons
│   │   ├── ProgressBar.jsx     # Test progress indicator
│   │   ├── Results.jsx         # Results and recommendations
│   │   └── Home.jsx            # Welcome screen
│   ├── data/
│   │   └── colorData.js        # 12-season color palettes
│   ├── utils/
│   │   └── analyzer.js         # Color analysis algorithm
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Navigate to project directory
cd personal-color-test

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port if busy).

## 📖 How to Use

1. **Start**: Click "Start Color Test" on the welcome screen
2. **Test**: View each color at full screen
   - **Like (♥)**: Right button or press →
   - **Dislike (✕)**: Left button or press ←
   - **Skip (⟳)**: Middle button or press Space
3. **Results**: View your personal color type and recommendations

## 🎯 The 12 Seasons System

The system divides personal colors into 12 types:

**Warm tones (Spring & Autumn):**
- **Spring**: Light, bright, warm colors (Light, Bright, Muted)
- **Autumn**: Deep, warm colors (Light, Bright, Muted)

**Cool tones (Summer & Winter):**
- **Summer**: Soft, cool colors (Light, Bright, Muted)
- **Winter**: Deep, cool colors (Light, Bright, Muted)

Each type has three tone variations:
- **Light**: High lightness (pastels and pale colors)
- **Bright**: High saturation (vivid colors)
- **Muted**: Lower saturation (softer colors)

## 🧮 Color Analysis Algorithm

The diagnosis engine analyzes:
1. **Lightness average**: Determines Light/Light vs. Bright/Muted
2. **Saturation average**: Distinguishes Bright from Muted
3. **Hue average**: Determines warm (Spring/Autumn) vs. cool (Summer/Winter)
4. **Temperature**: Separates Spring from Autumn, Summer from Winter

The algorithm calculates HSL values and performs circular mean for hue averaging (accounting for the circular nature of color hue).

## 📊 Color Data

- **Total colors**: ~180 colors across 12 seasonal types
- **Per type**: 15 colors each
- **Format**: Color name, hex value, and HSL values

## 🎮 Keyboard Shortcuts

- **→ / Right Click**: Like the current color
- **← / Left Click**: Dislike the current color
- **Space**: Skip to the next color

## 🎨 UI Components

### Home.jsx
Welcome screen with project description and start button.

### ColorTest.jsx
Main testing interface managing:
- Color shuffling
- State management (liked/disliked)
- Keyboard event handling
- Progress tracking

### Results.jsx
Displays:
- Diagnosed personal color type
- All liked colors
- Recommended colors for the diagnosed type
- Colors to avoid
- Detailed analysis

## 🔧 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview  # Preview built app
```

The built files will be in the `dist/` directory.

## 📝 Color Data Format

Each color is defined as:
```javascript
{
  name: "Color Name",
  hex: "#RRGGBB",
  hsl: { h: 0-360, s: 0-100, l: 0-100 }
}
```

## 🚀 Future Enhancement Ideas

- AI-powered color analysis refinement
- Seasonal fashion coordination suggestions
- Celebrity personal color comparisons
- Friend comparison features
- Multi-language support (Korean, English)
- Share results as images
- Local storage for saved results
- Dark mode support

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Development Notes

- Uses React's `useState` and `useEffect` for state management
- Keyboard shortcuts implemented with `useCallback` for performance
- Color shuffling happens on mount using `Math.random()`
- Transitions use CSS transitions for smooth animations
- Responsive design using Tailwind CSS grid system

## 🐛 Known Limitations

- Results are based on color preference, not professional color analysis
- Accurate results require testing with proper lighting
- Mobile devices may need brightness adjustment for accurate testing
- Results reflect color preference rather than traditional color theory

---

**Created with ❤️ for discovering your perfect color palette**
