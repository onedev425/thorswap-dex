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
  | 'greenLight'

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

export type SupportedLanguages = 'en' | 'es' | 'it'

export enum ViewMode {
  CARD = 'card',
  LIST = 'list',
}
