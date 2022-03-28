import { Asset } from '@thorswap-lib/multichain-sdk'

export enum ROUTES {
  AddLiquidity = '/add-liquidity',
  Home = '/dashboard',
  ManageLiquidity = '/manage-liquidity',
  NodeDetail = '/nodes/:nodeAddress',
  NodeManager = '/node-manager',
  Nodes = '/nodes',
  PendingLiquidity = '/pending-liquidity',
  Send = '/send',
  SendAsset = '/send/:assetParam',
  Stake = '/stake',
  Stats = '/stats',
  Swap = '/swap',
  UpgradeRune = '/upgrade-rune',
  Vesting = '/vesting',
  Wallet = '/wallet',
  WithdrawLiquidity = '/withdraw-liquidity',
}

export const getAddLiquidityRoute = (asset: Asset) => {
  return `${ROUTES.AddLiquidity}/${asset.toURLEncoded()}`
}

export const getWithdrawRoute = (asset: Asset) => {
  return `${ROUTES.WithdrawLiquidity}/${asset.toURLEncoded()}`
}
