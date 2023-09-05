import type { AssetEntity, Pool } from '@thorswap-lib/swapkit-core';
import { getInputAssetsForAdd, hasConnectedWallet } from 'helpers/wallet';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useMemo } from 'react';
import { LiquidityTypeOption } from 'store/midgard/types';
import { useWallet } from 'store/wallet/hooks';

type Props = {
  poolAssets: AssetEntity[];
  pools: Pool[];
  liquidityType: LiquidityTypeOption;
};

export const useAssetsList = ({ liquidityType, pools, poolAssets }: Props) => {
  const { wallet } = useWallet();

  const inputAssets = useMemo(() => {
    if (hasConnectedWallet(wallet) && liquidityType !== LiquidityTypeOption.RUNE) {
      return getInputAssetsForAdd({ wallet, pools });
    }

    return poolAssets;
  }, [wallet, pools, poolAssets, liquidityType]);

  const poolAssetList = useAssetsWithBalance(inputAssets);

  return poolAssetList;
};
