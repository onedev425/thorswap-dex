import { useEffect, useState, useMemo, useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { THORNode } from '@thorswap-lib/midgard-sdk'
import { Amount } from '@thorswap-lib/multichain-sdk'

import {
  Box,
  Button,
  Icon,
  Link,
  Select,
  Table,
  TableColumnsConfig,
  Tooltip,
  Typography,
} from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { Input } from 'components/Input'

import { useMidgard } from 'redux/midgard/hooks'

import { t } from 'services/i18n'

import { truncateAddress } from 'helpers/string'

import { useApp } from '../../redux/app/hooks'
import { NodeStats } from './NodeStats'
import { nodeStatusOptions } from './types'

const Nodes = () => {
  const { getNodes, nodes } = useMidgard()
  const { setWatchList, nodeWatchList } = useApp()
  const [nodeStatusType, setNodeStatusType] = useState(0)
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getNodes()
  }, [getNodes])

  const handleChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
      (node) =>
        node.status === nodeStatusOptions[nodeStatusType] &&
        !nodeWatchList.includes(node.node_address),
    )

    // filter by keyword
    if (keyword) {
      return nodeByStatus.filter((node) => {
        const nodeStatus = node.node_address.toLowerCase()
        return nodeStatus.includes(keyword.toLowerCase())
      })
    }

    return nodeByStatus
  }, [nodes, keyword, nodeStatusType, nodeWatchList])

  const handleAddToWatchList = useCallback(
    (address: string) => {
      const isSelected = nodeWatchList.includes(address)
      if (!isSelected) {
        setWatchList([address, ...nodeWatchList])
      } else {
        const newList = nodeWatchList.filter((addr) => addr !== address)
        setWatchList(newList)
      }
    },
    [setWatchList, nodeWatchList],
  )
  const columns = useMemo(() => {
    return [
      {
        id: 'Bookmark',
        Header: () => (
          <Icon
            onClick={() => {
              getNodes()
            }}
            size={12}
            className="group-hover:text-dark-typo-primary"
            color="secondary"
            name={'refresh'}
          />
        ),
        align: 'center',
        disableSortBy: true,
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) => {
          const isSelected = nodeWatchList.includes(value.node_address)
          return (
            <Tooltip
              content={
                isSelected ? 'Remove from watch list' : 'Add to watch list'
              }
            >
              <Icon
                onClick={(e) => {
                  handleAddToWatchList(value.node_address)
                  e.stopPropagation()
                  e.preventDefault()
                }}
                size={16}
                className="group-hover:text-dark-typo-primary"
                color="secondary"
                name={isSelected ? 'heartFilled' : 'heart'}
              />
            </Tooltip>
          )
        },
      },
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
  }, [nodeWatchList, handleAddToWatchList, getNodes])

  const onRowClick = (index: number) => {
    navigate(`/nodes/${filteredNodes[index].node_address}`)
  }

  return (
    <Box col>
      <Helmet title="Node Manager" content="Node Manager" />

      <NodeStats />
      {watchListData?.length > 0 && (
        <Box marginTop={4} marginBottom={4} col>
          <Typography className="mb-2 text-dark-typo-primary">
            {`${t('views.nodes.watchList')} (${watchListData.length})`}
          </Typography>
          <Table data={watchListData} columns={columns} sortable />
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
      <Table
        data={filteredNodes}
        columns={columns}
        onRowClick={onRowClick}
        sortable
      />
    </Box>
  )
}

export default Nodes
