import { AssetEntity as Asset, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { getEVMDecimal } from 'helpers/getEVMDecimal';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAddLiquidityRoute } from 'settings/router';

type Props = {
  assetRouteGetter?: (asset: Asset) => string;
};

export const useAddLiquidityPools = ({ assetRouteGetter = getAddLiquidityRoute }: Props = {}) => {
  const navigate = useNavigate();

  const { assetParam = getSignatureAssetFor(Chain.Bitcoin).toString() } = useParams<{
    assetParam: string;
  }>();
  const [poolAsset, setPoolAsset] = useState<Asset>(getSignatureAssetFor(Chain.Bitcoin));

  useEffect(() => {
    const getAssetEntity = async () => {
      if (!assetParam) {
        return;
      }

      const assetEntity = Asset.decodeFromURL(assetParam);

      if (assetEntity) {
        if (assetEntity.isRUNE()) return;
        const assetDecimals = await getEVMDecimal(assetEntity);
        await assetEntity.setDecimal(assetDecimals);

        setPoolAsset(assetEntity);
      }
    };

    getAssetEntity();
  }, [assetParam]);

  const handleSelectPoolAsset = useCallback(
    (poolAssetData: Asset) => {
      navigate(assetRouteGetter(poolAssetData));
    },
    [assetRouteGetter, navigate],
  );

  return { poolAsset, assetParam, handleSelectPoolAsset };
};
