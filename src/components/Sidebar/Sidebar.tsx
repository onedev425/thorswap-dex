import { Text } from '@chakra-ui/react';
import LogoTs from 'assets/images/header_logo.png';
import Logo from 'assets/images/logo.png';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon, Tooltip } from 'components/Atomic';
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

export const Sidebar = ({ className, collapsed = false, toggle, onNavItemClick }: SidebarProps) => {
  const { sidebarOptions, stickyMenu } = useSidebarOptions();

  const { isMdActive } = useWindowSize();
  const { stats } = useMidgard();
  const navigate = useNavigate();
  const [isSupportModalOpened, setIsSupportModalOpened] = useState(false);

  const runeLabel = useMemo(
    () => (stats?.runePriceUSD ? `$${parseFloat(stats.runePriceUSD || '').toFixed(2)}` : '$ -'),
    [stats],
  );
  const scrollbarHeight = `calc(100vh - ${
    toggle ? noScrollHeight + toggleHeight : noScrollHeight
  }px)`;
  const mobileScrollbarHeight = `calc(98% - ${stickyMenuHeight}px)`;

  return (
    <nav
      className={classNames(
        'flex flex-col items-center my-2 transition-all ml-2',
        'rounded-3xl border-box sticky top-0 bg-white dark:bg-dark-bg-secondary md:dark:!bg-opacity-30',
        'h-sidebar shadow-md border-opacity-30 border border-solid border-light-typo-gray dark:border-none',
        collapsed ? 'w-[72px]' : 'w-[180px]',
        className,
      )}
    >
      <div
        className="mt-4 mb-2 min-w-[48px] h-12 transition-colors cursor-pointer px-5"
        onClick={() => navigate(ROUTES.Home)}
      >
        <img alt="Logo" src={collapsed ? Logo : LogoTs} />
      </div>

      <div className="w-full h-sidebar-content">
        <SidebarItems
          collapsed={collapsed}
          onItemClick={onNavItemClick}
          options={[stickyMenu]}
          variant="primary"
        />
        <Scrollbar height={isMdActive ? scrollbarHeight : mobileScrollbarHeight}>
          <SidebarItems
            collapsed={collapsed}
            onItemClick={onNavItemClick}
            options={sidebarOptions}
            variant="primary"
          />
        </Scrollbar>
      </div>

      <ul className="flex mr-2 flex-col w-full p-0 my-1 list-none rounded-2xl">
        <NavItem
          className={classNames('!mx-1')}
          collapsed={collapsed}
          href="/"
          iconName="infoCircle"
          label={t('common.support')}
          onClick={(e) => {
            e.preventDefault();
            setIsSupportModalOpened(true);
          }}
          onItemClickCb={onNavItemClick}
        />
      </ul>

      <Tooltip stretchHorizontally content="Rune Price">
        <Box
          center
          className="gap-1 h-full border-0 py-3.5 border-t border-solid border-light-typo-gray dark:border-dark-typo-gray !border-opacity-30"
        >
          <AssetIcon asset={RUNEAsset} size={16} />
          <Text
            className="transition-[font-size] text-center"
            fontWeight="semibold"
            textStyle={isMdActive ? 'caption' : 'caption-xs'}
          >
            {runeLabel}
          </Text>
        </Box>
      </Tooltip>

      <Box
        className="absolute hidden md:flex right-[-11px] rounded-md bottom-[37px] z-50 p-.5 bg-light-bg-primary hover:bg-light-gray-light dark:bg-dark-dark-gray cursor-pointer hover:dark:bg-dark-gray-light light:"
        onClick={toggle}
      >
        <Tooltip
          content={collapsed ? t('components.sidebar.expand') : t('components.sidebar.collapse')}
        >
          <Box center>
            <Icon
              className={classNames({ '-scale-x-100': !collapsed })}
              name="chevronRight"
              size={18}
            />
          </Box>
        </Tooltip>
      </Box>
      <SupportModal isOpen={isSupportModalOpened} onCancel={() => setIsSupportModalOpened(false)} />
    </nav>
  );
};
