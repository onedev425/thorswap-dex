import { ReactNode } from 'react';

export type CardSize = 'sm' | 'md' | 'lg';

export type CardProps = {
  className?: string;
  shadow?: boolean;
  size?: CardSize;
  stretch?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  withBorder?: boolean;
};
