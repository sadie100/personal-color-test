import pccsImage from "../assets/pccs_tone_map.jpg";
import { AttributionNote } from "../components/AttributionNote";
import { colorData } from "../data/colorData";
import { translations } from "../i18n/translations";
import type {
  AboutSeasonDescKey,
  AboutSeasonTitleKey,
  AboutToneDescKey,
  AboutToneTitleKey,
  Color,
  Lang,
  PersonalColorType,
} from "../types";

interface AboutProps {
  lang: Lang;
  onStart: () => void;
}

interface SeasonConfigItem {
  key: "Spring" | "Summer" | "Autumn" | "Winter";
  titleKey: AboutSeasonTitleKey;
  descKey: AboutSeasonDescKey;
  gradient: string;
  borderColor: string;
  bgColor: string;
  sampleKey: PersonalColorType;
}

interface ToneConfigItem {
  titleKey: AboutToneTitleKey;
  descKey: AboutToneDescKey;
  sampleKey: PersonalColorType;
  icon: string;
  bgColor: string;
  borderColor: string;
}

interface ColorSwatchesProps {
  colors: ReadonlyArray<Color>;
  count?: number;
}

const seasonConfig: ReadonlyArray<SeasonConfigItem> = [
  {
    key: "Spring",
    titleKey: "aboutSpringTitle",
    descKey: "aboutSpringDesc",
    gradient: "from-amber-400 to-orange-300",
    borderColor: "border-amber-400",
    bgColor: "bg-amber-50",
    sampleKey: "Spring Light",
  },
  {
    key: "Summer",
    titleKey: "aboutSummerTitle",
    descKey: "aboutSummerDesc",
    gradient: "from-sky-400 to-indigo-300",
    borderColor: "border-sky-400",
    bgColor: "bg-sky-50",
    sampleKey: "Summer Light",
  },
  {
    key: "Autumn",
    titleKey: "aboutAutumnTitle",
    descKey: "aboutAutumnDesc",
    gradient: "from-orange-600 to-amber-700",
    borderColor: "border-orange-600",
    bgColor: "bg-orange-50",
    sampleKey: "Autumn Muted",
  },
  {
    key: "Winter",
    titleKey: "aboutWinterTitle",
    descKey: "aboutWinterDesc",
    gradient: "from-indigo-600 to-purple-700",
    borderColor: "border-indigo-600",
    bgColor: "bg-indigo-50",
    sampleKey: "Winter Bright",
  },
];

const toneConfig: ReadonlyArray<ToneConfigItem> = [
  {
    titleKey: "aboutLightTitle",
    descKey: "aboutLightDesc",
    sampleKey: "Spring Light",
    icon: "☀",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
  },
  {
    titleKey: "aboutBrightTitle",
    descKey: "aboutBrightDesc",
    sampleKey: "Spring Bright",
    icon: "✦",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-300",
  },
  {
    titleKey: "aboutMutedTitle",
    descKey: "aboutMutedDesc",
    sampleKey: "Autumn Muted",
    icon: "◐",
    bgColor: "bg-stone-50",
    borderColor: "border-stone-300",
  },
  {
    titleKey: "aboutDarkTitle",
    descKey: "aboutDarkDesc",
    sampleKey: "Winter Dark",
    icon: "◼",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-400",
  },
];

const ColorSwatches = ({ colors, count = 5 }: ColorSwatchesProps) => (
  <div className="mt-3 flex gap-1.5">
    {colors.slice(0, count).map((color, index) => (
      <div
        key={`${color.hex}-${index}`}
        className="h-8 w-8 rounded-full border border-white/50 shadow-sm"
        style={{ backgroundColor: color.hex }}
        title={color.name}
      />
    ))}
  </div>
);

export const About = ({ lang, onStart }: AboutProps) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-16">
      <section className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 px-4 py-16 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold drop-shadow-lg md:text-5xl">{t.aboutTitle}</h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed break-keep opacity-95 md:text-xl">
          {t.aboutIntro}
        </p>
      </section>

      <div className="mx-auto max-w-4xl space-y-16 px-4 py-12">
        <section className="rounded-2xl bg-white p-6 shadow-lg md:p-10">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">{t.aboutWhatIsPC}</h2>
          <p className="text-base leading-relaxed break-keep text-gray-600 md:text-lg">
            {t.aboutWhatIsPCDesc}
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-lg md:p-10">
          <h2 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">{t.aboutPCCSTitle}</h2>
          <div className="mb-6 flex justify-center">
            <img
              src={pccsImage}
              alt={t.aboutPCCSImageAlt}
              className="max-w-full rounded-xl shadow-md md:max-w-lg"
            />
          </div>
          <p className="text-base leading-relaxed break-keep text-gray-600 md:text-lg">
            {t.aboutPCCSDesc}
          </p>
        </section>

        <section>
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:text-3xl">
            {t.aboutSeasonsTitle}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {seasonConfig.map((season) => (
              <div
                key={season.key}
                className={`${season.bgColor} rounded-2xl border-t-4 p-6 shadow-md ${season.borderColor}`}
              >
                <h3 className="mb-2 text-xl font-bold text-gray-800">{t[season.titleKey]}</h3>
                <p className="text-sm leading-relaxed break-keep text-gray-600">
                  {t[season.descKey]}
                </p>
                <ColorSwatches colors={colorData[season.sampleKey]} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:text-3xl">
            {t.aboutTonesTitle}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {toneConfig.map((tone) => (
              <div
                key={tone.titleKey}
                className={`${tone.bgColor} rounded-2xl border-t-4 p-6 shadow-md ${tone.borderColor}`}
              >
                <div className="mb-2 text-2xl">{tone.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-gray-800">{t[tone.titleKey]}</h3>
                <p className="text-sm leading-relaxed break-keep text-gray-600">{t[tone.descKey]}</p>
                <ColorSwatches colors={colorData[tone.sampleKey]} count={4} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-lg md:p-10">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 md:text-3xl">
            {t.aboutHowItWorks}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[t.aboutStep1, t.aboutStep2, t.aboutStep3].map((step, index) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xl font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed text-balance break-keep text-gray-600">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 text-center text-white shadow-lg md:p-12">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">{t.aboutCTA}</h2>
          <button
            onClick={onStart}
            className="cursor-pointer rounded-full bg-white px-8 py-4 text-lg font-bold text-purple-600 shadow-lg transition-all hover:scale-105 hover:bg-gray-100 active:scale-95"
          >
            {t.startButton}
          </button>
        </section>

        <AttributionNote lang={lang} />
      </div>

      <div className="h-12" />
    </div>
  );
};
