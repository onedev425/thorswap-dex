import { Asset } from '@thorswap-lib/multichain-sdk'

export enum ROUTES {
  Home = '/',

  AddLiquidity = '/add-liquidity',
  ManageLiquidity = '/manage-liquidity',
  NodeManager = '/node-manager',
  Nodes = '/nodes',
  PendingLiquidity = '/pending-liquidity',
  Send = '/send',
  Stake = '/stake',
  Stats = '/stats',
  Swap = '/swap',
  Vesting = '/vesting',
  Wallet = '/wallet',
  WithdrawLiquidity = '/withdraw-liquidity',
  UpgradeRune = '/upgrade-rune',
}

export const getAddLiquidityRoute = (asset: Asset) => {
  return `${ROUTES.AddLiquidity}/${asset.toURLEncoded()}`
}

export const getWithdrawRoute = (asset: Asset) => {
  return `${ROUTES.WithdrawLiquidity}/${asset.toURLEncoded()}`
}
