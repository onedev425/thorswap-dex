import { useCallback, useMemo, useReducer, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetInputs } from 'views/WithdrawLiquidity/components/AssetInputs'
import { PoolAsset } from 'views/WithdrawLiquidity/types'
import { withdrawLiquidityReducer } from 'views/WithdrawLiquidity/withdrawLiquidityReducer'

import { Button, Box, Typography, Tooltip, Icon } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { LiquidityCard } from 'components/LiquidityCard'
import { AssetDataType } from 'components/LiquidityCard/types'
import { LiquidityType } from 'components/LiquidityType/LiquidityType'
import { LiquidityTypeOption } from 'components/LiquidityType/types'
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

// TODO - fix types whem real data will be integrated
const liquidityCardData = [
  poolData.firstAsset,
  poolData.secondAsset,
] as unknown as AssetDataType[]

export const WithdrawLiquidity = () => {
  const [liquidityType, setLiquidityType] = useState(
    LiquidityTypeOption.Symmetrical,
  )
  const [{ amount }, dispatch] = useReducer(withdrawLiquidityReducer, {
    amount: '0',
  })

  const handleAmountChange = useCallback((value: string) => {
    dispatch({ type: 'setAmount', payload: value })
  }, [])

  const summary = useMemo(
    () => [
      {
        label: t('common.transactionFee'),
        value: (
          <Box className="gap-2" center>
            <Typography variant="caption">0.00675 ETH ($20)</Typography>
            <Tooltip content={t('views.liquidity.gasFeeTooltip')}>
              <Icon size={20} color="secondary" name="infoCircle" />
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  )

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
        <LiquidityCard data={liquidityCardData} />
      </Box>

      <InfoTable horizontalInset items={summary} />

      <Box className="gap-4 pt-5 self-stretch">
        <Button size="lg" stretch>
          {t('views.liquidity.approve')}
        </Button>
        <Button size="lg" stretch variant="secondary">
          {t('common.withdraw')}
          {/* {t('views.liquidity.enterAmount')} */}
        </Button>
      </Box>
    </PanelView>
  )
}

export default WithdrawLiquidity
