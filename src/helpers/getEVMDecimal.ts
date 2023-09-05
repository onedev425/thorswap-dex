import { BaseDecimal, Chain, erc20ABI } from '@thorswap-lib/types';
import { getCustomContract } from 'services/contract';

type GetDecimalParams = { symbol: string; ticker: string };

const getEthereumAssetDecimal = async ({ symbol, ticker }: GetDecimalParams) => {
  if (symbol === Chain.Ethereum) return BaseDecimal.ETH;

  const assetAddress = symbol.slice(ticker.length + 1);

  const contract = await getCustomContract(assetAddress, erc20ABI);
  const contractDecimals = await contract.decimals();

  return contractDecimals.toNumber() as number;
};

const getAvaxAssetDecimal = async ({ symbol }: GetDecimalParams) => {
  if (symbol.startsWith('USDT') || symbol.startsWith('USDC') || symbol === 'UST') return 6;
  if (['BTC.b', 'WBTC.e'].includes(symbol)) return 8;
  if (symbol === 'Time') return 9;

  return BaseDecimal.ETH;
};

const getBscAssetDecimal = async ({ symbol }: GetDecimalParams) => {
  if (symbol === Chain.Ethereum) return BaseDecimal.BSC;

  return BaseDecimal.BSC;

  // TODO (BSC): implement this function
  // const assetAddress = symbol.slice(ticker.length + 1);

  // const contract = getCustomContract(assetAddress, erc20ABI);
  // const contractDecimals = await contract.decimals();

  // return contractDecimals.toNumber() as number;
};

export const getEVMDecimal = async ({
  L1Chain,
  ...asset
}: GetDecimalParams & { L1Chain: Chain }) => {
  switch (L1Chain) {
    case Chain.Ethereum:
      return getEthereumAssetDecimal(asset);
    case Chain.Avalanche:
      return getAvaxAssetDecimal(asset);
    case Chain.BinanceSmartChain:
      return getBscAssetDecimal(asset);
    default:
      return undefined;
  }
};
