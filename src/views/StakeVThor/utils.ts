import { Asset } from '@thorswap-lib/multichain-sdk'
import { Network } from '@thorswap-lib/xchain-client'
import { Chain } from '@thorswap-lib/xchain-util'

import { getCustomIconImageUrl } from 'components/AssetIcon'

import {
  getCustomContract,
  contractConfig,
  ContractType,
  ContractABI,
} from 'services/contract'

import { config } from 'settings/config'

const { network } = config

export enum StakingV2Type {
  THOR = 'THOR',
  VTHOR = 'VTHOR',
}

export const stakingV2Addr = {
  [StakingV2Type.THOR]: {
    [Network.Mainnet]: '0xa5f2211B9b8170F694421f2046281775E8468044',
    [Network.Testnet]: '0xe247EFF2915Cb56Ec7a4DB3aE7b923326752E92C',
  },
  [StakingV2Type.VTHOR]: {
    [Network.Mainnet]: '0x815C23eCA83261b6Ec689b60Cc4a58b54BC24D8D',
    [Network.Testnet]: '0x9783e4A7F0BF047Fd7982e75A1A1C8023a7d6A92',
  },
}

export const vThorInfo = {
  ticker: 'vTHOR',
  decimals: 18,
  iconUrl: getCustomIconImageUrl('vthor'),
}

export const getStakingAsset = (contractType: StakingV2Type) => {
  return new Asset(
    Chain.Ethereum,
    `${contractType}-${stakingV2Addr[contractType][network]}`,
  )
}

export const getV2Address = (contractType: StakingV2Type) =>
  stakingV2Addr[contractType][network]

export const getV2Asset = (contractType: StakingV2Type) => {
  return new Asset(
    Chain.Ethereum,
    `${contractType}-${getV2Address(contractType)}`,
  )
}

export const getTokenBalance = async (
  contractType: StakingV2Type,
  ethAddr: string,
) => {
  const contract = getCustomContract(stakingV2Addr[contractType][network])
  const tokenBalance = await contract.balanceOf(ethAddr)

  return tokenBalance
}

export const getThorState = async (methodName: string, args?: FixMe[]) => {
  const contract = getCustomContract(stakingV2Addr[StakingV2Type.THOR][network])
  const resp = await contract[methodName](...(args ?? []))

  return resp
}

export const getVthorState = async (methodName: string, args?: FixMe[]) => {
  const contract = getCustomContract(
    contractConfig[ContractType.VTHOR][network],
    contractConfig[ContractType.VTHOR][ContractABI],
  )
  const resp = await contract[methodName](...(args ?? []))

  return resp
}

export const getStakedThorAmount = async () => {
  const contract = getCustomContract(stakingV2Addr[StakingV2Type.THOR][network])
  const stakedThorAmount = await contract.balanceOf(
    stakingV2Addr[StakingV2Type.VTHOR][network],
  )

  return stakedThorAmount
}
