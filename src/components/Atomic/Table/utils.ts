import { Row } from 'react-table'

import { Amount, Pool } from '@thorswap-lib/multichain-sdk'

import { TableData } from 'components/Atomic'

export const getAmountColumnSorter = (fieldName: string) => {
  return (rowA: Row<TableData>, rowB: Row<TableData>) =>
    sortAmounts(
      rowA.values[fieldName] as Amount,
      rowB.values[fieldName] as Amount,
    )
}

export const getNumberColumnSorter = (fieldName: string) => {
  return (rowA: Row<TableData>, rowB: Row<TableData>) =>
    sortValues(
      rowA.values[fieldName] as number,
      rowB.values[fieldName] as number,
    )
}

export const getStringColumnSorter = (fieldName: string) => {
  return (rowA: Row<TableData>, rowB: Row<TableData>) =>
    sortStrings(
      rowA.values[fieldName] as string,
      rowB.values[fieldName] as string,
    )
}

export const sortValues = (a: number, b: number) => {
  return a > b ? 1 : -1
}

export const sortStrings = (a: string, b: string) => {
  return `${a}`.localeCompare(`${b}`)
}

export const sortAmounts = (a: Amount, b: Amount) => {
  return a.gt(b) ? 1 : -1
}

export const sortPoolColumn = (rowA: Row<TableData>, rowB: Row<TableData>) => {
  const a: Pool = rowA.values.pool
  const b: Pool = rowB.values.pool

  return sortStrings(a.asset.ticker, b.asset.ticker)
}
