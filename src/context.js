import { createContext, useContext } from 'react'

export const LangContext = createContext({ lang: 'en', toggleLang: () => {} })
export const ProgressContext = createContext({ progress: {}, setProgress: () => {} })

export const useLang = () => useContext(LangContext)
export const useProgress = () => useContext(ProgressContext)
