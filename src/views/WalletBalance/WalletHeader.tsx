import classNames from 'classnames'

import { useWalletDrawerActions } from 'views/WalletBalance/hooks/useWalletDrawerActions'

import { Box, Button, Icon, Typography } from 'components/Atomic'
import { Confirm } from 'components/Modals/Confirm'

import { t } from 'services/i18n'

export const WalletHeader = () => {
  const {
    handleAddConnectWallet,
    handleRefresh,
    isDisconnectModalOpened,
    openDisconnectConfirmModal,
    onCancelDisconnect,
    onConfirmDisconnect,
    isRefreshing,
  } = useWalletDrawerActions()

  return (
    <Box className="pt-6 pb-4 pl-4 pr-2" alignCenter justify="between">
      <Box className="gap-1" alignCenter>
        <Typography variant="h5">{t('common.wallet')}</Typography>
        <Button
          className="px-3"
          variant="primary"
          type="borderless"
          startIcon={
            <Icon
              className={classNames({ '!animate-spin': isRefreshing })}
              name="refresh"
              color="primaryBtn"
              size={16}
            />
          }
          tooltip={t('common.refresh')}
          tooltipPlacement="bottom"
          onClick={handleRefresh}
        />
      </Box>
      <Box className="gap-2">
        <Button
          className="px-3"
          variant="secondary"
          type="outline"
          startIcon={<Icon name="add" color="secondaryBtn" size={16} />}
          tooltip={t('views.walletDrawer.connectAnother')}
          tooltipPlacement="left"
          onClick={handleAddConnectWallet}
        />
        <Button
          className="px-3"
          variant="warn"
          type="outline"
          startIcon={<Icon name="disconnect" color="orange" size={16} />}
          tooltip={t('views.walletDrawer.disconnect')}
          tooltipPlacement="left"
          onClick={openDisconnectConfirmModal}
        />
      </Box>

      <Confirm
        isOpened={isDisconnectModalOpened}
        onConfirm={onConfirmDisconnect}
        onCancel={onCancelDisconnect}
        description={t('views.walletDrawer.confirmDisconnect')}
      />
    </Box>
  )
}
