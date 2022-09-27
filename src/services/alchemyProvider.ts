import { AlchemyProvider } from '@ethersproject/providers';
import { ChainId } from '@thorswap-lib/types';

let provider: AlchemyProvider;

export const alchemyProvider = () =>
  (provider ||= new AlchemyProvider(ChainId.Ethereum, import.meta.env.VITE_ALCHEMY_KEY));
