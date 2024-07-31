import type { AssetValue } from "@swapkit/sdk";
import { useMultissigAssets } from "views/Multisig/hooks";

type Props = {
  poolAssets: AssetValue[];
};

export const useAssetsList = ({ poolAssets }: Props) => {
  const { assetsWithBalance } = useMultissigAssets();

  // Multisig wallet can hold only THORChain assets, so we do not have info about other potential assets
  const poolAssetList = poolAssets.map((asset) => ({
    asset,
    balance: assetsWithBalance.find((a) => a.balance.eqAsset(asset)) || undefined,
  }));

  return poolAssetList;
};
