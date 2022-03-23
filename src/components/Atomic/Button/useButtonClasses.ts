import { useMemo } from 'react'

import { TypographyVariant } from 'components/Atomic'

import { ButtonSizes, ButtonVariants } from './types'

const buttonClasses: Record<ButtonSizes, string> = {
  lg: 'h-14 px-7 rounded-full',
  md: 'h-12 px-7 rounded-3xl',
  sm: 'h-10 px-4 rounded-2xl',
}

const typographyVariants: Record<ButtonSizes, TypographyVariant> = {
  lg: 'body',
  md: 'caption',
  sm: 'caption-xs',
}

const backgroundClasses: Record<ButtonVariants, string> = {
  primary: 'bg-btn-primary',
  secondary: 'bg-btn-secondary',
  tertiary: 'bg-btn-tertiary',
  tint: 'bg-btn-light-tint hover:!bg-btn-light-tint-active dark:bg-btn-dark-tint dark:hover:!bg-btn-dark-tint-active hover:!bg-opacity-100 active:!bg-opacity-50 dark:hover:!bg-opacity-100 dark:active:!bg-opacity-50',
}

const outlinedClasses: Record<ButtonVariants, string> = {
  primary: 'border-btn-primary',
  secondary: 'border-btn-secondary',
  tertiary: 'border-btn-tertiary',
  tint: 'border-light-border-primary dark:border-dark-border-primary !bg-opacity-0 hover:!bg-opacity-100 active:!bg-opacity-50 dark:hover:!bg-opacity-100 dark:active:!bg-opacity-50',
}

const getBgClass = (variant: ButtonVariants) => {
  const commonClasses =
    'border-transparent hover:bg-opacity-80 active:bg-opacity-100'
  const variantClasses = backgroundClasses[variant]

  return `${commonClasses} ${variantClasses}`
}

const getOutlinedClass = (variant: ButtonVariants) => {
  const commonClasses =
    'border-solid bg-opacity-0 hover:bg-opacity-20 active:bg-opacity-50'
  const variantClasses = outlinedClasses[variant]
  const variantBgClasses = backgroundClasses[variant]

  return `${commonClasses}  ${variantBgClasses} ${variantClasses}`
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
      backgroundClass: getBgClass(variant),
      buttonClass: buttonClasses[size],
      outlinedClass: getOutlinedClass(variant),
      typographyVariant: typographyVariants[size],
    }),
    [size, variant],
  )

  return computedClasses
}
