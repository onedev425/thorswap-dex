import { ReactNode } from 'react';

export type InfoRowSize = 'sm' | 'md' | 'lg';

export type InfoRowConfig = {
  className?: string;
  key?: string;
  label: string | ReactNode;
  value: string | ReactNode;
  size?: InfoRowSize;
  onClick?: () => void;
};

export type InfoRowType = {
  showBorder?: boolean;
  size?: InfoRowSize;
} & InfoRowConfig;

export type InfoRowProps = {
  className?: string;
  onClick?: () => void;
  capitalizeLabel?: boolean;
} & InfoRowType;
