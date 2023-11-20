import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Button, Icon } from 'components/Atomic';
import { Confirm } from 'components/Modals/Confirm';
import { useWallet } from 'context/wallet/hooks';
import { t } from 'services/i18n';
import { useWalletDrawerActions } from 'views/WalletBalance/hooks/useWalletDrawerActions';

export const WalletHeader = () => {
  const { isWalletLoading } = useWallet();
  const {
    handleAddConnectWallet,
    handleRefresh,
    isDisconnectModalOpened,
    openDisconnectConfirmModal,
    onCancelDisconnect,
    onConfirmDisconnect,
  } = useWalletDrawerActions();

  return (
    <Box alignCenter className="pt-6 pb-4 pl-4 pr-2" justify="between">
      <Box alignCenter className="gap-1">
        <Text textStyle="h5">{t('common.wallet')}</Text>
        <Button
          className="px-3"
          leftIcon={
            <Icon
              className={classNames({ '!animate-spin': isWalletLoading })}
              color="primaryBtn"
              name="refresh"
              size={16}
            />
          }
          onClick={handleRefresh}
          tooltip={t('common.refresh')}
          tooltipPlacement="bottom"
          variant="borderlessPrimary"
        />
      </Box>
      <Box className="gap-2">
        <Button
          className="px-3"
          leftIcon={<Icon color="secondaryBtn" name="add" size={16} />}
          onClick={handleAddConnectWallet}
          tooltip={t('views.walletDrawer.connectAnother')}
          tooltipPlacement="left"
          variant="outlineSecondary"
        />
        <Button
          className="px-3"
          leftIcon={<Icon color="orange" name="disconnect" size={16} />}
          onClick={openDisconnectConfirmModal}
          tooltip={t('views.walletDrawer.disconnect')}
          tooltipPlacement="left"
          variant="outlineWarn"
        />
      </Box>

      <Confirm
        description={t('views.walletDrawer.confirmDisconnect')}
        isOpened={isDisconnectModalOpened}
        onCancel={onCancelDisconnect}
        onConfirm={onConfirmDisconnect}
        title={t('common.disconnect')}
      />
    </Box>
  );
};
