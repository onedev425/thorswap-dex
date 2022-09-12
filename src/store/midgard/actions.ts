import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActionTypeEnum, PoolPeriods } from '@thorswap-lib/midgard-sdk';
import { Asset } from '@thorswap-lib/multichain-core';
import { SupportedChain } from '@thorswap-lib/types';
import { midgardApi } from 'services/midgard';
import { multichain } from 'services/multichain';
import { getLiquidityProvider, getThorchainMimir } from 'services/thornode';

import { AggregatorSwapType, TxTracker } from './types';

export const getPools = createAsyncThunk('midgard/getPools', async (period?: PoolPeriods) =>
  midgardApi.getPools(undefined, period),
);

export const getPoolStats = createAsyncThunk('midgard/getPoolStats', midgardApi.getPoolStats);

export const getNetworkData = createAsyncThunk('midgard/getNetworkData', midgardApi.getNetworkData);

export const getLastblock = createAsyncThunk('midgard/getLastblock', midgardApi.getLastblock);

export const getStats = createAsyncThunk('midgard/getStats', midgardApi.getStats);

export const getConstants = createAsyncThunk('midgard/getConstants', midgardApi.getConstants);

export const getQueue = createAsyncThunk('midgard/getQueue', midgardApi.getQueue);

export const getActions = createAsyncThunk('midgard/getActions', midgardApi.getActions);

export const getTVLHistory = createAsyncThunk('midgard/getTVLHistory', midgardApi.getTVLHistory);

export const getSwapHistory = createAsyncThunk('midgard/getSwapHistory', midgardApi.getSwapHistory);

export const getLiquidityHistory = createAsyncThunk(
  'midgard/getLiquidityHistory',
  midgardApi.getLiquidityHistory,
);

export const getEarningsHistory = createAsyncThunk(
  'midgard/getEarningsHistory',
  midgardApi.getEarningsHistory,
);

export const getDepthHistory = createAsyncThunk(
  'midgard/getDepthHistory',
  midgardApi.getDepthHistory,
);

export const getMimir = createAsyncThunk('thorchain/getThorchainMimir', async () => {
  const { data } = await getThorchainMimir();

  return data;
});

// Node
export const getNodes = createAsyncThunk('midgard/getNodes', midgardApi.getNodes);

// NOTE: pass chain and address to param
export const getPoolMemberDetailByChain = createAsyncThunk(
  'midgard/getPoolMemberDetailByChain',
  async ({ address }: { chain: ToDo; address: string }) => {
    const response = await midgardApi.getMemberDetail(address);

    return response;
  },
);

export const getLpDetails = createAsyncThunk(
  'midgard/getLpDetails',
  async ({ address, pool }: { address: string; pool: string }) => {
    const response = await midgardApi.getLpDetails(address, pool);
    return response;
  },
);
// get 24h volume
export const getVolume24h = createAsyncThunk('midgard/getVolume24h', async () => {
  const { intervals: swapIntervals } = await midgardApi.getSwapHistory({
    query: { interval: 'day', count: 2 },
  });

  const { intervals: liquidityIntervals } = await midgardApi.getLiquidityHistory({
    query: { interval: 'day', count: 2 },
  });

  // swap + add + withdraw
  const volume24h =
    Number(swapIntervals[0].totalVolume) +
    Number(liquidityIntervals[0].addLiquidityVolume) +
    Number(liquidityIntervals[0].withdrawVolume);

  return volume24h;
});

export const getThorchainInboundData = createAsyncThunk(
  'midgard/getInboundAddresses',
  midgardApi.getInboundAddresses,
);

// NOTE: pass chain, thorchain address, chain wallet address for wallet
export const reloadPoolMemberDetailByChain = createAsyncThunk(
  'midgard/reloadPoolMemberDetailByChain',
  async ({
    thorchainAddress,
    assetChainAddress,
  }: {
    chain: SupportedChain;
    thorchainAddress: string;
    assetChainAddress: string;
  }) => {
    const runeMemberData = await midgardApi.getMemberDetail(thorchainAddress);
    const assetMemberData = await midgardApi.getMemberDetail(assetChainAddress);

    return { runeMemberData, assetMemberData };
  },
);

export const pollUpgradeTx = createAsyncThunk(
  'midgard/pollUpgradeTx',
  async (txTracker: TxTracker) => {
    const {
      submitTx: { recipient },
    } = txTracker;

    if (recipient) {
      const response = await midgardApi.getActions({
        limit: 1,
        offset: 0,
        address: recipient,
        type: ActionTypeEnum.Switch,
      });
      return response;
    }

    throw Error('no recipient');
  },
);

export const pollTx = createAsyncThunk(
  'midgard/pollTx',
  async ({ submitTx: { txID } }: TxTracker) => {
    if (txID) {
      // @ts-expect-error TOOD: fix midgard types
      const response = await midgardApi.getActions({
        txId: txID.includes('0x') ? txID.slice(2) : txID,
      });
      return response;
    }
  },
);

export const pollApprove = createAsyncThunk(
  'midgard/pollApprove',
  async ({ submitTx: { inAssets, aggType, contractAddress } }: TxTracker) => {
    const assetString = inAssets?.[0]?.asset;

    if (!assetString) throw Error('invalid asset string');

    const asset = Asset.fromAssetString(assetString);

    if (!asset) throw Error('invalid asset');

    const approved = await (aggType === AggregatorSwapType.SwapIn && contractAddress
      ? multichain().isAssetApprovedForContract(asset, contractAddress)
      : multichain().isAssetApproved(asset));

    return { asset, approved };
  },
);

// get liquidity provider
export const getLiquidityProviderData = createAsyncThunk(
  'thornode/getLiquidityProvider',
  async ({ address, asset }: { asset: string; address: string }) => {
    const { data } = await getLiquidityProvider({ asset, address });

    return data;
  },
);
