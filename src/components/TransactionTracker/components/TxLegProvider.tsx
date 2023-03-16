import { Flex } from '@chakra-ui/react';
import { AssetIcon } from 'components/AssetIcon';
import { Icon, Tooltip } from 'components/Atomic';
import { providerLogoURL } from 'helpers/logoURL';
import { t } from 'services/i18n';
import { TxTrackerLeg } from 'store/transactions/types';

type Props = {
  leg: TxTrackerLeg;
  isTransfer?: boolean;
};

export const TxLegProvider = ({ leg, isTransfer }: Props) => {
  return (
    <Flex align="center" direction="column" maxW="90px" minW="50px" mt={2}>
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
      {isTransfer && <Icon color="secondaryBtn" name="switch" size={30} />}
      <Flex mt={8}>
        <Icon name="chevronRight" />
      </Flex>
    </Flex>
  );
};
