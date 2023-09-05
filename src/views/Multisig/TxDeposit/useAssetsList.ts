import type { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { useMultissigAssets } from 'views/Multisig/hooks';

type Props = {
  poolAssets: Asset[];
};

export const useAssetsList = ({ poolAssets }: Props) => {
  const { assetsWithBalance } = useMultissigAssets();

  // Multisig wallet can hold only THORChain assets, so we do not have info about other potential assets
  const poolAssetList = poolAssets.map((asset) => ({
    asset,
    balance: assetsWithBalance.find((a) => a.asset.eq(asset))?.balance || undefined,
  }));

  return poolAssetList;
};
