import { useEffect, useState, useMemo, useCallback, ChangeEvent } from 'react'

import { useNavigate } from 'react-router-dom'

import { useNodesColumns } from 'views/Nodes/hooks/useNodesColumns'

import {
  Box,
  Button,
  Link,
  Select,
  Table,
  TableRowType,
  Typography,
} from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { Input } from 'components/Input'

import { useMidgard } from 'store/midgard/hooks'

import { t } from 'services/i18n'

import { getNodeDetailRoute } from 'settings/constants'

import { useApp } from '../../store/app/hooks'
import { NodeStats } from './NodeStats'
import { nodeStatusOptions } from './types'

const Nodes = () => {
  const { getNodes, nodes, nodeLoading } = useMidgard()
  const { nodeWatchList } = useApp()
  const [nodeStatusType, setNodeStatusType] = useState(0)
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()
  const columns = useNodesColumns()

  useEffect(() => {
    getNodes()
  }, [getNodes])

  const handleChangeKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
    },
    [],
  )

  const watchListData = useMemo(() => {
    return nodes.filter((node) => nodeWatchList.includes(node.node_address))
  }, [nodes, nodeWatchList])

  const filteredNodes = useMemo(() => {
    // filter by status
    const nodeByStatus = nodes.filter(
      (node) => node.status === nodeStatusOptions[nodeStatusType],
    )

    // filter by keyword
    if (keyword) {
      return nodeByStatus.filter((node) => {
        const nodeStatus = node.node_address.toLowerCase()
        return nodeStatus.includes(keyword.toLowerCase())
      })
    }

    return nodeByStatus
  }, [nodes, keyword, nodeStatusType])

  const onRowClick = ({ original }: TableRowType) => {
    navigate(getNodeDetailRoute(original.node_address))
  }

  return (
    <Box col>
      <Helmet title="Node Manager" content="Node Manager" />
      <NodeStats />
      {watchListData?.length > 0 && (
        <Box marginTop={4} marginBottom={4} col>
          <Typography className="mb-2 text-light-typo-primary dark:text-dark-typo-primary">
            {`${t('views.nodes.watchList')} (${watchListData.length})`}
          </Typography>
          <Table
            // @ts-expect-error TODO: Overall typing for `react-table` is broken on our side
            columns={columns}
            data={watchListData}
            loading={nodeLoading}
            onRowClick={onRowClick}
            sortable
          />
        </Box>
      )}
      <Box
        className="md:my-8 gap-4 !my-4 flex-grow lg:flex-row lg:justify-between"
        justify="between"
        align="start"
        col
      >
        <Box alignCenter justify="between">
          <div className="mx-2.5">
            <Input
              border="rounded"
              icon="search"
              placeholder="Search node address"
              value={keyword}
              onChange={handleChangeKeyword}
            />
          </div>
          <Link className="no-underline" to="/node-manager">
            <Button size="sm" variant="secondary" type="outline">
              {t('common.manage')}
            </Button>
          </Link>
        </Box>

        <div className="flex mx-[10px]">
          <Select
            options={nodeStatusOptions}
            activeIndex={nodeStatusType}
            onChange={setNodeStatusType}
          />
        </div>
      </Box>
      <Table
        // @ts-expect-error TODO: Overall typing for `react-table` is broken on our side
        columns={columns}
        data={filteredNodes}
        loading={nodeLoading}
        onRowClick={onRowClick}
        sortable
      />
    </Box>
  )
}

export default Nodes
