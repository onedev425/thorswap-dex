import { memo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { useChartData } from 'views/Wallet/hooks'

import { Box } from 'components/Atomic'
import { ChartPreview } from 'components/ChartPreview'

import { ViewMode } from 'types/app'

type Props = {
  asset: Asset
  mode: ViewMode
}

export const AssetChart = memo(({ asset, mode }: Props) => {
  const { label, values } = useChartData(asset)

  return (
    <Box
      center
      style={{ height: mode === ViewMode.CARD ? 100 : 80 }}
      className={classNames('opacity-0 transition-opacity duration-500', {
        '!opacity-100': values.length > 0,
        '!-my-[20px] lg:w-[100px] xl:w-[320px]': mode === ViewMode.LIST,
      })}
    >
      {values.length > 0 && (
        <ChartPreview label={label} values={values} hideLabel />
      )}
    </Box>
  )
})
