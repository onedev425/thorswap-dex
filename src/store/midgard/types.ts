import {
  Action,
  Coin,
  Constants,
  DepthHistory,
  EarningsHistory,
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
} from '@thorswap-lib/midgard-sdk';
import { Pool } from '@thorswap-lib/multichain-core';
import { Chain, SupportedChain } from '@thorswap-lib/types';

export interface SubmitTx {
  contractAddress?: string;
  inAssets?: Coin[];
  outAssets?: Coin[];
  poolAsset?: string;
  recipient?: string;
  submitDate?: Date;
  txID?: string;
  withdrawChain?: Chain; // chain for asset used for withdraw tx
  addTx?: {
    runeTxID?: string;
    assetTxID?: string;
  };
}

export interface TxTracker {
  uuid: string;
  type: TxTrackerType;
  status: TxTrackerStatus;
  submitTx: SubmitTx;
  action: Action | null;
  refunded: boolean | null;
}

// Record<asset, tracker status>
export type ApproveStatus = Record<string, TxTrackerStatus>;

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
  Refund = 'refund',
  Switch = 'switch',
  Mint = 'mint',
  Redeem = 'redeem',
  Stake = 'stake',
  Claim = 'claim',
  StakeExit = 'stakeExit',
  Unstake = 'unstake', // for vTHOR unstake
  RegisterThorname = 'registerThorname',
  UpdateThorname = 'updateThorname',
}

export type MimirData = {
  CHURNINTERVAL?: number;
  FUNDMIGRATIONINTERVAL?: number;
  MINIMUMBONDINRUNE?: number;
  MINRUNEPOOLDEPTH?: number;
  NEWPOOLCYCLE?: number;
  ROTATEPERBLOCKHEIGHT?: number;
  MAXLIQUIDITYRUNE?: number;
  MAXIMUMLIQUIDITYRUNE?: number;
  'mimir//MAXIMUMLIQUIDITYRUNE'?: number;
  HALTAVAXCHAIN?: number;
  HALTTHORCHAIN?: number;
  HALTBCHCHAIN?: number;
  HALTBCHTRADING?: number;
  HALTAVAXTRADING?: number;
  HALTBNBCHAIN?: number;
  HALTBNBTRADING?: number;
  HALTBTCCHAIN?: number;
  HALTBTCTRADING?: number;
  HALTDOGECHAIN?: number;
  HALTDOGETRADING?: number;
  HALTETHCHAIN?: number;
  HALTETHTRADING?: number;
  HALTGAIACHAIN?: number;
  HALTGAIATRADING?: number;
  HALTLTCCHAIN?: number;
  HALTLTCTRADING?: number;
  MAXSYNTHPERASSETDEPTH?: number;
  PAUSELP?: number;
  PAUSELPAVAX?: number;
  PAUSELPBCH?: number;
  PAUSELPBNB?: number;
  PAUSELPBTC?: number;
  PAUSELPDOGE?: number;
  PAUSELPETH?: number;
  PAUSELPLTC?: number;
  SOLVENCYHALTBCHCHAIN?: number;
  SOLVENCYHALTETHCHAIN?: number;
  MAXSYNTHPERPOOLDEPTH?: number;
};

export type ShareType = 'sym' | 'runeAsym' | 'assetAsym';

export enum PoolShareType {
  SYM = 'sym',
  RUNE_ASYM = 'runeAsym',
  ASSET_ASYM = 'assetAsym',
  PENDING = 'pending',
}

// Pool Member Data for sym, runeAsym, assetAsym
export type PoolMemberData = {
  sym?: MemberPool;
  runeAsym?: MemberPool;
  assetAsym?: MemberPool;
  pending?: MemberPool;
};

// Record<poolString, PoolMemberData>
export type ChainMemberData = Record<string, PoolMemberData>;

// Record<chainString, ChainMemberData>
export type ChainMemberDetails = Record<string, ChainMemberData>;

// Record<chainString, boolean>
export type ChainMemberDetailsLoading = Record<string, boolean>;

export type LiquidityProvider = {
  asset: string;
  rune_address?: string;
  asset_address?: string;
  last_add_height: number;
  units: string;
  pending_rune: string;
  pending_asset: string;
  pending_tx_Id?: string;
  rune_deposit_value: string;
  asset_deposit_value: string;
};

export type SaverProvider = {
  asset: string;
  asset_address: string;
  units: string;
  pending_rune: string;
  pending_asset: string;
  rune_deposit_value: string;
  asset_deposit_value: string;
};

export type PendingLP = Record<string, LiquidityProvider>;

export type PoolNamesByChain = Record<string, string[]>;

export type LpDetailLoading = Record<string, boolean>;

export type AddedAndWithdrawn = {
  rune: string | number;
  asset: string | number;
};

export type LpDetailCalculatedAddedAndWithdrawn = {
  added: AddedAndWithdrawn;
  withdrawn: AddedAndWithdrawn;
};

export type LpDetailCalculationResult = {
  [key: string]: LpDetailCalculatedAddedAndWithdrawn;
};

export interface State {
  pools: Pool[];
  poolLoading: boolean;
  memberDetails: MemberDetails;
  chainMemberDetails: ChainMemberDetails;
  chainMemberDetailsLoading: ChainMemberDetailsLoading;
  fullMemberDetailsLoading: boolean;
  poolStats: PoolStatsDetail | null;
  poolStatsLoading: boolean;
  depthHistory: DepthHistory | null;
  depthHistoryLoading: boolean;
  earningsHistory: EarningsHistory | null;
  earningsHistoryLoading: boolean;
  tvlHistory: TVLHistory | null;
  tvlHistoryLoading: boolean;
  swapHistory: SwapHistory | null;
  swapGlobalHistory: SwapHistory | null;
  swapHistoryLoading: boolean;
  liquidityHistory: LiquidityHistory | null;
  liquidityGlobalHistory: LiquidityHistory | null;
  liquidityHistoryLoading: boolean;
  stats: StatsData | null;
  networkData: Network | null;
  constants: Constants | null;
  queue: Queue | null;
  mimirLoading: boolean;
  mimirLoaded: boolean;
  mimir: MimirData;
  volume24h: number | null;
  inboundGasRate: { [key in Chain]?: string };
  inboundHalted: { [key in SupportedChain]?: boolean };
  inboundAddresses: { [key in SupportedChain]?: string };
  outboundFee: { [key in SupportedChain]?: string };
  lastBlock: LastblockItem[];
  nodes: THORNode[];
  nodeLoading: boolean;
  approveStatus: ApproveStatus;
  pendingLP: PendingLP;
  pendingLPLoading: boolean;
  poolNamesByChain: PoolNamesByChain;
  lpDetailLoading: LpDetailLoading;
  lpAddedAndWithdraw: LpDetailCalculationResult;
}

export type ThornodePoolType = {
  LP_units: string;
  asset: string;
  balance_asset: string;
  balance_rune: string;
  pending_inbound_asset: string;
  pending_inbound_rune: string;
  pool_units: string;
  savers_depth: string;
  savers_units: string;
  status: string;
  synth_mint_paused: boolean;
  synth_supply: string;
  synth_units: string;
};

export type MidgardEarnPoolType = {
  asset: string;
  saversAPR: string;
  synthSupply: string;
  assetDepth: string;
};
