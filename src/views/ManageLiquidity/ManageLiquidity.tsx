import { useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'
import { LiquidityCard } from 'components/LiquidityCard'
import { AssetDataType } from 'components/LiquidityCard/types'
import { PanelView } from 'components/PanelView'
import { SwapSettingsPopover } from 'components/SwapSettings'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const Data = [
  [
    {
      assetName: 'Pooled ETH',
      asset: Asset.ETH(),
      amount: '0.00546842',
    },
    {
      assetName: 'Pooled RUNE',
      asset: Asset.RUNE(),
      amount: '37.9033',
    },
  ] as AssetDataType[],
  [
    {
      assetName: 'Pooled Doge',
      asset: Asset.DOGE(),
      amount: '0.00546842',
    },
    {
      assetName: 'Pooled RUNE',
      asset: Asset.RUNE(),
      amount: '37.9033',
    },
  ] as AssetDataType[],
]

const ManageLiquidity = () => {
  const [tipVisible, setTipVisible] = useState(true)

  return (
    <PanelView
      title="Liquidity"
      header={
        <ViewHeader
          title={t('common.liquidityPosition')}
          actionsComponent={<SwapSettingsPopover />}
        />
      }
    >
      {tipVisible && (
        <InfoTip
          className="w-full mt-0 mb-4"
          title={t('common.liquidityProvider')}
          content={t('views.liquidity.tip')}
          onClose={() => setTipVisible(false)}
        />
      )}

      <Box className="w-full gap-1" col>
        {Data.map((d) => (
          <LiquidityCard
            key={`${d[0].assetName}-${d[1].assetName}`}
            data={d}
            withFooter
          />
        ))}
      </Box>
    </PanelView>
  )
}

export default ManageLiquidity
