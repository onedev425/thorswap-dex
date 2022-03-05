import { SupportedLanguages } from 'types/global'

const FLAGS: Record<SupportedLanguages, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
}

export const getLanguageFlag = (lang: SupportedLanguages) => {
  return FLAGS[lang]
}
