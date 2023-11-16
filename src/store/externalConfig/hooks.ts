import type { Chain } from '@swapkit/core';
import { useCallback, useMemo } from 'react';
import { useGetAnnouncementsQuery } from 'store/thorswap/api';

import { ChainStatusFlag } from './types';

export const useExternalConfig = () => {
  const { data, refetch } = useGetAnnouncementsQuery();
  const isLoaded = typeof data !== 'undefined';
  const announcements = useMemo(() => data || { chainStatus: {}, manual: [] }, [data]);
  // Not used for now, but we might want it in the future
  const isTradingGloballyDisabled = false;

  const refreshExternalConfig = useCallback(async () => {
    refetch();
  }, [refetch]);

  const getChainCustomFlag = useCallback(
    (chain: Chain, flag: ChainStatusFlag) => {
      return announcements?.chainStatus[chain]?.flags?.[flag] || false;
    },
    [announcements],
  );

  const getChainPaused = (chain: Chain) => {
    return getChainCustomFlag(chain, ChainStatusFlag.isChainPaused);
  };

  const getChainTradingPaused = (chain: Chain) => {
    return getChainPaused(chain) || getChainCustomFlag(chain, ChainStatusFlag.isTradingPaused);
  };

  const getChainDepositLPPaused = (chain: Chain) => {
    return (
      getChainPaused(chain) ||
      getChainCustomFlag(chain, ChainStatusFlag.isLPPaused) ||
      getChainCustomFlag(chain, ChainStatusFlag.isLPDepositPaused)
    );
  };

  const getChainWithdrawLPPaused = (chain: Chain) => {
    return (
      getChainPaused(chain) ||
      getChainCustomFlag(chain, ChainStatusFlag.isLPPaused) ||
      getChainCustomFlag(chain, ChainStatusFlag.isLPWithdrawalPaused)
    );
  };

  return {
    announcements,
    isTradingGloballyDisabled,
    getChainCustomFlag,
    getChainDepositLPPaused,
    getChainWithdrawLPPaused,
    getChainTradingPaused,
    refreshExternalConfig,
    isLoaded,
  };
};
