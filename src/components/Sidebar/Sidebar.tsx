import { Box, Flex, List, Text } from '@chakra-ui/react';
import LogoTsDark from 'assets/images/header_logo_black.png';
import LogoTsWhite from 'assets/images/header_logo_white.png';
import Logo from 'assets/images/logo.png';
import { AssetIcon } from 'components/AssetIcon';
import { Icon, Tooltip } from 'components/Atomic';
import { easeInOutTransition } from 'components/constants';
import { SupportModal } from 'components/Modals/Support/Support';
import { Scrollbar } from 'components/Scrollbar';
import { useSidebarOptions } from 'components/Sidebar/hooks';
import { NavItem } from 'components/Sidebar/NavItem';
import { RUNEAsset } from 'helpers/assets';
import useWindowSize from 'hooks/useWindowSize';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/router';
import { useMidgard } from 'store/midgard/hooks';

import { SidebarItems } from './SidebarItems';
import { SidebarProps } from './types';

const noScrollHeight = 238;
const toggleHeight = 50;
const stickyMenuHeight = 100;

export const Sidebar = ({ sx, collapsed = false, toggle, onNavItemClick }: SidebarProps) => {
  const { sidebarOptions, stickyMenu } = useSidebarOptions();
  const { isMdActive } = useWindowSize();
  const { stats } = useMidgard();
  const navigate = useNavigate();

  const [isSupportModalOpened, setIsSupportModalOpened] = useState(false);
  const scrollbarHeight = `calc(100vh - ${
    toggle ? noScrollHeight + toggleHeight : noScrollHeight
  }px)`;
  const mobileScrollbarHeight = `calc(98% - ${stickyMenuHeight}px)`;

  const runeLabel = useMemo(
    () => (stats?.runePriceUSD ? `$${parseFloat(stats.runePriceUSD || '').toFixed(2)}` : '$ -'),
    [stats],
  );
  return (
    <Flex
      _dark={{
        bgColor: 'brand.bgDarkNavyGray',
        border: 'none',
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
      width={collapsed ? '72px' : '180px'}
    >
      <Box
        cursor="pointer"
        h="48px"
        mb={2}
        minW="48px"
        mt={4}
        onClick={() => navigate(ROUTES.Home)}
        px={5}
      >
        <img alt="Logo" className="dark:hidden" src={collapsed ? Logo : LogoTsDark} />
        <img alt="Logo" className="hidden dark:block" src={collapsed ? Logo : LogoTsWhite} />{' '}
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
            verticallyCollapsable
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
          label={t('common.support')}
          onClick={(e) => {
            e.preventDefault();
            setIsSupportModalOpened(true);
          }}
          onItemClickCb={onNavItemClick}
          sx={{ mx: 1 }}
        />
      </List>
      <Tooltip stretchHorizontally content="Rune Price">
        <Flex
          alignItems="center"
          borderTop="1px solid"
          borderTopColor="borderPrimary"
          gap={1}
          height="full"
          justifyContent="center"
          py={3.5}
        >
          <AssetIcon asset={RUNEAsset} size={16} />
          <Text
            fontWeight="semibold"
            textAlign="center"
            textStyle={isMdActive ? 'caption' : 'caption-xs'}
            transition={easeInOutTransition}
          >
            {runeLabel}
          </Text>
        </Flex>
      </Tooltip>

      <Box
        _hover={{ bg: 'bgLightGrayLight', _dark: { bg: 'borderPrimary' } }}
        bg="bgSecondary"
        borderRadius="md"
        bottom="38px"
        cursor="pointer"
        display={{ base: 'none', md: 'flex' }}
        onClick={toggle}
        position="absolute"
        right="-11px"
        zIndex={10}
      >
        <Tooltip
          content={collapsed ? t('components.sidebar.expand') : t('components.sidebar.collapse')}
        >
          <Flex align="center" justify="center" transform={!collapsed ? 'scaleX(-1)' : 'none'}>
            <Icon name="chevronRight" size={18} />
          </Flex>
        </Tooltip>
      </Box>
      <SupportModal isOpen={isSupportModalOpened} onCancel={() => setIsSupportModalOpened(false)} />
    </Flex>
  );
};
