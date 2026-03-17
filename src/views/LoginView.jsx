import { useState } from 'react'

export default function LoginView({ navigate, lang }) {
  const [phone, setPhone] = useState('')

  const L = {
    title:       { en: 'SakhiShiksha',                           hi: 'साखी शिक्षा' },
    sub:         { en: 'Digital Literacy for Women Entrepreneurs', hi: 'महिला उद्यमियों के लिए डिजिटल साक्षरता' },
    placeholder: { en: 'Enter Mobile Number',                    hi: 'मोबाइल नंबर दर्ज करें' },
    btn:         { en: 'Get OTP',                                hi: 'OTP प्राप्त करें' },
    skip:        { en: 'Skip for now →',                         hi: 'अभी छोड़ें →' },
  }
  const t = k => L[k]?.[lang] ?? L[k]?.en

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-slate-50">

      {/* Hero illustration */}
      <div className="text-8xl mb-3 select-none">🏪</div>
      <div className="w-20 h-1.5 bg-brand-200 rounded-full mb-8" />

      {/* Headline */}
      <h1 className="text-4xl font-extrabold text-brand-700 text-center mb-2">{t('title')}</h1>
      <p className="text-lg text-slate-500 text-center leading-snug mb-10">{t('sub')}</p>

      {/* Phone input */}
      <input
        type="tel"
        inputMode="numeric"
        value={phone}
        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder={t('placeholder')}
        className="w-full text-2xl text-center py-4 border-2 border-slate-300 rounded-xl focus:border-brand-600 focus:outline-none bg-white shadow-sm"
      />

      {/* OTP button */}
      <button
        onClick={() => navigate('home')}
        className="w-full bg-brand-600 text-white font-bold text-xl py-4 rounded-full mt-6 shadow-lg active:scale-[0.98] transition-all"
      >
        {t('btn')}
      </button>

      {/* Skip */}
      <button
        onClick={() => navigate('home')}
        className="mt-5 text-slate-400 text-base font-medium"
      >
        {t('skip')}
      </button>

    </div>
  )
}
