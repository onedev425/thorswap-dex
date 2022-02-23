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
    <Box className="self-center w-full max-w-[600px]" col>
      <Box className="w-full mx-2" col>
        <ViewHeader
          title={t('common.liquidityPosition')}
          actionsComponent={<Icon name="cog" color="secondary" />}
        />
      </Box>
      <Card
        size="lg"
        stretch
        className="flex-col items-center p-6 mt-4 shadow-lg md:w-full md:mt-8 md:p-10 md:h-auto md:pb-10"
      >
        {tipVisible && (
          <InfoTip
            className="w-full mt-0 mb-4"
            title={t('common.liquidityProvider')}
            content={t('views.liquidity.tip')}
            onClose={() => setTipVisible(false)}
          />
        )}

        <Box className="w-full gap-3" col>
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
