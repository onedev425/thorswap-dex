import { ETH_DECIMAL } from '@thorswap-lib/multichain-core';
import { Chain, erc20ABI } from '@thorswap-lib/types';
import { getCustomContract } from 'services/contract';

type GetDecimalParams = { symbol: string; ticker: string };

const getERC20Decimal = async ({ symbol, ticker }: GetDecimalParams) => {
  if (symbol === Chain.Ethereum) return ETH_DECIMAL;

  const assetAddress = symbol.slice(ticker.length + 1);

  const contract = getCustomContract(assetAddress, erc20ABI);
  const contractDecimals = await contract.decimals();

  return contractDecimals.toNumber() as number;
};

const getARC20Decimal = async ({ symbol }: GetDecimalParams) =>
  symbol.startsWith('USD') ? 6 : ETH_DECIMAL;

export const getEVMDecimal = async ({
  L1Chain,
  ...asset
}: GetDecimalParams & { L1Chain: Chain }) => {
  switch (L1Chain) {
    case Chain.Ethereum:
      return getERC20Decimal(asset);
    case Chain.Avalanche:
      return getARC20Decimal(asset);
    default:
      return undefined;
  }
};
