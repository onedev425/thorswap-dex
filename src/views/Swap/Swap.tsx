import { useCallback, useReducer, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

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

const initialFirstAsset = {
  asset: Asset.RUNE(),
  value: '0',
  change: '0.5',
} as AssetSelectType
const initialSecondAsset = {
  asset: Asset.BTC(),
  value: '4.7',
  change: '0.5',
} as AssetSelectType
const priceImpact = -0.06

const Swap = () => {
  const [autoRouter, setAutoRouter] = useState(true)
  const [expertMode, setExpertMode] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [{ firstAsset, secondAsset, slippage }, dispatch] = useReducer(
    swapReducer,
    {
      slippage: 0.5,
      firstAsset: {
        asset: initialFirstAsset.asset,
        change: initialFirstAsset.change,
        value: '0',
        balance: initialSecondAsset.balance,
        price: '5',
      },
      secondAsset: {
        asset: initialSecondAsset.asset,
        change: initialSecondAsset.change,
        value: '0',
        balance: initialSecondAsset.balance,
        price: '10',
      },
    },
  )

  const { addFrequent } = useAssets()
  const handleSwap = () => {
    addFrequent(firstAsset.asset.toString())
    addFrequent(secondAsset.asset.toString())

    // TEMP:
    setIsOpened((visible) => !visible)
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
    <Box className="self-center w-full max-w-[540px]" col>
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
                  onAutoRouterChange={setAutoRouter}
                  expertMode={expertMode}
                  onExpertModeChange={setExpertMode}
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
              onClose={() => setIsOpened(false)}
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
