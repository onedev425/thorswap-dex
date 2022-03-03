import { useCallback, useReducer, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AutoRouterInfo } from 'views/Swap/AutoRouterInfo'
import { SwapSettings } from 'views/Swap/SwapSettings'

import { AssetSelectType } from 'components/AssetSelect/types'
import { Button, Modal, Card, Icon, Box } from 'components/Atomic'
import { ConfirmSwapItem } from 'components/ConfirmSwapItem'
import { Helmet } from 'components/Helmet'
import { Popover } from 'components/Popover'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { AssetInputs } from './AssetInputs'
import { SwapInfo } from './SwapInfo'
import { swapReducer } from './swapReducer'

const initialFirstAsset = {
  asset: Asset.RUNE(),
  balance: '0',
  change: '0.5',
} as AssetSelectType
const initialSecondAsset = {
  asset: Asset.BTC(),
  balance: '4.7',
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
        balance: initialFirstAsset.balance,
        value: '5',
      },
      secondAsset: {
        asset: initialSecondAsset.asset,
        change: initialSecondAsset.change,
        balance: initialSecondAsset.balance,
        value: '10',
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
          firstAsset={firstAsset.asset}
          secondAsset={secondAsset.asset}
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
              <ConfirmSwapItem />
            </Modal>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default Swap
