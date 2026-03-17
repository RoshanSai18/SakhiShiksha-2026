import { useState, useCallback } from 'react'
import { LangContext, ProgressContext } from './context'
import useLocalStorage from './hooks/useLocalStorage'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import LoginView from './views/LoginView'
import HomeView from './views/HomeView'
import LearnView from './views/LearnView'
import DashboardView from './views/DashboardView'

export default function App() {
  const [lang, setLang] = useLocalStorage('ss_lang', 'en')
  const [progress, setProgress] = useLocalStorage('ss_progress', {})
  const [currentView, setCurrentView] = useState('login')
  const [learnKey, setLearnKey] = useState(0)

  const navigate = useCallback((view) => {
    setCurrentView(view)
    if (view === 'learn') setLearnKey(k => k + 1)
  }, [])

  const toggleLang = useCallback(() => {
    setLang(l => (l === 'en' ? 'hi' : 'en'))
  }, [setLang])

  const isLogin = currentView === 'login'

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      <ProgressContext.Provider value={{ progress, setProgress }}>
        <div className="flex flex-col bg-slate-50" style={{ minHeight: '100dvh' }}>

          {!isLogin && <Header />}

          <main
            className={`flex-1 overflow-y-auto max-w-lg mx-auto w-full ${
              isLogin ? '' : 'pt-16 pb-20 px-4 py-4'
            }`}
          >
            {currentView === 'login' && (
              <div key="login" className="animate-fade-in">
                <LoginView navigate={navigate} lang={lang} />
              </div>
            )}
            {currentView === 'home' && (
              <div key="home" className="animate-fade-in pt-16 pb-20 px-4 py-4">
                <HomeView navigate={navigate} />
              </div>
            )}
            {currentView === 'learn' && (
              <div key={`learn-${learnKey}`} className="animate-fade-in pt-16 pb-20 px-4 py-4">
                <LearnView navigate={navigate} />
              </div>
            )}
            {currentView === 'dashboard' && (
              <div key="dashboard" className="animate-fade-in pt-16 pb-20 px-4 py-4">
                <DashboardView navigate={navigate} />
              </div>
            )}
          </main>

          {!isLogin && <BottomNav currentView={currentView} navigate={navigate} />}

        </div>
      </ProgressContext.Provider>
    </LangContext.Provider>
  )
}
