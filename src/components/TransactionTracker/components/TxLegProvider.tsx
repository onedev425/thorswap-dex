import { Box, Flex } from '@chakra-ui/react';
import { AssetIcon } from 'components/AssetIcon';
import { Icon, Tooltip } from 'components/Atomic';
import { providerLogoURL } from 'helpers/logoURL';
import { t } from 'services/i18n';
import type { TxTrackerLeg } from 'store/transactions/types';

type Props = {
  leg: TxTrackerLeg;
  isTransfer?: boolean;
  horizontalView?: boolean;
};

export const TxLegProvider = ({ leg, isTransfer, horizontalView }: Props) => {
  return (
    <Flex align="center" direction="column" maxW="90px" minW="50px" mt={2}>
      <Box display={horizontalView ? 'flex' : 'none'}>
        {!!leg.provider && (
          <Tooltip
            content={
              isTransfer
                ? t('txTracker.transfer')
                : `${t('txManager.provider')}: ${leg.provider}` || ''
            }
          >
            <AssetIcon logoURI={providerLogoURL(leg.provider)} size={30} />
          </Tooltip>
        )}
        {isTransfer && (
          <Tooltip content={t('txManager.transferToRouter')}>
            <Icon color="secondaryBtn" name="switch" size={30} />
          </Tooltip>
        )}
      </Box>
      <Flex mt={!horizontalView ? 0 : 8}>
        <Icon name="chevronRight" />
      </Flex>
    </Flex>
  );
};
