import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

import { TextTransform } from 'components/Atomic'
import { TooltipPlacement } from 'components/Atomic/Tooltip/types'

import { ColorType } from 'types/global'

export type ButtonTypes = 'default' | 'outline' | 'borderless'
export type ButtonSizes = 'sm' | 'md' | 'lg'
export type ButtonVariants = 'primary' | 'secondary' | 'tertiary' | 'tint'

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
  tooltip?: string
  tooltipPlacemenet?: TooltipPlacement
  onClick?: () => void
  size?: ButtonSizes
  textColor?: ColorType
  transform?: TextTransform
  type?: ButtonTypes
  stretch?: boolean
  variant?: ButtonVariants
  startIcon?: ReactNode
  endIcon?: ReactNode
}
