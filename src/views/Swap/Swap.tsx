import { useCallback, useReducer } from 'react'

import { useParams } from 'react-router'

import { AutoRouterInfo } from 'views/Swap/AutoRouterInfo'

import { AssetTickerType } from 'components/AssetIcon/types'
import { AssetSelectType } from 'components/AssetSelect/types'
import { Button } from 'components/Button'
import { Card } from 'components/Card'
import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

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
    <div className="mx-auto w-2/3 max-w[1200px]">
      <div className="flex items-center">
        <Typography variant="h2">{t('common.swap')}</Typography>

        <Icon color="secondary" name="chart" className="ml-auto" />
        <Icon color="secondary" name="cog" className="ml-6" />
      </div>

      <Card
        size="lg"
        stretch
        className="flex-col items-center mt-12 p-0 pb-10 shadow-lg"
      >
        <Card size="lg" className="flex-col items-center shadow-lg w-full">
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

        <div className="flex mt-2">
          <Button className="px-20" size="large">
            {t('common.connectWallet')}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Swap
