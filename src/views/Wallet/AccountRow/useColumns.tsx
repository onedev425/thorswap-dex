import { Amount, Asset, AssetAmount } from '@thorswap-lib/multichain-core';
import { SupportedChain } from '@thorswap-lib/types';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon, Typography } from 'components/Atomic';
import { useFormatPrice } from 'helpers/formatPrice';
import useWindowSize, { BreakPoint } from 'hooks/useWindowSize';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getSendRoute, getSwapRoute } from 'settings/router';
import { useMidgard } from 'store/midgard/hooks';
import { useWallet } from 'store/wallet/hooks';
import { ViewMode } from 'types/app';
import { AssetChart } from 'views/Wallet/AssetChart';
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode';

export const useColumns = (chainAddress: string, chain: SupportedChain) => {
  const formatPrice = useFormatPrice();
  const navigate = useNavigate();
  const { stats } = useMidgard();
  const { geckoData } = useWallet();
  const { isLgActive } = useWindowSize();

  const runePrice = stats?.runePriceUSD;

  const columns = useMemo(
    () => [
      {
        id: 'asset',
        Header: () => t('common.asset'),
        disableSortBy: true,
        accessor: (row: AssetAmount) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
          <AssetIcon asset={value} hasChainIcon={false} size={40} />
        ),
      },
      {
        id: 'name',
        Header: () => '',
        disableSortBy: true,
        minScreenSize: BreakPoint.md,
        accessor: (row: AssetAmount) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
          <Box col className="pl-4" justify="between">
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
          <Typography fontWeight="bold">{chainAddress ? value : '-'}</Typography>
        ),
      },
      {
        id: 'price',
        Header: () => t('common.usdPrice'),
        align: 'right',
        minScreenSize: BreakPoint.md,
        accessor: ({ asset: { symbol } }: AssetAmount) =>
          symbol === 'RUNE'
            ? `$${parseFloat(runePrice || '').toFixed(2)}`
            : geckoData[symbol]?.current_price || 0,
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <Typography fontWeight="bold">{formatPrice(value)}</Typography>
        ),
        sortType: 'basic',
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
        sortType: 'basic',
      },
      {
        id: 'chart',
        Header: () => t('views.wallet.chart7d'),
        minScreenSize: BreakPoint.lg,
        align: 'center',
        disableSortBy: true,
        accessor: (row: AssetAmount) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
          <AssetChart asset={value} mode={ViewMode.LIST} />
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
              onClick={() => navigate(getSendRoute(value))}
              startIcon={
                <Icon
                  className="rotate-180 group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                  color="secondary"
                  name="receive"
                  size={20}
                />
              }
              variant="tint"
            >
              {isLgActive ? t('common.send') : null}
            </Button>

            <ShowQrCode
              address={chainAddress}
              chain={chain}
              openComponent={
                <Button
                  disabled={!chainAddress}
                  startIcon={
                    <Icon
                      className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                      color="secondary"
                      name="receive"
                      size={20}
                    />
                  }
                  tooltip={
                    chainAddress
                      ? t('views.wallet.showQRCode')
                      : t('views.walletModal.notConnected')
                  }
                  variant="tint"
                >
                  {isLgActive ? t('common.receive') : null}
                </Button>
              }
            />

            <Button
              onClick={() => navigate(getSwapRoute(value))}
              startIcon={
                <Icon
                  className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                  color="secondary"
                  name="swap"
                  size={20}
                />
              }
              variant="tint"
            >
              {isLgActive ? t('common.swap') : null}
            </Button>
          </Box>
        ),
      },
    ],
    [chainAddress, runePrice, geckoData, formatPrice, isLgActive, chain, navigate],
  );

  return columns;
};
