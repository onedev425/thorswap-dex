import type { AssetValue, SwapKitNumber } from "@swapkit/sdk";
import { Chain } from "@swapkit/sdk";

export const blockReward: Record<Chain, number> = {
  [Chain.Bitcoin]: 6.25,
  [Chain.BitcoinCash]: 6.25,
  [Chain.Litecoin]: 12.5,
  [Chain.Dogecoin]: 10000,
  [Chain.Ethereum]: 3,
  [Chain.THORChain]: 0,
  [Chain.Avalanche]: 0,
  [Chain.Cosmos]: 0,
  [Chain.Maya]: 0,
  [Chain.Kujira]: 0,
  [Chain.Optimism]: 0,
  [Chain.Arbitrum]: 0,
  [Chain.Polygon]: 0,
  [Chain.BinanceSmartChain]: 0,
  [Chain.Dash]: 0,
  [Chain.Chainflip]: 0,
  [Chain.Polkadot]: 0,
  [Chain.Solana]: 0,
  [Chain.Radix]: 0,
};

// time secs for 1 block confirmation
export const blockTime: Record<Chain, number> = {
  [Chain.Arbitrum]: 50,
  [Chain.Avalanche]: 3,
  [Chain.BinanceSmartChain]: 3,
  [Chain.Bitcoin]: 600,
  [Chain.BitcoinCash]: 600,
  [Chain.Chainflip]: 5,
  [Chain.Cosmos]: 1,
  [Chain.Dash]: 150,
  [Chain.Dogecoin]: 600,
  [Chain.Ethereum]: 12,
  [Chain.Kujira]: 2,
  [Chain.Litecoin]: 150,
  [Chain.Maya]: 6,
  [Chain.Optimism]: 1,
  [Chain.Polkadot]: 6,
  [Chain.Polygon]: 2,
  [Chain.THORChain]: 6,
  [Chain.Solana]: 1,
  [Chain.Radix]: 5,
};

const getEstimatedTxSeconds = ({
  chain,
  amount,
}: {
  chain: Chain;
  amount?: SwapKitNumber | AssetValue;
}) => {
  const chainBlockReward = blockReward?.[chain] ?? 0;
  const chainBlockTime = blockTime?.[chain] ?? 0;

  if (!chainBlockReward) return 0;

  const block = Math.ceil(amount?.getValue("number") || 0 / chainBlockReward);
  return block * chainBlockTime;
};

export const getEstimatedTxTime = ({
  chain,
  amount,
}: {
  chain: Chain;
  amount?: SwapKitNumber | AssetValue;
}) => {
  const seconds = getEstimatedTxSeconds({ chain, amount });

  if (!seconds) return "<5s";
  if (seconds < 60) return `<${seconds}s`;
  return `<${Math.ceil(seconds / 60)}m`;
};
