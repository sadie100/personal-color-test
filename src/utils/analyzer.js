import { seasonTones } from "../data/colorData";

export const analyzePersonalColor = (likedColors) => {
  if (likedColors.length === 0) {
    return null;
  }

  // Calculate average lightness and saturation
  const avgLightness = likedColors.reduce((sum, c) => sum + c.hsl.l, 0) / likedColors.length;
  const avgSaturation = likedColors.reduce((sum, c) => sum + c.hsl.s, 0) / likedColors.length;

  // Calculate average hue (accounting for circular nature)
  const hueValues = likedColors.map(c => c.hsl.h);
  const avgHue = calculateAverageHue(hueValues);

  // Determine warm/cool (spring/autumn vs summer/winter)
  const isWarm = (avgHue >= 0 && avgHue < 60) || (avgHue > 300 && avgHue <= 360);

  // Determine season
  let season;
  if (isWarm) {
    season = avgLightness > 65 ? "Spring" : "Autumn";
  } else {
    season = avgLightness > 65 ? "Summer" : "Winter";
  }

  // Determine tone (Light/Bright/Muted)
  let tone;
  if (avgLightness > 75) {
    tone = "Light";
  } else if (avgSaturation > 65) {
    tone = "Bright";
  } else {
    tone = "Muted";
  }

  return `${season} ${tone}`;
};

export const calculateAverageHue = (hues) => {
  if (hues.length === 0) return 0;

  const sin = hues.reduce((sum, h) => sum + Math.sin((h * Math.PI) / 180), 0) / hues.length;
  const cos = hues.reduce((sum, h) => sum + Math.cos((h * Math.PI) / 180), 0) / hues.length;

  let avg = Math.atan2(sin, cos) * (180 / Math.PI);
  return avg < 0 ? avg + 360 : avg;
};

export const getRecommendedColors = (personalColorType, allColors) => {
  // Get colors for the diagnosed type
  return allColors[personalColorType] || [];
};

export const getAvoidColors = (personalColorType, allColors) => {
  const opposites = {
    "Spring Light": "Autumn Muted",
    "Spring Bright": "Autumn Muted",
    "Spring Muted": "Autumn Bright",
    "Summer Light": "Winter Muted",
    "Summer Bright": "Winter Muted",
    "Summer Muted": "Winter Bright",
    "Autumn Light": "Spring Muted",
    "Autumn Bright": "Spring Muted",
    "Autumn Muted": "Spring Bright",
    "Winter Light": "Summer Muted",
    "Winter Bright": "Summer Muted",
    "Winter Muted": "Summer Bright",
  };

  const oppositeType = opposites[personalColorType];
  return allColors[oppositeType] || [];
};
