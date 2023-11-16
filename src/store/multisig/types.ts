import type { AssetValue } from '@swapkit/core';

export type MultisigMember = { name: string; pubKey: string };

export type MultisigWallet = {
  address: string;
  members: MultisigMember[];
  name: string;
  threshold: number;
};

export type State = MultisigWallet & {
  balances: AssetValue[];
  loadingBalances: boolean;
};
