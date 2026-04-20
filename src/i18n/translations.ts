import type { ResultTone, TranslationSchema, Translations } from "../types";

const ko: TranslationSchema = {
  nav: {
    about: "퍼스널 컬러란?",
    test: "테스트 시작",
    types: "컬러 타입 유형",
  },
  home: {
    subtitle: "8타입 퍼스널 컬러 시스템으로 나만의 타입 찾기",
    hero: {
      quote: "당신에게 어울리는 색은 따로 있습니다",
      subtext:
        "이론 기반 진단 컬러칩으로 나의 퍼스널 컬러 8타입을 찾아보세요. 잘 맞는 색의 방향을 알면 스타일링이 훨씬 선명해집니다.",
    },
    learnMore: "퍼스널 컬러에 대해 알아보기",
    startButton: "컬러 테스트 시작",
    features: {
      viewColors: "다양한 색상을 풀스크린으로 감상",
      likeDislike: "좋아요 / 싫어요로 색상 평가",
      recommend: "나에게 맞는 색상 추천",
      learn: "나의 시즌 컬러 타입 알아보기",
    },
    tip: "팁: 테스트할 때 화면을 얼굴 가까이 대고 색상이 피부 톤에 어울리는지 확인해보세요.",
  },
  test: {
    start: "컬러 테스트 시작",
    earlyExit: "중간 결과 보기 →",
    loading: "색상 불러오는 중...",
    liked: "좋아요",
    home: "← 처음으로",
    setup: {
      title: "원하는 테스트 모드를 골라보세요",
      description: "테스트 모드에 따라 보여드리는 컬러칩 구성이 달라집니다.",
    },
    mode: {
      title: "테스트 모드",
      description: "원하는 진단 깊이에 맞춰 테스트 범위를 선택하세요.",
      simple: {
        label: "간략 테스트",
        description:
          "베이스와 계절 단계만 테스트해서 봄 웜 / 여름 쿨 같은 큰 방향을 빠르게 확인합니다.",
        count: (count: number) => `문항 ${count}개 · 베이스 + 계절`,
      },
      detailed: {
        label: "세부 테스트",
        description:
          "베이스와 계절에 더해, 브라이트·뮤트·다크 같은 세부톤까지 자세히 확인하고 결과에서 톤별 스타일링 가이드도 함께 제공합니다.",
        count: (count: number) => `문항 ${count}개 · 베이스 + 계절 + 세부톤`,
      },
      startSelected: "선택한 모드로 테스트 시작",
    },
    progress: {
      current: (label: string) => `현재 테스트 ${label}`,
      remaining: (count: number) => `남은 색상 ${count}개`,
      phases: "포함 단계",
    },
  },
  hueCategory: {
    red: "빨강",
    orange: "주황",
    yellow: "노랑",
    green: "초록",
    blue: "파랑",
    purplePink: "보라/핑크",
    neutral: "무채색",
  },
  results: {
    header: "당신의 퍼스널 컬러",
    best: "Best Color",
    second: "Second Best",
    third: "Third Best",
    worst: "Worst Color",
    paletteIntro:
      "가장 잘 맞는 타입부터 차순위 타입, 그리고 피하면 좋은 타입까지 팔레트로 비교해보세요.",
    simpleIntro: "베스트/워스트 결과를 만든 베이스와 계절 진단 컬러칩을 직접 비교해보세요.",
    paletteTitle: (label: string) => `${label} 팔레트`,
    diagnosticChipTitle: (label: string) => `${label} 진단칩`,
    paletteDescriptions: {
      best: "당신의 베스트 타입에 속한 전체 컬러셋입니다.",
      comparison: "선택한 차순위 타입에 속한 전체 컬러셋입니다.",
      worst: "상대적으로 피하는 편이 좋은 타입의 전체 컬러셋입니다.",
    },
    simpleDiagnostics: {
      best: "베스트 결과를 만든 베이스/계절 진단 컬러칩입니다.",
      worst: "워스트 결과와 반대 경향을 보인 베이스/계절 진단 컬러칩입니다.",
    },
    badges: {
      paletteCount: (count: number) => `포함 색상 ${count}개`,
      likedCount: (count: number) => `Like ${count}개`,
      dislikedCount: (count: number) => `Dislike ${count}개`,
      liked: "LIKE",
      disliked: "NOPE",
    },
    analysisTitle: "내 컬러 타입 분석",
    analysisIntro: "좋아요/싫어요 패턴을 분석한 결과, 가장 잘 맞는 컬러 특성은 다음과 같습니다:",
    tryAgain: "다시 시작",
    share: "결과 공유",
    copied: "클립보드에 복사되었습니다!",
    shareText: (
      bestType: ResultTone,
      secondaryTypes: ResultTone[] = [],
      worstType: ResultTone | null = null,
    ) => {
      const secondaryText =
        secondaryTypes.length > 0 ? ` 차순위 후보는 ${secondaryTypes.join(", ")}입니다.` : "";
      const worstText = worstType ? ` 가장 피하면 좋은 컬러는 ${worstType}입니다.` : "";
      return `내 베스트 퍼스널 컬러는 ${bestType}입니다!${secondaryText}${worstText} 🎨`;
    },
    noLikes: "좋아요한 색이 없어서 분석할 수 없어요.",
  },
  undertone: {
    warm: "웜톤 (봄/가을 계열)",
    cool: "쿨톤 (여름/겨울 계열)",
  },
  traits: {
    spring: "밝고 따뜻한 색상 선호",
    summer: "부드럽고 시원한 색상 선호",
    autumn: "깊고 따뜻한 색상 선호",
    winter: "깊고 시원한 색상 선호",
    light: "높은 명도 선호",
    bright: "높은 채도 선호",
    muted: "낮은 채도 선호",
    dark: "낮은 명도와 깊이감 선호",
  },
  about: {
    title: "퍼스널 컬러의 모든 것",
    intro:
      "퍼스널 컬러는 개인의 타고난 신체 색상(피부, 눈동자, 머리카락)과 가장 조화를 이루는 색상 팔레트를 찾는 컬러 분석 시스템입니다.",
    whatIs: {
      title: "퍼스널 컬러란?",
      desc: "퍼스널 컬러 진단은 개인의 피부 톤, 눈동자 색, 머리카락 색 등 타고난 신체 색상을 분석하여 가장 잘 어울리는 색상 그룹을 찾아주는 것입니다. 자신에게 맞는 색상을 입으면 피부가 더 밝고 건강해 보이며, 맞지 않는 색상은 피부를 칙칙하게 만들 수 있습니다.",
    },
    pccs: {
      title: "PCCS 톤 시스템",
      desc: "PCCS(Practical Color Co-ordinate System)는 색상을 명도(Lightness)와 채도(Saturation) 두 축으로 분류하는 시스템입니다. 위 도표에서 세로축은 명도를, 가로축은 채도를 나타냅니다. 같은 색상이라도 명도와 채도에 따라 전혀 다른 느낌을 주며, 이것이 퍼스널 컬러 진단의 핵심 원리입니다.",
      imageAlt: "PCCS 톤 분류 도표 - 명도와 채도에 따른 색상 분류",
    },
    seasons: {
      title: "4계절 컬러 시스템",
      spring: {
        title: "봄 (Spring)",
        desc: "따뜻하고 밝은 색감이 특징입니다. 복숭아색, 코럴, 밝은 노랑 등 화사하고 생기 있는 색상이 어울리며, 피부에 황금빛 웜톤을 가진 분들에게 잘 맞습니다.",
      },
      summer: {
        title: "여름 (Summer)",
        desc: "차갑고 부드러운 색감이 특징입니다. 라벤더, 로즈핑크, 스카이블루 등 은은하고 우아한 파스텔 톤이 어울리며, 피부에 분홍빛 쿨톤을 가진 분들에게 잘 맞습니다.",
      },
      autumn: {
        title: "가을 (Autumn)",
        desc: "따뜻하고 깊은 색감이 특징입니다. 테라코타, 올리브, 머스타드 등 자연에서 볼 수 있는 깊고 풍부한 색상이 어울리며, 피부에 따뜻한 올리브톤을 가진 분들에게 잘 맞습니다.",
      },
      winter: {
        title: "겨울 (Winter)",
        desc: "차갑고 선명한 색감이 특징입니다. 순백, 블랙, 로열블루, 마젠타 등 강렬하고 대비가 뚜렷한 색상이 어울리며, 피부가 하얗거나 깊은 쿨톤을 가진 분들에게 잘 맞습니다.",
      },
    },
    tones: {
      title: "4가지 세부 톤",
      light: {
        title: "라이트 (Light)",
        desc: "명도가 높은 밝고 가벼운 느낌의 색상입니다. 파스텔 계열이 대표적이며, 부드럽고 여성스러운 이미지를 줍니다.",
      },
      bright: {
        title: "브라이트 (Bright)",
        desc: "채도가 높은 선명하고 생동감 있는 색상입니다. 비비드한 색감으로 활기차고 에너지 넘치는 이미지를 줍니다.",
      },
      muted: {
        title: "뮤트 (Muted)",
        desc: "채도가 낮은 차분하고 탁한 느낌의 색상입니다. 그레이가 섞인 듯한 색감으로 성숙하고 세련된 이미지를 줍니다.",
      },
      dark: {
        title: "다크 (Dark)",
        desc: "명도가 낮고 깊이감이 있는 색상입니다. 무게감과 대비감을 살려 얼굴 윤곽을 또렷하고 안정감 있게 보이게 합니다.",
      },
    },
    howItWorks: {
      title: "테스트 방법",
      step1: "다양한 색상을 풀스크린으로 감상합니다",
      step2: "각 색상에 대해 좋아요 또는 싫어요로 평가합니다",
      step3: "선호하는 색상 패턴을 분석하여 당신의 퍼스널 컬러를 알려드립니다",
    },
    cta: "지금 테스트 해보기",
  },
  styling: {
    title: "스타일링 가이드",
    subtitle: (type: string) => `${type}를 위한 맞춤 추천`,
    fabric: "소재 & 실루엣",
    pattern: "패턴",
    accessory: "액세서리 & 메탈",
    hair: "헤어 컬러",
    makeup: "메이크업",
    keywords: "키워드",
    skin: "피부 표현",
    lip: "립",
    eye: "아이",
    metal: "메탈",
    accessorySize: "디자인",
    sourceNote: "※ 참고: 한국분장예술인협회 퍼스널 컬러 컨설턴트 이론",
  },
  types: {
    pageTitle: "퍼스널 컬러 8타입",
    pageSubtitle: "웜/쿨 × 라이트·브라이트·뮤트·다크로 나뉘는 8가지 세부 타입",
    pageIntro:
      "색의 베이스(웜/쿨), 명도, 채도·청탁을 기준으로 분류한 8개 세부 타입입니다. 각 타입을 눌러 이론적 특징과 어울리는 스타일링 가이드를 확인해보세요.",
    warmGroupTitle: "웜톤 (Warm)",
    warmGroupDesc: "옐로우 베이스. 따뜻함과 생기가 살아나는 계열 — 봄·가을",
    coolGroupTitle: "쿨톤 (Cool)",
    coolGroupDesc: "블루 베이스. 시원함과 투명감이 돋보이는 계열 — 여름·겨울",
    cardViewDetail: "자세히 보기 →",
    detail: {
      baseLabel: "색상 베이스",
      brightnessLabel: "명도",
      chromaLabel: "채도",
      clarityLabel: "청탁",
      keywordsLabel: "키워드",
      pccsLabel: "PCCS 톤 범위",
      paletteLabel: "대표 팔레트",
      beautyTitle: "뷰티 · 패션 가이드",
      fashionTitle: "패션 스타일링",
      prev: "이전 타입",
      next: "다음 타입",
      backToList: "← 타입 목록으로",
      heroMetaSeason: (season: string) => `계절 · ${season}`,
      heroMetaBase: (base: string) => `베이스 · ${base}`,
      heroMetaTone: (tone: string) => `세부톤 · ${tone}`,
    },
    "spring-light": {
      title: "봄 라이트",
      tagline: "Spring Light · 밝고 가벼운 파스텔의 봄",
      summary:
        "옐로우 베이스의 밝고 화사한 타입입니다. 피부에 은은한 노란빛이 감돌며, 높은 명도와 맑은 청탁감 덕분에 투명하고 생기 있는 인상을 줍니다. 파스텔톤처럼 가벼운 색에서 가장 큰 매력이 발휘됩니다.",
      quote:
        "봄 라이트는 옐로우 베이스 위의 부드럽고 화사한 이미지로, 파스텔톤의 맑은 색에서 가장 큰 매력을 발휘합니다.",
      attributes: {
        base: "옐로우 베이스 (웜톤)",
        brightness: "고명도 (밝음)",
        chroma: "중채도",
        clarity: "맑은색 계열 (윤기 · 광택)",
      },
      keywords: ["밝음", "가벼움", "산뜻함", "경쾌함", "생기"],
    },
    "spring-bright": {
      title: "봄 브라이트",
      tagline: "Spring Bright · 선명하고 화려한 봄",
      summary:
        "옐로우 베이스에 높은 채도가 더해진 타입입니다. 따뜻하면서도 선명한 색이 피부를 또렷하게 만들어 주며, 화려한 색에 밀리지 않고 오히려 존재감을 살려냅니다. 투명감과 광택이 돋보이는 인상을 줍니다.",
      quote:
        "봄 브라이트는 옐로우 베이스의 따뜻하고 밝은 이미지에 선명함이 더해져, 화사하고 에너지 넘치는 색에서 가장 큰 매력을 발휘합니다.",
      attributes: {
        base: "옐로우 베이스 (웜톤)",
        brightness: "중~고명도",
        chroma: "고채도 (선명함)",
        clarity: "맑은색 계열 (윤기 · 광택)",
      },
      keywords: ["선명함", "화려함", "생동감", "에너지", "입체감"],
    },
    "summer-light": {
      title: "여름 라이트",
      tagline: "Summer Light · 맑고 투명한 파스텔의 여름",
      summary:
        "블루 베이스의 밝고 부드러운 타입입니다. 피부에 푸른 기운이 감돌아 깔끔하고 청초한 인상을 주며, 옅고 온화한 파스텔이 잘 어울립니다. 화려한 색보다는 은은하고 투명한 색에서 매력이 살아납니다.",
      quote:
        "여름 라이트는 블루 베이스의 밝고 부드러운 이미지로, 은은하고 투명한 파스텔에서 가장 큰 매력을 발휘합니다.",
      attributes: {
        base: "블루 베이스 (쿨톤)",
        brightness: "고명도 (밝음)",
        chroma: "중~저채도 (부드러움)",
        clarity: "중간 청탁감 (라이트 계열의 맑음)",
      },
      keywords: ["밝음", "가벼움", "산뜻함", "경쾌함", "생기"],
    },
    "summer-muted": {
      title: "여름 뮤트",
      tagline: "Summer Muted · 은은하고 우아한 여름",
      summary:
        "블루 베이스에 탁한 청탁감이 더해진 타입입니다. 피부가 매끈하고 균일하게 표현되며, 은은한 회색빛이 감도는 색에서 고급스럽고 엘레강스한 인상이 완성됩니다. 강렬한 색보다 차분한 톤다운 색이 잘 어울립니다.",
      quote:
        "여름 뮤트는 블루 베이스의 부드러운 이미지에 차분함이 더해져, 은은하고 우아한 색에서 가장 큰 매력을 발휘합니다.",
      attributes: {
        base: "블루 베이스 (쿨톤)",
        brightness: "중명도",
        chroma: "저채도 (부드러움)",
        clarity: "탁한색 계열 (매트)",
      },
      keywords: ["은은함", "부드러움", "차분함", "자연스러움", "안정감"],
    },
    "autumn-muted": {
      title: "가을 뮤트",
      tagline: "Autumn Muted · 자연스러운 어스톤의 가을",
      summary:
        "옐로우 베이스에 낮은 채도가 결합된 타입입니다. 피부가 매트하고 균일하게 표현되며, 자연에서 볼 수 있는 어스톤 · 세이지 · 모카 같은 색에서 따뜻하고 성숙한 인상을 줍니다.",
      quote:
        "가을 뮤트는 옐로우 베이스의 부드럽고 차분한 이미지로, 자연스러운 어스톤 색에서 가장 큰 매력을 발휘합니다.",
      attributes: {
        base: "옐로우 베이스 (웜톤)",
        brightness: "중명도",
        chroma: "저채도 (차분함)",
        clarity: "탁한색 계열 (매트)",
      },
      keywords: ["은은함", "부드러움", "차분함", "자연스러움", "안정감"],
    },
    "autumn-dark": {
      title: "가을 다크",
      tagline: "Autumn Dark · 깊이감 있는 우드톤의 가을",
      summary:
        "옐로우 베이스 위에 낮은 명도가 얹힌 타입입니다. 피부가 짙고 깊이감 있게 표현되며, 다크 브라운 · 와인 · 올리브 등 묵직한 색에서 고급스럽고 성숙한 분위기가 극대화됩니다.",
      quote:
        "가을 다크는 옐로우 베이스의 따뜻하고 성숙한 이미지로, 깊이 있고 묵직한 색에서 가장 큰 매력을 발휘합니다.",
      attributes: {
        base: "옐로우 베이스 (웜톤)",
        brightness: "저명도 (어두움)",
        chroma: "중~저채도",
        clarity: "탁한색 계열 (매트 · 깊이감)",
      },
      keywords: ["무게감", "안정감", "고급스러움", "강렬함", "성숙함"],
    },
    "winter-bright": {
      title: "겨울 브라이트",
      tagline: "Winter Bright · 쨍하고 선명한 겨울",
      summary:
        "블루 베이스에 높은 채도가 결합된 타입입니다. 피부가 맑고 투명하게 보이며, 마젠타 · 코발트 블루 · 에메랄드 그린처럼 쨍한 비비드 컬러에서 강렬하고 세련된 이미지가 살아납니다.",
      quote:
        "겨울 브라이트는 블루 베이스 위의 선명한 채도로, 강렬하고 샤프한 색에서 가장 큰 매력을 발휘합니다.",
      attributes: {
        base: "블루 베이스 (쿨톤)",
        brightness: "중~고명도",
        chroma: "고채도 (선명함)",
        clarity: "맑은색 계열 (윤기 · 광택)",
      },
      keywords: ["선명함", "화려함", "생동감", "에너지", "입체감"],
    },
    "winter-dark": {
      title: "겨울 다크",
      tagline: "Winter Dark · 강렬한 콘트라스트의 겨울",
      summary:
        "블루 베이스에 낮은 명도가 더해진 타입입니다. 얼굴 윤곽이 수축되어 샤프하게 보이며, 네이비 · 차콜 · 블랙처럼 깊고 무게감 있는 색에서 대비감 있는 세련된 인상이 완성됩니다.",
      quote:
        "겨울 다크는 블루 베이스의 강렬하고 세련된 이미지로, 깊고 샤프한 색에서 가장 큰 매력을 발휘합니다.",
      attributes: {
        base: "블루 베이스 (쿨톤)",
        brightness: "저명도 (깊이감)",
        chroma: "중~저채도 (강한 콘트라스트)",
        clarity: "맑은색 계열 (윤기 · 광택)",
      },
      keywords: ["무게감", "안정감", "고급스러움", "강렬함", "성숙함"],
    },
  },
  attribution: {
    heading: "이론 근거",
    line: "본 테스트는 대한민국 퍼스널 컬러 컨설턴트 2급 (한국분장예술인협회) 이론을 기반으로 설계되었습니다.",
    source: "출처 · 한국분장예술인협회 퍼스널 컬러 컨설턴트 교육과정",
  },
};

const en: TranslationSchema = {
  nav: {
    about: "About Personal Color",
    test: "Start Test",
    types: "Color Types",
  },
  home: {
    subtitle: "Discover your personal color within 8 canonical types",
    hero: {
      quote: "There's a color palette made just for you",
      subtext:
        "Discover your personal color type through theory-based diagnostic chips. Knowing your best direction makes styling and color choices much clearer.",
    },
    learnMore: "Learn about Personal Color",
    startButton: "Start Color Test",
    features: {
      viewColors: "View full-screen colors",
      likeDislike: "Like or dislike colors with simple buttons",
      recommend: "Get personalized color recommendations",
      learn: "Learn about your seasonal color type",
    },
    tip: "Tip: Hold your screen up to your face while testing to see how colors complement your skin tone.",
  },
  test: {
    start: "Start Color Test",
    earlyExit: "See Results →",
    loading: "Loading colors...",
    liked: "Liked",
    home: "← Home",
    setup: {
      title: "Choose your test mode",
      description: "The set of color chips shown will vary depending on the test mode.",
    },
    mode: {
      title: "Test mode",
      description: "Pick the depth of diagnosis you want for this run.",
      simple: {
        label: "Quick test",
        description:
          "Tests only the base and season stages for a faster Spring Warm / Winter Cool style result.",
        count: (count: number) => `${count} chips · base + season`,
      },
      detailed: {
        label: "Detailed test",
        description:
          "In addition to base and season, this mode digs into detail tones like bright, muted, and dark, and also provides tone-specific styling guidance in the results.",
        count: (count: number) => `${count} chips · base + season + detail`,
      },
      startSelected: "Start with this mode",
    },
    progress: {
      current: (label: string) => `Current test: ${label}`,
      remaining: (count: number) => `${count} colors remaining`,
      phases: "Included stages",
    },
  },
  hueCategory: {
    red: "Red",
    orange: "Orange",
    yellow: "Yellow",
    green: "Green",
    blue: "Blue",
    purplePink: "Purple / Pink",
    neutral: "Neutrals",
  },
  results: {
    header: "Your Personal Color",
    best: "Best Color",
    second: "Second Best",
    third: "Third Best",
    worst: "Worst Color",
    paletteIntro:
      "Compare your best match, runner-up palettes, and the palette that tends to work against you.",
    simpleIntro:
      "Compare the base and season diagnostic chips behind your best and worst results directly.",
    paletteTitle: (label: string) => `${label} Palette`,
    diagnosticChipTitle: (label: string) => `${label} Diagnostic Chips`,
    paletteDescriptions: {
      best: "This is the full palette for your strongest personal color match.",
      comparison: "This is the full palette for the selected runner-up match.",
      worst: "This is the palette that is relatively better to avoid.",
    },
    simpleDiagnostics: {
      best: "These are the base and season diagnostic chips behind your strongest result.",
      worst: "These are the base and season diagnostic chips that ran opposite to your result.",
    },
    badges: {
      paletteCount: (count: number) => `${count} colors`,
      likedCount: (count: number) => `${count} liked`,
      dislikedCount: (count: number) => `${count} disliked`,
      liked: "LIKE",
      disliked: "NOPE",
    },
    analysisTitle: "About Your Color Type",
    analysisIntro:
      "Based on your like/dislike patterns, these are your strongest color characteristics:",
    tryAgain: "Try Again",
    share: "Share Result",
    copied: "Copied to clipboard!",
    shareText: (
      bestType: ResultTone,
      secondaryTypes: ResultTone[] = [],
      worstType: ResultTone | null = null,
    ) => {
      const secondaryText =
        secondaryTypes.length > 0 ? ` Runner-up matches: ${secondaryTypes.join(", ")}.` : "";
      const worstText = worstType ? ` The least flattering category is ${worstType}.` : "";
      return `My best personal color is ${bestType}!${secondaryText}${worstText} 🎨`;
    },
    noLikes: "No liked colors to analyze.",
  },
  undertone: {
    warm: "Warm undertone (Spring/Autumn family)",
    cool: "Cool undertone (Summer/Winter family)",
  },
  traits: {
    spring: "Preference for bright, warm colors",
    summer: "Preference for soft, cool colors",
    autumn: "Preference for deep, warm colors",
    winter: "Preference for deep, cool colors",
    light: "High lightness preference",
    bright: "High saturation preference",
    muted: "Lower saturation preference",
    dark: "Preference for deeper, lower-lightness colors",
  },
  about: {
    title: "Everything About Personal Color",
    intro:
      "Personal color analysis is a color system that identifies the palette of colors that best harmonize with your natural body colors — skin tone, eye color, and hair color.",
    whatIs: {
      title: "What is Personal Color?",
      desc: "Personal color diagnosis analyzes your natural body colors — skin tone, eye color, and hair color — to find the color group that suits you best. Wearing your right colors makes your skin look brighter and healthier, while wrong colors can make you look dull and tired.",
    },
    pccs: {
      title: "PCCS Tone System",
      desc: "PCCS (Practical Color Co-ordinate System) classifies colors along two axes: Lightness and Saturation. In the chart above, the vertical axis represents lightness and the horizontal axis represents saturation. The same hue can feel completely different depending on its lightness and saturation — this is the core principle behind personal color analysis.",
      imageAlt: "PCCS Tone Classification Chart — colors organized by lightness and saturation",
    },
    seasons: {
      title: "The 4 Season Color System",
      spring: {
        title: "Spring",
        desc: "Characterized by warm and bright colors. Peach, coral, and bright yellow are flattering choices. Best suited for those with a golden warm undertone in their skin.",
      },
      summer: {
        title: "Summer",
        desc: "Characterized by cool and soft colors. Lavender, rose pink, and sky blue pastels are ideal. Best suited for those with a pinkish cool undertone in their skin.",
      },
      autumn: {
        title: "Autumn",
        desc: "Characterized by warm and deep colors. Terracotta, olive, and mustard — rich, earthy tones found in nature. Best suited for those with a warm olive undertone.",
      },
      winter: {
        title: "Winter",
        desc: "Characterized by cool and vivid colors. Pure white, black, royal blue, and magenta — bold, high-contrast colors. Best suited for those with a fair or deep cool undertone.",
      },
    },
    tones: {
      title: "4 Detail Tones",
      light: {
        title: "Light",
        desc: "High-lightness colors with a bright, airy feel. Pastels are representative, giving a soft and feminine impression.",
      },
      bright: {
        title: "Bright",
        desc: "High-saturation vivid colors full of life. These vibrant hues create an energetic and dynamic impression.",
      },
      muted: {
        title: "Muted",
        desc: "Low-saturation calm and subdued colors. Grayed-out tones that give a mature and sophisticated impression.",
      },
      dark: {
        title: "Dark",
        desc: "Low-lightness, deep colors with visual weight. They sharpen structure and create a more grounded, refined impression.",
      },
    },
    howItWorks: {
      title: "How the Test Works",
      step1: "View various colors in full-screen mode",
      step2: "Rate each color with like or dislike",
      step3: "We analyze your color preferences to reveal your personal color type",
    },
    cta: "Take the Test Now",
  },
  styling: {
    title: "Styling Guide",
    subtitle: (type: string) => `Curated for ${type}`,
    fabric: "Fabric & Silhouette",
    pattern: "Patterns",
    accessory: "Accessories & Metals",
    hair: "Hair Color",
    makeup: "Makeup",
    keywords: "Keywords",
    skin: "Skin",
    lip: "Lip",
    eye: "Eye",
    metal: "Metals",
    accessorySize: "Design",
    sourceNote: "※ Reference: Korean Personal Color Consultant theory (KMUA)",
  },
  types: {
    pageTitle: "The 8 Personal Color Types",
    pageSubtitle: "Warm / Cool × Light · Bright · Muted · Dark",
    pageIntro:
      "Eight detailed types classified by undertone (warm / cool), brightness, and chroma. Tap any card to explore its theoretical traits and curated styling guide.",
    warmGroupTitle: "Warm undertone",
    warmGroupDesc: "Yellow base — warmth and vitality. Spring · Autumn family.",
    coolGroupTitle: "Cool undertone",
    coolGroupDesc: "Blue base — coolness and clarity. Summer · Winter family.",
    cardViewDetail: "View details →",
    detail: {
      baseLabel: "Undertone",
      brightnessLabel: "Brightness",
      chromaLabel: "Chroma",
      clarityLabel: "Clarity",
      keywordsLabel: "Keywords",
      pccsLabel: "PCCS tone range",
      paletteLabel: "Representative palette",
      beautyTitle: "Beauty & fashion guide",
      fashionTitle: "Fashion styling",
      prev: "Previous type",
      next: "Next type",
      backToList: "← Back to all types",
      heroMetaSeason: (season: string) => `Season · ${season}`,
      heroMetaBase: (base: string) => `Undertone · ${base}`,
      heroMetaTone: (tone: string) => `Detail tone · ${tone}`,
    },
    "spring-light": {
      title: "Spring Light",
      tagline: "Bright, airy pastels of spring",
      summary:
        "A warm, luminous type with a yellow undertone. Skin reads softly golden, and the high brightness combined with a clear clarity gives a translucent, lively impression. Pastel and pale shades bring out the most charm.",
      quote:
        "Spring Light radiates a warm, airy image — soft pastels reveal the type's most radiant charm.",
      attributes: {
        base: "Yellow base (warm)",
        brightness: "High (bright)",
        chroma: "Medium",
        clarity: "Clear — glossy, luminous",
      },
      keywords: ["Bright", "Light", "Fresh", "Airy", "Lively"],
    },
    "spring-bright": {
      title: "Spring Bright",
      tagline: "Vivid, radiant spring",
      summary:
        "A warm type supercharged with high chroma. Bold, saturated colors sharpen the features and let vivid hues amplify presence rather than overwhelm. Skin reads luminous with a healthy glow.",
      quote:
        "Spring Bright carries warmth with sharpness — vivid, energized colors let this type shine.",
      attributes: {
        base: "Yellow base (warm)",
        brightness: "Medium–high",
        chroma: "High (vivid)",
        clarity: "Clear — glossy, luminous",
      },
      keywords: ["Vivid", "Radiant", "Dynamic", "Energy", "Dimension"],
    },
    "summer-light": {
      title: "Summer Light",
      tagline: "Clear, transparent pastels of summer",
      summary:
        "A cool, soft type with a blue undertone. Skin reads clean and crystalline, and pale, tender pastels feel most harmonious. Elegance comes from quiet, transparent colors rather than saturated ones.",
      quote:
        "Summer Light is a blue-based, soft, and airy image — gentle pastels reveal its most refined charm.",
      attributes: {
        base: "Blue base (cool)",
        brightness: "High (bright)",
        chroma: "Medium–low (soft)",
        clarity: "Balanced — light, fresh",
      },
      keywords: ["Bright", "Light", "Fresh", "Airy", "Lively"],
    },
    "summer-muted": {
      title: "Summer Muted",
      tagline: "Elegant, subdued summer",
      summary:
        "A cool type with a muted, matte clarity. Skin reads smooth and even, and grayed, dusty tones create a refined, elegant impression. Calm, desaturated colors flatter far more than loud ones.",
      quote:
        "Summer Muted layers blue-based softness with calm — subtle, dusty tones reveal its most graceful charm.",
      attributes: {
        base: "Blue base (cool)",
        brightness: "Medium",
        chroma: "Low (soft)",
        clarity: "Muted — matte, smooth",
      },
      keywords: ["Subtle", "Soft", "Calm", "Natural", "Stable"],
    },
    "autumn-muted": {
      title: "Autumn Muted",
      tagline: "Earthy, natural autumn",
      summary:
        "A warm type paired with low chroma. Skin reads matte and even, and earthy tones — sage, mocha, soft mustard — bring out a warm, mature feeling best.",
      quote:
        "Autumn Muted is warmth wrapped in calm — natural, earthy tones reveal its richest charm.",
      attributes: {
        base: "Yellow base (warm)",
        brightness: "Medium",
        chroma: "Low (subdued)",
        clarity: "Muted — matte",
      },
      keywords: ["Subtle", "Soft", "Calm", "Natural", "Stable"],
    },
    "autumn-dark": {
      title: "Autumn Dark",
      tagline: "Deep, grounded autumn",
      summary:
        "A warm type weighted with low brightness. Skin reads rich and dimensional, and dense woodsy colors — dark brown, wine, olive — push the mature, luxurious atmosphere to its peak.",
      quote:
        "Autumn Dark is warm richness with depth — dense, grounded colors reveal its most sophisticated charm.",
      attributes: {
        base: "Yellow base (warm)",
        brightness: "Low (deep)",
        chroma: "Medium–low",
        clarity: "Muted — matte with depth",
      },
      keywords: ["Weight", "Stability", "Luxe", "Intensity", "Maturity"],
    },
    "winter-bright": {
      title: "Winter Bright",
      tagline: "Sharp, saturated winter",
      summary:
        "A cool type pushed into high chroma. Skin reads clear and crystalline, and vivid colors — magenta, cobalt, emerald — create a bold, sharp, polished presence.",
      quote:
        "Winter Bright is cool-based vividness — saturated, sharp colors reveal its most striking charm.",
      attributes: {
        base: "Blue base (cool)",
        brightness: "Medium–high",
        chroma: "High (vivid)",
        clarity: "Clear — glossy, luminous",
      },
      keywords: ["Vivid", "Radiant", "Dynamic", "Energy", "Dimension"],
    },
    "winter-dark": {
      title: "Winter Dark",
      tagline: "High-contrast, refined winter",
      summary:
        "A cool type shadowed with low brightness. Features sharpen, and deep, heavy colors — navy, charcoal, black — complete a refined, high-contrast impression.",
      quote:
        "Winter Dark is cool depth with sharpness — bold, contrasting colors reveal its most polished charm.",
      attributes: {
        base: "Blue base (cool)",
        brightness: "Low (deep)",
        chroma: "Medium–low (high contrast)",
        clarity: "Clear — glossy, luminous",
      },
      keywords: ["Weight", "Stability", "Luxe", "Intensity", "Maturity"],
    },
  },
  attribution: {
    heading: "Theoretical basis",
    line: "This test is built on the Korean Personal Color Consultant Level 2 curriculum by the Korea Makeup Arts Association.",
    source: "Source · KMUA Personal Color Consultant curriculum",
  },
};

export const translations: Translations = {
  ko,
  en,
};
