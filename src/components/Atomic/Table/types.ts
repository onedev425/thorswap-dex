import { Cell, Column, HeaderGroup, Row } from 'react-table'

import { BreakPoint } from 'hooks/useWindowSize'

export type TableData = Record<string, FixMe>
export type TableColumns = Column<TableData>[]
export type TableColumnsConfig = (Column<TableData> & {
  minScreenSize?: BreakPoint
})[]
export type TableRowType = Row<TableData>
export type TableCellType = Cell<TableData, FixMe>
export type TableHeaderGroupType = HeaderGroup<TableData>

export enum SortType {
  Asc = 'asc',
  Desc = 'desc',
  None = 'none',
}
