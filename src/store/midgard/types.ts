export type MimirData = {
  ASGARDSIZE: number;
  BADVALIDATORREDLINE: number;
  BURNSYNTHS: number;
  CHURNINTERVAL: number;
  DEPRECATEILP: number;
  DERIVEDDEPTHBASISPTS: number;
  DERIVEDMINDEPTH: number;
  DESIREDVALIDATORSET: number;
  EMISSIONCURVE: number;
  ENABLEAVAXCHAIN: number;
  ENABLEBSC: number;
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
  HALTBSCCHAIN: number;
  HALTBSCTRADING: number;
  PAUSELPBSC: number;
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
  'LENDING-THOR-BTC': number;
  'LENDING-THOR-ETH': number;
  LENDINGLEVER: number;
  LOANREPAYMENTMATURITY: number;
  MAXANCHORBLOCKS: number;
  MAXANCHORSLIP: number;
  MAXBONDPROVIDERS: number;
  MAXCR: number;
  MAXIMUMLIQUIDITYRUNE: number;
  MAXNODETOCHURNOUTFORLOWVERSION: number;
  MAXOUTBOUNDATTEMPTS: number;
  MAXOUTBOUNDFEEMULTIPLIERBASISPOINTS: number;
  MAXRUNESUPPLY: number;
  MAXSYNTHPERPOOLDEPTH: number;
  MAXSYNTHSFORSAVERSYIELD: number;
  MAXUTXOSTOSPEND: number;
  MINCR: number;
  MINIMUMBONDINRUNE: number;
  MINIMUML1OUTBOUNDFEEUSD: number;
  MINOUTBOUNDFEEMULTIPLIERBASISPOINTS: number;
  MINRUNEPOOLDEPTH: number;
  MINTSYNTHS: number;
  NODEOPERATORFEE: number;
  NODEPAUSECHAINGLOBAL: number;
  NUMBEROFNEWNODESPERCHURN: number;
  OBSERVATIONDELAYFLEXIBILITY: number;
  'PAUSEASYMWITHDRAWAL-TERRA': number;
  PAUSELOANS: number;
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
  PENDINGLIQUIDITYAGELIMIT: number;
  'POL-BTC-BTC': number;
  'POL-ETH-ETH': number;
  POLBUFFER: number;
  POLMAXNETWORKDEPOSIT: number;
  POLMAXPOOLMOVEMENT: number;
  POLTARGETSYNTHPERPOOLDEPTH: number;
  POOLCYCLE: number;
  POOLDEPTHFORYGGFUNDINGMIN: number;
  PREFERREDASSETOUTBOUNDFEEMULTIPLIER: number;
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
  STREAMINGSWAPMINBPFEE: number;
  SYNTHYIELDBASISPOINTS: number;
  THORNAMES: number;
  'TORANCHOR-AVAX-USDC-0XB97EF9EF8734C71904D8002F8B6BC66DD9C48A6E': number;
  'TORANCHOR-BNB-BUSD-BD1': number;
  'TORANCHOR-ETH-USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48': number;
  'TORANCHOR-ETH-USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7': number;
  TXOUTDELAYRATE: number;
  VIRTUALMULTSYNTHS: number;
  VOTEDOFM: number;
  VOTELENDING: number;
  VOTEMAXSYNTHSFORSAVERSYIELD: number;
  YGGFUNDLIMIT: number;
  YGGFUNDRETRY: number;
};

export type ShareType = 'sym' | 'runeAsym' | 'assetAsym';

export enum PoolShareType {
  SYM = 'sym',
  RUNE_ASYM = 'runeAsym',
  ASSET_ASYM = 'assetAsym',
  PENDING = 'pending',
}

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

export type HistoryParams = void | { interval?: 'day' | 'hour'; count?: number };

export type NetworkResponse = {
  activeBonds: string[];
  activeNodeCount: string;
  blockRewards: {
    blockReward: string;
    bondReward: string;
    poolReward: string;
  };
  bondMetrics: {
    averageActiveBond: string;
    averageStandbyBond: string;
    bondHardCap: string;
    maximumActiveBond: string;
    maximumStandbyBond: string;
    medianActiveBond: string;
    medianStandbyBond: string;
    minimumActiveBond: string;
    minimumStandbyBond: string;
    totalActiveBond: string;
    totalStandbyBond: string;
  };
  bondingAPY: string;
  liquidityAPY: string;
  nextChurnHeight: string;
  poolActivationCountdown: string;
  poolShareFactor: string;
  standbyBonds: string[];
  standbyNodeCount: string;
  totalPooledRune: string;
  totalReserve: string;
};

export type LiquidityHistoryResponse = {
  intervals: {
    addAssetLiquidityVolume: string;
    addLiquidityCount: string;
    addLiquidityVolume: string;
    addRuneLiquidityVolume: string;
    endTime: string;
    impermanentLossProtectionPaid: string;
    net: string;
    runePriceUSD: string;
    startTime: string;
    withdrawAssetVolume: string;
    withdrawCount: string;
    withdrawRuneVolume: string;
    withdrawVolume: string;
  }[];
  meta: {
    addAssetLiquidityVolume: string;
    addLiquidityCount: string;
    addLiquidityVolume: string;
    addRuneLiquidityVolume: string;
    endTime: string;
    impermanentLossProtectionPaid: string;
    net: string;
    runePriceUSD: string;
    startTime: string;
    withdrawAssetVolume: string;
    withdrawCount: string;
    withdrawRuneVolume: string;
    withdrawVolume: string;
  };
};

export type SwapHistoryResponse = {
  intervals: {
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
  }[];
  meta: {
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
};

export type PoolDetail = {
  annualPercentageRate: string;
  asset: string;
  assetDepth: string;
  assetPrice: string;
  assetPriceUSD: string;
  liquidityUnits: string;
  poolAPY: string;
  runeDepth: string;
  saversAPR: string;
  saversDepth: string;
  saversUnits: string;
  status: string;
  synthSupply: string;
  synthUnits: string;
  units: string;
  volume24h: string;
};
