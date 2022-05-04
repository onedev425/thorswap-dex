import { Asset } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

export enum ROUTES {
  AddLiquidity = '/add',
  AddLiquidityPool = '/add/:assetParam',
  CreateLiquidity = '/create',
  Home = '/dashboard',
  ManageLiquidity = '/liquidity',
  NodeDetail = '/nodes/:nodeAddress',
  NodeManager = '/node-manager',
  Nodes = '/nodes',
  Send = '/send',
  SendAsset = '/send/:assetParam',
  Stake = '/stake',
  StakeV2 = '/vthor',
  Stats = '/stats',
  Swap = '/swap',
  SwapPair = '/swap/:pair',
  Thorname = '/thorname',
  UpgradeRune = '/upgrade',
  Vesting = '/vesting',
  Wallet = '/wallet',
  WithdrawLiquidity = '/withdraw',
  WithdrawLiquidityPool = '/withdraw/:assetParam',
}

export const THORYIELD_ROUTE = 'https://app.thoryield.com'
export const THORYIELD_STATS_ROUTE = 'https://app.thoryield.com/stats'
export const THOR_STAKING_V1_ROUTE = 'https://v1.thorswap.finance/stake'

export const getAddLiquidityRoute = (asset?: Asset) => {
  return `${ROUTES.AddLiquidity}${asset ? `/${asset.toURLEncoded()}` : ''}`
}

export const getWithdrawRoute = (asset?: Asset) => {
  return `${ROUTES.WithdrawLiquidity}${asset ? `/${asset.toURLEncoded()}` : ''}`
}

export const getSendRoute = (asset?: Asset) => {
  return `${ROUTES.Send}${asset ? `/${asset.toURLEncoded()}` : ''}`
}

export const getSwapRoute = (input: Asset, output: Asset = Asset.RUNE()) => {
  const outputAsset = input.isRUNE() && output.isRUNE() ? Asset.BTC() : output

  return `${ROUTES.Swap}/${input.toURLEncoded()}_${outputAsset.toURLEncoded()}`
}

export const getPoolDetailRouteFromAsset = (asset: Asset) => {
  return `${THORYIELD_ROUTE}/token/${asset.toURLEncoded()}`
}

export const getNodeDetailRoute = (address: string) => {
  return `${ROUTES.Nodes}/${address}`
}

export const navigateToExternalLink = (url: string) => {
  window.open(url, '_blank noreferrer noopener')
}

export const getThorYieldInfoRoute = ({
  chain,
  address,
}: {
  chain: Chain
  address: string
}) => `${THORYIELD_ROUTE}/accounts?${chain.toLowerCase()}=${address}`
