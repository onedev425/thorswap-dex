import { memo, useState } from 'react'

import { Box, SwitchToggle, Typography } from 'components/Atomic'
import { StatsList } from 'components/StatsList'

import { t } from 'services/i18n'

import { useGlobalStatsData } from './useGlobalStatsData'

export const GlobalStats = memo(() => {
  const [visible, setVisible] = useState(true)
  const statsData = useGlobalStatsData()

  return (
    <div>
      <Box alignCenter className="pl-2 gap-x-2 pb-6 rounded-2xl">
        <SwitchToggle checked={visible} onChange={setVisible} />
        <Typography variant="caption">{t('common.showStats')}</Typography>
      </Box>

      {visible && <StatsList list={statsData} scrollable />}
    </div>
  )
})
