import { memo } from 'react'

import { Box, Typography } from 'components/Atomic'
import { StatsList } from 'components/StatsList'

import { useApp } from 'store/app/hooks'

import { t } from 'services/i18n'

import { useGlobalStatsData } from './useGlobalStatsData'

export const GlobalStats = memo(() => {
  const { areStatsHidden } = useApp()
  const statsData = useGlobalStatsData()

  if (areStatsHidden) {
    return null
  }

  return (
    <Box col>
      <Box className="pl-2 gap-x-2 rounded-2xl" alignCenter>
        <Typography variant="h3">{t('common.stats')}</Typography>
      </Box>

      <StatsList list={statsData} scrollable />
    </Box>
  )
})
