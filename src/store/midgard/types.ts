import {
  Action,
  ActionsList,
  Coin,
  Constants,
  DepthHistory,
  EarningsHistory,
  InboundAddressesItem,
  LastblockItem,
  LiquidityHistory,
  MemberDetails,
  MemberPool,
  Network,
  PoolStatsDetail,
  Queue,
  StatsData,
  SwapHistory,
  THORNode,
  TVLHistory,
} from '@thorswap-lib/midgard-sdk'
import { Pool } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'
export interface SubmitTx {
  inAssets?: Coin[]
  outAssets?: Coin[]
  txID?: string
  submitDate?: Date
  recipient?: string
  poolAsset?: string
  addTx?: {
    runeTxID?: string
    assetTxID?: string
  }
  withdrawChain?: Chain // chain for asset used for withdraw tx
}

export interface TxTracker {
  uuid: string
  type: TxTrackerType
  status: TxTrackerStatus
  submitTx: SubmitTx
  action: Action | null
  refunded: boolean | null
}

// Record<asset, tracker status>
export type ApproveStatus = Record<string, TxTrackerStatus>

export enum TxTrackerStatus {
  Submitting = 'Submitting',
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}

// TxTrackerType has additional Approve value
export enum TxTrackerType {
  Send = 'Send',
  Approve = 'Approve',
  Swap = 'swap',
  AddLiquidity = 'addLiquidity',
  Withdraw = 'withdraw',
  Donate = 'donate',
  Refund = 'refund',
  Switch = 'switch',
  Mint = 'mint',
  Redeem = 'redeem',
}

export type MimirData = {
  CHURNINTERVAL?: number
  FUNDMIGRATIONINTERVAL?: number
  MINIMUMBONDINRUNE?: number
  MINRUNEPOOLDEPTH?: number
  NEWPOOLCYCLE?: number
  ROTATEPERBLOCKHEIGHT?: number
  MAXLIQUIDITYRUNE?: number
  MAXIMUMLIQUIDITYRUNE?: number
  'mimir//MAXIMUMLIQUIDITYRUNE'?: number
  HALTTHORCHAIN?: number
  HALTBTCCHAIN?: number
  HALTETHCHAIN?: number
  HALTBNBCHAIN?: number
  HALTBCHCHAIN?: number
  HALTLTCCHAIN?: number
  HALTDOGECHAIN?: number
  HALTTERRACHAIN?: number
  HALTBTCTRADING?: number
  HALTETHTRADING?: number
  HALTBNBTRADING?: number
  HALTBCHTRADING?: number
  HALTLTCTRADING?: number
  HALTDOGETRADING?: number
  HALTTERRATRADING?: number
  PAUSELP?: number
  PAUSELPBCH?: number
  PAUSELPBNB?: number
  PAUSELPBTC?: number
  PAUSELPETH?: number
  PAUSELPLTC?: number
  PAUSELPDOGE?: number
  PAUSELPTERRA?: number
}

export type ShareType = 'sym' | 'runeAsym' | 'assetAsym'

export enum PoolShareType {
  SYM = 'sym',
  RUNE_ASYM = 'runeAsym',
  ASSET_ASYM = 'assetAsym',
  PENDING = 'pending',
}

// Pool Member Data for sym, runeAsym, assetAsym
export type PoolMemberData = {
  sym?: MemberPool
  runeAsym?: MemberPool
  assetAsym?: MemberPool
  pending?: MemberPool
}

// Record<poolString, PoolMemberData>
export type ChainMemberData = Record<string, PoolMemberData>

// Record<chainString, ChainMemberData>
export type ChainMemberDetails = Record<string, ChainMemberData>

// Record<chainString, boolean>
export type ChainMemberDetailsLoading = Record<string, boolean>

export type LiquidityProvider = {
  asset: string
  rune_address?: string
  asset_address?: string
  last_add_height: number
  units: string
  pending_rune: string
  pending_asset: string
  pending_tx_Id?: string
  rune_deposit_value: string
  asset_deposit_value: string
}

export type PendingLP = Record<string, LiquidityProvider>

export interface State {
  pools: Pool[]
  poolLoading: boolean
  memberDetails: MemberDetails
  chainMemberDetails: ChainMemberDetails
  chainMemberDetailsLoading: ChainMemberDetailsLoading
  poolStats: PoolStatsDetail | null
  poolStatsLoading: boolean
  depthHistory: DepthHistory | null
  depthHistoryLoading: boolean
  earningsHistory: EarningsHistory | null
  earningsHistoryLoading: boolean
  tvlHistory: TVLHistory | null
  tvlHistoryLoading: boolean
  swapHistory: SwapHistory | null
  swapGlobalHistory: SwapHistory | null
  swapHistoryLoading: boolean
  liquidityHistory: LiquidityHistory | null
  liquidityGlobalHistory: LiquidityHistory | null
  liquidityHistoryLoading: boolean
  stats: StatsData | null
  networkData: Network | null
  constants: Constants | null
  queue: Queue | null
  txData: ActionsList | null // for tx explorer
  txDataLoading: boolean
  txCollapsed: boolean
  mimirLoading: boolean
  mimir: MimirData
  volume24h: number | null
  inboundLoading: boolean
  inboundData: InboundAddressesItem[]
  lastBlock: LastblockItem[]
  nodes: THORNode[]
  nodeLoading: boolean
  txTrackers: TxTracker[]
  approveStatus: ApproveStatus
  pendingLP: PendingLP
  pendingLPLoading: boolean
}
