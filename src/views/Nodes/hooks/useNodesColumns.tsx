import { THORNode } from '@thorswap-lib/midgard-sdk';
import { Amount } from '@thorswap-lib/multichain-core';
import { Button, Icon, Tooltip } from 'components/Atomic';
import { getAmountColumnSorter } from 'components/Atomic/Table/utils';
import { HoverIcon } from 'components/HoverIcon';
import copy from 'copy-to-clipboard';
import { shortenAddress } from 'helpers/shortenAddress';
import { BreakPoint } from 'hooks/useWindowSize';
import { useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { useMidgard } from 'store/midgard/hooks';

export const useNodesColumns = () => {
  const { getNodes } = useMidgard();
  const { setWatchList, nodeWatchList } = useApp();

  const handleAddToWatchList = useCallback(
    (address: string) => {
      const isSelected = nodeWatchList.includes(address);
      if (!isSelected) {
        setWatchList([address, ...nodeWatchList]);
      } else {
        const newList = nodeWatchList.filter((addr) => addr !== address);
        setWatchList(newList);
      }
    },
    [setWatchList, nodeWatchList],
  );

  const columns = useMemo(
    () => [
      {
        id: 'Bookmark',
        Header: () => (
          <HoverIcon
            className="group-hover:text-dark-typo-primary"
            color="secondary"
            iconName="refresh"
            onClick={getNodes}
            size={12}
          />
        ),
        align: 'center',
        disableSortBy: true,
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) => {
          const isSelected = nodeWatchList.includes(value.node_address);
          return (
            <Tooltip
              className="w-fit m-auto"
              content={isSelected ? t('views.nodes.removeFromList') : t('views.nodes.addToWatch')}
            >
              <HoverIcon
                color={isSelected ? 'pink' : 'secondary'}
                iconHoverHighlight={false}
                iconName={isSelected ? 'heartFilled' : 'heart'}
                onClick={(e) => {
                  handleAddToWatchList(value.node_address);
                  e.stopPropagation();
                  e.preventDefault();
                }}
                size={16}
              />
            </Tooltip>
          );
        },
      },
      {
        id: 'Address',
        Header: () => t('common.address'),
        align: 'center',
        accessor: (row: THORNode) => row.node_address,
        disableSortBy: true,
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <Button
            className="!px-2 justify-items-start"
            endIcon={<Icon name="copy" size={16} />}
            onClick={(e) => {
              copy(value);
              e.stopPropagation();
              e.preventDefault();
            }}
            tooltip={t('common.copy')}
            tooltipClasses="mx-auto w-fit"
            type="borderless"
            variant="tint"
          >
            {shortenAddress(value, 6, 4)}
          </Button>
        ),
      },
      {
        id: 'Version',
        Header: () => t('views.nodes.version'),
        accessor: 'version',
      },
      {
        id: 'IP',
        Header: () => 'IP',
        accessor: 'ip_address',
        minScreenSize: BreakPoint.md,
        disableSortBy: true,
      },
      {
        id: 'Rewards',
        Header: () => t('views.nodes.rewards'),
        accessor: (row: THORNode) => Amount.fromMidgard(row.current_award),
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) => value.toFixed(1),
        minScreenSize: BreakPoint.md,
        sortType: getAmountColumnSorter('Rewards'),
      },
      {
        id: 'Slash',
        Header: () => t('views.nodes.slash'),
        accessor: (row: THORNode) => Amount.fromNormalAmount(row.slash_points),
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) => value.toFixed(1),
        minScreenSize: BreakPoint.md,
        sortType: getAmountColumnSorter('Slash'),
      },
      {
        id: 'Bond',
        Header: (() => t('views.nodes.bond')) as () => string,
        accessor: (row: THORNode) => Amount.fromMidgard(row.total_bond),
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) => value.toFixed(1),
        sortType: getAmountColumnSorter('Bond'),
      },
      {
        id: 'ActiveBlock',
        Header: () => 'Active Block',
        accessor: (row: THORNode) => Amount.fromNormalAmount(row.active_block_height),
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) => value.toFixed(1),
        minScreenSize: BreakPoint.md,
        sortType: getAmountColumnSorter('ActiveBlock'),
      },
    ],
    [nodeWatchList, handleAddToWatchList, getNodes],
  );
  return columns;
};
