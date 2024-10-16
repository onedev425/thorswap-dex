import type { IconName } from "components/Atomic";
import type { ReactNode } from "react";

export type CollapseProps = {
  title: string | ReactNode;
  children?: ReactNode;
  shadow?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  defaultExpanded?: boolean;
};

export type CollapseTitleProps = {
  iconName: IconName;
  title: string;
  subTitle: string;
};
