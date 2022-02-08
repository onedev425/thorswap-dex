import {
  StatsData,
  Network,
  Constants,
  Queue,
  PoolStatsDetail,
  DepthHistory,
  EarningsHistory,
  SwapHistory,
  LiquidityHistory,
  ActionsList,
  MemberDetails,
  MemberPool,
  InboundAddressesItem,
  TVLHistory,
  LastblockItem,
  THORNode,
  PoolDetail,
} from '@thorswap-lib/midgard-sdk'

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
  'SYM' = 'SYM',
  'RUNE_ASYM' = 'RUNE_ASYM',
  'ASSET_ASYM' = 'ASSET_ASYM',
}

// Pool Member Data for sym, runeAsym, assetAsym
export type PoolMemberData = {
  sym?: MemberPool
  runeAsym?: MemberPool
  assetAsym?: MemberPool
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
  pools: PoolDetail[]
  poolLoading: boolean
  memberDetails: MemberDetails
  memberDetailsLoading: boolean
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
  inboundData: InboundAddressesItem[]
  pendingLP: PendingLP
  pendingLPLoading: boolean
  lastBlock: LastblockItem[]
  nodes: THORNode[]
  nodeLoading: boolean
}
