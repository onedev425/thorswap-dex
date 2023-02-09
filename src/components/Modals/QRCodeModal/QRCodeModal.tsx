import { Text } from '@chakra-ui/react';
import Logo from 'assets/images/logo.png';
import { Box, Icon, Modal, Tooltip } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { useAddressUtils } from 'hooks/useAddressUtils';
import QRCode from 'qrcode-react';
import { useEffect, useState } from 'react';
import { t } from 'services/i18n';

type Props = {
  address: string;
  chain: string;
  title?: string;
  onCancel: () => void;
};

export const QRCodeModal = ({ title, address, onCancel, chain }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const { shortAddress, handleCopyAddress } = useAddressUtils(address);

  useEffect(() => {
    if (address) {
      setIsOpened(true);
    }
  }, [address]);

  const onClose = () => {
    setIsOpened(false);
    // call onCancel callback after modal close animation
    setTimeout(() => onCancel(), 300);
  };

  return (
    <Modal isOpened={isOpened} onClose={onClose} title={title || ''}>
      <Box center col>
        <Text textStyle="subtitle2">{chain}</Text>
        <Box className="gap-3 p-2 bg-white rounded-xl mt-4">
          <QRCode logo={Logo} logoWidth={64} size={256} value={address} />
        </Box>
        <Box alignCenter className="space-x-2 mt-3">
          <Text>{shortAddress}</Text>
          <Tooltip content={t('common.copy')}>
            <Box className={baseHoverClass}>
              <Icon
                className="cursor-pointer"
                color="cyan"
                name="copy"
                onClick={handleCopyAddress}
                size={18}
              />
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Modal>
  );
};
