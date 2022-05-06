import { Asset } from '@thorswap-lib/multichain-sdk'
import { Network } from '@thorswap-lib/xchain-client'
import { Chain } from '@thorswap-lib/xchain-util'

import { ContractType, LPContractType } from 'services/contract'

import { config } from 'settings/config'

export const tokenAddr = {
  [Network.Mainnet]: {
    THOR: '0xa5f2211B9b8170F694421f2046281775E8468044',
    ETH_THOR: '0x3D3F13F2529eC3C84B2940155EffBf9b39a8f3Ec',
    THOR_STAKE: '0x6755630c583f12fFBD10568EB633c0319dB34922',
    SUSHI_STAKE: '0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24',
  },
  [Network.Testnet]: {
    THOR: '0xe247eff2915cb56ec7a4db3ae7b923326752e92c',
    ETH_THOR: '0x3D3F13F2529eC3C84B2940155EffBf9b39a8f3Ec',
    THOR_STAKE: '0x22441f0cefe0110951fab63cbfb844e535232311',
    SUSHI_STAKE: '0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24',
  },
}

export const farmData = [
  {
    farmName: '$THOR Staking',
    assets: [
      new Asset(Chain.Ethereum, `THOR-${tokenAddr[config.network].THOR}`),
    ],
    lpAsset: new Asset(
      Chain.Ethereum,
      `THOR-${tokenAddr[config.network].THOR}`,
    ),
    withdrawOnly: true,
    lpToken: tokenAddr[config.network].THOR,
    contractType: ContractType.STAKING_THOR,
    lpContractType: LPContractType.THOR,
    stakeAddr: tokenAddr[config.network].THOR_STAKE,
    exchange: 'THORSwap',
  },
  {
    farmName: 'ETH-THOR LP',
    assets: [
      Asset.ETH(),
      new Asset(Chain.Ethereum, `THOR-${tokenAddr[config.network].THOR}`),
    ],
    lpAsset: new Asset(
      Chain.Ethereum,
      `SLP-${tokenAddr[config.network].ETH_THOR}`,
    ),
    lpToken: tokenAddr[config.network].ETH_THOR,
    contractType: ContractType.STAKING_SUSHI_WETH,
    lpContractType: LPContractType.THOR_ETH,
    stakeAddr: tokenAddr[config.network].SUSHI_STAKE,
    exchange: 'SushiSwap',
  },
]

export const tcFarmData = {
  farmName: 'RUNE-THOR',
  assets: [
    new Asset(Chain.Ethereum, `THOR-${tokenAddr[config.network].THOR}`),
    Asset.RUNE(),
  ],
  lpToken: tokenAddr[config.network].THOR,
  contractType: ContractType.STAKING_THOR,
  exchange: 'THORSwap',
}
