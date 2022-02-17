import classNames from 'classnames'

import { genericBgClasses } from 'components/constants'
import { Typography } from 'components/Typography'

import { TableCellType } from './types'

type Props = {
  cell: TableCellType
}

export const TableCell = (props: Props) => {
  const { cell } = props

  return (
    <td
      className={classNames(
        'px-1.5 py-3.5 first:pl-4 last:pr-4 w-[100px] h-[60px] box-border first:rounded-l-box last:rounded-r-box',
        genericBgClasses.secondary,
      )}
      {...cell.getCellProps()}
    >
      <Typography className="text-caption md:text-body">
        {cell.render('Cell')}
      </Typography>
    </td>
  )
}
