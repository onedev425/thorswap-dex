import { useCallback, useMemo, useReducer } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { assetsFixture } from 'utils/assetsFixture'

import { AssetSelectType } from 'components/AssetSelect/types'
import { Button, Modal, Card, Icon, Box } from 'components/Atomic'
import { ConfirmSwapItem } from 'components/ConfirmSwapItem'
import { Helmet } from 'components/Helmet'
import { Popover } from 'components/Popover'
import { ViewHeader } from 'components/ViewHeader'

import { useAssets } from 'redux/assets/hooks'

import { t } from 'services/i18n'

import { AssetInputs } from './AssetInputs'
import { AutoRouterInfo } from './AutoRouterInfo'
import { SwapInfo } from './SwapInfo'
import { swapReducer } from './swapReducer'
import { SwapSettings } from './SwapSettings'

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
const priceImpact = -0.06

const Swap = () => {
  const [searchParams] = useSearchParams()
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

  const [
    { isOpened, expertMode, autoRouter, firstAsset, secondAsset, slippage },
    dispatch,
  ] = useReducer(swapReducer, {
    isOpened: false,
    expertMode: false,
    autoRouter: true,
    slippage: 0.5,
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
  })

  const { addFrequent } = useAssets()
  const handleSwap = () => {
    addFrequent(firstAsset.asset.toString())
    addFrequent(secondAsset.asset.toString())

    // TODO:
    dispatch({ type: 'setIsOpened', payload: true })
  }

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

  const handleAssetsSwap = useCallback(() => {
    dispatch({ type: 'swapAssets' })
  }, [])

  return (
    <Box className="self-center w-full max-w-[480px]" col>
      <Helmet title="Swap" content="Swap" />

      <Box className="w-full mx-2" col>
        <ViewHeader
          title={t('common.swap')}
          actionsComponent={
            <Box row>
              <Icon
                size={26}
                color="secondary"
                name="chart"
                className="ml-auto"
              />
              <Popover
                trigger={
                  <Icon
                    size={26}
                    color="secondary"
                    name="cog"
                    className="ml-6"
                    onClick={() => {}}
                  />
                }
              >
                <SwapSettings
                  slippage={0.5}
                  deadline="30"
                  autoRouter={autoRouter}
                  onAutoRouterChange={(payload) =>
                    dispatch({ type: 'setAutoRouter', payload })
                  }
                  expertMode={expertMode}
                  onExpertModeChange={(payload) =>
                    dispatch({ type: 'setExpertMode', payload })
                  }
                />
              </Popover>
            </Box>
          }
        />
      </Box>

      <Card
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-4 space-y-1 shadow-lg md:w-full md:mt-8 md:h-auto"
        size="lg"
        stretch
      >
        <AssetInputs
          firstAsset={firstAsset}
          secondAsset={secondAsset}
          onAssetChange={handleAssetChange}
          onValueChange={handleValueChange}
          onAssetsSwap={handleAssetsSwap}
        />

        <SwapInfo
          firstAsset={firstAsset}
          secondAsset={secondAsset}
          priceImpact={priceImpact}
          slippage={slippage}
        />

        <AutoRouterInfo
          firstAsset={firstAsset.asset}
          secondAsset={secondAsset.asset}
        />

        <Box className="w-full pt-5">
          <Button stretch size="lg" onClick={handleSwap}>
            {t('common.connectWallet')}
          </Button>

          {isOpened && (
            <Modal
              title="Confirm Swap"
              isOpened={isOpened}
              onClose={() => dispatch({ type: 'setIsOpened', payload: false })}
            >
              <ConfirmSwapItem />
            </Modal>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default Swap
