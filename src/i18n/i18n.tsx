import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Lang = 'en' | 'zh'

/** Every user-facing string in this app is a pair. Numbers, URLs, method names
 *  that are proper nouns, and identifiers stay plain strings. */
export type LText = { en: string; zh: string }

const STORAGE_KEY = 'gfn-panel-lang'

/** Resolve a bilingual string. Exported and used at ~200 call sites, so the
 *  name is the contract that keeps the lookup consistent. */
export function t(text: LText | string, lang: Lang): string {
  return typeof text === 'string' ? text : text[lang]
}

type LangContextValue = { lang: Lang; setLang: (next: Lang) => void }

const LangContext = createContext<LangContextValue>({ lang: 'en', setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  // English is the default: this page is read by an international audience and
  // the memo's conclusion has to land without a language barrier.
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') setLangState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  return useContext(LangContext)
}

/** Chrome strings that belong to the shell rather than to the evidence. */
export const UI = {
  langLabel: { en: 'Language', zh: '语言' },
  eyebrowLeft: { en: 'Decision memo · 2026-08-25', zh: '决策备忘录 · 2026-08-25' },
  eyebrowRight: { en: 'Small-molecule generative design', zh: '小分子生成设计' },
  heroTitleA: { en: 'GFlowNet is worth studying.', zh: 'GFlowNet 值得研究。' },
  heroTitleB: {
    en: "It is not the framework Merck should bet on.",
    zh: '但它不是 Merck 该押的框架。',
  },
  simulation: { en: 'simulation · illustration', zh: '模拟 · illustration' },
  legendTitle: { en: 'Epistemic status', zh: '认知状态' },
  gapsTitle: { en: 'Open gaps', zh: '未闭合的缺口' },
  gapsStamp: { en: 'open gaps · not evidence', zh: '开放缺口 · 勿引用为证据' },
  source: { en: 'Source', zh: '来源' },
} as const satisfies Record<string, LText>
