import type { PlacementWithLogical } from "@chakra-ui/react";
import { Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Icon, Tooltip } from "components/Atomic";
import { baseHoverClass, genericBgClasses } from "components/constants";
import type { ReactNode } from "react";
import { useState } from "react";

import type { DropdownMenuItem, DropdownOptions } from "./types";

type DropdownMenuProps = {
  buttonClassName?: string;
  className?: string;
  menuClassName?: string;
  menuItems: DropdownMenuItem[];
  openComponent?: ReactNode;
  openLabel?: string;
  stretch?: boolean;
  shadow?: boolean;
  hideIcon?: boolean;
  placement?: PlacementWithLogical;
  tooltipContent?: string;
} & DropdownOptions;

export const DropdownMenu = ({
  buttonClassName,
  className,
  disabled,
  menuClassName,
  menuItems,
  onChange,
  openComponent,
  openLabel,
  value,
  stretch,
  hideIcon,
  placement = "bottom-start",
  shadow = true,
  tooltipContent,
}: DropdownMenuProps) => {
  const defaultOpenLabel = menuItems.find((i) => i.value === value)?.label || "-";
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Menu placement={placement}>
      {({ isOpen }) => (
        <div className={classNames(className, "z-20 w-full flex relative ")}>
          <Tooltip content={tooltipContent} isOpen={tooltipOpen}>
            <MenuButton
              as="div"
              className={classNames(
                genericBgClasses.secondary,
                baseHoverClass,
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                "h-10  flex dir justify-between rounded-2xl items-center px-3 !py-0 transition-all",
                { "shadow-xl": shadow, "flex flex-1 self-stretch": stretch },
                buttonClassName,
              )}
              disabled={disabled}
              onClick={() => setTooltipOpen(false)}
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
            >
              <div className="flex justify-between items-center">
                {openComponent || <Text>{openLabel || defaultOpenLabel}</Text>}
                {!hideIcon && (
                  <Icon
                    className={classNames(
                      "w-5 h-5 ml-2 -mr-1 transition-all duration-300 ease-in-out",
                      {
                        "rotate-180": isOpen,
                      },
                    )}
                    color="secondary"
                    name="chevronDown"
                    size={12}
                  />
                )}
              </div>
            </MenuButton>
          </Tooltip>

          <MenuList
            borderRadius={16}
            className={classNames(
              "overflow-hidden focus:outline-none shadow-2xl min-w-full mt-[-4px]",
              "border border-solid border-light-border-primary dark:border-dark-border-primary",
              genericBgClasses.primary,
              menuClassName,
            )}
            p={0}
            rootProps={{ className: "z-50 w-full" }}
          >
            {menuItems.map(({ value, Component, className, disabled, label }, index) => (
              <MenuItem
                as="div"
                bg="none"
                className={className}
                disabled={disabled}
                key={`${value}-${label || index}`}
                onClick={() => onChange(value)}
                p={0}
                value={value}
              >
                <div
                  className={classNames(
                    "p-2",
                    {
                      "hover:bg-light-gray-light dark:hover:bg-dark-bg-secondary w-full": !disabled,
                      "opacity-80": disabled,
                    },
                    disabled ? "cursor-not-allowed" : "cursor-pointer",
                  )}
                >
                  {Component || <Text>{label}</Text>}
                </div>
              </MenuItem>
            ))}
          </MenuList>
        </div>
      )}
    </Menu>
  );
};
