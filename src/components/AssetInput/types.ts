import type { AssetValue, SwapKitNumber } from "@swapkit/sdk";
import type { AssetSelectProps, AssetSelectType } from "components/AssetSelect/types";
import type React from "react";

export type AssetInputType = {
  asset: AssetValue;
  apr?: string;
  usdPrice?: number;
  balance?: AssetValue;
  // TODO: What this?
  value?: SwapKitNumber;
  loading?: boolean;
  priceLoading?: boolean;
  logoURI?: string;
};

export type AssetInputProps = {
  title?: string;
  hideZeroPrice?: boolean;
  AssetListComponent?: (props: AssetSelectProps) => React.JSX.Element;
  isLoading?: boolean;
  className?: string;
  setQuery?: (query: string) => void;
  query?: string;
  disabled?: boolean;
  hideMaxButton?: boolean;
  inputClassName?: string;
  maxButtonLabel?: string;
  onValueChange?: (assetValue: SwapKitNumber) => void;
  isPriceLoading?: boolean;
  selectedAsset: AssetInputType;
  warning?: string;
  noFilters?: boolean;
  displayAssetTypeComponent?: React.ReactNode;
} & (
  | {
      assets: AssetSelectType[];
      onAssetChange: (asset: AssetValue) => void;
      poolAsset?: undefined;
      showSecondaryChainSelector?: undefined;
      singleAsset?: undefined;
    }
  | {
      assets: AssetSelectType[];
      onAssetChange: (asset: AssetValue) => void;
      poolAsset: AssetInputType;
      singleAsset?: true;
      showSecondaryChainSelector?: boolean;
    }
  | {
      assets?: undefined;
      onAssetChange?: undefined;
      poolAsset?: undefined;
      showSecondaryChainSelector?: undefined;
      singleAsset?: true;
    }
);
