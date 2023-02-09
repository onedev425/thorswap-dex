import { Text } from '@chakra-ui/react';
import classNames from 'classnames';

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
      <Text
        className={classNames('inline-flex items-center gap-1 transition', {
          'hover:text-light-typo-primary dark:hover:text-dark-typo-primary': column.canSort,
        })}
        textStyle="caption-xs"
        variant="secondary"
      >
        {column.render('Header')}
        {column.canSort && <SortIndicator sortType={getSortType()} />}
      </Text>
    </th>
  );
};
