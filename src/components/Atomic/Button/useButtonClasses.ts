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
  primary:
    'border-none bg-btn-primary group-hover:bg-gradient-to-r group-hover:from-btn-primary group-hover:to-btn-primary-active',
  secondary:
    'border-none bg-btn-secondary group-hover:bg-gradient-to-r group-hover:from-btn-secondary group-hover:to-btn-secondary-active',
  tertiary:
    'border-none bg-btn-tertiary group-hover:bg-gradient-to-r group-hover:from-btn-tertiary group-hover:to-btn-tertiary-active',
  accent:
    'border-none bg-btn-accent group-hover:bg-gradient-to-r group-hover:from-btn-accent group-hover:to-btn-accent-active',
  tint: 'border-none bg-btn-light-tint-active hover:bg-btn-light-tint-active dark:bg-btn-dark-tint dark:hover:bg-btn-dark-tint-active',
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
    'border-solid group-hover:border-btn-primary-active border-btn-primary group-focus:border-btn-primary group-active:border-btn-primary',
  secondary:
    'border-solid group-hover:border-btn-secondary-active border-btn-secondary group-focus:border-btn-secondary group-active:border-btn-secondary',
  tertiary:
    'border-solid group-hover:border-btn-tertiary-active border-btn-tertiary group-focus:border-btn-tertiary group-active:border-btn-tertiary',
  accent:
    'border-solid group-hover:border-btn-accent-active border-btn-accent group-focus:border-btn-accent group-active:border-btn-accent',
  tint: 'border-solid group-hover:border-btn-tint-active border-btn-tint group-focus:border-btn-tint group-active:border-btn-tint',
}

const typographyOutlineClasses: Record<ButtonVariants, string> = {
  primary: 'group-focus:text-btn-primary group-active:text-btn-primary',
  secondary: 'group-focus:text-btn-secondary group-active:text-btn-secondary',
  tertiary: 'group-focus:text-btn-tertiary group-active:text-btn-tertiary',
  accent: 'group-focus:text-btn-accent group-active:text-btn-accent',
  tint: 'group-focus:text-btn-tint group-active:text-btn-tint',
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
      typographyOutlineClass: typographyOutlineClasses[variant],
      typographyVariant: typographyVariants[size],
    }),
    [size, variant],
  )

  return computedClasses
}
