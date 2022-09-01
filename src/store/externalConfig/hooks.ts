import { SupportedChain } from '@thorswap-lib/types';
import { useCallback } from 'react';
import { actions } from 'store/externalConfig/slice';
import { useAppDispatch, useAppSelector } from 'store/store';

import { loadConfig } from './loadConfig';
import { AnnouncementsData, ChainStatusFlag } from './types';

export const useExternalConfig = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.externalConfig);

  const setAnnouncements = useCallback(
    (announcements: AnnouncementsData) => {
      dispatch(actions.setAnnouncements(announcements));
    },
    [dispatch],
  );

  const setTradingGloballyDisabled = useCallback(
    (isDisabled: boolean) => {
      dispatch(actions.setTradingGloballyDisabled(isDisabled));
    },
    [dispatch],
  );

  const refreshExternalConfig = useCallback(async () => {
    const announcements = await loadConfig();
    setAnnouncements(announcements);
  }, [setAnnouncements]);

  const getChainCustomFlag = useCallback(
    (chain: SupportedChain, flag: ChainStatusFlag) => {
      return state.announcements.chainStatus[chain]?.flags?.[flag] || false;
    },
    [state.announcements.chainStatus],
  );

  const getChainPaused = (chain: SupportedChain) => {
    return getChainCustomFlag(chain, ChainStatusFlag.isChainPaused);
  };

  const getChainTradingPaused = (chain: SupportedChain) => {
    return getChainPaused(chain) || getChainCustomFlag(chain, ChainStatusFlag.isTradingPaused);
  };

  const getChainDepositLPPaused = (chain: SupportedChain) => {
    return (
      getChainPaused(chain) ||
      getChainCustomFlag(chain, ChainStatusFlag.isLPPaused) ||
      getChainCustomFlag(chain, ChainStatusFlag.isLPDepositPaused)
    );
  };

  const getChainWithdrawLPPaused = (chain: SupportedChain) => {
    return (
      getChainPaused(chain) ||
      getChainCustomFlag(chain, ChainStatusFlag.isLPPaused) ||
      getChainCustomFlag(chain, ChainStatusFlag.isLPWithdrawalPaused)
    );
  };

  return {
    ...state,
    getChainCustomFlag,
    getChainDepositLPPaused,
    getChainWithdrawLPPaused,
    getChainTradingPaused,
    setAnnouncements,
    setTradingGloballyDisabled,
    refreshExternalConfig,
  };
};
