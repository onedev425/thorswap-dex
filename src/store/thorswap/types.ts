import type { QuoteRoute, TxStatus, TxTrackerDetails } from '@swapkit/api';
import type { Chain, ChainId, WalletOption } from '@swapkit/core';
import type { BaseWallet } from '@swapkit/helpers';
import type { CosmosWallets, ThorchainWallets } from '@swapkit/toolbox-cosmos';
import type { EVMWallets } from '@swapkit/toolbox-evm';
import type { SubstrateWallets } from '@swapkit/toolbox-substrate';
import type { UTXOWallets } from '@swapkit/toolbox-utxo';
import type {
  InitialTrackerPayload,
  TransactionStatus,
  TransactionType,
} from 'store/transactions/types';

export type Wallet = BaseWallet<
  ThorchainWallets | EVMWallets | UTXOWallets | CosmosWallets | SubstrateWallets
>;

export type SupportedWalletOptions = Exclude<
  WalletOption,
  WalletOption.EXODUS | WalletOption.EIP6963
>;

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
  address?: string;
  chain: Chain;
  chainId?: ChainId;
  decimals: number;
  identifier: string;
  logoURI?: string;
  ticker: string;
  symbol?: string;
  name?: string;
  provider?: string;
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
  provider: string;
};

export type GetWhitelistTokensResponse = {
  name: string;
  timestamp: string;
  // TODO update typing
  version: Todo;
  keywords: string[];
  tokens: Token[];
  url: string;
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
  affiliateAddress?: string;
  affiliateBasisPoints?: string;
  buyAsset: string;
  recipientAddress?: string;
  sellAmount: string;
  sellAsset: string;
  senderAddress?: string;
  slippage?: string;
  providers?: string[];
};

export type GetAddressVerifyQuoteParams = {
  addresses: string[];
  chains: string[];
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
        recommendedSlippage?: number;
        slippagePercentage: number;
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
        maxQuantity?: number;
        maxIntervalForMaxQuantity?: number;
        savingsInAsset?: string;
        savingsInUSD?: string;
      };
      timeEstimates: {
        inboundMs: number;
        swapMs: number;
        outboundMs: number;
        streamingMs: number;
        inbound?: number;
        swap?: number;
        outbound?: number;
        streaming?: number;
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
  txn:
    | {
        hash: string;
        quoteId: string;
        sellAmount: string;
        route?: QuoteRoute;
        startTimestamp?: number;
        fromAddress: string;
        toAddress: string;
        isStreamingSwap?: boolean;
      }
    | InitialTrackerPayload;
};

export type GetTxnStatusDetailsUpdateParams = {
  hash: string;
};

export type GetAdvancedTrackerStatusPayload =
  | GetTxnStatusDetailsUpdateParams
  | GetTxnStatusDetailsParams;

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
  debtIssued: string;
  debtRepaid: string;
  debtCurrent: string;
  collateralCurrent: string;
  collateralDeposited: string;
  collateralWithdrawn: string;
  lastOpenHeight: number;
  ltvPercentage: string;
};

export type LendingStatusResponse = {
  paused: boolean;
  maturity: number;
};

type BorrowCalldata = {
  amountIn: string;
  amountOutMin: string;
  fromAsset: string;
  memo: string;
  memoStreamingSwap?: string;
  recipientAddress: string;
  toAddress: string;
  token: string;
};

type BorrowStreamingSwap = {
  estimatedTime: number;
  fees: QuoteRoute['fees'];
  expectedDebtIssued: string;
  expectedCollateralDeposited: string;
  expectedOutput: string;
  expectedOutputMaxSlippage: string;
  expectedOutputUSD: string;
  expectedOutputMaxSlippageUSD: string;
  memo: string;
};

export type BorrowQuoteParams = {
  affiliateAddress?: string;
  affiliateBasisPoints?: string;
  assetIn: string;
  assetOut: string;
  slippage: string;
  amount: string;
  senderAddress: string;
  recipientAddress: string;
};

export type RepayQuoteParams = {
  senderAddress: string;
  collateralAddress: string;
  amountPercentage: string;
  collateralAsset: string;
  repayAsset: string;
};

export type BorrowQuoteResponse = {
  fromAsset: string;
  toAsset: string;
  amountIn: string;
  amountOut: string;
  amountOutMin: string;
  swaps: QuoteRoute['swaps'];
  targetAddress: string;
  recipientAddress: string;
  memo: string;
  route: {
    meta: {
      // FIXED NESTING
      thornodeMeta: {
        inboundConfirmationSeconds: number;
        outboundDelay: number;
      };
    };
  };
  fees: QuoteRoute['fees'];

  estimatedTime: number;
  complete: boolean;
  expectedCollateralDeposited: string;
  expectedOutput: string;
  expectedOutputMaxSlippage: string;
  expectedDebtIssued: string;
  expectedOutputMaxSlippageUSD: string;
  expectedOutputUSD: string;
  calldata: BorrowCalldata;
  streamingSwap?: BorrowStreamingSwap;
};

export type RepayStreamingSwap = {
  inboundAddress: string;
  outboundDelayBlocks: number;
  outboundDelaySeconds: number;
  fees: QuoteRoute['fees'];
  router: string;
  expiry: number;
  memo: string;
  expectedAmountOut: string;
  expectedCollateralWithdrawn: string;
  expectedDebtRepaid: string;
  repayAssetAmount: string;
  repayAssetAmountUSD: string;
  estimatedTime?: number;
};

export type RepayQuoteResponse = {
  inboundAddress: string;
  inboundConfirmationBlocks: number;
  inboundConfirmationSeconds: number;
  outboundDelayBlocks: number;
  outboundDelaySeconds: number;
  fees: QuoteRoute['fees'];
  expiry: number;
  warning?: string;
  notes?: string;
  dustThreshold: string;
  memo: string;
  expectedAmountOut: string;
  expectedCollateralWithdrawn: string;
  expectedDebtRepaid: string;
  collateralCurrent: string;
  repayAssetAmount: string;
  repayAssetAmountUSD: string;
  streamingSwap?: RepayStreamingSwap;
  estimatedTime?: number;
};

export type LendingAssetResponse = {
  asset: string;
  assetDepthAssetAmount: string;
  runeDepthAssetAmount: string;
  loanCr: string;
  loanStatus: 'GREEN' | 'YELLOW' | 'RED';
  loanCollateral: string;
  derivedDepthPercentage: string;
  filledPercentage: string;
  lendingAvailable: boolean;
  ltvPercentage: string;
};
