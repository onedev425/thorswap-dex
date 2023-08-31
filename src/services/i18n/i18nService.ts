import { getFromStorage } from 'helpers/storage';
import i18n, {
  changeLanguage,
  Resource,
  t as translate,
  TOptions,
  use as initializeI18n,
} from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SupportedLanguages } from 'types/app';

import de from './locales/de_DE.json';
import en from './locales/en_GB.json';
import es from './locales/es_ES.json';
import fr from './locales/fr_FR.json';
import hi from './locales/hi_IN.json';
import it from './locales/it_IT.json';
import jp from './locales/ja_JP.json';
import km from './locales/km_KH.json';
import ko from './locales/ko_KR.json';
import nl from './locales/nl_NL.json';
import pl from './locales/pl_PL.json';
import ptBR from './locales/pt_BR.json';
import pt from './locales/pt_PT.json';
import ru from './locales/ru_RU.json';
import zhHant from './locales/zh_CN.json';
import zhHans from './locales/zh_TW.json';

const parseMissingKeyHandler = (key: string) => key.split('.').pop();

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
  jp: { translation: jp },
  km: { translation: km },
  ko: { translation: ko },
  pl: { translation: pl },
  pt: { translation: pt },
  ru: { translation: ru },
};

initializeI18n(initReactI18next).init({
  debug: false,
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
});

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, NotWorth>
    ? T[K] extends ArrayLike<NotWorth>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof NotWorth[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;
type DefaultDictionary = typeof en;

export const t = <T>(key: Path<DefaultDictionary> | T, params?: TOptions, options?: TOptions) =>
  translate(key as string, params as ToDo, options); /* i18next-extract-disable-line */

export const currentLocale = () => i18n.languages[0];
export const changeAppLanguage = (language: SupportedLanguages) => {
  changeLanguage(language);
};
