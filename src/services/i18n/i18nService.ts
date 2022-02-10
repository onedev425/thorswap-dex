import { initReactI18next } from 'react-i18next'

// eslint-disable-next-line no-restricted-imports
import i18n, {
  use as initializeI18n,
  t as translate,
  StringMap,
  TOptions,
} from 'i18next'

import en from './locales/en.json'

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
  debug: process.env.NODE_ENV === 'development',
  resources: {
    en: { translation: en },
  },
  lng: 'en',
  fallbackLng: 'en',
  parseMissingKeyHandler,
  interpolation: {
    escapeValue: false, // react already safes from xss
    prefix: '%{',
    suffix: '}',
  },
})

export const t = (
  key: Path<DefaultDictionary>,
  params?: string,
  options?: TOptions<StringMap> | string,
) => {
  return translate(key, params, options)
}

export const currentLocale = () => i18n.languages[0]
