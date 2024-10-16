import { Chain, FeeOption } from "@swapkit/sdk";
import type { InterfaceAbi } from "ethers";
import { Contract, formatEther, getAddress } from "ethers";

import Airdrop from "./abi/Airdrop.json";
import ERC20ABI from "./abi/ERC20.json";
import RewardsPerBlockABI from "./abi/RewardPerBlock.json";
import StakingABI from "./abi/Staking.json";
import VestingABI from "./abi/TokenVesting.json";
import VThorABI from "./abi/VThor.json";

export enum ContractType {
  VESTING = "vesting",
  VTHOR_VESTING = "vthor_vesting",
  STAKING_THOR = "staking_thor",
  STAKING_SUSHI_WETH = "staking_sushi_weth",
  VTHOR = "vthor",
  REWARDS_PER_BLOCK = "rewards_per_block",
  CLAIM_AIRDROP = "claim_airdrop",
  CLAIM_AND_STAKE_AIRDROP = "claim_and_stake_airdrop",
}

export enum LPContractType {
  THOR = "THOR",
  THOR_ETH = "THOR_ETH",
}

export const contractConfig: Record<ContractType, { address: string; abi: Todo }> = {
  [ContractType.VESTING]: {
    address: "0x0c3c9e5D9b08131DBD82a8648a23592b4ddA2223",
    abi: VestingABI,
  },
  [ContractType.STAKING_THOR]: {
    address: "0x6755630c583f12fFBD10568EB633c0319dB34922",
    abi: StakingABI,
  },
  [ContractType.STAKING_SUSHI_WETH]: {
    // ETH-THOR Sushi Staking
    address: "0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24",
    abi: StakingABI,
  },
  [ContractType.VTHOR]: {
    address: "0x815C23eCA83261b6Ec689b60Cc4a58b54BC24D8D",
    abi: VThorABI,
  },
  [ContractType.VTHOR_VESTING]: {
    address: "0xB54147e6031086eD015602248E0Cc34E64c0D25f",
    abi: VestingABI,
  },
  [ContractType.REWARDS_PER_BLOCK]: {
    address: "0x8f631816043c8e8Cad0C4c602bFe7Bff1B22b182",
    abi: RewardsPerBlockABI,
  },
  [ContractType.CLAIM_AIRDROP]: {
    address: "0x5505BE604dFA8A1ad402A71f8A357fba47F9bf5a",
    abi: Airdrop,
  },
  [ContractType.CLAIM_AND_STAKE_AIRDROP]: {
    address: "0x5505BE604dFA8A1ad402A71f8A357fba47F9bf5a",
    abi: Airdrop,
  },
};

export const getEtherscanContract = (contractType: ContractType) => {
  const { abi, address } = contractConfig[contractType];
  return getCustomContract(address, abi);
};

export const getCustomContract = async (contractAddr: string, abi?: InterfaceAbi) => {
  const { getProvider } = await import("@swapkit/toolbox-evm");
  const address = getAddress(contractAddr.toLowerCase());

  return new Contract(address, abi || ERC20ABI, getProvider(Chain.Ethereum));
};

export const getContractAddress = (contractType: ContractType) => contractConfig[contractType];

export const getBlockRewards = async () => {
  const blockReward = Number.parseFloat(
    formatEther(
      await (await getEtherscanContract(ContractType.REWARDS_PER_BLOCK)).rewardPerBlock(),
    ),
  );

  return blockReward;
};

export const triggerContractCall = async (
  contractType: ContractType,
  funcName: string,
  funcParams: Todo[],
) => {
  const { getWallet } = await (await import("services/swapKit")).getSwapKitClient();
  const ethWalletMethods = getWallet(Chain.Ethereum);
  const from = ethWalletMethods.address;
  if (!(ethWalletMethods && from)) throw new Error("No ETH wallet connected");

  const { address, abi } = contractConfig[contractType];

  const populatedTransaction = await ethWalletMethods.createContractTxObject({
    contractAddress: address,
    abi,
    funcName,
    funcParams: [...funcParams, { from }],
  });

  return ethWalletMethods.sendTransaction(populatedTransaction, FeeOption.Fast);
};
