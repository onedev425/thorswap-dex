import { TextTransform } from 'components/Atomic';
import { TooltipPlacement } from 'components/Atomic/Tooltip/types';
import { ButtonHTMLAttributes, DetailedHTMLProps, MouseEventHandler, ReactNode } from 'react';
import { ColorType } from 'types/app';

export type ButtonTypes = 'default' | 'outline' | 'borderless';
export type ButtonSizes = 'sm' | 'md' | 'lg';
export type ButtonVariants = 'primary' | 'secondary' | 'tertiary' | 'tint' | 'warn';
export type TransformClasses = 'normal-case' | 'capitalize' | 'uppercase' | 'lowercase';
export type VariantClasses = Record<ButtonVariants, string>;
export type SizeClasses = Record<ButtonSizes, string>;

export type ButtonProps = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'type'
> & {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  tooltipPlacement?: TooltipPlacement;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: ButtonSizes;
  textColor?: ColorType;
  transform?: TextTransform;
  type?: ButtonTypes;
  stretch?: boolean;
  variant?: ButtonVariants;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  isFancy?: boolean;
  error?: boolean;
  tooltipClasses?: string;
};
