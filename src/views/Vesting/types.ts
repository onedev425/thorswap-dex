import { Asset } from '@thorswap-lib/multichain-core';
import { Chain, Network } from '@thorswap-lib/types';
import { t } from 'services/i18n';
import { NETWORK } from 'settings/config';

export enum VestingType {
  THOR = 'THOR',
  VTHOR = 'VTHOR',
}

export const vestingTabs = [
  {
    label: t('views.vesting.vestingThor'),
    value: VestingType.THOR,
  },
  {
    label: t('views.vesting.vestingVthor'),
    value: VestingType.VTHOR,
  },
];

export type VestingScheduleInfo = {
  // total vested amount
  totalVestedAmount: string;
  // total claimed amount
  totalClaimedAmount: number;
  // vesting start time
  startTime: string;
  // vesting period (in years)
  vestingPeriod: number;
  // cliff period (in months)
  cliff: number;
  // initial release at TGE
  initialRelease: string;
  // claimable amount
  claimableAmount: number;
};

export const defaultVestingInfo: VestingScheduleInfo = {
  totalVestedAmount: 'N/A',
  totalClaimedAmount: 0,
  startTime: '-',
  vestingPeriod: 0,
  cliff: 0,
  initialRelease: '-',
  claimableAmount: 0,
};

export type VestingInfo = Record<VestingType, VestingScheduleInfo>;

export const initialVestingInfo: VestingInfo = {
  [VestingType.THOR]: defaultVestingInfo,
  [VestingType.VTHOR]: defaultVestingInfo,
};

export const vestingAddr = {
  [VestingType.THOR]: {
    [Network.Mainnet]: '0xa5f2211B9b8170F694421f2046281775E8468044',
    [Network.Testnet]: '0xe247EFF2915Cb56Ec7a4DB3aE7b923326752E92C',
  },
  [VestingType.VTHOR]: {
    [Network.Mainnet]: '0x815C23eCA83261b6Ec689b60Cc4a58b54BC24D8D',
    [Network.Testnet]: '0x9783e4A7F0BF047Fd7982e75A1A1C8023a7d6A92',
  },
};

export const getV2Asset = (contractType: VestingType) => {
  return new Asset(Chain.Ethereum, `${contractType}-${vestingAddr[contractType][NETWORK]}`);
};

export const vestingAssets: Record<VestingType, Asset> = {
  [VestingType.THOR]: getV2Asset(VestingType.THOR),
  [VestingType.VTHOR]: getV2Asset(VestingType.VTHOR),
};
