import { Asset } from '@thorswap-lib/multichain-sdk';
import { SupportedChain } from '@thorswap-lib/types';
import { useMimir } from 'hooks/useMimir';
import { useMemo } from 'react';
import { useExternalConfig } from 'store/externalConfig/hooks';

type Props = {
  poolAsset: Asset;
};

export const useAddLiquidityUtils = ({ poolAsset }: Props) => {
  const { isChainPauseLPAction } = useMimir();
  const { getChainDepositLPPaused } = useExternalConfig();

  const isLPActionPaused: boolean = useMemo(() => {
    return (
      isChainPauseLPAction(poolAsset.chain) ||
      getChainDepositLPPaused(poolAsset.chain as SupportedChain)
    );
  }, [isChainPauseLPAction, poolAsset.chain, getChainDepositLPPaused]);

  return { isLPActionPaused };
};
