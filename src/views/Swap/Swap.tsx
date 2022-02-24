import { useCallback, useReducer, useState } from 'react'

import { useParams } from 'react-router'

import { AutoRouterInfo } from 'views/Swap/AutoRouterInfo'
import { SwapSettings } from 'views/Swap/SwapSettings'

import { AssetTickerType } from 'components/AssetIcon/types'
import { AssetSelectType } from 'components/AssetSelect/types'
import { Button, Modal, Card, Icon, Box } from 'components/Atomic'
import { ConfirmSwapItem } from 'components/ConfirmSwapItem'
import { Popover } from 'components/Popover'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { AssetInputs } from './AssetInputs'
import { SwapInfo } from './SwapInfo'
import { swapReducer } from './swapReducer'

/**
 * TODO: Connect to the API to get the values
 * *     Add radial gradient to the card background
 */

const initialFirstAsset = {
  name: 'ETH',
  balance: '0',
  change: '0.5',
} as AssetSelectType
const initialSecondAsset = {
  name: 'BTC',
  balance: '4.7',
  change: '0.5',
} as AssetSelectType
const priceImpact = -0.06

const Swap = () => {
  const [autoRouter, setAutoRouter] = useState(true)
  const [expertMode, setExpertMode] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const { firstTicker, secondTicker } =
    useParams<{ firstTicker: AssetTickerType; secondTicker: AssetTickerType }>()
  const [{ firstAsset, secondAsset, slippage }, dispatch] = useReducer(
    swapReducer,
    {
      slippage: 0.5,
      firstAsset: {
        name: firstTicker || initialFirstAsset.name,
        change: initialFirstAsset.change,
        balance: initialFirstAsset.balance,
        value: '5',
      },
      secondAsset: {
        name: secondTicker || initialSecondAsset.name,
        change: initialSecondAsset.change,
        balance: initialSecondAsset.balance,
        value: '10',
      },
    },
  )

  const handleAssetChange = useCallback(
    (asset: 'first' | 'second') => (assetTicker: AssetTickerType) => {
      const actionType = asset === 'first' ? 'setFirstAsset' : 'setSecondAsset'

      dispatch({ type: actionType, payload: assetTicker })
    },
    [],
  )

  const handleBalanceChange = useCallback(
    (asset: 'first' | 'second') => (value: string) => {
      const actionType =
        asset === 'first' ? 'setFirstAssetBalance' : 'setSecondAssetBalance'

      dispatch({ type: actionType, payload: value })
    },
    [],
  )

  const handleAssetsSwap = useCallback(() => {
    dispatch({ type: 'swapAssets' })
  }, [])

  return (
    <Box className="self-center w-full max-w-[600px]" col>
      <Box className="w-full mx-2" col>
        <ViewHeader
          title={t('common.swap')}
          actionsComponent={
            <Box row>
              <Icon color="secondary" name="chart" className="ml-auto" />
              <Popover
                trigger={
                  <Icon
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
        size="lg"
        stretch
        className="flex-col items-center md:w-full mt-4 md:mt-8 !p-0 md:h-auto md:pb-10 shadow-lg"
      >
        <Card
          stretch
          size="lg"
          className="flex-col items-center self-stretch shadow-lg md:w-full !pb-0"
        >
          <AssetInputs
            firstAsset={firstAsset}
            secondAsset={secondAsset}
            onAssetChange={handleAssetChange}
            onBalanceChange={handleBalanceChange}
            onAssetsSwap={handleAssetsSwap}
          />

          <SwapInfo
            firstAsset={firstAsset}
            secondAsset={secondAsset}
            priceImpact={priceImpact}
            slippage={slippage}
          />
        </Card>

        <AutoRouterInfo
          firstAssetName={firstAsset.name}
          secondAssetName={secondAsset.name}
        />

        <Box className="py-5 md:py-10">
          <Button
            onClick={() => setIsOpened((visible) => !visible)}
            className="px-20"
          >
            {t('common.connectWallet')}
          </Button>
          {isOpened && (
            <Modal
              title="Confirm Swap"
              isOpened={isOpened}
              onClose={() => setIsOpened(false)}
            >
              <div>
                <ConfirmSwapItem />
              </div>
            </Modal>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default Swap
