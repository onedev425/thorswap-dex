import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MemberPool } from '@thorswap-lib/midgard-sdk';
import { equalObjects, Pool } from '@thorswap-lib/multichain-core';
import { Chain, SupportedChain } from '@thorswap-lib/types';
import {
  checkPendingLP,
  getAddedAndWithdrawn,
  getChainMemberDetails,
  mergePendingLP,
  removePendingLP,
} from 'store/midgard/utils';

import * as midgardActions from './actions';
import { State } from './types';

const initialState: State = {
  pools: [],
  poolLoading: false,
  memberDetails: {
    pools: [],
  },
  chainMemberDetails: {},
  chainMemberDetailsLoading: {},
  stats: null,
  networkData: null,
  constants: null,
  queue: null,
  poolStats: null,
  poolStatsLoading: false,
  depthHistory: null,
  depthHistoryLoading: false,
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
  mimir: {},
  volume24h: null,
  inboundGasRate: {},
  inboundHalted: {},
  inboundAddresses: {},
  lastBlock: [],
  nodes: [],
  nodeLoading: false,
  approveStatus: {},
  pendingLP: {},
  pendingLPLoading: false,
  lpAddedAndWithdraw: {},
  poolNamesByChain: {},
  lpDetailLoading: {},
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
      // TODO: fix this
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
      .addCase(midgardActions.getPools.fulfilled, (state, { payload }) => {
        if (state.pools.length) {
          state.pools.forEach((pool) => {
            const updatedPool = payload.find(({ asset }) => asset === pool.detail.asset);

            pool.detail.poolAPY =
              pool.detail.poolAPY === '0' && updatedPool
                ? updatedPool.poolAPY
                : pool.detail.poolAPY;
          });
        } else {
          state.pools = payload.map(Pool.fromPoolData).filter(Boolean) as Pool[];
        }

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
      .addCase(midgardActions.getLpDetails.pending, (state, { meta }) => {
        const { pool } = meta.arg;

        state.lpDetailLoading = {
          ...state.lpDetailLoading,
          [pool]: true,
        };
      })
      .addCase(midgardActions.getLpDetails.fulfilled, (state, { meta, payload }) => {
        const { pool } = meta.arg;

        const addedAndWithdrawn = getAddedAndWithdrawn(payload);

        state.lpAddedAndWithdraw = {
          ...state.lpAddedAndWithdraw,
          ...addedAndWithdrawn,
        };
        state.lpDetailLoading = {
          ...state.lpDetailLoading,
          [pool]: false,
        };
      })
      .addCase(midgardActions.getLpDetails.rejected, (state, { meta }) => {
        const { pool } = meta.arg;
        state.lpAddedAndWithdraw = {
          ...state.lpAddedAndWithdraw,
          [pool]: {
            added: { rune: '0', asset: '0' },
            withdrawn: { rune: '0', asset: '0' },
          },
        };
        state.lpDetailLoading = {
          ...state.lpDetailLoading,
          [pool]: false,
        };
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
          chain,
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
          const { chain } = meta.arg;
          const { pools: runeMemberDetails } = runeMemberData;
          const { pools: assetMemberDetails } = assetMemberData;

          // add rune asymm
          const fetchedChainMemberDetails1 = getChainMemberDetails({
            chain: Chain.THORChain,
            memPools: runeMemberDetails,
            chainMemberDetails: state.chainMemberDetails,
          });

          // add sym, asset asymm
          const fetchedChainMemberDetails2 = getChainMemberDetails({
            chain,
            memPools: assetMemberDetails,
            chainMemberDetails: fetchedChainMemberDetails1,
          });

          state.chainMemberDetails = fetchedChainMemberDetails2;

          state.chainMemberDetailsLoading = {
            ...state.chainMemberDetailsLoading,
            [chain]: false,
          };
        },
      )
      .addCase(midgardActions.reloadPoolMemberDetailByChain.rejected, (state, { meta }) => {
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
      .addCase(midgardActions.getStats.fulfilled, (state, { payload }) => {
        state.stats = payload;
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
      .addCase(midgardActions.getThorchainInboundData.fulfilled, (state, { payload }) => {
        const { gasRateByChain, haltedByChain, poolAddressByChain } = payload.reduce(
          (acc, { chain, halted, gas_rate, address }) => {
            if (chain) {
              acc.gasRateByChain[chain as SupportedChain] = gas_rate;
              acc.haltedByChain[chain as SupportedChain] = halted;
              acc.poolAddressByChain[chain as SupportedChain] = address;
            }

            return acc;
          },
          {
            gasRateByChain: {} as { [key in SupportedChain]?: string },
            haltedByChain: {} as { [key in SupportedChain]?: boolean },
            poolAddressByChain: {} as { [key in SupportedChain]?: string },
          },
        );

        if (!equalObjects(gasRateByChain, state.inboundGasRate)) {
          state.inboundGasRate = gasRateByChain;
        }
        if (!equalObjects(haltedByChain, state.inboundHalted)) {
          state.inboundHalted = haltedByChain;
        }
        if (!equalObjects(poolAddressByChain, state.inboundAddresses)) {
          state.inboundAddresses = poolAddressByChain;
        }
      })
      // get thorchain mimir
      .addCase(midgardActions.getMimir.pending, (state) => {
        state.mimirLoading = true;
      })
      .addCase(midgardActions.getMimir.fulfilled, (state, action) => {
        state.mimirLoading = false;
        state.mimir = action.payload;
      })
      .addCase(midgardActions.getMimir.rejected, (state) => {
        state.mimirLoading = true;
      });
  },
});

export const { actions } = midgardSlice;

export default midgardSlice.reducer;
