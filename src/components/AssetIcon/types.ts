import { Asset } from '@thorswap-lib/multichain-core';
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
  | { asset: Asset; logoURI?: string }
  | { logoURI: string; asset?: Asset }
) & {
  badge?: string;
  hasChainIcon?: boolean;
  secondaryIconPlacement?: SecondaryIconPlacement;
  hasShadow?: boolean;
  bgColor?: ColorType;
  shadowPosition?: 'corner' | 'center';
} & AssetStyleType;

export type AssetLpIconProps = {
  asset1: Asset;
  asset2: Asset;
  inline?: boolean;
  hasShadow?: boolean;
} & AssetStyleType;

export type SecondaryIconPlacement = 'tl' | 'tr' | 'bl' | 'br';
