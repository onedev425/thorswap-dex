import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { FullMemberPool, MemberPool } from '@thorswap-lib/midgard-sdk';
import { AssetEntity, Pool } from '@thorswap-lib/swapkit-core';
import {
  checkPendingLP,
  getChainMemberDetails,
  mergePendingLP,
  removePendingLP,
} from 'store/midgard/utils';

import * as midgardActions from './actions';
import { MimirData, PoolPeriodsUsedForApiCall, State } from './types';

const initialState: State = {
  pools: {
    '7d': [],
    '30d': [],
  },
  poolLoading: false,
  chainMemberDetails: {},
  chainMemberDetailsLoading: {},
  networkData: null,
  queue: null,
  poolStats: null,
  poolStatsLoading: false,
  earningsHistory: null,
  earningsHistoryLoading: false,
  tvlHistory: null,
  tvlHistoryLoading: false,
  swapHistory: null,
  swapGlobalHistory: null,
  swapHistoryLoading: false,
  liquidityHistory: null,
  liquidityGlobalHistory: null,
  liquidityHistoryLoading: false,
  mimirLoading: false,
  mimirLoaded: false,
  mimir: {} as MimirData,
  volume24h: null,
  lastBlock: [],
  nodes: [],
  nodeLoading: false,
  approveStatus: {},
  pendingLP: {},
  pendingLPLoading: false,
  poolNamesByChain: {},
};

const midgardSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetChainMemberDetails(state) {
      state.chainMemberDetails = {};
      state.chainMemberDetailsLoading = {};
    },
    resetChainMemberDetail(state, { payload }: PayloadAction<string>) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.chainMemberDetails[payload];
      state.chainMemberDetailsLoading[payload] = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(midgardActions.getPools.pending, (state) => {
        state.poolLoading = true;
      })
      .addCase(midgardActions.getPools.fulfilled, (state, { payload, meta }) => {
        const period = meta.arg as PoolPeriodsUsedForApiCall;
        state.pools[period] = payload
          .map((pool) => ({
            ...pool,
            apyPeriod: period,
          }))
          // @ts-expect-error
          .map(Pool.fromPoolData)
          .filter(Boolean) as Pool[];

        state.poolLoading = false;
      })
      .addCase(midgardActions.getPools.rejected, (state) => {
        state.poolLoading = false;
      })
      .addCase(midgardActions.getNodes.pending, (state) => {
        state.nodeLoading = true;
      })
      .addCase(midgardActions.getNodes.fulfilled, (state, { payload }) => {
        state.nodes = payload;
        state.nodeLoading = false;
      })
      .addCase(midgardActions.getNodes.rejected, (state) => {
        state.nodeLoading = false;
      })
      // used for getting all pool share data
      .addCase(midgardActions.getPoolMemberDetailByChain.pending, (state, { meta }) => {
        const { chain } = meta.arg;

        state.chainMemberDetailsLoading = {
          ...state.chainMemberDetailsLoading,
          [chain]: true,
        };
      })
      /**
       * NOTE: need to fetch pool member data for both chain address and thorchain address
       * get sym, assetAsym share from the MemberPool Data with non-thorchain address
       * get runeAsym share from the MemberPool Data with thorchain address
       */
      .addCase(midgardActions.getPoolMemberDetailByChain.fulfilled, (state, { meta, payload }) => {
        const {
          arg: { chain },
        } = meta;

        const fetchedChainMemberDetails = getChainMemberDetails({
          memPools: payload.pools,
          chainMemberDetails: state.chainMemberDetails,
        });

        state.chainMemberDetails = fetchedChainMemberDetails;

        const previousPoolNamesByChain = state.poolNamesByChain[chain]
          ? state.poolNamesByChain[chain]
          : [];
        const poolNamesByChain = [
          ...previousPoolNamesByChain,
          ...payload.pools
            .map((pool: MemberPool) => pool.pool)
            .filter((elem: string) => !previousPoolNamesByChain.includes(elem)),
        ];

        state.poolNamesByChain[chain] = poolNamesByChain;
        state.chainMemberDetailsLoading = {
          ...state.chainMemberDetailsLoading,
          [chain]: false,
        };
      })
      .addCase(midgardActions.getPoolMemberDetailByChain.rejected, (state, { meta }) => {
        const { chain } = meta.arg;

        state.chainMemberDetailsLoading = {
          ...state.chainMemberDetailsLoading,
          [chain]: false,
        };
      })
      .addCase(midgardActions.getFullMemberDetail.fulfilled, (state, { payload }) => {
        if (!payload) return;

        const memberPools: MemberPool[] = payload.map((elem: FullMemberPool) => ({
          ...elem,
          liquidityUnits: elem.sharedUnits.toString(),
        }));
        const fetchedChainMemberDetails = getChainMemberDetails({
          memPools: memberPools,
          chainMemberDetails: state.chainMemberDetails,
        });

        memberPools.forEach((memPool) => {
          const asset = AssetEntity.fromAssetString(memPool.pool);
          if (!asset) return;
          const { chain } = asset;

          state.chainMemberDetails = fetchedChainMemberDetails;
          const previousPoolNamesByChain = state.poolNamesByChain[chain]
            ? state.poolNamesByChain[chain]
            : [];

          const poolAsArray = [memPool];

          const poolNamesByChain = [
            ...previousPoolNamesByChain,
            ...poolAsArray
              .map((pool: MemberPool) => pool.pool)
              .filter((elem: string) => !previousPoolNamesByChain.includes(elem)),
          ];

          state.poolNamesByChain[chain] = poolNamesByChain;
        });
      })
      // used for getting pool share for a specific chain
      .addCase(midgardActions.reloadPoolMemberDetailByChain.pending, (state, { meta }) => {
        const { chain } = meta.arg;

        state.chainMemberDetailsLoading = {
          ...state.chainMemberDetailsLoading,
          [chain]: true,
        };
      })
      /**
       * NOTE: need to fetch pool member data for both chain address and thorchain address
       * get sym, assetAsym share from the MemberPool Data with non-thorchain address
       * get runeAsym share from the MemberPool Data with thorchain address
       */
      .addCase(
        midgardActions.reloadPoolMemberDetailByChain.fulfilled,
        (state, { meta, payload: { runeMemberData, assetMemberData } }) => {
          const { pools: runeMemberDetails } = runeMemberData;
          const { pools: assetMemberDetails } = assetMemberData;

          // add rune asymm
          const fetchedChainMemberDetails1 = getChainMemberDetails({
            memPools: runeMemberDetails,
            chainMemberDetails: state.chainMemberDetails,
          });

          // add sym, asset asymm
          const fetchedChainMemberDetails2 = getChainMemberDetails({
            memPools: assetMemberDetails,
            chainMemberDetails: fetchedChainMemberDetails1,
          });

          state.chainMemberDetails = fetchedChainMemberDetails2;

          state.chainMemberDetailsLoading = {
            ...state.chainMemberDetailsLoading,
            [meta.arg.chain]: false,
          };
        },
      )
      .addCase(midgardActions.reloadPoolMemberDetailByChain.rejected, (state, { meta }) => {
        state.chainMemberDetailsLoading = {
          ...state.chainMemberDetailsLoading,
          [meta.arg.chain]: false,
        };
      })
      .addCase(midgardActions.reloadPoolMemberDetailByAssetChain.pending, (state, { meta }) => {
        state.chainMemberDetailsLoading = {
          ...state.chainMemberDetailsLoading,
          [meta.arg.chain]: true,
        };
      })
      .addCase(
        midgardActions.reloadPoolMemberDetailByAssetChain.fulfilled,
        (state, { meta, payload: { assetMemberData } }) => {
          const { pools: assetMemberDetails } = assetMemberData;

          // add sym, asset asymm
          const fetchedChainMemberDetails2 = getChainMemberDetails({
            memPools: assetMemberDetails,
            chainMemberDetails: state.chainMemberDetails,
          });

          state.chainMemberDetails = fetchedChainMemberDetails2;

          state.chainMemberDetailsLoading = {
            ...state.chainMemberDetailsLoading,
            [meta.arg.chain]: false,
          };
        },
      )
      .addCase(midgardActions.reloadPoolMemberDetailByAssetChain.rejected, (state, { meta }) => {
        const { chain } = meta.arg;

        state.chainMemberDetailsLoading = {
          ...state.chainMemberDetailsLoading,
          [chain]: false,
        };
      })
      // get pending LP
      .addCase(midgardActions.getLiquidityProviderData.pending, (state) => {
        state.pendingLPLoading = true;
      })
      .addCase(midgardActions.getLiquidityProviderData.fulfilled, (state, { meta, payload }) => {
        const { asset } = meta.arg;

        if (checkPendingLP(payload)) {
          state.pendingLP = {
            [asset]: payload,
            ...state.pendingLP,
          };

          // merge pending LP to liquidity data
          const chainMemberDetails = mergePendingLP({
            pendingLP: payload,
            chainMemberDetails: state.chainMemberDetails,
          });

          // update with merged member details
          state.chainMemberDetails = chainMemberDetails;
        } else {
          delete state.pendingLP?.[asset];

          // merge pending LP to liquidity data
          const chainMemberDetails = removePendingLP({
            asset,
            chainMemberDetails: state.chainMemberDetails,
          });

          // update with merged member details
          state.chainMemberDetails = chainMemberDetails;
        }
        state.pendingLPLoading = false;
      })
      .addCase(midgardActions.getLiquidityProviderData.rejected, (state) => {
        state.pendingLPLoading = false;
      })
      .addCase(midgardActions.getNetworkData.fulfilled, (state, { payload }) => {
        state.networkData = payload;
      })
      .addCase(midgardActions.getLastblock.fulfilled, (state, { payload }) => {
        state.lastBlock = payload;
      })
      .addCase(midgardActions.getQueue.fulfilled, (state, { payload }) => {
        state.queue = payload;
      })
      // get earnings history
      .addCase(midgardActions.getEarningsHistory.pending, (state) => {
        state.earningsHistoryLoading = true;
      })
      .addCase(midgardActions.getEarningsHistory.fulfilled, (state, { payload }) => {
        state.earningsHistoryLoading = false;
        state.earningsHistory = payload;
      })
      .addCase(midgardActions.getEarningsHistory.rejected, (state) => {
        state.earningsHistoryLoading = true;
      })
      // get tvl history
      .addCase(midgardActions.getTVLHistory.pending, (state) => {
        state.tvlHistoryLoading = true;
      })
      .addCase(midgardActions.getTVLHistory.fulfilled, (state, { payload }) => {
        state.tvlHistoryLoading = false;
        state.tvlHistory = payload;
      })
      .addCase(midgardActions.getTVLHistory.rejected, (state) => {
        state.tvlHistoryLoading = true;
      })
      // get swap history
      .addCase(midgardActions.getSwapHistory.pending, (state) => {
        state.swapHistoryLoading = true;
      })
      .addCase(midgardActions.getSwapHistory.fulfilled, (state, { meta, payload }) => {
        state.swapHistoryLoading = false;

        if (meta.arg.pool) {
          state.swapHistory = payload;
        } else {
          state.swapGlobalHistory = payload;
        }
      })
      .addCase(midgardActions.getSwapHistory.rejected, (state) => {
        state.swapHistoryLoading = true;
      })
      // get liquidity history
      .addCase(midgardActions.getLiquidityHistory.pending, (state) => {
        state.liquidityHistoryLoading = true;
      })
      .addCase(midgardActions.getLiquidityHistory.fulfilled, (state, { meta, payload }) => {
        state.liquidityHistoryLoading = false;

        if (meta.arg.pool) {
          state.liquidityHistory = payload;
        } else {
          state.liquidityGlobalHistory = payload;
        }
      })
      .addCase(midgardActions.getLiquidityHistory.rejected, (state) => {
        state.liquidityHistoryLoading = true;
      })
      // get tx
      .addCase(midgardActions.getVolume24h.fulfilled, (state, { payload }) => {
        state.volume24h = payload;
      })
      // get thorchain mimir
      .addCase(midgardActions.getMimir.pending, (state) => {
        state.mimirLoading = true;
      })
      .addCase(midgardActions.getMimir.fulfilled, (state, action) => {
        state.mimirLoading = false;
        state.mimirLoaded = true;
        state.mimir = action.payload;
      })
      .addCase(midgardActions.getMimir.rejected, (state) => {
        state.mimirLoading = true;
      });
  },
});

export const { actions } = midgardSlice;

export default midgardSlice.reducer;
