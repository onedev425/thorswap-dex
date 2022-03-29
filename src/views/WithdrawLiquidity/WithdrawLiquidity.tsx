import { useCallback, useReducer, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetInputs } from 'views/WithdrawLiquidity/components/AssetInputs'
import { PoolAsset } from 'views/WithdrawLiquidity/types'
import { withdrawLiquidityReducer } from 'views/WithdrawLiquidity/withdrawLiquidityReducer'

import { Button, Box } from 'components/Atomic'
// import { LiquidityCard } from 'components/LiquidityCard'
import { LiquidityType } from 'components/LiquidityType/LiquidityType'
import { LiquidityTypeOption } from 'components/LiquidityType/types'
import { ConfirmWithdrawLiquidity } from 'components/Modals/ConfirmWithdrawLiquidity'
import { PanelView } from 'components/PanelView'
import { SwapSettingsPopover } from 'components/SwapSettings'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const poolData: {
  firstAsset: PoolAsset
  secondAsset: PoolAsset
  lpTokens: string
  poolShare: string
} = {
  firstAsset: {
    asset: Asset.BTC(),
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
  const [liquidityType, setLiquidityType] = useState(
    LiquidityTypeOption.Symmetrical,
  )
  const [isLiquidityModalVisible, setIsLiquidityModalVisible] = useState(false)

  const handleCloseLiquidityModal = () => {
    setIsLiquidityModalVisible(false)
  }

  const handleOpenLiquidityModal = () => {
    setIsLiquidityModalVisible(true)
  }

  const [{ amount }, dispatch] = useReducer(withdrawLiquidityReducer, {
    amount: '0',
  })

  const handleAmountChange = useCallback((value: string) => {
    dispatch({ type: 'setAmount', payload: value })
  }, [])

  return (
    <PanelView
      title={t('views.liquidity.withdrawLiquidity')}
      header={
        <ViewHeader
          withBack
          title={t('views.liquidity.withdrawLiquidity')}
          actionsComponent={<SwapSettingsPopover />}
        />
      }
    >
      <LiquidityType
        assetName={poolData.firstAsset.asset.name}
        selected={liquidityType}
        onChange={setLiquidityType}
      />
      <AssetInputs
        firstAsset={poolData.firstAsset}
        secondAsset={poolData.secondAsset}
        poolShare={poolData.poolShare}
        amount={amount}
        lpAmount={poolData.lpTokens}
        onAmountChange={handleAmountChange}
        liquidityType={liquidityType}
      />

      <Box className="w-full gap-1" col>
        {/* <LiquidityCard data={liquidityCardData} /> */}
      </Box>

      <Box className="gap-4 pt-5 self-stretch">
        <Button size="lg" stretch>
          {t('views.liquidity.approve')}
        </Button>
        <Button
          size="lg"
          stretch
          variant="secondary"
          onClick={handleOpenLiquidityModal}
        >
          {t('common.withdraw')}
          {/* {t('views.liquidity.enterAmount')} */}
        </Button>
      </Box>
      <ConfirmWithdrawLiquidity
        // Assets data should be based on liquidityType option
        assets={[
          { asset: poolData.firstAsset.asset, value: '123' },
          { asset: poolData.secondAsset.asset, value: '1.23' },
        ]}
        fee=""
        isOpen={isLiquidityModalVisible}
        onCancel={handleCloseLiquidityModal}
      />
    </PanelView>
  )
}

export default WithdrawLiquidity
