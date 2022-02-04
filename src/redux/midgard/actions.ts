import { createAsyncThunk } from '@reduxjs/toolkit'

import { midgardApi } from 'services/midgard'

export const getPools = createAsyncThunk(
  'midgard/getPools',
  midgardApi.getPools,
)

export const getPoolStats = createAsyncThunk(
  'midgard/getPoolStats',
  midgardApi.getPoolStats,
)

export const getNetworkData = createAsyncThunk(
  'midgard/getNetworkData',
  midgardApi.getNetworkData,
)

export const getLastblock = createAsyncThunk(
  'midgard/getLastblock',
  midgardApi.getLastblock,
)

export const getStats = createAsyncThunk(
  'midgard/getStats',
  midgardApi.getStats,
)

export const getConstants = createAsyncThunk(
  'midgard/getConstants',
  midgardApi.getConstants,
)

export const getQueue = createAsyncThunk(
  'midgard/getQueue',
  midgardApi.getQueue,
)

export const getActions = createAsyncThunk(
  'midgard/getActions',
  midgardApi.getActions,
)

export const getTVLHistory = createAsyncThunk(
  'midgard/getTVLHistory',
  midgardApi.getTVLHistory,
)

export const getSwapHistory = createAsyncThunk(
  'midgard/getSwapHistory',
  midgardApi.getSwapHistory,
)

export const getLiquidityHistory = createAsyncThunk(
  'midgard/getLiquidityHistory',
  midgardApi.getLiquidityHistory,
)

export const getEarningsHistory = createAsyncThunk(
  'midgard/getEarningsHistory',
  midgardApi.getEarningsHistory,
)

export const getDepthHistory = createAsyncThunk(
  'midgard/getDepthHistory',
  midgardApi.getDepthHistory,
)

export const getMemberDetail = createAsyncThunk(
  'midgard/getMemberDetail',
  midgardApi.getMemberDetail,
)

// Node
export const getNodes = createAsyncThunk(
  'midgard/getNodes',
  midgardApi.getNodes,
)

// NOTE: pass chain and address to param
export const getPoolMemberDetailByChain = createAsyncThunk(
  'midgard/getPoolMemberDetailByChain',
  async ({ address }: { chain: ToDo; address: string }) => {
    const response = await midgardApi.getMemberDetail(address)

    return response
  },
)

// NOTE: pass chain, thorchain address, chain wallet address for wallet
export const reloadPoolMemberDetailByChain = createAsyncThunk(
  'midgard/reloadPoolMemberDetailByChain',
  async ({
    thorchainAddress,
    assetChainAddress,
  }: {
    chain: ToDo
    thorchainAddress: string
    assetChainAddress: string
  }) => {
    const runeMemberData = await midgardApi.getMemberDetail(thorchainAddress)
    const assetMemberData = await midgardApi.getMemberDetail(assetChainAddress)

    return {
      runeMemberData,
      assetMemberData,
    }
  },
)

// get 24h volume
export const getVolume24h = createAsyncThunk(
  'midgard/getVolume24h',
  async () => {
    const { intervals: swapIntervals } = await midgardApi.getSwapHistory({
      query: { interval: 'day', count: 2 },
    })

    const { intervals: liquidityIntervals } =
      await midgardApi.getLiquidityHistory({
        query: { interval: 'day', count: 2 },
      })

    // swap + add + withdraw
    const volume24h =
      Number(swapIntervals[0].totalVolume) +
      Number(liquidityIntervals[0].addLiquidityVolume) +
      Number(liquidityIntervals[0].withdrawVolume)

    return volume24h
  },
)

export const getThorchainInboundData = createAsyncThunk(
  'midgard/getInboundAddresses',
  midgardApi.getInboundAddresses,
)
