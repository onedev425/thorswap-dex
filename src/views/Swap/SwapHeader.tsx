import { memo, useCallback } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Icon } from 'components/Atomic'
import { CountDownIndicator } from 'components/CountDownIndicator'
import { GlobalSettingsPopover } from 'components/GlobalSettings'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { navigateToPoolDetail } from 'settings/constants'

type Props = {
  asset: Asset
  refetchData: () => void
  isLoading: boolean
}

export const SwapHeader = memo(({ asset, refetchData, isLoading }: Props) => {
  const navigateToPoolInfo = useCallback(() => {
    navigateToPoolDetail(asset)
  }, [asset])

  return (
    <ViewHeader
      title={t('common.swap')}
      actionsComponent={
        <Box center row className="space-x-2">
          <CountDownIndicator
            duration={60}
            resetIndicator={isLoading}
            onClick={refetchData}
          />

          <Button
            onClick={navigateToPoolInfo}
            className="w-10 px-1.5 group"
            type="borderless"
            variant="tint"
            tooltip={t('common.poolAnalytics')}
            tooltipPlacement="top"
            startIcon={
              <Icon
                className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                color="secondary"
                name="chart"
              />
            }
          />
          <GlobalSettingsPopover transactionMode />
        </Box>
      }
    />
  )
})
