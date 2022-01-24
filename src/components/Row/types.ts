import { BoxProps } from 'rebass'

import { ColorType } from 'types/global'

export type AlignType = 'start' | 'center' | 'end' | 'stretch' | 'baseline'

export type JustifyType =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly'

export type Props = {
  className?: string
  align?: AlignType
  justify?: JustifyType
  background?: ColorType
  borderColor?: ColorType
} & Omit<BoxProps, 'css' | 'bg'>

export const alignClasses: Record<AlignType, string> = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
}

export const justifyClasses: Record<JustifyType, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

export const borderClasses: Record<ColorType, string> = {
  primary: 'border-light-btn-primary dark:border-dark-btn-primary',
  secondary: 'border-light-btn-secondary dark:border-dark-btn-secondary',
  purple: 'border-purple',
  yellow: 'border-yellow',
  pink: 'border-pink',
  blue: 'border-blue',
  blueLight: 'blue-light',
  green: 'border-green',
  orange: 'border-orange',
  cyan: 'border-cyan',
  gray: 'border-gray',
  red: 'border-red',
}

export const bgClasses: Record<ColorType, string[]> = {
  primary: [
    'bg-transparent hover:bg-light-btn-primary dark:hover:bg-dark-btn-primary',
    'bg-light-btn-primary dark:bg-dark-btn-primary hover:opacity-90',
  ],
  secondary: [
    'bg-transparent hover:bg-light-btn-secondary dark:hover:bg-dark-btn-secondary',
    'bg-light-btn-secondary dark:bg-dark-btn-secondary hover:opacity-90',
  ],
  purple: ['bg-transparent hover:bg-purple', 'bg-purple hover:opacity-90'],
  yellow: ['bg-transparent hover:bg-yellow', 'bg-yellow hover:opacity-90'],
  pink: ['bg-transparent hover:bg-pink', 'bg-pink hover:opacity-90'],
  blue: ['bg-transparent hover:bg-blue', 'bg-blue hover:opacity-90'],
  blueLight: [
    'bg-transparent hover:bg-blue-light',
    'bg-blue-light hover:opacity-90',
  ],
  green: ['bg-transparent hover:bg-green', 'bg-green hover:opacity-90'],
  orange: ['bg-transparent hover:bg-orange', 'bg-orange hover:opacity-90'],
  cyan: ['bg-transparent hover:bg-cyan', 'bg-cyan hover:opacity-90'],
  gray: ['bg-transparent', 'bg-gray hover:opacity-90'],
  red: ['bg-transparent hover:bg-red', 'bg-red hover:opacity-90'],
}
