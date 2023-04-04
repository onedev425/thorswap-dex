import { Text } from '@chakra-ui/react';
import { Box, Button, Link } from 'components/Atomic';
import { InfoTip } from 'components/InfoTip';
import { RUNEAsset } from 'helpers/assets';
import { useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { getSendRoute } from 'settings/router';
import { useMultisig } from 'store/multisig/hooks';
import { useAppSelector } from 'store/store';
import { useMultissigAssets } from 'views/Multisig/hooks';

export const InactiveAccountWarning = () => {
  const { address } = useAppSelector((state) => state.multisig);
  const { runeBalance } = useMultissigAssets();
  const { isMultsigActivated } = useMultisig();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkIsInitialized = async () => {
      const isInitialized = await isMultsigActivated();
      setIsVisible(!isInitialized);
    };

    if (address) {
      checkIsInitialized();
    }
  }, [address, isMultsigActivated, runeBalance]);

  if (!isVisible) {
    return null;
  }

  return (
    <InfoTip
      content={
        <Box col className="gap-2">
          <Text>{t('views.multisig.notActiveAccount')}</Text>
          <Link to={getSendRoute(RUNEAsset, address)}>
            <Button stretch variant="secondary">
              {`${t('common.send')} RUNE`}
            </Button>
          </Link>
        </Box>
      }
      title={t('views.multisig.accountNotAcivated')}
      type="warn"
    />
  );
};
