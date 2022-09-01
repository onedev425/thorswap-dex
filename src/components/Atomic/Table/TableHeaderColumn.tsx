import classNames from 'classnames';
import { Typography } from 'components/Atomic';

import { SortIndicator } from './SortIndicator';
import { columnAlignClasses, SortType, TableHeaderGroupType } from './types';

type Props = {
  column: TableHeaderGroupType;
};

export const TableHeaderColumn = (props: Props) => {
  const { column } = props;

  const getSortType = (): SortType => {
    if (!column.isSorted) {
      return SortType.None;
    }

    return column.isSortedDesc ? SortType.Desc : SortType.Asc;
  };

  return (
    <th
      className={classNames(
        'px-1.5 first:pl-4 last:pr-4 last:text-right',
        columnAlignClasses[column.align || 'left'],
      )}
      {...column.getHeaderProps(column.getSortByToggleProps())}
    >
      <Typography
        className={classNames('inline-flex items-center gap-1 transition', {
          'hover:text-light-typo-primary dark:hover:text-dark-typo-primary': column.canSort,
        })}
        color="secondary"
        variant="caption-xs"
      >
        {column.render('Header')}
        {column.canSort && <SortIndicator sortType={getSortType()} />}
      </Typography>
    </th>
  );
};
