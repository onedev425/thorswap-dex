export type ColorType =
  | 'primary'
  | 'secondary'
  | 'purple'
  | 'yellow'
  | 'pink'
  | 'blue'
  | 'blueLight'
  | 'green'
  | 'orange'
  | 'cyan'
  | 'gray'
  | 'red'
  | 'greenLight';

export enum ThemeType {
  Dark = 'dark',
  Light = 'light',
  Auto = 'auto',
}

export enum ThousandSeparator {
  Space = 'space',
  Comma = 'comma',
  None = 'none',
}

export enum ViewMode {
  CARD = 'card',
  LIST = 'list',
}

export const SUPPORTED_LANGUAGES = [
  'en',
  'de',
  'es',
  'fr',
  'it',
  'nl-NL',
  'pl',
  'pt',
  'pt-BR',
  'hi',
  'jp',
  'km',
  'ko',
  'ur',
  'ru',
  'zh-Hans',
  'zh-Hant',
] as const;

export type SupportedLanguages = (typeof SUPPORTED_LANGUAGES)[number];
