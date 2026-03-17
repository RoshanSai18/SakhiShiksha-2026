import { useLang } from '../context'

export default function Header() {
  const { lang, toggleLang } = useLang()

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3.5 max-w-lg mx-auto">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13
                   C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253
                   m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13
                   C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="text-lg font-extrabold text-brand-700 tracking-tight">SakhiShiksha</span>
        </div>

        {/* Language toggle pill */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1 bg-brand-50 border-2 border-brand-200 rounded-full px-4 py-1.5 text-sm font-bold active:bg-brand-100 transition-all"
        >
          <span className={lang === 'en' ? 'text-brand-700' : 'text-slate-400'}>English</span>
          <span className="text-slate-300 mx-0.5">/</span>
          <span className={lang === 'hi' ? 'text-brand-700' : 'text-slate-400'}>हिंदी</span>
        </button>

      </div>
    </header>
  )
}
