import { useCallback, useReducer } from 'react'

import { useParams } from 'react-router'

import { AssetTickerType } from 'components/AssetIcon/types'
import { AssetSelectType } from 'components/AssetSelect/types'
import { Button, Card, Box, Icon } from 'components/Atomic'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { addLiquidityReducer } from './addLiquidityReducer'
import { AssetInputs } from './AssetInputs'
import { PoolInfo } from './PoolInfo'

const initialFirstAsset = {
  name: 'ETH',
  balance: '10',
  change: '0.5',
} as AssetSelectType
const initialSecondAsset = {
  name: 'RUNE',
  balance: '300',
  change: '0.5',
} as AssetSelectType
const assetRate = 0.0016
const poolShare = 1.65

export const AddLiquidity = () => {
  const { firstTicker, secondTicker } =
    useParams<{ firstTicker: AssetTickerType; secondTicker: AssetTickerType }>()

  const [{ firstAsset, secondAsset }, dispatch] = useReducer(
    addLiquidityReducer,
    {
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

  return (
    <Box className="w-full max-w-[600px] self-center" col>
      <Box className="w-full mx-2" col>
        <ViewHeader
          title={t('common.addLiquidity')}
          actionsComponent={<Icon name="cog" color="secondary" />}
        />
      </Box>

      <Card
        size="lg"
        stretch
        className="flex-col items-center md:w-full mt-4 md:mt-8 !p-0 md:h-auto md:pb-10 shadow-lg"
      >
        <Card
          size="lg"
          className="flex-col items-center w-full shadow-lg md:h-full md:w-full"
        >
          <AssetInputs
            firstAsset={firstAsset}
            secondAsset={secondAsset}
            onAssetChange={handleAssetChange}
            onBalanceChange={handleBalanceChange}
          />
          <Box className="hidden md:flex-col" col>
            <PoolInfo
              firstAsset={firstAsset}
              secondAsset={secondAsset}
              poolShare={poolShare}
              firstToSecondRate={assetRate}
            />
          </Box>
        </Card>

        <Box mt={[10, 40]} mb={10} col>
          <Button className="px-20">{t('common.connectWallet')}</Button>
        </Box>
      </Card>
    </Box>
  )
}

export default AddLiquidity
