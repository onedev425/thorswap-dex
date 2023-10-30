import { Text } from '@chakra-ui/react';
import type { TableRowType } from 'components/Atomic';
import { Box, Button, Link, Select, Table } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { Input } from 'components/Input';
import type { ChangeEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getNodeDetailRoute } from 'settings/router';
import { useGetNodesQuery } from 'store/midgard/api';
import { useNodesColumns } from 'views/Nodes/hooks/useNodesColumns';

import { useApp } from '../../store/app/hooks';

import { NodeStats } from './NodeStats';
import { nodeStatusOptions } from './types';

const initialSort = [{ id: 'Bond', desc: true }];

const Nodes = () => {
  const navigate = useNavigate();
  const { nodeWatchList } = useApp();
  const [nodeStatusType, setNodeStatusType] = useState(0);
  const [keyword, setKeyword] = useState('');
  const { data, refetch, isLoading, isFetching } = useGetNodesQuery();

  const columns = useNodesColumns(refetch);
  const nodes = useMemo(() => data || [], [data]);

  const handleChangeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const watchListData = useMemo(
    () => nodes.filter((node) => nodeWatchList.includes(node.node_address)),
    [nodeWatchList, nodes],
  );

  const filteredNodes = useMemo(() => {
    // filter by status
    const nodeByStatus = nodes.filter((node) => node.status === nodeStatusOptions[nodeStatusType]);

    // filter by keyword
    if (keyword) {
      return nodeByStatus.filter((node) => {
        const nodeStatus = node.node_address.toLowerCase();
        return nodeStatus.includes(keyword.toLowerCase());
      });
    }

    return nodeByStatus;
  }, [nodes, keyword, nodeStatusType]);

  const onRowClick = useCallback(
    ({ original }: TableRowType) => {
      navigate(getNodeDetailRoute(original.node_address));
    },
    [navigate],
  );

  return (
    <Box col>
      <Helmet
        content={t('views.nodes.description')}
        keywords=" THORChain, Nodes, Overview, Management, DEFI, DEX"
        title={t('views.nodes.title')}
      />
      <NodeStats />
      {watchListData?.length > 0 && (
        <Box col className="mt-4 mb-4">
          <Text className="mb-2 text-light-typo-primary dark:text-dark-typo-primary">
            {`${t('views.nodes.watchList')} (${watchListData.length})`}
          </Text>
          <Table
            sortable
            // @ts-expect-error Overall typing for `react-table` is broken
            columns={columns}
            data={watchListData}
            initialSort={initialSort}
            loading={isLoading || isFetching}
            onRowClick={onRowClick}
          />
        </Box>
      )}
      <Box
        col
        align="start"
        className="md:my-8 gap-4 !my-4 flex-grow lg:flex-row lg:justify-between"
        justify="between"
      >
        <Box alignCenter justify="between">
          <div className="mx-2.5">
            <Input
              border="rounded"
              icon="search"
              onChange={handleChangeKeyword}
              placeholder="Search node address"
              value={keyword}
            />
          </div>
          <Link className="no-underline" to="/node-manager">
            <Button size="sm" variant="outlineSecondary">
              {t('common.manage')}
            </Button>
          </Link>
        </Box>

        <div className="flex mx-[10px]">
          <Select
            activeIndex={nodeStatusType}
            onChange={setNodeStatusType}
            options={nodeStatusOptions}
          />
        </div>
      </Box>
      <Table
        sortable
        // @ts-expect-error Overall typing for `react-table` is broken
        columns={columns}
        data={filteredNodes}
        initialSort={initialSort}
        loading={isLoading || isFetching}
        onRowClick={onRowClick}
      />
    </Box>
  );
};

export default Nodes;
