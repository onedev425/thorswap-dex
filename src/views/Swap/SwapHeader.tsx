import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Box, Button, Icon } from 'components/Atomic';
import { CountDownIndicator } from 'components/CountDownIndicator';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { ViewHeader } from 'components/ViewHeader';
import { memo, useCallback } from 'react';
import { t } from 'services/i18n';
import { navigateToPoolDetail } from 'settings/router';

type Props = {
  asset: Asset;
  refetchData?: () => void;
};

export const SwapHeader = memo(({ asset, refetchData }: Props) => {
  const navigateToPoolInfo = useCallback(() => {
    navigateToPoolDetail(asset);
  }, [asset]);

  return (
    <ViewHeader
      actionsComponent={
        <Box center row className="space-x-2">
          {refetchData && <CountDownIndicator duration={60} refresh={refetchData} />}

          <Button
            className="w-10 px-1.5 group"
            leftIcon={
              <Icon
                className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                color="secondary"
                name="chart"
              />
            }
            onClick={navigateToPoolInfo}
            tooltip={t('common.poolAnalytics')}
            tooltipPlacement="top"
            variant="borderlessTint"
          />
          <GlobalSettingsPopover transactionMode />
        </Box>
      }
      title={t('common.swap')}
    />
  );
});
