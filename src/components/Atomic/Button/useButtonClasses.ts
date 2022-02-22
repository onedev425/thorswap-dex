import { useMemo } from 'react'

import { TypographyVariant } from 'components/Atomic'

import { ButtonSizes, ButtonVariants } from './types'

const buttonClasses: Record<ButtonSizes, string> = {
  md: 'h-12 px-7 rounded-3xl',
  sm: 'h-10 px-4 rounded-2xl',
}

const typographyVariants: Record<ButtonSizes, TypographyVariant> = {
  md: 'caption',
  sm: 'caption-xs',
}

const backgroundClasses: Record<ButtonVariants, string> = {
  primary:
    'border-none bg-btn-primary hover:bg-gradient-to-r hover:from-btn-primary hover:to-btn-primary-active',
  secondary:
    'border-none bg-btn-secondary hover:bg-gradient-to-r hover:from-btn-secondary hover:to-btn-secondary-active',
  tertiary:
    'border-none bg-btn-tertiary hover:bg-gradient-to-r hover:from-btn-tertiary hover:to-btn-tertiary-active',
  accent:
    'border-none bg-btn-accent hover:bg-gradient-to-r hover:from-btn-accent hover:to-btn-accent-active',
  tint: 'border-none bg-btn-tint hover:bg-btn-tint-active',
}

const backgroundActiveClasses: Record<ButtonVariants, string> = {
  primary: 'focus:bg-btn-primary-active active:bg-btn-primary-active',
  secondary: 'focus:bg-btn-secondary-active active:bg-btn-secondary-active',
  tertiary: 'focus:bg-btn-tertiary-active active:bg-btn-tertiary-active',
  accent: 'focus:bg-btn-accent-active active:bg-btn-accent-active',
  tint: 'focus:bg-btn-tint-active active:bg-btn-tint-active',
}

const outlinedClasses: Record<ButtonVariants, string> = {
  primary:
    'border-solid hover:border-transparent border-btn-primary group-focus:border-btn-primary group-active:border-btn-primary hover:bg-gradient-to-r hover:from-btn-primary hover:to-btn-primary-active',
  secondary:
    'border-solid hover:border-transparent border-btn-secondary group-focus:border-btn-secondary group-active:border-btn-secondary hover:bg-gradient-to-r hover:from-btn-secondary hover:to-btn-secondary-active',
  tertiary:
    'border-solid hover:border-transparent border-btn-tertiary group-focus:border-btn-tertiary group-active:border-btn-tertiary hover:bg-gradient-to-r hover:from-btn-tertiary hover:to-btn-tertiary-active',
  accent:
    'border-solid hover:border-transparent border-btn-accent group-focus:border-btn-accent group-active:border-btn-accent hover:bg-gradient-to-r hover:from-btn-accent hover:to-btn-accent-active',
  tint: 'border-solid hover:border-transparent border-btn-tint group-focus:border-btn-tint group-active:border-btn-tint hover:bg-btn-tint-active',
}

export const useButtonClasses = ({
  size,
  variant,
}: {
  size: ButtonSizes
  variant: ButtonVariants
}) => {
  const computedClasses = useMemo(
    () => ({
      backgroundActiveClass: backgroundActiveClasses[variant],
      backgroundClass: backgroundClasses[variant],
      buttonClass: buttonClasses[size],
      outlinedClass: outlinedClasses[variant],
      typographyVariant: typographyVariants[size],
    }),
    [size, variant],
  )

  return computedClasses
}
