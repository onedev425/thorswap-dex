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
  'ru',
  'zh-Hans',
  'zh-Hant',
] as const;

export type SupportedLanguages = (typeof SUPPORTED_LANGUAGES)[number];

export type THORNameEntry = {
  address: string;
  chain: string;
};

export type THORNameDetails = {
  entries: THORNameEntry[];
  owner: string;
  expire: string;
};
