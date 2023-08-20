import {
  Action,
  Coin,
  Constants,
  DepthHistory,
  EarningsHistory,
  LastblockItem,
  LiquidityHistory,
  MemberPool,
  Network,
  PoolStatsDetail,
  Queue,
  StatsData,
  SwapHistory,
  THORNode,
  TVLHistory,
} from '@thorswap-lib/midgard-sdk';
import { Pool } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';

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
  ASGARDSIZE: number;
  BADVALIDATORREDLINE: number;
  BURNSYNTHS: number;
  CHURNINTERVAL: number;
  DEPRECATEILP: number;
  DERIVEDDEPTHBASISPTS: number;
  DESIREDVALIDATORSET: number;
  EMISSIONCURVE: number;
  ENABLEAVAXCHAIN: number;
  ENABLESAVINGSVAULTS: number;
  FULLIMPLOSSPROTECTIONBLOCKS: number;
  FUNDMIGRATIONINTERVAL: number;
  HALTAVAXCHAIN: number;
  HALTAVAXTRADING: number;
  HALTBCHCHAIN: number;
  HALTBCHTRADING: number;
  HALTBNBCHAIN: number;
  HALTBNBTRADING: number;
  HALTBTCCHAIN: number;
  HALTBTCTRADING: number;
  HALTCHAINGLOBAL: number;
  HALTCHURNING: number;
  HALTDOGECHAIN: number;
  HALTDOGETRADING: number;
  HALTETHCHAIN: number;
  HALTETHTRADING: number;
  HALTGAIACHAIN: number;
  HALTGAIATRADING: number;
  HALTLTCCHAIN: number;
  HALTLTCTRADING: number;
  HALTSIGNING: number;
  HALTSIGNINGAVAX: number;
  HALTSIGNINGBCH: number;
  HALTSIGNINGBNB: number;
  HALTSIGNINGBTC: number;
  HALTSIGNINGDOGE: number;
  HALTSIGNINGETH: number;
  HALTSIGNINGGAIA: number;
  HALTSIGNINGLTC: number;
  HALTSIGNINGTERRA: number;
  HALTTERRACHAIN: number;
  HALTTERRATRADING: number;
  HALTTHORCHAIN: number;
  HALTTRADING: number;
  ILPCUTOFF: number;
  KILLSWITCHSTART: number;
  MAXIMUMLIQUIDITYRUNE: number;
  MAXNODETOCHURNOUTFORLOWVERSION: number;
  MAXOUTBOUNDATTEMPTS: number;
  MAXSYNTHPERPOOLDEPTH: number;
  MAXUTXOSTOSPEND: number;
  MINIMUMBONDINRUNE: number;
  MINIMUML1OUTBOUNDFEEUSD: number;
  MINRUNEPOOLDEPTH: number;
  MINTSYNTHS: number;
  NODEOPERATORFEE: number;
  NODEPAUSECHAINGLOBAL: number;
  NUMBEROFNEWNODESPERCHURN: number;
  OBSERVATIONDELAYFLEXIBILITY: number;
  'PAUSEASYMWITHDRAWAL-TERRA': number;
  PAUSELP: number;
  PAUSELPAVAX: number;
  PAUSELPBCH: number;
  PAUSELPBNB: number;
  PAUSELPBTC: number;
  PAUSELPDOGE: number;
  PAUSELPETH: number;
  PAUSELPGAIA: number;
  PAUSELPLTC: number;
  PAUSELPTERRA: number;
  PAUSEUNBOND: number;
  POOLCYCLE: number;
  POOLDEPTHFORYGGFUNDINGMIN: number;
  'RAGNAROK-TERRA-LUNA': number;
  'RAGNAROK-TERRA-UST': number;
  SLASHPENALTY: number;
  SOLVENCYHALTBCHCHAIN: number;
  SOLVENCYHALTETHCHAIN: number;
  SOLVENCYHALTGAIACHAIN: number;
  SOLVENCYHALTTERRACHAIN: number;
  STOPFUNDYGGDRASIL: number;
  STOPSOLVENCYCHECK: number;
  STOPSOLVENCYCHECKBNB: number;
  STOPSOLVENCYCHECKETH: number;
  STOPSOLVENCYCHECKGAIA: number;
  STOPSOLVENCYCHECKTERRA: number;
  SYNTHYIELDBASISPOINTS: number;
  THORNAMES: number;
  'TORANCHOR-AVAX-USDC-0XB97EF9EF8734C71904D8002F8B6BC66DD9C48A6E': number;
  'TORANCHOR-BNB-BUSD-BD1': number;
  'TORANCHOR-ETH-USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48': number;
  'TORANCHOR-ETH-USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7': number;
  TXOUTDELAYRATE: number;
  VIRTUALMULTSYNTHS: number;
  YGGFUNDRETRY: number;
  PAUSELOANS: number;
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

export type PoolPeriodsUsedForApiCall = '30d';

export type PoolsRecords = {
  [key in PoolPeriodsUsedForApiCall]: Pool[];
};

export interface State {
  pools: PoolsRecords;
  poolLoading: boolean;
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

export type MidgardTradeHistoryDetails = {
  averageSlip: string;
  endTime: string;
  runePriceUSD: string;
  startTime: string;
  synthMintAverageSlip: string;
  synthMintCount: string;
  synthMintFees: string;
  synthMintVolume: string;
  synthRedeemAverageSlip: string;
  synthRedeemCount: string;
  synthRedeemFees: string;
  synthRedeemVolume: string;
  toAssetAverageSlip: string;
  toAssetCount: string;
  toAssetFees: string;
  toAssetVolume: string;
  toRuneAverageSlip: string;
  toRuneCount: string;
  toRuneFees: string;
  toRuneVolume: string;
  totalCount: string;
  totalFees: string;
  totalVolume: string;
  totalVolumeUsd: string;
};

export type MidgardTradeHistory = {
  intervals: MidgardTradeHistoryDetails[];
  meta: MidgardTradeHistoryDetails[];
};

export enum LiquidityTypeOption {
  'RUNE' = 'RUNE',
  'ASSET' = 'ASSET',
  'SYMMETRICAL' = 'SYMMETRICAL',
}
