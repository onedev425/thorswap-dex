import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { t } from 'services/i18n';

export enum AirdropType {
  CLAIM = 'CLAIM',
  CLAIM_AND_STAKE = 'CLAIM_AND_STAKE',
}

export const airdropTabs = [
  {
    label: t('views.airdrop.claimAndStake'),
    value: AirdropType.CLAIM_AND_STAKE,
  },
  {
    label: t('views.airdrop.claim'),
    value: AirdropType.CLAIM,
  },
];

export const airdropAddresses = {
  [AirdropType.CLAIM]: '0xa5f2211B9b8170F694421f2046281775E8468044', // THOR contract
  [AirdropType.CLAIM_AND_STAKE]: '0x815C23eCA83261b6Ec689b60Cc4a58b54BC24D8D', // vTHOR contract
};

export const getV2Asset = (contractType: AirdropType) => {
  return new AssetEntity(
    Chain.Ethereum,
    `${contractType === AirdropType.CLAIM ? 'THOR' : 'vTHOR'}-${airdropAddresses[contractType]}`,
  );
};

export const airdropAssets: Record<AirdropType, AssetEntity> = {
  [AirdropType.CLAIM]: getV2Asset(AirdropType.CLAIM),
  [AirdropType.CLAIM_AND_STAKE]: getV2Asset(AirdropType.CLAIM_AND_STAKE),
};
