import type { IconName } from 'components/Atomic';
import type { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  error?: string;
  border?: 'bottom' | 'rounded';
  icon?: IconName;
  stretch?: boolean;
  customPrefix?: string | ReactNode;
  suffix?: string | ReactNode;
  symbol?: string | ReactNode;
  containerClassName?: string;
};
