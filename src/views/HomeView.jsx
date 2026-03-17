import { useLang, useProgress } from '../context'
import { MOCK_MODULES } from '../data/mockData'

// SVG donut ring showing overall completion %
function ProgressRing({ pct }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width="72" height="72" className="flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="#c7d2fe" strokeWidth="7" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#4f46e5"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      {/* Rotate text back */}
      <text
        x="36" y="41"
        textAnchor="middle"
        fill="#4338ca"
        fontSize="15"
        fontWeight="bold"
        style={{ transform: 'rotate(90deg)', transformOrigin: '36px 36px' }}
      >
        {pct}%
      </text>
    </svg>
  )
}

export default function HomeView({ navigate }) {
  const { lang } = useLang()
  const { progress } = useProgress()

  const completedCount = Object.values(progress).filter(p => p.completed).length
  const overallPct = Math.round((completedCount / MOCK_MODULES.length) * 100)

  const L = {
    welcome:    { en: 'Welcome back, Priya! 👋', hi: 'वापस स्वागत है, प्रिया! 👋' },
    progress:   { en: 'Overall Progress',         hi: 'कुल प्रगति' },
    resume:     { en: 'Resume Learning',           hi: 'सीखना जारी रखें' },
    lastMod:    { en: 'UPI & Digital Payments',    hi: 'UPI और डिजिटल भुगतान' },
    lastModSub: { en: 'Continue where you left off', hi: 'जहाँ छोड़ा था वहाँ से जारी रखें' },
    courses:    { en: 'All Courses',               hi: 'सभी कोर्स' },
    locked:     { en: 'Locked',                    hi: 'बंद' },
    mins:       { en: 'mins',                      hi: 'मिनट' },
    completed:  { en: '✓ Done',                    hi: '✓ पूर्ण' },
  }
  const t = k => L[k]?.[lang] ?? L[k]?.en

  return (
    <div className="flex flex-col -mt-4">

      {/* ── Welcome Banner ── */}
      <div className="bg-brand-50 px-5 pt-5 pb-8 -mx-4 rounded-b-3xl mb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-extrabold text-brand-800 leading-snug">{t('welcome')}</h2>
            <p className="text-base text-brand-600 mt-1">{t('progress')}</p>
          </div>
          <ProgressRing pct={overallPct} />
        </div>
      </div>

      <div className="flex flex-col gap-5">

        {/* ── Resume Learning Card ── */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{t('resume')}</p>
          <button
            onClick={() => navigate('learn')}
            className="relative w-full rounded-2xl overflow-hidden shadow-md active:scale-[0.98] transition-all"
          >
            {/* Thumbnail */}
            <div className="w-full h-40 bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center">
              <span className="text-7xl">💳</span>
            </div>

            {/* Amber play button overlaid on thumbnail */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8 ml-1" fill="white" viewBox="0 0 24 24">
                  <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
              </div>
            </div>

            {/* Title bar */}
            <div className="bg-white px-4 py-3 text-left">
              <p className="text-brand-800 font-bold text-lg leading-snug">{t('lastMod')}</p>
              <p className="text-slate-500 text-sm mt-0.5">{t('lastModSub')}</p>
            </div>
          </button>
        </div>

        {/* ── Course Carousel ── */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{t('courses')}</p>
          <div className="flex overflow-x-auto gap-3 pb-3 -mx-4 px-4 no-scrollbar">
            {MOCK_MODULES.map(mod => {
              const done = progress[mod.id]?.completed
              const isLocked = mod.locked && !done
              return (
                <button
                  key={mod.id}
                  onClick={!isLocked ? () => navigate('learn') : undefined}
                  className={`flex-shrink-0 w-36 rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-white text-left transition-all ${isLocked ? 'opacity-60' : 'active:scale-[0.97]'}`}
                >
                  {/* Card thumbnail */}
                  <div className={`w-full h-20 bg-gradient-to-br ${mod.gradient} flex items-center justify-center text-3xl`}>
                    {mod.iconEmoji}
                  </div>
                  <div className="p-2.5">
                    <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">
                      {lang === 'hi' ? mod.titleHi : mod.titleEn}
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5">
                      {isLocked ? `🔒 ${t('locked')}` : `12 ${t('mins')}`}
                    </p>
                    {done && (
                      <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                        {t('completed')}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
