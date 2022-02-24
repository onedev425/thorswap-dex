import React from 'react'

import { ColorType } from 'types/global'

export const variantClasses = {
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  h4: 'text-h4',
  h5: 'text-h5',
  subtitle1: 'text-subtitle1',
  subtitle2: 'text-subtitle2',
  body: 'text-body',
  caption: 'text-caption',
  'caption-xs': 'text-caption-xs',
}

export const defaultWeightClasses = {
  h1: 'font-medium',
  h2: 'font-semibold',
  h3: 'font-extrabold',
  h4: 'font-extrabold',
  h5: 'font-extrabold',
  subtitle1: 'font-extrabold',
  subtitle2: 'font-semibold',
  body: 'font-medium',
  caption: 'font-bold',
  'caption-xs': 'font-bold',
}

export const weightClasses = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
}

export const colorClasses: Record<ColorType, string> = {
  primary: 'text-light-typo-primary dark:text-dark-typo-primary',
  secondary: 'text-light-typo-gray dark:text-dark-typo-gray',
  purple: 'text-purple',
  yellow: 'text-yellow',
  pink: 'text-pink',
  blue: 'text-blue',
  blueLight: 'text-blue-light',
  greenLight: 'text-green-light',
  green: 'text-green',
  orange: 'text-orange',
  cyan: 'text-cyan',
  gray: 'text-gray',
  red: 'text-red',
}

export const transformClasses = {
  none: 'normal-case',
  capitalize: 'capitalize',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
}

export type TypographyVariant = keyof typeof variantClasses

export type TypographyWeight = keyof typeof weightClasses

export type TextTransform = keyof typeof transformClasses

export type Props = {
  className?: string
  component?: keyof React.ReactHTML
  color?: ColorType
  variant?: TypographyVariant
  fontWeight?: TypographyWeight
  children?: React.ReactNode
  transform?: TextTransform
}
