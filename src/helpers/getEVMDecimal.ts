import { getAddress } from '@ethersproject/address';
import { Contract } from '@ethersproject/contracts';
import { Asset, ETH_DECIMAL } from '@thorswap-lib/multichain-core';
import { Chain, erc20ABI } from '@thorswap-lib/types';
import { alchemyProvider } from 'services/alchemyProvider';

export const getERC20Decimal = async (asset: Asset) => {
  if (asset.symbol === Chain.Ethereum) return ETH_DECIMAL;

  const assetAddress = asset.symbol.slice(asset.ticker.length + 1);
  const checkSummedAddress = getAddress(assetAddress.slice(2));

  const contract = new Contract(checkSummedAddress, erc20ABI, alchemyProvider());
  return (await contract.decimals()).toNumber();
};

export const getARC20Decimal = async (asset: Asset) => {
  if (asset.symbol === Chain.Avalanche) return ETH_DECIMAL;

  const assetAddress = asset.symbol.slice(asset.ticker.length + 1);
  const checkSummedAddress = getAddress(assetAddress.slice(2));

  const contract = new Contract(checkSummedAddress, erc20ABI, alchemyProvider());
  return (await contract.decimals()).toNumber();
};
