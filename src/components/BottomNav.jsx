import { useLang } from '../context'

function NavItem({ label, active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
    >
      <svg
        className={`w-8 h-8 transition-colors ${active ? 'stroke-brand-600' : 'stroke-slate-400'}`}
        fill="none"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
      <span className={`text-xs font-semibold transition-colors ${active ? 'text-brand-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </button>
  )
}

export default function BottomNav({ currentView, navigate }) {
  const { lang } = useLang()
  const nav = {
    home:    { en: 'Home',    hi: 'होम' },
    learn:   { en: 'Learn',   hi: 'सीखें' },
    profile: { en: 'Profile', hi: 'प्रोफ़ाइल' },
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-lg mx-auto flex items-stretch">

        {/* Home */}
        <NavItem label={nav.home[lang]} active={currentView === 'home'} onClick={() => navigate('home')}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.75z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
        </NavItem>

        {/* Learn */}
        <NavItem label={nav.learn[lang]} active={currentView === 'learn'} onClick={() => navigate('learn')}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
          />
        </NavItem>

        {/* Profile */}
        <NavItem label={nav.profile[lang]} active={currentView === 'dashboard'} onClick={() => navigate('dashboard')}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </NavItem>

      </div>
    </nav>
  )
}
