import { Asset } from '@thorswap-lib/multichain-sdk'

export enum ROUTES {
  Home = '/dashboard',
  ManageLiquidity = '/liquidity',
  NodeDetail = '/nodes/:nodeAddress',
  NodeManager = '/node-manager',
  Nodes = '/nodes',
  PendingLiquidity = '/pending',
  Send = '/send',
  SendAsset = '/send/:assetParam',
  Stake = '/stake',
  Stats = '/stats',
  Swap = '/swap',
  SwapPair = '/swap/:pair',
  AddLiquidity = '/add',
  AddLiquidityPool = '/add/:assetParam',
  WithdrawLiquidity = '/withdraw',
  WithdrawLiquidityPool = '/withdraw/:assetParam',
  UpgradeRune = '/upgrade',
  Vesting = '/vesting',
  Wallet = '/wallet',
}

export const getAddLiquidityRoute = (asset: Asset) => {
  return `${ROUTES.AddLiquidity}/${asset.toURLEncoded()}`
}

export const getWithdrawRoute = (asset: Asset) => {
  return `${ROUTES.WithdrawLiquidity}/${asset.toURLEncoded()}`
}

export const getSendRoute = (asset: Asset) => {
  return `${ROUTES.Send}/${asset.toURLEncoded()}`
}

export const getSwapRoute = (input: Asset, output: Asset) => {
  return `${ROUTES.Swap}/${input.toURLEncoded()}_${output.toURLEncoded()}`
}

export const getPoolDetailRouteFromAsset = (asset: Asset) => {
  return `https://app.thoryield.com/token/${asset.toURLEncoded()}`
}

export const getNodeDetailRoute = (address: string) => {
  return `${ROUTES.Nodes}/${address}`
}
