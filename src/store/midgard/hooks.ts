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

  /**
   * reload pool member details for a specific chain
   * 1. fetch pool member data for chain wallet addr (asset asymm share, symm share)
   * 2. fetch pool member data for thorchain wallet addr (rune asymm share)
   */
  const loadMemberDetailsByChain = useCallback(
    (chain: Chain) => {
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
      } else if (assetChainAddress) {
        dispatch(
          actions.reloadPoolMemberDetailByAssetChain({
            chain,
            assetChainAddress,
          }),
        );
      }
      // load pending deposit
      getPendingDepositByChain(chain);
    },
    [dispatch, wallet, getPendingDepositByChain],
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

  const getLpDetails = useCallback(
    async (chain: Chain, pool: string) => {
      const chainWalletAddr = wallet?.[chain]?.address;

      if (chainWalletAddr) {
        dispatch(actions.getLpDetails({ address: chainWalletAddr, pool: pool }));
      }
    },
    [dispatch, wallet],
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

  const { poolNamesByChain, lpAddedAndWithdraw, lpDetailLoading } = midgard;

  const getAllLpDetails = useCallback(async () => {
    if (!wallet) return;

    Object.keys(wallet).forEach((chain) => {
      if (!poolNamesByChain[chain]) return;
      poolNamesByChain[chain].forEach((poolName: string) => {
        if (lpAddedAndWithdraw[poolName] || lpDetailLoading[poolName]) {
          return;
        }

        getLpDetails(chain as Chain, poolName);
      });
    });
  }, [getLpDetails, lpAddedAndWithdraw, lpDetailLoading, poolNamesByChain, wallet]);

  const tcLastBlock: number | null = midgard?.lastBlock?.[0]?.thorchain || null;

  return {
    ...midgard,
    actions,
    getAllMemberDetails,
    getNodes,
    isGlobalHistoryLoading,
    loadMemberDetailsByChain,
    synthAssets,
    getAllLpDetails,
    tcLastBlock,
    getPoolsFromState,
  };
};
