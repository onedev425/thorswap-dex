import { memo } from 'react'

import { StakeActions } from 'views/StakeVThor/types'
import { useVthorUtil } from 'views/StakeVThor/useVthorUtil'

import { Box, Button } from 'components/Atomic'

import { useWallet } from 'store/wallet/hooks'

import { fromWei } from 'services/contract'
import { t } from 'services/i18n'

type Props = {
  action: StakeActions
  handleVthorAction: () => void
  emptyInput: boolean
  setIsConnectModalOpen: (isOpen: boolean) => void
  ethAddress?: string
}

export const ConfirmVThorButton = memo(
  ({
    action,
    handleVthorAction,
    ethAddress,
    setIsConnectModalOpen,
    emptyInput,
  }: Props) => {
    const { vthorBalance, approveTHOR } = useVthorUtil()
    const { isVthorApproved } = useWallet()

    return (
      <Box className="self-stretch pt-5">
        {ethAddress ? (
          <Box className="w-full">
            {action === StakeActions.Deposit ? (
              <>
                {isVthorApproved ? (
                  <Button
                    isFancy
                    stretch
                    size="lg"
                    loading={false}
                    disabled={emptyInput}
                    onClick={handleVthorAction}
                  >
                    {t('txManager.stake')}
                  </Button>
                ) : (
                  <Button
                    isFancy
                    stretch
                    size="lg"
                    loading={false}
                    onClick={approveTHOR}
                  >
                    {t('txManager.approve')}
                  </Button>
                )}
              </>
            ) : (
              <Button
                isFancy
                stretch
                size="lg"
                disabled={emptyInput || fromWei(vthorBalance) === 0}
                onClick={handleVthorAction}
              >
                {t('views.stakingVThor.unstake')}
              </Button>
            )}
          </Box>
        ) : (
          <Button
            isFancy
            size="lg"
            stretch
            onClick={() => setIsConnectModalOpen(true)}
          >
            {t('common.connectWallet')}
          </Button>
        )}
      </Box>
    )
  },
)
