import type { TypographyColorType } from 'components/Atomic/Typography/types';

export type CardStyleType = 'primary' | 'info' | 'warn' | 'success';

export const cardFontColors: Record<CardStyleType, TypographyColorType> = {
  primary: 'primary',
  info: 'primaryBtn',
  warn: 'yellow',
  success: 'green',
};
