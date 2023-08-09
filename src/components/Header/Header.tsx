import { Box, Flex, Text } from '@chakra-ui/react';
import LogoTsDark from 'assets/images/header_logo_black.png';
import LogoTsWhite from 'assets/images/header_logo_white.png';
import Logo from 'assets/images/logo.png';
import { AnnouncementsPopover } from 'components/Announcements/AnnouncementsPopover/AnnouncementsPopover';
import { AppPopoverMenu } from 'components/AppPopoverMenu';
import { Button, Icon } from 'components/Atomic';
import { easeInOutTransition } from 'components/constants';
import PromoBannerSlider from 'components/Header/PromoBannerSlider';
import { StatusDropdown } from 'components/Header/StatusDropdown';
import { TransactionManager } from 'components/TransactionManager';
import { hasConnectedWallet } from 'helpers/wallet';
import { useWalletDrawer } from 'hooks/useWalletDrawer';
import useWindowSize from 'hooks/useWindowSize';
import { memo, useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE, IS_PROTECTED, TEST_ENVIRONMENT_NAME } from 'settings/config';
import { useApp } from 'store/app/hooks';
import { useWallet } from 'store/wallet/hooks';
import { ThemeType } from 'types/app';

type Props = {
  openMenu: () => void;
};

export const Header = memo(({ openMenu }: Props) => {
  const { themeType } = useApp();
  const { isWalletLoading, wallet, setIsConnectModalOpen } = useWallet();
  const { setIsDrawerVisible } = useWalletDrawer();
  const { isMdActive } = useWindowSize();

  const isConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

  const handleClickWalletBtn = useCallback(() => {
    if (!isConnected) {
      setIsConnectModalOpen(true);
    } else {
      setIsDrawerVisible(true);
    }
  }, [isConnected, setIsConnectModalOpen, setIsDrawerVisible]);

  return (
    <header className="mb-5 min-h-[70px]">
      {IS_PROTECTED && (
        <Box
          _dark={{ borderColor: 'brand.cyan', bgColor: 'transparent' }}
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
        {IS_LEDGER_LIVE ? (
          <>
            <Flex className={IS_LEDGER_LIVE && isMdActive ? 'flex' : 'hidden md:flex'} flex={1}>
              <StatusDropdown />
            </Flex>

            <Flex className={!isMdActive ? 'justify-start' : 'justify-center'} flex={1}>
              <div className="min-w-[48px] h-10 transition-colors cursor-pointer">
                <div className="rounded-full bg-cyan bg-opacity-30 absolute w-16 h-16 transition-all -translate-x-2 -translate-y-2 blur-[30px] dark:blur-md -z-10" />
                <img
                  alt="Logo"
                  className={'dark:hidden h-10' + (!isMdActive ? ' ml-4' : '')}
                  src={isMdActive ? LogoTsDark : Logo}
                />
                <img
                  alt="Logo"
                  className={'hidden dark:block h-10' + (!isMdActive ? ' ml-4' : '')}
                  src={isMdActive ? LogoTsWhite : Logo}
                />
              </div>
            </Flex>
          </>
        ) : (
          <>
            <Flex flex={1} gap={2} mr={2} mt="auto" shrink={0}>
              <Button
                className="flex !p-1"
                display={{ md: 'none' }}
                leftIcon={<Icon name="menu" size={isMdActive ? 24 : 20} />}
                onClick={openMenu}
                variant="borderlessPrimary"
              />

              <Box
                bottom={4}
                display={{ base: 'none', md: 'flex' }}
                position="fixed"
                right={4}
                zIndex={50}
              >
                <StatusDropdown />
              </Box>
            </Flex>

            <Flex flex={3} justify="center">
              <Box display={{ base: 'none', xl: 'flex' }} mx="auto" w="500px">
                <PromoBannerSlider />
              </Box>
            </Flex>
          </>
        )}

        <Flex flex={1} gap={1} justify="end">
          <Button
            mr={2}
            onClick={handleClickWalletBtn}
            size="sm"
            variant={themeType === ThemeType.Light ? 'primary' : 'outlinePrimary'}
          >
            {isWalletLoading ? (
              <Flex gap={1} justify="center">
                {t('common.loading')} <Icon spin color="primary" name="loader" size={20} />
              </Flex>
            ) : isConnected ? (
              t('common.wallet')
            ) : (
              t('common.connect')
            )}
          </Button>
          <AnnouncementsPopover />
          <AppPopoverMenu />

          <TransactionManager />
        </Flex>
      </Flex>

      <Box display={{ xl: 'none' }} pt={3}>
        <PromoBannerSlider />
      </Box>
    </header>
  );
});
