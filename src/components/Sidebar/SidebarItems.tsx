import { Box, Collapse, Flex, List, Text } from "@chakra-ui/react";
import { Icon } from "components/Atomic";
import { NavItem } from "components/Sidebar/NavItem";
import { SidebarWidgets } from "components/Sidebar/SidebarWidgets";
import type {
  SidebarItemProps,
  SidebarVariant,
  SidebarWidgetOption,
} from "components/Sidebar/types";
import { easeInOutTransition } from "components/constants";
import { Fragment, memo, useCallback } from "react";
import { useApp } from "store/app/hooks";

type Props = {
  options: SidebarItemProps[];
  variant: SidebarVariant;
  collapsed: boolean;
  hasBackground?: boolean;
  onItemClick?: () => void;
  verticallyCollapsible?: boolean;
  widgets?: SidebarWidgetOption[];
};

export const SidebarItems = memo(
  ({
    verticallyCollapsible,
    collapsed = false,
    hasBackground = false,
    onItemClick,
    options,
    variant,
    widgets,
  }: Props) => {
    const { collapsedSidebarGroups, setCollapsedSidebarGroups } = useApp();

    const parsedCollapsedSidebarGroups: string[] =
      typeof collapsedSidebarGroups === "string"
        ? JSON.parse(collapsedSidebarGroups)
        : collapsedSidebarGroups;

    const toggleGroup = useCallback(
      (groupLabel: string) => {
        if (verticallyCollapsible) {
          const updatedCollapsedSidebarGroups = () => {
            if (parsedCollapsedSidebarGroups.includes(groupLabel)) {
              const filteredGroups = parsedCollapsedSidebarGroups.filter(
                (label: string) => label !== groupLabel,
              );
              return filteredGroups.filter(Boolean);
            }
            return [...parsedCollapsedSidebarGroups, groupLabel].filter(Boolean);
          };
          setCollapsedSidebarGroups(updatedCollapsedSidebarGroups());
        }
      },
      [parsedCollapsedSidebarGroups, setCollapsedSidebarGroups, verticallyCollapsible],
    );

    const renderSidebarItem = useCallback(
      ({
        label,
        navLabel,
        children,
        hasBackground: background,
        href,
        widgets,
        ...rest
      }: SidebarItemProps) => {
        if (!label) {
          return;
        }
        const isGroupCollapsed = parsedCollapsedSidebarGroups.includes(label);

        return (
          <Fragment key={label}>
            {(children || variant === "primary") && (
              <Flex
                cursor="pointer"
                justify="space-between"
                maxH={collapsed ? 0 : "20px"}
                mb={isGroupCollapsed ? 4 : 0}
                onClick={() => toggleGroup(label)}
                overflow="hidden"
                pr={2}
                transform={collapsed ? "scale(0)" : "scale(1)"}
                transition={easeInOutTransition}
                w="full"
              >
                <Text
                  fontWeight="semibold"
                  mb={children ? 1 : 0}
                  ml={2}
                  textStyle="caption-xs"
                  textTransform="uppercase"
                  variant="secondary"
                >
                  {label}
                </Text>
                {!background && (
                  <Flex
                    align="center"
                    transform={isGroupCollapsed ? "rotate(0)" : "rotate(180deg)"}
                    transition={easeInOutTransition}
                  >
                    <Icon color="secondary" name="chevronDown" size={14} />
                  </Flex>
                )}
              </Flex>
            )}
            {children && (
              <Collapse in={!isGroupCollapsed}>
                <SidebarItems
                  collapsed={collapsed}
                  hasBackground={background || hasBackground}
                  onItemClick={onItemClick}
                  options={children}
                  variant="secondary"
                  widgets={widgets}
                />
              </Collapse>
            )}

            {!children && (
              <NavItem
                {...rest}
                collapsed={collapsed}
                href={href}
                key={label}
                label={navLabel || label}
                onItemClickCb={onItemClick}
                sx={{ mb: variant === "primary" ? 4 : 1, _last: { mb: 0 } }}
                variant={variant}
              />
            )}
          </Fragment>
        );
      },
      [collapsed, hasBackground, onItemClick, parsedCollapsedSidebarGroups, toggleGroup, variant],
    );

    return (
      <Box mx={1}>
        <List
          bgColor={
            variant === "secondary" && hasBackground ? "brand.alpha.bgBtnSecondary" : undefined
          }
          borderRadius="2xl"
          display="flex"
          flexDirection="column"
          key={variant}
          listStyleType="none"
          mb={variant === "secondary" ? 5 : 0}
          p={0}
          w="full"
        >
          {options.map(renderSidebarItem)}

          <SidebarWidgets collapsed={collapsed} widgets={widgets} />
        </List>
      </Box>
    );
  },
);
