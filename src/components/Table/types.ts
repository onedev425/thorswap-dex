import { Cell, Column, HeaderGroup, Row } from 'react-table'

export type TableData = Record<string, FixMe>
export type TableColumns = Column<TableData>[]
export type TableRowType = Row<TableData>
export type TableCellType = Cell<TableData, FixMe>
export type TableHeaderGroupType = HeaderGroup<TableData>

export enum SortType {
  Asc = 'asc',
  Desc = 'desc',
  None = 'none',
}
