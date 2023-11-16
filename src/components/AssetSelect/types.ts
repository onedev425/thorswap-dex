import type { AssetValue } from '@swapkit/core';
import type { Token } from 'store/thorswap/types';

export type AssetSelectProps = {
  assets?: AssetSelectType[];
  isLoading?: boolean;
  query?: string;
  setQuery?: (query: string) => void;
  onSelect: (asset: AssetValue) => void;
  onClose?: () => void;
  openManageTokenList?: () => void;
  noFilters?: boolean;
  assetTypeComponent?: React.ReactNode;
};

export type AssetSelectType = Pick<Token, 'logoURI' | 'cg'> & {
  asset: AssetValue;
  apr?: string;
  filled?: number;
  value?: AssetValue;
  price?: number;
  provider?: string;
  identifier?: string;
  balance?: AssetValue;
  extraInfo?: string | number;
};
