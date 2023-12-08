import { AssetValue, Chain } from '@swapkit/core';
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
  Vesting = '/vesting',
  Wallet = '/wallet',
  WithdrawLiquidity = '/withdraw',
  WithdrawLiquidityPool = '/withdraw/:assetParam',
  Multisig = '/thorsafe',
  MultisigConnect = '/thorsafe/connect',
  MultisigCreate = '/thorsafe/create',
  ToS = '/tos',
  TxBuilder = '/txbuilder',
  TxCreate = '/txcreate',
  TxCreatePool = '/txcreate/:assetParam',
  TxImport = '/tximport',
  TxMultisig = '/txthorsafe',
  Earn = '/earn',
  EarnAsset = '/earn/:asset',
  Lending = '/lending',
  LendingAsset = '/lending/:asset',
  Transaction = '/tx/:txid',
}

export const THORYIELD_ROUTE = 'https://app.thoryield.com';
export const THORYIELD_LP_PATH = 'accounts';
export const THORYIELD_STATS_ROUTE = 'https://app.thoryield.com/stats';

const getAssetRoute = (route: ROUTES, asset?: AssetValue) =>
  `${route}${asset ? `/${asset.toUrl()}` : ''}`;

export const navigateToExternalLink = (url: string) => {
  window.open(url, '_blank noreferrer noopener');
};

export const getAddLiquidityRoute = (asset?: AssetValue) => {
  return getAssetRoute(ROUTES.AddLiquidity, asset);
};

export const getWithdrawRoute = (asset?: AssetValue) => {
  return getAssetRoute(ROUTES.WithdrawLiquidity, asset);
};

export const getSendRoute = (asset?: AssetValue, recipient?: string) => {
  const route = getAssetRoute(ROUTES.Send, asset);
  const query = recipient ? `?recipient=${recipient}` : '';
  return `${route}${query}`;
};

export const getMultisigTxCreateRoute = (asset?: AssetValue) => {
  return getAssetRoute(ROUTES.TxCreate, asset);
};

export const getSwapRoute = (
  input: AssetValue,
  output: AssetValue = AssetValue.fromChainOrSignature(Chain.Ethereum),
  route = ROUTES.Swap,
) => {
  const outputAsset =
    isETHAsset(input) && isETHAsset(output) ? AssetValue.fromChainOrSignature('ETH.THOR') : output;

  const inputString = input.isSynthetic
    ? `THOR.${input.symbol.replace('/', '.')}`
    : input.toString();
  const outputString = outputAsset.isSynthetic
    ? `THOR.${outputAsset.symbol.replace('/', '.')}`
    : outputAsset.toString();

  const assetUrl = `${inputString}_${outputString}`.replace(/\//g, '.');

  return `${route}/${assetUrl}`;
};

export const getKyberSwapRoute = (
  input: AssetValue,
  output: AssetValue = AssetValue.fromChainOrSignature(Chain.Ethereum),
) => {
  return getSwapRoute(input, output, ROUTES.Kyber);
};

export const navigateToPoolDetail = (asset: AssetValue) => {
  navigateToExternalLink(`${THORYIELD_ROUTE}/token/${asset.toString()}`);
};

export const navigateToEtherScanAddress = (address: string) => {
  navigateToExternalLink(`https://etherscan.io/token/${address}`);
};

export const navigateToSnowtraceAddress = (address: string) => {
  navigateToExternalLink(`https://snowtrace.io/address/${address}`);
};

export const navigateToBscscanAddress = (address: string) => {
  navigateToExternalLink(`https://bscscan.com/address/${address}`);
};

export const getNodeDetailRoute = (address: string) => {
  return `${ROUTES.Nodes}/${address}`;
};

export const getThorYieldLPInfoRoute = ({ chain, address }: { chain: Chain; address: string }) =>
  `${THORYIELD_ROUTE}/${THORYIELD_LP_PATH}?${chain.toLowerCase()}=${address}`;

export const getThorYieldLPInfoBaseRoute = () => `${THORYIELD_ROUTE}/${THORYIELD_LP_PATH}`;
