import { useCallback, useReducer } from 'react'

import { useParams } from 'react-router'

import { addLiquidityReducer } from 'views/Liquidity/addLiquidity/addLiquidityReducer'
import { AssetInputs } from 'views/Liquidity/addLiquidity/AssetInputs'
import { PoolInfo } from 'views/Liquidity/addLiquidity/PoolInfo'

import { AssetTickerType } from 'components/AssetIcon/types'
import { AssetSelectType } from 'components/AssetSelect/types'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Card } from 'components/Card'
import { Icon } from 'components/Icon'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

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
    <div className="mx-auto w-2/3 max-w[1200px]">
      <ViewHeader
        withBack
        title="Add Liquidity"
        actionsComponent={<Icon name="cog" color="secondary" />}
      />

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
          />

          <PoolInfo
            firstAsset={firstAsset}
            secondAsset={secondAsset}
            poolShare={poolShare}
            firstToSecondRate={assetRate}
          />
        </Card>

        <Box mt={40}>
          <Button className="px-20" size="large">
            {t('common.connectWallet')}
          </Button>
        </Box>
      </Card>
    </div>
  )
}

export default AddLiquidity
