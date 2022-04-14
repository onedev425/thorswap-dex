import { useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetLpIcon } from 'components/AssetIcon'
import { Box, Button, Card, Link, Typography } from 'components/Atomic'

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
    <Box col className="w-full md:w-1/2 lg:w-1/3">
      <Box mb={56}>
        <Typography variant="h2" color="primary" fontWeight="extrabold">
          THOR-RUNE LP
        </Typography>
      </Box>
      <Box className="w-full h-full">
        <Card className="flex-col w-full shadow-2xl drop-shadow-4xl">
          <div className="flex justify-center absolute m-auto left-0 right-0 top-[-28px]">
            <AssetLpIcon
              asset1={tcFarmData.assets[0]}
              asset2={tcFarmData.assets[1]}
              inline
              hasShadow
              size="big"
            />
          </div>
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
              <Typography variant="h4" color="primary" fontWeight="extrabold">
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
                variant="h4"
                fontWeight="semibold"
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
              <Button stretch onClick={() => setIsConnectModalOpen(true)}>
                {t('common.connectWallet')}
              </Button>
            ) : (
              <Box className="gap-2" row center>
                <Link to={liquidityRouter}>
                  <Button className="flex-1" type="outline" variant="primary">
                    {t('common.deposit')}
                  </Button>
                </Link>
                <Link to={withdrawRouter}>
                  <Button className="flex-1" type="outline" variant="secondary">
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
