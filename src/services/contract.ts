import { BigNumber } from '@ethersproject/bignumber';
import { type ContractInterface, Contract } from '@ethersproject/contracts';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { Chain, Network } from '@thorswap-lib/types';
import { alchemyProvider } from 'services/alchemyProvider';
import { multichain } from 'services/multichain';
import { NETWORK } from 'settings/config';

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

export const ContractABI = 'abi';
export const StakingAddr = 'stakingAddr';

export type ContractConf = {
  [Network.Mainnet]: string;
  [Network.Testnet]: string;
  [ContractABI]: ContractInterface;
};

export type LPContractConf = {
  [Network.Mainnet]: {
    tokenAddr: string;
    stakingAddr: string;
  };
  [Network.Testnet]: {
    tokenAddr: string;
    stakingAddr: string;
  };
};

// Some testnet address are incorrect, but mainnet address are 100% correct.
export const contractConfig: Record<ContractType, ContractConf> = {
  [ContractType.VESTING]: {
    [Network.Mainnet]: '0x0c3c9e5D9b08131DBD82a8648a23592b4ddA2223',
    [Network.Testnet]: '0xd689bA1169A8FB1cC96f57D0102A4111D4574FCD',
    [ContractABI]: VestingABI,
  },
  [ContractType.STAKING_THOR]: {
    // Single Staking
    [Network.Mainnet]: '0x6755630c583f12fFBD10568EB633c0319dB34922',
    [Network.Testnet]: '0x22441f0cefe0110951fab63cbfb844e535232311',
    [ContractABI]: StakingABI,
  },
  [ContractType.STAKING_SUSHI_WETH]: {
    // ETH-THOR Sushi Staking
    [Network.Mainnet]: '0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24',
    [Network.Testnet]: '0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24',
    [ContractABI]: StakingABI,
  },
  [ContractType.VTHOR]: {
    [Network.Mainnet]: '0x815C23eCA83261b6Ec689b60Cc4a58b54BC24D8D',
    [Network.Testnet]: '0x9783e4A7F0BF047Fd7982e75A1A1C8023a7d6A92',
    [ContractABI]: VThorABI,
  },
  [ContractType.VTHOR_VESTING]: {
    [Network.Mainnet]: '0xB54147e6031086eD015602248E0Cc34E64c0D25f',
    [Network.Testnet]: '0xd689bA1169A8FB1cC96f57D0102A4111D4574FCD',
    [ContractABI]: VestingABI,
  },
};

export const lpContractConfig: Record<LPContractType, LPContractConf> = {
  [LPContractType.THOR]: {
    [Network.Mainnet]: {
      tokenAddr: '0xa5f2211B9b8170F694421f2046281775E8468044',
      stakingAddr: '0x6755630c583f12fFBD10568EB633c0319dB34922',
    },
    [Network.Testnet]: {
      tokenAddr: '0xe247eff2915cb56ec7a4db3ae7b923326752e92c',
      stakingAddr: '0x22441f0cefe0110951fab63cbfb844e535232311',
    },
  },
  [LPContractType.THOR_ETH]: {
    [Network.Mainnet]: {
      // SUSHI SLP Address
      tokenAddr: '0x3D3F13F2529eC3C84B2940155EffBf9b39a8f3Ec',
      stakingAddr: '0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24',
    },
    [Network.Testnet]: {
      tokenAddr: '0x3D3F13F2529eC3C84B2940155EffBf9b39a8f3Ec',
      stakingAddr: '0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24',
    },
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
  const provider = alchemyProvider();

  const activeContract = contractConfig[contractType];
  const contract = new Contract(activeContract[NETWORK], activeContract[ContractABI], provider);

  return contract;
};

export const getCustomContract = (contractAddr: string, abi?: ContractInterface) => {
  const provider = alchemyProvider();

  const contract = new Contract(contractAddr, abi ? abi : ERC20ABI, provider);

  return contract;
};

export const getLPContractAddress = (contractType: LPContractType) => {
  return lpContractConfig[contractType][NETWORK].tokenAddr.toLowerCase();
};

export const getContractAddress = (contractType: ContractType) => {
  return contractConfig[contractType][NETWORK];
};

export const getLpTokenBalance = async (contractType: LPContractType) => {
  const { tokenAddr, stakingAddr } = lpContractConfig[contractType][NETWORK];

  const tokenContract = getCustomContract(tokenAddr);

  const balance = await tokenContract.balanceOf(stakingAddr);

  return balance;
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
    const activeContract = contractConfig[contractType];
    const contract = new Contract(
      activeContract[NETWORK],
      activeContract[ContractABI],
      alchemyProvider(),
    );

    const ethClient = multichain().eth.getClient();
    const from = multichain().getWalletAddressByChain(Chain.Ethereum);
    const gasLimit = await contract.estimateGas[methodName](...args, { from });

    const resp: ToDo = await ethClient.call({
      contractAddress: activeContract[NETWORK],
      abi: activeContract[ContractABI],
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
