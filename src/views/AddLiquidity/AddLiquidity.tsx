import { useCallback, useMemo, useReducer, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { assetsFixture } from 'utils/assetsFixture'

import { AssetSelectType } from 'components/AssetSelect/types'
import { Button, Card, Box } from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { LiquidityType } from 'components/LiquidityType/LiquidityType'
import { LiquidityTypeOption } from 'components/LiquidityType/types'
import { SwapSettingsPopover } from 'components/SwapSettings'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { addLiquidityReducer } from './addLiquidityReducer'
import { AssetInputs } from './AssetInputs'
import { PoolInfo } from './PoolInfo'

const defaultFirstAsset = {
  asset: Asset.BTC(),
  value: '4.7',
  change: '0.5',
} as AssetSelectType
const defaultSecondAsset = {
  asset: Asset.RUNE(),
  value: '0',
  change: '0.5',
} as AssetSelectType
const assetRate = 0.0016
const poolShare = 1.65

export const AddLiquidity = () => {
  const [searchParams] = useSearchParams()
  const [liquidityType, setLiquidityType] = useState(LiquidityTypeOption.Asset)
  const { inputAsset, outputAsset } = useMemo(() => {
    const input = searchParams.get('input') || Asset.BTC()
    const output = searchParams.get('output') || Asset.RUNE()

    const inputParamsAsset = assetsFixture.find(
      ({ asset }) => asset.toString() === input,
    )
    const outputParamsAsset = assetsFixture.find(
      ({ asset }) => asset.toString() === output,
    )
    const firstAsset = inputParamsAsset || defaultFirstAsset
    const secondAsset =
      outputParamsAsset || firstAsset.asset === defaultSecondAsset.asset
        ? defaultFirstAsset
        : defaultSecondAsset

    return {
      inputAsset: firstAsset,
      outputAsset: secondAsset,
    }
  }, [searchParams])

  const [{ firstAsset, secondAsset }, dispatch] = useReducer(
    addLiquidityReducer,
    {
      firstAsset: {
        asset: inputAsset.asset,
        change: inputAsset.change,
        value: inputAsset.value,
        price: '5',
      },
      secondAsset: {
        asset: outputAsset.asset,
        change: outputAsset.change,
        value: outputAsset.value,
        price: '10',
      },
    },
  )

  const handleAssetChange = useCallback(
    (asset: 'first' | 'second') => (payload: Asset) => {
      const actionType = asset === 'first' ? 'setFirstAsset' : 'setSecondAsset'

      dispatch({ type: actionType, payload })
    },
    [],
  )

  const handleValueChange = useCallback(
    (asset: 'first' | 'second') => (value: string) => {
      const actionType =
        asset === 'first' ? 'setFirstAssetValue' : 'setSecondAssetValue'

      dispatch({ type: actionType, payload: value })
    },
    [],
  )

  return (
    <Box className="w-full max-w-[480px] self-center" col>
      <Helmet title="Add Liquidity" content="Add Liquidity" />
      <Box className="w-full mx-2" col>
        <ViewHeader
          title={t('common.addLiquidity')}
          actionsComponent={<SwapSettingsPopover />}
        />
      </Box>

      <Card
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-4 space-y-1 shadow-lg md:w-full md:mt-8 md:h-auto"
        size="lg"
        stretch
      >
        <LiquidityType
          assetName={firstAsset.asset.name}
          selected={liquidityType}
          onChange={setLiquidityType}
        />
        <AssetInputs
          firstAsset={firstAsset}
          secondAsset={secondAsset}
          onAssetChange={handleAssetChange}
          onValueChange={handleValueChange}
        />

        <PoolInfo
          firstAsset={firstAsset}
          secondAsset={secondAsset}
          poolShare={poolShare}
          firstToSecondRate={assetRate}
        />

        <Box className="w-full pt-5">
          <Button stretch size="lg">
            {t('common.connectWallet')}
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default AddLiquidity
