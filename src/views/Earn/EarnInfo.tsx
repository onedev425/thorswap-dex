import { Box, Typography } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { InfoTip } from 'components/InfoTip';
import { memo } from 'react';
import { t } from 'services/i18n';
import { SaverProvider } from 'store/midgard/types';

type Props = {
  address: string;
  depositValue: string | null;
  providerData: SaverProvider | null;
};

export const EarnInfo = memo(({ depositValue, providerData, address }: Props) => {
  return (
    <Box col className="mt-5 gap-2">
      <InfoTip type="info">
        <Box col className="self-stretch gap-3 px-3 py-1">
          <Box
            alignCenter
            row
            className="pb-2 border-0 border-b border-solid border-opacity-20 border-light-border-primary dark:border-dark-border-primary"
            justify="between"
          >
            <Typography fontWeight="semibold" variant="subtitle2">
              {t('views.savings.yourPosition')}
            </Typography>

            <HoverIcon iconName="refresh" onClick={() => {}} spin={!!address && !providerData} />
          </Box>

          <Box alignCenter row className="gap-2" justify="between">
            <Typography color="secondary" fontWeight="medium" variant="caption">
              {t('views.savings.yourDeposit')}
            </Typography>

            <Typography fontWeight="medium" variant="subtitle2">
              {depositValue || '-'}
            </Typography>
          </Box>
        </Box>
      </InfoTip>
    </Box>
  );
});
