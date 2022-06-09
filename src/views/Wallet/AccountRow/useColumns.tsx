import { useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Amount,
  Asset,
  AssetAmount,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'
import { SOLChain } from '@thorswap-lib/xchain-util'

import { AssetChart } from 'views/Wallet/AssetChart'
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Icon, Typography } from 'components/Atomic'

import { useMidgard } from 'store/midgard/hooks'
import { useWallet } from 'store/wallet/hooks'

import useWindowSize, { BreakPoint } from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { formatPrice } from 'helpers/formatPrice'

import { getSendRoute, getSwapRoute } from 'settings/constants'

import { ViewMode } from 'types/app'

export const useColumns = (chainAddress: string, chain: SupportedChain) => {
  const navigate = useNavigate()
  const { stats } = useMidgard()
  const { geckoData } = useWallet()
  const { isLgActive } = useWindowSize()

  const runePrice = stats?.runePriceUSD

  const columns = useMemo(
    () => [
      {
        id: 'asset',
        Header: () => t('common.asset'),
        disableSortBy: true,
        accessor: (row: AssetAmount) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
          <AssetIcon hasChainIcon={false} asset={value} size={40} />
        ),
      },
      {
        id: 'name',
        Header: () => '',
        disableSortBy: true,
        minScreenSize: BreakPoint.md,
        accessor: (row: AssetAmount) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
          <Box col justify="between" className="pl-4">
            <Typography>{value.name}</Typography>
            <Typography color="secondary">{value.type}</Typography>
          </Box>
        ),
      },
      {
        id: 'amount',
        Header: () => t('common.amount'),
        align: 'right',
        accessor: (row: Amount) => row.assetAmount.toFixed(2),
        Cell: ({ cell: { value } }: { cell: { value: String } }) => (
          <Typography fontWeight="bold">
            {chainAddress ? value : '-'}
          </Typography>
        ),
      },
      {
        id: 'price',
        Header: () => t('common.usdPrice'),
        align: 'right',
        minScreenSize: BreakPoint.md,
        accessor: (row: AssetAmount) => {
          if (row.asset.symbol === 'RUNE') {
            return runePrice
          } else if (geckoData[row.asset.symbol]?.current_price) {
            return geckoData[row.asset.symbol].current_price
          }
          return 0
        },
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <Typography fontWeight="bold">{formatPrice(value)}</Typography>
        ),
      },
      {
        id: 'price24h',
        Header: () => '24h%',
        align: 'right',
        accessor: (row: AssetAmount) =>
          geckoData[row.asset.symbol]?.price_change_percentage_24h || 0,
        minScreenSize: BreakPoint.md,
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
          <Typography color={value >= 0 ? 'green' : 'red'} fontWeight="bold">
            {value.toFixed(2)}%
          </Typography>
        ),
      },
      {
        id: 'chart',
        Header: () => t('views.wallet.chart7d'),
        minScreenSize: BreakPoint.lg,
        align: 'center',
        disableSortBy: true,
        accessor: (row: AssetAmount) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
          <AssetChart mode={ViewMode.LIST} asset={value} />
        ),
      },
      {
        accessor: (row: AssetAmount) => row.asset,
        id: 'actions',
        Header: () => '',
        align: 'right',
        disableSortBy: true,
        Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
          <Box row className="gap-2" justify="end">
            <Button
              variant="tint"
              startIcon={
                <Icon
                  className="rotate-180 group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                  color="secondary"
                  size={20}
                  name="receive"
                />
              }
              onClick={() => navigate(getSendRoute(value))}
            >
              {isLgActive ? t('common.send') : null}
            </Button>

            <ShowQrCode
              address={chainAddress}
              chain={chain}
              openComponent={
                <Button
                  variant="tint"
                  disabled={!chainAddress}
                  tooltip={
                    chainAddress
                      ? t('views.wallet.showQRCode')
                      : t('views.walletModal.notConnected')
                  }
                  startIcon={
                    <Icon
                      className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                      color="secondary"
                      size={20}
                      name="receive"
                    />
                  }
                >
                  {isLgActive ? t('common.receive') : null}
                </Button>
              }
            />

            <Button
              variant="tint"
              startIcon={
                <Icon
                  className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                  color="secondary"
                  size={20}
                  name="swap"
                />
              }
              disabled={chain === SOLChain}
              tooltip={t('common.comingSoon')}
              onClick={() => navigate(getSwapRoute(value))}
            >
              {isLgActive ? t('common.swap') : null}
            </Button>
          </Box>
        ),
      },
    ],
    [geckoData, chainAddress, isLgActive, runePrice, navigate, chain],
  )

  return columns
}
