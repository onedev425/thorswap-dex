import React from 'react'

import { ColorType } from 'types/global'

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'body'
  | 'caption'

export type TypographyWeight =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black'

export type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase'

export const variantClasses: Record<TypographyVariant, string> = {
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  h4: 'text-h4',
  h5: 'text-h5',
  body: 'text-body',
  caption: 'text-caption',
}

export const weightClasses: Record<TypographyWeight, string> = {
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
  green: 'text-green',
  orange: 'text-orange',
  cyan: 'text-cyan',
  gray: 'text-gray',
  red: 'text-red',
}

export const transformClasses: Record<TextTransform, string> = {
  none: 'normal-case',
  capitalize: 'capitalize',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
}

export type Props = {
  className?: string
  component?: keyof React.ReactHTML
  color?: ColorType
  variant?: TypographyVariant
  fontWeight?: TypographyWeight
  children?: React.ReactNode
  transform?: TextTransform
}
