import { Asset } from '@thorswap-lib/multichain-core';
import { Box, Button, Link, Typography } from 'components/Atomic';
import { InfoTip } from 'components/InfoTip';
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
          <Typography>{t('views.multisig.notActiveAccount')}</Typography>
          <Link to={getSendRoute(Asset.RUNE(), address)}>
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
