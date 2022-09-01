import { Chain } from '@thorswap-lib/types';
import { Box, Button, Icon, Link, Typography } from 'components/Atomic';
import { InfoTable } from 'components/InfoTable';
import { Confirm } from 'components/Modals/Confirm';
import { PanelView } from 'components/PanelView';
import { ViewHeader } from 'components/ViewHeader';
import { useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { ROUTES } from 'settings/constants';
import { useMultisig } from 'store/multisig/hooks';
import { useAppSelector } from 'store/store';
import { InactiveAccountWarning } from 'views/Multisig/components/InactiveAccountWarning';
import { MultisigExport } from 'views/Multisig/components/MultisigExport/MultisigExport';
import { useMultisigWalletInfo } from 'views/Multisig/hooks';

export const MultisigInfo = () => {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const info = useMultisigWalletInfo();
  const { loadingBalances, name, address } = useAppSelector((state) => state.multisig);
  const { loadBalances, clearMultisigWallet } = useMultisig();
  const accountUrl = useMemo(
    () => multichain().getExplorerAddressUrl(Chain.THORChain, address),
    [address],
  );

  const handleClearWallet = useCallback(() => {
    clearMultisigWallet();
    setIsConfirmVisible(false);
  }, [clearMultisigWallet, setIsConfirmVisible]);

  return (
    <PanelView
      header={
        <ViewHeader
          actionsComponent={
            <Box className="gap-2">
              <Button
                className="px-3"
                onClick={loadBalances}
                startIcon={
                  <Icon color="primaryBtn" name="refresh" size={16} spin={loadingBalances} />
                }
                tooltip={t('common.refresh')}
                tooltipPlacement="bottom"
                type="borderless"
                variant="primary"
              />
              <Button
                className="px-3"
                onClick={() => setIsConfirmVisible(true)}
                startIcon={<Icon color="orange" name="disconnect" size={16} />}
                tooltip={t('views.multisig.disconnect')}
                tooltipPlacement="left"
                type="borderless"
                variant="warn"
              />
            </Box>
          }
          title={t('views.multisig.thorSafeWallet')}
        />
      }
      title={t('views.multisig.thorSafeWallet')}
    >
      <Box col className="gap-5 self-stretch" flex={1}>
        <Box alignCenter row className="mx-1 gap-2" justify="between">
          <Typography variant="subtitle2">{name || 'Your THORSafe'}</Typography>
          <Box className="gap-2">
            <MultisigExport />
            <Link to={accountUrl}>
              <Button
                endIcon={<Icon name="external" size={18} />}
                tooltip={t('views.wallet.goToAccount')}
                variant="tint"
              />
            </Link>
          </Box>
        </Box>
        <InfoTable horizontalInset items={info} size="lg" />

        <InactiveAccountWarning />

        <Box align="end" className="mt-8" flex={1}>
          <Link className="flex-1" to={ROUTES.TxBuilder}>
            <Button stretch onClick={() => {}} variant="primary">
              {t('views.multisig.createNewTransaction')}
            </Button>
          </Link>
        </Box>
      </Box>

      <Confirm
        description={t('views.multisig.confirmWalletRemoval')}
        isOpened={isConfirmVisible}
        onCancel={() => setIsConfirmVisible(false)}
        onConfirm={handleClearWallet}
        title={t('common.pleaseConfirm')}
      />
    </PanelView>
  );
};
