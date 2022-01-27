import { Cell, Column, HeaderGroup, Row } from 'react-table'

import { FixmeType } from 'types/global'

export type TableData = Record<string, FixmeType>
export type TableColumns = Column<TableData>[]
export type TableRowType = Row<TableData>
export type TableCellType = Cell<TableData, FixmeType>
export type TableHeaderGroupType = HeaderGroup<TableData>

export enum SortType {
  Asc = 'asc',
  Desc = 'desc',
  None = 'none',
}
