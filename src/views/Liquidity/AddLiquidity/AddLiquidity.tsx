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
  value: '10',
  change: '0.5',
} as AssetSelectType
const initialSecondAsset = {
  asset: Asset.ETH(),
  value: '300',
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
    <Box className="w-full max-w-[540px] self-center" col>
      <Helmet title="Add Liquidity" content="Add Liquidity" />
      <Box className="w-full mx-2" col>
        <ViewHeader
          title={t('common.addLiquidity')}
          actionsComponent={<Icon size={26} name="cog" color="secondary" />}
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
