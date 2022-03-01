import { useEffect, useState, useMemo, useCallback } from 'react'

import { THORNode } from '@thorswap-lib/midgard-sdk'
import { Amount } from '@thorswap-lib/multichain-sdk'

import {
  Box,
  Button,
  Link,
  Table,
  Select,
  TableColumnsConfig,
} from 'components/Atomic'
import { Input } from 'components/Input'

import { useMidgard } from 'redux/midgard/hooks'

import { t } from 'services/i18n'

import { truncateAddress } from 'helpers/string'

import { NodeStats } from './NodeStats'
import { nodeStatusOptions } from './types'

const Nodes = () => {
  const { getNodes, nodes } = useMidgard()

  const [nodeStatusType, setNodeStatusType] = useState(0)

  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    getNodes()
  }, [getNodes])

  const handleChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
    },
    [],
  )

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

  const columns = useMemo(() => {
    return [
      {
        id: 'Address',
        Header: 'Address',
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) =>
          truncateAddress(value.node_address),
      },
      {
        id: 'Version',
        Header: 'Version',
        accessor: 'version',
      },
      {
        id: 'IP',
        Header: 'IP',
        accessor: 'ip_address',
      },
      {
        id: 'Rewards',
        Header: 'Rewards',
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) =>
          Amount.fromMidgard(value.current_award).toFixed(0),
      },
      {
        id: 'Slash',
        Header: 'Slash',
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) =>
          Amount.fromNormalAmount(value.slash_points).toFixed(0),
      },
      {
        id: 'Bond',
        Header: 'Bond',
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) =>
          Amount.fromMidgard(value.bond).toFixed(0),
      },
      {
        id: 'ActiveBlock',
        Header: 'Active Block',
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) =>
          Amount.fromNormalAmount(value.active_block_height).toFixed(0),
      },
    ] as TableColumnsConfig
  }, [])

  return (
    <Box col>
      <NodeStats />
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
            <Button size="sm" variant="tint" type="outline">
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
      <Table data={filteredNodes} columns={columns} sortable />
    </Box>
  )
}

export default Nodes
