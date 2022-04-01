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

import { WalletHeader } from 'views/WalletBalance/WalletHeader'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Icon, Link, Typography } from 'components/Atomic'
import { Scrollbar } from 'components/Scrollbar'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import { useWalletDrawer } from 'hooks/useWalletDrawer'

import { ROUTES } from 'settings/constants'

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
        <Box
          key={data.asset.symbol}
          className="p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary"
          alignCenter
          justify="between"
          onClick={() => {}}
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
            <Link to={`/send/${data.asset.toURLEncoded()}`} onClick={close}>
              <Button
                className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                variant="tint"
                startIcon={<Icon name="send" color="primaryBtn" size={16} />}
              />
            </Link>
          </Box>
        </Box>
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
