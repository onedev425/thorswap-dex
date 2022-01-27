import classNames from 'classnames'

import { Typography } from '../Typography'
import { SortIndicator } from './SortIndicator'
import { SortType, TableHeaderGroupType } from './types'

type Props = {
  column: TableHeaderGroupType
}

export const TableHeaderColumn = (props: Props) => {
  const { column } = props

  const getSortType = (): SortType => {
    if (!column.isSorted) {
      return SortType.None
    }

    return column.isSortedDesc ? SortType.Desc : SortType.Asc
  }

  return (
    <th
      className="px-1.5 first:pl-4 last:pr-4 last:text-right"
      {...column.getHeaderProps(column.getSortByToggleProps())}
    >
      <Typography
        variant="caption"
        color="secondary"
        className={classNames('inline-flex items-center gap-1 transition', {
          'hover:text-light-typo-primary dark:hover:text-dark-typo-primary':
            column.canSort,
        })}
      >
        {column.render('Header')}
        {column.canSort && <SortIndicator sortType={getSortType()} />}
      </Typography>
    </th>
  )
}
