import { Asset, Pool } from '@thorswap-lib/multichain-core';
import { LiquidityTypeOption } from 'components/LiquidityType/types';
import { getInputAssetsForAdd, hasConnectedWallet } from 'helpers/wallet';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useMemo } from 'react';
import { useWallet } from 'store/wallet/hooks';

type Props = {
  poolAssets: Asset[];
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
