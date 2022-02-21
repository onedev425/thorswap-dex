import { useState } from 'react'

import { Card, Box, Icon } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'
import { LiquidityCard } from 'components/LiquidityCard'
import { AssetDataType } from 'components/LiquidityCard/types'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const Data = [
  [
    {
      assetName: 'Pooled THOR',
      assetTicker: 'RUNE',
      amount: '37.9033',
    },
    {
      assetName: 'Pooled ETH',
      assetTicker: 'ETH',
      amount: '0.00546842',
    },
  ] as AssetDataType[],
  [
    {
      assetName: 'Pooled THOR',
      assetTicker: 'RUNE',
      amount: '37.9033',
    },
    {
      assetName: 'Pooled Doge',
      assetTicker: 'DOGE',
      amount: '0.00546842',
    },
  ] as AssetDataType[],
]

const ManageLiquidity = () => {
  const [tipVisible, setTipVisible] = useState(true)

  return (
    <Box className="md:px-40" alignSelf="center" alignCenter col>
      <Box col>
        <ViewHeader
          title={t('common.liquidityPosition')}
          withBack
          actionsComponent={<Icon name="cog" color="secondary" />}
        />
      </Box>
      <Card size="lg" stretch className="flex-col mt-12 px-0 pb-10 shadow-lg">
        {tipVisible && (
          <InfoTip
            className="mt-0 mb-0"
            title={t('common.liquidityProvider')}
            content={t('views.liquidity.tip')}
            onClose={() => setTipVisible(false)}
          />
        )}

        <Box className="p-4 md:p-8 pb-0 gap-3 md:w-full" col>
          {Data.map((d) => (
            <LiquidityCard
              key={`${d[0].assetName}-${d[1].assetName}`}
              data={d}
            />
          ))}
        </Box>
      </Card>
    </Box>
  )
}

export default ManageLiquidity
