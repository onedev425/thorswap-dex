import { Box, Text } from '@chakra-ui/react';
import classNames from 'classnames';
import type { HeaderGroup } from 'react-table';

import { SortIndicator } from './SortIndicator';
import type { TableData } from './types';
import { columnAlignClasses, SortType } from './types';

type Props = {
  column: HeaderGroup<TableData>;
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
      <Box
        className={classNames('inline-flex items-center gap-1 transition', {
          'hover:text-light-typo-primary dark:hover:text-dark-typo-primary': column.canSort,
        })}
      >
        <Text
          className={classNames({
            'hover:text-light-typo-primary dark:hover:text-dark-typo-primary': column.canSort,
          })}
          textStyle="caption-xs"
          variant="secondary"
        >
          {column.render('Header') as string}
        </Text>
        {column.canSort && <SortIndicator sortType={getSortType()} />}
      </Box>
      {/* @ts-expect-error */}
      {column.toolTip && <div className="inline-flex">{column.toolTip}</div>}
    </th>
  );
};
