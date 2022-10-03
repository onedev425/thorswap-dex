import { Amount, Asset, AssetAmount } from '@thorswap-lib/multichain-core';
import { multichain } from 'services/multichain';
import { MultisigMember } from 'store/multisig/types';

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

export type Signer = {
  pubKey: string;
  signature: string;
};

export type BroadcastResponseData = {
  code: number;
  txhash: string;
  raw_log: string;
};

export type MultisigTx = {
  auth_info: Record<string, NotWorth>;
  body: {
    memo: string;
    messages: TxMessage[];
  };
  signatures: [];
};

export type ImportedMultisigTx = {
  txBody: MultisigTx;
  signatures: Signer[];
  signers: MultisigMember[];
};

type SignersSequence = boolean[];

export const createMultisigWallet = (members: MultisigMember[], treshold: number) => {
  try {
    multichain().thor.createMultisig(
      members.map((member) => member.pubKey),
      Number(treshold),
    );

    return multichain().thor.multisigAddress;
  } catch (e) {
    return '';
  }
};

export const clearMultisigWallet = () => {
  multichain().thor.clearMultisig();
};

export const importMultisigTx = async (txData: string) => {
  await multichain().thor.importMultisigTx(txData);

  return JSON.parse(txData) as MultisigTx;
};

const buildTransferTx = async (
  { recipient, memo, asset, amount }: MultisigTransferTxParams,
  signersSqeuence: SignersSequence,
) => {
  const unsignedTx = await multichain().thor.buildTransferTx(
    recipient,
    memo,
    asset,
    amount.baseAmount.toNumber(),
    signersSqeuence,
  );

  return unsignedTx;
};

const buildDepositTx = async (
  { memo, asset, amount }: MultisigDepositTxParams,
  signersSqeuence: SignersSequence,
) => {
  const unsignedTx = await multichain().thor.buildDepositTx(
    memo,
    asset,
    amount.baseAmount.toString(),
    signersSqeuence,
  );

  return unsignedTx;
};

const signMultisigTx = async (tx: string) => {
  const signature = await multichain().thor.signMultisigTx(tx);

  return signature;
};

const broadcastMultisigTx = async (tx: string, signers: Signer[]) => {
  const txPubKeys = JSON.parse(tx).auth_info.signer_infos[0].public_key.public_keys;
  const data = (await multichain().thor.broadcastMultisig(
    tx,
    signers
      .sort(
        (a, b) =>
          txPubKeys.findIndex((m: any) => m.key === a.pubKey) -
          txPubKeys.findIndex((m: any) => m.key === b.pubKey),
      )
      .map((signer) => signer.signature),
  )) as BroadcastResponseData;

  if (!data) return '';

  if (data.code > 0) {
    const message =
      data.raw_log && data.raw_log !== '[]' ? data.raw_log : 'Could not broadcast transaction.';

    throw Error(message);
  }
  return data.txhash;
};

const loadMultisigBalances = async (): Promise<AssetAmount[]> => {
  const address = multichain().thor.multisigAddress;

  if (address) {
    return multichain().thor.loadAddressBalances(address);
  }

  return [];
};

const getAssetBalance = (asset: Asset, balances: AssetAmount[]): AssetAmount => {
  const assetBalance = balances.find((data: AssetAmount) => data.asset.eq(asset));

  return assetBalance || new AssetAmount(asset, Amount.fromAssetAmount(0, asset.decimal));
};

const hasAsset = (asset: Asset, balances: AssetAmount[]): boolean => {
  const assetBalance = balances.find((data: AssetAmount) => data.asset.eq(asset));

  return !!assetBalance;
};

const getMemberPubkeyFromAddress = (address: string, members: MultisigMember[]) => {
  const member = members.find((m) => {
    const memberAddress = multichain().thor.pubKeyToAddr(m.pubKey);
    return memberAddress === address;
  });

  return member?.pubKey || '';
};

const isMultisigInitialized = () => {
  return multichain().thor.isMultisigInitialized();
};

const getSignersSequence = (allmembers: MultisigMember[], requiredSigners: MultisigMember[]) => {
  return allmembers.map((m) => !!requiredSigners.find((s) => s.pubKey === m.pubKey));
};

export const multisig = {
  createMultisigWallet,
  clearMultisigWallet,
  buildTransferTx,
  buildDepositTx,
  importMultisigTx,
  signMultisigTx,
  broadcastMultisigTx,
  getAssetBalance,
  hasAsset,
  loadMultisigBalances,
  getMemberPubkeyFromAddress,
  isMultisigInitialized,
  getSignersSequence,
};
