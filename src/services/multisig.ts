import { baseAmount } from '@thorswap-lib/helpers';
import type { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Amount, AssetAmount } from '@thorswap-lib/swapkit-core';
import type {
  MultisigThresholdPubkey,
  Signer,
  ThorchainToolbox,
} from '@thorswap-lib/toolbox-cosmos';
import type { MultisigMember } from 'store/multisig/types';

export type MultisigTransferTxParams = {
  recipient: string;
  memo: string;
  asset: Asset;
  amount: Amount;
};

export type MultisigDepositTxParams = {
  memo: string;
  asset: Asset;
  amount: Amount;
};

export type TxAmount = {
  denom: string;
  amount: string;
};

export type TxMessage = {
  '@type': string;
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
};

let _thorchainToolbox: ReturnType<typeof ThorchainToolbox> | null = null;
let _multisigPubKey: MultisigThresholdPubkey | null = null;
let _multisigAddress: string | null = null;

export const getMultisigAddress = () => _multisigAddress;

export const getThorchainToolbox = async () => {
  const { ThorchainToolbox } = await import('@thorswap-lib/toolbox-cosmos');

  return (_thorchainToolbox ||= ThorchainToolbox({}));
};

export const createMultisigWallet = async (members: MultisigMember[], threshold: number) => {
  try {
    const toolbox = await getThorchainToolbox();
    _multisigPubKey = await toolbox.createMultisig(
      members.map((member) => member.pubKey),
      threshold,
    );
    _multisigAddress = await toolbox.pubkeyToAddress(_multisigPubKey, 'thor');
    return _multisigAddress;
  } catch (error: NotWorth) {
    console.error(error);
    return '';
  }
};

export const clearMultisigWallet = () => {
  _multisigPubKey = null;
  _multisigAddress = null;
};

const buildTransferTx = async ({ recipient, memo, asset, amount }: MultisigTransferTxParams) => {
  if (!_multisigAddress || !_multisigPubKey) {
    throw new Error('Multisig wallet is not imported');
  }
  const { getThorchainDenom, buildTransferTx: buildThorchainTransferTx } = await import(
    '@thorswap-lib/toolbox-cosmos'
  );

  const transferTx = await buildThorchainTransferTx({
    memo,
    fromAddress: _multisigAddress,
    toAddress: recipient,
    assetDenom: getThorchainDenom(asset),
    assetAmount: baseAmount(amount.baseAmount.toNumber(), asset.decimal),
  });

  return transferTx;
};

const buildDepositTx = async ({ memo, asset, amount }: MultisigDepositTxParams) => {
  if (!_multisigAddress || !_multisigPubKey) {
    throw new Error('Multisig wallet is not imported');
  }
  const { buildDepositTx: buildThorchainDepositTx } = await import('@thorswap-lib/toolbox-cosmos');

  const depositTx = await buildThorchainDepositTx({
    signer: _multisigAddress,
    memo,
    asset,
    assetAmount: baseAmount(amount.baseAmount.toNumber(), asset.decimal),
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
  threshold: number,
  bodyBytes: Uint8Array,
) => {
  const toolbox = await getThorchainToolbox();
  return toolbox.broadcastMultisigTx(tx, signers, threshold, bodyBytes);
};

const loadMultisigBalances = async (): Promise<AssetAmount[]> =>
  _multisigAddress ? (await getThorchainToolbox()).loadAddressBalances(_multisigAddress) : [];

const getAssetBalance = (asset: Asset, balances: AssetAmount[]): AssetAmount => {
  const assetBalance = balances.find((data: AssetAmount) => data.asset.eq(asset));

  return assetBalance || new AssetAmount(asset, Amount.fromAssetAmount(0, asset.decimal));
};

const hasAsset = (asset: Asset, balances: AssetAmount[]): boolean => {
  const assetBalance = balances.find((data: AssetAmount) => data.asset.eq(asset));

  return !!assetBalance;
};

export const isMultisigInitialized = async () => {
  try {
    if (!_multisigAddress) return false;

    return !!(await (await getThorchainToolbox()).getAccount(_multisigAddress));
  } catch (error: any) {
    console.error(error);
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
