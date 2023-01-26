import { Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { ContractType, LPContractType } from 'services/contract';

export const tokenAddr = {
  THOR: '0xa5f2211B9b8170F694421f2046281775E8468044',
  ETH_THOR: '0x3D3F13F2529eC3C84B2940155EffBf9b39a8f3Ec',
  THOR_STAKE: '0x6755630c583f12fFBD10568EB633c0319dB34922',
  SUSHI_STAKE: '0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24',
};

export const farmData = [
  {
    farmName: '$THOR Staking',
    assets: [new Asset(Chain.Ethereum, `THOR-${tokenAddr.THOR}`)],
    lpAsset: new Asset(Chain.Ethereum, `THOR-${tokenAddr.THOR}`),
    lpToken: tokenAddr.THOR,
    contractType: ContractType.STAKING_THOR,
    lpContractType: LPContractType.THOR,
    stakeAddr: tokenAddr.THOR_STAKE,
    exchange: 'THORSwap',
  },
  {
    farmName: 'ETH-THOR LP',
    assets: [Asset.ETH(), new Asset(Chain.Ethereum, `THOR-${tokenAddr.THOR}`)],
    lpAsset: new Asset(Chain.Ethereum, `SLP-${tokenAddr.ETH_THOR}`),
    lpToken: tokenAddr.ETH_THOR,
    contractType: ContractType.STAKING_SUSHI_WETH,
    lpContractType: LPContractType.THOR_ETH,
    stakeAddr: tokenAddr.SUSHI_STAKE,
    exchange: 'SushiSwap',
  },
];

export const tcFarmData = {
  farmName: 'RUNE-THOR',
  assets: [new Asset(Chain.Ethereum, `THOR-${tokenAddr.THOR}`), Asset.RUNE()],
  lpToken: tokenAddr.THOR,
  contractType: ContractType.STAKING_THOR,
  exchange: 'THORSwap',
};
