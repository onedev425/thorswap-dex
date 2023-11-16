import type { Chain } from '@swapkit/core';
import { Box } from 'components/Atomic';
import { CountDownIndicator } from 'components/CountDownIndicator';
import { GasButton } from 'components/GasButton/GasButton';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { ViewHeader } from 'components/ViewHeader';
import { memo } from 'react';
import { t } from 'services/i18n';

type Props = {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  refetchData?: () => void;
  inputAssetChain: Chain;
};

export const SwapHeader = memo(
  ({ refetchData, toggleSidebar, isSidebarVisible, inputAssetChain }: Props) => {
    return (
      <ViewHeader
        actionsComponent={
          <Box center row className="space-x-2">
            {refetchData && <CountDownIndicator duration={60} refresh={refetchData} />}

            <GasButton
              inputAssetChain={inputAssetChain}
              isSidebarVisible={isSidebarVisible}
              toggleSidebar={toggleSidebar}
            />
            <GlobalSettingsPopover transactionMode />
          </Box>
        }
        title={t('common.swap')}
      />
    );
  },
);
