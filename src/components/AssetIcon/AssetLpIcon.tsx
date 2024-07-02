import classNames from "classnames";

import { AssetIcon } from "./AssetIcon";
import type { AssetLpIconProps } from "./types";
import { iconSizes } from "./types";

export const AssetLpIcon = ({
  asset1,
  asset2,
  inline,
  size = 40,
  hasShadow = false,
  ...styleProps
}: AssetLpIconProps) => {
  const iconSize = typeof size === "number" ? size : iconSizes[size];
  const pairIconOffset = iconSize * 0.45;

  return (
    <div className="flex">
      <div
        className={classNames("border-light-bg-primary dark:border-dark-bg-primary z-10", {
          "-translate-y-2": !inline,
        })}
      >
        <AssetIcon
          asset={asset1}
          className="rounded-full"
          hasChainIcon={false}
          size={size}
          {...styleProps}
        />
      </div>

      <div className="transition-all" style={{ marginLeft: -pairIconOffset }}>
        <AssetIcon
          asset={asset2}
          className={classNames("rounded-full", {
            "translate-y-2": !inline,
          })}
          hasChainIcon={false}
          hasShadow={hasShadow}
          shadowPosition="center"
          size={size}
          {...styleProps}
        />
      </div>
    </div>
  );
};
