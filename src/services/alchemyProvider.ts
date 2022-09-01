import { AlchemyProvider } from '@ethersproject/providers';
import { IS_TESTNET } from 'settings/config';

let provider: AlchemyProvider;

export const alchemyProvider = () =>
  (provider ||= new AlchemyProvider(IS_TESTNET ? 3 : 1, import.meta.env.VITE_ALCHEMY_KEY));
