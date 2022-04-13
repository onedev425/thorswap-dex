import { SupportedLanguages } from 'types/app'

const FLAGS: Record<SupportedLanguages, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  it: '🇮🇹',
}

export const getLanguageFlag = (lang: SupportedLanguages) => {
  return FLAGS[lang]
}
