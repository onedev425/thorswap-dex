import { Pool } from '@thorswap-lib/multichain-core';
import { PoolShareType } from 'store/midgard/types';

export type ChainPoolData = {
  pool: Pool;
  assetAdded: string;
  assetAddress: string;
  assetPending: string;
  assetWithdrawn: string;
  dateFirstAdded: string;
  dateLastAdded: string;
  liquidityUnits: string;
  runeAdded: string;
  runeAddress: string;
  runePending: string;
  runeWithdrawn: string;
  shareType: PoolShareType;
};
