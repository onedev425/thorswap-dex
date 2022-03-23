import { ColorType } from 'types/global'

export const genericBgClasses: Record<ColorType, string> = {
  primary: 'bg-light-bg-primary dark:bg-dark-bg-primary',
  secondary: 'bg-light-bg-secondary dark:bg-dark-bg-secondary',
  purple: 'bg-purple',
  yellow: 'bg-yellow',
  pink: 'bg-pink',
  blue: 'bg-blue',
  blueLight: 'bg-blue-light',
  greenLight: 'bg-green-light',
  green: 'bg-green',
  orange: 'bg-orange',
  cyan: 'bg-cyan',
  gray: 'bg-gray',
  red: 'bg-red',
}

export const styledScrollbarClass =
  'scrollbar scrollbar-thin scrollbar-thumb-rounded scrollbar-track-light-bg-primary dark:scrollbar-track-dark-bg-primary scrollbar-thumb-light-gray-light dark:scrollbar-thumb-dark-gray-light'

export const baseHoverClass =
  'p-1.5 cursor-pointer rounded-2xl hover:bg-btn-light-tint-active dark:hover:bg-btn-dark-tint-active transition duration-300'

export const baseBorderClass =
  'border border-solid border-light-border-primary dark:border-dark-border-primary'

export const borderHighlightClass =
  'border-light-gray-primary dark:border-dark-gray-primary'

export const borderHoverHighlightClass =
  'border border-transparent border-solid hover:border-light-gray-primary dark:hover:border-dark-gray-primary transition'
