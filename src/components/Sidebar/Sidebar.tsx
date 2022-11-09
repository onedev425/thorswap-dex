import Logo from 'assets/images/logo.png';
import classNames from 'classnames';
import { Box, Icon, Tooltip, Typography } from 'components/Atomic';
import { SupportModal } from 'components/Modals/Support/Support';
import { Scrollbar } from 'components/Scrollbar';
import { useSidebarOptions } from 'components/Sidebar/hooks';
import { NavItem } from 'components/Sidebar/NavItem';
import useWindowSize from 'hooks/useWindowSize';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/router';

import { SidebarItems } from './SidebarItems';
import { SidebarProps } from './types';

const noScrollHeight = 225;
const toggleHeight = 50;

export const Sidebar = ({ className, collapsed = false, toggle, onNavItemClick }: SidebarProps) => {
  const sidebarOptions = useSidebarOptions();
  const { isMdActive } = useWindowSize();
  const navigate = useNavigate();
  const [isSupportModalOpened, setIsSupportModalOpened] = useState(false);

  const scrollbarHeight = `calc(100vh - ${
    toggle ? noScrollHeight + toggleHeight : noScrollHeight
  }px)`;

  return (
    <nav
      className={classNames(
        'flex flex-col items-center my-2 transition-all overflow-hidden ml-2',
        'rounded-3xl border-box sticky top-0 bg-white dark:bg-dark-bg-secondary md:dark:!bg-opacity-30',
        'h-sidebar shadow-md border-opacity-30 border border-solid border-light-typo-gray dark:border-none',
        collapsed ? 'w-[72px]' : 'w-[180px]',
        className,
      )}
    >
      <div
        className="my-8 min-w-[48px] h-12 transition-colors cursor-pointer"
        onClick={() => navigate(ROUTES.Home)}
      >
        <div
          className={classNames(
            'rounded-full bg-cyan bg-opacity-30 absolute w-16 h-16 transition-all -translate-x-2 -translate-y-2 blur-[30px] dark:blur-md -z-10',
            { '!blur-[40px]': collapsed },
          )}
        />
        <img alt="Logo" className="w-12 h-12" src={Logo} />
      </div>

      <div className="w-full h-sidebar-content">
        <Scrollbar height={isMdActive ? scrollbarHeight : '98%'}>
          <SidebarItems
            collapsed={collapsed}
            onItemClick={onNavItemClick}
            options={sidebarOptions}
            variant="primary"
          />
        </Scrollbar>
      </div>

      <ul className="flex flex-col w-full p-0 my-1 list-none rounded-2xl">
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

      {!!toggle && (
        <Box
          center
          className="p-2.5 cursor-pointer w-full border-0 border-t border-solid border-light-typo-gray dark:border-dark-typo-gray !border-opacity-30"
          onClick={toggle}
        >
          <Tooltip content={t('components.sidebar.expand')} disabled={!collapsed}>
            <div>
              <Icon className={classNames({ '-scale-x-100': collapsed })} name="collapse" />
            </div>

            <Box
              className={classNames(
                'overflow-hidden transition-all',
                collapsed ? 'w-[0%]' : 'w-full',
              )}
            >
              <Typography
                className={classNames('px-3 dark:group-hover:text-white font-bold opacity-60')}
                transform="uppercase"
                variant="caption-xs"
              >
                {t('components.sidebar.collapse')}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      )}

      <SupportModal isOpen={isSupportModalOpened} onCancel={() => setIsSupportModalOpened(false)} />
    </nav>
  );
};
