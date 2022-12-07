import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { Token } from 'store/thorswap/types';

export type AssetSelectProps = {
  assets?: AssetSelectType[];
  isLoading?: boolean;
  query?: string;
  setQuery?: (query: string) => void;
  onSelect: (asset: Asset) => void;
  onClose?: () => void;
  openManageTokenList?: () => void;
  noFilters?: boolean;
};

export type AssetSelectType = Pick<Token, 'logoURI' | 'cg'> & {
  asset: Asset;
  apr?: string;
  value?: Amount;
  price?: number;
  provider?: string;
  identifier?: string;
  balance?: Amount;
};
