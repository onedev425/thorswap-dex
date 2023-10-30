import type { TableRowType } from 'components/Atomic';
import { Box, Icon, Table } from 'components/Atomic';
import { useCallback } from 'react';
import { navigateToPoolDetail } from 'settings/router';
import type { PoolDetail } from 'store/midgard/types';
import type { PoolCategoryOption } from 'views/Home/types';

import { usePoolColumns } from './usePoolColumns';

const initialSort = [{ id: 'liquidity', desc: true }];

type Props = {
  data: PoolDetail[];
  poolCategory: PoolCategoryOption;
};

export const PoolTable = ({ data, poolCategory }: Props) => {
  const navigateToPoolInfo = useCallback(({ original }: TableRowType) => {
    navigateToPoolDetail(original.asset);
  }, []);

  const columns = usePoolColumns(poolCategory);

  return (
    <Box col center={!data.length}>
      {data.length ? (
        <Table
          sortable
          // @ts-expect-error Overall typing for `react-table` is broken
          columns={columns}
          data={data}
          initialSort={initialSort}
          onRowClick={navigateToPoolInfo}
        />
      ) : (
        <Icon spin name="loader" size={32} />
      )}
    </Box>
  );
};
