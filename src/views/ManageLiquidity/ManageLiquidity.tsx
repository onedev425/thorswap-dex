import { useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  hasConnectedWallet,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'

import { ChainLiquidityPanel } from 'views/ManageLiquidity/components/ChainLiquidityPanel'

import { Button, Box } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'
import { PanelView } from 'components/PanelView'
import { ReloadButton } from 'components/ReloadButton'
import { SwapSettingsPopover } from 'components/SwapSettings'
import { ViewHeader } from 'components/ViewHeader'

import { useMidgard } from 'redux/midgard/hooks'
import { hasPendingLP } from 'redux/midgard/utils'
import { useWallet } from 'redux/wallet/hooks'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

const ManageLiquidity = () => {
  const navigate = useNavigate()
  const { wallet, setIsConnectModalOpen } = useWallet()

  const {
    chainMemberDetails,
    getAllMemberDetails,
    memberDetailsLoading,
    chainMemberDetailsLoading,
  } = useMidgard()

  const [tipVisible, setTipVisible] = useState(true)

  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet])

  useEffect(() => {
    getAllMemberDetails()
  }, [getAllMemberDetails])

  const hasPending = useMemo(
    () => hasPendingLP(chainMemberDetails),
    [chainMemberDetails],
  )

  return (
    <PanelView
      title={t('common.liquidity')}
      header={
        <ViewHeader
          title={t('common.liquidityPosition')}
          actionsComponent={
            <>
              <ReloadButton
                loading={memberDetailsLoading}
                onLoad={getAllMemberDetails}
              />
              <SwapSettingsPopover />
            </>
          }
        />
      }
    >
      <Box className="gap-3 self-stretch" col>
        {hasPending && tipVisible && (
          <InfoTip
            className="w-full mt-0 mb-4"
            title={t('pendingLiquidity.pendingInfoTitle')}
            content={t('pendingLiquidity.pendingInfoGeneral')}
            onClose={() => setTipVisible(false)}
            type="warn"
          />
        )}

        {isWalletConnected ? (
          <>
            <Box className="w-full gap-x-8" justify="between">
              <Button
                size="lg"
                stretch
                onClick={() => navigate(ROUTES.AddLiquidity)}
              >
                {t('common.deposit')}
              </Button>

              <Button size="lg" stretch>
                {t('common.create')}
              </Button>
            </Box>

            {!!Object.keys(chainMemberDetails).length && (
              <Box className="w-full gap-2" col>
                {Object.keys(chainMemberDetails).map((chain) => (
                  <ChainLiquidityPanel
                    key={chain}
                    chain={chain as SupportedChain}
                    data={chainMemberDetails[chain]}
                    isLoading={chainMemberDetailsLoading?.[chain] ?? false}
                  />
                ))}
              </Box>
            )}
          </>
        ) : (
          <Box className="w-full gap-x-8" justify="between">
            <Button
              isFancy
              size="lg"
              stretch
              onClick={() => setIsConnectModalOpen(true)}
            >
              {t('common.connectWallet')}
            </Button>
          </Box>
        )}
      </Box>
    </PanelView>
  )
}

export default ManageLiquidity
