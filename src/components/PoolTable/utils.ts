import { Row } from 'react-table'

import { Pool } from '@thorswap-lib/multichain-sdk'

import { TableData } from 'components/Atomic'
import { sortStrings } from 'components/Atomic/Table/utils'

export const sortPoolColumn = (rowA: Row<TableData>, rowB: Row<TableData>) => {
  const a: Pool = rowA.values.pool
  const b: Pool = rowB.values.pool

  return sortStrings(a.asset.ticker, b.asset.ticker)
}
