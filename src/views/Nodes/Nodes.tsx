import { Box, Button, Link, Select, Table, TableRowType, Typography } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { Input } from 'components/Input';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getNodeDetailRoute } from 'settings/constants';
import { useMidgard } from 'store/midgard/hooks';
import { useNodesColumns } from 'views/Nodes/hooks/useNodesColumns';

import { useApp } from '../../store/app/hooks';

import { NodeStats } from './NodeStats';
import { nodeStatusOptions } from './types';

const initialSort = [{ id: 'Bond', desc: true }];

const Nodes = () => {
  const { getNodes, nodes, nodeLoading } = useMidgard();
  const { nodeWatchList } = useApp();
  const [nodeStatusType, setNodeStatusType] = useState(0);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const columns = useNodesColumns();

  useEffect(() => {
    getNodes();
  }, [getNodes]);

  const handleChangeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const watchListData = useMemo(
    () => nodes.filter((node) => nodeWatchList.includes(node.node_address)),
    [nodes, nodeWatchList],
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
      <Helmet content="Node Manager" title="Node Manager" />
      <NodeStats />
      {watchListData?.length > 0 && (
        <Box col className="mt-4 mb-4">
          <Typography className="mb-2 text-light-typo-primary dark:text-dark-typo-primary">
            {`${t('views.nodes.watchList')} (${watchListData.length})`}
          </Typography>
          <Table
            sortable
            // @ts-expect-error TODO: Overall typing for `react-table` is broken on our side
            columns={columns}
            data={watchListData}
            initialSort={initialSort}
            loading={nodeLoading}
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
            <Button size="sm" type="outline" variant="secondary">
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
        // @ts-expect-error TODO: Overall typing for `react-table` is broken on our side
        columns={columns}
        data={filteredNodes}
        initialSort={initialSort}
        loading={nodeLoading}
        onRowClick={onRowClick}
      />
    </Box>
  );
};

export default Nodes;
