import { Box, Typography } from 'components/Atomic';
import { StatsList } from 'components/StatsList';
import { memo } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';

import { useGlobalStatsData } from './useGlobalStatsData';

export const GlobalStats = memo(() => {
  const { hideStats } = useApp();
  const statsData = useGlobalStatsData();

  if (hideStats) {
    return null;
  }

  return (
    <Box col>
      <Box alignCenter className="gap-x-2 rounded-2xl">
        <Typography variant="h3">{t('common.stats')}</Typography>
      </Box>

      <StatsList scrollable list={statsData} />
    </Box>
  );
});
