import { useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { hasConnectedWallet } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'

import { Button, Box } from 'components/Atomic'
import { GlobalSettingsPopover } from 'components/GlobalSettings'
import { InfoTip } from 'components/InfoTip'
import { PanelView } from 'components/PanelView'
import { ReloadButton } from 'components/ReloadButton'
import { ViewHeader } from 'components/ViewHeader'

import { useMidgard } from 'store/midgard/hooks'
import { hasPendingLP } from 'store/midgard/utils'
import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'

import { sortChains } from 'helpers/chains'

import { getAddLiquidityRoute, ROUTES } from 'settings/constants'

import { ChainLiquidityPanel } from './ChainLiquidityPanel'

const Liquidity = () => {
  const navigate = useNavigate()
  const { wallet, setIsConnectModalOpen } = useWallet()

  const {
    pendingLP,
    chainMemberDetails,
    getAllMemberDetails,
    chainMemberDetailsLoading,
  } = useMidgard()

  const [tipVisible, setTipVisible] = useState(true)

  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet])

  useEffect(() => {
    getAllMemberDetails()
  }, [getAllMemberDetails])

  const hasPendingDeposit = useMemo(
    () => Object.keys(pendingLP).length > 0,
    [pendingLP],
  )

  const hasPending = useMemo(
    () => hasPendingLP(chainMemberDetails) || hasPendingDeposit,
    [chainMemberDetails, hasPendingDeposit],
  )

  const isLoadingLiquidities = useMemo(
    () => Object.values(chainMemberDetailsLoading).some((l) => l),
    [chainMemberDetailsLoading],
  )

  return (
    <PanelView
      title={t('common.liquidity')}
      header={
        <ViewHeader
          title={t('common.liquidityPosition')}
          actionsComponent={
            <>
              {isWalletConnected && (
                <ReloadButton
                  loading={isLoadingLiquidities}
                  onLoad={getAllMemberDetails}
                />
              )}
              <GlobalSettingsPopover />
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
                onClick={() => navigate(getAddLiquidityRoute())}
              >
                {t('common.deposit')}
              </Button>

              <Button
                size="lg"
                stretch
                onClick={() => navigate(ROUTES.CreateLiquidity)}
              >
                {t('common.create')}
              </Button>
            </Box>

            {!!Object.keys(chainMemberDetails).length && (
              <Box className="w-full gap-2" col>
                {sortChains(Object.keys(chainMemberDetails)).map((chain) => (
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

export default Liquidity
