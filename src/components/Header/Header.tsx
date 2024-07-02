import { Box, Flex, Text } from "@chakra-ui/react";
import LogoTsDark from "assets/images/header_logo_black.png";
import LogoTsWhite from "assets/images/header_logo_white.png";
import Logo from "assets/images/logo.png";
import classNames from "classnames";
import { AnnouncementsPopover } from "components/Announcements/AnnouncementsPopover/AnnouncementsPopover";
import { AppPopoverMenu } from "components/AppPopoverMenu";
import { Button, Icon } from "components/Atomic";
import { StatusDropdown } from "components/Header/StatusDropdown";
import { TransactionManager } from "components/TransactionManager";
import { easeInOutTransition } from "components/constants";
import { useConnectWallet, useWallet, useWalletConnectModal } from "context/wallet/hooks";
import { isIframe } from "helpers/isIframe";
import { useWalletDrawer } from "hooks/useWalletDrawer";
import useWindowSize from "hooks/useWindowSize";
import { memo, useCallback } from "react";
import { t } from "services/i18n";
import { IS_LEDGER_LIVE, IS_PROTECTED, TEST_ENVIRONMENT_NAME } from "settings/config";
import { useApp } from "store/app/hooks";
import { useAppSelector } from "store/store";
import { ThemeType } from "types/app";

type Props = {
  openMenu: () => void;
};

const singlePageHeader = IS_LEDGER_LIVE || isIframe();

export const Header = memo(({ openMenu }: Props) => {
  const customLogoUrl = useAppSelector(({ app }) => app.iframeData?.logoUrl);
  const isWidget = useAppSelector(({ app }) => app.iframeData?.isWidget);
  const { themeType } = useApp();
  const { isWalletLoading, hasWallet } = useWallet();
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { connectLedgerLiveWallet } = useConnectWallet();
  const { setIsDrawerVisible } = useWalletDrawer();
  const { isMdActive } = useWindowSize();

  const handleClickWalletBtn = useCallback(() => {
    if (isWalletLoading) return;
    if (hasWallet) {
      setIsDrawerVisible(true);
    } else {
      IS_LEDGER_LIVE ? connectLedgerLiveWallet() : setIsConnectModalOpen(true);
    }
  }, [
    isWalletLoading,
    hasWallet,
    setIsConnectModalOpen,
    connectLedgerLiveWallet,
    setIsDrawerVisible,
  ]);

  return (
    <header className={classNames({ "min-h-[70px]": !isWidget })}>
      {IS_PROTECTED && (
        <Box
          _dark={{ borderColor: "brand.cyan", bgColor: "transparent" }}
          bg="white"
          border="1px solid"
          borderColor="transparent"
          borderRadius="2xl"
          bottom={16}
          boxShadow="md"
          p={2.5}
          position="absolute"
          right={4}
        >
          <Text fontWeight="semibold" textStyle="caption" transition={easeInOutTransition}>
            {TEST_ENVIRONMENT_NAME}
          </Text>
        </Box>
      )}

      <Flex flex={1} justify="between">
        {singlePageHeader ? (
          <>
            <Flex flex={1}>
              {customLogoUrl ? (
                <img alt="Logo" className="h-8 min-w-[48px] object-contain" src={customLogoUrl} />
              ) : (
                <div className="min-w-[48px] h-10 transition-colors cursor-pointer">
                  <div className="rounded-full bg-cyan bg-opacity-30 absolute w-16 h-16 transition-all -translate-x-2 -translate-y-2 blur-[30px] dark:blur-md -z-10" />
                  <img
                    alt="Logo"
                    className="dark:hidden h-10"
                    src={isMdActive ? LogoTsDark : Logo}
                  />
                  <img
                    alt="Logo"
                    className="hidden dark:block h-10"
                    src={isMdActive ? LogoTsWhite : Logo}
                  />
                </div>
              )}
            </Flex>
          </>
        ) : (
          <Flex flex={1} gap={2} mr={2} mt="auto" shrink={0}>
            <Button
              className="flex !p-1"
              display={{ md: "none" }}
              leftIcon={<Icon name="menu" size={isMdActive ? 24 : 20} />}
              onClick={openMenu}
              variant="borderlessPrimary"
            />

            {!isWidget && (
              <Box
                bottom={4}
                display={{ base: "none", md: "flex" }}
                position="fixed"
                right={4}
                zIndex={50}
              >
                <StatusDropdown />
              </Box>
            )}
          </Flex>
        )}

        <Flex flex={1} gap={1} justify="end">
          <Button
            mr={2}
            onClick={handleClickWalletBtn}
            size="sm"
            variant={themeType === ThemeType.Light ? "primary" : "outlinePrimary"}
          >
            {isWalletLoading ? (
              <Flex gap={1} justify="center">
                {t("common.loading")} <Icon spin color="primary" name="loader" size={20} />
              </Flex>
            ) : hasWallet ? (
              t("common.wallet")
            ) : (
              t("common.connect")
            )}
          </Button>
          {!isWidget && <AnnouncementsPopover />}
          {!(isIframe() || isWidget) && <AppPopoverMenu />}

          <TransactionManager />
        </Flex>
      </Flex>
    </header>
  );
});
