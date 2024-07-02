import type { AssetValue } from "@swapkit/sdk";
import type { TableData } from "components/Atomic";
import type { Row } from "react-table";

export const getAmountColumnSorter = (fieldName: string) => {
  return (rowA: Row<TableData>, rowB: Row<TableData>) =>
    sortAmounts(rowA.values[fieldName] as AssetValue, rowB.values[fieldName] as AssetValue);
};

export const getNumberColumnSorter = (fieldName: string) => {
  return (rowA: Row<TableData>, rowB: Row<TableData>) =>
    sortValues(rowA.values[fieldName] as number, rowB.values[fieldName] as number);
};

export const getStringColumnSorter = (fieldName: string) => {
  return (rowA: Row<TableData>, rowB: Row<TableData>) =>
    sortStrings(rowA.values[fieldName] as string, rowB.values[fieldName] as string);
};

export const sortValues = (a: number, b: number) => {
  return a > b ? 1 : -1;
};

export const sortStrings = (a: string, b: string) => {
  return `${a}`.localeCompare(`${b}`);
};

export const sortAmounts = (a: AssetValue | string, b: AssetValue | string) => {
  if (typeof a === "string" || typeof b === "string") {
    const aValue = Number.parseFloat((a as string).replaceAll(" ", "").replace("%", ""));
    const bValue = Number.parseFloat((b as string).replaceAll(" ", "").replace("%", ""));
    return bValue - aValue;
  }
  return a.gt(b) ? 1 : -1;
};

export const sortPoolColumn = (rowA: Row<TableData>, rowB: Row<TableData>) => {
  return sortStrings(rowA.values.pool.asset.ticker, rowB.values.pool.asset.ticker);
};
