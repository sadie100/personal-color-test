import { translations } from '../i18n/translations'
import { colorData } from '../data/colorData'
import pccsImage from '../assets/pccs_tone_map.jpg'

const seasonConfig = [
  {
    key: 'Spring',
    titleKey: 'aboutSpringTitle',
    descKey: 'aboutSpringDesc',
    gradient: 'from-amber-400 to-orange-300',
    borderColor: 'border-amber-400',
    bgColor: 'bg-amber-50',
    sampleKey: 'Spring Light',
  },
  {
    key: 'Summer',
    titleKey: 'aboutSummerTitle',
    descKey: 'aboutSummerDesc',
    gradient: 'from-sky-400 to-indigo-300',
    borderColor: 'border-sky-400',
    bgColor: 'bg-sky-50',
    sampleKey: 'Summer Light',
  },
  {
    key: 'Autumn',
    titleKey: 'aboutAutumnTitle',
    descKey: 'aboutAutumnDesc',
    gradient: 'from-orange-600 to-amber-700',
    borderColor: 'border-orange-600',
    bgColor: 'bg-orange-50',
    sampleKey: 'Autumn Muted',
  },
  {
    key: 'Winter',
    titleKey: 'aboutWinterTitle',
    descKey: 'aboutWinterDesc',
    gradient: 'from-indigo-600 to-purple-700',
    borderColor: 'border-indigo-600',
    bgColor: 'bg-indigo-50',
    sampleKey: 'Winter Bright',
  },
]

const toneConfig = [
  {
    titleKey: 'aboutLightTitle',
    descKey: 'aboutLightDesc',
    sampleKey: 'Spring Light',
    icon: '☀',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
  },
  {
    titleKey: 'aboutBrightTitle',
    descKey: 'aboutBrightDesc',
    sampleKey: 'Spring Bright',
    icon: '✦',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
  },
  {
    titleKey: 'aboutMutedTitle',
    descKey: 'aboutMutedDesc',
    sampleKey: 'Autumn Muted',
    icon: '◐',
    bgColor: 'bg-stone-50',
    borderColor: 'border-stone-300',
  },
]

const ColorSwatches = ({ colors, count = 5 }) => (
  <div className="flex gap-1.5 mt-3">
    {colors.slice(0, count).map((color, i) => (
      <div
        key={i}
        className="w-8 h-8 rounded-full shadow-sm border border-white/50"
        style={{ backgroundColor: color.hex }}
        title={color.name}
      />
    ))}
  </div>
)

export const About = ({ lang, onStart }) => {
  const t = translations[lang]

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 py-16 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          {t.aboutTitle}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-95 leading-relaxed break-keep">
          {t.aboutIntro}
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* What is Personal Color? */}
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {t.aboutWhatIsPC}
          </h2>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg break-keep">
            {t.aboutWhatIsPCDesc}
          </p>
        </section>

        {/* PCCS Tone System */}
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            {t.aboutPCCSTitle}
          </h2>
          <div className="flex justify-center mb-6">
            <img
              src={pccsImage}
              alt={t.aboutPCCSImageAlt}
              className="max-w-full md:max-w-lg rounded-xl shadow-md"
            />
          </div>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg break-keep">
            {t.aboutPCCSDesc}
          </p>
        </section>

        {/* 4 Seasons */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            {t.aboutSeasonsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seasonConfig.map((season) => (
              <div
                key={season.key}
                className={`${season.bgColor} rounded-2xl shadow-md p-6 border-t-4 ${season.borderColor}`}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t[season.titleKey]}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed break-keep">
                  {t[season.descKey]}
                </p>
                <ColorSwatches colors={colorData[season.sampleKey]} />
              </div>
            ))}
          </div>
        </section>

        {/* 3 Tones */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            {t.aboutTonesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {toneConfig.map((tone) => (
              <div
                key={tone.titleKey}
                className={`${tone.bgColor} rounded-2xl shadow-md p-6 border-t-4 ${tone.borderColor}`}
              >
                <div className="text-2xl mb-2">{tone.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {t[tone.titleKey]}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed break-keep">
                  {t[tone.descKey]}
                </p>
                <ColorSwatches colors={colorData[tone.sampleKey]} count={4} />
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            {t.aboutHowItWorks}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[t.aboutStep1, t.aboutStep2, t.aboutStep3].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed text-balance break-keep">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-2xl p-8 md:p-12 text-center text-white shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.aboutCTA}</h2>
          <button
            onClick={onStart}
            className="bg-white hover:bg-gray-100 text-purple-600 font-bold text-lg py-4 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
          >
            {t.startButton}
          </button>
        </section>
      </div>

      {/* Bottom spacer */}
      <div className="h-12" />
    </div>
  )
}
