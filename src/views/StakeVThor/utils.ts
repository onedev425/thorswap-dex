import {
  getCustomContract,
  contractConfig,
  ContractType,
  ContractABI,
} from 'services/contract'

import { stakingV2Addr, VestingType } from 'helpers/assets'

import { config } from 'settings/config'

const { network } = config

export const getTokenBalance = async (
  contractType: VestingType,
  ethAddr: string,
) => {
  const contract = getCustomContract(stakingV2Addr[contractType][network])
  const tokenBalance = await contract.balanceOf(ethAddr)

  return tokenBalance
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
  const contract = getCustomContract(stakingV2Addr[VestingType.THOR][network])
  const stakedThorAmount = await contract.balanceOf(
    stakingV2Addr[VestingType.VTHOR][network],
  )

  return stakedThorAmount
}
