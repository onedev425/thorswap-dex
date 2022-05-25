import { SupportedLanguages } from 'types/app'

const FLAGICONS: Record<SupportedLanguages, string> = {
  'ms-MY': 'malaysia',
  'nl-NL': 'netherlands',
  'pt-BR': 'brazil',
  'zh-Hans': 'china',
  'zh-Hant': 'china',
  ar: 'saudi',
  de: 'netherlands',
  en: 'usa',
  es: 'spain',
  fr: 'france',
  hi: 'india',
  it: 'italy',
  km: 'cambodia',
  ko: 'korea',
  pl: 'poland',
  pt: 'portugal',
  ru: 'russia',
  tr: 'turkey',
  ur: 'pakistan',
}
const LANGUAGE_NAMES: Record<SupportedLanguages, string> = {
  'ms-MY': 'Malay',
  'nl-NL': 'Dutch (NLD)',
  'pt-BR': 'Português (BRA)',
  'zh-Hans': '简体中文 (CHN)',
  'zh-Hant': '繁體中文 (CHT)',
  ar: 'العربية (ARA)',
  de: 'Deutsch (DEU)',
  en: 'English (US)',
  es: 'Español (ESP)',
  fr: 'Français (FRA)',
  hi: 'हिन्दी (HIN)',
  it: 'Italiano (ITA)',
  km: 'ភាសាខ្មែរ (KHM)',
  ko: '한국어 (KOR)',
  pl: 'Polski (POL)',
  pt: 'Português (POR)',
  ru: 'Русский (RUS)',
  tr: 'Türkçe (TUR)',
  ur: 'اردو (URD)',
}

export const getLanguageLabel = (lang: SupportedLanguages) => {
  return LANGUAGE_NAMES[lang]
}

export const getLanguageFlag = (lang: SupportedLanguages) => {
  return FLAGICONS[lang]
}
