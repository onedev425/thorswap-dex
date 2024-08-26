import type { Chain } from "@swapkit/sdk";

export type TabSelectType = {
  label: string | React.JSX.Element;
  value: string;
  tooltip?: string;
  disabled?: boolean;
  chain?: Chain;
};
