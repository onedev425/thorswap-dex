import type { AssetValue } from "@swapkit/sdk";

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
