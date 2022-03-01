import { useCallback, useReducer } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetInput } from 'views/Liquidity/WithdrawLiquidity/components/AssetInput'
import { PoolInfo } from 'views/Liquidity/WithdrawLiquidity/components/PoolInfo'
import { PoolAsset } from 'views/Liquidity/WithdrawLiquidity/types'
import { withdrawLiquidityReducer } from 'views/Liquidity/WithdrawLiquidity/withdrawLiquidityReducer'

import { Button, Card, Box, Icon } from 'components/Atomic'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const poolData: {
  firstAsset: PoolAsset
  secondAsset: PoolAsset
  lpTokens: string
  poolShare: string
} = {
  firstAsset: {
    asset: Asset.RUNE(),
    balance: '0.005',
  },
  secondAsset: {
    asset: Asset.RUNE(),
    balance: '60.2',
  },
  lpTokens: '0.4225',
  poolShare: '1.5',
}

export const WithdrawLiquidity = () => {
  const [{ amount }, dispatch] = useReducer(withdrawLiquidityReducer, {
    amount: '0',
  })

  const handleAmountChange = useCallback((value: string) => {
    dispatch({ type: 'setAmount', payload: value })
  }, [])

  return (
    <div className="mx-auto w-full max-w-[600px]">
      <ViewHeader
        withBack
        title="View Liquidity Position"
        actionsComponent={<Icon name="cog" color="secondary" />}
      />

      <Card size="lg" stretch className="flex-col pb-10 mt-12 shadow-lg">
        <AssetInput
          firstAsset={poolData.firstAsset}
          secondAsset={poolData.secondAsset}
          poolShare={poolData.poolShare}
          amount={amount}
          lpAmount={poolData.lpTokens}
          onAmountChange={handleAmountChange}
        />

        <Box justify="end" className="gap-4" my={32}>
          <Button>{t('views.liquidity.approve')}</Button>
          <Button variant="secondary">
            {t('views.liquidity.enterAmount')}
          </Button>
        </Box>

        <PoolInfo
          firstAsset={poolData.firstAsset}
          secondAsset={poolData.secondAsset}
          poolShare={poolData.poolShare}
          lpAmount={poolData.lpTokens}
        />
      </Card>
    </div>
  )
}

export default WithdrawLiquidity
