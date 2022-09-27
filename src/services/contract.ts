import { BigNumber } from '@ethersproject/bignumber';
import { type ContractInterface, Contract } from '@ethersproject/contracts';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { Chain } from '@thorswap-lib/types';
import { alchemyProvider } from 'services/alchemyProvider';
import { multichain } from 'services/multichain';

import ERC20ABI from './abi/ERC20.json';
import StakingABI from './abi/Staking.json';
import VestingABI from './abi/TokenVesting.json';
import VThorABI from './abi/VThor.json';

export enum ContractType {
  VESTING = 'vesting',
  VTHOR_VESTING = 'vthor_vesting',
  STAKING_THOR = 'staking_thor',
  STAKING_SUSHI_WETH = 'staking_sushi_weth',
  VTHOR = 'vthor',
}

export enum LPContractType {
  THOR = 'THOR',
  THOR_ETH = 'THOR_ETH',
}

export const contractConfig: Record<ContractType, { address: string; abi: any }> = {
  [ContractType.VESTING]: {
    address: '0x0c3c9e5D9b08131DBD82a8648a23592b4ddA2223',
    abi: VestingABI,
  },
  [ContractType.STAKING_THOR]: {
    address: '0x6755630c583f12fFBD10568EB633c0319dB34922',
    abi: StakingABI,
  },
  [ContractType.STAKING_SUSHI_WETH]: {
    // ETH-THOR Sushi Staking
    address: '0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24',
    abi: StakingABI,
  },
  [ContractType.VTHOR]: {
    address: '0x815C23eCA83261b6Ec689b60Cc4a58b54BC24D8D',
    abi: VThorABI,
  },
  [ContractType.VTHOR_VESTING]: {
    address: '0xB54147e6031086eD015602248E0Cc34E64c0D25f',
    abi: VestingABI,
  },
};

export const lpContractConfig: Record<LPContractType, { tokenAddr: string; stakingAddr: string }> =
  {
    [LPContractType.THOR]: {
      tokenAddr: '0xa5f2211B9b8170F694421f2046281775E8468044',
      stakingAddr: '0x6755630c583f12fFBD10568EB633c0319dB34922',
    },
    [LPContractType.THOR_ETH]: {
      // SUSHI SLP Address
      tokenAddr: '0x3D3F13F2529eC3C84B2940155EffBf9b39a8f3Ec',
      stakingAddr: '0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24',
    },
  };

export const fromWei = (amountInWei: BigNumber): number => {
  return parseFloat(formatUnits(amountInWei, 'ether'));
};

export const toWei = (amount: number | string): BigNumber => {
  return parseUnits(amount.toString(), 'ether');
};

export const toWeiFromString = (amount: string): BigNumber => {
  return parseUnits(amount, 'ether');
};

export const getEtherscanContract = (contractType: ContractType) => {
  const { abi, address } = contractConfig[contractType];
  return getCustomContract(address, abi);
};

export const getCustomContract = (contractAddr: string, abi?: ContractInterface) =>
  new Contract(contractAddr, abi ? abi : ERC20ABI, alchemyProvider());

export const getLPContractAddress = (contractType: LPContractType) =>
  lpContractConfig[contractType].tokenAddr.toLowerCase();

export const getContractAddress = (contractType: ContractType) => contractConfig[contractType];

export const getLpTokenBalance = async (contractType: LPContractType) => {
  const { tokenAddr, stakingAddr } = lpContractConfig[contractType];

  const tokenContract = getCustomContract(tokenAddr);
  return await tokenContract.balanceOf(stakingAddr);
};

// add 20%
export const calculateGasMargin = (value: BigNumber): BigNumber => {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000));
};

export const triggerContractCall = async (
  contractType: ContractType,
  methodName: string,
  args: ToDo[],
) => {
  try {
    const { address, abi } = contractConfig[contractType];
    const contract = getCustomContract(address, abi);

    const ethClient = multichain().eth.getClient();
    const from = multichain().getWalletAddressByChain(Chain.Ethereum);
    const gasLimit = await contract.estimateGas[methodName](...args, { from });

    const resp: ToDo = await ethClient.call({
      contractAddress: address,
      abi,
      funcName: methodName,
      funcParams: [
        ...args,
        {
          gasLimit: gasLimit,
        },
      ],
    });

    return resp;
  } catch (error) {
    console.info(error);
  }
};
