import { AssetEntity as Asset, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { isETHAsset } from 'helpers/assets';

export enum ROUTES {
  AddLiquidity = '/add',
  AddLiquidityPool = '/add/:assetParam',
  CreateLiquidity = '/create',
  Home = '/dashboard',
  Kyber = '/kyber',
  KyberPair = '/kyber/:pair',
  Liquidity = '/liquidity',
  NodeDetail = '/nodes/:nodeAddress',
  NodeManager = '/node-manager',
  Nodes = '/nodes',
  Send = '/send',
  SendAsset = '/send/:assetParam',
  LegacyStake = '/legacy_stake',
  Stake = '/stake',
  Stats = '/stats',
  Swap = '/swap',
  SwapPair = '/swap/:pair',
  Thorname = '/thorname',
  UpgradeRune = '/upgrade',
  Vesting = '/vesting',
  Airdrop = '/airdrop',
  Wallet = '/wallet',
  WithdrawLiquidity = '/withdraw',
  WithdrawLiquidityPool = '/withdraw/:assetParam',
  Multisig = '/thorsafe',
  MultisigConnect = '/thorsafe/connect',
  MultisigCreate = '/thorsafe/create',
  TxBuilder = '/txbuilder',
  TxCreate = '/txcreate',
  TxCreatePool = '/txcreate/:assetParam',
  TxImport = '/tximport',
  TxMultisig = '/txthorsafe',
  OnRamp = '/onramp',
  Earn = '/earn',
  Transaction = '/tx/:txid',

  NewLiquidity = '/new-liquidity',
}

export const THORYIELD_ROUTE = 'https://app.thoryield.com';
export const THORYIELD_LP_PATH = 'accounts';
export const THORYIELD_STATS_ROUTE = 'https://app.thoryield.com/stats';

const getAssetRoute = (route: ROUTES, asset?: Asset) =>
  `${route}${asset ? `/${asset.toURLEncoded()}` : ''}`;

const navigateToExternalLink = (url: string) => {
  window.open(url, '_blank noreferrer noopener');
};

export const getAddLiquidityRoute = (asset?: Asset) => {
  return getAssetRoute(ROUTES.AddLiquidity, asset);
};

export const getWithdrawRoute = (asset?: Asset) => {
  return getAssetRoute(ROUTES.WithdrawLiquidity, asset);
};

export const getSendRoute = (asset?: Asset, recipient?: string) => {
  const route = getAssetRoute(ROUTES.Send, asset);
  const query = recipient ? `?recipient=${recipient}` : '';
  return `${route}${query}`;
};

export const getMultisigTxCreateRoute = (asset?: Asset) => {
  return getAssetRoute(ROUTES.TxCreate, asset);
};

export const getSwapRoute = (
  input: Asset,
  output: Asset = getSignatureAssetFor(Chain.Ethereum),
) => {
  const outputAsset =
    isETHAsset(input) && isETHAsset(output) ? getSignatureAssetFor('ETH_THOR') : output;

  return `${ROUTES.Swap}/${input.toURLEncoded()}_${outputAsset.toURLEncoded()}`;
};

export const getKyberSwapRoute = (
  input: Asset,
  output: Asset = getSignatureAssetFor(Chain.Ethereum),
) => {
  const outputAsset =
    isETHAsset(input) && isETHAsset(output) ? getSignatureAssetFor('ETH_THOR') : output;

  return `${ROUTES.Kyber}/${input.toURLEncoded()}_${outputAsset.toURLEncoded()}`;
};

export const navigateToPoolDetail = (asset: Asset) => {
  navigateToExternalLink(`${THORYIELD_ROUTE}/token/${asset.toURLEncoded()}`);
};

export const navigateToEtherScanAddress = (address: string) => {
  navigateToExternalLink(`https://etherscan.io/token/${address}`);
};

export const navigateToSnowtraceAddress = (address: string) => {
  navigateToExternalLink(`https://snowtrace.io/address/${address}`);
};

export const getNodeDetailRoute = (address: string) => {
  return `${ROUTES.Nodes}/${address}`;
};

export const getThorYieldLPInfoRoute = ({ chain, address }: { chain: Chain; address: string }) =>
  `${THORYIELD_ROUTE}/${THORYIELD_LP_PATH}?${chain.toLowerCase()}=${address}`;

export const getThorYieldLPInfoBaseRoute = () => `${THORYIELD_ROUTE}/${THORYIELD_LP_PATH}`;
