import { memo } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { useChartData } from 'views/Wallet/hooks'

import { Box } from 'components/Atomic'
import { ChartPreview } from 'components/ChartPreview'

import { ViewMode } from 'types/global'

type Props = {
  chain: SupportedChain
  mode: ViewMode
}

export const AssetChart = memo(({ chain, mode }: Props) => {
  const chartData = useChartData(chain)

  return (
    <Box
      height={mode === ViewMode.CARD ? 100 : 60}
      mb={3}
      className={classNames('opacity-0 transition-opacity duration-1000', {
        '!opacity-100': chartData.length > 0,
      })}
    >
      <ChartPreview data={chartData} hideLabel />
    </Box>
  )
})
