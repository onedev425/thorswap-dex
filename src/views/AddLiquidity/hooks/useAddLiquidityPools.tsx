import { useCallback, useEffect, useMemo, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Asset, Pool } from '@thorswap-lib/multichain-sdk'

import { useMidgard } from 'store/midgard/hooks'
import { useAppSelector } from 'store/store'

import { getAddLiquidityRoute } from 'settings/constants'

type Props = {
  assetRouteGetter?: (asset: Asset) => string
}

export const useAddLiquidityPools = ({
  assetRouteGetter = getAddLiquidityRoute,
}: Props = {}) => {
  const { pools, poolLoading } = useAppSelector(({ midgard }) => midgard)
  const { getAllMemberDetails } = useMidgard()
  const navigate = useNavigate()

  const { assetParam = Asset.BTC().toString() } = useParams<{
    assetParam: string
  }>()
  const [poolAsset, setPoolAsset] = useState<Asset>(Asset.BTC())
  const [pool, setPool] = useState<Pool>()

  const poolAssets = useMemo(() => {
    const assets = pools.map((poolData) => poolData.asset)
    return assets
  }, [pools])

  useEffect(() => {
    getAllMemberDetails()
  }, [getAllMemberDetails])

  useEffect(() => {
    const getAssetEntity = async () => {
      if (!assetParam) {
        return
      }

      const assetEntity = Asset.decodeFromURL(assetParam)

      if (assetEntity) {
        if (assetEntity.isRUNE()) return

        await assetEntity.setDecimal()

        setPoolAsset(assetEntity)
      }
    }

    getAssetEntity()
  }, [assetParam])

  useEffect(() => {
    if (!poolLoading && pools.length && poolAsset) {
      const assetPool = Pool.byAsset(poolAsset, pools)

      if (assetPool) {
        setPool(assetPool)
      }
    }
  }, [pools, poolLoading, poolAsset])

  const handleSelectPoolAsset = useCallback(
    (poolAssetData: Asset) => {
      navigate(assetRouteGetter(poolAssetData))
    },
    [assetRouteGetter, navigate],
  )

  return {
    poolAssets,
    pools,
    pool,
    poolAsset,
    assetParam,
    handleSelectPoolAsset,
  }
}
