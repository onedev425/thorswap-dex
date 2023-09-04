import { AssetEntity, Pool } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { useCallback, useMemo } from 'react';
import * as actions from 'store/midgard/actions';
import { PoolPeriodsUsedForApiCall } from 'store/midgard/types';
import { useAppDispatch, useAppSelector } from 'store/store';

export const useMidgard = () => {
  const dispatch = useAppDispatch();
  const midgard = useAppSelector(({ midgard }) => midgard);
  const wallet = useAppSelector(({ wallet }) => wallet.wallet);

  const isGlobalHistoryLoading = useMemo(
    () =>
      midgard.earningsHistoryLoading ||
      midgard.swapHistoryLoading ||
      midgard.liquidityHistoryLoading,
    [midgard],
  );

  const getPoolsFromState = useCallback(
    (period?: PoolPeriodsUsedForApiCall): Pool[] => {
      return midgard.pools[period || '30d'];
    },
    [midgard.pools],
  );

  const getPendingDepositByChain = useCallback(
    (chain: Chain) => {
      if (!wallet) return;

      const thorchainAddress = wallet?.[Chain.THORChain]?.address;
      if (thorchainAddress) {
        getPoolsFromState().forEach((pool) => {
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
    [dispatch, getPoolsFromState, wallet],
  );

  const loadFullMemberDetails = useCallback(
    async (addresses: string[]) => {
      await dispatch(actions.getFullMemberDetail(addresses));
    },
    [dispatch],
  );

  // get pool member details for a specific chain
  const getMemberDetailsByChain = useCallback(
    async (chain: Chain, chainWalletAddr?: string) => {
      if (!chainWalletAddr) return;

      await dispatch(
        actions.getPoolMemberDetailByChain({
          chain,
          address: chain === Chain.Dogecoin ? chainWalletAddr : chainWalletAddr.toLowerCase(),
        }),
      );

      // load pending deposit
      getPendingDepositByChain(chain);
    },
    [dispatch, getPendingDepositByChain],
  );

  const getNodes = useCallback(() => {
    dispatch(actions.getNodes());
  }, [dispatch]);

  const synthAssets = useMemo(
    () =>
      getPoolsFromState()
        .filter(({ detail }) => detail.status.toLowerCase() === 'available')
        .map(({ asset: { chain, symbol } }) => new AssetEntity(chain, symbol, true)),
    [getPoolsFromState],
  );

  // get pool member details for all chains
  const getAllMemberDetails = useCallback(async () => {
    if (!wallet) return;

    if (wallet?.THOR?.address) {
      await getMemberDetailsByChain(Chain.THORChain, wallet?.THOR?.address);
    }

    const otherChainsAddress = Object.keys(wallet)
      .map((chain) =>
        chain === Chain.Ethereum
          ? wallet?.[chain as Chain]?.address.toLowerCase()
          : wallet?.[chain as Chain]?.address,
      )
      .filter((address) => !!address);
    if (otherChainsAddress.length > 0) {
      loadFullMemberDetails(otherChainsAddress as string[]);
    }
  }, [getMemberDetailsByChain, loadFullMemberDetails, wallet]);

  const tcLastBlock: number | null = midgard?.lastBlock?.[0]?.thorchain || null;

  return {
    ...midgard,
    actions,
    getAllMemberDetails,
    getNodes,
    isGlobalHistoryLoading,
    synthAssets,
    tcLastBlock,
    getPoolsFromState,
  };
};
