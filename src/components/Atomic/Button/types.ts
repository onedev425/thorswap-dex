import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

import { TextTransform } from 'components/Atomic'

import { ColorType } from 'types/global'

export type ButtonTypes = 'default' | 'outline' | 'borderless'
export type ButtonSizes = 'sm' | 'md'
export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'tint'

export type VariantClasses = Record<ButtonVariants, string>
export type SizeClasses = Record<ButtonSizes, string>

export type ButtonProps = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'type'
> & {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  isLoading?: boolean
  onClick?: () => void
  size?: ButtonSizes
  textColor?: ColorType
  transform?: TextTransform
  type?: ButtonTypes
  variant?: ButtonVariants
  startIcon?: ReactNode
  endIcon?: ReactNode
}
