import { QuoteRoute } from '@thorswap-lib/swapkit-api';
import {
  TransactionStatus,
  TransactionType,
  TxStatus,
  TxTrackerDetails,
} from 'store/transactions/types';

type LiquidityTxResult<T extends TransactionType> = {
  type: T;
  liquidityUnits: string;
  txID: string;
  inputAssetPriceUSD: { [key: string]: string };
  inputAssetPriceUSDTimestamp: { [key: string]: string };
};

type WithdrawTxResult = LiquidityTxResult<
  TransactionType.TC_LP_WITHDRAW | TransactionType.TC_SAVINGS_WITHDRAW
> & {
  out: { [key: string]: { address: string; amount: string } };
};
type AddLiquidityTxResult = LiquidityTxResult<
  TransactionType.TC_LP_ADD | TransactionType.TC_SAVINGS_ADD
> & {
  in: { [key: string]: { address: string; amount: string } };
};

export type SuccessTxnResult = {
  type:
    | TransactionType.SWAP_ETH_TO_ETH
    | TransactionType.SWAP_ETH_TO_TC
    | TransactionType.SWAP_TC_TO_ETH
    | TransactionType.SWAP_TC_TO_TC;
  blockNumber: number;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  inputAsset: string;
  inputAssetAmount: string;
  inputAssetPriceUSD: number;
  inputAssetPriceUSDTimestamp: string;
  memo: string;
  outputAsset: string;
  outputAssetAmount: string;
  outputAssetPriceUSD: number;
  outputAssetPriceUSDTimestamp: string;
  transactionHash: string;
  userAddress: string;
};

type Version = {
  major: number;
  minor: number;
  patch: number;
};

export type Token = {
  cg?: {
    id: string;
    market_cap: number;
    name: string;
    price_change_24h_usd: number;
    price_change_percentage_24h_usd: number;
    sparkline_in_7d_usd: string;
    total_volume: number;
  };
  address: string;
  chain?: string;
  decimals: number;
  identifier: string;
  logoURI?: string;
  price_usd?: number;
  provider: string;
  ticker: string;
};

export type GetTokenPriceIdentifiers = {
  identifier?: string;
};
export type GetTokenListOptions = {
  metadata?: boolean;
  lookup?: boolean;
  sparkline?: boolean;
};

export type GetTokenPriceParams = {
  tokens: GetTokenPriceIdentifiers[];
  options?: GetTokenListOptions;
};

export type GetTokenPriceResponseItem = GetTokenPriceIdentifiers & {
  price_usd: number;
  cg?: {
    id?: string;
    name?: string;
    market_cap?: number;
    total_volume?: number;
    price_change_24h_usd?: number;
    price_change_percentage_24h_usd?: number;
    sparkline_in_7d?: string;
    timestamp?: number;
  };
};

export type GetTokenPriceResponse = GetTokenPriceResponseItem[];

export type GetProvidersResponse = {
  nbTokens: number;
  provider: string;
  version?: Version;
}[];

export type GetProviderTokensParams = {
  count: number;
  keywords: string[];
  name: string;
  timestamp: string;
  tokens: Token[];
  version: Version;
};

export type TxnResult = SuccessTxnResult | WithdrawTxResult | AddLiquidityTxResult;

export type GetTxnStatusResponse =
  | { ok: false; status: 'pending'; result: string }
  | {
      ok: true;
      status: TransactionStatus;
      result?: TxnResult;
    };

export type GetTokensQuoteParams = {
  affiliateBasisPoints?: string;
  buyAsset: string;
  recipientAddress?: string;
  sellAmount: string;
  sellAsset: string;
  senderAddress?: string;
  slippage: string;
};

export type GetAirdropVerifyParams = {
  address: string;
};

export type GetTokensQuoteResponse = {
  quoteId: string;
  routes: [
    {
      path: string;
      providers: string[];
      subProviders: string[];
      swaps: QuoteRoute['swaps'];
      expectedOutput: string;
      expectedOutputMaxSlippage: string;
      expectedOutputUSD: string;
      expectedOutputMaxSlippageUSD: string;
      transaction: {
        from: string;
        to: string;
        value: number;
        data: string;
        gas: number;
        gasPrice: number;
      };
      optimal: boolean;
      complete: boolean;
      fees: QuoteRoute['fees'];
      meta: {
        sellChain: string;
        sellChainGasRate: string;
        buyChain: string;
        buyChainGasRate: string;
        priceProtectionRequired: true;
        priceProtectionDetected: true;
        quoteMode: string;
        lastLegEffectiveSlipPercentage: number;
        thornodeMeta: null;
      };
      inboundAddress: string;
      targetAddress: string;
      calldata: {
        fromAsset: string;
        userAddress: string;
        assetAddress: string;
        amountIn: string;
        amountOut: string;
        amountOutMin: string;
        memo: string;
        memoStreamingSwap: string;
        expiration: number;
        tcVault: string;
        tcRouter: string;
      };
      contract: string;
      allowanceTarget: string;
      approvalTarget: string;
      contractMethod: string;
      contractInfo: string;
      index: number;
      estimatedTime: number;
      streamingSwap?: {
        expectedOutput: string;
        expectedOutputMaxSlippage: string;
        expectedOutputUSD: string;
        expectedOutputMaxSlippageUSD: string;
        estimatedTime: number;
        fees: QuoteRoute['fees'];
      };
    },
  ];
};

export type GetTxnStatusParams = {
  txid: string;
  type?: TransactionType;
  from?: string;
};

export type GetTxnStatusDetailsParams = {
  txn: {
    hash: string;
    quoteId: string;
    sellAmount: string;
    route?: QuoteRoute;
    startTimestamp?: number;
    fromAddress: string;
    toAddress: string;
    isStreamingSwap?: boolean;
  };
};

export type GetTxnStatusDetailsUpdateParams = {
  hash: string;
};

export type GetTxnStatusDetailsResponse = {
  result: TxTrackerDetails;
  done: boolean;
  status: TxStatus;
  error?: { message: string };
};

export type GasPriceInfo = {
  asset: string;
  units: string;
  gas: number;
  chainId: string;
  gasAsset: number;
};

export type GetGasPriceRatesResponse = GasPriceInfo[];

export interface History {
  value: number;
  timestamp: number;
}

export interface GasHistoryData {
  lastTimestamp: number;
  chainId: string;
  chainName: string;
  unitName: string;
  history: number[];
  redisKey: string;
}

export interface getGasHistoryResponse {
  average7d?: number;
  average24h?: number;
  lastTimestamp: number;
  chainId: string;
  unitName: string;
  history: { value: number; timestamp: number }[];
}

export interface IThornameForAddressResponse {
  result: string[];
}

export interface IThornameForAddressParams {
  address: string;
  chain: string;
}
export type LoansResponse = {
  owner: string;
  asset: string;
  debt_up: string;
  debt_down: string;
  collateral_up: string;
  collateral_down: string;
  last_open_height: number;
};
