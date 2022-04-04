import { memo, useState } from 'react'

import classNames from 'classnames'

import { Box, SwitchToggle, Typography } from 'components/Atomic'
import { StatsList } from 'components/StatsList'

import { t } from 'services/i18n'

import { useGlobalStatsData } from './useGlobalStatsData'

export const GlobalStats = memo(() => {
  const [visible, setVisible] = useState(true)
  const statsData = useGlobalStatsData()

  return (
    <Box col>
      <Box
        alignCenter
        className={classNames('pl-2 gap-x-2 rounded-2xl', { 'pb-6': !visible })}
      >
        <SwitchToggle checked={visible} onChange={setVisible} />
        <Typography variant="caption">
          {visible ? t('common.hideStats') : t('common.showStats')}
        </Typography>
      </Box>

      {visible && <StatsList list={statsData} scrollable />}
    </Box>
  )
})
