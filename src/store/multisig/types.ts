import type { AssetAmount } from '@thorswap-lib/swapkit-core';

export type MultisigMember = { name: string; pubKey: string };

export type MultisigWallet = {
  address: string;
  members: MultisigMember[];
  name: string;
  threshold: number;
};

export type State = MultisigWallet & {
  balances: AssetAmount[];
  loadingBalances: boolean;
};
