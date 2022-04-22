import { useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetLpIcon } from 'components/AssetIcon'
import { Box, Button, Card, Link, Typography } from 'components/Atomic'
import { borderHoverHighlightClass } from 'components/constants'

import { useWallet } from 'store/wallet/hooks'

import { useThorAPY } from 'hooks/useThorAPY'

import { t } from 'services/i18n'

import { getAddLiquidityRoute, getWithdrawRoute } from 'settings/constants'

import { tcFarmData } from './farmData'

export const ThorchainLPCard = () => {
  const { wallet, setIsConnectModalOpen } = useWallet()
  const thorAPY = useThorAPY()
  const liquidityRouter = getAddLiquidityRoute(Asset.THOR())
  const withdrawRouter = getWithdrawRoute(Asset.THOR())

  const ethAddr = useMemo(
    () => wallet && wallet.ETH && wallet.ETH.address,
    [wallet],
  )

  // const thorAddr = useMemo(() => wallet?.THOR?.address, [wallet])

  // const isWalletConnected = useMemo(
  //   () => ethAddr && thorAddr,
  //   [ethAddr, thorAddr],
  // )

  // console.info(isWalletConnected)

  return (
    <Box col className="flex-1 !min-w-[360px] lg:!max-w-[50%]">
      <Box className="w-full h-full min-h-[436px]" mt={56}>
        <Card
          className={classNames('flex-col flex-1', borderHoverHighlightClass)}
        >
          <div className="flex justify-center absolute m-auto left-0 right-0 top-[-28px]">
            <AssetLpIcon
              asset1={tcFarmData.assets[0]}
              asset2={tcFarmData.assets[1]}
              inline
              hasShadow
              size="big"
            />
          </div>
          <Box mt={32} center>
            <Typography className="mr-2" variant="h4">
              THOR-RUNE LP
            </Typography>
          </Box>
          <Box className="flex-row justify-between">
            <Box col className="p-4">
              <Typography
                variant="caption-xs"
                color="secondary"
                fontWeight="bold"
                transform="uppercase"
              >
                {t('common.exchange')}
              </Typography>
              <Typography variant="body" color="primary" fontWeight="bold">
                {t('common.THORSwap')}
              </Typography>
            </Box>
            <Box col className="p-4">
              <Typography
                variant="caption-xs"
                color="secondary"
                fontWeight="bold"
                className="text-right"
              >
                {t('common.APY')}
              </Typography>

              <Typography
                variant="body"
                fontWeight="bold"
                color="green"
                className="text-right"
              >
                {thorAPY}%
              </Typography>
            </Box>
          </Box>
          <Box className="flex-col px-4">
            <Typography>{t('views.staking.tcStakingDesc')}</Typography>
          </Box>
          <Box className="flex-col-reverse flex-grow w-full" alignCenter mt={4}>
            {!ethAddr ? (
              <Button
                isFancy
                size="lg"
                stretch
                onClick={() => setIsConnectModalOpen(true)}
              >
                {t('common.connectWallet')}
              </Button>
            ) : (
              <Box className="gap-2 self-stretch" row alignCenter>
                <Link className="flex-1" to={liquidityRouter}>
                  <Button variant="primary" stretch>
                    {t('common.deposit')}
                  </Button>
                </Link>
                <Link className="flex-1" to={withdrawRouter}>
                  <Button variant="secondary" stretch>
                    {t('common.withdraw')}
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  )
}
