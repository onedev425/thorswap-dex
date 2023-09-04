import { MemberPool } from '@thorswap-lib/midgard-sdk';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';

import { ChainMemberDetails, LiquidityProvider, PoolMemberData } from './types';

export const hasPendingLP = (data: ChainMemberDetails | undefined): boolean => {
  if (!data) return false;

  const chainMemberDataArray = Object.values(data);

  if (!chainMemberDataArray) return false;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < chainMemberDataArray.length; i++) {
    const chainMemberData = chainMemberDataArray?.[i] ?? {};
    const poolMemberDataArray = Object.values(chainMemberData);
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let j = 0; j < poolMemberDataArray.length; j++) {
      const poolMemberData = poolMemberDataArray[j];

      const symPosition = poolMemberData?.sym;

      if (symPosition) {
        const isPending = isPendingLP(symPosition);
        if (isPending) return true;
      }
    }
  }

  return false;
};

export const checkPendingLP = (data: LiquidityProvider): boolean => {
  if (Number(data.pending_asset) > 0 || Number(data.pending_rune) > 0) {
    return true;
  }

  return false;
};

export const isPendingLP = (data: MemberPool): boolean => {
  const isPending = Number(data.assetPending) > 0 || Number(data.runePending) > 0;

  return isPending;
};

export const getChainMemberDetails = ({
  memPools,
  chainMemberDetails, // previous chain member details
}: {
  memPools: MemberPool[];
  chainMemberDetails: ChainMemberDetails;
}): ChainMemberDetails => {
  memPools.forEach((memPool: MemberPool) => {
    const { pool, runeAdded, assetAdded, runePending, assetPending } = memPool;

    const poolChain = pool.split('.')[0] as Chain;
    const chainMemberData = chainMemberDetails?.[poolChain] ?? {};
    const poolMemberData = chainMemberData?.[pool] ?? {};
    const isPending = Number(runePending) > 0 || Number(assetPending) > 0;
    const isAssetAdded = Number(assetAdded) > 0;
    const isRuneAdded = Number(runeAdded) > 0;

    chainMemberDetails[poolChain] = {
      ...chainMemberData,
      [pool]: {
        ...poolMemberData,
        ...(isPending && { pending: memPool }),
        ...(isAssetAdded && !isRuneAdded
          ? { assetAsym: memPool }
          : !isAssetAdded && isRuneAdded
          ? { assetAsym: memPool }
          : { sym: memPool }),
      },
    };
  });

  return chainMemberDetails;
};

export const mergePendingLP = ({
  pendingLP,
  chainMemberDetails,
}: {
  pendingLP: LiquidityProvider;
  chainMemberDetails: ChainMemberDetails;
}): ChainMemberDetails => {
  const chain = AssetEntity.fromAssetString(pendingLP.asset)?.chain;

  if (!chain) return chainMemberDetails;

  const chainMemberData = chainMemberDetails?.[chain] ?? {};

  let poolMemberData: PoolMemberData = {};
  Object.keys(chainMemberData).forEach((poolIndex) => {
    if (poolIndex === pendingLP.asset) {
      poolMemberData = chainMemberData[poolIndex];
    }
  });

  const pendingMemberPool: MemberPool = {
    assetAdded: pendingLP.asset_deposit_value,
    assetAddress: pendingLP.asset_address || '',
    assetPending: pendingLP.pending_asset,
    assetWithdrawn: '0',
    dateFirstAdded: '-',
    dateLastAdded: '-',
    liquidityUnits: pendingLP.units,
    pool: pendingLP.asset,
    runeAdded: pendingLP.rune_deposit_value,
    runeAddress: pendingLP.rune_address || '',
    runeWithdrawn: '0',
    runePending: pendingLP.pending_rune,
  };

  poolMemberData = {
    ...poolMemberData,
    pending: pendingMemberPool,
  };

  chainMemberData[pendingLP.asset] = poolMemberData;
  chainMemberDetails[chain] = chainMemberData;

  return chainMemberDetails;
};

export const removePendingLP = ({
  asset,
  chainMemberDetails,
}: {
  asset: string;
  chainMemberDetails: ChainMemberDetails;
}): ChainMemberDetails => {
  const chain = AssetEntity.fromAssetString(asset)?.chain;

  if (!chain) return chainMemberDetails;

  const chainMemberData = chainMemberDetails?.[chain] ?? {};

  let poolMemberData: PoolMemberData = {};
  Object.keys(chainMemberData).forEach((poolIndex) => {
    if (poolIndex === asset) {
      poolMemberData = chainMemberData[poolIndex];
    }
  });

  if (!Object.entries(poolMemberData).length) {
    poolMemberData = {
      ...poolMemberData,
      pending: undefined,
    };

    chainMemberData[asset] = poolMemberData;
    chainMemberDetails[chain] = chainMemberData;
  }

  return chainMemberDetails;
};
