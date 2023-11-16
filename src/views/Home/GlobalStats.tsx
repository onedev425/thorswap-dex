import { Text } from '@chakra-ui/react';
import { Box } from 'components/Atomic';
import { StatsList } from 'components/StatsList';
import { memo } from 'react';
import { useApp } from 'store/app/hooks';

import { useGlobalStatsData } from './useGlobalStatsData';

const GlobalStatsComponent = () => {
  const { hideStats } = useApp();
  const statsData = useGlobalStatsData();

  if (hideStats) return null;

  return (
    <Box col>
      <Box alignCenter className="gap-x-2 rounded-2xl">
        <Text textStyle="h3">THORChain Stats</Text>
      </Box>

      <StatsList scrollable itemWidth={230} list={statsData} />
    </Box>
  );
};

export const GlobalStats = memo(GlobalStatsComponent);
