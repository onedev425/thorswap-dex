import { useCallback, useReducer } from 'react'

import { AssetInput } from 'views/Liquidity/WithdrawLiquidity/components/AssetInput'
import { PoolInfo } from 'views/Liquidity/WithdrawLiquidity/components/PoolInfo'
import { PoolAsset } from 'views/Liquidity/WithdrawLiquidity/types'
import { withdrawLiquidityReducer } from 'views/Liquidity/WithdrawLiquidity/withdrawLiquidityReducer'

import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Card } from 'components/Card'
import { Icon } from 'components/Icon'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const poolData: {
  firstAsset: PoolAsset
  secondAsset: PoolAsset
  lpTokens: string
  poolShare: string
} = {
  firstAsset: {
    name: 'ETH',
    balance: '0.005',
  },
  secondAsset: {
    name: 'RUNE',
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
    <div className="mx-auto w-2/3 max-w[1200px]">
      <ViewHeader
        withBack
        title="View Liquidity Position"
        actionsComponent={<Icon name="cog" color="secondary" />}
      />

      <Card size="lg" stretch className="flex-col mt-12 pb-10 shadow-lg">
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
