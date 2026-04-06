export const translations = {
  ko: {
    // Header
    navAbout: "퍼스널 컬러란?",
    navTest: "테스트 시작",
    // Home
    subtitle: "12시즌 컬러 시스템으로 나만의 컬러 타입 찾기",
    homeHeroQuote: "당신에게 어울리는 색은 따로 있습니다",
    homeHeroSubtext:
      "퍼스널 컬러 분석으로 나만의 시즌 컬러 타입을 발견하세요. 피부톤에 맞는 색상을 알면 더 빛나는 나를 만들 수 있습니다.",
    homeLearnMore: "퍼스널 컬러에 대해 알아보기",
    featureViewColors: "다양한 색상을 풀스크린으로 감상",
    featureLikeDislike: "좋아요 / 싫어요로 색상 평가",
    featureRecommend: "나에게 맞는 색상 추천",
    featureLearn: "나의 시즌 컬러 타입 알아보기",
    tip: "팁: 테스트할 때 화면을 얼굴 가까이 대고 색상이 피부 톤에 어울리는지 확인해보세요.",
    startButton: "컬러 테스트 시작",
    // ColorTest
    liked: "좋아요",
    loading: "색상 불러오는 중...",
    homeButton: "← 처음으로",
    earlyExit: "중간 결과 보기 →",
    // Results
    yourPersonalColor: "당신의 퍼스널 컬러",
    bestColor: "Best Color",
    secondBestColor: "Second Best",
    thirdBestColor: "Third Best",
    worstColor: "Worst Color",
    resultPaletteIntro:
      "가장 잘 맞는 타입부터 차순위 타입, 그리고 피하면 좋은 타입까지 팔레트로 비교해보세요.",
    paletteTitle: (label) => `${label} 팔레트`,
    bestPaletteDescription: "당신의 베스트 타입에 속한 전체 컬러셋입니다.",
    comparisonPaletteDescription: "선택한 차순위 타입에 속한 전체 컬러셋입니다.",
    worstPaletteDescription: "상대적으로 피하는 편이 좋은 타입의 전체 컬러셋입니다.",
    paletteContainsCount: (count) => `포함 색상 ${count}개`,
    likedMatchesCount: (count) => `Like ${count}개`,
    dislikedMatchesCount: (count) => `Dislike ${count}개`,
    likedSticker: "LIKE",
    dislikedSticker: "NOPE",
    aboutColorType: "내 컬러 타입 분석",
    basedOn: "좋아요/싫어요 패턴을 분석한 결과, 가장 잘 맞는 컬러 특성은 다음과 같습니다:",
    tryAgain: "다시 시작",
    shareResult: "결과 공유",
    copied: "클립보드에 복사되었습니다!",
    shareText: (bestType, secondaryTypes = [], worstType = null) => {
      const secondaryText =
        secondaryTypes.length > 0 ? ` 차순위 후보는 ${secondaryTypes.join(", ")}입니다.` : "";
      const worstText = worstType ? ` 가장 피하면 좋은 컬러는 ${worstType}입니다.` : "";
      return `내 베스트 퍼스널 컬러는 ${bestType}입니다!${secondaryText}${worstText} 🎨`;
    },
    noLikes: "좋아요한 색이 없어서 분석할 수 없어요.",
    // Traits
    warmUndertone: "웜톤 (봄/가을 계열)",
    coolUndertone: "쿨톤 (여름/겨울 계열)",
    springTrait: "밝고 따뜻한 색상 선호",
    summerTrait: "부드럽고 시원한 색상 선호",
    autumnTrait: "깊고 따뜻한 색상 선호",
    winterTrait: "깊고 시원한 색상 선호",
    lightTrait: "높은 명도 선호",
    brightTrait: "높은 채도 선호",
    mutedTrait: "낮은 채도 선호",
    // About Page
    aboutTitle: "퍼스널 컬러의 모든 것",
    aboutIntro:
      "퍼스널 컬러는 개인의 타고난 신체 색상(피부, 눈동자, 머리카락)과 가장 조화를 이루는 색상 팔레트를 찾는 컬러 분석 시스템입니다.",
    aboutWhatIsPC: "퍼스널 컬러란?",
    aboutWhatIsPCDesc:
      "퍼스널 컬러 진단은 개인의 피부 톤, 눈동자 색, 머리카락 색 등 타고난 신체 색상을 분석하여 가장 잘 어울리는 색상 그룹을 찾아주는 것입니다. 자신에게 맞는 색상을 입으면 피부가 더 밝고 건강해 보이며, 맞지 않는 색상은 피부를 칙칙하게 만들 수 있습니다.",
    aboutPCCSTitle: "PCCS 톤 시스템",
    aboutPCCSDesc:
      "PCCS(Practical Color Co-ordinate System)는 색상을 명도(Lightness)와 채도(Saturation) 두 축으로 분류하는 시스템입니다. 위 도표에서 세로축은 명도를, 가로축은 채도를 나타냅니다. 같은 색상이라도 명도와 채도에 따라 전혀 다른 느낌을 주며, 이것이 퍼스널 컬러 진단의 핵심 원리입니다.",
    aboutPCCSImageAlt: "PCCS 톤 분류 도표 - 명도와 채도에 따른 색상 분류",
    aboutSeasonsTitle: "4계절 컬러 시스템",
    aboutSpringTitle: "봄 (Spring)",
    aboutSpringDesc:
      "따뜻하고 밝은 색감이 특징입니다. 복숭아색, 코럴, 밝은 노랑 등 화사하고 생기 있는 색상이 어울리며, 피부에 황금빛 웜톤을 가진 분들에게 잘 맞습니다.",
    aboutSummerTitle: "여름 (Summer)",
    aboutSummerDesc:
      "차갑고 부드러운 색감이 특징입니다. 라벤더, 로즈핑크, 스카이블루 등 은은하고 우아한 파스텔 톤이 어울리며, 피부에 분홍빛 쿨톤을 가진 분들에게 잘 맞습니다.",
    aboutAutumnTitle: "가을 (Autumn)",
    aboutAutumnDesc:
      "따뜻하고 깊은 색감이 특징입니다. 테라코타, 올리브, 머스타드 등 자연에서 볼 수 있는 깊고 풍부한 색상이 어울리며, 피부에 따뜻한 올리브톤을 가진 분들에게 잘 맞습니다.",
    aboutWinterTitle: "겨울 (Winter)",
    aboutWinterDesc:
      "차갑고 선명한 색감이 특징입니다. 순백, 블랙, 로열블루, 마젠타 등 강렬하고 대비가 뚜렷한 색상이 어울리며, 피부가 하얗거나 깊은 쿨톤을 가진 분들에게 잘 맞습니다.",
    aboutTonesTitle: "3가지 톤",
    aboutLightTitle: "라이트 (Light)",
    aboutLightDesc:
      "명도가 높은 밝고 가벼운 느낌의 색상입니다. 파스텔 계열이 대표적이며, 부드럽고 여성스러운 이미지를 줍니다.",
    aboutBrightTitle: "브라이트 (Bright)",
    aboutBrightDesc:
      "채도가 높은 선명하고 생동감 있는 색상입니다. 비비드한 색감으로 활기차고 에너지 넘치는 이미지를 줍니다.",
    aboutMutedTitle: "뮤트 (Muted)",
    aboutMutedDesc:
      "채도가 낮은 차분하고 탁한 느낌의 색상입니다. 그레이가 섞인 듯한 색감으로 성숙하고 세련된 이미지를 줍니다.",
    aboutHowItWorks: "테스트 방법",
    aboutStep1: "다양한 색상을 풀스크린으로 감상합니다",
    aboutStep2: "각 색상에 대해 좋아요 또는 싫어요로 평가합니다",
    aboutStep3: "선호하는 색상 패턴을 분석하여 당신의 퍼스널 컬러를 알려드립니다",
    aboutCTA: "지금 테스트 해보기",
  },
  en: {
    // Header
    navAbout: "About Personal Color",
    navTest: "Start Test",
    // Home
    subtitle: "Discover your seasonal color palette",
    homeHeroQuote: "There's a color palette made just for you",
    homeHeroSubtext:
      "Discover your seasonal color type through personal color analysis. Knowing the right colors for your skin tone helps you look your best.",
    homeLearnMore: "Learn about Personal Color",
    featureViewColors: "View full-screen colors",
    featureLikeDislike: "Like or dislike colors with simple buttons",
    featureRecommend: "Get personalized color recommendations",
    featureLearn: "Learn about your seasonal color type",
    tip: "Tip: Hold your screen up to your face while testing to see how colors complement your skin tone.",
    startButton: "Start Color Test",
    // ColorTest
    liked: "Liked",
    loading: "Loading colors...",
    homeButton: "← Home",
    earlyExit: "See Results →",
    // Results
    yourPersonalColor: "Your Personal Color",
    bestColor: "Best Color",
    secondBestColor: "Second Best",
    thirdBestColor: "Third Best",
    worstColor: "Worst Color",
    resultPaletteIntro:
      "Compare your best match, runner-up palettes, and the palette that tends to work against you.",
    paletteTitle: (label) => `${label} Palette`,
    bestPaletteDescription: "This is the full palette for your strongest personal color match.",
    comparisonPaletteDescription: "This is the full palette for the selected runner-up match.",
    worstPaletteDescription: "This is the palette that is relatively better to avoid.",
    paletteContainsCount: (count) => `${count} colors`,
    likedMatchesCount: (count) => `${count} liked`,
    dislikedMatchesCount: (count) => `${count} disliked`,
    likedSticker: "LIKE",
    dislikedSticker: "NOPE",
    aboutColorType: "About Your Color Type",
    basedOn: "Based on your like/dislike patterns, these are your strongest color characteristics:",
    tryAgain: "Try Again",
    shareResult: "Share Result",
    copied: "Copied to clipboard!",
    shareText: (bestType, secondaryTypes = [], worstType = null) => {
      const secondaryText =
        secondaryTypes.length > 0 ? ` Runner-up matches: ${secondaryTypes.join(", ")}.` : "";
      const worstText = worstType ? ` The least flattering category is ${worstType}.` : "";
      return `My best personal color is ${bestType}!${secondaryText}${worstText} 🎨`;
    },
    noLikes: "No liked colors to analyze.",
    // Traits
    warmUndertone: "Warm undertone (Spring/Autumn family)",
    coolUndertone: "Cool undertone (Summer/Winter family)",
    springTrait: "Preference for bright, warm colors",
    summerTrait: "Preference for soft, cool colors",
    autumnTrait: "Preference for deep, warm colors",
    winterTrait: "Preference for deep, cool colors",
    lightTrait: "High lightness preference",
    brightTrait: "High saturation preference",
    mutedTrait: "Lower saturation preference",
    // About Page
    aboutTitle: "Everything About Personal Color",
    aboutIntro:
      "Personal color analysis is a color system that identifies the palette of colors that best harmonize with your natural body colors — skin tone, eye color, and hair color.",
    aboutWhatIsPC: "What is Personal Color?",
    aboutWhatIsPCDesc:
      "Personal color diagnosis analyzes your natural body colors — skin tone, eye color, and hair color — to find the color group that suits you best. Wearing your right colors makes your skin look brighter and healthier, while wrong colors can make you look dull and tired.",
    aboutPCCSTitle: "PCCS Tone System",
    aboutPCCSDesc:
      "PCCS (Practical Color Co-ordinate System) classifies colors along two axes: Lightness and Saturation. In the chart above, the vertical axis represents lightness and the horizontal axis represents saturation. The same hue can feel completely different depending on its lightness and saturation — this is the core principle behind personal color analysis.",
    aboutPCCSImageAlt:
      "PCCS Tone Classification Chart — colors organized by lightness and saturation",
    aboutSeasonsTitle: "The 4 Season Color System",
    aboutSpringTitle: "Spring",
    aboutSpringDesc:
      "Characterized by warm and bright colors. Peach, coral, and bright yellow are flattering choices. Best suited for those with a golden warm undertone in their skin.",
    aboutSummerTitle: "Summer",
    aboutSummerDesc:
      "Characterized by cool and soft colors. Lavender, rose pink, and sky blue pastels are ideal. Best suited for those with a pinkish cool undertone in their skin.",
    aboutAutumnTitle: "Autumn",
    aboutAutumnDesc:
      "Characterized by warm and deep colors. Terracotta, olive, and mustard — rich, earthy tones found in nature. Best suited for those with a warm olive undertone.",
    aboutWinterTitle: "Winter",
    aboutWinterDesc:
      "Characterized by cool and vivid colors. Pure white, black, royal blue, and magenta — bold, high-contrast colors. Best suited for those with a fair or deep cool undertone.",
    aboutTonesTitle: "3 Tone Types",
    aboutLightTitle: "Light",
    aboutLightDesc:
      "High-lightness colors with a bright, airy feel. Pastels are representative, giving a soft and feminine impression.",
    aboutBrightTitle: "Bright",
    aboutBrightDesc:
      "High-saturation vivid colors full of life. These vibrant hues create an energetic and dynamic impression.",
    aboutMutedTitle: "Muted",
    aboutMutedDesc:
      "Low-saturation calm and subdued colors. Grayed-out tones that give a mature and sophisticated impression.",
    aboutHowItWorks: "How the Test Works",
    aboutStep1: "View various colors in full-screen mode",
    aboutStep2: "Rate each color with like or dislike",
    aboutStep3: "We analyze your color preferences to reveal your personal color type",
    aboutCTA: "Take the Test Now",
  },
};
