import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import type { Chain } from '@thorswap-lib/types';
import { useMimir } from 'hooks/useMimir';
import { useMemo } from 'react';
import { useExternalConfig } from 'store/externalConfig/hooks';

type Props = {
  poolAsset: AssetEntity;
};

export const useAddLiquidityUtils = ({ poolAsset }: Props) => {
  const { isChainPauseLPAction } = useMimir();
  const { getChainDepositLPPaused } = useExternalConfig();

  const isLPActionPaused: boolean = useMemo(() => {
    return (
      isChainPauseLPAction(poolAsset.chain) || getChainDepositLPPaused(poolAsset.chain as Chain)
    );
  }, [isChainPauseLPAction, poolAsset.chain, getChainDepositLPPaused]);

  return { isLPActionPaused };
};
