import classNames from "classnames";

import { TableCell } from "./TableCell";
import type { TableRowType } from "./types";

type Props = {
  row: TableRowType;
  hasShadow: boolean;
  onRowClick?: (row: TableRowType) => void;
};

export const TableRow = ({ row, hasShadow, onRowClick }: Props) => {
  return (
    <tr
      {...row.getRowProps()}
      className={classNames("hover:brightness-95 hover:dark:brightness-110", {
        "cursor-pointer": onRowClick,
        "drop-shadow-box": hasShadow,
      })}
      onClick={() => onRowClick?.(row)}
    >
      {row.cells.map((cell) => (
        <TableCell cell={cell} key={cell.getCellProps().key} />
      ))}
    </tr>
  );
};
