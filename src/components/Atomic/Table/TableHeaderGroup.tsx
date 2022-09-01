import { TableHeaderColumn } from './TableHeaderColumn';
import { TableHeaderGroupType } from './types';

type Props = {
  headerGroup: TableHeaderGroupType;
};

export const TableHeaderGroup = (props: Props) => {
  const { headerGroup } = props;

  return (
    <tr className="text-left" {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((column: TableHeaderGroupType) => (
        <TableHeaderColumn column={column} key={column.getHeaderProps().key} />
      ))}
    </tr>
  );
};
