import type { IconName } from "components/Atomic";
import type { ColorType } from "types/app";

export type StatsType = {
  color: ColorType;
  tooltip?: string;
  iconName: IconName;
  label: string;
  value: string;
};

export type StatsListProps = {
  list: StatsType[];
  scrollable?: boolean;
  itemWidth?: number;
};

export const statsBgClasses: Record<ColorType, string> = {
  primary: "hover:bg-btn-primary dark:hover:bg-btn-primary",
  secondary: "hover:bg-light-btn-secondary dark:bg-dark-btn-secondary",
  purple: "hover:bg-purple dark:hover:bg-purple",
  yellow: "hover:bg-yellow hover:dark:bg-yellow",
  pink: "hover:bg-pink hover:dark:bg-pink",
  blue: "hover:bg-blue hover:dark:bg-blue",
  blueLight: "hover:bg-blue-light hover:dark:bg-blue-light",
  greenLight: "hover:bg-green-light hover:dark:bg-green-light",
  green: "hover:bg-green hover:dark:bg-green",
  orange: "hover:bg-orange hover:dark:bg-orange",
  cyan: "hover:bg-cyan hover:dark:bg-cyan",
  gray: "hover:bg-gray hover:dark:bg-gray",
  red: "hover:bg-red hover:dark:bg-red",
};
