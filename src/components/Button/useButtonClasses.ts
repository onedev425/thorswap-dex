import { useMemo } from 'react'

import { ButtonSizes, ButtonVariants } from 'components/Button/types'
import { TypographyVariant } from 'components/Typography'

const buttonClasses: Record<ButtonSizes, string> = {
  md: 'h-[48px] px-7 rounded-3xl',
  sm: 'h-[40px] px-5 rounded-xl',
}

const typographyVariants: Record<ButtonSizes, TypographyVariant> = {
  md: 'caption',
  sm: 'caption-xs',
}

const backgroundClasses: Record<ButtonVariants, string> = {
  primary: 'bg-btn-primary',
  secondary: 'bg-btn-secondary',
  tertiary: 'bg-btn-tertiary',
  accent: 'bg-btn-accent',
  tint: 'dark:bg-btn-tint',
}

const backgroundActiveClasses: Record<ButtonVariants, string> = {
  primary: 'focus:bg-btn-primary-active active:bg-btn-primary-active',
  secondary: 'focus:bg-btn-secondary-active active:bg-btn-secondary-active',
  tertiary: 'focus:bg-btn-tertiary-active active:bg-btn-tertiary-active',
  accent: 'focus:bg-btn-accent-active active:bg-btn-accent-active',
  tint: 'focus:bg-btn-tint-active active:bg-btn-tint-active',
}

const typographyOutlineClasses: Record<ButtonVariants, string> = {
  primary:
    'group-focus:text-btn-primary-active group-active:text-btn-primary-active',
  secondary:
    'group-focus:text-btn-secondary-active group-active:text-btn-secondary-active',
  tertiary:
    'group-focus:text-btn-tertiary-active group-active:text-btn-tertiary-active',
  accent:
    'group-focus:text-btn-accent-active group-active:text-btn-accent-active',
  tint: 'group-focus:text-btn-tint-active group-active:text-btn-tint-active',
}

const outlinedClasses: Record<ButtonVariants, string> = {
  primary:
    'border-btn-primary group-focus:border-btn-primary-active group-active:border-btn-primary-active',
  secondary:
    'border-btn-secondary group-focus:border-btn-secondary-active group-active:border-btn-secondary-active',
  tertiary:
    'border-btn-tertiary group-focus:border-btn-tertiary-active group-active:border-btn-tertiary-active',
  accent:
    'border-btn-accent group-focus:border-btn-accent-active group-active:border-btn-accent-active',
  tint: 'border-btn-tint group-focus:border-btn-tint-active group-active:border-btn-tint-active',
}

// TODO: Add radial gradients on hover based on those ranges per variant
// const gradientColors: Record<ButtonVariants, [string, string]> = {
//   primary: ['#5DD39B', '#4DBAD6'],
//   secondary: ['#39BBF3', '#46B2A7'],
//   tertiary: ['#348CF4', '#7B48E8'],
//   accent: ['#7B48E8', '#348CF4'],
//   tint: ['#273855', '#273855'],
// }

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
