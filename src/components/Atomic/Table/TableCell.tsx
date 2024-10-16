import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { genericBgClasses } from "components/constants";
import type { Cell } from "react-table";

import type { TableData } from "./types";
import { columnAlignClasses } from "./types";

type Props = {
  cell: Cell<TableData, Todo>;
};

export const TableCell = (props: Props) => {
  const { cell } = props;

  return (
    <td
      className={classNames(
        "px-1.5 py-3.5 first:pl-4 last:pr-4 w-[100px] h-[60px] box-border first:rounded-l-box last:rounded-r-box",
        genericBgClasses.secondary,
      )}
      {...cell.getCellProps()}
    >
      <Text
        as="div"
        className={classNames(
          "text-caption md:text-body",
          columnAlignClasses[cell.column.align || "left"],
        )}
      >
        {cell.render("Cell") as string}
      </Text>
    </td>
  );
};
