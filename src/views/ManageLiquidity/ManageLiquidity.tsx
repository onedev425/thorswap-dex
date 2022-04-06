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
      {tipVisible && (
        <InfoTip
          className="w-full mt-0 mb-4"
          title={t('common.liquidityProvider')}
          content={t('views.liquidity.tip')}
          onClose={() => setTipVisible(false)}
        />
      )}

      {isWalletConnected ? (
        <>
          <Box className="w-full pb-4 gap-x-8" justify="between">
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
        </>
      ) : (
        <Box className="w-full pb-4 gap-x-8" justify="between">
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
    </PanelView>
  )
}

export default ManageLiquidity
