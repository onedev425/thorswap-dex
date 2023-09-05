import { Text } from '@chakra-ui/react';
import type { Amount, AssetAmount, AssetEntity } from '@thorswap-lib/swapkit-core';
import type { Chain } from '@thorswap-lib/types';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon } from 'components/Atomic';
import { useFormatPrice } from 'helpers/formatPrice';
import useWindowSize, { BreakPoint } from 'hooks/useWindowSize';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getSendRoute, getSwapRoute } from 'settings/router';
import type { GetTokenPriceResponseItem } from 'store/thorswap/types';
import { ViewMode } from 'types/app';
import { AssetChart } from 'views/Wallet/AssetChart';
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode';

export const useColumns = (
  chainAddress: string,
  chain: Chain,
  priceData: Record<string, GetTokenPriceResponseItem>,
) => {
  const formatPrice = useFormatPrice();
  const navigate = useNavigate();
  const { isLgActive } = useWindowSize();

  const columns = useMemo(
    () => [
      {
        id: 'asset',
        Header: () => t('common.asset'),
        disableSortBy: true,
        accessor: (row: AssetAmount) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: AssetEntity } }) => (
          <AssetIcon asset={value} hasChainIcon={false} size={40} />
        ),
      },
      {
        id: 'name',
        Header: () => '',
        disableSortBy: true,
        minScreenSize: BreakPoint.md,
        accessor: (row: AssetAmount) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: AssetEntity } }) => (
          <Box col className="pl-4" justify="between">
            <Text>{value.name}</Text>
            <Text variant="secondary">{value.type}</Text>
          </Box>
        ),
      },
      {
        id: 'amount',
        Header: () => t('common.amount'),
        align: 'right',
        accessor: (row: Amount) => row.assetAmount.toFixed(2),
        Cell: ({ cell: { value } }: { cell: { value: String } }) => (
          <Text fontWeight="bold">{chainAddress ? value : '-'}</Text>
        ),
      },
      {
        id: 'price',
        Header: () => t('common.usdPrice'),
        align: 'right',
        minScreenSize: BreakPoint.md,
        accessor: ({ asset }: AssetAmount) => priceData[asset.toString()]?.price_usd || 0,
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <Text fontWeight="bold">{formatPrice(value)}</Text>
        ),
        sortType: 'basic',
      },
      {
        id: 'price24h',
        Header: () => '24h%',
        align: 'right',
        accessor: (row: AssetAmount) =>
          priceData[row.asset.toString()]?.cg?.price_change_percentage_24h_usd || 0,
        minScreenSize: BreakPoint.md,
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
          <Text fontWeight="bold" variant={value >= 0 ? 'green' : 'red'}>
            {value.toFixed(2)}%
          </Text>
        ),
        sortType: 'basic',
      },
      {
        id: 'chart',
        Header: () => t('views.wallet.chart7d'),
        minScreenSize: BreakPoint.lg,
        align: 'center',
        disableSortBy: true,
        accessor: ({ asset }: AssetAmount) => asset,
        Cell: ({ cell: { value } }: { cell: { value: AssetEntity } }) => (
          <AssetChart
            asset={value}
            mode={ViewMode.LIST}
            sparkline={priceData[value.toString()]?.cg?.sparkline_in_7d}
          />
        ),
      },
      {
        accessor: (row: AssetAmount) => row.asset,
        id: 'actions',
        Header: () => '',
        align: 'right',
        disableSortBy: true,
        Cell: ({ cell: { value } }: { cell: { value: AssetEntity } }) => (
          <Box row className="gap-2" justify="end">
            <Button
              leftIcon={
                <Icon
                  className="rotate-180 group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                  color="secondary"
                  name="receive"
                  size={20}
                />
              }
              onClick={() => navigate(getSendRoute(value))}
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
                  leftIcon={
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
              leftIcon={
                <Icon
                  className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                  color="secondary"
                  name="swap"
                  size={20}
                />
              }
              onClick={() => navigate(getSwapRoute(value))}
              variant="tint"
            >
              {isLgActive ? t('common.swap') : null}
            </Button>
          </Box>
        ),
      },
    ],
    [chainAddress, priceData, formatPrice, isLgActive, chain, navigate],
  );

  return columns;
};
