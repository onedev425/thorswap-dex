import { Pool } from '@thorswap-lib/multichain-core';
import { Box, Icon, Table, TableRowType } from 'components/Atomic';
import { useCallback } from 'react';
import { navigateToPoolDetail } from 'settings/constants';

import { usePoolColumns } from './usePoolColumns';

const initialSort = [{ id: 'liquidity', desc: true }];

type Props = {
  data: Pool[];
};

export const PoolTable = ({ data }: Props) => {
  const navigateToPoolInfo = useCallback(({ original }: TableRowType) => {
    navigateToPoolDetail(original.asset);
  }, []);

  const columns = usePoolColumns();

  return (
    <Box col center={!data.length}>
      {data.length ? (
        <Table
          sortable
          // @ts-expect-error TODO: Overall typing for `react-table` is broken on our side
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
