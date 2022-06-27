import { initReactI18next } from 'react-i18next'

// eslint-disable-next-line no-restricted-imports
import i18n, {
  use as initializeI18n,
  t as translate,
  changeLanguage,
  TOptions,
  Resource,
} from 'i18next'

import { getFromStorage } from 'helpers/storage'

import { SupportedLanguages } from 'types/app'

import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import hi from './locales/hi.json'
import it from './locales/it.json'
import km from './locales/km.json'
import ko from './locales/ko.json'
import nl from './locales/nl-NL.json'
import pl from './locales/pl.json'
import ptBR from './locales/pt-BR.json'
import pt from './locales/pt.json'
import ru from './locales/ru.json'
import ur from './locales/ur.json'
import zhHans from './locales/zh-Hans.json'
import zhHant from './locales/zh-Hant.json'

const parseMissingKeyHandler = (key: string) => key.split('.').pop()

const resources: Record<SupportedLanguages, Resource> = {
  'nl-NL': { translation: nl },
  'pt-BR': { translation: ptBR },
  'zh-Hans': { translation: zhHans },
  'zh-Hant': { translation: zhHant },
  de: { translation: de },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  hi: { translation: hi },
  it: { translation: it },
  km: { translation: km },
  ko: { translation: ko },
  pl: { translation: pl },
  pt: { translation: pt },
  ru: { translation: ru },
  ur: { translation: ur },
}

initializeI18n(initReactI18next).init({
  debug: import.meta.env.DEV,
  resources,
  lng: getFromStorage('language') as SupportedLanguages,
  fallbackLng: 'en',
  parseMissingKeyHandler,
  returnEmptyString: false,
  interpolation: {
    escapeValue: false, // react already safes from xss
    prefix: '%{',
    suffix: '}',
  },
})

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, NotWorth>
    ? T[K] extends ArrayLike<NotWorth>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof NotWorth[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never

type Path<T> = PathImpl<T, keyof T> | keyof T
type DefaultDictionary = typeof en

export const t = <T>(
  key: Path<DefaultDictionary> | T,
  params?: TOptions,
  options?: TOptions,
) =>
  // @ts-expect-error False positive
  translate(key, params, options) /* i18next-extract-disable-line */

export const currentLocale = () => i18n.languages[0]
export const changeAppLanguage = (language: SupportedLanguages) => {
  changeLanguage(language)
}
