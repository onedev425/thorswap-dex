import { Box, Flex, List, Text } from "@chakra-ui/react";
import LogoTsDark from "assets/images/header_logo_black.png";
import LogoTsWhite from "assets/images/header_logo_white.png";
import Logo from "assets/images/logo.png";
import { AssetIcon } from "components/AssetIcon";
import { Icon, Tooltip } from "components/Atomic";
import { SupportModal } from "components/Modals/Support/Support";
import { Scrollbar } from "components/Scrollbar";
import { NavItem } from "components/Sidebar/NavItem";
import { useSidebarOptions } from "components/Sidebar/hooks";
import { easeInOutTransition } from "components/constants";
import { RUNEAsset, THORAsset } from "helpers/assets";
import { parseAssetToToken } from "helpers/parseHelpers";
import { useTokenPrices } from "hooks/useTokenPrices";
import useWindowSize from "hooks/useWindowSize";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "services/i18n";
import { ROUTES } from "settings/router";

import { SidebarItems } from "./SidebarItems";
import type { SidebarProps } from "./types";

const noScrollHeight = 238;
const toggleHeight = 50;
const stickyMenuHeight = 100;
const SIDEBAR_ASSETS = [RUNEAsset, THORAsset];

export const Sidebar = ({ sx, collapsed = false, toggle, onNavItemClick }: SidebarProps) => {
  const { sidebarOptions, stickyMenu } = useSidebarOptions();
  const { isMdActive } = useWindowSize();
  const navigate = useNavigate();

  const [isSupportModalOpened, setIsSupportModalOpened] = useState(false);
  const scrollbarHeight = `calc(100vh - ${
    toggle ? noScrollHeight + toggleHeight : noScrollHeight
  }px)`;
  const mobileScrollbarHeight = `calc(98% - ${stickyMenuHeight}px)`;

  const { data, isLoading } = useTokenPrices(SIDEBAR_ASSETS, { pollingInterval: 300000 });

  const [runePrice, thorPrice] = useMemo(
    () => [
      data[parseAssetToToken(RUNEAsset).identifier as string]?.price_usd,
      data[parseAssetToToken(THORAsset).identifier as string]?.price_usd,
    ],
    [data],
  );

  return (
    <Flex
      _dark={{
        bgColor: "brand.bgDarkNavyGray",
        border: "none",
      }}
      align="center"
      bgColor="white"
      border="1px solid"
      borderColor="borderPrimary"
      borderRadius={24}
      boxShadow="md"
      boxSizing="border-box"
      direction="column"
      h="calc(100vh - 18px)"
      ml={2}
      my={2}
      position="sticky"
      sx={sx}
      top={0}
      transition={easeInOutTransition}
      width={collapsed ? "72px" : "180px"}
    >
      <Box
        cursor="pointer"
        h="48px"
        mb={2}
        minW="48px"
        mt={4}
        onClick={() => navigate(ROUTES.Swap)}
        px={5}
      >
        <img alt="Logo" className="dark:hidden" src={collapsed ? Logo : LogoTsDark} />
        <img alt="Logo" className="hidden dark:block" src={collapsed ? Logo : LogoTsWhite} />{" "}
      </Box>
      <Box h="calc(100vh - 182px)" w="full">
        <SidebarItems
          collapsed={collapsed}
          onItemClick={onNavItemClick}
          options={[stickyMenu]}
          variant="primary"
        />
        <Scrollbar height={isMdActive ? scrollbarHeight : mobileScrollbarHeight}>
          <SidebarItems
            verticallyCollapsible
            collapsed={collapsed}
            onItemClick={onNavItemClick}
            options={sidebarOptions}
            variant="primary"
          />
        </Scrollbar>
      </Box>
      <List
        borderRadius="2xl"
        display="flex"
        flexDirection="column"
        listStyleType="none"
        my={1}
        p={0}
        w="full"
      >
        <NavItem
          collapsed={collapsed}
          href="/"
          iconName="infoCircle"
          label={t("common.support")}
          onClick={(e) => {
            e.preventDefault();
            setIsSupportModalOpened(true);
          }}
          onItemClickCb={onNavItemClick}
          sx={{ mx: 1 }}
        />
      </List>

      <Box
        _hover={{ bg: "bgLightGrayLight", _dark: { bg: "borderPrimary" } }}
        bg="bgSecondary"
        borderRadius="md"
        bottom="38px"
        cursor="pointer"
        display={{ base: "none", md: "flex" }}
        onClick={toggle}
        position="absolute"
        right="-11px"
        zIndex={10}
      >
        <Tooltip
          content={collapsed ? t("components.sidebar.expand") : t("components.sidebar.collapse")}
        >
          <Flex align="center" justify="center" transform={collapsed ? "none" : "scaleX(-1)"}>
            <Icon name="chevronRight" size={18} />
          </Flex>
        </Tooltip>
      </Box>
      <SupportModal isOpen={isSupportModalOpened} onCancel={() => setIsSupportModalOpened(false)} />
    </Flex>
  );
};
