import { Link, Text } from '@chakra-ui/react';
import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon, Tooltip } from 'components/Atomic';
import { getAmountColumnSorter, sortPoolColumn } from 'components/Atomic/Table/utils';
import { INTRODUCTION_TO_LUVI_URL } from 'config/constants';
import { parseToPercent } from 'helpers/parseHelpers';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { BreakPoint } from 'hooks/useWindowSize';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getSwapRoute } from 'settings/router';
import type { PoolDetail } from 'store/midgard/types';

interface IProps {
  poolsLoading: boolean;
}
export const usePoolColumns = ({ poolsLoading }: IProps) => {
  const navigate = useNavigate();
  const runeToCurrency = useRuneToCurrency();
  const columns = useMemo(() => {
    const columns = [
      {
        id: 'pool',
        Header: (): string => t('common.pool'),
        accessor: (row: PoolDetail) => row,
        sortType: sortPoolColumn,
        Cell: ({ cell: { value } }: { cell: { value: PoolDetail } }) => (
          <div className="flex flex-row items-center">
            <AssetIcon asset={AssetValue.fromStringSync(value.asset) as AssetValue} size={40} />
            <Text className="hidden pl-4 h4 md:block">
              {AssetValue.fromStringSync(value.asset)?.ticker}
            </Text>
          </div>
        ),
      },
      {
        id: 'price',
        Header: () => t('common.usdPrice'),
        accessor: (row: PoolDetail) => row.assetPriceUSD,
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: string } }) =>
          new SwapKitNumber(value).toCurrency(),
        sortType: getAmountColumnSorter('price'),
      },
      {
        id: 'liquidity',
        Header: () => t('common.liquidity'),
        accessor: (row: PoolDetail) => SwapKitNumber.fromBigInt(BigInt(row.runeDepth), 8).mul(2),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: SwapKitNumber } }) =>
          runeToCurrency(value.getValue('string')),
        sortType: getAmountColumnSorter('liquidity'),
      },
      {
        id: 'volume24h',
        Header: () => t('common.24Volume'),
        accessor: (row: PoolDetail) => SwapKitNumber.fromBigInt(BigInt(row.volume24h), 8),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: SwapKitNumber } }) =>
          runeToCurrency(value.getValue('string')),
        minScreenSize: BreakPoint.lg,
        sortType: getAmountColumnSorter('volume24h'),
      },
      {
        id: 'saversApr',
        Header: (): string => t('common.saversApr'),
        accessor: (row: PoolDetail) => row.saversAPR,
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: string } }) =>
          poolsLoading || !value ? (
            <Box justify="end">
              <Icon spin name="loader" size={16} />
            </Box>
          ) : value === '0' ? (
            'N/A'
          ) : (
            parseToPercent(value)
          ),

        sortType: getAmountColumnSorter('saversApr'),
        toolTip: (
          <Tooltip content={t('views.home.aprExplanation')} place="bottom">
            <Link
              href={INTRODUCTION_TO_LUVI_URL}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              zIndex={1}
            >
              <Icon
                className="p-1 absolute top-1.5 text-xs rounded-lg transform mx-1 hover:bg-btn-primary fill-btn-primary hover:fill-white"
                name="question"
                size={16}
              />
            </Link>
          </Tooltip>
        ),
      },
      {
        id: 'apr',
        Header: (): string => t('common.APR'),
        accessor: (row: PoolDetail) => parseToPercent(row.annualPercentageRate),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: string } }) =>
          poolsLoading || !value ? (
            <Box justify="end">
              <Icon spin name="loader" size={16} />
            </Box>
          ) : (
            value
          ),
        sortType: getAmountColumnSorter('apr'),
        toolTip: (
          <Tooltip content={t('views.home.aprExplanation')} place="bottom">
            <Link
              href={INTRODUCTION_TO_LUVI_URL}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              zIndex={1}
            >
              <Icon
                className="p-1 absolute top-1.5 text-xs rounded-lg transform mx-1 hover:bg-btn-primary fill-btn-primary hover:fill-white"
                name="question"
                size={16}
              />
            </Link>
          </Tooltip>
        ),
      },
      {
        id: 'action',
        Header: () => t('common.action'),
        accessor: (row: PoolDetail) => AssetValue.fromStringSync(row.asset),
        Cell: ({ cell: { value } }: { cell: { value: AssetValue } }) => (
          <Box row className="gap-2" justify="end">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(getSwapRoute(value));
              }}
              variant="outlineSecondary"
            >
              {t('common.swap')}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(getAddLiquidityRoute(value));
              }}
              variant="outlinePrimary"
            >
              {t('common.addLiquidity')}
            </Button>
          </Box>
        ),
        disableSortBy: true,
        minScreenSize: BreakPoint.md,
      },
    ];

    return columns;
  }, [navigate, runeToCurrency, poolsLoading]);

  return columns;
};
