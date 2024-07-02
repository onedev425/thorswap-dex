import classNames from "classnames";
import { Icon } from "components/Atomic/Icon";

type Props = {
  isActive: boolean;
};

export const CollapseChevron = ({ isActive }: Props) => {
  return (
    <Icon
      className={classNames("transform duration-300 ease relative", {
        "-rotate-180": isActive,
      })}
      color="secondary"
      name="chevronDown"
    />
  );
};
