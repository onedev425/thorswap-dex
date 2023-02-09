import { Text } from '@chakra-ui/react';
import { Box, Tooltip } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { HoverIcon } from 'components/HoverIcon';
import { useAddressUtils } from 'hooks/useAddressUtils';
import { t } from 'services/i18n';

type Props = {
  type: 'short' | 'mini' | 'icon' | 'full';
  address: string;
};

export const CopyAddress = ({ type = 'icon', address }: Props) => {
  const { miniAddress, shortAddress, handleCopyAddress } = useAddressUtils(address);

  if (type === 'icon') {
    return (
      <HoverIcon
        iconName="copy"
        onClick={handleCopyAddress}
        size={16}
        tooltip={t('views.wallet.copyAddress')}
      />
    );
  }

  const displayAddress = type === 'full' ? address : type === 'mini' ? miniAddress : shortAddress;

  return (
    <Tooltip content={t('views.wallet.copyAddress')}>
      <Box onClick={handleCopyAddress}>
        <Text className={baseHoverClass} fontWeight="semibold" textStyle="caption">
          {displayAddress}
        </Text>
      </Box>
    </Tooltip>
  );
};
