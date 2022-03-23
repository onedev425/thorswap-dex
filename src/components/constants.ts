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
