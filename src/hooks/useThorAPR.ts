import { Asset, Pool } from '@thorswap-lib/multichain-core';
import { getAPY } from 'helpers/staking';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';

const THOR_REWARDS_PER_BLOCK = 0;

export const useThorAPR = () => {
  const { pools } = useMidgard();

  const thorPool = useMemo(() => Pool.byAsset(Asset.THOR(), pools), [pools]);
  const thorDepth = useMemo(
    () => (thorPool?.assetDepth.assetAmount.toNumber() ?? 0) * 2,
    [thorPool],
  );

  const apy = useMemo(
    () => (thorDepth ? getAPY(THOR_REWARDS_PER_BLOCK, thorDepth).toFixed(2) : 0),
    [thorDepth],
  );

  const thorchainAPY = Number(thorPool?.detail?.poolAPY ?? 0);

  return (Number(apy) + thorchainAPY * 100).toFixed(2);
};
