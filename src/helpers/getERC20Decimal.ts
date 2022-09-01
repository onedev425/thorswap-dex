import { getAddress } from '@ethersproject/address';
import { Contract } from '@ethersproject/contracts';
import { Asset, ETH_DECIMAL } from '@thorswap-lib/multichain-sdk';
import { erc20ABI } from '@thorswap-lib/types';
import { alchemyProvider } from 'services/alchemyProvider';

export const getERC20Decimal = async (asset: Asset) => {
  if (asset.symbol === 'ETH') return ETH_DECIMAL;

  const assetAddress = asset.symbol.slice(asset.ticker.length + 1);
  const checkSummedAddress = getAddress(assetAddress.slice(2));

  const contract = new Contract(checkSummedAddress, erc20ABI, alchemyProvider());
  return (await contract.decimals()).toNumber();
};
