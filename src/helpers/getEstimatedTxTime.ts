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
  [Chain.Base]: 0,
};

export const blockLuckyReward: Record<Chain, string> = {
  [Chain.Bitcoin]: "bc1qst6j9m4kv7x43dz282rl4y49vtsxpuvrp7w323",
  [Chain.BitcoinCash]: "qpppt3436kec8jc0kesks8g2ul4y5krex5spcxcgq6",
  [Chain.Litecoin]: "ltc1q3xev0tskw5rlm50qvslg6uqceqysnu2y822ltn",
  [Chain.Dogecoin]: "DEBD2akCLLoVH6XT7HGRC5bpmXMpx1Sqeq",
  [Chain.Ethereum]: "0x0542dd27bfd07c6daf0f8b0b79ff44445fbb9add",
  [Chain.THORChain]: "thor1nym3jm0dzwhfupjgedr47m7du538qncj0r9avx",
  [Chain.Avalanche]: "0x0542dd27bfd07c6daf0f8b0b79ff44445fbb9add",
  [Chain.Cosmos]: "cosmos1lfg3njsytghr8z7fmg5n8lgmt0hznmeg97xkag",
  [Chain.Maya]: "maya1nym3jm0dzwhfupjgedr47m7du538qncj05m36k",
  [Chain.Kujira]: "kujira1lfg3njsytghr8z7fmg5n8lgmt0hznmeg5kywsz",
  [Chain.Optimism]: "",
  [Chain.Arbitrum]: "0x0542dd27bfd07c6daf0f8b0b79ff44445fbb9add",
  [Chain.Polygon]: "0x0542dd27bfd07c6daf0f8b0b79ff44445fbb9add",
  [Chain.BinanceSmartChain]: "0x0542dd27bfd07c6daf0f8b0b79ff44445fbb9add",
  [Chain.Dash]: "",
  [Chain.Chainflip]: "",
  [Chain.Polkadot]: "",
  [Chain.Solana]: "",
  [Chain.Radix]: "",
  [Chain.Base]: "",
};

// time secs for 1 block confirmation
export const blockTime: Record<Chain, number> = {
  [Chain.Arbitrum]: 50,
  [Chain.Avalanche]: 3,
  [Chain.Base]: 2,
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
