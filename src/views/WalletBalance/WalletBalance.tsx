import { MouseEventHandler, useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Amount,
  AssetAmount,
  chainToSigAsset,
  ChainWallet,
  formatBigNumber,
  getTotalUSDPriceInBalance,
  isOldRune,
} from '@thorswap-lib/multichain-sdk'
import { Chain, SupportedChain } from '@thorswap-lib/types'
import { TERRAChain } from '@thorswap-lib/xchain-util'
import classNames from 'classnames'

import { WalletHeader } from 'views/WalletBalance/WalletHeader'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Icon, Typography } from 'components/Atomic'
import { baseBgHoverClass } from 'components/constants'
import { Scrollbar } from 'components/Scrollbar'

import { useMidgard } from 'store/midgard/hooks'
import { useWallet } from 'store/wallet/hooks'

import { useWalletDrawer } from 'hooks/useWalletDrawer'

import { t } from 'services/i18n'

import { getSendRoute, getSwapRoute, ROUTES } from 'settings/constants'

import { ChainHeader } from './ChainHeader'

const sortedChains = [
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.Solana,
  TERRAChain,
  Chain.Doge,
  Chain.Ethereum,
  Chain.Binance,
  Chain.Litecoin,
  Chain.BitcoinCash,
  Chain.Cosmos,
]

const WalletBalance = () => {
  const navigate = useNavigate()
  const { pools } = useMidgard()
  const { chainWalletLoading, wallet } = useWallet()
  const { close } = useWalletDrawer()

  const handleNavigate = useCallback(
    (route: string): MouseEventHandler<HTMLDivElement | HTMLButtonElement> =>
      (event) => {
        event.stopPropagation()
        close()
        navigate(route)
      },
    [close, navigate],
  )

  const renderBalance = useCallback(
    (chain: SupportedChain, balance: AssetAmount[]) => {
      const sigBalance = new AssetAmount(
        chainToSigAsset(chain),
        Amount.fromNormalAmount(0),
      )

      const walletBalance = [
        ...balance,
        ...(balance.length === 0 ? [sigBalance] : []),
      ]

      return walletBalance.map((data: AssetAmount) => (
        <div
          key={data.asset.symbol}
          onClick={handleNavigate(getSwapRoute(data.asset))}
        >
          <Box
            className={classNames(
              'p-4 cursor-pointer bg-light-bg-secondary dark:bg-dark-bg-secondary !bg-opacity-80',
              baseBgHoverClass,
            )}
            alignCenter
            justify="between"
          >
            <Box className="flex-1" row alignCenter>
              <AssetIcon asset={data.asset} size={36} />
              <Box className="pl-2 w-[80px]" col>
                <Typography>{data.asset.ticker}</Typography>
                <Typography
                  variant="caption-xs"
                  color="secondary"
                  fontWeight="medium"
                >
                  {data.asset.type}
                </Typography>
              </Box>
              <Typography color="primary">
                {data.amount.toSignificant(6)}
              </Typography>
            </Box>

            <Box className="space-x-1" row>
              {isOldRune(data.asset) && (
                <Button
                  onClick={handleNavigate(ROUTES.UpgradeRune)}
                  className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                  variant="tint"
                  startIcon={
                    <Icon name="switch" color="primaryBtn" size={16} />
                  }
                />
              )}
              <Button
                onClick={handleNavigate(getSendRoute(data.asset))}
                className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                variant="tint"
                startIcon={<Icon name="send" color="primaryBtn" size={16} />}
                tooltip={t('common.send')}
              />
            </Box>
          </Box>
        </div>
      ))
    },
    [handleNavigate],
  )

  const renderChainBalance = useCallback(
    (chain: SupportedChain, chainBalance: ChainWallet) => {
      const { address, balance } = chainBalance
      const usdPrice = getTotalUSDPriceInBalance(balance, pools)
      const totalPrice = formatBigNumber(usdPrice, 2)
      const { walletType } = chainBalance

      return (
        <Box className="mt-2" key={chain.toString()} col>
          <ChainHeader
            chain={chain}
            address={address}
            totalPrice={totalPrice}
            walletLoading={chainWalletLoading?.[chain]}
            walletType={walletType}
            viewPhrase={() => {}}
            onReload={() => {}}
          />
          {renderBalance(chain, balance)}
        </Box>
      )
    },
    [chainWalletLoading, pools, renderBalance],
  )

  return (
    <Scrollbar>
      <WalletHeader />
      <Box col>
        {wallet &&
          sortedChains.map((chain) => {
            const chainBalance = wallet[chain as SupportedChain]

            if (!chainBalance) return null

            return renderChainBalance(chain as SupportedChain, chainBalance)
          })}
      </Box>
    </Scrollbar>
  )
}

export default WalletBalance
