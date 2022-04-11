import { initReactI18next } from 'react-i18next'

// eslint-disable-next-line no-restricted-imports
import i18n, {
  use as initializeI18n,
  t as translate,
  changeLanguage,
  TOptions,
} from 'i18next'

import { getFromStorage } from 'helpers/storage'

import { SupportedLanguages } from 'types/app'

import en from './locales/en.json'
import es from './locales/es.json'
import it from './locales/it.json'

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, NotWorthIt>
    ? T[K] extends ArrayLike<NotWorthIt>
      ?
          | K
          | `${K}.${PathImpl<
              T[K],
              Exclude<keyof T[K], keyof Array<NotWorthIt>>
            >}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never

type Path<T> = PathImpl<T, keyof T> | keyof T
type DefaultDictionary = typeof en

const parseMissingKeyHandler = (key: string) => key.split('.').pop()

initializeI18n(initReactI18next).init({
  debug: import.meta.env.DEV,
  resources: {
    es: { translation: es },
    en: { translation: en },
    it: { translation: it },
  },
  lng: getFromStorage('language') as SupportedLanguages,
  fallbackLng: 'en',
  parseMissingKeyHandler,
  interpolation: {
    escapeValue: false, // react already safes from xss
    prefix: '%{',
    suffix: '}',
  },
})

export const t = <T extends Path<DefaultDictionary>>(
  key: T,
  params?: TOptions,
  options?: TOptions,
  // @ts-expect-error This is false positive
) => translate(key, params, options) /* i18next-extract-disable-line */

export const currentLocale = () => i18n.languages[0]
export const changeAppLanguage = (language: SupportedLanguages) => {
  changeLanguage(language)
}
