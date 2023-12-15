import { AssetValue, Chain } from '@swapkit/core';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAddLiquidityRoute } from 'settings/router';

type Props = {
  assetRouteGetter?: (asset: AssetValue) => string;
};

export const useAddLiquidityPools = ({ assetRouteGetter = getAddLiquidityRoute }: Props = {}) => {
  const navigate = useNavigate();

  const { assetParam } = useParams<{
    assetParam: string;
  }>();
  const [poolAsset, setPoolAsset] = useState<AssetValue>();

  useEffect(() => {
    const getAssetEntity = async () => {
      const assetEntity = assetParam
        ? AssetValue.fromStringSync(assetParam)
        : AssetValue.fromChainOrSignature(Chain.Bitcoin);

      setPoolAsset(assetEntity);
    };

    getAssetEntity();
  }, [assetParam]);

  const handleSelectPoolAsset = useCallback(
    (poolAssetData: AssetValue) => {
      navigate(assetRouteGetter(poolAssetData));
    },
    [assetRouteGetter, navigate],
  );

  return { poolAsset, assetParam, handleSelectPoolAsset };
};
