import { useCallback, useMemo, useReducer, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { assetsFixture } from 'utils/assetsFixture'

import { AssetSelectType } from 'components/AssetSelect/types'
import { Button, Box } from 'components/Atomic'
import { LiquidityType } from 'components/LiquidityType/LiquidityType'
import { LiquidityTypeOption } from 'components/LiquidityType/types'
import { ConfirmDepositLiquidity } from 'components/Modals/ConfirmDepositLiquidity'
import { PanelView } from 'components/PanelView'
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
  const [isLiquidityModalVisible, setIsLiquidityModalVisible] = useState(false)

  const handleCloseLiquidityModal = () => {
    setIsLiquidityModalVisible(false)
  }

  const handleOpenLiquidityModal = () => {
    setIsLiquidityModalVisible(true)
  }

  const { inputAsset, outputAsset } = useMemo(() => {
    const input = searchParams.get('input') || Asset.BTC()

    const inputParamsAsset = assetsFixture.find(
      ({ asset }) => asset.toString() === input,
    )

    const firstAsset = inputParamsAsset || defaultFirstAsset
    // 2nd asset is always RUNE
    const secondAsset = defaultSecondAsset

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
    <PanelView
      title="Add Liquidity"
      header={
        <ViewHeader
          title={t('common.addLiquidity')}
          actionsComponent={<SwapSettingsPopover />}
        />
      }
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
        liquidityType={liquidityType}
      />

      <PoolInfo
        firstAsset={firstAsset}
        secondAsset={secondAsset}
        poolShare={poolShare}
        firstToSecondRate={assetRate}
      />

      <Box className="w-full pt-5">
        <Button isFancy stretch size="lg" onClick={handleOpenLiquidityModal}>
          {t('common.connectWallet')}
        </Button>
      </Box>

      <ConfirmDepositLiquidity
        // Assets data should be based on liquidityType option
        assets={[
          { asset: firstAsset.asset, value: '123' },
          { asset: secondAsset.asset, value: '1.23' },
        ]}
        fees={[
          { chain: 'ETH', fee: '0.03' },
          { chain: 'RUNE', fee: '0.002' },
        ]}
        totalFee=""
        poolShare={1.5}
        slippage={0.5}
        estimatedTime="<15s"
        isOpen={isLiquidityModalVisible}
        onCancel={handleCloseLiquidityModal}
      />
    </PanelView>
  )
}

export default AddLiquidity
