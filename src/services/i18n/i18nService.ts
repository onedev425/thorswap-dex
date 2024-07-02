import { getFromStorage } from "helpers/storage";
import type { TOptions } from "i18next";
import i18n, { changeLanguage, t as translate, use as initializeI18n } from "i18next";
import { initReactI18next } from "react-i18next";
import type { SupportedLanguages } from "types/app";

import type en from "./locales/en_GB.json";

const parseMissingKeyHandler = (key: string) => key.split(".").pop();
const loadResources = (language: SupportedLanguages) => {
  switch (language) {
    case "nl-NL":
      return import("./locales/nl_NL.json");
    case "pt-BR":
      return import("./locales/pt_BR.json");
    case "zh-Hans":
      return import("./locales/zh_CN.json");
    case "zh-Hant":
      return import("./locales/zh_TW.json");
    case "de":
      return import("./locales/de_DE.json");
    case "en":
      return import("./locales/en_GB.json");
    case "es":
      return import("./locales/es_ES.json");
    case "fr":
      return import("./locales/fr_FR.json");
    case "hi":
      return import("./locales/hi_IN.json");
    case "it":
      return import("./locales/it_IT.json");
    case "jp":
      return import("./locales/ja_JP.json");
    case "km":
      return import("./locales/km_KH.json");
    case "ko":
      return import("./locales/ko_KR.json");
    case "pl":
      return import("./locales/pl_PL.json");
    case "pt":
      return import("./locales/pt_PT.json");
    case "ru":
      return import("./locales/ru_RU.json");
    default:
      return import("./locales/en_GB.json");
  }
};

const loadI18n = async () => {
  const lng = getFromStorage("language") as SupportedLanguages;
  const resource = await loadResources(lng);

  initializeI18n(initReactI18next).init({
    debug: false,
    resources: { [lng]: { translation: resource } },
    lng,
    fallbackLng: "en",
    parseMissingKeyHandler,
    returnEmptyString: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
      prefix: "%{",
      suffix: "}",
    },
  });
};

loadI18n();

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
  translate(key as string, params as Todo, options); /* i18next-extract-disable-line */

export const currentLocale = () => i18n.languages[0];
export const changeAppLanguage = async (language: SupportedLanguages) => {
  const resource = await loadResources(language);
  i18n.addResourceBundle(language, "translation", resource, true, true);
  changeLanguage(language);
};
