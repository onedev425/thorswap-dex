import { Row } from 'react-table'

import { Amount, Pool } from '@thorswap-lib/multichain-sdk'

import { TableData } from 'components/Atomic'

export const sortPoolColumn = (rowA: Row<TableData>, rowB: Row<TableData>) => {
  const a: Pool = rowA.values.pool
  const b: Pool = rowB.values.pool

  return sortValues(a.asset.ticker, b.asset.ticker)
}

export const sortPriceColumn = (rowA: Row<TableData>, rowB: Row<TableData>) => {
  return sortAmounts(rowA.values.price, rowB.values.price)
}

export const sortLiquidityColumn = (
  rowA: Row<TableData>,
  rowB: Row<TableData>,
) => {
  return sortAmounts(rowA.values.liquidity, rowB.values.liquidity)
}

export const sortVolume24Column = (
  rowA: Row<TableData>,
  rowB: Row<TableData>,
) => {
  return sortAmounts(rowA.values.volume24h, rowB.values.volume24h)
}

export const sortApyColumn = (rowA: Row<TableData>, rowB: Row<TableData>) => {
  return sortAmounts(rowA.values.apy, rowB.values.apy)
}

export const sortValues = (a: Inexpressible, b: Inexpressible) => {
  return a > b ? 1 : -1
}

export const sortAmounts = (a: Amount, b: Amount) => {
  return a.gt(b) ? 1 : -1
}
