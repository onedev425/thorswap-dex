import { Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { getCustomIconImageUrl } from 'components/AssetIcon';

export enum VestingType {
  THOR = 'THOR',
  VTHOR = 'VTHOR',
}

export const vThorInfo = {
  ticker: 'vTHOR',
  decimals: 18,
  iconUrl: getCustomIconImageUrl('vthor'),
};

export const stakingV2Addr = {
  [VestingType.THOR]: '0xa5f2211B9b8170F694421f2046281775E8468044',
  [VestingType.VTHOR]: '0x815C23eCA83261b6Ec689b60Cc4a58b54BC24D8D',
};

export const getV2Address = (contractType: VestingType) => stakingV2Addr[contractType];

export const getV2Asset = (contractType: VestingType) => {
  return new Asset(Chain.Ethereum, `${contractType}-${getV2Address(contractType)}`);
};
