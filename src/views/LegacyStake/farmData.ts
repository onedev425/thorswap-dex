import { AssetValue, Chain } from "@swapkit/sdk";
import { RUNEAsset } from "helpers/assets";
import { ContractType, LPContractType } from "services/contract";

export const tokenAddress = {
  THOR: "0xa5f2211B9b8170F694421f2046281775E8468044",
  ETH_THOR: "0x3D3F13F2529eC3C84B2940155EffBf9b39a8f3Ec",
  THOR_STAKE: "0x6755630c583f12fFBD10568EB633c0319dB34922",
  SUSHI_STAKE: "0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24",
};

export const farmData = [
  {
    farmName: "$THOR Staking",
    assets: [AssetValue.fromChainOrSignature("ETH.THOR")],
    lpAsset: AssetValue.fromChainOrSignature("ETH.THOR"),
    lpToken: tokenAddress.THOR,
    contractType: ContractType.STAKING_THOR,
    lpContractType: LPContractType.THOR,
    stakeAddr: tokenAddress.THOR_STAKE,
    exchange: "THORSwap",
  },
  {
    farmName: "ETH-THOR LP",
    assets: [
      AssetValue.fromChainOrSignature(Chain.Ethereum),
      AssetValue.fromChainOrSignature("ETH.THOR"),
    ],
    lpAsset: AssetValue.fromStringSync(`ETH.SLP-${tokenAddress.ETH_THOR}`),
    lpToken: tokenAddress.ETH_THOR,
    contractType: ContractType.STAKING_SUSHI_WETH,
    lpContractType: LPContractType.THOR_ETH,
    stakeAddr: tokenAddress.SUSHI_STAKE,
    exchange: "SushiSwap",
  },
];

export const tcFarmData = {
  farmName: "RUNE-THOR",
  assets: [AssetValue.fromChainOrSignature("ETH.THOR"), RUNEAsset],
  lpToken: tokenAddress.THOR,
  contractType: ContractType.STAKING_THOR,
  exchange: "THORSwap",
};
