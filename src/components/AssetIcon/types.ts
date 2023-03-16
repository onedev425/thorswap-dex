import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { IconColor } from 'components/Atomic';
import { ColorType } from 'types/app';

export const iconSizes = {
  large: 72,
  big: 56,
  normal: 40,
  small: 32,
  tiny: 24,
};

export type IconSize = keyof typeof iconSizes;

type AssetStyleType = {
  color?: IconColor;
  size?: IconSize | number;
  className?: string;
};

export type AssetIconProps = (
  | { asset: AssetEntity; logoURI?: string }
  | { logoURI: string; asset?: AssetEntity }
) & {
  badge?: string;
  hasChainIcon?: boolean;
  secondaryIconPlacement?: SecondaryIconPlacement;
  hasShadow?: boolean;
  bgColor?: ColorType;
  shadowPosition?: 'corner' | 'center';
  ticker?: string;
} & AssetStyleType;

export type AssetLpIconProps = {
  asset1: AssetEntity;
  asset2: AssetEntity;
  inline?: boolean;
  hasShadow?: boolean;
} & AssetStyleType;

export type SecondaryIconPlacement = 'tl' | 'tr' | 'bl' | 'br';
