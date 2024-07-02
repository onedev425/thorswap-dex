import type { AssetValue } from "@swapkit/sdk";
import type { IconColor } from "components/Atomic";
import type { ColorType } from "types/app";

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
  | { asset: AssetValue; logoURI?: string }
  | { logoURI: string; asset?: AssetValue }
) & {
  badge?: string;
  hasChainIcon?: boolean;
  secondaryIconPlacement?: SecondaryIconPlacement;
  hasShadow?: boolean;
  bgColor?: ColorType;
  shadowPosition?: "corner" | "center";
  ticker?: string;
} & AssetStyleType;

export type AssetLpIconProps = {
  asset1: AssetValue;
  asset2: AssetValue;
  inline?: boolean;
  hasShadow?: boolean;
} & AssetStyleType;

export type SecondaryIconPlacement = "tl" | "tr" | "bl" | "br";
