import type { Lang, PersonalColorType } from "../types";

export interface StylingMakeup {
  skin: string;
  lip: string;
  eye: string;
}

export interface StylingRecommendation {
  keywords: Record<Lang, string[]>;
  fabric: Record<Lang, string>;
  patterns: Record<Lang, string>;
  accessorySize: Record<Lang, string>;
  metals: Record<Lang, string>;
  hair: Record<Lang, string>;
  makeup: Record<Lang, StylingMakeup>;
}

const lightKeywordsKo = ["밝음", "가벼움", "산뜻함", "경쾌함", "생기"];
const lightKeywordsEn = ["Bright", "Light", "Fresh", "Airy", "Lively"];
const lightFabricKo = "쉬폰, 오간자, 캐시미어처럼 가볍고 부드러운 소재 (대비감: 약)";
const lightFabricEn = "Lightweight, soft fabrics like chiffon, organza, cashmere (low contrast)";
const lightPatternsKo = "작은 꽃무늬, 도트, 얇은 스트라이프 등 밝은 색의 대비 약한 무늬";
const lightPatternsEn = "Small florals, dots, thin stripes — bright, low-contrast patterns";
const lightAccessoryKo = "작고 여리여리한 디자인, 큐빅, 비즈로 은은한 포인트";
const lightAccessoryEn = "Small, delicate pieces — cubic zirconia, beads, subtle accents";

const darkKeywordsKo = ["무게감", "안정감", "고급스러움", "강렬함", "성숙함"];
const darkKeywordsEn = ["Depth", "Stability", "Luxe", "Intensity", "Mature"];
const darkFabricKo = "옥스퍼드, 울, 스웨이드, 무광 가죽 등 묵직한 소재 (대비감: 중)";
const darkFabricEn = "Weighty fabrics — oxford, wool, suede, matte leather (medium contrast)";
const darkPatternsKo = "헤링본, 레오파드, 큰 패턴 등 어두운 색의 중~강한 대비 무늬";
const darkPatternsEn = "Herringbone, leopard, large motifs — dark tones with medium to strong contrast";
const darkAccessoryKo = "크기가 크고 존재감 있는 디자인, 엔틱, 유색 보석, 블랙 스톤";
const darkAccessoryEn = "Large statement pieces — antique, colored gemstones, black stones";

const brightKeywordsKo = ["선명함", "화려함", "생동감", "에너지", "입체감"];
const brightKeywordsEn = ["Clarity", "Vivid", "Energy", "Dynamic", "Dimensional"];
const brightFabricKo = "새틴, 캐시미어, 벨벳, 유광 가죽 등 광택감 있는 소재 (대비감: 강)";
const brightFabricEn = "Glossy fabrics — satin, cashmere, velvet, glossy leather (strong contrast)";
const brightPatternsKo = "큰 패턴, 큰 스트라이프, 포인트 컬러가 들어간 화려한 패턴";
const brightPatternsEn = "Bold patterns, wide stripes, vivid accent-color motifs";
const brightAccessoryKo = "반짝이고 화려한 디자인, 큐빅, 크리스탈, 다이아몬드, 유색 보석";
const brightAccessoryEn = "Sparkling, bold pieces — cubic zirconia, crystal, diamond, colored gems";

const mutedKeywordsKo = ["은은함", "부드러움", "차분함", "자연스러움", "안정감"];
const mutedKeywordsEn = ["Soft", "Gentle", "Calm", "Natural", "Grounded"];
const mutedFabricKo = "리넨, 울, 스웨이드, 코듀로이 등 은은하고 매트한 소재 (대비감: 중)";
const mutedFabricEn = "Matte, understated fabrics — linen, wool, suede, corduroy (medium contrast)";
const mutedPatternsKo = "체크, 모노톤 꽃무늬처럼 크기가 크지 않고 대비 약한 잔잔한 패턴";
const mutedPatternsEn = "Check, monochrome florals — small, low-contrast gentle patterns";
const mutedAccessoryKo = "중~작은 크기의 광택이 적고 은은한 디자인, 진주, 앤틱, 무광";
const mutedAccessoryEn = "Medium to small pieces with low shine — pearls, antique, matte finish";

export const stylingRecommendations: Record<PersonalColorType, StylingRecommendation> = {
  "Spring Light": {
    keywords: { ko: lightKeywordsKo, en: lightKeywordsEn },
    fabric: { ko: lightFabricKo, en: lightFabricEn },
    patterns: { ko: lightPatternsKo, en: lightPatternsEn },
    accessorySize: { ko: lightAccessoryKo, en: lightAccessoryEn },
    metals: { ko: "골드, 샴페인 골드, 로즈골드", en: "Gold, champagne gold, rose gold" },
    hair: { ko: "베이지 브라운, 코랄 베이지", en: "Beige brown, coral beige" },
    makeup: {
      ko: {
        skin: "촉촉한 수분광 피부 (새틴·쉬머 제형)",
        lip: "글로시·투명 립으로 가볍게",
        eye: "펄감이 가볍게 들어간 아이섀도",
      },
      en: {
        skin: "Dewy, luminous skin (satin or shimmer finish)",
        lip: "Glossy, sheer lips",
        eye: "Light shimmer eyeshadow",
      },
    },
  },
  "Spring Bright": {
    keywords: { ko: brightKeywordsKo, en: brightKeywordsEn },
    fabric: { ko: brightFabricKo, en: brightFabricEn },
    patterns: { ko: brightPatternsKo, en: brightPatternsEn },
    accessorySize: { ko: brightAccessoryKo, en: brightAccessoryEn },
    metals: { ko: "골드, 샴페인 골드, 로즈골드", en: "Gold, champagne gold, rose gold" },
    hair: { ko: "다크 브라운, 코랄 베이지", en: "Dark brown, coral beige" },
    makeup: {
      ko: {
        skin: "클리어한 피부 (오일리·촉촉·펄 제형)",
        lip: "쨍한 포인트 립, 글로시 풀립",
        eye: "선명한 아이라인과 또렷한 컬러",
      },
      en: {
        skin: "Clear, radiant skin (oily, dewy, or pearl finish)",
        lip: "Vivid accent lips, glossy full lips",
        eye: "Crisp liner with vivid color",
      },
    },
  },
  "Summer Light": {
    keywords: { ko: lightKeywordsKo, en: lightKeywordsEn },
    fabric: { ko: lightFabricKo, en: lightFabricEn },
    patterns: { ko: lightPatternsKo, en: lightPatternsEn },
    accessorySize: { ko: lightAccessoryKo, en: lightAccessoryEn },
    metals: { ko: "화이트 골드, 실버, 로즈골드", en: "White gold, silver, rose gold" },
    hair: { ko: "초코 브라운, 파스텔 핑크", en: "Chocolate brown, pastel pink" },
    makeup: {
      ko: {
        skin: "촉촉한 수분광 피부 (새틴·쉬머 제형)",
        lip: "글로시·투명 립으로 가볍게",
        eye: "펄감이 가볍게 들어간 아이섀도",
      },
      en: {
        skin: "Dewy, luminous skin (satin or shimmer finish)",
        lip: "Glossy, sheer lips",
        eye: "Light shimmer eyeshadow",
      },
    },
  },
  "Summer Muted": {
    keywords: { ko: mutedKeywordsKo, en: mutedKeywordsEn },
    fabric: { ko: mutedFabricKo, en: mutedFabricEn },
    patterns: { ko: mutedPatternsKo, en: mutedPatternsEn },
    accessorySize: { ko: mutedAccessoryKo, en: mutedAccessoryEn },
    metals: { ko: "실버, 로즈골드", en: "Silver, rose gold" },
    hair: { ko: "초코 브라운, 파스텔 핑크", en: "Chocolate brown, pastel pink" },
    makeup: {
      ko: {
        skin: "소프트 매트 피부 (세미매트·매트·쉬머 제형)",
        lip: "톤다운 립, 투톤·그라데이션 립",
        eye: "음영 섀도우로 은은한 깊이감",
      },
      en: {
        skin: "Soft matte skin (semi-matte, matte, or shimmer finish)",
        lip: "Toned-down lips, two-tone or gradient",
        eye: "Shadow-based eyes with subtle depth",
      },
    },
  },
  "Autumn Muted": {
    keywords: { ko: mutedKeywordsKo, en: mutedKeywordsEn },
    fabric: { ko: mutedFabricKo, en: mutedFabricEn },
    patterns: { ko: mutedPatternsKo, en: mutedPatternsEn },
    accessorySize: { ko: mutedAccessoryKo, en: mutedAccessoryEn },
    metals: { ko: "골드, 로즈골드, 브론즈", en: "Gold, rose gold, bronze" },
    hair: { ko: "베이지 브라운, 카키 브라운", en: "Beige brown, khaki brown" },
    makeup: {
      ko: {
        skin: "소프트 매트 피부 (세미매트·매트·쉬머 제형)",
        lip: "톤다운 립, 투톤·그라데이션 립",
        eye: "음영 섀도우로 은은한 깊이감",
      },
      en: {
        skin: "Soft matte skin (semi-matte, matte, or shimmer finish)",
        lip: "Toned-down lips, two-tone or gradient",
        eye: "Shadow-based eyes with subtle depth",
      },
    },
  },
  "Autumn Dark": {
    keywords: { ko: darkKeywordsKo, en: darkKeywordsEn },
    fabric: { ko: darkFabricKo, en: darkFabricEn },
    patterns: { ko: darkPatternsKo, en: darkPatternsEn },
    accessorySize: { ko: darkAccessoryKo, en: darkAccessoryEn },
    metals: { ko: "골드, 브론즈, 로즈골드", en: "Gold, bronze, rose gold" },
    hair: { ko: "다크 브라운, 카키 브라운", en: "Dark brown, khaki brown" },
    makeup: {
      ko: {
        skin: "세미매트 피부 (세미매트·매트·글리터 제형)",
        lip: "딥 레드, 매트·풀립",
        eye: "깊이 있는 아이 메이크업, 컨투어링",
      },
      en: {
        skin: "Semi-matte skin (semi-matte, matte, or glitter finish)",
        lip: "Deep red, matte full lips",
        eye: "Deep eye makeup with contouring",
      },
    },
  },
  "Winter Bright": {
    keywords: { ko: brightKeywordsKo, en: brightKeywordsEn },
    fabric: { ko: brightFabricKo, en: brightFabricEn },
    patterns: { ko: brightPatternsKo, en: brightPatternsEn },
    accessorySize: { ko: brightAccessoryKo, en: brightAccessoryEn },
    metals: { ko: "화이트 골드, 실버", en: "White gold, silver" },
    hair: { ko: "레드 브라운, 블루 블랙", en: "Red brown, blue black" },
    makeup: {
      ko: {
        skin: "클리어한 피부 (오일리·촉촉·펄 제형)",
        lip: "쨍한 포인트 립, 글로시 풀립",
        eye: "선명한 아이라인과 또렷한 컬러",
      },
      en: {
        skin: "Clear, radiant skin (oily, dewy, or pearl finish)",
        lip: "Vivid accent lips, glossy full lips",
        eye: "Crisp liner with vivid color",
      },
    },
  },
  "Winter Dark": {
    keywords: { ko: darkKeywordsKo, en: darkKeywordsEn },
    fabric: { ko: darkFabricKo, en: darkFabricEn },
    patterns: { ko: darkPatternsKo, en: darkPatternsEn },
    accessorySize: { ko: darkAccessoryKo, en: darkAccessoryEn },
    metals: { ko: "화이트 골드, 실버, 크롬", en: "White gold, silver, chrome" },
    hair: { ko: "레드 브라운, 블루 블랙", en: "Red brown, blue black" },
    makeup: {
      ko: {
        skin: "세미매트 피부 (세미매트·매트·글리터 제형)",
        lip: "딥 레드, 매트·풀립",
        eye: "깊이 있는 아이 메이크업, 컨투어링",
      },
      en: {
        skin: "Semi-matte skin (semi-matte, matte, or glitter finish)",
        lip: "Deep red, matte full lips",
        eye: "Deep eye makeup with contouring",
      },
    },
  },
};
