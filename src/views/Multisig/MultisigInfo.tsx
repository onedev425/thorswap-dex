import { useState, useCallback, useMemo } from 'react'

import { Chain } from '@thorswap-lib/types'

import { InactiveAccountWarning } from 'views/Multisig/components/InactiveAccountWarning'
import { MultisigExport } from 'views/Multisig/components/MultisigExport/MultisigExport'
import { useMultisigWalletInfo } from 'views/Multisig/hooks'

import { Box, Button, Icon, Link, Typography } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { Confirm } from 'components/Modals/Confirm'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { useMultisig } from 'store/multisig/hooks'
import { useAppSelector } from 'store/store'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { ROUTES } from 'settings/constants'

export const MultisigInfo = () => {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const info = useMultisigWalletInfo()
  const { loadingBalances, name, address } = useAppSelector(
    (state) => state.multisig,
  )
  const { loadBalances, clearMultisigWallet } = useMultisig()
  const accountUrl = useMemo(
    () => multichain.getExplorerAddressUrl(Chain.THORChain, address),
    [address],
  )

  const handleClearWallet = useCallback(() => {
    clearMultisigWallet()
    setIsConfirmVisible(false)
  }, [clearMultisigWallet, setIsConfirmVisible])

  return (
    <PanelView
      title={t('views.multisig.thorSafeWallet')}
      header={
        <ViewHeader
          title={t('views.multisig.thorSafeWallet')}
          actionsComponent={
            <Box className="gap-2">
              <Button
                className="px-3"
                variant="primary"
                type="borderless"
                startIcon={
                  <Icon
                    spin={loadingBalances}
                    name="refresh"
                    color="primaryBtn"
                    size={16}
                  />
                }
                tooltip={t('common.refresh')}
                tooltipPlacement="bottom"
                onClick={loadBalances}
              />
              <Button
                className="px-3"
                variant="warn"
                type="borderless"
                startIcon={<Icon name="disconnect" color="orange" size={16} />}
                tooltip={t('views.multisig.disconnect')}
                tooltipPlacement="left"
                onClick={() => setIsConfirmVisible(true)}
              />
            </Box>
          }
        />
      }
    >
      <Box className="gap-5 self-stretch" col flex={1}>
        <Box className="mx-1 gap-2" justify="between" alignCenter row>
          <Typography variant="subtitle2">{name || 'Your THORSafe'}</Typography>
          <Box className="gap-2">
            <MultisigExport />
            <Link to={accountUrl}>
              <Button
                variant="tint"
                endIcon={<Icon name="external" size={18} />}
                tooltip={t('views.wallet.goToAccount')}
              />
            </Link>
          </Box>
        </Box>
        <InfoTable items={info} size="lg" horizontalInset />

        <InactiveAccountWarning />

        <Box className="mt-8" flex={1} align="end">
          <Link className="flex-1" to={ROUTES.TxBuilder}>
            <Button stretch variant="primary" onClick={() => {}}>
              {t('views.multisig.newTransaction')}
            </Button>
          </Link>
        </Box>
      </Box>

      <Confirm
        title={t('common.pleaseConfirm')}
        description={t('views.multisig.confirmWalletRemoval')}
        isOpened={isConfirmVisible}
        onCancel={() => setIsConfirmVisible(false)}
        onConfirm={handleClearWallet}
      />
    </PanelView>
  )
}
