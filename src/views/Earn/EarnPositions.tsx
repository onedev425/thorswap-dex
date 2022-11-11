import { Asset } from '@thorswap-lib/multichain-core';
import { Box, Typography } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { ReloadButton } from 'components/ReloadButton';
import { useCallback, useState } from 'react';
import { t } from 'services/i18n';
import { EarnPosition } from 'views/Earn/EarnPosition';
import { SaverPosition } from 'views/Earn/types';

type Props = {
  positions: SaverPosition[];
  refresh: () => void;
  withdrawAsset: (asset: Asset) => void;
  depositAsset: (asset: Asset) => void;
};

export const EarnPositions = ({ positions, refresh, withdrawAsset, depositAsset }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const onReload = useCallback(() => {
    setIsLoading(true);
    refresh();
    setTimeout(() => setIsLoading(false), 500);
  }, [refresh]);

  if (!positions.length) {
    return null;
  }

  return (
    <Box col className="gap-1 mt-3">
      <InfoRow
        className="!mx-1.5 pl-1.5"
        label={<Typography> {t('views.savings.yourPositions')}</Typography>}
        size="sm"
        value={
          <Box className="gap-x-2 mb-1">
            <ReloadButton loading={isLoading} onLoad={onReload} size={16} />
          </Box>
        }
      />

      {positions.map((position) => (
        <EarnPosition
          deposit={depositAsset}
          key={position.asset.toString()}
          position={position}
          withdraw={withdrawAsset}
        />
      ))}
    </Box>
  );
};
