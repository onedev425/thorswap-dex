import type { Pool } from '@thorswap-lib/swapkit-core';
import { AssetEntity as Asset, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { getEVMDecimal } from 'helpers/getEVMDecimal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAddLiquidityRoute } from 'settings/router';
import { useMidgard } from 'store/midgard/hooks';

type Props = {
  assetRouteGetter?: (asset: Asset) => string;
};

export const useAddLiquidityPools = ({ assetRouteGetter = getAddLiquidityRoute }: Props = {}) => {
  const { getPoolsFromState } = useMidgard();
  const pools = getPoolsFromState();

  const { getAllMemberDetails } = useMidgard();
  const navigate = useNavigate();

  const { assetParam = getSignatureAssetFor(Chain.Bitcoin).toString() } = useParams<{
    assetParam: string;
  }>();
  const [poolAsset, setPoolAsset] = useState<Asset>(getSignatureAssetFor(Chain.Bitcoin));
  const [pool, setPool] = useState<Pool>();

  const poolAssets = useMemo(
    () => pools.filter((a) => a.detail.status === 'available').map((poolData) => poolData.asset),
    [pools],
  );

  useEffect(() => {
    getAllMemberDetails();
  }, [getAllMemberDetails]);

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

  useEffect(() => {
    if (pools.length && poolAsset) {
      const assetPool = pools.find(
        ({ asset: { chain, ticker } }) => chain === poolAsset.chain && ticker === poolAsset.ticker,
      );

      setPool(assetPool);
    }
  }, [pools, poolAsset]);

  const handleSelectPoolAsset = useCallback(
    (poolAssetData: Asset) => {
      navigate(assetRouteGetter(poolAssetData));
    },
    [assetRouteGetter, navigate],
  );

  return {
    poolAssets,
    pools,
    pool,
    poolAsset,
    assetParam,
    handleSelectPoolAsset,
  };
};
