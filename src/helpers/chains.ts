import { Chain } from "@swapkit/sdk";
import { SORTED_CHAINS } from "settings/chain";

export const sortChains = (chains: string[]) => {
  const sorted: Chain[] = [];

  for (const chain of SORTED_CHAINS) {
    if (chains.includes(chain)) sorted.push(chain);
  }

  return sorted;
};

export const getChainIdentifier = (chain: Chain) => {
  switch (chain) {
    case Chain.THORChain:
      return `${chain}.RUNE`;

    case Chain.Cosmos:
      return `${chain}.ATOM`;

    case Chain.BinanceSmartChain:
      return `${chain}`;

    default:
      return `${chain}.${chain}`;
  }
};
