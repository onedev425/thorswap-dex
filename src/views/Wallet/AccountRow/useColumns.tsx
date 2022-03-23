import { useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Amount,
  Asset,
  AssetAmount,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'

import { AssetChart } from 'views/Wallet/AssetChart'

import { AssetIcon } from 'components/AssetIcon'
import {
  Box,
  Button,
  Icon,
  TableColumnsConfig,
  Typography,
} from 'components/Atomic'

import { useWallet } from 'redux/wallet/hooks'

import { BreakPoint } from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { formatPrice } from 'helpers/formatPrice'

import { ROUTES } from 'settings/constants'

import { ViewMode } from 'types/global'

export const useColumns = () => {
  const navigate = useNavigate()
  const { geckoData } = useWallet()

  const columns = useMemo(
    () =>
      [
        {
          id: 'asset',
          Header: 'Asset',
          disableSortBy: true,
          accessor: (row: AssetAmount) => row.asset,
          Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
            <Box flex={1} alignCenter>
              <AssetIcon asset={value} hasChainIcon size={40} />
              <Box col justify="between" className="pl-4">
                <Typography>{value.name}</Typography>
                <Typography color="secondary">{value.type}</Typography>
              </Box>
            </Box>
          ),
        },
        {
          id: 'amount',
          Header: 'Amount',
          align: 'right',
          accessor: (row: Amount) => row.assetAmount,
          Cell: ({ cell: { value } }: { cell: { value: AssetAmount } }) => (
            <Typography fontWeight="bold">{value.toFixed(2)}</Typography>
          ),
        },
        {
          id: 'price',
          Header: 'Price',
          align: 'right',
          accessor: (row: AssetAmount) => row.asset.ticker,
          Cell: ({ cell: { value } }: { cell: { value: string } }) => (
            <Typography fontWeight="bold">
              {formatPrice(geckoData[value]?.current_price || 0)}
            </Typography>
          ),
        },
        {
          id: 'price24h',
          Header: '24h%',
          align: 'right',
          accessor: (row: AssetAmount) => row.asset.ticker,
          minScreenSize: BreakPoint.lg,
          Cell: ({ cell: { value } }: { cell: { value: string } }) => (
            <Typography
              color={
                (geckoData[value]?.price_change_percentage_24h || 0) >= 0
                  ? 'green'
                  : 'red'
              }
              fontWeight="bold"
            >
              {(geckoData[value]?.price_change_percentage_24h || 0).toFixed(2)}%
            </Typography>
          ),
        },
        {
          id: 'chart',
          Header: 'Chart (7d)',
          minScreenSize: BreakPoint.lg,
          align: 'center',
          disableSortBy: true,
          accessor: (row: AssetAmount) => row.asset.chain,
          Cell: ({ cell: { value } }: { cell: { value: SupportedChain } }) => (
            <AssetChart mode={ViewMode.LIST} chain={value} />
          ),
        },
        {
          accessor: (row) => row.asset,
          id: 'actions',
          Header: 'Actions',
          align: 'right',
          disableSortBy: true,
          minScreenSize: BreakPoint.md,
          Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
            <Box row className="gap-2" justify="end">
              <Button
                variant="tint"
                type="outline"
                startIcon={
                  <Icon
                    className="rotate-180"
                    color="secondary"
                    size={20}
                    name="receive"
                  />
                }
                onClick={() => {}}
              >
                {t('common.send')}
              </Button>
              <Button
                variant="tint"
                type="outline"
                startIcon={<Icon color="secondary" size={20} name="receive" />}
                onClick={() => {}}
              >
                {t('common.receive')}
              </Button>
              <Button
                variant="tint"
                type="outline"
                startIcon={<Icon color="secondary" size={20} name="swap" />}
                onClick={() => navigate(`${ROUTES.Swap}?input=${value}`)}
              >
                {t('common.swap')}
              </Button>
            </Box>
          ),
        },
      ] as TableColumnsConfig,
    [geckoData, navigate],
  )

  return columns
}
