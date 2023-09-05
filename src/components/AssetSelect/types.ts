import type { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import type { Token } from 'store/thorswap/types';

export type AssetSelectProps = {
  assets?: AssetSelectType[];
  isLoading?: boolean;
  query?: string;
  setQuery?: (query: string) => void;
  onSelect: (asset: AssetEntity) => void;
  onClose?: () => void;
  openManageTokenList?: () => void;
  noFilters?: boolean;
  assetTypeComponent?: React.ReactNode;
};

export type AssetSelectType = Pick<Token, 'logoURI' | 'cg'> & {
  asset: AssetEntity;
  apr?: string;
  filled?: number;
  value?: Amount;
  price?: number;
  provider?: string;
  identifier?: string;
  balance?: Amount;
  extraInfo?: string | number;
};
