import { Amount, Asset, Price } from '@thorswap-lib/multichain-core';
import { AssetSelectProps, AssetSelectType } from 'components/AssetSelect/types';

export type AssetInputType = {
  asset: Asset;
  apr?: string;
  usdPrice?: Price;
  balance?: Amount;
  value?: Amount;
  loading?: boolean;
  priceLoading?: boolean;
};

export type AssetInputProps = {
  hideZeroPrice?: boolean;
  AssetListComponent?: (props: AssetSelectProps) => JSX.Element;
  isLoading?: boolean;
  className?: string;
  setQuery?: (query: string) => void;
  query?: string;
  disabled?: boolean;
  hideMaxButton?: boolean;
  inputClassName?: string;
  maxButtonLabel?: string;
  onValueChange?: (assetValue: Amount) => void;
  isPriceLoading?: boolean;
  secondaryLabel?: string;
  selectedAsset: AssetInputType;
  warning?: string;
  noFilters?: boolean;
} & (
  | {
      assets: AssetSelectType[];
      onAssetChange: (asset: Asset) => void;
      poolAsset?: undefined;
      showSecondaryChainSelector?: undefined;
      singleAsset?: undefined;
    }
  | {
      assets: AssetSelectType[];
      onAssetChange: (asset: Asset) => void;
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
