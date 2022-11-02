import { stakingV2Addr, VestingType } from 'helpers/assets';
import { contractConfig, ContractType, getCustomContract } from 'services/contract';

export const getTokenBalance = async (contractType: VestingType, ethAddr: string) => {
  const contract = getCustomContract(stakingV2Addr[contractType]);
  const tokenBalance = await contract.balanceOf(ethAddr);

  return tokenBalance;
};

export const getVthorState = async (methodName: string, args?: FixMe[]) => {
  const contract = getCustomContract(
    contractConfig[ContractType.VTHOR].address,
    contractConfig[ContractType.VTHOR].abi,
  );
  const resp = await contract[methodName](...(args ?? []));

  return resp;
};

export const getStakedThorAmount = async () => {
  const contract = getCustomContract(stakingV2Addr[VestingType.THOR]);
  const stakedThorAmount = await contract.balanceOf(stakingV2Addr[VestingType.VTHOR]);

  return stakedThorAmount;
};
