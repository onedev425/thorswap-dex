import { unwrapResult } from '@reduxjs/toolkit';
import {
  Action,
  ActionListParams,
  ActionStatusEnum,
  ActionTypeEnum,
  HistoryInterval,
} from '@thorswap-lib/midgard-sdk';
import { Asset } from '@thorswap-lib/multichain-sdk';
import { Chain, SupportedChain } from '@thorswap-lib/types';
import { useCallback, useMemo } from 'react';
import { batch } from 'react-redux';
import { TX_PUBLIC_PAGE_LIMIT } from 'settings/constants/values';
import * as actions from 'store/midgard/actions';
import { actions as sliceActions } from 'store/midgard/slice';
import { useAppDispatch, useAppSelector } from 'store/store';
import * as walletActions from 'store/wallet/actions';

import { SubmitTx, TxTracker, TxTrackerType } from './types';

const MAX_HISTORY_COUNT = 100;
const PER_DAY = 'day' as HistoryInterval;

export const useMidgard = () => {
  const dispatch = useAppDispatch();
  const { midgardState, walletState } = useAppSelector(({ midgard, wallet }) => ({
    midgardState: midgard,
    walletState: wallet,
  }));
  const wallet = useMemo(() => walletState.wallet, [walletState]);

  const isGlobalHistoryLoading = useMemo(
    () =>
      midgardState.earningsHistoryLoading ||
      midgardState.swapHistoryLoading ||
      midgardState.liquidityHistoryLoading,
    [midgardState],
  );

  // get earnings, swap, liquidity history
  const getGlobalHistory = useCallback(() => {
    // fetch historical data till past day
    const query = { interval: PER_DAY, count: MAX_HISTORY_COUNT };

    batch(() => {
      dispatch(actions.getEarningsHistory(query));
      dispatch(actions.getTVLHistory(query));
      dispatch(actions.getSwapHistory({ query }));
      dispatch(actions.getLiquidityHistory({ query }));
    });
  }, [dispatch]);

  const getPoolHistory = useCallback(
    (pool: string) => {
      // fetch historical data till past day
      const query = {
        pool,
        query: { interval: PER_DAY, count: MAX_HISTORY_COUNT },
      };

      batch(() => {
        dispatch(actions.getSwapHistory(query));
        dispatch(actions.getDepthHistory(query));
        dispatch(actions.getLiquidityHistory(query));
      });
    },
    [dispatch],
  );

  const getPendingDepositByChain = useCallback(
    (chain: SupportedChain) => {
      if (!wallet) return;

      const thorchainAddress = wallet?.[Chain.THORChain]?.address;
      if (thorchainAddress) {
        midgardState.pools.forEach((pool) => {
          if (pool.asset.chain === chain) {
            dispatch(
              actions.getLiquidityProviderData({
                address: thorchainAddress,
                asset: pool.asset.toString(),
              }),
            );
          }
        });
      }
    },
    [dispatch, midgardState.pools, wallet],
  );

  /**
   * reload pool member details for a specific chain
   * 1. fetch pool member data for chain wallet addr (asset asymm share, symm share)
   * 2. fetch pool member data for thorchain wallet addr (rune asymm share)
   */
  const loadMemberDetailsByChain = useCallback(
    (chain: SupportedChain) => {
      if (!wallet) return;

      const assetChainAddress = wallet?.[chain]?.address;
      const thorchainAddress = wallet?.[Chain.THORChain]?.address;

      if (assetChainAddress && thorchainAddress) {
        dispatch(
          actions.reloadPoolMemberDetailByChain({
            chain,
            thorchainAddress,
            assetChainAddress,
          }),
        );

        // load pending deposit
        getPendingDepositByChain(chain);
      }
    },
    [dispatch, wallet, getPendingDepositByChain],
  );

  // get pool member details for a specific chain
  const getMemberDetailsByChain = useCallback(
    async (chain: SupportedChain) => {
      if (!walletState.wallet) return;

      const chainWalletAddr = walletState.wallet?.[chain]?.address;

      if (chainWalletAddr) {
        dispatch(
          actions.getPoolMemberDetailByChain({
            chain,
            address: chainWalletAddr,
          }),
        );

        // load pending deposit
        getPendingDepositByChain(chain);
      }
    },
    [dispatch, walletState.wallet, getPendingDepositByChain],
  );

  // get pool member details for all chains
  const getAllMemberDetails = useCallback(async () => {
    if (!walletState.wallet) return;

    Object.keys(walletState.wallet).forEach((chain) => {
      getMemberDetailsByChain(chain as SupportedChain);
    });
  }, [getMemberDetailsByChain, walletState.wallet]);

  // get tx data
  const getTxData = useCallback(
    ({ limit = TX_PUBLIC_PAGE_LIMIT, ...otherParams }: ActionListParams) => {
      dispatch(actions.getActions({ ...otherParams, limit }));
    },
    [dispatch],
  );

  const getInboundData = useCallback(() => {
    dispatch(actions.getThorchainInboundData());
  }, [dispatch]);

  const getNodes = useCallback(() => {
    dispatch(actions.getNodes());
  }, [dispatch]);

  const addNewTxTracker = useCallback(
    (txTracker: TxTracker) => {
      dispatch(sliceActions.addNewTxTracker(txTracker));
    },
    [dispatch],
  );

  const updateTxTracker = useCallback(
    ({ uuid, txTracker }: { uuid: string; txTracker: Partial<TxTracker> }) => {
      dispatch(sliceActions.updateTxTracker({ uuid, txTracker }));
    },
    [dispatch],
  );

  // process tx tracker to update balance after submit
  // update sent asset balance after submit
  const processSubmittedTx = useCallback(
    ({ submitTx, type }: { submitTx: SubmitTx; type: TxTrackerType }) => {
      if ([TxTrackerType.Swap, TxTrackerType.Switch].includes(type)) {
        const [inAsset] = submitTx?.inAssets || [];
        if (inAsset) {
          const asset = Asset.fromAssetString(inAsset?.asset);

          if (asset) {
            dispatch(walletActions.getWalletByChain(asset.L1Chain as SupportedChain));
          }
        }
      } else if (type === TxTrackerType.AddLiquidity) {
        const inAssets = submitTx?.inAssets || [];
        inAssets.forEach((inAsset) => {
          const asset = Asset.fromAssetString(inAsset?.asset);

          if (asset) {
            dispatch(walletActions.getWalletByChain(asset.L1Chain as SupportedChain));
          }
        });
      }
    },
    [dispatch],
  );

  // process tx tracker to update balance after success
  const processTxTracker = useCallback(
    ({ txTracker, action }: { txTracker: TxTracker; action?: Action }) => {
      // update received asset balance after success
      if (action?.status === ActionStatusEnum.Success) {
        if (action.type === ActionTypeEnum.Swap) {
          const outTx = action.out[0];
          const asset = Asset.fromAssetString(outTx?.coins?.[0]?.asset);

          if (asset) {
            dispatch(walletActions.getWalletByChain(asset.L1Chain as SupportedChain));
          }
        } else if (action.type === ActionTypeEnum.AddLiquidity) {
          const inAssets = txTracker.submitTx?.inAssets ?? [];
          inAssets.forEach((inAsset) => {
            const asset = Asset.fromAssetString(inAsset.asset);

            if (asset) {
              // reload liquidity member details
              getMemberDetailsByChain(asset.L1Chain as SupportedChain);
            }
          });
        } else if (action.type === ActionTypeEnum.Withdraw) {
          const outAssets = txTracker.submitTx?.outAssets ?? [];
          outAssets.forEach((outAsset) => {
            const asset = Asset.fromAssetString(outAsset.asset);

            if (asset) {
              dispatch(walletActions.getWalletByChain(asset.L1Chain as SupportedChain));
              // reload liquidity member details
              getMemberDetailsByChain(asset.L1Chain as SupportedChain);
            }
          });
        } else if (action.type === ActionTypeEnum.Switch) {
          dispatch(walletActions.getWalletByChain(Chain.THORChain));
        }
      }
    },
    [dispatch, getMemberDetailsByChain],
  );

  const pollTx = useCallback(
    (txTracker: TxTracker) => {
      dispatch(actions.pollTx(txTracker))
        .then(unwrapResult)
        .then((response) =>
          processTxTracker({
            txTracker,
            action: response?.actions?.[0],
          }),
        );
    },
    [dispatch, processTxTracker],
  );

  const pollUpgradeTx = useCallback(
    (txTracker: TxTracker) => {
      dispatch(actions.pollUpgradeTx(txTracker))
        .then(unwrapResult)
        .then((response) =>
          processTxTracker({
            txTracker,
            action: response?.actions?.[0],
          }),
        );
    },
    [dispatch, processTxTracker],
  );

  const pollApprove = useCallback(
    (txTracker: TxTracker) => {
      dispatch(actions.pollApprove(txTracker));
    },
    [dispatch],
  );

  const clearTxTrackers = useCallback(() => {
    dispatch(sliceActions.clearTxTrackers());
  }, [dispatch]);

  const setTxCollapsed = useCallback(
    (collapsed: boolean) => {
      dispatch(sliceActions.setTxCollapsed(collapsed));
    },
    [dispatch],
  );

  const synthAssets = useMemo(
    () =>
      midgardState.pools
        .filter(({ detail }) => detail.status.toLowerCase() === 'available')
        .map(({ asset: { chain, symbol } }) => new Asset(chain, symbol, true)),
    [midgardState.pools],
  );

  const getLpDetails = useCallback(
    async (chain: SupportedChain, pool: string) => {
      const chainWalletAddr = walletState.wallet?.[chain]?.address;

      if (chainWalletAddr) {
        dispatch(
          actions.getLpDetails({
            address: chainWalletAddr,
            pool: pool,
          }),
        );
      }
    },
    [dispatch, walletState.wallet],
  );

  const getAllLpDetails = useCallback(async () => {
    if (!walletState.wallet) return;

    Object.keys(walletState.wallet).forEach((chain) => {
      if (!midgardState.poolNamesByChain[chain]) return;
      midgardState.poolNamesByChain[chain].forEach((poolName: string) => {
        if (midgardState.lpAddedAndWithdraw[poolName] || midgardState.lpDetailLoading[poolName])
          return;
        getLpDetails(chain as SupportedChain, poolName);
      });
    });
  }, [getLpDetails, midgardState, walletState.wallet]);

  return {
    ...midgardState,
    actions,
    getAllMemberDetails,
    getGlobalHistory,
    getInboundData,
    getNodes,
    getPoolHistory,
    getTxData,
    isGlobalHistoryLoading,
    loadMemberDetailsByChain,
    synthAssets,
    // tx tracker actions
    addNewTxTracker,
    updateTxTracker,
    pollTx,
    pollUpgradeTx,
    pollApprove,
    processSubmittedTx,
    clearTxTrackers,
    setTxCollapsed,
    getAllLpDetails,
  };
};
