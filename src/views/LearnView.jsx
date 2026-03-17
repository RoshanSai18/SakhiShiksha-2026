import { useState, useRef, useEffect } from 'react'
import { useLang, useProgress } from '../context'
import { useT } from '../data/strings'
import { MODULE, QUIZ, LEARNING_MODULE, MODULE_QUIZ } from '../data/mockData'
import { askAI } from '../utils/aiChat'

// ─── Shared progress bar ───────────────────────────────────────────
function Bar({ pct, gradient = 'from-violet-500 to-purple-500' }) {
  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${gradient} rounded-full bar-fill`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ─── VIDEO MODULE VIEW (redesigned) ──────────────────────────────
function VideoModuleView({ lang, onContinue, onBack }) {
  const { module } = LEARNING_MODULE

  const [activeTab, setActiveTab] = useState('notes')
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const tabLabel = {
    notes: { en: 'Lecture Notes', hi: 'लेक्चर नोट्स' },
    qa:    { en: 'Ask AI',         hi: 'AI से पूछें' },
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => { setMessages([]) }, [lang])

  const handleAsk = async () => {
    const question = inputText.trim()
    if (!question || isLoading) return
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: question }])
    setInputText('')
    setIsLoading(true)
    try {
      const answer = await askAI(question, module.notes[lang], lang)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: answer }])
    } catch {
      const errText = lang === 'hi'
        ? 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।'
        : 'Sorry, something went wrong. Please try again.'
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: errText }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(module.notes[lang])
      utter.lang = lang === 'hi' ? 'hi-IN' : 'en-US'
      window.speechSynthesis.speak(utter)
    }
  }

  return (
    <div className="flex flex-col -mt-4">

      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 text-brand-600 text-sm font-medium py-3">
        ← {lang === 'hi' ? 'वापस जाएं' : 'Back'}
      </button>

      {/* Full-width video */}
      <div className="-mx-4 bg-black aspect-video">
        <video
          key={module.video_url}
          controls
          className="w-full h-full object-contain"
          src={module.video_url}
        />
      </div>

      {/* Module title */}
      <h1 className="text-xl font-extrabold text-slate-800 pt-4 pb-1 leading-snug">
        {module.title[lang]}
      </h1>

      {/* Pill tab bar */}
      <div className="flex gap-2 py-2">
        {['notes', 'qa'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-full text-base font-bold transition-all ${
              activeTab === tab
                ? 'bg-brand-100 text-brand-700 shadow-sm'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {tabLabel[tab][lang]}
          </button>
        ))}
      </div>

      {/* ── Notes Tab ── */}
      {activeTab === 'notes' && (
        <div className="relative">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-slate-700 text-base leading-relaxed">{module.notes[lang]}</p>
          </div>
          {/* Floating Read Aloud button */}
          <button
            onClick={handleReadAloud}
            className="fixed bottom-24 right-5 z-40 w-14 h-14 bg-brand-600 rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-all"
            title={lang === 'hi' ? 'जोर से पढ़ें' : 'Read Aloud'}
          >
            <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Ask AI Tab (WhatsApp style) ── */}
      {activeTab === 'qa' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 min-h-[200px]">
            {messages.length === 0 && !isLoading && (
              <div className="bg-brand-50 rounded-2xl p-5 text-center border border-brand-100">
                <p className="text-3xl mb-2">🤖</p>
                <p className="text-brand-700 font-semibold text-base">
                  {lang === 'hi' ? 'AI से कुछ भी पूछें!' : 'Ask AI anything!'}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  {lang === 'hi' ? 'इस पाठ के बारे में कोई भी प्रश्न पूछें' : 'Ask any question about this lesson'}
                </p>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-200 text-slate-800 rounded-bl-3xl rounded-t-3xl'
                    : 'bg-brand-50 border border-brand-100 text-slate-800 rounded-br-3xl rounded-t-3xl'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-brand-50 border border-brand-100 rounded-br-3xl rounded-t-3xl px-4 py-3">
                  <p className="text-slate-500 italic text-sm">{lang === 'hi' ? 'AI सोच रहा है...' : 'AI is thinking...'}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-sm border border-slate-200 sticky bottom-0">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              disabled={isLoading}
              placeholder={lang === 'hi' ? 'यहाँ प्रश्न लिखें...' : 'Type your question here...'}
              className="flex-1 text-base px-3 py-2 outline-none bg-transparent text-slate-700 placeholder-slate-400 disabled:opacity-50"
            />
            <button
              onClick={handleAsk}
              disabled={!inputText.trim() || isLoading}
              className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all flex-shrink-0"
            >
              <svg className="w-5 h-5 ml-0.5" fill="white" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Continue to Quiz CTA */}
      <div className="pt-4 pb-2">
        <button
          onClick={onContinue}
          className="w-full bg-brand-600 text-white font-bold rounded-full py-4 text-lg shadow-lg active:scale-[0.98] transition-all"
        >
          {lang === 'hi' ? 'क्विज़ पर जाएं →' : 'Go to Quiz →'}
        </button>
      </div>
    </div>
  )
}

// ─── MODULE QUIZ VIEW (one question at a time) ────────────────────
function ModuleQuizView({ lang, onFinish }) {
  const questions = MODULE_QUIZ.quiz
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [scores, setScores] = useState([])
  const [showResult, setShowResult] = useState(false)

  const q = questions[currentQ]
  const isLast = currentQ === questions.length - 1
  const isCorrect = answered && selected === q.correct_answer_index

  const handleCheckAnswer = () => {
    if (selected === null) return
    if (!answered) {
      setScores(prev => [...prev, selected === q.correct_answer_index])
      setAnswered(true)
    } else {
      if (isLast) {
        setShowResult(true)
      } else {
        setCurrentQ(c => c + 1)
        setSelected(null)
        setAnswered(false)
      }
    }
  }

  const handleRetry = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(false)
    setScores([])
    setShowResult(false)
  }

  // ── Success / Result screen ──
  if (showResult) {
    const totalCorrect = scores.filter(Boolean).length + (selected === q.correct_answer_index ? 1 : 0)
    const perfect = totalCorrect === questions.length
    if (perfect) localStorage.setItem('mod_01_completed', 'true')

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-2">
        {perfect ? (
          <>
            <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-extrabold text-slate-800">
              {lang === 'hi' ? 'बधाई हो! 🎉' : 'Congratulations! 🎉'}
            </h2>
            <p className="text-slate-500 text-lg">
              {lang === 'hi' ? 'आपने यह पाठ पूरा कर लिया!' : 'You completed this lesson!'}
            </p>
            <button
              onClick={onFinish}
              className="w-full bg-brand-600 text-white font-bold rounded-full py-4 text-lg shadow-lg active:scale-[0.98] transition-all"
            >
              {lang === 'hi' ? 'अगला पाठ →' : 'Go to Next Lesson →'}
            </button>
          </>
        ) : (
          <>
            <span className="text-7xl">📖</span>
            <h2 className="text-2xl font-extrabold text-slate-800">
              {lang === 'hi' ? 'अच्छी कोशिश!' : 'Good effort!'}
            </h2>
            <p className="text-slate-500 text-base">
              {lang === 'hi'
                ? `${totalCorrect}/${questions.length} सही उत्तर — नोट्स दोबारा पढ़ें फिर प्रयास करें।`
                : `${totalCorrect}/${questions.length} correct — Review the notes and try again.`}
            </p>
            <button
              onClick={handleRetry}
              className="w-full bg-amber-500 text-white font-bold rounded-full py-4 text-lg shadow-lg active:scale-[0.98] transition-all"
            >
              {lang === 'hi' ? '🔄 पुनः प्रयास करें' : '🔄 Try Again'}
            </button>
          </>
        )}
      </div>
    )
  }

  // ── Question screen ──
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">

      {/* Progress dots */}
      <div className="flex justify-between items-center py-3">
        <p className="text-sm font-semibold text-slate-500">
          {lang === 'hi' ? `प्रश्न ${currentQ + 1}/${questions.length}` : `Question ${currentQ + 1}/${questions.length}`}
        </p>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i < currentQ ? 'bg-emerald-500' : i === currentQ ? 'bg-brand-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* Question text */}
      <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-snug">
        {q.question[lang]}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-3 flex-1">
        {q.options[lang].map((opt, idx) => {
          let cls = 'p-5 border-2 rounded-xl text-lg bg-white text-left w-full transition-all active:scale-[0.99] font-medium text-slate-800 flex items-center gap-3'
          if (answered) {
            if (idx === q.correct_answer_index) cls += ' border-emerald-500 bg-emerald-50'
            else if (idx === selected) cls += ' border-red-400 bg-red-50'
            else cls += ' border-slate-200 opacity-50'
          } else {
            cls += idx === selected ? ' border-brand-600 bg-brand-50' : ' border-slate-200'
          }
          return (
            <button key={idx} onClick={() => !answered && setSelected(idx)} className={cls}>
              <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{opt}</span>
              {answered && idx === q.correct_answer_index && <span className="text-emerald-600 font-bold text-xl">✓</span>}
              {answered && idx === selected && idx !== q.correct_answer_index && <span className="text-red-500 font-bold text-xl">✗</span>}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`my-4 rounded-xl p-4 ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`font-bold text-base ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
            {isCorrect
              ? (lang === 'hi' ? '✅ सही जवाब!' : '✅ Correct!')
              : (lang === 'hi' ? '❌ गलत जवाब' : '❌ Wrong answer')}
          </p>
          {!isCorrect && (
            <p className="text-sm mt-1 text-red-600">
              {lang === 'hi' ? 'सही उत्तर: ' : 'Correct: '}{q.options[lang][q.correct_answer_index]}
            </p>
          )}
        </div>
      )}

      {/* Sticky action button */}
      <div className="sticky bottom-0 pt-2 pb-2 bg-slate-50">
        <button
          onClick={handleCheckAnswer}
          disabled={selected === null}
          className="w-full bg-amber-500 text-white font-bold rounded-full py-4 text-lg shadow-lg active:scale-[0.98] transition-all disabled:opacity-40"
        >
          {!answered
            ? (lang === 'hi' ? 'उत्तर जांचें' : 'Check Answer')
            : isLast
              ? (lang === 'hi' ? 'परिणाम देखें →' : 'See Result →')
              : (lang === 'hi' ? 'अगला प्रश्न →' : 'Next Question →')}
        </button>
      </div>
    </div>
  )
}

// ─── MODULE INTRO ─────────────────────────────────────────────────
function ModuleIntro({ lang, t, progress, onStart, onBack }) {
  const p = progress['digital-payments']
  const isCompleted = p?.completed
  const totalSlides = MODULE.slides.length + QUIZ.length

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-1 text-brand-600 text-sm font-medium">
        {t('backBtn')}
      </button>

      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">💳</div>
          <div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {lang === 'hi' ? '12 मिनट • शुरुआती' : '12 min • Beginner'}
            </span>
            <p className="font-bold text-lg mt-1">
              {lang === 'hi' ? MODULE.titleHi : MODULE.titleEn}
            </p>
          </div>
        </div>
        <p className="text-white/80 text-sm mt-3">
          {lang === 'hi' ? MODULE.descHi : MODULE.descEn}
        </p>
      </div>

      {/* Completed badge */}
      {isCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="text-3xl">🏆</div>
          <div>
            <p className="font-bold text-emerald-700">{t('completedBadge')}</p>
            <p className="text-sm text-emerald-600">
              {t('score')}: {p.score} {t('of')} {p.total}
            </p>
          </div>
        </div>
      )}

      {/* Syllabus */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="font-semibold text-gray-700 mb-3 text-sm">{t('whatYouLearn')}</p>
        <div className="flex flex-col gap-3">
          {MODULE.slides.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-base flex-shrink-0">
                {s.emoji}
              </div>
              <p className="font-semibold text-gray-700 text-sm pt-1">
                {lang === 'hi' ? s.titleHi : s.titleEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-2">{t('moduleProgress')}</p>
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>{t('slidesQuiz')}</span>
          <span>{isCompleted ? '100%' : '0%'}</span>
        </div>
        <Bar pct={isCompleted ? 100 : 0} />
      </div>

      <button
        onClick={onStart}
        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-2xl py-4 text-base shadow-lg active:scale-[0.98] transition-all"
      >
        {isCompleted ? `${t('reviewAgain')} 💡` : `${t('startBtn')} 💡`}
      </button>
    </div>
  )
}

// ─── SLIDE VIEW ───────────────────────────────────────────────────
function SlideView({ lang, t, slideIndex, totalSlides, onNext, onPrev }) {
  const slide = MODULE.slides[slideIndex]
  const totalSteps = MODULE.slides.length + QUIZ.length
  const pct = Math.round(((slideIndex + 1) / totalSteps) * 100)
  const isLastSlide = slideIndex === MODULE.slides.length - 1

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{t('slide')} {slideIndex + 1}/{MODULE.slides.length}</span>
          <span>{pct}%</span>
        </div>
        <Bar pct={pct} />
      </div>

      {/* Visual */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-8 text-white text-center shadow-lg min-h-44 flex flex-col items-center justify-center">
        <div className="text-7xl mb-4">{slide.emoji}</div>
        <h2 className="text-xl font-bold">{lang === 'hi' ? slide.titleHi : slide.titleEn}</h2>
      </div>

      {/* Body */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 text-base mb-2">
          {lang === 'hi' ? slide.titleHi : slide.titleEn}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {lang === 'hi' ? slide.bodyHi : slide.bodyEn}
        </p>
      </div>

      {/* Tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <span className="text-2xl">💡</span>
        <p className="text-sm text-amber-800">{lang === 'hi' ? slide.tipHi : slide.tipEn}</p>
      </div>

      {/* Nav */}
      <div className="flex gap-3 pb-2">
        <button
          onClick={onPrev}
          disabled={slideIndex === 0}
          className="flex-1 bg-gray-100 text-gray-700 font-semibold rounded-2xl py-3.5 text-sm active:scale-[0.97] transition-all disabled:opacity-40"
        >
          ← {t('previous')}
        </button>
        <button
          onClick={onNext}
          className="flex-[2] bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-2xl py-3.5 text-sm shadow active:scale-[0.97] transition-all"
        >
          {isLastSlide ? t('startQuiz') : t('next')}
        </button>
      </div>
    </div>
  )
}

// ─── QUIZ VIEW ────────────────────────────────────────────────────
function QuizView({ lang, t, quizIndex, selectedOption, answered, onSelect, onAction }) {
  const q = QUIZ[quizIndex]
  const totalSteps = MODULE.slides.length + QUIZ.length
  const pct = Math.round(((MODULE.slides.length + quizIndex) / totalSteps) * 100)
  const isLastQuestion = quizIndex === QUIZ.length - 1

  const optClasses = (i) => {
    if (!answered) return 'border-2 border-gray-200 bg-white'
    if (i === q.correct) return 'border-2 border-emerald-500 bg-emerald-50'
    if (i === selectedOption) return 'border-2 border-red-400 bg-red-50'
    return 'border-2 border-gray-200 bg-white opacity-50'
  }

  const optIcon = (i) => {
    if (!answered) return null
    if (i === q.correct) return <span className="ml-2 text-emerald-600 font-bold">✓</span>
    if (i === selectedOption) return <span className="ml-2 text-red-500 font-bold">✗</span>
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{t('question')} {quizIndex + 1}/{QUIZ.length}</span>
          <span>{pct}%</span>
        </div>
        <Bar pct={pct} gradient="from-amber-400 to-orange-400" />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl p-5 text-white shadow-lg text-center">
        <p className="text-4xl mb-2">📝</p>
        <p className="font-bold text-base">{t('quizTime')}</p>
        <p className="text-white/80 text-xs mt-1">{t('testKnowledge')}</p>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-bold text-gray-800 text-base leading-snug">
          {lang === 'hi' ? q.qHi : q.qEn}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !answered && onSelect(i)}
            className={`${optClasses(i)} w-full rounded-2xl p-4 text-left font-medium text-gray-800 text-sm transition-all active:scale-[0.98]`}
          >
            <span className="inline-flex items-center justify-center w-7 h-7 mr-2 rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
              {String.fromCharCode(65 + i)}
            </span>
            {lang === 'hi' ? opt.hi : opt.en}
            {optIcon(i)}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`rounded-2xl p-4 ${selectedOption === q.correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`font-bold text-sm ${selectedOption === q.correct ? 'text-emerald-700' : 'text-red-700'}`}>
            {selectedOption === q.correct ? `✅ ${t('correct')}` : `❌ ${t('incorrect')}`}
          </p>
          <p className={`text-sm mt-1 ${selectedOption === q.correct ? 'text-emerald-600' : 'text-red-600'}`}>
            {t('correctAnswer')}: {lang === 'hi' ? q.options[q.correct].hi : q.options[q.correct].en}
          </p>
        </div>
      )}

      {/* Action */}
      <button
        onClick={onAction}
        disabled={selectedOption === null && !answered}
        className="w-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-2xl py-4 text-base shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 pb-2"
      >
        {answered
          ? (isLastQuestion ? t('seeResults') : t('nextBtn'))
          : t('submitBtn')}
      </button>
    </div>
  )
}

// ─── RESULT VIEW ──────────────────────────────────────────────────
function ResultView({ lang, t, score, total, passed, onRetry, onHome, onDashboard }) {
  const pct = Math.round((score / total) * 100)

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="text-8xl">{passed ? '🏆' : '📖'}</div>
      <h2 className={`text-2xl font-extrabold text-center ${passed ? 'text-emerald-600' : 'text-orange-500'}`}>
        {passed ? t('quizPassMsg') : t('quizFailMsg')}
      </h2>
      <p className="text-gray-500 text-sm">
        {t('score')}: {score} {t('of')} {total}
      </p>

      {/* Score ring */}
      <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 ${passed ? 'bg-emerald-100 border-emerald-400' : 'bg-orange-100 border-orange-400'}`}>
        <p className={`text-4xl font-extrabold ${passed ? 'text-emerald-600' : 'text-orange-500'}`}>{pct}%</p>
        <p className="text-xs font-medium text-gray-500">{t('score')}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-2">{t('moduleProgress')}</p>
        <div className={`h-3 rounded-full overflow-hidden bg-gray-100`}>
          <div
            className={`h-full rounded-full bar-fill ${passed ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-orange-400 to-amber-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1.5 text-right">{pct}% {t('complete')}</p>
      </div>

      {/* Badges on pass */}
      {passed && (
        <div className="w-full grid grid-cols-3 gap-2">
          {[
            { emoji: '🎓', enLabel: 'Learner',     hiLabel: 'पाठ पूरा',       bg: 'bg-amber-50 border-amber-200',   text: 'text-amber-700' },
            { emoji: '💳', enLabel: 'Pay Expert',  hiLabel: 'भुगतान विशेषज्ञ', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
            { emoji: '⭐', enLabel: '5 Star',       hiLabel: '5 स्टार',         bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
          ].map(b => (
            <div key={b.enLabel} className={`${b.bg} border rounded-2xl p-3 text-center`}>
              <p className="text-2xl">{b.emoji}</p>
              <p className={`text-xs font-medium ${b.text} mt-1`}>{lang === 'hi' ? b.hiLabel : b.enLabel}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="w-full flex flex-col gap-3 pb-2">
        {!passed && (
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white font-bold rounded-2xl py-4 text-sm shadow-lg active:scale-[0.98] transition-all"
          >
            {t('retryBtn')} 🔄
          </button>
        )}
        <button
          onClick={onHome}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-2xl py-4 text-sm shadow-lg active:scale-[0.98] transition-all"
        >
          {t('goHome')}
        </button>
        <button
          onClick={onDashboard}
          className="w-full border-2 border-brand-300 text-brand-700 font-bold rounded-2xl py-3.5 text-sm active:scale-[0.98] transition-all"
        >
          {t('viewDash')}
        </button>
      </div>
    </div>
  )
}

// ─── LEARN VIEW (orchestrator) ────────────────────────────────────
export default function LearnView({ navigate }) {
  const { lang } = useLang()
  const { progress, setProgress } = useProgress()
  const t = useT(lang)

  const [step, setStep] = useState('intro') // intro | slide | quiz | result
  const [slideIndex, setSlideIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [finalScore, setFinalScore] = useState({ score: 0, total: QUIZ.length, passed: false })

  const startModule = () => {
    setStep('video')
    setSlideIndex(0)
    setQuizIndex(0)
    setQuizScore(0)
    setAnswered(false)
    setSelectedOption(null)
  }

  // Slide navigation
  const handleNextSlide = () => {
    if (slideIndex < MODULE.slides.length - 1) {
      setSlideIndex(i => i + 1)
    } else {
      setStep('quiz')
    }
  }
  const handlePrevSlide = () => {
    if (slideIndex > 0) setSlideIndex(i => i - 1)
  }

  // Quiz
  const handleSelectOption = (i) => {
    setSelectedOption(i)
  }

  const handleQuizAction = () => {
    if (!answered) {
      // Submit
      const correct = QUIZ[quizIndex].correct
      const newScore = quizScore + (selectedOption === correct ? 1 : 0)
      setQuizScore(newScore)
      setAnswered(true)
    } else {
      // Advance
      if (quizIndex < QUIZ.length - 1) {
        setQuizIndex(i => i + 1)
        setAnswered(false)
        setSelectedOption(null)
      } else {
        // Finished — save to localStorage
        const score = quizScore + (selectedOption === QUIZ[quizIndex].correct ? 1 : 0)
        const total = QUIZ.length
        const passed = score >= Math.ceil(total / 2)
        const updated = {
          ...progress,
          'digital-payments': { completed: passed, score, total, timestamp: Date.now() },
        }
        setProgress(updated)
        setFinalScore({ score, total, passed })
        setStep('result')
      }
    }
  }

  if (step === 'intro') {
    return (
      <ModuleIntro
        lang={lang}
        t={t}
        progress={progress}
        onStart={startModule}
        onBack={() => navigate('home')}
      />
    )
  }

  if (step === 'video') {
    return (
      <VideoModuleView
        lang={lang}
        onContinue={() => setStep('module-quiz')}
        onBack={() => setStep('intro')}
      />
    )
  }

  if (step === 'module-quiz') {
    return (
      <ModuleQuizView
        lang={lang}
        onFinish={() => navigate('home')}
      />
    )
  }

  if (step === 'slide') {
    return (
      <SlideView
        lang={lang}
        t={t}
        slideIndex={slideIndex}
        onNext={handleNextSlide}
        onPrev={handlePrevSlide}
      />
    )
  }

  if (step === 'quiz') {
    return (
      <QuizView
        lang={lang}
        t={t}
        quizIndex={quizIndex}
        selectedOption={selectedOption}
        answered={answered}
        onSelect={handleSelectOption}
        onAction={handleQuizAction}
      />
    )
  }

  return (
    <ResultView
      lang={lang}
      t={t}
      score={finalScore.score}
      total={finalScore.total}
      passed={finalScore.passed}
      onRetry={startModule}
      onHome={() => navigate('home')}
      onDashboard={() => navigate('dashboard')}
    />
  )
}
