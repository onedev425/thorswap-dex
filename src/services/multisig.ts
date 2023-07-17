import { proto } from '@cosmos-client/core';
import { baseAmount, getTcNodeUrl } from '@thorswap-lib/helpers';
import { Amount, AssetAmount, AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Chain, ChainId } from '@thorswap-lib/types';
import { toByteArray } from 'base64-js';
import Long from 'long';
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

let _thorchainToolbox: ToDo | null = null;
let _multisigPubKey: proto.cosmos.crypto.multisig.LegacyAminoPubKey | null = null;
let _multisigAddress: string | null = null;

export const getMultisigAddress = () => _multisigAddress;

export const getThorchainToolbox = async () => {
  const { ThorchainToolbox } = await import('@thorswap-lib/toolbox-cosmos');

  return (_thorchainToolbox ||= ThorchainToolbox({}));
};

export const createMultisigWallet = async (members: MultisigMember[], treshold: number) => {
  try {
    _multisigPubKey = (await getThorchainToolbox()).createMultisig(
      members.map((member) => member.pubKey),
      Number(treshold),
    );
    _multisigPubKey!.constructor = proto.cosmos.crypto.multisig.LegacyAminoPubKey;
    _multisigAddress = (await getThorchainToolbox()).getMultisigAddress(_multisigPubKey);
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

export const importMultisigTx = async (txData: string) => {
  await (await getThorchainToolbox()).importMultisigTx((await getThorchainToolbox()).sdk, txData);

  return JSON.parse(txData) as MultisigTx;
};

const buildTransferTx = async (
  { recipient, memo, asset, amount }: MultisigTransferTxParams,
  signers: boolean[],
) => {
  if (!_multisigAddress || !_multisigPubKey) {
    throw new Error('Multisig wallet is not imported');
  }
  const {
    getThorchainDenom,
    DEFAULT_GAS_VALUE,
    buildTransferTx: buildThorchainTransferTx,
    buildUnsignedTx,
  } = await import('@thorswap-lib/toolbox-cosmos');
  const { cosmosclient } = await import('@cosmos-client/core');
  const thorchainToolbox = await getThorchainToolbox();

  const txBody = await buildThorchainTransferTx({
    memo,
    fromAddress: _multisigAddress,
    toAddress: recipient,
    chainId: ChainId.THORChain,
    assetDenom: getThorchainDenom(asset),
    nodeUrl: getTcNodeUrl(),
    assetAmount: baseAmount(amount.baseAmount.toNumber(), asset.decimal),
  });

  const account = await thorchainToolbox.getAccount(_multisigAddress);

  return buildUnsignedTx({
    cosmosSdk: thorchainToolbox.sdk,
    signerPubkey: cosmosclient.codec.instanceToProtoAny(_multisigPubKey),
    txBody,
    sequence: (account.sequence as Long) || Long.ZERO,
    gasLimit: DEFAULT_GAS_VALUE,
    signers,
  }).toProtoJSON();
};

const buildDepositTx = async (
  { memo, asset, amount }: MultisigDepositTxParams,
  signers: SignersSequence,
) => {
  if (!_multisigAddress || !_multisigPubKey) {
    throw new Error('Multisig wallet is not imported');
  }
  const {
    DEFAULT_GAS_VALUE,
    buildDepositTx: buildThorchainDepositTx,
    buildUnsignedTx,
  } = await import('@thorswap-lib/toolbox-cosmos');
  const { cosmosclient } = await import('@cosmos-client/core');

  const [chain, synthSymbol] = asset.symbol.split('/');
  const assetObj = synthSymbol
    ? {
        chain: chain as Chain,
        symbol: synthSymbol,
        ticker: synthSymbol,
        synth: true,
      }
    : asset;

  const fromAddressAcc = cosmosclient.AccAddress.fromPublicKey(_multisigPubKey);

  const txBody = await buildThorchainDepositTx({
    msgNativeTx: {
      memo,
      signer: fromAddressAcc,
      coins: [{ asset: assetObj, amount: amount.baseAmount.toString() }],
    },
    nodeUrl: getTcNodeUrl(),
    chainId: ChainId.THORChain,
  });

  const account = await (await getThorchainToolbox()).getAccount(_multisigAddress);

  return buildUnsignedTx({
    cosmosSdk: (await getThorchainToolbox()).sdk,
    signerPubkey: cosmosclient.codec.instanceToProtoAny(_multisigPubKey),
    txBody,
    sequence: (account.sequence as Long) || Long.ZERO,
    gasLimit: DEFAULT_GAS_VALUE,
    signers,
  }).toProtoJSON();
};

const signMultisigTx = async (privateKey: any, tx: string) => {
  const thorchainToolbox = await getThorchainToolbox();
  if (!_multisigAddress) {
    throw new Error('Multisig wallet is not correctly imported');
  }

  const importedTx = await thorchainToolbox.importMultisigTx(thorchainToolbox.sdk, JSON.parse(tx));

  let accAddress: Uint8Array | undefined = undefined;
  try {
    const message = (importedTx.toProtoJSON() as any).body.messages[0];
    const messageType = message['@type'] as string;
    accAddress = messageType.includes('MsgSend')
      ? toByteArray(message.fromAddress)
      : toByteArray(message.signer);
  } catch (error: NotWorth) {
    console.error(error);
  }

  const account = await thorchainToolbox.getAccount(accAddress || _multisigAddress);

  if (!account.account_number) {
    throw new Error('Account number is not defined');
  }

  const signDocBytes = importedTx.signDocBytes(account.account_number as Long);

  const signature = privateKey.sign(signDocBytes);

  return thorchainToolbox.exportSignature(signature);
};

const broadcastMultisigTx = async (tx: string, signers: Signer[]) => {
  const thorchainToolbox = await getThorchainToolbox();
  const txObj = JSON.parse(tx);
  const txPubKeys = txObj.auth_info.signer_infos[0].public_key.public_keys;

  const data = (await thorchainToolbox.broadcastMultisig(
    thorchainToolbox.sdk,
    txObj,
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
  } catch (error: NotWorth) {
    console.error(error);
    return false;
  }
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
  isMultisigInitialized,
  getSignersSequence,
};
