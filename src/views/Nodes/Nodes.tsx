import { useEffect, useState, useMemo, useCallback, ChangeEvent } from 'react'

import { useNavigate } from 'react-router-dom'

import { THORNode } from '@thorswap-lib/midgard-sdk'
import { Amount } from '@thorswap-lib/multichain-sdk'
import copy from 'copy-to-clipboard'

import {
  Box,
  Button,
  Icon,
  Link,
  Select,
  Table,
  TableRowType,
  Tooltip,
  Typography,
} from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { HoverIcon } from 'components/HoverIcon'
import { Input } from 'components/Input'

import { useMidgard } from 'store/midgard/hooks'

import { t } from 'services/i18n'

import { shortenAddress } from 'helpers/shortenAddress'

import { getNodeDetailRoute } from 'settings/constants'

import { BreakPoint } from '../../hooks/useWindowSize'
import { useApp } from '../../store/app/hooks'
import { NodeStats } from './NodeStats'
import { nodeStatusOptions } from './types'

const Nodes = () => {
  const { getNodes, nodes, nodeLoading } = useMidgard()
  const { setWatchList, nodeWatchList } = useApp()
  const [nodeStatusType, setNodeStatusType] = useState(0)
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

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
  const columns = useMemo(
    () => [
      {
        id: 'Bookmark',
        Header: () => (
          <HoverIcon
            onClick={getNodes}
            size={12}
            className="group-hover:text-dark-typo-primary"
            color="secondary"
            iconName="refresh"
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
                isSelected
                  ? t('views.nodes.removeFromList')
                  : t('views.nodes.addToWatch')
              }
            >
              <HoverIcon
                onClick={(e) => {
                  handleAddToWatchList(value.node_address)
                  e.stopPropagation()
                  e.preventDefault()
                }}
                size={16}
                color={isSelected ? 'pink' : 'secondary'}
                iconName={isSelected ? 'heartFilled' : 'heart'}
                iconHoverHighlight={false}
              />
            </Tooltip>
          )
        },
      },
      {
        id: 'Address',
        Header: () => 'Address',
        align: 'center',
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) => (
          <Button
            className="!px-2 justify-items-start"
            type="borderless"
            variant="tint"
            endIcon={<Icon size={16} name="copy" />}
            tooltip={t('common.copy')}
            onClick={(e) => {
              copy(value.node_address)
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {shortenAddress(value.node_address, 6, 4)}
          </Button>
        ),
      },
      {
        id: 'Version',
        Header: () => 'Version',
        accessor: 'version',
      },
      {
        id: 'IP',
        Header: () => 'IP',
        accessor: 'ip_address',
        minScreenSize: BreakPoint.md,
      },
      {
        id: 'Rewards',
        Header: () => 'Rewards',
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) =>
          Amount.fromMidgard(value.current_award).toFixed(0),
        minScreenSize: BreakPoint.md,
      },
      {
        id: 'Slash',
        Header: () => 'Slash',
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) =>
          Amount.fromNormalAmount(value.slash_points).toFixed(0),
        minScreenSize: BreakPoint.md,
      },
      {
        id: 'Bond',
        Header: (() => 'Bond') as () => string,
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) =>
          Amount.fromMidgard(value.bond).toFixed(0),
      },
      {
        id: 'ActiveBlock',
        Header: () => 'Active Block',
        accessor: (row: THORNode) => row,
        Cell: ({ cell: { value } }: { cell: { value: THORNode } }) =>
          Amount.fromNormalAmount(value.active_block_height).toFixed(0),
        minScreenSize: BreakPoint.md,
      },
    ],
    [nodeWatchList, handleAddToWatchList, getNodes],
  )

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
