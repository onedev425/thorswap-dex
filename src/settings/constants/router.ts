import { Asset } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

export enum ROUTES {
  AddLiquidity = '/add',
  AddLiquidityPool = '/add/:assetParam',
  CreateLiquidity = '/create',
  Home = '/dashboard',
  Liquidity = '/liquidity',
  NodeDetail = '/nodes/:nodeAddress',
  NodeManager = '/node-manager',
  Nodes = '/nodes',
  Send = '/send',
  SendAsset = '/send/:assetParam',
  LegacyStake = '/legacy_stake',
  Stake = '/stake',
  Stats = '/stats',
  Swap = '/swap',
  SwapPair = '/swap/:pair',
  Thorname = '/thorname',
  UpgradeRune = '/upgrade',
  Vesting = '/vesting',
  Wallet = '/wallet',
  WithdrawLiquidity = '/withdraw',
  WithdrawLiquidityPool = '/withdraw/:assetParam',
  Multisig = '/thorsafe',
  MultisigConnect = '/thorsafe/connect',
  MultisigCreate = '/thorsafe/create',
  TxBuilder = '/txbuilder',
  TxCreate = '/txcreate',
  TxCreatePool = '/txcreate/:assetParam',
  TxImport = '/tximport',
  TxMultisig = '/txthorsafe',
}

export const THORYIELD_ROUTE = 'https://app.thoryield.com'
export const THORYIELD_LP_PATH = 'accounts' //TODO: change value to 'lp' when THORYield will be ready
export const THORYIELD_STATS_ROUTE = 'https://app.thoryield.com/stats'
export const THOR_STAKING_V1_ROUTE = 'https://v1.thorswap.finance/stake'

const getAssetRoute = (route: ROUTES, asset?: Asset) =>
  `${route}${asset ? `/${asset.toURLEncoded()}` : ''}`

export const getAddLiquidityRoute = (asset?: Asset) => {
  return getAssetRoute(ROUTES.AddLiquidity, asset)
}

export const getWithdrawRoute = (asset?: Asset) => {
  return getAssetRoute(ROUTES.WithdrawLiquidity, asset)
}

export const getSendRoute = (asset?: Asset) => {
  return getAssetRoute(ROUTES.Send, asset)
}

export const getMultisigTxCreateRoute = (asset?: Asset) => {
  return getAssetRoute(ROUTES.TxCreate, asset)
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

export const getThorYieldLPInfoRoute = ({
  chain,
  address,
}: {
  chain: Chain
  address: string
}) =>
  `${THORYIELD_ROUTE}/${THORYIELD_LP_PATH}?${chain.toLowerCase()}=${address}`
