import { Text } from '@chakra-ui/react';
import { Asset } from '@thorswap-lib/multichain-core';
import { Box, Icon } from 'components/Atomic';
import { DoughnutChart } from 'components/Chart/DoughnutChart/DoughnutChart';
import { HighlightCard } from 'components/HighlightCard';
import { ReloadButton } from 'components/ReloadButton';
import { useCallback, useState } from 'react';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';
import { EarnPosition } from 'views/Earn/EarnPosition';
import { SaverPosition } from 'views/Earn/types';
import { ShareChartIndex, sharesChartIndexes } from 'views/Home/types';

type Props = {
  positions: SaverPosition[];
  refresh: () => void;
  withdrawAsset: (asset: Asset) => void;
  depositAsset: (asset: Asset) => void;
};

export const EarnPositions = ({ positions, refresh, withdrawAsset, depositAsset }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [volumeChartIndex, setVolumeChartIndex] = useState<string>(ShareChartIndex.Earned);
  const { isWalletLoading } = useWallet();

  const onReload = useCallback(() => {
    setIsLoading(true);
    refresh();
    setTimeout(() => setIsLoading(false), 500);
  }, [refresh]);

  return (
    <Box center col className="w-full">
      <Box col className="max-w-[480px] w-full gap-1">
        {!!positions.length && (
          <>
            <Box className="gap-x-2 mb-1 w-full" justify="between">
              <Box />
              <ReloadButton loading={isLoading} onLoad={onReload} size={16} />
            </Box>
            <HighlightCard>
              <DoughnutChart
                chartIndexes={sharesChartIndexes}
                data={positions}
                selectChart={setVolumeChartIndex}
                selectedIndex={volumeChartIndex}
                title="Earn positions"
              />
            </HighlightCard>
          </>
        )}
        {positions.length ? (
          positions.map((position) => (
            <EarnPosition
              deposit={depositAsset}
              key={position.asset.toString()}
              position={position}
              withdraw={withdrawAsset}
            />
          ))
        ) : (
          <Box center className="gap-2" flex={1}>
            <Text textStyle="subtitle2" variant="primary">
              {isWalletLoading ? t('common.loading') : t('views.wallet.noDataToShow')}
            </Text>
            {isWalletLoading && <Icon spin name="loader" size={32} />}
          </Box>
        )}
      </Box>
    </Box>
  );
};
