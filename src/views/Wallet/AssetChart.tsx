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
  const { label, values } = useChartData(chain)

  return (
    <Box
      height={mode === ViewMode.CARD ? 100 : 80}
      className={classNames('opacity-0 transition-opacity duration-500', {
        '!opacity-100': values.length > 0,
        '!-my-[20px] min-w-[100px] md:max-w-[150px] lg:max-w-[400px]':
          mode === ViewMode.LIST,
      })}
    >
      {values.length > 0 && (
        <ChartPreview label={label} values={values} hideLabel />
      )}
    </Box>
  )
})
