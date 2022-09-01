import { stakingV2Addr, VestingType } from 'helpers/assets';
import { ContractABI, contractConfig, ContractType, getCustomContract } from 'services/contract';
import { NETWORK } from 'settings/config';

export const getTokenBalance = async (contractType: VestingType, ethAddr: string) => {
  const contract = getCustomContract(stakingV2Addr[contractType][NETWORK]);
  const tokenBalance = await contract.balanceOf(ethAddr);

  return tokenBalance;
};

export const getVthorState = async (methodName: string, args?: FixMe[]) => {
  const contract = getCustomContract(
    contractConfig[ContractType.VTHOR][NETWORK],
    contractConfig[ContractType.VTHOR][ContractABI],
  );
  const resp = await contract[methodName](...(args ?? []));

  return resp;
};

export const getStakedThorAmount = async () => {
  const contract = getCustomContract(stakingV2Addr[VestingType.THOR][NETWORK]);
  const stakedThorAmount = await contract.balanceOf(stakingV2Addr[VestingType.VTHOR][NETWORK]);

  return stakedThorAmount;
};
