import { TypographyVariant } from 'components/Atomic';
import { useMemo } from 'react';

import { ButtonSizes, ButtonVariants } from './types';

const buttonClasses: Record<ButtonSizes, string> = {
  lg: 'h-14 px-7 rounded-full',
  md: 'h-12 px-7 rounded-3xl',
  sm: 'h-10 px-4 rounded-2xl',
  xs: 'h-10 px-4 rounded-2xl',
};

const typographyVariants: Record<ButtonSizes, TypographyVariant> = {
  lg: 'subtitle2',
  md: 'caption',
  sm: 'caption-xs',
  xs: 'caption-xs',
};

const typographyClasses: Record<ButtonVariants, string> = {
  primary: 'text-white dark:text-dark-typo-primary',
  secondary: 'text-white dark:text-dark-typo-primary',
  tertiary: 'text-white dark:text-dark-typo-primary',
  warn: 'text-white dark:text-dark-typo-primary',
  tint: 'text-light-typo-primary dark:text-dark-typo-primary',
};

const backgroundClasses: Record<ButtonVariants, string> = {
  primary: 'bg-btn-primary-light dark:bg-btn-primary',
  secondary: 'bg-btn-secondary',
  tertiary: 'bg-btn-tertiary',
  warn: 'bg-orange',
  tint: 'bg-btn-light-tint hover:!bg-btn-light-tint-active dark:bg-btn-dark-tint dark:hover:!bg-btn-dark-tint-active hover:!bg-opacity-100 active:!bg-opacity-50 dark:hover:!bg-opacity-100 dark:active:!bg-opacity-50',
};

const outlinedClasses: Record<ButtonVariants, string> = {
  primary: 'border-btn-primary',
  secondary: 'border-btn-secondary',
  tertiary: 'border-btn-tertiary',
  warn: 'border-orange',
  tint: 'border-light-border-primary dark:border-dark-border-primary !bg-opacity-0 hover:!bg-opacity-100 active:!bg-opacity-50 dark:hover:!bg-opacity-100 dark:active:!bg-opacity-50',
};

const getBgClass = (variant: ButtonVariants, isFancy: boolean, hasError: boolean) => {
  if (isFancy && !hasError) {
    return 'border-none bg-gradient-to-r from-btn-fancy-primary-start to-btn-fancy-primary-end hover:from-btn-fancy-primary-start-hover hover:to-btn-fancy-primary-end-hover';
  }

  if (isFancy && hasError) {
    return 'border-none bg-gradient-to-r from-btn-fancy-error-start to-btn-fancy-error-end hover:from-btn-fancy-error-start-hover hover:to-btn-fancy-error-end-hover';
  }

  const commonClasses = 'border-transparent hover:bg-opacity-80 active:bg-opacity-100';
  const variantClasses = backgroundClasses[variant];

  return `${commonClasses} ${variantClasses}`;
};

const getOutlinedClass = (variant: ButtonVariants) => {
  const commonClasses = 'border-solid !bg-opacity-0 hover:!bg-opacity-20 active:!bg-opacity-50';
  const variantClasses = outlinedClasses[variant];
  const variantBgClasses = backgroundClasses[variant];

  return `${commonClasses}  ${variantBgClasses} ${variantClasses}`;
};

export const useButtonClasses = ({
  size,
  variant,
  isFancy,
  error,
}: {
  size: ButtonSizes;
  variant: ButtonVariants;
  isFancy: boolean;
  error: boolean;
}) => {
  const computedClasses = useMemo(
    () => ({
      backgroundClass: getBgClass(variant, isFancy, error),
      buttonClass: buttonClasses[size],
      outlinedClass: getOutlinedClass(variant),
      typographyVariant: typographyVariants[size],
      typographyClasses: typographyClasses[variant],
    }),
    [size, variant, isFancy, error],
  );

  return computedClasses;
};
