import type { AssetValue, ChainId } from '@swapkit/core';
import { Chain } from '@swapkit/core';
import { z } from 'zod';

export const AssetValueSchema = z.object({
  chain: z.nativeEnum(Chain),
  symbol: z.string(),
  ticker: z.string(),
  decimal: z.optional(z.number()),
  address: z.optional(z.string()),
  isGasAsset: z.boolean(),
  isSynthetic: z.boolean(),
  tax: z.optional(
    z.object({
      buy: z.number(),
      sell: z.number(),
    }),
  ),
});

export enum TxnType {
  native_send = 'native_send', // native send, msgSend, etc.
  token_transfer = 'token_transfer', // token transfer
  native_contract_call = 'native_contract_call', // native contract call
  token_contract_call = 'token_contract_call', // token contract call
  approve = 'approve', // token approve
  deposit = 'deposit', // msgDeposit and related cosmos operations, not deposit to vault or deposit contract name
  thorname_action = 'thorname_action', // should we use this or msgDeposit?
  lp_action = 'lp_action', // deposit to an evm pool, tc pool, etc.
  swap = 'swap', // any kind of operations that involves swapping assets
  streaming_swap = 'streaming_swap', // streaming swap
  stake = 'stake', // defi operations like $vthor and other types of staking
  claim = 'claim', // claim rewards, claim tokens, etc.
  lending = 'lending', // lending operations
  unknown = 'unknown',
}

// transaction status devoid of any business logic
export enum TxnStatus {
  unknown = 'unknown',
  not_started = 'not_started',
  pending = 'pending',
  swappping = 'swapping',
  completed = 'completed',
}

// "tracking status" with business logic context
export enum TrackingStatus {
  not_started = 'not_started',
  starting = 'starting', // first status once we receive, old or new transaction
  broadcasted = 'broadcasted',
  indexing = 'indexing',
  mempool = 'mempool',
  inbound = 'inbound',
  outbound = 'outbound',
  swapping = 'swapping', // more generic than streaming
  completed = 'completed',
  refunded = 'refunded',
  partially_refunded = 'partially_refunded',
  dropped = 'dropped',
  reverted = 'reverted',
  replaced = 'replaced',
  retries_exceeded = 'retries_exceeded',
  parsing_error = 'parsing_error',
}

// type ProviderTransientDetails = ThorchainTransientDetails | MayaTransientDetails;

// convert the following interfaces to use zod like the TransactionFeesSchema example
const TxnPayloadSchema = z.object({
  memo: z.optional(z.string()),
  evmCalldata: z.optional(z.string()),
  logs: z.optional(z.unknown()),
});

export type TxnPayload = z.infer<typeof TxnPayloadSchema>;

// props that are most important while the transaction is live
const TxnTransientSchema = z.object({
  estimatedFinalizedAt: z.number(),
  estimatedTimeToCompleteMs: z.number(),
  updatedAt: z.number(),
  currentLegIndex: z.optional(z.number()),
  providerDetails: z.optional(z.unknown()), // see ProviderTransientDetails
});

export type TxnTransient = z.infer<typeof TxnTransientSchema>;

const TransactionFeesSchema = z.object({
  network: z.optional(AssetValueSchema), // gas on ethereum, network fee on thorchain, etc.
  affiliate: z.optional(AssetValueSchema), // e.g. affiliate in memo, other affiliate mechanisms
  liquidity: z.optional(AssetValueSchema), // fee paid to pool
  protocol: z.optional(AssetValueSchema), // extra protocol fees (TS dex aggregation contracts, stargate fees, etc.)
  tax: z.optional(AssetValueSchema), // taxed tokens
});

export type TransactionFees = z.infer<typeof TransactionFeesSchema>;

// props that are not part of the transaction itself, but are still relevant for integrators
const TxnMetaSchema = z.object({
  broadcastedAt: z.optional(z.number()),
  wallet: z.optional(z.string()),
  quoteId: z.optional(z.string()),
  explorerUrl: z.optional(z.string()),
  affiliate: z.optional(z.string()),
  fees: z.optional(TransactionFeesSchema),
});

export type TxnMeta = z.infer<typeof TxnMetaSchema>;

const TransactionLegDTOSchema = z.object({
  hash: z.string(),
  block: z.number(),
  type: z.nativeEnum(TxnType),
  status: z.nativeEnum(TxnStatus),
  trackingStatus: z.optional(z.nativeEnum(TrackingStatus)),

  fromAsset: z.string(),
  fromAmount: z.string(),
  fromAddress: z.string(),
  toAsset: z.string(),
  toAmount: z.string(),
  toAddress: z.string(),
  finalAsset: z.optional(AssetValueSchema),
  finalAddress: z.optional(z.string()),

  minedAt: z.number(),
  finalizedAt: z.number(),

  transient: z.optional(TxnTransientSchema),
  meta: z.optional(TxnMetaSchema),
  payload: z.optional(TxnPayloadSchema),
});

export type TransactionLegDTO = z.infer<typeof TransactionLegDTOSchema>;

export const TransactionSchema = TransactionLegDTOSchema.extend({
  legs: z.array(TransactionLegDTOSchema),
});

export type TransactionDTO = z.infer<typeof TransactionLegDTOSchema> & {
  legs: TransactionLegDTO[];
};

export const TransactionDTOSchema: z.ZodType<TransactionDTO> = TransactionLegDTOSchema.extend({
  legs: z.array(TransactionLegDTOSchema),
});

export interface TransactionProps {
  hash: string;
  block: number;
  type?: TxnType;
  status?: TxnStatus;
  trackingStatus?: TrackingStatus;
  fromAsset: AssetValue | null;
  fromAddress: string;
  toAsset: AssetValue | null;
  toAddress: string;
  minedAt?: number;
  finalizedAt?: number;
  meta?: Partial<TxnMeta>;
  payload?: Partial<TxnPayload>;
}

export interface TxDetails extends TransactionProps {
  legs: TransactionLegDTO[];
  transient?: TxnTransient;
}

export interface TrackerPayload {
  chainId: ChainId;
  hash: string;
  block?: number;
}
