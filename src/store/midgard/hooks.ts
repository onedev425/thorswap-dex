import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { useCallback, useMemo } from 'react';
import * as actions from 'store/midgard/actions';
import { useAppDispatch, useAppSelector } from 'store/store';

export const useMidgard = () => {
  const dispatch = useAppDispatch();
  const { midgardState, wallet } = useAppSelector(({ midgard, wallet }) => ({
    midgardState: midgard,
    wallet: wallet.wallet,
  }));

  const isGlobalHistoryLoading = useMemo(
    () =>
      midgardState.earningsHistoryLoading ||
      midgardState.swapHistoryLoading ||
      midgardState.liquidityHistoryLoading,
    [midgardState],
  );

  const getPendingDepositByChain = useCallback(
    (chain: Chain) => {
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

        // load pending deposit
        getPendingDepositByChain(chain);
      }
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
          address: chain === Chain.Doge ? chainWalletAddr : chainWalletAddr.toLowerCase(),
        }),
      );

      // load pending deposit
      getPendingDepositByChain(chain);
    },
    [dispatch, getPendingDepositByChain],
  );

  const getInboundData = useCallback(() => {
    dispatch(actions.getThorchainInboundData());
  }, [dispatch]);

  const getNodes = useCallback(() => {
    dispatch(actions.getNodes());
  }, [dispatch]);

  const synthAssets = useMemo(
    () =>
      midgardState.pools
        .filter(({ detail }) => detail.status.toLowerCase() === 'available')
        .map(({ asset: { chain, symbol } }) => new AssetEntity(chain, symbol, true)),
    [midgardState.pools],
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

    if (import.meta.env.VITE_USING_FALLBACK_MIDGARD === 'true') {
      Object.keys(wallet).forEach((chain) => {
        getMemberDetailsByChain(chain as Chain, wallet?.[chain as Chain]?.address);
      });
    } else {
      const thorchainAddress = wallet?.[Chain.THORChain]?.address;

      if (thorchainAddress) {
        getMemberDetailsByChain(Chain.THORChain, thorchainAddress);
      }
      const otherChainsAddress = Object.keys(wallet)
        .filter((chain) => chain !== Chain.THORChain)
        .map((chain) =>
          chain === Chain.Ethereum
            ? wallet?.[chain as Chain]?.address.toLowerCase()
            : wallet?.[chain as Chain]?.address,
        )
        .filter((address) => !!address);
      if (otherChainsAddress.length > 0) {
        loadFullMemberDetails(otherChainsAddress as string[]);
      }
    }
  }, [getMemberDetailsByChain, loadFullMemberDetails, wallet]);

  const { poolNamesByChain, lpAddedAndWithdraw, lpDetailLoading } = midgardState;

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

  return {
    ...midgardState,
    actions,
    getAllMemberDetails,
    getInboundData,
    getNodes,
    isGlobalHistoryLoading,
    loadMemberDetailsByChain,
    synthAssets,
    getAllLpDetails,
  };
};
