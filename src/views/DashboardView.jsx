import { useLang, useProgress } from '../context'
import { useT } from '../data/strings'
import {
  DASHBOARD_METRICS,
  AI_INSIGHTS,
  LEADERBOARD,
  MOCK_MODULES,
  WEEKLY_BARS,
  WEEK_DAYS,
} from '../data/mockData'

function MetricCard({ metric, lang }) {
  const label = lang === 'hi' ? metric.labelHi : metric.labelEn
  const textColor = metric.color.replace('bg-', 'text-')
  const value = metric.value > 999 ? metric.value.toLocaleString() : metric.value

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs text-gray-500 font-medium leading-tight">{label}</p>
        <span className={`text-xs font-bold ${textColor}`}>{metric.pct}%</span>
      </div>
      <p className="text-2xl font-extrabold text-gray-800">
        {value}{metric.labelEn.includes('%') ? '%' : ''}
      </p>
      <div className="mt-2.5 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${metric.color} rounded-full bar-fill`}
          style={{ width: `${metric.pct}%` }}
        />
      </div>
    </div>
  )
}

function WeeklyChart({ lang }) {
  const days = WEEK_DAYS[lang] || WEEK_DAYS.en
  return (
    <div className="flex items-end gap-1.5 h-20">
      {WEEKLY_BARS.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-purple-400 bar-fill"
            style={{ height: `${h}%` }}
          />
          <span className="text-xs text-gray-400">{days[i]}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardView() {
  const { lang } = useLang()
  const { progress } = useProgress()
  const t = useT(lang)

  const leaderboard = LEADERBOARD.map(r => ({
    ...r,
    name: lang === 'hi' ? r.nameHi : r.nameEn,
  }))

  return (
    <div className="flex flex-col gap-5 pb-2">

      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-800">{t('dashTitle')}</h2>
        <p className="text-sm text-gray-500">{t('dashSub')}</p>
      </div>

      {/* Live badge */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft" />
        <span className="text-xs font-medium text-emerald-600">
          4,210 {t('usersOnline')}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {DASHBOARD_METRICS.map(m => (
          <MetricCard key={m.key} metric={m} lang={lang} />
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="font-bold text-gray-800 text-sm mb-3">{t('weeklyActivity')}</p>
        <WeeklyChart lang={lang} />
      </div>

      {/* Module Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="font-bold text-gray-800 text-sm mb-3">{t('moduleProgressTitle')}</p>
        <div className="flex flex-col gap-3">
          {MOCK_MODULES.map(mod => {
            const done = progress[mod.id]?.completed
            const title = lang === 'hi' ? mod.titleHi : mod.titleEn
            return (
              <div key={mod.id} className="flex items-center gap-3">
                <div className="text-lg w-7 text-center">{mod.iconEmoji}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-700 font-medium truncate max-w-[140px]">{title}</span>
                    <span className={done ? 'text-emerald-600' : 'text-gray-400'}>
                      {done ? (lang === 'hi' ? 'पूर्ण' : 'Done') : '🔒'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bar-fill ${done ? 'bg-emerald-400' : 'bg-gray-200'}`}
                      style={{ width: done ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">🤖</div>
          <div>
            <p className="font-bold text-gray-800 text-sm">{t('aiTitle')}</p>
            <p className="text-xs text-gray-400">{t('aiSub')}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {AI_INSIGHTS.map((ins, i) => (
            <div
              key={i}
              className="flex gap-3 bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-200 rounded-2xl p-4"
            >
              <span className="text-2xl flex-shrink-0">{ins.icon}</span>
              <p className="text-sm text-brand-800 leading-relaxed">
                {lang === 'hi' ? ins.hi : ins.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="font-bold text-gray-800 text-sm mb-3">🏅 {t('leaderboard')}</p>
        <div className="flex flex-col gap-2">
          {leaderboard.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
            >
              <span className="text-xl">{r.emoji}</span>
              <span className="flex-1 text-sm font-medium text-gray-800">{r.name}</span>
              <span className="text-sm font-bold text-brand-600">{r.pts} pts</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
