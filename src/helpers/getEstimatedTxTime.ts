import { Amount } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';

export const blockReward: Record<Chain, number> = {
  [Chain.Bitcoin]: 6.25,
  [Chain.BitcoinCash]: 6.25,
  [Chain.Litecoin]: 12.5,
  [Chain.Doge]: 10000,
  [Chain.Ethereum]: 3,
  [Chain.Binance]: 0,
  [Chain.THORChain]: 0,
  [Chain.Avalanche]: 0,
  [Chain.Cosmos]: 0,
  [Chain.Solana]: 0,
};

// time secs for 1 block confirmation
export const blockTime: Record<Chain, number> = {
  [Chain.Bitcoin]: 600,
  [Chain.BitcoinCash]: 600,
  [Chain.Litecoin]: 150,
  [Chain.Doge]: 60,
  [Chain.Ethereum]: 15,
  [Chain.Binance]: 0,
  [Chain.THORChain]: 0,
  [Chain.Avalanche]: 0,
  [Chain.Cosmos]: 0,
  [Chain.Solana]: 0,
};

export const getEstimatedTxSeconds = ({ chain, amount }: { chain: Chain; amount: Amount }) => {
  const chainBlockReward = blockReward?.[chain] ?? 0;
  const chainBlockTime = blockTime?.[chain] ?? 0;

  if (!chainBlockReward) return 0;

  const block = Math.ceil(amount.assetAmount.toNumber() / chainBlockReward);
  return block * chainBlockTime;
};

export const getEstimatedTxTime = ({ chain, amount }: { chain: Chain; amount: Amount }) => {
  const seconds = getEstimatedTxSeconds({ chain, amount });

  if (!seconds) return '<5s';
  if (seconds < 60) return `<${seconds}s`;
  return `<${Math.ceil(seconds / 60)}m`;
};
