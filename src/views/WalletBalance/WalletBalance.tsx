import { useCallback } from 'react'

import {
  Amount,
  AssetAmount,
  chainToSigAsset,
  ChainWallet,
  formatBigNumber,
  getTotalUSDPriceInBalance,
  isOldRune,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { WalletHeader } from 'views/WalletBalance/WalletHeader'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Icon, Link, Typography } from 'components/Atomic'
import { baseBgHoverClass } from 'components/constants'
import { Scrollbar } from 'components/Scrollbar'

import { useMidgard } from 'store/midgard/hooks'
import { useWallet } from 'store/wallet/hooks'

import { useWalletDrawer } from 'hooks/useWalletDrawer'

import { t } from 'services/i18n'

import { getSendRoute, getSwapRoute, ROUTES } from 'settings/constants'

import { ChainHeader } from './ChainHeader'
import { sortedChains } from './types'

const WalletBalance = () => {
  const { pools } = useMidgard()
  const { chainWalletLoading, wallet } = useWallet()
  const { close } = useWalletDrawer()

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
        <Link
          key={data.asset.symbol}
          to={getSwapRoute(data.asset)}
          onClick={close}
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
                <Link to={ROUTES.UpgradeRune}>
                  <Button
                    className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                    variant="tint"
                    startIcon={
                      <Icon name="switch" color="primaryBtn" size={16} />
                    }
                  />
                </Link>
              )}
              <Link to={getSendRoute(data.asset)} onClick={close}>
                <Button
                  className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                  variant="tint"
                  startIcon={<Icon name="send" color="primaryBtn" size={16} />}
                  tooltip={t('common.send')}
                />
              </Link>
            </Box>
          </Box>
        </Link>
      ))
    },
    [close],
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
