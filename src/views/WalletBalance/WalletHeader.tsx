import classNames from 'classnames';
import { Box, Button, Icon, Typography } from 'components/Atomic';
import { Confirm } from 'components/Modals/Confirm';
import { t } from 'services/i18n';
import { useWalletDrawerActions } from 'views/WalletBalance/hooks/useWalletDrawerActions';

export const WalletHeader = () => {
  const {
    handleAddConnectWallet,
    handleRefresh,
    isDisconnectModalOpened,
    openDisconnectConfirmModal,
    onCancelDisconnect,
    onConfirmDisconnect,
    isRefreshing,
  } = useWalletDrawerActions();

  return (
    <Box alignCenter className="pt-6 pb-4 pl-4 pr-2" justify="between">
      <Box alignCenter className="gap-1">
        <Typography variant="h5">{t('common.wallet')}</Typography>
        <Button
          className="px-3"
          onClick={handleRefresh}
          startIcon={
            <Icon
              className={classNames({ '!animate-spin': isRefreshing })}
              color="primaryBtn"
              name="refresh"
              size={16}
            />
          }
          tooltip={t('common.refresh')}
          tooltipPlacement="bottom"
          type="borderless"
          variant="primary"
        />
      </Box>
      <Box className="gap-2">
        <Button
          className="px-3"
          onClick={handleAddConnectWallet}
          startIcon={<Icon color="secondaryBtn" name="add" size={16} />}
          tooltip={t('views.walletDrawer.connectAnother')}
          tooltipPlacement="left"
          type="outline"
          variant="secondary"
        />
        <Button
          className="px-3"
          onClick={openDisconnectConfirmModal}
          startIcon={<Icon color="orange" name="disconnect" size={16} />}
          tooltip={t('views.walletDrawer.disconnect')}
          tooltipPlacement="left"
          type="outline"
          variant="warn"
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
