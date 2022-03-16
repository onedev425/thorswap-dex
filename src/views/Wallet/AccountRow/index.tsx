import { memo, useCallback } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'
import classNames from 'classnames'
import { shortenAddress } from 'utils/shortenAddress'

import { Box, Button, Card, Icon, Typography } from 'components/Atomic'

import { t } from 'services/i18n'

import { useAccountData } from '../hooks'
import { ChainInfoTable } from './ChainInfoTable'

type Props = {
  chain: SupportedChain
}

export const AccountRow = memo(({ chain }: Props) => {
  const {
    balance,
    chainAddress,
    chainInfo,
    chainWalletLoading,
    setIsConnectModalOpen,
  } = useAccountData(chain)

  const isChainLoading = chainWalletLoading[chain]

  const handleConnect = useCallback(() => {
    if (!chainAddress) {
      setIsConnectModalOpen(true)
    }
  }, [chainAddress, setIsConnectModalOpen])

  return (
    <Card className="!p-6 mb-2 flex overflow-hidden">
      <Box flex={1} className="w-full min-w-fit" col>
        <Box
          className={classNames({
            'pb-4 border-0 border-b-2 border-solid border-light-border-primary dark:border-dark-border-primary':
              chainAddress,
          })}
          row
          alignCenter
          justify="between"
        >
          <Box className="space-x-1 flex-col md:flex-row">
            <Typography variant="subtitle2">{chainToString(chain)}</Typography>

            {chainAddress && (
              <Box className="flex-col items-center md:justify-center md:flex-row gap-x-2">
                <Typography color="secondary">
                  (${balance.toFixed(2)})
                </Typography>

                <Box center pl={2} className="gap-x-2">
                  <Icon name="eye" color="secondary" />
                  <Typography color="secondary" variant="caption">
                    {shortenAddress(chainAddress, 8, 5)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          <Box>
            {chainAddress && (
              <Box center pr={3} className="gap-x-3">
                <Icon
                  onClick={() => {}}
                  color="secondary"
                  name="refresh"
                  size={18}
                />
                <Icon
                  onClick={() => {}}
                  color="secondary"
                  name="qrcode"
                  size={18}
                />
                <Icon
                  onClick={() => {}}
                  color="secondary"
                  name="import"
                  size={18}
                />
              </Box>
            )}

            <Button
              disabled={isChainLoading}
              type={chainAddress ? 'outline' : 'default'}
              onClick={handleConnect}
            >
              <Box center className="gap-x-2">
                {isChainLoading && (
                  <Icon name="refresh" color="primary" size={16} spin />
                )}
                {chainAddress ? t('common.disconnect') : t('common.connect')}
              </Box>
            </Button>
          </Box>
        </Box>

        {chainInfo.length > 0 && <ChainInfoTable chainInfo={chainInfo} />}
      </Box>
    </Card>
  )
})
