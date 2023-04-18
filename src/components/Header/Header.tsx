import { Text } from '@chakra-ui/react';
import { AnnouncementsPopover } from 'components/Announcements/AnnouncementsPopover/AnnouncementsPopover';
import { AppPopoverMenu } from 'components/AppPopoverMenu';
import { Box, Button, Icon } from 'components/Atomic';
import PromoBannerSlider from 'components/Header/PromoBannerSlider';
import { StatusDropdown } from 'components/Header/StatusDropdown';
import { TransactionManager } from 'components/TransactionManager';
import { hasConnectedWallet } from 'helpers/wallet';
import { useWalletDrawer } from 'hooks/useWalletDrawer';
import useWindowSize from 'hooks/useWindowSize';
import { memo, useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import { IS_BETA, IS_DEV_API, IS_LOCAL, IS_PROD, IS_STAGENET } from 'settings/config';
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
  const { isMdActive, isXlActive } = useWindowSize();

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
      {!IS_PROD && (
        <Box className="bottom-4 p-2.5 !absolute bg-white border border-transparent border-solid shadow-md rounded-2xl dark:border-cyan dark:bg-transparent">
          <Text className="transition-[font-size]" fontWeight="semibold" textStyle="caption">
            {IS_BETA
              ? 'Beta'
              : IS_STAGENET
              ? 'Stagenet'
              : IS_DEV_API
              ? 'Dev Api'
              : IS_LOCAL
              ? 'Local'
              : 'Test deploy'}
          </Text>
        </Box>
      )}

      <Box flex={1} justify="between">
        <Box className="mt-auto shrink-0 gap-x-2 mr-2">
          <Button
            className="flex !p-1"
            display={{ md: 'none' }}
            leftIcon={<Icon name="menu" size={isMdActive ? 24 : 20} />}
            onClick={openMenu}
            variant="borderlessPrimary"
          />

          <Box className="hidden md:flex bottom-4 right-4 fixed z-50">
            <StatusDropdown />
          </Box>
        </Box>

        <Box flex={3}>
          <Box className="hidden xl:flex">
            <PromoBannerSlider />
          </Box>
        </Box>

        <Box className="gap-1" flex={1} justify="end">
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

      <Box className="pt-3 xl:hidden">
        <PromoBannerSlider />
      </Box>
    </header>
  );
});
