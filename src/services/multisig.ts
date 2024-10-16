import type { MultisigThresholdPubkey } from "@cosmjs/amino";
import type { AssetValue, Chain } from "@swapkit/sdk";
import type { Signer, ThorchainToolbox } from "@swapkit/toolbox-cosmos";
import { logException } from "services/logger";
import type { MultisigMember } from "store/multisig/types";

export type MultisigTransferTxParams = {
  recipient: string;
  memo: string;
  assetValue: AssetValue;
};

export type MultisigDepositTxParams = {
  memo: string;
  assetValue: AssetValue;
};

export type TxAmount = {
  denom: string;
  amount: string;
};

export type TxMessage = {
  "@type": string;
  fromAddress: string;
  toAddress: string;
  amount: TxAmount[];
};

export type MultisigTx = {
  accountNumber: number;
  sequence: number;
  chainId: string;
  msgs: TxMessage[];
};

export type ImportedMultisigTx = {
  txBody: MultisigTx;
  members: MultisigMember[];
  signatures: Signer[];
  threshold: number;
  bodyBytes: number[];
};

let _thorchainToolbox: ReturnType<typeof ThorchainToolbox> | null = null;
let _multisigPubKey: MultisigThresholdPubkey | null = null;
let _multisigAddress: string | null = null;

export const getMultisigAddress = () => _multisigAddress;

export const getThorchainToolbox = async () => {
  const { ThorchainToolbox } = await import("@swapkit/toolbox-cosmos");

  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  return (_thorchainToolbox ||= ThorchainToolbox({}));
};

export const createMultisigWallet = async (members: MultisigMember[], threshold: number) => {
  try {
    const toolbox = await getThorchainToolbox();
    _multisigPubKey = await toolbox.createMultisig(
      members.map((member) => member.pubKey),
      Number(threshold),
    );
    _multisigAddress = await toolbox.pubkeyToAddress(_multisigPubKey, "thor");
    return _multisigAddress;
  } catch (error) {
    logException(error as Error);
    return "";
  }
};

export const clearMultisigWallet = () => {
  _multisigPubKey = null;
  _multisigAddress = null;
};

const buildTransferTx = async ({ recipient, memo, assetValue }: MultisigTransferTxParams) => {
  if (!(_multisigAddress && _multisigPubKey)) {
    throw new Error("Multisig wallet is not imported");
  }
  const { buildTransaction } = await import("@swapkit/toolbox-cosmos");

  const transferTx = await buildTransaction({
    chain: assetValue.chain as Chain.Maya | Chain.THORChain,
    memo,
    from: _multisigAddress,
    recipient: recipient,
    assetValue,
  });

  return transferTx;
};

const buildDepositTx = async ({ memo, assetValue }: MultisigDepositTxParams) => {
  if (!(_multisigAddress && _multisigPubKey)) {
    throw new Error("Multisig wallet is not imported");
  }
  const { buildTransaction } = await import("@swapkit/toolbox-cosmos");

  const depositTx = await buildTransaction({
    chain: assetValue.chain as Chain.Maya | Chain.THORChain,
    from: _multisigAddress,
    memo,
    assetValue,
    recipient: "",
  });

  return depositTx;
};

const signMultisigTx = async (phrase: string, tx: string) => {
  const toolbox = await getThorchainToolbox();
  const wallet = await toolbox.secp256k1HdWalletFromMnemonic(phrase);
  return toolbox.signMultisigTx(wallet, tx);
};

const broadcastMultisigTx = async (
  tx: string,
  signers: Signer[],
  members: MultisigMember[],
  threshold: number,
  bodyBytes: Uint8Array,
) => {
  const toolbox = await getThorchainToolbox();
  return toolbox.broadcastMultisigTx(
    tx,
    signers,
    members.map((member) => member.pubKey),
    threshold,
    bodyBytes,
  );
};

const loadMultisigBalances = async () =>
  _multisigAddress ? (await getThorchainToolbox()).loadAddressBalances(_multisigAddress) : [];

const getAssetBalance = (asset: AssetValue, balances: AssetValue[]) => {
  const assetBalance = balances.find((balance) => balance.eqAsset(asset));

  return assetBalance || asset.set(0);
};

const hasAsset = (asset: AssetValue, balances: AssetValue[]): boolean => {
  const assetBalance = balances.find((balance: AssetValue) => balance.eqAsset(asset));

  return !!assetBalance;
};

export const isMultisigInitialized = async () => {
  try {
    if (!_multisigAddress) return false;

    return !!(await (await getThorchainToolbox()).getAccount(_multisigAddress));
  } catch (error) {
    logException(error as Error);
    return false;
  }
};

export const multisig = {
  createMultisigWallet,
  clearMultisigWallet,
  buildTransferTx,
  buildDepositTx,
  signMultisigTx,
  broadcastMultisigTx,
  getAssetBalance,
  hasAsset,
  loadMultisigBalances,
  isMultisigInitialized,
};
