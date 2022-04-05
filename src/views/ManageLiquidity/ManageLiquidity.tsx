import { useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  hasConnectedWallet,
  Asset,
  Pool,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'

import { Button, Box } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'
import { LiquidityCard } from 'components/LiquidityCard'
import { PanelView } from 'components/PanelView'
import { ReloadButton } from 'components/ReloadButton'
import { SwapSettingsPopover } from 'components/SwapSettings'
import { ViewHeader } from 'components/ViewHeader'

import { useMidgard } from 'redux/midgard/hooks'
import { ChainMemberData } from 'redux/midgard/types'
import { useWallet } from 'redux/wallet/hooks'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

import { ChainPoolData } from './types'

const ManageLiquidity = () => {
  const navigate = useNavigate()
  const { wallet, setIsConnectModalOpen } = useWallet()

  const {
    pools,
    chainMemberDetails,
    getAllMemberDetails,
    memberDetailsLoading,
  } = useMidgard()

  const [tipVisible, setTipVisible] = useState(true)

  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet])

  useEffect(() => {
    getAllMemberDetails()
  }, [getAllMemberDetails])

  const liquidityPools = useMemo(() => {
    const chains = Object.keys(chainMemberDetails) as SupportedChain[]
    if (chains.length === 0) return []

    return chains.reduce((acc, chain) => {
      const chainMembers = chainMemberDetails[chain] as ChainMemberData
      const poolStrings = Object.keys(chainMembers)

      const chainPools = poolStrings.map((poolString) => {
        const poolMemberData = chainMembers[poolString]

        const poolAsset = Asset.fromAssetString(poolString)
        if (!poolAsset) return null

        const pool = Pool.byAsset(poolAsset, pools)
        if (!pool) return null

        const [shareType, memberPool] = Object.entries(poolMemberData)[0] || []
        if (!memberPool) return null

        return { ...memberPool, shareType, pool }
      })

      return acc.concat(chainPools.filter(Boolean) as ChainPoolData[])
    }, [] as ChainPoolData[])
  }, [chainMemberDetails, pools])

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

          <Box className="w-full gap-1" col>
            {liquidityPools.map((liquidityPool) => (
              <LiquidityCard
                {...liquidityPool}
                key={liquidityPool.pool.asset.ticker}
                withFooter
              />
            ))}
          </Box>
        </>
      ) : (
        <Box className="w-full pb-4 gap-x-8" justify="between">
          <Button size="lg" stretch onClick={() => setIsConnectModalOpen(true)}>
            {t('common.connectWallet')}
          </Button>
        </Box>
      )}
    </PanelView>
  )
}

export default ManageLiquidity
