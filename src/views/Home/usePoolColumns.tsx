import { Link, Text } from '@chakra-ui/react';
import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon, Tooltip } from 'components/Atomic';
import { getAmountColumnSorter, sortPoolColumn } from 'components/Atomic/Table/utils';
import { INTRODUCTION_TO_LUVI_URL } from 'config/constants';
import { useFormatPrice } from 'helpers/formatPrice';
import { parseToPercent } from 'helpers/parseHelpers';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { BreakPoint } from 'hooks/useWindowSize';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getSwapRoute } from 'settings/router';
import type { PoolDetail } from 'store/midgard/types';
import { PoolCategoryOption } from 'views/Home/types';

export type TimePeriods = {
  '30d': string;
  '7d': string;
};

// const timePeriods: TimePeriods = {
//   '30d': '30 days',
//   '7d': '7 days',
// };

export const usePoolColumns = (poolCategory: PoolCategoryOption) => {
  const navigate = useNavigate();
  const runeToCurrency = useRuneToCurrency();
  const formatPrice = useFormatPrice();

  const columns = useMemo(() => {
    const apr =
      poolCategory === PoolCategoryOption.Savers
        ? {
            id: 'saversApr',
            Header: (): string => t('common.saversApr'),
            accessor: (row: PoolDetail) => parseToPercent(row.saversAPR),
            align: 'right',
            Cell: ({ cell: { value } }: { cell: { value: string } }) =>
              value || (
                <Box justify="end">
                  <Icon spin name="loader" size={16} />
                </Box>
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
          }
        : {
            id: 'apr',
            Header: (): string => t('common.APR'),
            accessor: (row: PoolDetail) => parseToPercent(row.annualPercentageRate),
            align: 'right',
            Cell: ({ cell: { value } }: { cell: { value: string } }) =>
              value || (
                <Box justify="end">
                  <Icon spin name="loader" size={16} />
                </Box>
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
          };
    const columns = [
      {
        id: 'pool',
        Header: (): string => t('common.pool'),
        accessor: (row: PoolDetail) => row,
        sortType: sortPoolColumn,
        Cell: ({ cell: { value } }: { cell: { value: PoolDetail } }) => (
          <div className="flex flex-row items-center">
            <AssetIcon asset={AssetEntity.fromAssetString(value.asset) as AssetEntity} size={40} />
            <Text className="hidden pl-4 h4 md:block">
              {AssetEntity.fromAssetString(value.asset)?.ticker}
            </Text>
          </div>
        ),
      },
      {
        id: 'price',
        Header: () => t('common.usdPrice'),
        // Use static decimal as backend returns `-1` for some pools
        accessor: (row: PoolDetail) => Amount.fromAssetAmount(row.assetPriceUSD, 8),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) => formatPrice(value),
        sortType: getAmountColumnSorter('price'),
      },
      {
        id: 'liquidity',
        Header: () => t('common.liquidity'),
        accessor: (row: PoolDetail) => Amount.fromMidgard(row.runeDepth).mul(2),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) => runeToCurrency(value),
        sortType: getAmountColumnSorter('liquidity'),
      },
      {
        id: 'volume24h',
        Header: () => t('common.24Volume'),
        accessor: (row: PoolDetail) => Amount.fromMidgard(row.volume24h),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) => runeToCurrency(value),
        minScreenSize: BreakPoint.lg,
        sortType: getAmountColumnSorter('volume24h'),
      },
      apr,
      // {
      //   id: 'aprPeriod',
      //   Header: () => t('common.APRPeriod'),
      //   disableSortBy: true,
      //   // @ts-expect-error
      //   accessor: (row: PoolDetail) => row.apyPeriod,
      //   align: 'right',
      //   Cell: ({ cell: { value } }: { cell: { value: string } }) => (
      //     <div className="flex flex-row items-center justify-center">
      //       <Text className="pl-4 h4 md:block">{timePeriods[value as keyof TimePeriods]}</Text>
      //     </div>
      //   ),
      // },
      {
        id: 'action',
        Header: () => t('common.action'),
        accessor: (row: PoolDetail) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: AssetEntity } }) => (
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
  }, [formatPrice, navigate, poolCategory, runeToCurrency]);

  return columns;
};
