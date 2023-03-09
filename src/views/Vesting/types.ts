import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { t } from 'services/i18n';

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
  [VestingType.THOR]: '0xa5f2211B9b8170F694421f2046281775E8468044',
  [VestingType.VTHOR]: '0x815C23eCA83261b6Ec689b60Cc4a58b54BC24D8D',
};

export const getV2Asset = (contractType: VestingType) => {
  return new AssetEntity(Chain.Ethereum, `${contractType}-${vestingAddr[contractType]}`);
};

export const vestingAssets: Record<VestingType, AssetEntity> = {
  [VestingType.THOR]: getV2Asset(VestingType.THOR),
  [VestingType.VTHOR]: getV2Asset(VestingType.VTHOR),
};
