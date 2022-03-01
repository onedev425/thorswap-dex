import { useCallback, useReducer } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelectType } from 'components/AssetSelect/types'
import { Button, Card, Box, Icon } from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { addLiquidityReducer } from './addLiquidityReducer'
import { AssetInputs } from './AssetInputs'
import { PoolInfo } from './PoolInfo'

const initialFirstAsset = {
  asset: Asset.RUNE(),
  balance: '10',
  change: '0.5',
} as AssetSelectType
const initialSecondAsset = {
  asset: Asset.ETH(),
  balance: '300',
  change: '0.5',
} as AssetSelectType
const assetRate = 0.0016
const poolShare = 1.65

export const AddLiquidity = () => {
  const [{ firstAsset, secondAsset }, dispatch] = useReducer(
    addLiquidityReducer,
    {
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

  return (
    <Box className="w-full max-w-[600px] self-center" col>
      <Helmet title="Add Liquidity" content="Add Liquidity" />
      <Box className="w-full mx-2" col>
        <ViewHeader
          title={t('common.addLiquidity')}
          actionsComponent={<Icon name="cog" color="secondary" />}
        />
      </Box>

      <Card
        size="lg"
        stretch
        className="flex-col items-center mt-4 md:mt-8 !p-0 md:h-auto md:pb-10 shadow-lg"
      >
        <Card size="lg" className="flex-col self-stretch shadow-lg">
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

        <Box className="py-5 md:py-10" col>
          <Button className="px-20">{t('common.connectWallet')}</Button>
        </Box>
      </Card>
    </Box>
  )
}

export default AddLiquidity
