import { SupportedLanguages } from 'types/app'

const FLAGS: Record<SupportedLanguages, string> = {
  'ms-MY': '🇲🇾',
  'nl-NL': '🇳🇱',
  'pt-BR': '🇧🇷',
  'zh-Hans': '🇨🇳',
  'zh-Hant': '🇨🇳',
  ar: '🇸🇦',
  de: '🇩🇪',
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  hi: '🇮🇳',
  it: '🇮🇹',
  km: '🇰🇭',
  ko: '🇰🇷',
  pl: '🇵🇱',
  pt: '🇵🇹',
  ru: '🇷🇺',
  tr: '🇹🇷',
  ur: '🇵🇰',
}
const LANGUAGE_NAMES: Record<SupportedLanguages, string> = {
  'ms-MY': 'Malay',
  'nl-NL': 'Nederlands (NLD)',
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
  return FLAGS[lang]
}
