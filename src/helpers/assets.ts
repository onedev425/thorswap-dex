import { Asset } from '@thorswap-lib/multichain-sdk';
import { Chain, Network } from '@thorswap-lib/types';
import { getCustomIconImageUrl } from 'components/AssetIcon';
import { NETWORK } from 'settings/config';

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
  [VestingType.THOR]: {
    [Network.Mainnet]: '0xa5f2211B9b8170F694421f2046281775E8468044',
    [Network.Testnet]: '0xe247EFF2915Cb56Ec7a4DB3aE7b923326752E92C',
  },
  [VestingType.VTHOR]: {
    [Network.Mainnet]: '0x815C23eCA83261b6Ec689b60Cc4a58b54BC24D8D',
    [Network.Testnet]: '0x9783e4A7F0BF047Fd7982e75A1A1C8023a7d6A92',
  },
};

export const getV2Address = (contractType: VestingType) => stakingV2Addr[contractType][NETWORK];

export const getV2Asset = (contractType: VestingType) => {
  return new Asset(Chain.Ethereum, `${contractType}-${getV2Address(contractType)}`);
};
