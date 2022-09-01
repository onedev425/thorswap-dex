import { Asset, Pool } from '@thorswap-lib/multichain-sdk';
import { Chain } from '@thorswap-lib/types';
import { getERC20Decimal } from 'helpers/getERC20Decimal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAddLiquidityRoute } from 'settings/constants';
import { useMidgard } from 'store/midgard/hooks';
import { useAppSelector } from 'store/store';

type Props = {
  assetRouteGetter?: (asset: Asset) => string;
};

export const useAddLiquidityPools = ({ assetRouteGetter = getAddLiquidityRoute }: Props = {}) => {
  const { pools, poolLoading } = useAppSelector(({ midgard }) => midgard);
  const { getAllMemberDetails } = useMidgard();
  const navigate = useNavigate();

  const { assetParam = Asset.BTC().toString() } = useParams<{
    assetParam: string;
  }>();
  const [poolAsset, setPoolAsset] = useState<Asset>(Asset.BTC());
  const [pool, setPool] = useState<Pool>();

  const poolAssets = useMemo(() => {
    const assets = pools.map((poolData) => poolData.asset);
    return assets;
  }, [pools]);

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
        const assetDecimals =
          assetEntity && assetEntity.L1Chain === Chain.Ethereum
            ? await getERC20Decimal(assetEntity)
            : undefined;
        await assetEntity.setDecimal(assetDecimals);

        setPoolAsset(assetEntity);
      }
    };

    getAssetEntity();
  }, [assetParam]);

  useEffect(() => {
    if (!poolLoading && pools.length && poolAsset) {
      const assetPool = Pool.byAsset(poolAsset, pools);

      if (assetPool) {
        setPool(assetPool);
      }
    }
  }, [pools, poolLoading, poolAsset]);

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
