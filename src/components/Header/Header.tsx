import { Text } from '@chakra-ui/react';
import LogoTsDark from 'assets/images/header_logo_black.png';
import LogoTsWhite from 'assets/images/header_logo_white.png';
import Logo from 'assets/images/logo.png';
import { AnnouncementsPopover } from 'components/Announcements/AnnouncementsPopover/AnnouncementsPopover';
import { HeaderAnnouncements } from 'components/Announcements/HeaderAnnouncements';
import { AppPopoverMenu } from 'components/AppPopoverMenu';
import { Box, Button, Icon } from 'components/Atomic';
import { easeInOutTransition } from 'components/constants';
import PromoBannerSlider from 'components/Header/PromoBannerSlider';
import { TransactionManager } from 'components/TransactionManager';
import { hasConnectedWallet } from 'helpers/wallet';
import { useWalletDrawer } from 'hooks/useWalletDrawer';
import useWindowSize from 'hooks/useWindowSize';
import { memo, useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE, IS_PROTECTED, TEST_ENVIRONMENT_NAME } from 'settings/config';
import { useApp } from 'store/app/hooks';
import { useMidgard } from 'store/midgard/hooks';
import { useWallet } from 'store/wallet/hooks';
import { ThemeType } from 'types/app';

import { StatusDropdown } from './StatusDropdown';

type Props = {
  openMenu: () => void;
};

export const Header = memo(({ openMenu }: Props) => {
  const { themeType } = useApp();
  const { isWalletLoading, wallet, setIsConnectModalOpen, connectLedgerLiveWallet } = useWallet();
  const { setIsDrawerVisible } = useWalletDrawer();
  const { stats } = useMidgard();
  const { isMdActive, isXlActive } = useWindowSize();

  const isConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

  const runeLabel = useMemo(
    () => (stats?.runePriceUSD ? `$${parseFloat(stats.runePriceUSD || '').toFixed(2)}` : '$ -'),
    [stats],
  );

  const handleClickWalletBtn = useCallback(() => {
    if (!isConnected) {
      IS_LEDGER_LIVE ? connectLedgerLiveWallet() : setIsConnectModalOpen(true);
    } else {
      setIsDrawerVisible(true);
    }
  }, [isConnected, setIsConnectModalOpen, setIsDrawerVisible, connectLedgerLiveWallet]);

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
      <Box flex={1} justify="between">
        {IS_LEDGER_LIVE && isMdActive && (
          <Box className="mb-auto shrink-0 gap-x-2 mr-2 flex-grow basis-0">
            {!IS_LEDGER_LIVE && (
              <>
                <Button
                  className="flex !p-1"
                  display={{ md: 'none' }}
                  leftIcon={<Icon name="menu" size={isMdActive ? 24 : 20} />}
                  onClick={openMenu}
                  variant="borderlessPrimary"
                />

                <Box
                  center
                  className={
                    (IS_LEDGER_LIVE ? 'flex ' : 'hidden md:flex ') +
                    'px-2 bg-white border border-transparent border-solid shadow-md rounded-2xl dark:border-cyan dark:bg-transparent'
                  }
                >
                  <Text
                    className="transition-[font-size]"
                    fontWeight="semibold"
                    textStyle={isMdActive ? 'caption' : 'caption-xs'}
                  >
                    1ᚱ = {runeLabel}
                  </Text>
                </Box>
              </>
            )}

            <Box className={IS_LEDGER_LIVE && isMdActive ? 'flex' : 'hidden md:flex'}>
              <StatusDropdown />
            </Box>
          </Box>
        )}

        <Box>
          {IS_LEDGER_LIVE ? (
            <>
              <Box className={!isMdActive ? 'justify-start' : 'justify-center'} flex={1}>
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
              </Box>
            </>
          ) : (
            <Box className="hidden xl:flex">
              <PromoBannerSlider />
            </Box>
          )}
        </Box>
        <Box className="flex flex-grow basis-0" justify="end">
          <Button
            className="mr-2"
            onClick={handleClickWalletBtn}
            size="sm"
            variant={themeType === ThemeType.Light ? 'primary' : 'outlinePrimary'}
          >
            {isWalletLoading ? (
              <Box center row className="gap-1">
                {t('common.loading')} <Icon spin color="primary" name="loader" size={20} />
              </Box>
            ) : isConnected ? (
              t('common.wallet')
            ) : (
              t('common.connect')
            )}
          </Button>
          <AnnouncementsPopover />
          <AppPopoverMenu />
          <TransactionManager />
        </Box>
      </Box>
      {!IS_LEDGER_LIVE &&
        (isXlActive ? (
          <HeaderAnnouncements />
        ) : (
          <Box className="pt-3 xl:hidden">
            <PromoBannerSlider />
          </Box>
        ))}
    </header>
  );
});
