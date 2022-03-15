import { useCallback } from 'react'

// import { AssetIcon } from 'components/AssetIcon/AssetIcon'
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

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Icon, Typography } from 'components/Atomic'
import { Scrollbar } from 'components/Scrollbar'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import { t } from 'services/i18n'

import { ChainHeader } from './ChainHeader'
import { sortedChains } from './types'

const WalletBalance = () => {
  const { pools } = useMidgard()
  const { chainWalletLoading, wallet } = useWallet()

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
          className="p-2 bg-light-bg-secondary dark:bg-dark-bg-secondary"
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
              <Button
                className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                variant="tint"
                startIcon={<Icon name="switch" color="primaryBtn" size={16} />}
              />
            )}
            <Button
              className="px-3 hover:bg-transparent dark:hover:bg-transparent"
              variant="tint"
              startIcon={<Icon name="send" color="primaryBtn" size={16} />}
            />
          </Box>
        </Box>
      ))
    },
    [],
  )

  const renderChainBalance = useCallback(
    (chain: SupportedChain, chainBalance: ChainWallet) => {
      const { address, balance } = chainBalance
      const usdPrice = getTotalUSDPriceInBalance(balance, pools)
      const totalPrice = formatBigNumber(usdPrice, 2)
      const { walletType } = chainBalance

      return (
        <Box className="mt-2" col>
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
      <Box className="pt-6 pb-4 pl-4 pr-2" alignCenter justify="between">
        <Typography variant="h5">{t('common.wallet')}</Typography>
        <Box className="space-x-1" row>
          <Button
            className="px-3 hover:bg-transparent dark:hover:bg-transparent"
            variant="tint"
            startIcon={<Icon name="refresh" color="primaryBtn" size={16} />}
            tooltip={t('common.refresh')}
            tooltipPlacemenet={'left'}
          />
          <Button
            className="px-3 hover:bg-transparent dark:hover:bg-transparent"
            variant="tint"
            startIcon={<Icon name="add" color="primaryBtn" size={16} />}
            tooltip={t('views.walletDrawer.connectAnother')}
            tooltipPlacemenet={'left'}
          />
          <Button
            className="px-3 hover:bg-transparent dark:hover:bg-transparent"
            variant="tint"
            startIcon={<Icon name="disconnect" color="primaryBtn" size={16} />}
            tooltip={t('views.walletDrawer.disconnect')}
            tooltipPlacemenet={'left'}
          />
        </Box>
      </Box>
      <Box col>
        {wallet &&
          sortedChains.map((chain) => {
            const chainBalance = wallet[chain as SupportedChain]

            if (!chainBalance) return null

            return renderChainBalance(chain as SupportedChain, chainBalance)
          })}
        {/* {balanceData.map((item) => (
          <Box
            key={item.address}
            className="px-4 bg-gradient-primary-light dark:bg-gradient-primary-dark rounded-b-xl"
            col
          >
            <Box
              className="py-4 border-0 border-b border-dashed border-light-typo-gray dark:border-dark-typo-gray"
              justify="between"
            >
              <Box>
                <Icon name="refresh" color="secondary" size={18} />
                <Typography color="secondary" className="ml-2">
                  {item.asset.name}
                </Typography>
              </Box>
              <Box className="space-x-2">
                <Icon name="copy" color="secondary" size={18} />
                <Icon name="qrcode" color="secondary" size={18} />
                <Icon name="external" color="secondary" size={18} />
              </Box>
            </Box>

            <Box alignCenter justify="between" className="py-4">
              <Box>
                <div className="flex flex-col flex-1 ml-2">
                  <Typography>{'BTC'}</Typography>
                  <Typography color="secondary">{'Native'}</Typography>
                </div>
              </Box>
              <Box>
                <Typography color="primary" className="ml-2">
                  {0}
                </Typography>
              </Box>
              <Box>
                <Button
                  className="px-3.5"
                  type="outline"
                  onClick={() => {}}
                  startIcon={<Icon name="send" size={18} onClick={() => {}} />}
                />
              </Box>
            </Box>
          </Box>
        ))} */}
      </Box>
    </Scrollbar>
  )
}

export default WalletBalance
