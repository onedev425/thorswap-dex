import { MemberPool } from '@thorswap-lib/midgard-sdk';
import { Amount, AssetEntity, Pool } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { LiquidityTypeOption } from 'components/LiquidityType/types';
import { useCallback, useEffect, useMemo } from 'react';
import * as actions from 'store/midgard/actions';
import { isPendingLP } from 'store/midgard/utils';
import { useAppDispatch, useAppSelector } from 'store/store';
import { useWallet } from 'store/wallet/hooks';

type Props = {
  poolAsset: AssetEntity;
  pools: Pool[];
  pool?: Pool;
  liquidityType: LiquidityTypeOption;
};

export const useChainMember = ({ poolAsset, pools, pool, liquidityType }: Props) => {
  const { chainMemberDetailsLoading, chainMemberDetails } = useAppSelector(
    ({ midgard }) => midgard,
  );
  const { wallet } = useWallet();
  const dispatch = useAppDispatch();

  const loadMemberDetailsByChain = useCallback(
    (chain: Chain) => {
      if (!wallet) return;
      const assetChainAddress = wallet?.[chain]?.address;
      const thorchainAddress = wallet?.[Chain.THORChain]?.address;

      if (assetChainAddress && thorchainAddress) {
        dispatch(actions.getFullMemberDetail([thorchainAddress, assetChainAddress]));
      }
    },
    [dispatch, wallet],
  );

  useEffect(() => {
    if (!poolAsset) return;

    if (wallet && poolAsset) {
      loadMemberDetailsByChain(poolAsset?.chain as Chain);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, poolAsset]);

  const isMemberLoading = useMemo(() => {
    if (!wallet || !poolAsset) return false;

    if (poolAsset) {
      return chainMemberDetailsLoading?.[poolAsset?.chain] === true;
    }

    return false;
  }, [wallet, chainMemberDetailsLoading, poolAsset]);

  const chainMemberData = useMemo(() => {
    if (pool && pools.length && poolAsset && !isMemberLoading) {
      return chainMemberDetails?.[poolAsset.chain];
    }
    return null;
  }, [chainMemberDetails, poolAsset, pool, pools, isMemberLoading]);

  const memberData = useMemo(() => {
    if (pool && pools.length && poolAsset && !isMemberLoading) {
      return chainMemberData?.[pool.asset.toString()];
    }
    return null;
  }, [chainMemberData, poolAsset, pool, pools, isMemberLoading]);

  const currentAssetHaveLP: boolean = useMemo(
    () => Object.keys(chainMemberDetails).includes(poolAsset.symbol),
    [chainMemberDetails, poolAsset],
  );

  const poolMemberDetail: MemberPool = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.SYMMETRICAL) {
      if (memberData?.pending) return memberData.pending as MemberPool;
      return memberData?.sym as MemberPool;
    }
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return memberData?.runeAsym as MemberPool;
    }

    return memberData?.assetAsym as MemberPool;
  }, [memberData, liquidityType]);

  const isPendingDeposit = useMemo(
    () =>
      liquidityType === LiquidityTypeOption.SYMMETRICAL &&
      poolMemberDetail &&
      isPendingLP(poolMemberDetail),
    [liquidityType, poolMemberDetail],
  );

  const isAssetPending: boolean = useMemo(() => {
    return isPendingDeposit && Amount.fromMidgard(poolMemberDetail?.assetPending ?? 0).gt(0);
  }, [isPendingDeposit, poolMemberDetail]);

  const isRunePending: boolean = useMemo(() => {
    return isPendingDeposit && Amount.fromMidgard(poolMemberDetail?.runePending ?? 0).gt(0);
  }, [isPendingDeposit, poolMemberDetail]);

  return {
    isMemberLoading,
    chainMemberData,
    memberData,
    currentAssetHaveLP,
    poolMemberDetail,
    isPendingDeposit,
    isAssetPending,
    isRunePending,
  };
};
