import { TransactionStatus, TransactionType } from 'store/transactions/types';

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
  includeMetadata?: boolean;
};

export type GetTokenPriceParams = {
  tokens: GetTokenPriceIdentifiers[];
  options?: GetTokenListOptions;
};

export type CoingGecko = {
  id?: string;
  name?: string;
  market_cap?: number;
  total_volume?: number;
  price_change_24h_usd?: number;
  price_change_percentage_24h_usd?: number;
  timestamp?: number;
};

export type GetTokenPriceResponseOject = GetTokenPriceIdentifiers & {
  price_usd: number;
  cg?: CoingGecko;
};

export type GetTokenPriceResponse = GetTokenPriceResponseOject[];

export type GetProvidersResponse = {
  nbTokens: number;
  provider: string;
  version: Version;
  error: boolean;
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

export type GetTxnStatusParams = {
  txid: string;
  type?: TransactionType;
  from?: string;
};
